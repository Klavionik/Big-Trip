import DestinationsModel from '../model/destinations';
import {setErrorOverlay} from './common';
import {RedrawScope} from '../const';
import EventsModel from '../model/events';

const loadData = async (provider, offersModel, destinationsModel, eventsModel, cb) => {
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
    cb();
  }
};

export {loadData};
