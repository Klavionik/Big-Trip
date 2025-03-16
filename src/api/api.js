import {HttpMethod} from '../const';

class API {
  constructor(baseUrl) {
    this._baseUrl = baseUrl;
  }

  getEvents() {
    return this._request(HttpMethod.GET, '/points').then(API.getJSON);
  }

  createEvent(data) {
    return this._request(HttpMethod.POST, '/points', data).then(API.getJSON);
  }

  updateEvent(data) {
    return this._request(HttpMethod.PUT, `/points/${data.id}`, data).then(API.getJSON);
  }

  deleteEvent(data) {
    return this._request(HttpMethod.DELETE, `/points/${data.id}`);
  }

  getOffers() {
    return this._request(HttpMethod.GET, '/offers').then(API.getJSON);
  }

  getDestinations() {
    return this._request(HttpMethod.GET, '/destinations').then(API.getJSON);
  }

  sync(data) {
    return this._request(HttpMethod.POST, '/points/sync', data).then(API.getJSON);
  }

  _checkStatus(response) {
    if (!response.ok) {
      throw new Error(`Request error: status ${response.status}, URL ${response.url}`);
    }

    return response;
  }

  _makeHeaders({json = false}) {
    const headers = new Headers();

    if (json) {
      headers.append('Content-Type', 'application/json');
    }

    return headers;
  }

  _request(method, url, data) {
    return fetch(
      this._baseUrl + url,
      {
        method: method,
        headers: this._makeHeaders({json: !!data}),
        body: data ? JSON.stringify(data) : null,
      },
    )
      .then(this._checkStatus);
  }

  static getJSON(response) {
    return response.json();
  }
}

export default API;
