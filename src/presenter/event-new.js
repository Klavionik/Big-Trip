import {remove, render} from '../utils/common';
import {ActionType, UpdateType} from '../const';
import {nanoid} from 'nanoid';
import EventNewForm from '../view/event-new-form';
import {now} from '../utils/dates';

class EventNew {
  constructor(eventList, updateData, offersModel, destinationsModel) {
    this._eventList = eventList;
    this._updateData = updateData;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;

    this._eventNewForm = null;
    this._cancelCallback = null;

    this._closeOnEscape = this._closeOnEscape.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleCancel = this._handleCancel.bind(this);
    this._handleEventTypeChange = this._handleEventTypeChange.bind(this);
    this._handleDestinationChange = this._handleDestinationChange.bind(this);
  }

  initialize(cb, event) {
    this._cancelCallback = cb;

    if (!event) {
      event = this._getDefaultEvent();
    }

    const availableOffers = this._offersModel.getOffers(event.type);
    const availableDestinations = this._destinationsModel.getDestinations();

    this._eventNewForm = new EventNewForm(event, availableOffers, availableDestinations);
    this._setEventNewFormHandlers();

    render(this._eventList, this._eventNewForm, 'afterbegin');

    document.addEventListener('keydown', this._closeOnEscape);
  }

  destroy() {
    if (this._eventNewForm === null) {
      return;
    }

    if (this._cancelCallback !== null) {
      this._cancelCallback();
    }

    remove(this._eventNewForm);
    this._eventNewForm = null;

    document.removeEventListener('keydown', this._closeOnEscape);
  }

  _getDefaultEvent() {
    return {
      type: 'flight',
      destination: '',
      start: now(),
      end: null,
      price: '',
      offers: [],
      description: null,
    };
  }

  _setEventNewFormHandlers() {
    this._eventNewForm.setSubmitHandler(this._handleSubmit);
    this._eventNewForm.setCancelClickHandler(this._handleCancel);
    this._eventNewForm.setEventTypeClickHandler(this._handleEventTypeChange);
    this._eventNewForm.setDestinationChangeHandler(this._handleDestinationChange);
  }

  _handleDestinationChange(data) {
    remove(this._eventNewForm);
    const newDescription = this._destinationsModel.getDescription(data.destination);
    this.initialize(this._cancelCallback, {...data, description: newDescription});
  }

  _handleEventTypeChange(data) {
    remove(this._eventNewForm);
    this.initialize(this._cancelCallback, data);
  }

  _closeOnEscape(evt) {
    if (evt.code === 'Escape') {
      evt.preventDefault();
      this.destroy();
    }
  }

  _handleSubmit(data) {
    this._updateData(
      ActionType.ADD,
      UpdateType.MINOR,
      {id: nanoid(7), ...data},
    );
    this.destroy();
  }

  _handleCancel() {
    this.destroy();
  }

}

export default EventNew;
