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
}

export default Events;
