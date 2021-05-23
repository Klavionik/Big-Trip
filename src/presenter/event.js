import EventItem from '../view/event-item';
import EventEditForm from '../view/event-edit-form';
import {remove, render, replace} from '../utils/common';
import {ActionType, RedrawScope} from '../const';

const Mode = {
  VIEW: 'VIEW',
  EDIT: 'EDIT',
};

class Event {
  constructor(eventList, updateData, updateMode, offersModel, destinationsModel) {
    this._eventList = eventList;
    this._updateData = updateData;

    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;

    this._event = null;
    this._eventItem = null;
    this._eventEditForm = null;

    this._mode = Mode.VIEW;
    this._updateMode = updateMode;

    this._replaceItemWithForm = this._replaceItemWithForm.bind(this);
    this._replaceFormWithItem = this._replaceFormWithItem.bind(this);
    this._closeOnEscape = this._closeOnEscape.bind(this);
    this._handleIsFavorite = this._handleIsFavorite.bind(this);
    this._handleDestination = this._handleDestination.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleDelete = this._handleDelete.bind(this);
  }

  initialize(event) {
    this._event = event;

    const previousEventItem = this._eventItem;
    const previousEventEditForm = this._eventEditForm;

    const offers = this._offersModel.getOffers();
    const availableDestinations = this._destinationsModel.getDestinations();

    this._eventItem = new EventItem(event);
    this._eventEditForm = new EventEditForm(event, offers, availableDestinations);

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

  destroy() {
    remove(this._eventItem);
    remove(this._eventEditForm);
  }

  _replaceItemWithForm() {
    replace(this._eventItem, this._eventEditForm);
    document.addEventListener('keydown', this._closeOnEscape);
    this._updateMode();
    this._mode = Mode.EDIT;
    this._eventEditForm.setDatepickers();
  }

  _replaceFormWithItem() {
    this._eventEditForm.reset(this._event);
    replace(this._eventEditForm, this._eventItem);
    document.removeEventListener('keydown', this._closeOnEscape);
    this._mode = Mode.VIEW;
    this._eventEditForm.destroyDatepickers();
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
    this._eventEditForm.setDeleteClickHandler(this._handleDelete);
    this._eventEditForm.setDestinationChangeHandler(this._handleDestination);
  }

  _handleDestination(data) {
    if (this._event.destination === data.destination) {
      return;
    }

    const description = this._destinationsModel.getDescription(data.destination);
    this._eventEditForm.updateData({...data, description: description});
  }

  _handleIsFavorite() {
    this._updateData(
      ActionType.UPDATE,
      RedrawScope.ITEM,
      {...this._event, isFavorite: !this._event.isFavorite},
    );
  }

  _handleSubmit(data) {
    this._updateData(
      ActionType.UPDATE,
      RedrawScope.LIST,
      {...this._event, ...data},
    );
    this._replaceFormWithItem();
  }

  _handleDelete(data) {
    this._updateData(
      ActionType.DELETE,
      RedrawScope.LIST,
      data,
    );
  }
}

export default Event;
