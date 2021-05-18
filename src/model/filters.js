import Observer from '../utils/observer.js';
import {FilterType} from '../const.js';

class Filters extends Observer {
  constructor() {
    super();
    this._activeFilter = FilterType.EVERYTHING;
  }

  setFilter(redrawScope, filter) {
    this._activeFilter = filter;
    this._notify(redrawScope, filter);
  }

  getFilter() {
    return this._activeFilter;
  }
}

export default Filters;
