import {generateEventItem, generateDestinations} from './mock/event-item';
import MenuView from './view/menu';
import StatsView from './view/stats';
import {render} from './utils/common';
import TripPresenter from './presenter/trip';
import EventsModel from './model/events';
import FiltersModel from './model/filters';
import FiltersPresenter from './presenter/filters';
import OffersModel from './model/offers';
import DestinationsModel from './model/destinations';
import {OFFERS, MenuItem} from './const';

const EVENT_ITEMS_COUNT = 10;
const events = new Array(EVENT_ITEMS_COUNT).fill().map(generateEventItem);
const destinations = generateDestinations();

const navigationElement = document.querySelector('.trip-controls__navigation');
const filtersElement = document.querySelector('.trip-controls__filters');

const tripMainElement = document.querySelector('.trip-main');
const tripEventsElement = document.querySelector('.trip-events');

const statsComponent = new StatsView();
render(tripEventsElement, statsComponent, 'afterend');

const eventsModel = new EventsModel();
eventsModel.setEvents(events);

const offersModel = new OffersModel();
offersModel.setOffers(OFFERS);

const destinationsModel = new DestinationsModel();
destinationsModel.setDestinations(destinations);

const filtersModel = new FiltersModel();
const filtersPresenter = new FiltersPresenter(filtersElement, filtersModel, eventsModel);

const tripPresenter = new TripPresenter(
  tripMainElement,
  tripEventsElement,
  eventsModel,
  filtersModel,
  offersModel,
  destinationsModel,
);

filtersPresenter.initialize();
tripPresenter.initialize();

const menuComponent = new MenuView();
render(navigationElement, menuComponent);

const handleNewEventClick = (evt) => {
  evt.preventDefault();
  statsComponent.hide();
  menuComponent.toggleMenuItem(MenuItem.TRIP);
  tripPresenter.showTrip();
  tripPresenter.addEvent();
};

tripMainElement.querySelector('.trip-main__event-add-btn').addEventListener('click', handleNewEventClick);

const handleMenuItemClick = (element) => {
  const {path} = element.dataset;

  switch (path) {
    case MenuItem.TRIP:
      statsComponent.hide();
      tripPresenter.showTrip();
      break;
    case MenuItem.STATS:
      tripPresenter.hideTrip();
      statsComponent.show();
      break;
  }

  menuComponent.toggleMenuItem(path);
};

menuComponent.setMenuItemClickHandler(handleMenuItemClick);
