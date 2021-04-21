import AbstractView from '../view/abstract-view';

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

export {createElement, render};
