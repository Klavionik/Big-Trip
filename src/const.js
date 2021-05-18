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

const DESTINATIONS = [
  'Moscow',
  'Berlin',
  'Milan',
  'New York',
  'Surgut',
  'Regina',
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

const OFFERS = [
  {
    'type': 'taxi',
    'offers': [
      {'title': 'Upgrade to a business class', 'price': 190},
      {'title': 'Choose the radio station', 'price': 30},
      {'title': 'Choose temperature', 'price': 170},
      {'title': 'Drive quickly, I\'m in a hurry', 'price': 100},
      {'title': 'Drive slowly', 'price': 110},
    ],
  },
  {
    'type': 'bus',
    'offers': [
      {'title': 'Infotainment system', 'price': 50},
      {'title': 'Order meal', 'price': 100},
      {'title': 'Choose seats', 'price': 190},
    ],
  },
  {
    'type': 'train',
    'offers': [
      {'title': 'Book a taxi at the arrival point', 'price': 110},
      {'title': 'Order a breakfast', 'price': 80},
      {'title': 'Wake up at a certain time', 'price': 140},
    ],
  },
  {
    'type': 'flight',
    'offers': [
      {'title': 'Choose meal', 'price': 120},
      {'title': 'Choose seats', 'price': 90},
      {'title': 'Upgrade to comfort class', 'price': 120},
      {'title': 'Upgrade to business class', 'price': 120},
      {'title': 'Add luggage', 'price': 170},
      {'title': 'Business lounge', 'price': 160},
    ],
  },
  {
    'type': 'check-in',
    'offers': [
      {'title': 'Choose the time of check-in', 'price': 70},
      {'title': 'Choose the time of check-out', 'price': 190},
      {'title': 'Add breakfast', 'price': 110},
      {'title': 'Laundry', 'price': 140},
      {'title': 'Order a meal from the restaurant', 'price': 30},
    ],
  },
  {
    'type': 'sightseeing',
    'offers': [],
  },
  {
    'type': 'ship',
    'offers': [
      {'title': 'Choose meal', 'price': 130},
      {'title': 'Choose seats', 'price': 160},
      {'title': 'Upgrade to comfort class', 'price': 170},
      {'title': 'Upgrade to business class', 'price': 150},
      {'title': 'Add luggage', 'price': 100},
      {'title': 'Business lounge', 'price': 40},
    ],
  },
  {
    'type': 'transport',
    'offers': [],
  },
  {
    'type': 'drive',
    'offers': [
      {'title': 'Choose comfort class', 'price': 110},
      {'title': 'Choose business class', 'price': 180},
    ],
  },
  {
    'type': 'restaurant',
    'offers': [
      {'title': 'Choose live music', 'price': 150},
      {'title': 'Choose VIP area', 'price': 70},
    ],
  },
];

export {
  TYPES,
  DESTINATIONS,
  OFFERS,
  SortType,
  ActionType,
  RedrawScope,
  FilterType,
  MenuItem
};
