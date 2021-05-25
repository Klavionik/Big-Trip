import {calculateTripInfo} from '../utils/trip-info';
import {render, remove} from '../utils/common';
import TripInfoView from '../view/trip-info';
import SortingView from '../view/sorting';
import EventListView from '../view/event-list';
import NoEventsView from '../view/no-events';
import EventPresenter from '../presenter/event';
import EventNewPresenter from './event-new';
import {SortType, RedrawScope, ActionType, FilterType, State} from '../const';
import {compareByDate, compareByDuration, compareByPrice} from '../utils/compare';
import {filters} from '../utils/filters';
import {getDuration} from '../utils/dates';
import LoadingView from '../view/loading';
import EventsModel from '../model/events';

class Trip {
  constructor(infoContainer, tripContainer, eventsModel, filtersModel, offersModel, destinationsModel, api) {
    this._infoContainer = infoContainer;
    this._tripContainer = tripContainer;

    this._api = api;
    this._isLoading = true;
    this._filtersModel = filtersModel;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;

    this._eventsModel = eventsModel;
    this._eventPresenters = {};

    this._eventListComponent = new EventListView();
    this._loadingComponent = new LoadingView();

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
    this._filtersModel.setFilter(RedrawScope.PAGE, FilterType.EVERYTHING);
    this._eventNewPresenter.initialize(this._toggleNewEventButton);
    this.toggleNewEventButton();
  }

  toggleNewEventButton() {
    this._toggleNewEventButton();
  }

  exportStats() {
    const events = this._eventsModel.getEvents();

    const moneyStats = {};
    const typeStats = {};
    const timeSpendStats = {};

    for (const event of events) {
      moneyStats[event.type] = (moneyStats[event.type] || 0) + event.price;
      typeStats[event.type] = (typeStats[event.type] || 0) + 1;
      timeSpendStats[event.type] = (timeSpendStats[event.type] || 0) + getDuration(event.start, event.end);
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
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

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

  _renderLoading() {
    render(this._eventListComponent, this._loadingComponent);
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

  _handleViewAction(actionType, redrawScope, data) {
    switch (actionType) {
      case ActionType.ADD:
        this._eventNewPresenter.setViewSaving();
        this._api.createEvent(EventsModel.convertToServer(data))
          .then(EventsModel.convertFromServer)
          .then((data) => this._eventsModel.addEvent(redrawScope, data))
          .catch(() => this._eventNewPresenter.setViewAborted());
        break;
      case ActionType.UPDATE:
        this._eventPresenters[data.id].setViewState(State.SAVING);
        this._api.updateEvent(EventsModel.convertToServer(data))
          .then(EventsModel.convertFromServer)
          .then((data) => this._eventsModel.updateEvent(redrawScope, data))
          .catch(() =>  this._eventPresenters[data.id].setViewState(State.ABORTED));
        break;
      case ActionType.DELETE:
        this._eventPresenters[data.id].setViewState(State.DELETING);
        this._api.deleteEvent(data)
          .then(() => this._eventsModel.deleteEvent(redrawScope, data))
          .catch(() => this._eventPresenters[data.id].setViewState(State.ABORTED));
    }
  }

  _handleModelEvent(redrawScope, data) {
    switch (redrawScope) {
      case RedrawScope.ITEM:
        this._eventPresenters[data.id].initialize(data);
        break;
      case RedrawScope.LIST:
        this._clearEvents();
        this._renderTrip();
        break;
      case RedrawScope.PAGE:
        this._clearEvents(true);
        this._renderTrip(true);
        break;
      case RedrawScope.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderTrip();
        break;
    }
  }
}

export default Trip;
