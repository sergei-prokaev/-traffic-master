import {makeObservable, observable, action, runInAction, computed} from 'mobx';
import {ITrafficResponse, ITrafficService} from '../../../service';
import {brandMapper, brandFilter, makeColors, makeTypes} from './utils';
import {sortByTextAscending, sortByStringOrNumber} from '../../../utils';

type EntryPoint = 'type' | 'brand' | 'colors' | '';

export class TrafficStore {
  vehicles$: ITrafficResponse[] = [];
  isFetching$ = false;
  isRejected$ = false;
  entryPoint$: EntryPoint = '';

  selectedFilters$: {type: string; brand: string; colors: string} = {
    type: '',
    brand: '',
    colors: '',
  };

  private filterTypesByEntryPoint = (
    entryPoint: EntryPoint,
    selectedFilters: {
      type: string;
      brand: string;
      colors: string;
    },
    vehicles: ITrafficResponse[],
  ) => {
    const {brand, type, colors} = selectedFilters;
    const _vehicles = !brand && !colors ? vehicles : vehicles.filter((item) => item.colors.includes(colors));

    switch (entryPoint) {
      case 'type': {
        if (brand) {
          const foundBrand = vehicles.find((item) => item.brand === brand);
          return [foundBrand?.type ?? type];
        }
        return makeTypes(_vehicles, sortByStringOrNumber);
      }
      case 'brand': {
        if (!colors) {
          const foundBrand = vehicles.find((item) => item.brand === brand) as ITrafficResponse;
          return [foundBrand.type];
        }
        const filteredByColor = vehicles.filter((item) => item.colors.includes(colors) && item.brand === brand);
        return makeTypes(filteredByColor, sortByStringOrNumber);
      }
      case 'colors': {
        if (!brand) {
          const filteredByColor = vehicles.filter((item) => item.colors.includes(colors));
          return makeTypes(filteredByColor, sortByStringOrNumber);
        }
        const foundBrand = vehicles.find((item) => item.brand === brand);
        return [foundBrand?.type ?? ''];
      }
      default:
        return makeTypes(vehicles, sortByStringOrNumber);
    }
  };

  private filterBrandsByEntryPoint = (
    entryPoint: EntryPoint,
    selectedFilters: {
      type: string;
      brand: string;
      colors: string;
    },
    vehicles: ITrafficResponse[],
  ) => {
    const {type, colors} = selectedFilters;
    switch (entryPoint) {
      case 'type': {
        return vehicles
          .filter(brandFilter(colors, type))
          .map(brandMapper)
          .sort(sortByTextAscending((value) => value.brand));
      }
      case 'brand': {
        if (colors && !type) {
          return vehicles
            .filter(brandFilter(colors))
            .map(brandMapper)
            .sort(sortByTextAscending((value) => value.brand));
        }
        if (type && !colors) {
          return vehicles
            .filter(brandFilter(undefined, type))
            .map(brandMapper)
            .sort(sortByTextAscending((value) => value.brand));
        }
        if (colors && type) {
          return vehicles
            .filter(brandFilter(colors, type))
            .map(brandMapper)
            .sort(sortByTextAscending((value) => value.brand));
        }
        return vehicles.map(brandMapper).sort(sortByTextAscending((value) => value.brand));
      }

      case 'colors': {
        if (!type) {
          return this.vehicles$
            .filter((item) => item.colors.includes(colors))
            .map(brandMapper)
            .sort(sortByTextAscending((value) => value.brand));
        }
        return this.vehicles$
          .filter((item) => item.colors.includes(colors) && item.type === type)
          .map(brandMapper)
          .sort(sortByTextAscending((value) => value.brand));
      }

      default:
        return this.vehicles$.map(brandMapper).sort(sortByTextAscending((value) => value.brand));
    }
  };

  private filterColorsByEntryPoint = (
    entryPoint: EntryPoint,
    selectedFilters: {
      type: string;
      brand: string;
      colors: string;
    },
    vehicles: ITrafficResponse[],
  ) => {
    const {type, brand} = selectedFilters;

    switch (entryPoint) {
      case 'type': {
        const filteredVehicle = brand
          ? vehicles.filter((item) => item.brand === brand)
          : vehicles.filter((item) => item.type === type);

        return makeColors(filteredVehicle, sortByStringOrNumber);
      }

      case 'brand': {
        const filteredVehicle = vehicles.filter((item) => item.brand === brand);
        return makeColors(filteredVehicle, sortByStringOrNumber);
      }

      case 'colors': {
        const filteredVehicle = !brand ? vehicles : vehicles.filter((item) => item.brand === brand);
        return makeColors(filteredVehicle, sortByStringOrNumber);
      }

      default: {
        return makeColors(vehicles, sortByStringOrNumber);
      }
    }
  };

  get types() {
    return this.filterTypesByEntryPoint(this.entryPoint$, this.selectedFilters$, this.vehicles$);
  }

  get brands() {
    return this.filterBrandsByEntryPoint(this.entryPoint$, this.selectedFilters$, this.vehicles$);
  }

  get colors() {
    return this.filterColorsByEntryPoint(this.entryPoint$, this.selectedFilters$, this.vehicles$);
  }

  get currentSelectedVehicle() {
    const {brand, colors, type} = this.selectedFilters$;
    if (brand && colors && type) {
      const foundVehicle = this.vehicles$.find((item) => item.brand === brand);
      return foundVehicle as ITrafficResponse;
    }
    return null;
  }

  get hasEntryPoint() {
    return !!this.entryPoint$;
  }

  private fetchDataHandler = (err: string | null, res?: ITrafficResponse[]) => {
    runInAction(() => {
      if (err) {
        this.isFetching$ = false;
        this.vehicles$ = [];
        this.isRejected$ = true;
        return;
      }
      this.vehicles$ = res as ITrafficResponse[];
      this.isFetching$ = false;
      this.isRejected$ = false;
    });
  };

  fetchVehicles = () => {
    this.isFetching$ = true;
    this.trafficApi.fetchData(this.fetchDataHandler);
  };

  setEntryPoint(value: string) {
    if (typeof value !== 'string') {
      throw new Error(`setEntryPoint expects value to be a string, but got ${typeof value}`);
    }
    this.entryPoint$ = value as EntryPoint;
  }

  setSelectedFilters(value: string, key: string) {
    if (typeof value !== 'string' || typeof key !== 'string') {
      throw new Error(
        `setLastSelected expects params are string, but got (value): ${typeof value}, (key): ${typeof key}`,
      );
    }

    this.selectedFilters$[key as keyof typeof this.selectedFilters$] = value;
    // if (key === 'brand') {
    //   this.selectedFilters$.brand = value;
    // }
    // if (key === 'colors') {
    //   this.selectedFilters$.colors = value;
    // }
    // if (key === 'type') {
    //   this.selectedFilters$.type = value;
    // }
  }

  clearLastSelected() {
    this.selectedFilters$ = {
      type: '',
      brand: '',
      colors: '',
    };
  }

  constructor(private readonly trafficApi: ITrafficService) {
    makeObservable(this, {
      vehicles$: observable,
      isFetching$: observable,
      selectedFilters$: observable,
      isRejected$: observable,
      entryPoint$: observable,

      hasEntryPoint: computed,
      types: computed.struct,
      brands: computed.struct,
      colors: computed.struct,
      currentSelectedVehicle: computed.struct,

      fetchVehicles: action,
      setSelectedFilters: action.bound,
      clearLastSelected: action.bound,
      setEntryPoint: action.bound,
    });
  }
}
