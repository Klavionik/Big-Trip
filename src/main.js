import {generateEventItem} from './mock/event-item';
import MenuView from './view/menu';
import FiltersView from './view/filters';
import {render} from './utils/common';
import TripPresenter from './presenter/trip';
import EventsModel from './model/events';

const EVENT_ITEMS_COUNT = 10;
const events = new Array(EVENT_ITEMS_COUNT).fill().map(generateEventItem);

const navigationElement = document.querySelector('.trip-controls__navigation');
const filtersElement = document.querySelector('.trip-controls__filters');

render(navigationElement, new MenuView());
render(filtersElement, new FiltersView());

const tripMainElement = document.querySelector('.trip-main');
const tripEventsElement = document.querySelector('.trip-events');

const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const tripPresenter = new TripPresenter(tripMainElement, tripEventsElement, eventsModel);
tripPresenter.initialize(events);
