import {calculateTripInfo} from '../utils/trip-info';
import {render, remove} from '../utils/common';
import TripInfoView from '../view/trip-info';
import SortingView from '../view/sorting';
import EventListView from '../view/event-list';
import NoEventsView from '../view/no-events';
import EventPresenter from '../presenter/event';
import EventNewPresenter from './event-new';
import {SortType, UpdateType, ActionType, FilterType, TYPES} from '../const';
import {compareByDate, compareByDuration, compareByPrice} from '../utils/compare';
import {filters} from '../utils/filters';
import {getDuration} from '../utils/dates';

class Trip {
  constructor(infoContainer, tripContainer, eventsModel, filtersModel, offersModel, destinationsModel) {
    this._infoContainer = infoContainer;
    this._tripContainer = tripContainer;

    this._filtersModel = filtersModel;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;

    this._eventsModel = eventsModel;
    this._eventPresenters = {};

    this._eventListComponent = new EventListView();

    this._sortingComponent = null;
    this._currentSortType = SortType.DAY;

    this._tripInfoComponent = null;
    this._noEventsComponent = null;

    this._updateMode = this._updateMode.bind(this);
    this._handleSortTypeChanged = this._handleSortTypeChanged.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._toggleNewEventButton = this._toggleNewEventButton.bind(this);
  }

  initialize() {
    this._eventNewPresenter = new EventNewPresenter(
      this._eventListComponent,
      this._handleViewAction,
      this._offersModel,
      this._destinationsModel,
    );

    render(this._tripContainer, this._eventListComponent);
    this._eventsModel.addSubscriber(this._handleModelEvent);
    this._filtersModel.addSubscriber(this._handleModelEvent);
    this._renderTrip();
  }

  hideTrip() {
    this._tripContainer.classList.add('trip-events--hidden');
    this._eventNewPresenter.destroy();
  }

  showTrip() {
    this._currentSortType = SortType.DAY;
    this._clearEvents();
    this._renderTrip();
    this._tripContainer.classList.remove('trip-events--hidden');
  }

  addEvent() {
    remove(this._noEventsComponent);
    this._currentSortType = SortType.DAY;
    this._filtersModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._eventNewPresenter.initialize(this._toggleNewEventButton);
    this._toggleNewEventButton();
  }

  exportStats() {
    const events = this._eventsModel.getEvents();
    const typesMap = Object.fromEntries(TYPES.map((type) => [type, 0]));

    const moneyStats = {...typesMap};
    const typeStats = {...typesMap};
    const timeSpendStats = {...typesMap};

    for (const event of events) {
      moneyStats[event.type] += event.price;
      typeStats[event.type] += 1;
      timeSpendStats[event.type] = timeSpendStats[event.type] + getDuration(event.start, event.end);
    }

    return {moneyStats, typeStats, timeSpendStats};
  }

  _clearEvents(resetSortType = false) {
    remove(this._sortingComponent);
    remove(this._noEventsComponent);
    this._eventNewPresenter.destroy();

    Object.values(this._eventPresenters)
      .forEach((presenter) => presenter.destroy());
    this._eventPresenters = {};

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }
  }

  _getEvents() {
    const events = [...this._eventsModel.getEvents()];
    const filter = this._filtersModel.getFilter();
    const filteredEvents = filters[filter](events);

    switch (this._currentSortType) {
      case SortType.DAY:
        return filteredEvents.sort(compareByDate);
      case SortType.TIME:
        return filteredEvents.sort(compareByDuration);
      case SortType.PRICE:
        return filteredEvents.sort(compareByPrice);
    }
  }

  _toggleNewEventButton() {
    const button = this._infoContainer.querySelector('.trip-main__event-add-btn');
    button.disabled = !button.disabled;
  }

  _renderTrip(keepTripInfo = false) {
    if (!keepTripInfo) {
      this._renderTripInfo(this._eventsModel.getEvents());
    }

    const events = this._getEvents();

    if (events.length) {
      this._renderSorting();
      this._renderEvents(events);
    } else {
      this._renderNoEvents();
    }
  }

  _renderTripInfo(events) {
    if (this._tripInfoComponent !== null) {
      remove(this._tripInfoComponent);
      this._tripInfoComponent = null;
    }

    if (events.length) {
      this._tripInfoComponent = new TripInfoView(calculateTripInfo(events));
      render(this._infoContainer, this._tripInfoComponent, 'afterbegin');
    }
  }

  _renderEvent(event) {
    const eventPresenter = new EventPresenter(
      this._eventListComponent,
      this._handleViewAction,
      this._updateMode,
      this._offersModel,
      this._destinationsModel,
    );
    eventPresenter.initialize(event);
    this._eventPresenters[event.id] = eventPresenter;
  }

  _renderEvents(events) {
    events.forEach(this._renderEvent, this);
  }

  _renderNoEvents() {
    this._noEventsComponent = new NoEventsView();
    render(this._tripContainer, this._noEventsComponent);
  }

  _renderSorting() {
    this._sortingComponent = new SortingView(this._currentSortType);
    render(this._tripContainer, this._sortingComponent, 'afterbegin');
    this._sortingComponent.setSortTypeChangeHandler(this._handleSortTypeChanged);
  }

  _updateMode() {
    this._eventNewPresenter.destroy();
    Object.values(this._eventPresenters)
      .forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChanged(sortType) {
    if (sortType !== this._currentSortType) {
      this._currentSortType = sortType;
      this._clearEvents();
      this._renderTrip();
    }
  }

  _handleViewAction(actionType, updateType, data) {
    switch (actionType) {
      case ActionType.ADD:
        this._eventsModel.addEvent(updateType, data);
        break;
      case ActionType.UPDATE:
        this._eventsModel.updateEvent(updateType, data);
        break;
      case ActionType.DELETE:
        this._eventsModel.deleteEvent(updateType, data);
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._eventPresenters[data.id].initialize(data);
        break;
      case UpdateType.MINOR:
        this._clearEvents();
        this._renderTrip();
        break;
      case UpdateType.MAJOR:
        this._clearEvents(true);
        this._renderTrip(true);
        break;
    }
  }
}

export default Trip;
