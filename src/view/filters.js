import AbstractView from './abstract-view';

const createFilterItem = ({type, name, count}, currentFilterType) => {
  const isChecked = () => type === currentFilterType ? 'checked' : '';
  const isDisabled = () => !count ? 'disabled' : '';

  return `<div class="trip-filters__filter">
              <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name}" ${isChecked()} ${isDisabled()}>
              <label class="trip-filters__filter-label" for="filter-${name}">${name}</label>
            </div>`;
};

const createFiltersTemplate = (filters, currentFilterType) => {
  const filterItems = filters.map((filter) => createFilterItem(filter, currentFilterType)).join(' ');

  return `<form class="trip-filters" action="#" method="get">
            ${filterItems}
            <button class="visually-hidden" type="submit">Accept filter</button>
          </form>`;
};

class Filters extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilterType = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFiltersTemplate(this._filters, this._currentFilterType);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();

    if (typeof this._callbacks.filterChange === 'function') {
      this._callbacks.filterChange(evt.target.value);
    }
  }

  setFilterTypeChangeHandler(cb) {
    this._callbacks.filterChange = cb;
    this.getElement().addEventListener('change', this._filterTypeChangeHandler);
  }
}

export default Filters;
