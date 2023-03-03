import {DrawerStore} from '../domain/drawer';
import {TrafficStore} from '../domain/traffic';
import {makeStoreContext} from '../helpers';
import {RootStore} from './root-store';

export const [RootStoreContext, useContextRootStore] = makeStoreContext<RootStore>();

/**
 * Helper function which make a slice of ```drawer``` store
 * @param rootStore
 * @returns domain store slice
 */
export const drawerStoreSlice = (rootStore: RootStore): DrawerStore => rootStore.domain.drawer;

/**
 * Helper function which make a slice of ```traffic``` store
 * @param rootStore
 * @returns domain store slice
 */
export const trafficStoreSlice = (rootStore: RootStore): TrafficStore => rootStore.domain.traffic;
