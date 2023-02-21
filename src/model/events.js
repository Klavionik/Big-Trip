import Observer from '../utils/observer';

class Events extends Observer {
  constructor() {
    super();
    this._events = [];
  }

  getItems() {
    return this._events;
  }

  setItems(redrawScope, events) {
    this._events = [...events];
    this._notify(redrawScope);
  }

  addItem(redrawScope, data) {
    this._events = [...this._events, data];
    this._notify(redrawScope, data);
  }

  updateItem(redrawScope, data) {
    const index = this._events.findIndex(({id}) => id === data.id);

    if (index !== -1) {
      this._events = [
        ...this._events.slice(0, index),
        data,
        ...this._events.slice(index + 1),
      ];
      this._notify(redrawScope, data);
    }
  }

  deleteItem(redrawScope, data) {
    const index = this._events.findIndex(({id}) => id === data.id);

    if (index !== -1) {
      this._events = [...this._events.slice(0, index), ...this._events.slice(index + 1)];
      this._notify(redrawScope);
    }
  }

  static convertFromServer(destinationsModel, offersModel) {
    const destinations = destinationsModel.getItems();
    const offers = offersModel.getItems();

    return function(event) {
      const eventDestination = destinations.find((destination) => destination.id === event.destination);
      const typeOffers = offers.find((offer) => offer.type === event.type);
      const eventOffers = event.offers.map((offerId) => typeOffers.offers.find(({id}) => offerId === id));

      return {
        id: event.id,
        type: event.type,
        destination: eventDestination.destination,
        description: {
          text: eventDestination.description.text,
          photos: eventDestination.description.photos,
        },
        start: event['date_from'],
        end: event['date_to'],
        price: event['base_price'],
        offers: eventOffers,
        isFavorite: event['is_favorite'],
      };
    };
  }

  static convertToServer(destinationsModel) {
    const destinations = destinationsModel.getItems();

    return function(event) {
      const eventDestination = destinations.find((destination) => destination.destination === event.destination);

      const convertedEvent = {
        type: event.type,
        destination: eventDestination.id,
        'date_from': event.start,
        'date_to': event.end,
        'base_price': event.price,
        offers: event.offers.map(({id}) => id),
        'is_favorite': event.isFavorite,
      };

      if (event.id) {
        convertedEvent.id = event.id;
      }

      return convertedEvent;
    };
  }
}

export default Events;
