import Observer from '../utils/observer';

class Events extends Observer {
  constructor() {
    super();
    this._events = [];
  }

  getEvents() {
    return this._events;
  }

  setEvents(redrawScope, events) {
    this._events = [...events];
    this._notify(redrawScope);
  }

  addEvent(redrawScope, data) {
    this._events = [...this._events, data];
    this._notify(redrawScope, data);
  }

  updateEvent(redrawScope, data) {
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

  deleteEvent(redrawScope, data) {
    const index = this._events.findIndex(({id}) => id === data.id);

    if (index !== -1) {
      this._events = [...this._events.slice(0, index), ...this._events.slice(index + 1)];
      this._notify(redrawScope);
    }
  }

  static convertFromServer(event) {
    const {offers, destination} = event;

    return {
      id: event.id,
      type: event.type,
      destination: destination.name,
      description: {
        text: destination.description,
        photos: destination.pictures,
      },
      start: event['date_from'],
      end: event['date_to'],
      price: event['base_price'],
      offers: offers,
      isFavorite: event['is_favorite'],
    };
  }

  static convertToServer(event) {
    const convertedEvent = {
      type: event.type,
      destination: {
        name: event.destination,
        description: event.description.text,
        pictures: event.description.photos,
      },
      'date_from': event.start,
      'date_to': event.end,
      'base_price': event.price,
      offers: event.offers,
      'is_favorite': event.isFavorite,
    };

    if (event.id) {
      convertedEvent.id = event.id;
    }

    return convertedEvent;
  }
}

export default Events;
