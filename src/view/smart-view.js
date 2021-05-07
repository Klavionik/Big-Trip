import AbstractView from './abstract-view';

class SmartView extends AbstractView {
  constructor(data) {
    if (new.target === SmartView) {
      throw new Error('Cannot create an instance of an abstract class.');
    }

    super();
    this._data = data;
  }

  updateData(data) {
    if (data) {
      this._data = Object.assign(
        {},
        this._data,
        data,
      );
      this.updateElement();
    }
  }

  updateElement() {
    const previousElement = this.getElement();
    this.removeElement();

    const newELement = this.getElement();
    previousElement.replaceWith(newELement);

    this.restoreHandlers();
  }

  restoreHandlers() {
    throw new Error('Method not implemented in the abstract class.');
  }
}

export default SmartView;
