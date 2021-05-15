import Observer from '../utils/observer';

class Destinations extends Observer {
  constructor() {
    super();
    this._destinations = [];
  }

  getDestinations() {
    return this._destinations.map((destination) => destination.destination);
  }

  getDescription(name) {
    return this._destinations.find((destination) => destination.destination === name).description;

  }

  setDestinations(destinations) {
    this._destinations = [...destinations];
  }

}

export default Destinations;
