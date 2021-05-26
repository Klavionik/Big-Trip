import AbstractView from './abstract-view';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {formatDuration} from '../utils/dates';


const createStatsTemplate = () => {
  return `<section class="statistics hidden">
          <h2 class="visually-hidden">Trip statistics</h2>

          <div class="statistics__item statistics__item--money">
            <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
          </div>

          <div class="statistics__item statistics__item--transport">
            <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
          </div>

          <div class="statistics__item statistics__item--time-spend">
            <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
          </div>
        </section>`;
};

const _getChartOptions = ({text, labels, data, formatter}) => {
  return {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
        barThickness: 44,
        minBarLength: 50,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter,
        },
      },
      title: {
        display: true,
        text: text,
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  };
};

class Stats extends AbstractView {
  constructor() {
    super();
    this._BAR_HEIGHT = 55;

    this._moneyCtx = this.getElement().querySelector('.statistics__chart--money');
    this._typeCtx = this.getElement().querySelector('.statistics__chart--transport');
    this._timeSpendCtx = this.getElement().querySelector('.statistics__chart--time');

    this._moneyChart = null;
    this._typeChart = null;
    this._timeSpendChart = null;
  }

  getTemplate() {
    return createStatsTemplate();
  }

  hide() {
    super.hide();
    this._destroy();
  }

  draw({moneyStats, typeStats, timeSpendStats}) {
    // количество лейблов будет одинаковым в любом объекте, берем первый
    const labelsCount = Object.keys(moneyStats).length;
    this._setCtxHeight(labelsCount);

    this._drawMoneyStats(this._prepareData(moneyStats));
    this._drawTypeStats(this._prepareData(typeStats));
    this._drawTimeSpendStats(this._prepareData(timeSpendStats));
  }

  _drawMoneyStats({labels, data}) {
    this._moneyCtx.height = this._BAR_HEIGHT * labels.length;
    this._moneyChart = new Chart(this._moneyCtx, _getChartOptions({
      text: 'MONEY',
      labels: labels,
      data: data,
      formatter: (val) => `€ ${val}`,
    }));
  }

  _drawTypeStats({labels, data}) {
    this._typeChart = new Chart(this._typeCtx, _getChartOptions({
      text: 'TYPE',
      labels: labels,
      data: data,
      formatter: (val) => `${val}x`,
    }));
  }

  _drawTimeSpendStats({labels, data}) {
    this._timeSpendChart = new Chart(this._timeSpendCtx, _getChartOptions({
      text: 'TIME-SPEND',
      labels: labels,
      data: data,
      formatter: formatDuration,
    }));
  }

  _prepareData(stats) {
    const labels = Object.keys(stats);
    const data = labels.map((label) => stats[label.toLowerCase()]).sort((a, b) => b - a);

    return {labels, data};
  }

  _setCtxHeight(labelsCount) {
    this._moneyCtx.height = this._BAR_HEIGHT * labelsCount;
    this._typeCtx.height = this._BAR_HEIGHT * labelsCount;
    this._timeSpendCtx.height = this._BAR_HEIGHT * labelsCount;
  }

  _destroy() {
    if (this._timeSpendChart) {
      this._timeSpendChart.destroy();
    }

    if (this._typeChart) {
      this._typeChart.destroy();
    }

    if (this._moneyChart) {
      this._moneyChart.destroy();
    }
  }
}

export default Stats;
