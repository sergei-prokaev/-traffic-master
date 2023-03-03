import {TrafficStore} from './traffic';
import {TrafficMeisterApi} from '../../service';
import {DrawerStore} from './drawer';

/**
 * Domain store which initializes all needed deps for domain layer
 */
export class DomainStore {
  static init() {
    const api = new TrafficMeisterApi();
    const trafficStore = new TrafficStore(api);
    const drawerStore = new DrawerStore();

    return new DomainStore(trafficStore, drawerStore);
  }

  constructor(public readonly traffic: TrafficStore, public readonly drawer: DrawerStore) {}
}
