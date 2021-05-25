import AbstractView from './abstract-view';

const createOfflineHeaderTemplate = () => {
  return '<div class="offline-header">Offline</div>';
};

class OfflineHeader extends AbstractView {
  constructor() {
    super();
  }

  getTemplate() {
    return createOfflineHeaderTemplate();
  }
}

export default OfflineHeader;
