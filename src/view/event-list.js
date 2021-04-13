import {createElement} from '../utils/common';

const createEventListTemplate = () => {
  return '<ul class="trip-events__list"></ul>';
};

class EventList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createEventListTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export default EventList;
