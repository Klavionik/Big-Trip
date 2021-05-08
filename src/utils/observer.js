class Observer {
  constructor() {
    this._subscribers = [];
  }

  addSubscriber(callback) {
    this._subscribers.push(callback);
  }

  removeSubscriber(callback) {
    this._subscribers = this._subscribers
      .filter((subscriber) => subscriber !== callback);
  }

  _notify() {
    this._subscribers.forEach((subscriber) => subscriber());
  }
}

export default Observer;
