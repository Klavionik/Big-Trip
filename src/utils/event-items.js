import {DESTINATIONS, OFFERS, TYPES} from '../const';

const getOffersForType = (eventType) => {
  return [...OFFERS.find(({type}) => type === eventType).offers];
};

const filterNotSelectedOffers = (eventOffers, offersForType) => {
  const notSelected = [];

  for (const offer of offersForType) {
    const isSelected = eventOffers.some((eventOffer) => eventOffer.title === offer.title);
    if (!isSelected) {
      notSelected.push(offer);
    }
  }

  return notSelected;
};

const byTitle = (a, b) => {
  const titleA = a.title.toUpperCase();
  const titleB = b.title.toUpperCase();

  if (titleA < titleB) {
    return -1;
  }

  if (titleA > titleB) {
    return 1;
  }

  return 0;
};

const generateInputNameFromTitle = (title) => {
  return title.toLowerCase().replaceAll(' ', '-');
};

const createDescriptionTemplate = (description) => {
  return description
    ? `<section class="event__section  event__section--destination">
         <h3 class="event__section-title  event__section-title--destination">Destination</h3>
         <p class="event__destination-description">${description.text}</p>
       </section>`
    : '';
};

const createOffersTemplate = (eventOffers, offersForType) => {
  const addOffers = (offers) => {
    return offers.map(({title, price, checked}) => {
      const name = generateInputNameFromTitle(title);
      return `<div class="event__offer-selector">
              <input class="event__offer-checkbox  visually-hidden" id="${name}-1" type="checkbox" name="${name}" ${checked ? 'checked' : ''}>
              <label class="event__offer-label" for="${name}-1">
                <span class="event__offer-title">${title}</span>
                &plus;&euro;&nbsp;
                <span class="event__offer-price">${price}</span>
              </label>
            </div>`;
    }).join('');
  };

  const notSelectedOffers = filterNotSelectedOffers(eventOffers, offersForType);
  const allOffers = [
    ...eventOffers.map((value) => { return {...value, checked: true}; }),
    ...notSelectedOffers.map((value) => { return {...value, checked: false}; }),
  ].sort(byTitle);

  return allOffers.length
    ? `<section class="event__section  event__section--offers">
           <h3 class="event__section-title  event__section-title--offers">Offers</h3>
           <div class="event__available-offers">
             ${addOffers(allOffers)}
           </div>
         </section>`
    : '';
};

const createDestinationListTemplate = () => {
  return DESTINATIONS.map((destination) => {
    return `<option value="${destination}"></option>`;
  });
};

const createEventTypesTemplate = (currentType) => {
  return TYPES.map((type) => {
    const checked = currentType === type ? 'checked' : '';
    return `<div class="event__type-item">
      <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type"
             value="${type}" ${checked}>
        <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-1">${type}</label>
    </div>`;
  }).join('');
};

export {
  createEventTypesTemplate,
  createDestinationListTemplate,
  createOffersTemplate,
  createDescriptionTemplate,
  getOffersForType
};
