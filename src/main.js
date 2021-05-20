import MenuView from './view/menu';
import StatsView from './view/stats';
import {render} from './utils/common';
import TripPresenter from './presenter/trip';
import EventsModel from './model/events';
import FiltersModel from './model/filters';
import FiltersPresenter from './presenter/filters';
import OffersModel from './model/offers';
import DestinationsModel from './model/destinations';
import {MenuItem, RedrawScope, API_URL, TOKEN, ERROR_MSG, ERROR_ATTR} from './const';
import API from './api';

const api = new API(API_URL, TOKEN);

const navigationElement = document.querySelector('.trip-controls__navigation');
const filtersElement = document.querySelector('.trip-controls__filters');

const tripMainElement = document.querySelector('.trip-main');
const tripEventsElement = document.querySelector('.trip-events');

const statsComponent = new StatsView();
render(tripEventsElement, statsComponent, 'afterend');

const menuComponent = new MenuView();
render(navigationElement, menuComponent);

const eventsModel = new EventsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

const filtersModel = new FiltersModel();
const filtersPresenter = new FiltersPresenter(filtersElement, filtersModel, eventsModel);

const tripPresenter = new TripPresenter(
  tripMainElement,
  tripEventsElement,
  eventsModel,
  filtersModel,
  offersModel,
  destinationsModel,
  api,
);

filtersPresenter.initialize();
tripPresenter.initialize();

api.getEvents()
  .then((events) => events.map(EventsModel.convertFromServer))
  .then((events) => {
    eventsModel.setEvents(RedrawScope.INIT, events);
    setMenuHandlers();
  })
  .catch(() => {
    eventsModel.setEvents(RedrawScope.INIT, []);
    setMenuHandlers();
  });

api.getDestinations()
  .then((destinations) => destinations.map(DestinationsModel.convertFromServer))
  .then((destinations) => destinationsModel.setDestinations(destinations))
  .catch(setErrorOverlay);

api.getOffers()
  .then((offers) => offersModel.setOffers(offers))
  .catch(setErrorOverlay);

function handleMenuItemClick(element) {
  const {path} = element.dataset;

  switch (path) {
    case MenuItem.TRIP:
      statsComponent.hide();
      tripPresenter.showTrip();
      break;
    case MenuItem.STATS:
      tripPresenter.hideTrip();
      statsComponent.show();
      statsComponent.draw(tripPresenter.exportStats());
      break;
  }

  menuComponent.toggleMenuItem(path);
}

function handleNewEventClick(evt) {
  evt.preventDefault();
  statsComponent.hide();
  menuComponent.toggleMenuItem(MenuItem.TRIP);
  tripPresenter.showTrip();
  tripPresenter.addEvent();
}

function setMenuHandlers() {
  menuComponent.setMenuItemClickHandler(handleMenuItemClick);
  tripMainElement.querySelector('.trip-main__event-add-btn').addEventListener('click', handleNewEventClick);
}

function setErrorOverlay() {
  document.body.setAttribute(ERROR_ATTR, ERROR_MSG);
  document.body.classList.add('error-overlay');
}

