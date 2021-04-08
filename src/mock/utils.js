import dayjs from 'dayjs';
import {TYPES} from '../const';

const OFFERS = [
  {title: 'Add luggage', price: 50},
  {title: 'Switch to comfort', price: 80},
  {title: 'Add breakfast', price: 50},
  {title: 'Choose seats', price: 20},
  {title: 'Travel by train', price: 120},
];

// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomElement = (array) => {
  const index = getRandomInteger(0, array.length - 1);
  return array[index];
};

const getRandomBool = () => {
  return Boolean(getRandomInteger(0, 1));
};

const getRandomISODates = () => {
  // generate random Unix timestamp between 2021-04-01 and 2021-05-01
  const start = dayjs.unix(getRandomInteger(1617224400,1619816400));
  const randomHours = getRandomInteger(0, 24);
  const randomMinutes = getRandomInteger(0, 60);

  const end = start.add(randomHours, 'hour').add(randomMinutes, 'minute');

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
};

const getRandomOffers = (offersCount) => {
  return new Array(offersCount).fill().map(() => getRandomElement(OFFERS));
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

export {
  generateAvailableOffers,
  getRandomOffers,
  getRandomISODates,
  getRandomBool,
  getRandomElement,
  getRandomInteger
};