import dayjs from 'dayjs';
import {compareByDate} from './compare';

const getRoute = (events) => {
  const {length: eventPoints} = events;
  let route;

  if (eventPoints <= 3) {
    route = events.map(({destination}) => destination).join(' &mdash; ');
  } else {
    const {destination: firstDestination} = events[0];
    const {destination: lastDestination} = events[events.length - 1];
    route = `${firstDestination} &mdash; ... &mdash; ${lastDestination}`;
  }

  return route;
};

const getDates = (events) => {
  let dates;

  const startDate = dayjs(events[0].start);
  const endDate = dayjs(events[events.length - 1].end);

  if (startDate.month() === endDate.month()) {
    dates = `${startDate.format('MMM DD')} - ${endDate.format('DD')}`;
  }
  else {
    dates = `${startDate.format('MMM DD')} - ${endDate.format('MMM DD')}`;
  }

  return dates;
};

const calculacteEventCost = (acc, event) => {
  const offersCost = event.offers.reduce((acc, offer) => acc + offer.price, 0);
  return acc + event.price + offersCost;
};

const calculateTripInfo = (events) => {
  const sortedEvents = [...events].sort(compareByDate);

  return {
    route: getRoute(sortedEvents),
    dates: getDates(sortedEvents),
    cost: sortedEvents.reduce(calculacteEventCost, 0),
  };
};

export {
  calculateTripInfo
};
