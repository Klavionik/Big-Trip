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
  }

  initialize(events) {
    this._events = [...events];

    if (this._events.length) {
      this._renderSorting();
      this._renderTrip();
    } else {
      this._renderNoEvents();
    }
  }

  _getInfo() {
    return calculateTripInfo(this._events);
  }

  _renderTrip() {
    this._renderTripInfo();
    this._renderEventList();
    this._renderEvents();
  }

  _renderTripInfo() {
    render(this._infoContainer, new TripInfoView(this._getInfo()), 'afterbegin');
  }

  _renderEvent(event) {
    const eventPresenter = new EventPresenter(this._eventListComponent, this._availableOffers, this._updateData);
    eventPresenter.initialize(event);
    this._eventPresenters[event.id] = eventPresenter;
  }

  _renderEventList() {
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
}

export default Trip;
