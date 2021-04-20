import {generateEventItem, generateAvailableOffers} from './mock/event-item';
import {calculateTripInfo} from './utils/trip-info';
import MenuView from './view/menu';
import SortingView from './view/sorting';
import FiltersView from './view/filters';
import TripInfoView from './view/trip-info';
import EventItemView from './view/event-item';
import EventEditFormView from './view/event-edit-form';
import EventListView from './view/event-list';
import NoEventsView from './view/no-events';
import {render} from './utils/common';

const EVENT_ITEMS_COUNT = 10;

const availableOffers = generateAvailableOffers();
const eventItems = new Array(EVENT_ITEMS_COUNT).fill().map(generateEventItem);

const createEvents = (eventsList) => {
  eventItems.slice(1).forEach((event) => {
    const eventItem = new EventItemView(event);
    const eventEditForm = new EventEditFormView(event, availableOffers);

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

    render(eventsList, eventItem.getElement());
  });
};

const navigationElement = document.querySelector('.trip-controls__navigation');
const filtersElement = document.querySelector('.trip-controls__filters');

render(navigationElement, new MenuView().getElement());
render(filtersElement, new FiltersView().getElement());

const tripEventsElement = document.querySelector('.trip-events');

if (eventItems.length) {
  const tripMainElement = document.querySelector('.trip-main');
  const tripInfo = calculateTripInfo(eventItems.slice(1));
  render(tripMainElement, new TripInfoView(tripInfo).getElement(), 'afterbegin');

  render(tripEventsElement, new SortingView().getElement());
  render(tripEventsElement, new EventListView().getElement());

  const tripEventsListElement = document.querySelector('.trip-events__list');
  createEvents(tripEventsListElement);
} else {
  render(tripEventsElement, new NoEventsView().getElement());
}

// render(tripEventsListElement, new EventNewFormView(eventItems[0], availableOffers).getElement());
