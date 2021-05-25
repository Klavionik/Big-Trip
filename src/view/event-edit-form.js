import {
  createDescriptionTemplate,
  createDestinationListTemplate,
  createEventTypesTemplate,
  createOffersTemplate
} from '../utils/event-items';
import {formatInputDate} from '../utils/dates';
import SmartView from './smart-view';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import {isOnline} from '../utils/common';

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
                </section>
              </form>`;
};

class EventEditForm extends SmartView {
  constructor(event, availableOffers = [], availableDestinations) {
    super({...event});

    this._availableOffers = availableOffers;
    this._availableDestinations = availableDestinations;
    this._datepickerStart = null;
    this._datepickerEnd = null;

    this._isDisabled = false;
    this._isSaving = false;
    this._isDeleting = false;

    this._rollupClickHandler = this._rollupClickHandler.bind(this);
    this._eventTypeClickHandler = this._eventTypeClickHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._eventOfferClickHandler = this._eventOfferClickHandler.bind(this);
    this._dateStartChangeHandler = this._dateStartChangeHandler.bind(this);
    this._dateEndChangeHandler = this._dateEndChangeHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);

    this._setInnerHandlers();
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
    this._setInnerHandlers();

    this.setDatepickers();
    this.setFormSubmitHandler(this._callbacks.formSubmit);
    this.setDeleteClickHandler(this._callbacks.deleteClick);
    this.setRollupClickHandler(this._callbacks.rollupClick);
    this.setDestinationChangeHandler(this._callbacks.destinationChange);
  }

  reset(event) {
    this.updateData(event);
  }

  setSaving() {
    this._isSaving = true;
    this._isDisabled = true;
    this.updateElement();
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

    this.shake(cb);
  }

  setRollupClickHandler(cb) {
    this._callbacks.rollupClick = cb;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._rollupClickHandler);
  }

  setFormSubmitHandler(cb) {
    this._callbacks.formSubmit = cb;
    this.getElement().addEventListener('submit', this._formSubmitHandler);
  }

  setDestinationChangeHandler(cb) {
    this._callbacks.destinationChange = cb;
    const element = this.getElement().querySelector('.event__input--destination');
    element.addEventListener('change', this._destinationChangeHandler);
  }

  destroyDatepickers() {
    if (this._datepickerStart) {
      this._datepickerStart.destroy();
      this._datepickerStart = null;
    }

    if (this._datepickerEnd) {
      this._datepickerEnd.destroy();
      this._datepickerEnd = null;
    }
  }

  setDatepickers() {
    this.destroyDatepickers();
    this._datepickerStart = this._createDatepicker('#event-start-time-1', this._dateStartChangeHandler);
    this._datepickerEnd = this._createDatepicker(
      '#event-end-time-1',
      this._dateEndChangeHandler,
      {
        minDate: formatInputDate(this._data.start),
        defaultDate: this._data.end,
      },
    );
  }

  setDeleteClickHandler(cb) {
    this._callbacks.deleteClick = cb;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._deleteClickHandler);
  }

  _getOffersForEventType() {
    const eventTypeOffers = this._availableOffers.find(((offer) => offer.type === this._data.type));

    if (eventTypeOffers) {
      return [...eventTypeOffers.offers];
    }

    return [];
  }

  _setEventTypeClickHandler() {
    const eventTypeElements = this.getElement().querySelectorAll('.event__type-item');

    eventTypeElements.forEach((element) => {
      element.addEventListener('change', this._eventTypeClickHandler);
    });
  }

  _setPriceInputHandler() {
    const priceInputElement = this.getElement().querySelector('.event__input--price');
    priceInputElement.addEventListener('input', this._priceInputHandler);
  }

  _setEventOfferClickHandler() {
    const elements = this.getElement().querySelectorAll('.event__offer-checkbox');

    elements.forEach((element) => {
      element.addEventListener('click', this._eventOfferClickHandler);
    });
  }

  _createDatepicker(selector, onChangeHandler, options) {
    return flatpickr(
      this.getElement().querySelector(selector),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        onChange: onChangeHandler,
        ...options,
      },
    );
  }

  _setInnerHandlers() {
    this._setEventTypeClickHandler();
    this._setEventOfferClickHandler();
    this._setPriceInputHandler();
  }

  _eventTypeClickHandler(evt) {
    evt.preventDefault();
    this.updateData({type: evt.target.value, offers: []});
  }

  _eventOfferClickHandler(evt) {
    evt.preventDefault();

    const label = evt.target.parentElement.querySelector('label');
    const title = label.children[0].textContent;
    const price  = parseInt(label.children[1].textContent);

    const offer = {title, price};
    let offers;

    if (this._data.offers.every((value) => value.title !== title)) {
      offers = [...this._data.offers, offer];
    } else {
      offers = this._data.offers.filter((value) => value.title !== title);
    }

    this.updateData({offers});
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

  _priceInputHandler(evt) {
    evt.preventDefault();
    const {value: price} = evt.target;

    this.updateData({price: parseInt(price)}, false);
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

  _formSubmitHandler(evt) {
    evt.preventDefault();

    if (typeof this._callbacks.formSubmit === 'function') {
      this._callbacks.formSubmit(this._data);
    }
  }

  _dateStartChangeHandler([date]) {
    const payload = {start: date.toISOString()};

    if (date > new Date(this._data.end)) {
      payload.end = date.toISOString();
    }

    this.updateData(payload, false);
    this.setDatepickers();
  }

  _dateEndChangeHandler([date]) {
    this.updateData({
      end: date.toISOString(),
    }, false);
    this.setDatepickers();
  }

  _deleteClickHandler(evt) {
    evt.preventDefault();

    if (typeof this._callbacks.deleteClick === 'function') {
      this._callbacks.deleteClick(this._data);
    }
  }
}

export default EventEditForm;
