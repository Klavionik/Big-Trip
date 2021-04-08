import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {DESTINATIONS, TYPES} from '../const';

dayjs.extend(duration);

const HOUR_IN_MS = 3600000;
const DAY_IN_MS = HOUR_IN_MS * 24;

const getDuration = (diff) => {
  const duration = dayjs.duration(diff);

  const extractMinutes = () => duration.minutes().toString().padStart(2, '0');
  const extractHours = () => duration.hours().toString().padStart(2, '0');
  const extractDays = () => duration.days().toString().padStart(2, '0');

  if (diff < HOUR_IN_MS) {
    return `${extractMinutes()}M`;
  }

  if (diff >= HOUR_IN_MS && diff < DAY_IN_MS) {
    return `${extractHours()}H ${extractMinutes()}M`;
  }

  if (diff >= DAY_IN_MS) {
    return `${extractDays()}D ${extractHours()}H ${extractMinutes()}M`;
  }
};

const formatTime = (date) => dayjs(date).format('HH:MM');

const formatDate = (date) => dayjs(date).format('MMM D');

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

const formatInputDate = (date) => dayjs(date).format('DD/MM/YY HH:MM');

const now = () => dayjs();

const processEventDate = (start, end) => {
  start = dayjs(start);
  end = dayjs(end);

  const startTime = formatTime(start);
  const endTime = formatTime(end);
  const startDate = formatDate(start);

  const diff = end.diff(start);
  const duration = getDuration(diff);

  return {
    startDate,
    startTime,
    endTime,
    duration,
  };
};

const nameFromTitle = (title) => {
  return title.toLowerCase().replaceAll(' ', '-');
};

const getOffersForType = (eventType, offers) => {
  return eventType
    ? Object.values(offers).find(({type}) => {
      return eventType === type;
    }).offers
    : [];
};

const calculateTripInfo = (events) => {
  return {
    route: getRoute(events),
    dates: getDates(events),
    cost: events.reduce((acc, event) => acc + event.price, 0),
  };
};

const createDescriptionTemplate = (description) => {
  return description
    ? `<section class="event__section  event__section--destination">
         <h3 class="event__section-title  event__section-title--destination">Destination</h3>
         <p class="event__destination-description">${description.text}</p>
       </section>`
    : '';
};

const createOffersTemplate = (eventOffers, offersForType) => {
  const addOffers = (offers, checked = true) => {
    return offers.map(({title, price}) => {
      const name = nameFromTitle(title);
      return `<div class="event__offer-selector">
              <input class="event__offer-checkbox  visually-hidden" id="${name}-1" type="checkbox" name="${name}" ${checked ? 'checked' : ''}>
              <label class="event__offer-label" for="${name}-1">
                <span class="event__offer-title">${title}</span>
                &plus;&euro;&nbsp;
                <span class="event__offer-price">${price}</span>
              </label>
            </div>`;
    }).join('');
  };

  const hasOffers = eventOffers.length || offersForType.length;

  return hasOffers
    ? `<section class="event__section  event__section--offers">
           <h3 class="event__section-title  event__section-title--offers">Offers</h3>
           <div class="event__available-offers">
             ${eventOffers.length ? addOffers(eventOffers): ''}
             ${offersForType.length ? addOffers(offersForType, false) : ''}
           </div>
         </section>`
    : '';
};

const createDestinationListTemplate = () => {
  return DESTINATIONS.map((destination) => {
    return `<option value="${destination}"></option>`;
  });
};

const createEventTypesTemplate = (currentType) => {
  return TYPES.map((type) => {
    const checked = currentType === type ? 'checked' : '';
    return `<div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type"
             value="${type}" ${checked}>
        <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
    </div>`;
  }).join('');
};

export {
  createEventTypesTemplate,
  createDestinationListTemplate,
  createOffersTemplate,
  createDescriptionTemplate,
  calculateTripInfo,
  getOffersForType,
  nameFromTitle,
  processEventDate,
  now,
  formatInputDate
};
