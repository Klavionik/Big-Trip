import {remove, render} from '../utils/common';
import {ActionType, UpdateType} from '../const';
import {nanoid} from 'nanoid';
import EventNewForm from '../view/event-new-form';

class EventNew {
  constructor(eventList, updateData) {
    this._eventList = eventList;
    this._updateData = updateData;

    this._eventNewForm = null;
    this._cancelCallback = null;

    this._closeOnEscape = this._closeOnEscape.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleCancel = this._handleCancel.bind(this);
  }

  initialize(cb) {
    this._cancelCallback = cb;

    if (this._eventNewForm !== null) {
      return;
    }

    this._eventNewForm = new EventNewForm();
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

  _setEventNewFormHandlers() {
    this._eventNewForm.setSubmitHandler(this._handleSubmit);
    this._eventNewForm.setCancelClickHandler(this._handleCancel);
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
