import {drawerStoreSlice, RootStore, trafficStoreSlice} from '../../stores';
import {dropdownMapper, primitiveDropdownMapper} from '../../utils';
import {MouseEventHandler} from 'react';

export const useControlsController = (rootStore: RootStore) => {
  const {drawerWidth, isMobileOpen, setIsMobileOpen} = drawerStoreSlice(rootStore);
  const sortFn = <T extends {label: string}>(a: T, b: T) => a.label.localeCompare(b.label);
  const {
    isFetching$,
    setSelectedFilters,
    clearLastSelected,
    types,
    brands,
    colors,
    currentSelectedVehicle,
    selectedFilters$,
    entryPoint$,
    setEntryPoint,
  } = trafficStoreSlice(rootStore);

  const vehicleColors = colors.map(primitiveDropdownMapper).sort(sortFn);
  const vehicleTypes = types.map(primitiveDropdownMapper).sort(sortFn);
  const vehicleBrands = brands.map(dropdownMapper('brand', 'brand')).sort(sortFn);

  const onChangeHandler = (value: string, name?: string) => {
    if (value && name) {
      if (!entryPoint$) {
        setEntryPoint(name);
        setSelectedFilters(value, name);
        return;
      }
      setSelectedFilters(value, name);
    }
  };

  const clearHandler: MouseEventHandler<HTMLButtonElement> = () => {
    clearLastSelected();
    setEntryPoint('');
  };

  return {
    drawerWidth,
    isMobileOpen,
    isFetching$,
    onChangeHandler,
    vehicleTypes,
    vehicleBrands,
    vehicleColors,
    clearHandler,
    currentSelectedVehicle,
    selectedFilters$,
    setIsMobileOpen,
  };
};
