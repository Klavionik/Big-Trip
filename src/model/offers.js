import Observer from '../utils/observer';

class Offers extends Observer {
  constructor() {
    super();
    this._offers = [];
  }

  getOffers() {
    return [...this._offers];
  }

  setOffers(offers) {
    this._offers = [...offers];
  }

}

export default Offers;
