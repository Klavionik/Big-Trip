const API_URL = 'https://19.ecmascript.pages.academy/big-trip';
const TOKEN = 'KKgcBbinvjI';
const ERROR_ATTR = 'data-error';
const ERROR_MSG = 'Loading failed, try reloading the page';
const STORE_PREFIX = 'bigtrip-storage';
const STORE_VER = 'v1';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'transport',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant',
];

const SortType = {
  DAY: 'sort-day',
  TIME: 'sort-time',
  PRICE: 'sort-price',
};

const ActionType = {
  ADD: 'ADD',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
};

const RedrawScope = {
  INIT: 'INIT',
  ITEM: 'ITEM',
  LIST: 'LIST',
  PAGE: 'PAGE',
};

const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

const MenuItem = {
  TRIP: 'trip',
  STATS: 'stats',
};

const HttpMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

const State = {
  SAVING: 'SAVING',
  DELETING: 'DELETING',
  ABORTED: 'ABORTED',
};

const Mode = {
  VIEW: 'VIEW',
  EDIT: 'EDIT',
};

const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};


export {
  TYPES,
  SortType,
  ActionType,
  RedrawScope,
  FilterType,
  MenuItem,
  HttpMethod,
  API_URL,
  TOKEN,
  ERROR_ATTR,
  ERROR_MSG,
  State,
  Mode,
  STORE_NAME,
  RenderPosition
};
