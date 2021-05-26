import AbstractView from './abstract-view';
import {MenuItem} from '../const';

const createMenuTemplate = () => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
            <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" data-path="${MenuItem.TRIP}">Table</a>
            <a class="trip-tabs__btn" href="#" data-path="${MenuItem.STATS}">Stats</a>
          </nav>`;
};

class Menu extends AbstractView {
  constructor() {
    super();

    this._menuItemClickHandler = this._menuItemClickHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate();
  }

  toggleMenuItem(item) {
    this.getElement().querySelectorAll('a').forEach((element) => {
      if (element.dataset.path === item) {
        element.classList.add('trip-tabs__btn--active');
      } else {
        element.classList.remove('trip-tabs__btn--active');
      }
    });
  }

  setMenuItemClickHandler(cb) {
    this._callbacks.menuItemClick = cb;

    const elements = this.getElement().querySelectorAll('a');
    elements.forEach((element) => element.addEventListener('click', this._menuItemClickHandler));
  }

  _menuItemClickHandler(evt) {
    evt.preventDefault();

    if (typeof this._callbacks.menuItemClick === 'function') {
      this._callbacks.menuItemClick(evt.target);
    }
  }
}

export default Menu;
