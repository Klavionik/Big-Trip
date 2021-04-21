import AbstractView from './abstract-view';

const createTripInfoTemplate = ({route, dates, cost}) => {
  return `<section class="trip-main__trip-info  trip-info">
            <div class="trip-info__main">
              <h1 class="trip-info__title">${route}</h1>

              <p class="trip-info__dates">${dates}</p>
            </div>

            <p class="trip-info__cost">
              Total: &euro;&nbsp;<span class="trip-info__cost-value">${cost}</span>
            </p>
          </section>`;
};

class TripInfo extends AbstractView {
  constructor(trip) {
    super();
    this._trip = trip;
  }

  getTemplate() {
    return createTripInfoTemplate(this._trip);
  }
}

export default TripInfo;
