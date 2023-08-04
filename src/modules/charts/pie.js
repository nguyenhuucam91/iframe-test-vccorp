import api from '../../api'
import ApiNotFoundError from '../../errors/ApiNotFoundError';

const ChartPie = {
  init: function () {
    return {
      apiUrl: '',
      chartOptions: {
        title: {
          text: 'My chart',
          align: 'left'
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
      },
    }
  },
  
  //actions
  drawAt: async (whichChart, elementId) => {
    const { apiUrl, chartOptions } = whichChart
    try {
      if (!apiUrl) {
        throw new ApiNotFoundError('Pie chart api url không được để trống');
      }
      const data = await api.get(apiUrl)

    } catch (e) {
      console.error(e)
    }
  }
}

export default ChartPie