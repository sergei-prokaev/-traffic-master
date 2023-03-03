import {DrawerStore} from '../drawer-store';
import {configure} from 'mobx';

describe(`${DrawerStore.name}`, () => {
  let store: DrawerStore;
  beforeEach(() => {
    configure({
      safeDescriptors: false,
    });
    store = new DrawerStore();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('.setIsMobileOpen', () => {
    it('should be defined', () => {
      expect(typeof store.setIsMobileOpen).toBe('function');
    });
    it('should toggle isMobileOpen flag', () => {
      jest.spyOn(store, 'setIsMobileOpen');
      expect(store.isMobileOpen).toBe(false);
      store.setIsMobileOpen();
      expect(store.isMobileOpen).toBe(true);
      expect(store.setIsMobileOpen).toHaveBeenCalledTimes(1);
    });
  });
});
