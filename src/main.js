import {generateEventItem, generateAvailableOffers} from './mock/event-item';
import {calculateTripInfo} from './utils/trip-info';
import MenuView from './view/menu';
import SortingView from './view/sorting';
import FiltersView from './view/filters';
import TripInfoView from './view/trip-info';
import EventItemView from './view/event-item';
import EventEditFormView from './view/event-edit-form';
import EventListView from './view/event-list';
import {render} from './utils/common';

const EVENT_ITEMS_COUNT = 8;

const availableOffers = generateAvailableOffers();
const eventItems = new Array(EVENT_ITEMS_COUNT).fill().map(generateEventItem);

const createEvents = (eventsList) => {
  eventItems.slice(1).forEach((event) => {
    const eventItem = new EventItemView(event).getElement();
    const eventEditForm = new EventEditFormView(event, availableOffers).getElement();

    const replaceItemWithForm = () => eventItem.replaceWith(eventEditForm);
    const replaceFormWithItem = () => eventEditForm.replaceWith(eventItem);

    eventItem.querySelector('.event__rollup-btn').addEventListener('click',  replaceItemWithForm);

    eventEditForm.addEventListener('submit', (evt) => {
      evt.preventDefault();
      replaceFormWithItem();
    });

    eventEditForm.querySelector('.event__rollup-btn').addEventListener('click', replaceFormWithItem);

    render(eventsList, eventItem);
  });
};

const navigationElement = document.querySelector('.trip-controls__navigation');
const tripMainElement = document.querySelector('.trip-main');
const filtersElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

render(navigationElement, new MenuView().getElement());

const tripInfo = calculateTripInfo(eventItems.slice(1));
render(tripMainElement, new TripInfoView(tripInfo).getElement(), 'afterbegin');
render(filtersElement, new FiltersView().getElement());
render(tripEventsElement, new SortingView().getElement());
render(tripEventsElement, new EventListView().getElement());

const tripEventsListElement = document.querySelector('.trip-events__list');

createEvents(tripEventsListElement);
// render(tripEventsListElement, new EventNewFormView(eventItems[0], availableOffers).getElement());
