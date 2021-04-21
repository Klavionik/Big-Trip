import {createElement} from '../utils/common';

class AbstractView {
  constructor() {
    if (new.target === AbstractView) {
      throw new Error('Cannot create an instance of an abstract class.');
    }

    this._element = null;
    this._callbacks = {};
  }

  getTemplate() {
    throw new Error('Method not implemented in the abstract class.');
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

export default AbstractView;
