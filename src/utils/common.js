const createElement = (html) => {
  const container = document.createElement('template');
  container.innerHTML = html;

  return container.content.firstElementChild;
};

export {createElement};
