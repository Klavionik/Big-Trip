import AbstractView from '../view/abstract-view';
import {ERROR_ATTR, ERROR_MSG, RenderPosition} from '../const';

const REMOVE_DELAY = 3000;

const createElement = (html) => {
  const container = document.createElement('template');
  container.innerHTML = html;

  return container.content.firstElementChild;
};

const render = (container, child, position = 'beforeend') => {
  container = container instanceof AbstractView ? container.getElement() : container;
  child = child instanceof AbstractView ? child.getElement() : child;

  container.insertAdjacentElement(position, child);
};

const replace = (oldElement, newElement) => {
  oldElement = oldElement instanceof AbstractView ? oldElement.getElement() : oldElement;
  newElement = newElement instanceof AbstractView ? newElement.getElement() : newElement;

  oldElement.replaceWith(newElement);
};

const remove = (component) => {
  if (component === null) {
    return;
  }

  if (!(component instanceof AbstractView)) {
    throw new Error('Can only delete an instance of AbstractView.');
  }

  component.getElement().remove();
  component.removeElement();
};

const isOnline = () => {
  return navigator.onLine;
};

const setErrorOverlay = () => {
  document.body.setAttribute(ERROR_ATTR, ERROR_MSG);
  document.body.classList.add('error-overlay');
};

const showOfflineNotification = (parent) => {
  const notification = document.createElement('span');
  notification.textContent = 'Sorry, you seem to be offline';
  notification.classList.add('offline-notification');
  notification.addEventListener('click', () => notification.remove());

  render(parent, notification, RenderPosition.BEFOREBEGIN);

  setTimeout(() => notification.remove(), REMOVE_DELAY);
};

export {createElement, render, replace, remove, isOnline, setErrorOverlay, showOfflineNotification};
