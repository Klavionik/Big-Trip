import {calculateTripInfo} from '../utils/trip-info';
import {render, remove} from '../utils/common';
import TripInfoView from '../view/trip-info';
import SortingView from '../view/sorting';
import EventListView from '../view/event-list';
import NoEventsView from '../view/no-events';
import EventPresenter from '../presenter/event';
import EventNewFormView from '../view/event-new-form';

class Trip {
  constructor(infoContainer, tripContainer) {
    this._infoContainer = infoContainer;
    this._tripContainer = tripContainer;

    this._events = [];
    this._eventPresenters = {};

    this._eventListComponent = new EventListView();
    this._sortingComponent = new SortingView();
    this._newEventFormComponent = null;
    this._noEventsComponent = null;

    this._updateData = this._updateData.bind(this);
    this._updateMode = this._updateMode.bind(this);
    this._newEventClickHandler = this._newEventClickHandler.bind(this);

    this._setNewEventClickHandler();
    render(this._tripContainer, this._eventListComponent);
  }

  initialize(events) {
    this._events = [...events];
    this._renderTrip();
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

}

export default Trip;
