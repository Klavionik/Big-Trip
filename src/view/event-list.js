import AbstractView from './abstract-view';

const createEventListTemplate = () => {
  return '<ul class="trip-events__list"></ul>';
};

class EventList extends AbstractView {
  getTemplate() {
    return createEventListTemplate();
  }
}

export default EventList;
