import DestinationsModel from '../model/destinations';
import {setErrorOverlay} from './common';
import {RedrawScope} from '../const';
import EventsModel from '../model/events';

const loadData = async (provider, offersModel, destinationsModel, eventsModel, cb) => {
  try {
    const offers = await provider.getOffers();
    const destinations = await provider.getDestinations();
    offersModel.setItems(offers);
    destinationsModel.setItems(destinations.map(DestinationsModel.convertFromServer));
  } catch (error) {
    setErrorOverlay();
    return;
  }

  try {
    const events = await provider.getEvents();
    eventsModel.setItems(RedrawScope.INIT, events.map(EventsModel.convertFromServer(destinationsModel, offersModel)));
  } catch (error) {
    const events = [];
    eventsModel.setItems(RedrawScope.INIT, events);
  } finally {
    cb();
  }
};

export {loadData};
