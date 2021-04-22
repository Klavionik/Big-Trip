import {calculateTripInfo} from '../utils/trip-info';
import {render} from '../utils/common';
import TripInfoView from '../view/trip-info';
import SortingView from '../view/sorting';
import EventListView from '../view/event-list';
import NoEventsView from '../view/no-events';
import EventItemView from '../view/event-item';
import EventEditFormView from '../view/event-edit-form';
import {generateAvailableOffers} from '../mock/event-item';

class Trip {
  constructor(infoContainer, tripContainer) {
    this._infoContainer = infoContainer;
    this._tripContainer = tripContainer;

    this._events = [];
    this._availableOffers = generateAvailableOffers();

    this._eventListComponent = new EventListView();
    this._sortingComponent = new SortingView();
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
    const eventItem = new EventItemView(event);
    const eventEditForm = new EventEditFormView(event, this._availableOffers);

    const replaceItemWithForm = () => {
      eventItem.getElement().replaceWith(eventEditForm.getElement());
      document.addEventListener('keydown', closeOnEscape);
    };

    const replaceFormWithItem = () => {
      eventEditForm.getElement().replaceWith(eventItem.getElement());
      document.removeEventListener('keydown', closeOnEscape);
    };

    const closeOnEscape = (evt) => {
      if (evt.code === 'Escape') {
        replaceFormWithItem();
      }
    };

    eventItem.setRollupClickHandler(replaceItemWithForm);
    eventEditForm.setSubmitHandler(replaceFormWithItem);
    eventEditForm.setRollupClickHandler(replaceFormWithItem);

    render(this._eventListComponent, eventItem);
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
}

export default Trip;
