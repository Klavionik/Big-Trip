import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(duration);
dayjs.extend(isSameOrAfter);
window.dayjs = dayjs;


const HOUR_IN_MS = 3600000;
const DAY_IN_MS = HOUR_IN_MS * 24;

const getDuration = (diff) => {
  const duration = dayjs.duration(diff);

  if (diff < HOUR_IN_MS) {
    return duration.format('mm[M]');
  }

  if (diff >= HOUR_IN_MS && diff < DAY_IN_MS) {
    return duration.format('HH[H] mm[M]');
  }

  if (diff >= DAY_IN_MS) {
    return duration.format('DD[D] HH[H] mm[M]');
  }
};

const formatTime = (date) => dayjs(date).format('HH:mm');

const formatDate = (date) => dayjs(date).format('MMM D');

const formatInputDate = (date) => dayjs(date).format('DD/MM/YY HH:mm');

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

const isPast = (event) => {
  return dayjs(event.end).isBefore(now()) || dayjs(event.start).isBefore(now());
};

const isFuture = (event)  => {
  return dayjs(event.start).isSameOrAfter(now()) || dayjs(event.end).isAfter(now());
};

export {
  processEventDate,
  formatInputDate,
  now,
  isFuture,
  isPast
};
