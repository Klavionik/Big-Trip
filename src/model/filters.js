import Observer from '../utils/observer.js';
import {FilterType} from '../const.js';

class Filters extends Observer {
  constructor() {
    super();
    this._activeFilter = FilterType.EVERYTHING;
  }

  getActive() {
    return this._activeFilter;
  }

  setActive(redrawScope, filter) {
    this._activeFilter = filter;
    this._notify(redrawScope, filter);
  }
}

export default Filters;
