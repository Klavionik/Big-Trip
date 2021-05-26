class Observer {
  constructor() {
    this._subscribers = [];
  }

  addSubscriber(callback) {
    this._subscribers.push(callback);
  }

  _notify(event, payload) {
    this._subscribers.forEach((subscriber) => subscriber(event, payload));
  }
}

export default Observer;
