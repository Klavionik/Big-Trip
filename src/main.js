import {generateEventItem} from './mock/event-item';
import MenuView from './view/menu';
import {render} from './utils/common';
import TripPresenter from './presenter/trip';
import EventsModel from './model/events';
import FiltersModel from './model/filters';
import FiltersPresenter from './presenter/filters';
import OffersModel from './model/offers';
import {OFFERS} from './const';

const EVENT_ITEMS_COUNT = 10;
const events = new Array(EVENT_ITEMS_COUNT).fill().map(generateEventItem);

const navigationElement = document.querySelector('.trip-controls__navigation');
const filtersElement = document.querySelector('.trip-controls__filters');

render(navigationElement, new MenuView());

const tripMainElement = document.querySelector('.trip-main');
const tripEventsElement = document.querySelector('.trip-events');

const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const offersModel = new OffersModel();
offersModel.setOffers(OFFERS);

const filtersModel = new FiltersModel();
const filtersPresenter = new FiltersPresenter(filtersElement, filtersModel, eventsModel);

const tripPresenter = new TripPresenter(
  tripMainElement,
  tripEventsElement,
  eventsModel,
  filtersModel,
  offersModel,
);

filtersPresenter.initialize();
tripPresenter.initialize();
