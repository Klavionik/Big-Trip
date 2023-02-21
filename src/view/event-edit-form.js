import {
  createDescriptionTemplate,
  createDestinationListTemplate,
  createEventTypesTemplate,
  createOffersTemplate,
  createPhotosTemplate
} from '../utils/event-items';
import {formatInputDate} from '../utils/dates';
import 'flatpickr/dist/flatpickr.min.css';
import {isOnline} from '../utils/common';
import BaseEvent from './base-event';

const createEventEditFormTemplate = (
  event,
  eventTypeOffers,
  availableDestinations,
  isDisabled,
  isSaving,
  isDeleting) => {
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
  const deleteBtnText = isDeleting ? 'Deleting...' : 'Delete';

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
                  <button class="event__reset-btn" type="reset" ${disabled}>${deleteBtnText}</button>
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>
                <section class="event__details">
                    ${createOffersTemplate(offers, eventTypeOffers, disabled)}
                    ${createDescriptionTemplate(description)}
                    ${createPhotosTemplate(description)}
                </section>
              </form>`;
};

class EventEditForm extends BaseEvent {
  constructor(event, availableOffers = [], availableDestinations) {
    super({...event}, availableOffers, availableDestinations);
    this._isDeleting = false;

    this._deleteClickHandler = this._deleteClickHandler.bind(this);
    this._rollupClickHandler = this._rollupClickHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
  }

  getTemplate() {
    return createEventEditFormTemplate(
      this._data,
      this._getOffersForEventType(),
      this._availableDestinations,
      this._isDisabled,
      this._isSaving,
      this._isDeleting,
    );
  }

  restoreHandlers() {
    if (this._isSaving) {
      return;
    }

    this._setInnerHandlers();

    this.setDatePickers();
    this.setFormSubmitHandler(this._callbacks.formSubmit);
    this.setDeleteClickHandler(this._callbacks.deleteClick);
    this.setRollupClickHandler(this._callbacks.rollupClick);
    this.setDestinationChangeHandler(this._callbacks.destinationChange);
  }

  setDeleting() {
    this._isDeleting = true;
    this._isDisabled = true;
    this.updateElement();
  }

  setAborted() {
    const cb = () => {
      this._isSaving = false;
      this._isDeleting = false;
      this._isDisabled = false;
      this.updateElement();
    };

    this._showOfflineNotification();
    this.shake(cb);
  }

  setRollupClickHandler(cb) {
    this._callbacks.rollupClick = cb;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._rollupClickHandler);
  }

  setDeleteClickHandler(cb) {
    this._callbacks.deleteClick = cb;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._deleteClickHandler);
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
      this._callbacks.destinationChange({destination: value});
    }
  }

  _rollupClickHandler(evt) {
    evt.preventDefault();

    if (typeof this._callbacks.rollupClick === 'function') {
      this._callbacks.rollupClick();
    }
  }

  _deleteClickHandler(evt) {
    evt.preventDefault();

    if (!isOnline()) {
      this.shake(() => {});
      this._showOfflineNotification();
      return;
    }

    if (typeof this._callbacks.deleteClick === 'function') {
      this._callbacks.deleteClick(this._data);
    }
  }
}

export default EventEditForm;
