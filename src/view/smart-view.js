import AbstractView from './abstract-view';

class SmartView extends AbstractView {
  constructor(data) {
    if (new.target === SmartView) {
      throw new Error('Cannot create an instance of an abstract class.');
    }

    super();
    this._data = data;
  }

  updateData(data, redraw = true) {
    if (data) {
      this._data = {...this._data, ...data};

      if (redraw) {
        this.updateElement();
      }
    }
  }

  updateElement() {
    const previousElement = this.getElement();
    this.removeElement();

    const newElement = this.getElement();
    previousElement.replaceWith(newElement);

    this.restoreHandlers();
  }

  restoreHandlers() {
    throw new Error('Method not implemented in the abstract class.');
  }
}

export default SmartView;
