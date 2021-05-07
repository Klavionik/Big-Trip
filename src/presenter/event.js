import EventItem from '../view/event-item';
import EventEditForm from '../view/event-edit-form';
import {remove, render, replace} from '../utils/common';

const Mode = {
  VIEW: 'VIEW',
  EDIT: 'EDIT',
};

class Event {
  constructor(eventList, updateData, updateMode) {
    this._eventList = eventList;
    this._updateData = updateData;

    this._event = null;
    this._eventItem = null;
    this._eventEditForm = null;

    this._mode = Mode.VIEW;
    this._updateMode = updateMode;

    this._replaceItemWithForm = this._replaceItemWithForm.bind(this);
    this._replaceFormWithItem = this._replaceFormWithItem.bind(this);
    this._closeOnEscape = this._closeOnEscape.bind(this);
    this._handleIsFavorite = this._handleIsFavorite.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
  }

  initialize(event) {
    this._event = event;

    const previousEventItem = this._eventItem;
    const previousEventEditForm = this._eventEditForm;

    this._eventItem = new EventItem(event);
    this._eventEditForm = new EventEditForm(event);

    this._setEventItemHandlers();
    this._setEventEditFormHandlers();

    if (previousEventItem == null || previousEventEditForm == null) {
      render(this._eventList, this._eventItem);
      return;
    }

    if (this._mode === Mode.VIEW) {
      replace(previousEventItem, this._eventItem);
    }

    if (this._mode === Mode.EDIT) {
      replace(previousEventEditForm, this._eventEditForm);
    }

    remove(previousEventItem);
    remove(previousEventEditForm);
  }

  resetView() {
    if (this._mode === Mode.EDIT) {
      this._replaceFormWithItem();
    }
  }

  _replaceItemWithForm() {
    replace(this._eventItem, this._eventEditForm);
    document.addEventListener('keydown', this._closeOnEscape);
    this._updateMode();
    this._mode = Mode.EDIT;
  }

  _replaceFormWithItem() {
    this._eventEditForm.reset(this._event);
    replace(this._eventEditForm, this._eventItem);
    document.removeEventListener('keydown', this._closeOnEscape);
    this._mode = Mode.VIEW;
  }

  _closeOnEscape(evt) {
    if (evt.code === 'Escape') {
      this._replaceFormWithItem();
    }
  }

  _setEventItemHandlers() {
    this._eventItem.setRollupClickHandler(this._replaceItemWithForm);
    this._eventItem.setIsFavoriteClickHandler(this._handleIsFavorite);
  }

  _setEventEditFormHandlers() {
    this._eventEditForm.setRollupClickHandler(this._replaceFormWithItem);
    this._eventEditForm.setSubmitHandler(this._handleSubmit);
  }

  _handleIsFavorite() {
    this._updateData({...this._event, isFavorite: !this._event.isFavorite});
  }

  _handleSubmit(data) {
    this._updateData({...this._event, ...data});
    this._replaceFormWithItem();
  }
}

export default Event;
