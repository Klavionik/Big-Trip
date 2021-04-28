import {calculateTripInfo} from '../utils/trip-info';
import {render} from '../utils/common';
import TripInfoView from '../view/trip-info';
import SortingView from '../view/sorting';
import EventListView from '../view/event-list';
import NoEventsView from '../view/no-events';
import EventPresenter from '../presenter/event';
import {generateAvailableOffers} from '../mock/event-item';

class Trip {
  constructor(infoContainer, tripContainer) {
    this._infoContainer = infoContainer;
    this._tripContainer = tripContainer;

    this._events = [];
    this._eventPresenters = {};
    this._availableOffers = generateAvailableOffers();

    this._eventListComponent = new EventListView();
    this._sortingComponent = new SortingView();

    this._updateData = this._updateData.bind(this);
    this._updateMode = this._updateMode.bind(this);
  }

  initialize(events) {
    this._events = [...events];
    this._renderTrip();
  }

  _getInfo() {
    return calculateTripInfo(this._events);
  }

  _renderTrip() {
    if (this._events.length) {
      this._renderTripInfo();
      this._renderSorting();
      this._renderEventsContainer();
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
      this._availableOffers,
      this._updateData,
      this._updateMode,
    );
    eventPresenter.initialize(event);
    this._eventPresenters[event.id] = eventPresenter;
  }

  _renderEventsContainer() {
    render(this._tripContainer, this._eventListComponent);
  }

  _renderEvents() {
    this._events.forEach(this._renderEvent, this);
  }

  _renderNoEvents() {
    render(this._tripContainer, new NoEventsView());
  }

  _renderSorting() {
    render(this._tripContainer, this._sortingComponent);
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
}

export default Trip;
