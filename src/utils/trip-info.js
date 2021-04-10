import dayjs from 'dayjs';

const sortByDate = (events) => {
  return events.sort((first, second) => dayjs(first.start) - dayjs(second.start));
};

const getRoute = (events) => {
  sortByDate(events);
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

const calculateTripInfo = (events) => {
  return {
    route: getRoute(events),
    dates: getDates(events),
    cost: events.reduce((acc, event) => acc + event.price, 0),
  };
};

export {
  calculateTripInfo
};
