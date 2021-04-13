const createElement = (html) => {
  const container = document.createElement('template');
  container.innerHTML = html;

  return container.content.firstElementChild;
};

const render = (container, element, position = 'beforeend') => {
  container.insertAdjacentElement(position, element);
};

export {createElement, render};
