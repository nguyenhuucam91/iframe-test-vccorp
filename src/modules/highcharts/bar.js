import api from '../../api'
import ApiNotFoundError from '../../errors/ApiNotFoundError';

const ChartBar = {
  init: function () {
    return {
      apiUrl: '',
      chartOptions: {
        title: {
          text: 'Alo 123123123',
          align: 'right'
        },
        tooltip: {
          valueSuffix: ' (1000 MT)'
        },
      }
    };
  },
  drawAt: async function (whichChart, elementId) {
    const { apiUrl, chartOptions } = whichChart
    try {
      if (!apiUrl) {
        throw new ApiNotFoundError('Bar chart api url không được để trống');
      }
      const data = await api.get(apiUrl)

      // @ts-ignore
      // HighCharts.chart(elementId, {
      //   chart: {
      //     type: 'column'
      //   },
      //   subtitle: {
      //     text:
      //       'Source: <a target="_blank" ' +
      //       'href="https://www.indexmundi.com/agriculture/?commodity=corn">indexmundi</a>',
      //     align: 'left'
      //   },
      //   xAxis: {
      //     categories: ['USA', 'China', 'Brazil', 'EU', 'India', 'Russia'],
      //     crosshair: true,
      //     accessibility: {
      //       description: 'Countries'
      //     }
      //   },
      //   yAxis: {
      //     min: 0,
      //     title: {
      //       text: '1000 metric tons (MT)'
      //     }
      //   },
      //   plotOptions: {
      //     column: {
      //       pointPadding: 0.2,
      //       borderWidth: 0
      //     }
      //   },
      //   series: data,
      //   ...chartOptions
      // });
    } catch (e) {
      console.error(e)
    }
  }
}

export default ChartBar