import {configure} from 'mobx';
import {DomainStore} from '../domain/domain-store';

configure({
  enforceActions: 'always',
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
  observableRequiresReaction: true,
  disableErrorBoundaries: false,
});

/**
 * Application root store.
 * Initializes domain layer
 */
export class RootStore {
  static init() {
    const domainStore = DomainStore.init();
    return new RootStore(domainStore);
  }
  constructor(public readonly domain: DomainStore) {}
}
