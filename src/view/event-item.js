import {processEventDate} from '../utils/dates';
import AbstractView from './abstract-view';
import {isOnline} from '../utils/common';

const createOffersTemplate = (offers) => {
  const createOffers = () => {
    return offers.map(({title, price}) => {
      return `<li class="event__offer">
                <span class="event__offer-title">${title}</span>
                &plus;&euro;&nbsp;
                <span class="event__offer-price">${price}</span>
            </li>`;
    }).join('');
  };

  return offers.length
    ? `<h4 class="visually-hidden">Offers:</h4><ul class="event__selected-offers">${createOffers()}</ul>`
    : '';
};

const createEventItemTemplate = (event) => {
  const {
    type,
    destination,
    start,
    end,
    price,
    offers,
  } = event;

  const {startDate, startTime, endTime, duration} = processEventDate(start, end);
  const favoriteButtonActiveClass = event.isFavorite ? 'event__favorite-btn--active' : '';

  return `<li class="trip-events__item">
              <div class="event">
                <time class="event__date" datetime="${start}">${startDate}</time>
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
                </div>
                <h3 class="event__title">${type} ${destination}</h3>
                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="${start}">${startTime}</time>
                    &mdash;
                    <time class="event__end-time" datetime="${end}">${endTime}</time>
                  </p>
                  <p class="event__duration">${duration}</p>
                </div>
                <p class="event__price">
                  &euro;&nbsp;<span class="event__price-value">${price}</span>
                </p>
                  ${createOffersTemplate(offers)}
                <button class="event__favorite-btn ${favoriteButtonActiveClass}" type="button">
                  <span class="visually-hidden">Add to favorite</span>
                  <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
                    <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
                  </svg>
                </button>
                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </div>
            </li>`;
};

class EventItem extends AbstractView {
  constructor(event) {
    super();
    this._event = event;

    this._rollupClickHandler = this._rollupClickHandler.bind(this);
    this._isFavoriteClickHandler = this._isFavoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createEventItemTemplate(this._event);
  }

  setAborted() {
    this.shake(() => {});
  }

  setRollupClickHandler(cb) {
    this._callbacks.rollupClick = cb;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._rollupClickHandler);
  }

  setIsFavoriteClickHandler(cb) {
    this._callbacks.isFavoriteClick = cb;
    this.getElement().querySelector('.event__favorite-btn').addEventListener('click', this._isFavoriteClickHandler);
  }

  _rollupClickHandler(evt) {
    evt.preventDefault();

    if (!isOnline()) {
      return;
    }

    if (typeof this._callbacks.rollupClick === 'function') {
      this._callbacks.rollupClick();
    }
  }

  _isFavoriteClickHandler(evt) {
    evt.preventDefault();

    if (typeof this._callbacks.isFavoriteClick === 'function') {
      this._callbacks.isFavoriteClick();
    }
  }
}

export default EventItem;
