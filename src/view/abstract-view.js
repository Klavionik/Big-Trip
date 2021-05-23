import {createElement} from '../utils/common';

const SHAKE_ANIMATION_TIMEOUT = 600;

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

  hide() {
    this.getElement().classList.add('hidden');
  }

  show() {
    this.getElement().classList.remove('hidden');
  }

  removeElement() {
    this._element = null;
  }

  shake(callback) {
    this.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      this.getElement().style.animation = '';
      callback();
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}

export default AbstractView;
