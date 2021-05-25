import MenuView from './view/menu';
import StatsView from './view/stats';
import {isOnline, remove, render} from './utils/common';
import TripPresenter from './presenter/trip';
import EventsModel from './model/events';
import FiltersModel from './model/filters';
import FiltersPresenter from './presenter/filters';
import OffersModel from './model/offers';
import DestinationsModel from './model/destinations';
import {MenuItem, RedrawScope, API_URL, TOKEN, ERROR_MSG, ERROR_ATTR, STORE_NAME} from './const';
import API from './api/api';
import Provider from './api/provider';
import Store from './api/store';
import OfflineHeaderView from './view/offline-header';

const provider = new Provider(new API(API_URL, TOKEN), new Store(STORE_NAME, localStorage));

const navigationElement = document.querySelector('.trip-controls__navigation');
const filtersElement = document.querySelector('.trip-controls__filters');

const tripMainElement = document.querySelector('.trip-main');
const tripEventsElement = document.querySelector('.trip-events');

const statsComponent = new StatsView();
render(tripEventsElement, statsComponent, 'afterend');

const menuComponent = new MenuView();
render(navigationElement, menuComponent);

const offlineHeaderComponent = new OfflineHeaderView();

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
  provider,
);

filtersPresenter.initialize();
tripPresenter.initialize();

loadData();

async function loadData() {
  try {
    const offers = await provider.getOffers();
    const destinations = await provider.getDestinations();
    offersModel.setOffers(offers);
    destinationsModel.setDestinations(destinations.map(DestinationsModel.convertFromServer));
  } catch (error) {
    setErrorOverlay();
    return;
  }

  try {
    const events = await provider.getEvents();
    eventsModel.setEvents(RedrawScope.INIT, events.map(EventsModel.convertFromServer));
  } catch (error) {
    const events = [];
    eventsModel.setEvents(RedrawScope.INIT, events);
  } finally {
    setMenuHandlers();
  }
}

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

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

window.addEventListener('online', () => {
  if (provider.needsSync) {
    provider.sync();
  }
  remove(offlineHeaderComponent);
  tripPresenter.toggleNewEventButton();
});

window.addEventListener('offline', () => {
  render(document.body, offlineHeaderComponent, 'afterbegin');
  tripPresenter.toggleNewEventButton();
});

if (!isOnline()) {
  render(document.body, offlineHeaderComponent, 'afterbegin');
  tripPresenter.toggleNewEventButton();
}

