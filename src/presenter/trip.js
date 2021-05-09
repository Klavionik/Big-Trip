import {calculateTripInfo} from '../utils/trip-info';
import {render, remove} from '../utils/common';
import TripInfoView from '../view/trip-info';
import SortingView from '../view/sorting';
import EventListView from '../view/event-list';
import NoEventsView from '../view/no-events';
import EventPresenter from '../presenter/event';
import EventNewFormView from '../view/event-new-form';
import {SortType} from '../const';
import {compareByDate, compareByDuration, compareByPrice} from '../utils/compare';

class Trip {
  constructor(infoContainer, tripContainer) {
    this._infoContainer = infoContainer;
    this._tripContainer = tripContainer;

    this._events = [];
    this._eventPresenters = {};

    this._eventListComponent = new EventListView();
    this._sortingComponent = new SortingView();
    this._currentSortType = SortType.DAY;

    this._newEventFormComponent = null;
    this._noEventsComponent = null;

    this._updateData = this._updateData.bind(this);
    this._updateMode = this._updateMode.bind(this);
    this._newEventClickHandler = this._newEventClickHandler.bind(this);
    this._handleSortTypeChanged = this._handleSortTypeChanged.bind(this);

    this._setNewEventClickHandler();
    render(this._tripContainer, this._eventListComponent);
  }

  initialize(events) {
    this._events = [...events].sort(compareByDate);
    this._renderTrip();
  }

  _clearEvents() {
    Object.values(this._eventPresenters)
      .forEach((presenter) => presenter.destroy());
    this._eventPresenters = {};
  }

  _sortEvents(sortType) {
    switch (sortType) {
      case SortType.DAY:
        this._events.sort(compareByDate);
        break;
      case SortType.TIME:
        this._events.sort(compareByDuration);
        break;
      case SortType.PRICE:
        this._events.sort(compareByPrice);
        break;
    }

    this._currentSortType = sortType;
    this._clearEvents();
    this._renderEvents();
  }

  _getInfo() {
    return calculateTripInfo(this._events);
  }

  _toggleNewEventButton() {
    const button = this._infoContainer.querySelector('.trip-main__event-add-btn');
    button.disabled = !button.disabled;
  }

  _renderTrip() {
    if (this._events.length) {
      this._renderTripInfo();
      this._renderSorting();
      this._renderEvents();
    } else {
      this._renderNoEvents();
    }
  }

  _renderTripInfo() {
    render(this._infoContainer, new TripInfoView(this._getInfo()), 'afterbegin');
  }

  _renderEvent(event) {
    const eventPresenter = new EventPresenter(
      this._eventListComponent,
      this._updateData,
      this._updateMode,
    );
    eventPresenter.initialize(event);
    this._eventPresenters[event.id] = eventPresenter;
  }

  _renderNewEventForm() {
    if (!this._newEventFormComponent) {
      this._newEventFormComponent = new EventNewFormView();
      render(this._eventListComponent, this._newEventFormComponent, 'afterbegin');
      this._toggleNewEventButton();
    }
  }

  _renderEvents() {
    this._events.forEach(this._renderEvent, this);
  }

  _renderNoEvents() {
    this._noEventsComponent = new NoEventsView();
    render(this._tripContainer, this._noEventsComponent);
  }

  _renderSorting() {
    render(this._tripContainer, this._sortingComponent, 'afterbegin');
    this._sortingComponent.setSortTypeChangeHandler(this._handleSortTypeChanged);
  }

  _updateData(updatedEvent) {
    const eventIndex = this._events.findIndex(({id}) => id === updatedEvent.id);

    if (eventIndex !== -1) {
      this._events[eventIndex] = updatedEvent;
      this._eventPresenters[updatedEvent.id].initialize(updatedEvent);
    }
  }

  _updateMode() {
    Object.values(this._eventPresenters)
      .forEach((presenter) => presenter.resetView());
  }

  _setNewEventClickHandler() {
    this._infoContainer.querySelector('.trip-main__event-add-btn')
      .addEventListener('click', this._newEventClickHandler);
  }

  _newEventClickHandler(evt) {
    evt.preventDefault();

    if (this._noEventsComponent) {
      remove(this._noEventsComponent);
    }

    this._renderNewEventForm();
  }

  _handleSortTypeChanged(sortType) {
    if (sortType !== this._currentSortType) {
      this._sortEvents(sortType);
    }
  }
}

export default Trip;
