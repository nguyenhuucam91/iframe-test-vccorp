import api from '../../api'
import ApiNotFoundError from '../../errors/ApiNotFoundError';
import './number.scss'

let ChartNumber = {
    init: function () {
        return {};
    },
    drawAt: async function (chartId) {

        let apiUrl = 'https://cdp-reporting.admicro.vn/api/v1/chart/public/query-data-by-condition/{CHART_ID}';
        apiUrl = apiUrl.replace('{CHART_ID}', chartId);
        const body = {
            filters: []
        };
        try {
            if (!apiUrl) {
                throw new ApiNotFoundError('Bar chart api url không được để trống');
            }
            const data = await api.post(apiUrl, body);
            const schema = data.chart.schema;
            const dataValue = data.chart.data;

            if (data?.status === 1) {
                let indexSelectedData;
                let optionSeparator;
                let resultDataNumber = '';
                indexSelectedData = data?.chart?.config?.chart?.indexSelectedShowDataNumber ?? 0;
                optionSeparator = data?.chart?.config?.chart?.separatorStyle ?? '100,000.00';
                const numberValue = dataValue[0][schema[indexSelectedData]?.field_alias] ?? 0;
                switch (optionSeparator) {
                    case "100,000.00" :
                        resultDataNumber = numberValue.toLocaleString().replace(/\.00$/, '');
                        break;
                    case "100 000,00" :
                        resultDataNumber = numberValue.toLocaleString().replace(/,/g, ' ');
                        break;
                    case "100.000,00" :
                        resultDataNumber = numberValue.toLocaleString('de-DE').replace(/\.00$/, '');
                        break;
                    case "100000.00" :
                    case "collapse" :
                        resultDataNumber = numberValue;
                        break;
                    case "100'000.00" :
                        resultDataNumber = numberValue.toLocaleString().replace(/,/g, "'");
                        break;
                }
                const sectionChartNumber = document.createElement("div");
                sectionChartNumber.setAttribute('class', `chart-number`);
                const textValue = document.createElement("b");
                textValue.setAttribute('class', `label-value-number`);
                textValue.textContent = resultDataNumber;
                const textLabel = document.createElement("p");
                textLabel.setAttribute('class', `text-label`);
                textLabel.textContent = schema[indexSelectedData]?.field_mapping;
                // Thêm phần tử <b> vào phần tử number
                sectionChartNumber.appendChild(textValue);
                sectionChartNumber.appendChild(textLabel);
                let domNumber = document.getElementById(`chart-item-${chartId}`);
                domNumber.innerHTML = '';
                domNumber.appendChild(sectionChartNumber);
            }
        } catch (e) {
            console.error(e)
        }
    }
}

export default ChartNumber