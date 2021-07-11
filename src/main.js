import MenuView from './view/menu';
import StatsView from './view/stats';
import {isOnline, remove, render} from './utils/common';
import TripPresenter from './presenter/trip';
import EventsModel from './model/events';
import FiltersModel from './model/filters';
import FiltersPresenter from './presenter/filters';
import OffersModel from './model/offers';
import DestinationsModel from './model/destinations';
import {MenuItem, API_URL, TOKEN, STORE_NAME, RenderPosition} from './const';
import API from './api/api';
import Provider from './api/provider';
import Store from './api/store';
import OfflineHeaderView from './view/offline-header';
import {loadData} from './utils/api';

const navigationElement = document.querySelector('.trip-controls__navigation');
const filtersElement = document.querySelector('.trip-controls__filters');

const tripMainElement = document.querySelector('.trip-main');
const tripEventsElement = document.querySelector('.trip-events');

const provider = new Provider(new API(API_URL, TOKEN), new Store(STORE_NAME, localStorage));

const statsComponent = new StatsView();
const menuComponent = new MenuView();
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
      statsComponent.draw(tripPresenter.exportStats());
      break;
  }

  menuComponent.toggleMenuItem(path);
};

const newEventClickHandler = (evt) => {
  evt.preventDefault();
  statsComponent.hide();
  menuComponent.toggleMenuItem(MenuItem.TRIP);
  tripPresenter.showTrip();
  tripPresenter.addEvent();
};

const setMenuHandlers = () => {
  menuComponent.setMenuItemClickHandler(handleMenuItemClick);
  tripMainElement.querySelector('.trip-main__event-add-btn').addEventListener('click', newEventClickHandler);
};

render(tripEventsElement, statsComponent, RenderPosition.AFTEREND);
render(navigationElement, menuComponent);

filtersPresenter.initialize();
tripPresenter.initialize();

loadData(provider, offersModel, destinationsModel, eventsModel, setMenuHandlers);


window.addEventListener('load', () => {
  navigator.serviceWorker.register('./sw.js');
});

window.addEventListener('online', () => {
  if (provider.needsSync) {
    provider.sync();
  }
  remove(offlineHeaderComponent);
  tripPresenter.toggleNewEventButton();
});

window.addEventListener('offline', () => {
  render(document.body, offlineHeaderComponent, RenderPosition.AFTERBEGIN);
  tripPresenter.toggleNewEventButton();
});

if (!isOnline()) {
  render(document.body, offlineHeaderComponent, RenderPosition.AFTERBEGIN);
  tripPresenter.toggleNewEventButton();
}

