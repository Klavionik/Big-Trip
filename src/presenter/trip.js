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
  constructor(infoContainer, tripContainer, eventsModel) {
    this._infoContainer = infoContainer;
    this._tripContainer = tripContainer;

    this._eventsModel = eventsModel;
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
  }

  initialize() {
    render(this._tripContainer, this._eventListComponent);

    const events = this._getEvents();

    if (events.length) {
      this._renderTrip(events);
    } else {
      this._renderNoEvents();
    }
  }

  _clearEvents() {
    Object.values(this._eventPresenters)
      .forEach((presenter) => presenter.destroy());
    this._eventPresenters = {};
  }

  _getEvents() {
    const events = [...this._eventsModel.getEvents()];

    switch (this._currentSortType) {
      case SortType.DAY:
        return events.sort(compareByDate);
      case SortType.TIME:
        return events.sort(compareByDuration);
      case SortType.PRICE:
        return events.sort(compareByPrice);
    }
  }

  _toggleNewEventButton() {
    const button = this._infoContainer.querySelector('.trip-main__event-add-btn');
    button.disabled = !button.disabled;
  }

  _renderTrip(events) {
    this._renderTripInfo(events);
    this._renderSorting();
    this._renderEvents(events);
  }

  _renderTripInfo(events) {
    const tripInfoComponent = new TripInfoView(calculateTripInfo(events));
    render(this._infoContainer, tripInfoComponent, 'afterbegin');
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

  _renderEvents(events) {
    events.forEach(this._renderEvent, this);
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
    this._eventsModel.updateEvent(updatedEvent);
    this._eventPresenters[updatedEvent.id].initialize(updatedEvent);
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
      this._currentSortType = sortType;
      this._clearEvents();

      const events = this._getEvents();
      this._renderEvents(events);
    }
  }
}

export default Trip;
