import {Context, createContext, useContext} from 'react';
import assert from 'assert';

/**
 * Helper function which handles store context creation
 * @returns StoreContext, useContextStore
 */
export const makeStoreContext = <T>(): readonly [Context<T>, () => T] => {
  const StoreContext = createContext<T | undefined>(undefined) as Context<T>;
  const useContextStore = (): T => {
    const contextStore = useContext(StoreContext);
    assert(StoreContext, 'StoreContext: no value was provided for StoreContext.Provider');
    return contextStore;
  };

  return [StoreContext, useContextStore] as const;
};
