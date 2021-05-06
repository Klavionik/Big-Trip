import {
  createDescriptionTemplate,
  createDestinationListTemplate,
  createEventTypesTemplate,
  createOffersTemplate, getOffersForType
} from '../utils/event-items';
import {formatInputDate} from '../utils/dates';
import SmartView from './smart-view';
import {getRandomDescription} from '../mock/event-item';

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
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1">
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
                    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
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

    this._rollupClickHandler = this._rollupClickHandler.bind(this);
    this._submitHandler = this._submitHandler.bind(this);
    this._eventTypeClickHandler = this._eventTypeClickHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._eventOfferClickHandler = this._eventOfferClickHandler.bind(this);

    this._setEventTypeClickHandler();
    this._setDestinationChangeHandler();
    this._setEventOfferClickHandler();
  }

  getTemplate() {
    return createEventEditFormTemplate(this._data);
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

    const { value: destination } = evt.target;
    let description = null;

    if (destination.trim()) {
      description = getRandomDescription();
    }

    this.updateData({
      destination,
      description,
    });
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

  setRollupClickHandler(cb) {
    this._callbacks.rollupClick = cb;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._rollupClickHandler);
  }

  setSubmitHandler(cb) {
    this._callbacks.submit = cb;
    this.getElement().addEventListener('submit', this._submitHandler);
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

  restoreHandlers() {
    this._setInnerHandlers();
    this.setSubmitHandler(this._callbacks.submit);
    this.setRollupClickHandler(this._callbacks.rollupClick);
  }

  _setInnerHandlers() {
    this._setEventTypeClickHandler();
    this._setDestinationChangeHandler();
    this._setEventOfferClickHandler();
  }

  reset(event) {
    this.updateData(event);
  }
}

export default EventEditForm;
