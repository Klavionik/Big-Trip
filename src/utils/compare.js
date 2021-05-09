import dayjs from 'dayjs';

const compareByDuration = (a, b) => {
  const durationA = dayjs(a.end).diff(dayjs(a.start));
  const durationB = dayjs(b.end).diff(dayjs(b.start));

  return durationB - durationA;
};

const compareByDate = (a, b) => dayjs(a.start) - dayjs(b.start);

const compareByPrice = (a, b) => b.price - a.price;

const compareByTitle = (a, b) => {
  const titleA = a.title.toUpperCase();
  const titleB = b.title.toUpperCase();

  if (titleA < titleB) {
    return -1;
  }

  if (titleA > titleB) {
    return 1;
  }

  return 0;
};

export {
  compareByDate,
  compareByPrice,
  compareByDuration,
  compareByTitle
};

