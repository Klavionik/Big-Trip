import Observer from '../utils/observer';

class Events extends Observer {
  constructor() {
    super();
    this._events = [];
  }

  getEvents() {
    return this._events;
  }

  setEvents(events) {
    this._events = [...events];
  }

  addEvent(updateType, data) {
    this._events = [...this._events, data];
    this._notify(updateType, data);
  }

  updateEvent(updateType, data) {
    const index = this._events.findIndex(({id}) => id === data.id);

    if (index !== -1) {
      this._events = [
        ...this._events.slice(0, index),
        data,
        ...this._events.slice(index + 1),
      ];
      this._notify(updateType, data);
    }
  }

  deleteEvent(updateType, data) {
    const index = this._events.findIndex(({id}) => id === data.id);

    if (index !== -1) {
      this._events = [...this._events.slice(0, index), ...this._events.slice(index + 1)];
      this._notify(updateType);
    }
  }
}

export default Events;
