import AbstractView from './abstract-view';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {TYPES} from '../const';
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
          barThickness: 44,
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
          minBarLength: 50,
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
    this._labels = TYPES.map((type) => type.toUpperCase());

    this._moneyCtx = this.getElement().querySelector('.statistics__chart--money');
    this._typeCtx = this.getElement().querySelector('.statistics__chart--transport');
    this._timeSpendCtx = this.getElement().querySelector('.statistics__chart--time');

    this._moneyCtx.height = this._BAR_HEIGHT * this._labels.length;
    this._typeCtx.height = this._BAR_HEIGHT * this._labels.length;
    this._timeSpendCtx.height = this._BAR_HEIGHT * this._labels.length;

    this._moneyChart = null;
    this._typeChart = null;
    this._timeSpendChart = null;
  }

  getTemplate() {
    return createStatsTemplate();
  }

  _drawMoneyStats(data) {
    this._moneyChart = new Chart(this._moneyCtx, _getChartOptions({
      text: 'MONEY',
      labels: this._labels,
      data: this._labels.map((label) => data[label.toLowerCase()]),
      formatter: (val) => `€ ${val}`,
    }));
  }

  _drawTypeStats(data) {
    this._typeChart = new Chart(this._typeCtx, _getChartOptions({
      text: 'TYPE',
      labels: this._labels,
      data: this._labels.map((label) => data[label.toLowerCase()]),
      formatter: (val) => `${val}x`,
    }));
  }

  _drawTimeSpendStats(data) {
    this._timeSpendChart = new Chart(this._timeSpendCtx, _getChartOptions({
      text: 'TIME-SPEND',
      labels: this._labels,
      data: this._labels.map((label) => data[label.toLowerCase()]),
      formatter: formatDuration,
    }));
  }

  hide() {
    super.hide();
    this._destroy();
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

  draw({moneyStats, typeStats, timeSpendStats}) {
    this._drawMoneyStats(moneyStats);
    this._drawTypeStats(typeStats);
    this._drawTimeSpendStats(timeSpendStats);
  }
}

export default Stats;
