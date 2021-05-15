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

export {createElement, render, replace, remove};
