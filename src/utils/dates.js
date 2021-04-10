import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

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

export {
  processEventDate,
  formatInputDate,
  now
};
