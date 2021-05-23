import {remove, render} from '../utils/common';
import {ActionType, RedrawScope} from '../const';
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
    this._handleDestinationChange = this._handleDestinationChange.bind(this);
  }

  initialize(cb, event) {
    this._cancelCallback = cb;

    if (!event) {
      event = this._getDefaultEvent();
    }

    const availableOffers = this._offersModel.getOffers();
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
    this._eventNewForm.destroyDatepickers();
    this._eventNewForm = null;

    document.removeEventListener('keydown', this._closeOnEscape);
  }

  setViewSaving() {
    this._eventNewForm.setSaving();
  }

  setViewAborted() {
    this._eventNewForm.setAborted();
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
    this._eventNewForm.setDestinationChangeHandler(this._handleDestinationChange);
  }

  _handleDestinationChange(data) {
    const description = this._destinationsModel.getDescription(data.destination);
    this._eventNewForm.updateData({...data, description: description});
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
      RedrawScope.LIST,
      {...data, isFavorite: false},
    );
  }

  _handleCancel() {
    this.destroy();
  }

}

export default EventNew;
