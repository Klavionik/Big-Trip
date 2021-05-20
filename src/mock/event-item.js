import {
  getRandomBool,
  getRandomElement,
  getRandomInteger,
  getRandomISODates
} from '../utils/mock';
import {DESTINATIONS, TYPES} from '../const';
import {nanoid} from 'nanoid';
import {getOffersForType} from '../utils/event-items';

const LOREM = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
];


const getRandomOffers = (eventType, offersCount) => {
  const offers = [];
  const offersForType = getOffersForType(eventType);

  while (offersForType.length && offersCount) {
    const randomOffer = getRandomElement(offersForType);
    const randomOfferIndex = offersForType.indexOf(randomOffer);
    offersForType.splice(randomOfferIndex, 1);
    offers.push(randomOffer);

    offersCount--;
  }
  return offers;
};

const getRandomType = () => {
  return getRandomElement(TYPES);
};

const getRandomDestination = () => {
  return getRandomElement(DESTINATIONS);
};

const getRandomPhotos = (photosCount) => {
  const createPhotoLink = (integer) => {
    return {src: `http://picsum.photos/248/152?r=${integer}`, description: getRandomElement(LOREM)};
  };

  return new Array(photosCount).fill().map(() => createPhotoLink(getRandomInteger(0, 100)));
};

const getRandomText = (textLength) => {
  return new Array(textLength).fill().map(() => getRandomElement(LOREM)).join(' ');

};

const getRandomDescription = () => {
  const generateDescription = getRandomBool();
  return generateDescription
    ? {
      text: getRandomText(getRandomInteger(1, 5)),
      photos: getRandomPhotos(getRandomInteger(0, 5)),
    }
    : null;
};

const generateDestinations = () => {
  return DESTINATIONS.map((destination) => {
    return {
      destination,
      description: getRandomDescription(),
    };
  });
};

const generateEventItem = () => {
  const type = getRandomType();

  return {
    id: nanoid(7),
    type: type,
    destination: getRandomDestination(),
    ...getRandomISODates(),
    price: getRandomInteger(50, 1000),
    offers: getRandomOffers(type, getRandomInteger(0, 3)),
    isFavorite: getRandomBool(),
    description: getRandomDescription(),
  };
};

export {generateEventItem, getRandomDescription, generateDestinations};
