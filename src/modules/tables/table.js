import api from '../../api'
import ApiNotFoundError from '../../errors/ApiNotFoundError';
import {environment} from "../../environments/environment";
// let apiUrl = environment.apiBackend.chart;

let ChartTable = {
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

                const table = document.createElement("table");
                const headerRow = document.createElement("tr");
                table.appendChild(headerRow);
                schema.forEach(item => {
                    const headerCell1 = document.createElement("th");
                    const span = document.createElement("span");
                    span.textContent = item.field_mapping;
                    headerCell1.appendChild(span);
                    headerRow.appendChild(headerCell1);
                });

                dataValue.forEach(item => {
                    const dataRow = document.createElement("tr");
                    schema.forEach(itemSchema => {
                        const dataCell = document.createElement("td");
                        const span = document.createElement("span");
                        span.textContent = item[itemSchema.field_alias] ?? null;
                        dataCell.appendChild(span);
                        dataRow.appendChild(dataCell)
                    })

                    table.appendChild(dataRow);
                });

                const domTable = document.getElementById(`chart-item-${chartId}`);

                domTable.appendChild(table);

            }
        } catch (e) {
            console.error(e)
        }
    }
}

export default ChartTable