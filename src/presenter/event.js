import EventItem from '../view/event-item';
import EventEditForm from '../view/event-edit-form';
import {render, replace} from '../utils/common';

class Event {
  constructor(eventList, availableOffers) {
    this._eventList = eventList;
    this._availableOffers = availableOffers;

    this._eventItem = null;
    this._eventEditForm = null;

    this._replaceItemWithForm = this._replaceItemWithForm.bind(this);
    this._replaceFormWithItem = this._replaceFormWithItem.bind(this);
    this._closeOnEscape = this._closeOnEscape.bind(this);
  }

  initialize(event) {
    this._eventItem = new EventItem(event);
    this._eventEditForm = new EventEditForm(event, this._availableOffers);

    this._eventItem.setRollupClickHandler(this._replaceItemWithForm);
    this._eventEditForm.setRollupClickHandler(this._replaceFormWithItem);
    this._eventEditForm.setSubmitHandler(this._replaceFormWithItem);

    render(this._eventList, this._eventItem);
  }

  _replaceItemWithForm() {
    replace(this._eventItem, this._eventEditForm);
    document.addEventListener('keydown', this._closeOnEscape);
  }

  _replaceFormWithItem() {
    replace(this._eventEditForm, this._eventItem);
    document.removeEventListener('keydown', this._closeOnEscape);
  }

  _closeOnEscape(evt) {
    if (evt.code === 'Escape') {
      this._replaceFormWithItem();
    }
  }
}

export default Event;
