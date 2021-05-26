class Store {
  constructor(name, storage) {
    this._name = name;
    this._storage = storage;
  }

  getItems() {
    try {
      const items = this._storage.getItem(this._name);
      return JSON.parse(items) || {};
    } catch(error) {
      return {};
    }
  }

  setItems(items) {
    this._storage.setItem(this._name, JSON.stringify(items));
  }

  setItem(key, item) {
    const items = this.getItems();

    this._storage.setItem(this._name, JSON.stringify({...items, [key]: item}));
  }

  removeItem(key) {
    const items = this.getItems();

    delete items[key];

    this._storage.setItem(this._name, JSON.stringify(items));
  }
}

export default Store;
