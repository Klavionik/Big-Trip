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

  updateEvent(updatedEvent) {
    const eventIndex = this._events.findIndex(({id}) => id === updatedEvent.id);

    if (eventIndex !== -1) {
      this._events[eventIndex] = updatedEvent;
    }
  }
}

export default Events;
