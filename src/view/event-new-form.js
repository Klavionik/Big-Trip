import {
  createDescriptionTemplate,
  createDestinationListTemplate,
  createEventTypesTemplate,
  createOffersTemplate
} from '../utils/event-items';
import {formatInputDate} from '../utils/dates';
import BaseEvent from './base-event';

const createPhotosTemplate = (description) => {
  const addPhoto = (photo) => `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`;

  return description
    ? `<div class="event__photos-container">
         <div class="event__photos-tape">${description.photos.map(addPhoto).join('')}</div>
       </div>`
    : '';
};

const createEventNewFormTemplate = (
  event,
  eventTypeOffers,
  availableDestinations,
  isDisabled,
  isSaving,
) => {
  const {
    type,
    destination,
    start,
    end,
    price,
    offers,
    description,
  } = event;

  const inputStart = formatInputDate(start);
  const inputEnd = formatInputDate(end);
  const disabled = isDisabled ? 'disabled' : '';
  const saveBtnText = isSaving ? 'Saving...' : 'Save';

  return `<form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${disabled}>

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>
                        ${createEventTypesTemplate(type)}
                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-1">
                      ${type}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" ${disabled} list="destination-list-1" required>
                    <datalist id="destination-list-1">
                      ${createDestinationListTemplate(availableDestinations)}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${inputStart}" ${disabled}>
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${inputEnd}" ${disabled}>
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="number" min="0" name="event-price" value="${price}" ${disabled} required>
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit" ${disabled}>${saveBtnText}</button>
                  <button class="event__reset-btn" type="reset" ${disabled}>Cancel</button>
                </header>
                <section class="event__details">
                  ${createOffersTemplate(offers, eventTypeOffers, disabled)}
                  ${createDescriptionTemplate(description)}
                  ${createPhotosTemplate(description)}
                </section>
              </form>`;
};

class EventNewForm extends BaseEvent {
  constructor(event, availableOffers, availableDestinations) {
    super({...event}, availableOffers, availableDestinations);

    this._cancelClickHandler = this._cancelClickHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this.setDatePickers();
  }

  getTemplate() {
    return createEventNewFormTemplate(
      this._data,
      this._getOffersForEventType(),
      this._availableDestinations,
      this._isDisabled,
      this._isSaving,
    );
  }

  restoreHandlers() {
    if (this._isSaving) {
      return;
    }

    this._setInnerHandlers();

    this.setDatePickers();
    this.setFormSubmitHandler(this._callbacks.formSubmit);
    this.setCancelClickHandler(this._callbacks.cancel);
    this.setDestinationChangeHandler(this._callbacks.destinationChange);
  }

  setAborted() {
    const cb = () => {
      this._isSaving = false;
      this._isDisabled = false;
      this.updateElement();
    };

    this._showOfflineNotification();
    this.shake(cb);
  }

  setCancelClickHandler(cb) {
    this._callbacks.cancel = cb;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._cancelClickHandler);
  }

  setDestinationChangeHandler(cb) {
    this._callbacks.destinationChange = cb;
    const element = this.getElement().querySelector('.event__input--destination');
    element.addEventListener('change', this._destinationChangeHandler);
  }

  _setInnerHandlers() {
    this._setEventTypeClickHandler();
    this._setEventOfferClickHandler();
    this._setPriceInputHandler();
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();

    const {value} = evt.target;

    const validDestination = this._availableDestinations.indexOf(value) !== -1;

    if (!validDestination) {
      evt.target.value = '';
      return;
    }

    if (typeof this._callbacks.destinationChange === 'function') {
      this.updateData({destination: value});
      this._callbacks.destinationChange(this._data);
    }
  }

  _cancelClickHandler(evt) {
    evt.preventDefault();

    if (typeof this._callbacks.cancel === 'function') {
      this._callbacks.cancel();
    }
  }
}

export default EventNewForm;
