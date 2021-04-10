import {
  getRandomBool,
  getRandomElement,
  getRandomInteger,
  getRandomISODates
} from '../utils/mock';
import {DESTINATIONS, TYPES} from '../const';

const OFFERS = [
  {title: 'Add luggage', price: 50},
  {title: 'Switch to comfort', price: 80},
  {title: 'Add breakfast', price: 50},
  {title: 'Choose seats', price: 20},
  {title: 'Travel by train', price: 120},
];

const LOREM = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
].join(' ');


const getRandomOffers = (offersCount) => {
  return new Array(offersCount).fill().map(() => getRandomElement(OFFERS));
};

const getRandomType = () => {
  return getRandomElement(TYPES);
};

const getRandomDestination = () => {
  return getRandomElement(DESTINATIONS);
};

const getRandomPhotos = (photosCount) => {
  const createPhotoLink = (integer) => {
    return `http://picsum.photos/248/152?r=${integer}`;
  };

  return new Array(photosCount).fill().map(() => createPhotoLink(getRandomInteger(0, 100)));
};

const getRandomDescription = () => {
  const generateDescription = getRandomBool();
  return generateDescription
    ? {
      text: LOREM,
      photos: getRandomPhotos(getRandomInteger(0, 5)),
    }
    : null;
};

const generateEventItem = () => {
  return {
    type: getRandomType(),
    destination: getRandomDestination(),
    ...getRandomISODates(),
    price: getRandomInteger(50, 1000),
    offers: getRandomOffers(getRandomInteger(0, 3)),
    isFavorite: getRandomBool(),
    description: getRandomDescription(),
  };
};

const generateAvailableOffers = () => {
  const offersCount = getRandomInteger(0, 3);

  return TYPES.map((type) => {
    return {
      type: type,
      offers: new Array(offersCount).fill().map(() => getRandomElement(OFFERS)),
    };
  });
};

export {generateEventItem, generateAvailableOffers};
