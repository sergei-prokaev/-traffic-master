import {TrafficStore} from '../traffic-store';
import {TrafficMeisterApi, ITrafficService} from '../../../../service';
import {trafficData} from '../__mocks__';
import {configure} from 'mobx';

//jest.mock('../__mocks__');

describe(`${TrafficStore.name}`, () => {
  let trafficApi: ITrafficService;
  let store: TrafficStore;
  const throwFn =
    /* eslint-disable  @typescript-eslint/no-explicit-any */


      (fn: (...args: any[]) => void, ...args: unknown[]) =>
      () =>
        fn(...args);

  beforeEach(() => {
    configure({
      safeDescriptors: false,
    });
    trafficApi = new TrafficMeisterApi();
    store = new TrafficStore(trafficApi);
    store.vehicles$ = trafficData;
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('.currentSelectedVehicle', () => {
    it('should return value if brand, colors, type are selected', () => {
      const vehicleToCompare = {
        id: 3,
        type: 'train',
        brand: 'USRA 0-6-6',
        colors: ['yellow', 'white', 'black'],
        img: 'https://upload.wikimedia.org/wikipedia/en/thumb/a/a1/UP_4466_Neil916.JPG/600px-UP_4466_Neil916.JPG',
      };
      store.setSelectedFilters('train', 'type');
      store.setSelectedFilters('USRA 0-6-6', 'brand');
      store.setSelectedFilters('yellow', 'colors');

      expect(store.currentSelectedVehicle).not.toBeNull();
      expect(store.currentSelectedVehicle).toEqual(vehicleToCompare);
    });
    it('should return null if one of brand / colors / type is not defined', () => {
      store.setSelectedFilters('train', 'type');
      expect(store.currentSelectedVehicle).toBeNull();
    });
  });

  describe('.setEntryPoint', () => {
    it('should be defined', () => {
      expect(typeof store.setEntryPoint).toBe('function');
    });
    it('should set entry point', () => {
      jest.spyOn(store, 'setEntryPoint');
      store.setEntryPoint('brand');
      expect(store.setEntryPoint).toHaveBeenCalledTimes(1);
      expect(store.entryPoint$).toBe('brand');
    });
    it('should throw an error when called with wrong params', () => {
      expect(throwFn(store['setEntryPoint'], null)).toThrowError();
      expect(throwFn(store['setEntryPoint'], undefined)).toThrowError();
      expect(throwFn(store['setEntryPoint'], {})).toThrowError();
      expect(throwFn(store['setEntryPoint'], [])).toThrowError();
      expect(throwFn(store['setEntryPoint'], NaN)).toThrowError();
      expect(throwFn(store['setEntryPoint'], Symbol)).toThrowError();
      expect(throwFn(store['setEntryPoint'], false)).toThrowError();
      expect(throwFn(store['setEntryPoint'], true)).toThrowError();
      expect(throwFn(store['setEntryPoint'], new Date())).toThrowError();
      expect(throwFn(store['setEntryPoint'], '')).not.toThrowError();
    });
  });

  describe('.setSelectedFilters', () => {
    it('should be defined', () => {
      expect(typeof store.setSelectedFilters).toBe('function');
    });
    it('should set what was the last selected value from dropdown', () => {
      jest.spyOn(store, 'setSelectedFilters');
      store.setSelectedFilters('train', 'type');
      expect(store.setSelectedFilters).toHaveBeenCalledTimes(1);
      expect(store.selectedFilters$.type).not.toBe('');
      expect(store.selectedFilters$.type).toBe('train');
    });
    it('should throw an error when called with wrong params', () => {
      expect(throwFn(store['setSelectedFilters'], null, '')).toThrowError();
      expect(throwFn(store['setSelectedFilters'], true, undefined)).toThrowError();
      expect(throwFn(store['setSelectedFilters'], {}, 2)).toThrowError();
      expect(throwFn(store['setSelectedFilters'], [], {})).toThrowError();
      expect(throwFn(store['setSelectedFilters'], NaN, Infinity)).toThrowError();
      expect(throwFn(store['setSelectedFilters'], Symbol, false)).toThrowError();
      expect(throwFn(store['setSelectedFilters'], 2, [])).toThrowError();
      expect(throwFn(store['setSelectedFilters'], true, new Date())).toThrowError();
      expect(throwFn(store['setSelectedFilters'], new Date(), -3)).toThrowError();
      expect(throwFn(store['setSelectedFilters'], '', '')).not.toThrowError();
    });
  });

  describe('.filterTypesByEntryPoint', () => {
    it('should filter types when entry point is brand and type and color are not selected', () => {
      store.setEntryPoint('brand');
      store.setSelectedFilters('Boeing 787 Dreamliner', 'brand');
      const res = store['filterTypesByEntryPoint'](store.entryPoint$, store.selectedFilters$, store.vehicles$);
      expect(res).toEqual(['airplane']);
    });
    it('should filter types when entry point is color and brand is not selected', () => {
      store.setEntryPoint('colors');
      store.setSelectedFilters('red', 'colors');
      const res = store['filterTypesByEntryPoint'](store.entryPoint$, store.selectedFilters$, store.vehicles$);
      expect(res).toEqual(['airplane', 'car']);
    });
    it('should not filter types when entry point is type', () => {
      store.setEntryPoint('type');
      store.setSelectedFilters('car', 'type');
      const res = store['filterTypesByEntryPoint'](store.entryPoint$, store.selectedFilters$, store.vehicles$);
      expect(res).toEqual(['airplane', 'car', 'train']);
    });
  });

  describe('.filterBrandsByEntryPoint', () => {
    it('should filter brands when entry point is type and color is not selected', () => {
      store.setEntryPoint('type');
      store.setSelectedFilters('train', 'type');
      const res = store['filterBrandsByEntryPoint'](store.entryPoint$, store.selectedFilters$, store.vehicles$);
      expect(res).toEqual([{brand: 'USRA 0-6-6', id: 3}]);
    });
    it('should filter brands when entry point is color and type is selected', () => {
      store.setEntryPoint('colors');
      store.setSelectedFilters('red', 'colors');
      store.setSelectedFilters('car', 'type');
      const res = store['filterBrandsByEntryPoint'](store.entryPoint$, store.selectedFilters$, store.vehicles$);
      expect(res).toEqual([{brand: 'Bugatti Veyron', id: 1}]);
    });
    it('should filter brands when entry point is color but type and brand are not selected', () => {
      store.setEntryPoint('colors');
      store.setSelectedFilters('red', 'colors');
      const res = store['filterBrandsByEntryPoint'](store.entryPoint$, store.selectedFilters$, store.vehicles$);
      expect(res).toEqual([
        {brand: 'Boeing 787 Dreamliner', id: 2},
        {brand: 'Bugatti Veyron', id: 1},
        {brand: 'Canadair North Star', id: 4},
      ]);
    });
    it('should not filter brands when entry point is brand but color and type are not selected', () => {
      store.setEntryPoint('brands');
      store.setSelectedFilters('Boeing 787 Dreamliner', 'brand');
      const res = store['filterTypesByEntryPoint'](store.entryPoint$, store.selectedFilters$, store.vehicles$);
      expect(res).toEqual(['airplane', 'car', 'train']);
    });
  });

  describe('.filterColorsByEntryPoint', () => {
    it('should filter colors when entry point is type but brand is not selected', () => {
      store.setEntryPoint('type');
      store.setSelectedFilters('train', 'type');
      const res = store['filterColorsByEntryPoint'](store.entryPoint$, store.selectedFilters$, store.vehicles$);
      expect(res).toEqual(['black', 'white', 'yellow']);
    });
    it('should filter colors when entry point is type and brand is selected', () => {
      store.setEntryPoint('type');
      store.setSelectedFilters('train', 'type');
      store.setSelectedFilters('USRA 0-6-6', 'brand');

      const res = store['filterColorsByEntryPoint'](store.entryPoint$, store.selectedFilters$, store.vehicles$);
      expect(res).toEqual(['black', 'white', 'yellow']);
    });
    it('should not filter colors when only color selected', () => {
      store.setEntryPoint('colors');
      store.setSelectedFilters('red', 'colors');

      const res = store['filterColorsByEntryPoint'](store.entryPoint$, store.selectedFilters$, store.vehicles$);
      expect(res).toEqual(['black', 'blue', 'green', 'red', 'white', 'yellow']);
    });
  });
});
