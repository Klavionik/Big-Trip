import {FilterType} from '../const';
import {isFuture, isPast} from './dates';

const filters = {
  [FilterType.EVERYTHING]: (events) => events,
  [FilterType.FUTURE]: (events) => events.filter((event) => isFuture(event)),
  [FilterType.PAST]: (events) => events.filter((event) => isPast(event)),
};

export {filters};
