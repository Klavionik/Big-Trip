import {isOnline} from '../utils/common.js';

const getSyncedEvents = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.point);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return {...acc, [current.id]: current};
  }, {});
};

class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._needsSync = false;
  }

  get _isOnline() {
    return isOnline();
  }

  get needsSync() {
    return this._needsSync;
  }

  getEvents() {
    if (this._isOnline) {
      return this._api.getEvents()
        .then((events) => {
          const items = createStoreStructure(events);
          this._store.setItems(items);
          return events;
        });
    }

    const items = Object.values(this._store.getItems());

    return Promise.resolve(items);
  }

  createEvent(data) {
    if (this._isOnline) {
      return this._api.createEvent(data)
        .then((event) => {
          this._store.setItem(event.id, event);
          return event;
        });
    }

    return Promise.reject(new Error('Can\'t add event when offline'));
  }

  updateEvent(data) {
    if (this._isOnline) {
      return this._api.updateEvent(data)
        .then((event) => {
          this._store.setItem(event.id, event);
          return event;
        });
    }

    this._store.setItem(data.id, data);
    this._needsSync = true;
    return Promise.resolve(data);
  }

  deleteEvent(event) {
    if (this._isOnline) {
      return this._api.deleteEvent(event).then(() => this._store.removeItem(event.id));
    }

    return Promise.reject(new Error('Can\'t delete event when offline'));
  }

  sync() {
    if (this._isOnline) {
      const events = Object.values(this._store.getItems());

      return this._api.sync(events)
        .then((response) => {
          const updatedEvents = getSyncedEvents(response.updated);
          this._store.setItems(createStoreStructure([...updatedEvents]));
          this._needsSync = false;
        });
    }

    return Promise.reject(new Error('Can\'t synchronize events when offline'));
  }

  getOffers() {
    if (this._isOnline) {
      return this._api.getOffers();
    }

    return Promise.resolve([]);
  }

  getDestinations() {
    if (this._isOnline) {
      return this._api.getDestinations();
    }

    return Promise.resolve([]);
  }
}

export default Provider;
