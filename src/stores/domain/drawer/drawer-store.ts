import {makeObservable, action, observable} from 'mobx';

/**
 * DrawerStore which handles basic mobile behaviour for drawer
 */
export class DrawerStore {
  drawerWidth = 300;

  isMobileOpen = false;

  setIsMobileOpen() {
    this.isMobileOpen = !this.isMobileOpen;
  }

  constructor() {
    makeObservable(this, {
      setIsMobileOpen: action.bound,
      isMobileOpen: observable,
      drawerWidth: observable,
    });
  }
}
