import Observer from '../utils/observer';

class Offers extends Observer {
  constructor() {
    super();
    this._offers = [];
  }

  getItems() {
    return [...this._offers];
  }

  setItems(offers) {
    this._offers = [...offers];
  }

}

export default Offers;
