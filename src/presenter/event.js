import EventItem from '../view/event-item';
import EventEditForm from '../view/event-edit-form';
import {render} from '../utils/common';

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
    this._eventItem.getElement().replaceWith(this._eventEditForm.getElement());
    document.addEventListener('keydown', this._closeOnEscape);
  }

  _replaceFormWithItem() {
    this._eventEditForm.getElement().replaceWith(this._eventItem.getElement());
    document.removeEventListener('keydown', this._closeOnEscape);
  }

  _closeOnEscape(evt) {
    if (evt.code === 'Escape') {
      this._replaceFormWithItem();
    }
  }
}

export default Event;
