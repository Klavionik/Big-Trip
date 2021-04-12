import {
  createEventItemTemplate,
  createEventEditFormTemplate
} from './view';
import {generateEventItem, generateAvailableOffers} from './mock/event-item';
import {calculateTripInfo} from './utils/trip-info';
import MenuView from './view/menu';
import SortingView from './view/sorting';
import Filters from './view/filters';
import TripInfo from './view/trip-info';

const EVENT_ITEMS_COUNT = 8;

const availableOffers = generateAvailableOffers();
const eventItems = new Array(EVENT_ITEMS_COUNT).fill().map(generateEventItem);

const render = (container, template, position = 'beforeend') => {
  container.insertAdjacentHTML(position, template);
};

const createEvents = (eventsList) => {
  eventItems.slice(1).forEach((event) => {
    const eventItem = createEventItemTemplate(event);
    render(eventsList, eventItem);
  });
};

const navigationElement = document.querySelector('.trip-controls__navigation');
const tripMainElement = document.querySelector('.trip-main');
const filtersElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

render(navigationElement, new MenuView().getTemplate());

const tripInfo = calculateTripInfo(eventItems.slice(1));
render(tripMainElement, new TripInfo(tripInfo).getTemplate(), 'afterbegin');
render(filtersElement, new Filters().getTemplate());
render(tripEventsElement, new SortingView().getTemplate());

const tripEventsListElement = document.querySelector('.trip-events__list');

render(tripEventsListElement, createEventEditFormTemplate(eventItems[0], availableOffers));
createEvents(tripEventsListElement);
// render(tripEventsListElement, createEventNewFormTemplate(eventItems[0]), availableOffers);

