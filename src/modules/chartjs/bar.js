import api from '../../api'
import ApiNotFoundError from '../../errors/ApiNotFoundError';
import Chart from 'chart.js/auto';

const ChartBar = {
  init: function () {
    return {
      apiUrl: ''
    }
  },

  drawAt: async function (whichChart, elementId) {
    const { apiUrl } = whichChart
    try {
      if (!apiUrl) {
        throw new ApiNotFoundError('Bar chart api url không được để trống');
      }
      const data = await api.get(apiUrl || ChartBar.init().apiUrl)

      if (Chart.getChart(elementId)) {
        // @ts-ignore
        Chart.getChart(elementId).destroy()
      }

      return new Chart(elementId, {
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