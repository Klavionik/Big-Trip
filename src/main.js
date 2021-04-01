import {
  createMenuTemplate,
  createTripInfoTemplate,
  createFiltersTemplate,
  createSortingTemplate,
  createEventItemTemplate,
  createEventEditFormTemplate,
  createEventNewFormTemplate
} from './view';

const EVENT_ITEMS_COUNT = 3;

const render = (container, template, position = 'beforeend') => {
  container.insertAdjacentHTML(position, template);
};

const createEvents = (eventsList) => {
  for (let i = 0; i < EVENT_ITEMS_COUNT; i++) {
    const eventItem = createEventItemTemplate();
    render(eventsList, eventItem);
  }
};

const navigationElement = document.querySelector('.trip-controls__navigation');
const tripMainElement = document.querySelector('.trip-main');
const filtersElement = document.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');

render(navigationElement, createMenuTemplate());
render(tripMainElement, createTripInfoTemplate(), 'afterbegin');
render(filtersElement, createFiltersTemplate());
render(tripEventsElement, createSortingTemplate());

const tripEventsListElement = document.querySelector('.trip-events__list');

render(tripEventsListElement, createEventEditFormTemplate());
createEvents(tripEventsListElement);
render(tripEventsListElement, createEventNewFormTemplate());

