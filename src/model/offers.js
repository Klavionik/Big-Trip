import Observer from '../utils/observer';

class Offers extends Observer {
  constructor() {
    super();
    this._offers = [];
  }

  getOffers(type) {
    return [...this._offers.find(((offer) => offer.type === type)).offers];
  }

  setOffers(offers) {
    this._offers = [...offers];
  }

}

export default Offers;
