import api from '../../api'
import ApiNotFoundError from '../../errors/ApiNotFoundError';
import Chart from 'chart.js/auto';

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
    

      new Chart(elementId, {
        type: 'bar',
        data: {
          labels: data.map(item => item.month),
          datasets: [{
            label: '# of Votes',
            data: data.map(item => item.value),
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      })
      
    } catch (e) {
      console.error(e)
    }
  }
}

export default ChartBar