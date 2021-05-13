import {
  createDescriptionTemplate,
  createDestinationListTemplate,
  createEventTypesTemplate,
  createOffersTemplate, getOffersForType
} from '../utils/event-items';
import {formatInputDate} from '../utils/dates';
import SmartView from './smart-view';
import {getRandomDescription} from '../mock/event-item';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const createEventEditFormTemplate = (event) => {
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
  const offersForType = getOffersForType(type);

  return `<form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

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
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1" required>
                    <datalist id="destination-list-1">
                        ${createDestinationListTemplate()}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${inputStart}">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${inputEnd}">
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="number" min="0" name="event-price" value="${price}" required>
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  <button class="event__reset-btn" type="reset">Delete</button>
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>
                <section class="event__details">
                    ${createOffersTemplate(offers, offersForType)}
                    ${createDescriptionTemplate(description)}
                </section>
              </form>`;
};

class EventEditForm extends SmartView {
  constructor(event) {
    super({...event});

    this._datepickerStart = null;
    this._datepickerEnd = null;

    this._rollupClickHandler = this._rollupClickHandler.bind(this);
    this._submitHandler = this._submitHandler.bind(this);
    this._eventTypeClickHandler = this._eventTypeClickHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._eventOfferClickHandler = this._eventOfferClickHandler.bind(this);
    this._dateStartChangeHandler = this._dateStartChangeHandler.bind(this);
    this._dateEndChangeHandler = this._dateEndChangeHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._deleteHandler = this._deleteHandler.bind(this);

    this._setInnerHandlers();
    this._setDatepickers();
  }

  getTemplate() {
    return createEventEditFormTemplate(this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatepickers();

    this.setSubmitHandler(this._callbacks.submit);
    this.setDeleteClickHandler(this._callbacks.delete);
    this.setRollupClickHandler(this._callbacks.rollupClick);
  }

  reset(event) {
    this.updateData(event);
  }

  setRollupClickHandler(cb) {
    this._callbacks.rollupClick = cb;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._rollupClickHandler);
  }

  setSubmitHandler(cb) {
    this._callbacks.submit = cb;
    this.getElement().addEventListener('submit', this._submitHandler);
  }

  _destroyDatepickers() {
    if (this._datepickerStart) {
      this._datepickerStart.destroy();
      this._datepickerStart = null;
    }

    if (this._datepickerEnd) {
      this._datepickerEnd.destroy();
      this._datepickerEnd = null;
    }
  }

  _setPriceInputHandler() {
    const priceInputElement = this.getElement().querySelector('.event__input--price');
    priceInputElement.addEventListener('input', this._priceInputHandler);
  }

  _setEventTypeClickHandler() {
    const eventTypeElements = this.getElement().querySelectorAll('.event__type-item');

    eventTypeElements.forEach((element) => {
      element.addEventListener('change', this._eventTypeClickHandler);
    });
  }

  _setDestinationChangeHandler() {
    const element = this.getElement().querySelector('.event__input--destination');

    element.addEventListener('change', this._destinationChangeHandler);
  }

  _setEventOfferClickHandler() {
    const elements = this.getElement().querySelectorAll('.event__offer-checkbox');

    elements.forEach((element) => {
      element.addEventListener('click', this._eventOfferClickHandler);
    });
  }

  setDeleteClickHandler(cb) {
    this._callbacks.delete = cb;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._deleteHandler);
  }

  _createDatepicker(selector, onChangeHandler) {
    return flatpickr(
      this.getElement().querySelector(selector),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        onChange: onChangeHandler,
      },
    );
  }

  _setDatepickers() {
    this._destroyDatepickers();
    this._datepickerStart = this._createDatepicker('#event-start-time-1', this._dateStartChangeHandler);
    this._datepickerEnd = this._createDatepicker('#event-end-time-1', this._dateEndChangeHandler);
  }

  _setInnerHandlers() {
    this._setEventTypeClickHandler();
    this._setDestinationChangeHandler();
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

    const {value: destination} = evt.target;
    let description = null;

    if (destination.trim()) {
      description = getRandomDescription();
    }

    this.updateData({
      destination,
      description,
    });
  }

  _priceInputHandler(evt) {
    evt.preventDefault();
    const {value: price} = evt.target;

    this.updateData({price: parseInt(price)}, false);
  }

  _rollupClickHandler(evt) {
    evt.preventDefault();

    if (typeof this._callbacks.rollupClick === 'function') {
      this._callbacks.rollupClick();
    }
  }

  _submitHandler(evt) {
    evt.preventDefault();

    if (typeof this._callbacks.submit === 'function') {
      this._callbacks.submit(this._data);
    }
  }

  _dateStartChangeHandler([date]) {
    this.updateData({
      start: date.toISOString(),
    }, false);
  }

  _dateEndChangeHandler([date]) {
    this.updateData({
      end: date.toISOString(),
    }, false);
  }

  _deleteHandler(evt) {
    evt.preventDefault();

    if (typeof this._callbacks.delete === 'function') {
      this._callbacks.delete(this._data);
    }
  }
}

export default EventEditForm;
