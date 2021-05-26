import FiltersView from '../view/filters.js';
import {render, replace} from '../utils/common.js';
import {filters} from '../utils/filters.js';
import {FilterType, RedrawScope} from '../const.js';

class Filters {
  constructor(filtersContainer, filtersModel, eventsModel) {
    this._filtersContainer = filtersContainer;
    this._filtersComponent = null;

    this._filtersModel = filtersModel;
    this._eventsModel = eventsModel;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._filtersModel.addSubscriber(this._handleModelEvent);
    this._eventsModel.addSubscriber(this._handleModelEvent);
  }

  initialize() {
    const filters = this._getFilters();
    const previousFilterComponent = this._filtersComponent;

    this._filtersComponent = new FiltersView(filters, this._filtersModel.getActive());
    this._filtersComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (previousFilterComponent === null) {
      render(this._filtersContainer, this._filtersComponent);
      return;
    }

    replace(previousFilterComponent, this._filtersComponent);
  }

  _getFilters() {
    const events = this._eventsModel.getItems();

    return [
      {
        type: FilterType.EVERYTHING,
        name: 'everything',
        count: filters[FilterType.EVERYTHING](events).length,
      },
      {
        type: FilterType.FUTURE,
        name: 'future',
        count: filters[FilterType.FUTURE](events).length,
      },
      {
        type: FilterType.PAST,
        name: 'past',
        count: filters[FilterType.PAST](events).length,
      },
    ];
  }

  _handleModelEvent() {
    this.initialize();
  }

  _handleFilterTypeChange(filterType) {
    if (this._filtersModel.getActive() === filterType) {
      return;
    }

    this._filtersModel.setActive(RedrawScope.PAGE, filterType);
  }
}

export default Filters;
