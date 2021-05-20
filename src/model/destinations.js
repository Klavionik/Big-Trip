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

  static convertFromServer(destination) {
    return {
      destination: destination.name,
      description: {
        text: destination.description,
        photos: destination.pictures,
      },
    };
  }

  static convertToServer(destination) {
    return {
      name: destination.destination,
      description: destination.description.text,
      pictures: destination.description.photos,
    };
  }

}

export default Destinations;
