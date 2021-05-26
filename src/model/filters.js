import Observer from '../utils/observer.js';
import {FilterType} from '../const.js';

class Filters extends Observer {
  constructor() {
    super();
    this._activeFilter = FilterType.EVERYTHING;
  }

  getFilter() {
    return this._activeFilter;
  }

  setFilter(redrawScope, filter) {
    this._activeFilter = filter;
    this._notify(redrawScope, filter);
  }
}

export default Filters;
