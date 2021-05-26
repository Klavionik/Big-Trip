import SmartView from './smart-view';
import {formatInputDate} from '../utils/dates';
import flatpickr from 'flatpickr';
import {isOnline, showOfflineNotification} from '../utils/common';

class BaseEvent extends SmartView {
  constructor(event, availableOffers = [], availableDestinations) {
    super(event);

    this._availableOffers = availableOffers;
    this._availableDestinations = availableDestinations;
    this._datePickerStart = null;
    this._datePickerEnd = null;

    this._isDisabled = false;
    this._isSaving = false;

    this._eventTypeClickHandler = this._eventTypeClickHandler.bind(this);
    this._eventOfferClickHandler = this._eventOfferClickHandler.bind(this);
    this._dateStartChangeHandler = this._dateStartChangeHandler.bind(this);
    this._dateEndChangeHandler = this._dateEndChangeHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);

    this._formSubmitHandler = this._formSubmitHandler.bind(this);

    this._setInnerHandlers();
  }

  reset(event) {
    this.updateData(event);
  }

  setSaving() {
    this._isSaving = true;
    this._isDisabled = true;
    this.updateElement();
  }

  setDatePickers() {
    this.destroyDatePickers();
    this._datePickerStart = this._createDatePicker('#event-start-time-1', this._dateStartChangeHandler);
    this._datePickerEnd = this._createDatePicker(
      '#event-end-time-1',
      this._dateEndChangeHandler,
      {
        minDate: formatInputDate(this._data.start),
        defaultDate: formatInputDate(this._data.end),
      },
    );
  }

  destroyDatePickers() {
    if (this._datePickerStart) {
      this._datePickerStart.destroy();
      this._datePickerStart = null;
    }

    if (this._datePickerEnd) {
      this._datePickerEnd.destroy();
      this._datePickerEnd = null;
    }
  }

  setFormSubmitHandler(cb) {
    this._callbacks.formSubmit = cb;
    this.getElement().addEventListener('submit', this._formSubmitHandler);
  }

  _showOfflineNotification() {
    showOfflineNotification(this.getElement());
  }

  _createDatePicker(selector, onChangeHandler, options) {
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

  _getOffersForEventType() {
    const eventTypeOffers = this._availableOffers.find(((offer) => offer.type === this._data.type));

    if (eventTypeOffers) {
      return [...eventTypeOffers.offers];
    }

    return [];
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

  _setEventOfferClickHandler() {
    const elements = this.getElement().querySelectorAll('.event__offer-checkbox');

    elements.forEach((element) => {
      element.addEventListener('click', this._eventOfferClickHandler);
    });
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

  _priceInputHandler(evt) {
    evt.preventDefault();
    const {value: price} = evt.target;

    this.updateData({price: parseInt(price)}, false);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();

    if (!isOnline()) {
      this.shake(() => {});
      this._showOfflineNotification();
      return;
    }

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
    this.setDatePickers();
  }

  _dateEndChangeHandler([date]) {
    this.updateData({
      end: date.toISOString(),
    }, false);
    this.setDatePickers();
  }
}

export default BaseEvent;
