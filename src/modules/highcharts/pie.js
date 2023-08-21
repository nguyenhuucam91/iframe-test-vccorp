import HighCharts from "highcharts";
import api from '../../api'
import {environment} from "../../environments/environment";
import chartService from "../services/chartService";
import Base from "../_base/base";

const defaultColor = environment.typeColor;

let idReport;
let idChart;
const dataConditionForIsConfig = [];

const dataResult = {
    data: [], schema: []
};

const chartConfig = {
    xAxisData: [],
    yAxisData: [],
    legendData: [],
    valueData: [],
    pieData: [],
    colorChartPie: [],
    showDataLabel: false,
    showLegend: true,
    configLegendPie: [],
    optionLegend: 'bottom',
    goalLineData: {
        enabled: false, value: 0
    }
};

const chartOptions = {
    chart: {
        plotBackgroundColor: null, plotBorderWidth: null, plotShadow: false, type: 'pie', events: {
            render() {
                let total = this.series[0].data.reduce(function (sum, point) {
                    return sum + point.y;
                }, 0);
                total = chartService.formatNumber(total);
                const renderer = this.renderer;
                if (this.totalLabel) {
                    this.totalLabel.destroy();
                }
                if (total && Number(total) !== 0) {
                    this.totalLabel = renderer.label('Total: ' + total, (2 * (this.plotLeft - 40) + this.plotWidth) / 2, this.plotTop + this.plotHeight / 2 - 15)
                        .css({
                            color: 'black',
                            fontSize: '12px',
                            textAlign: 'center',
                            fontFamily: 'Arial, sans-serif',
                            fontWeight: 'bold',
                        })
                        .attr({
                            padding: 10, // Tùy chỉnh khoảng cách văn bản với biểu đồ
                            fill: 'rgba(255, 255, 255, 0.75)', // Màu nền của văn bản
                            zIndex: 1000 // Đảm bảo văn bản nằm trên biểu đồ
                        })
                        .add();
                }

            },
        }
    }, title: {
        text: '', align: 'center', verticalAlign: 'middle', y: 0,
    }, credits: {
        enabled: false,
    }, tooltip: {}, accessibility: {
        point: {
            valueSuffix: '%'
        }
    }, plotOptions: {
        series: {}, pie: {
            allowPointSelect: true, cursor: 'pointer', dataLabels: {
                enabled: false, formatter() {
                    // Xử lý để cắt nhãn dữ liệu khi vượt quá 10 ký tự
                    const truncatedName = chartService.truncatedName(this.point.name);
                    const percentage = this.point.percentage?.toFixed(2);
                    // Gọi hàm labelFormatter và sử dụng this.point để truy cập vào các thuộc tính của điểm dữ liệu
                    return truncatedName + ' (' + percentage + '%)';
                }
            }, showInLegend: false,
        }, startAngle: -90, endAngle: -180, center: [50, 50], size: '100%',
    }, legend: {
        enabled: true,
        itemMarginBottom: 7,
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'bottom',
        labelFormatter() {
            if (this.percentage === 0 || this.percentage === 100) {
                return this.name + ': ' + this.percentage + '%';
            } else {
                const threshold = 0.01;
                const roundedPercentage = this.percentage % 1 < threshold ? this.percentage.toFixed(0) : this.percentage.toFixed(2);
                let truncatedName;
                if (chartConfig.optionLegend === 'bottom') {
                    truncatedName = this.name;
                } else {
                    truncatedName = chartService.truncatedName(this.name);
                }
                return '<b>' + truncatedName + '</b>: ' + '(' + chartService.customFormatNumber(roundedPercentage, this.percentage % 1 < threshold ? 0 : 2) + '%)';
            }
        }
    }, series: [], exporting: {
        enabled: false, // hide button
    }
}

const ChartPie = {
    listChartId: [],
    init: function () {
        return {
            chartId: '', apiUrl: ''
        }
    }, //actions
    drawAt: async (chartId, reportId) => {
        idReport = reportId;
        idChart = chartId;

        try {
            ChartPie.listChartId.push(chartId);
            setTimeout(() => {
                const checkPosition = Base.handleLazyLoadChart(chartId);
                if (checkPosition) {
                    ChartPie.getData(chartId);
                }
            }, 300);

            addEventListener("scroll", (event) => {
                const subscribeScroll = Base.handleLazyLoadChart(chartId);
                if (subscribeScroll) {
                    ChartPie.getData(chartId);
                }
            });

        } catch (e) {
            console.error(e)
        }
    }, getData: async function (chartId) {
        if (ChartPie.listChartId.includes(chartId)) {
            let apiUrl = 'https://cdp-reporting.admicro.vn/api/v1/chart/public/query-data-by-condition/{CHART_ID}';
            apiUrl = apiUrl.replace('{CHART_ID}', chartId);
            const body = {
                filters: []
            };

            const index = ChartPie.listChartId.indexOf(chartId);
            if (index > -1) {
                ChartPie.listChartId.splice(index, 1);
            }

            Base.setLoading(true);
            const data = await api.post(apiUrl, body);
            Base.setLoading(false);
            if (data?.status === 1) {

                ChartPie.handleData(data.chart, chartId);
            }
        }
    }, handleData: function (result, chartId) {
        dataResult.data = result?.data ?? [];
        dataResult.schema = result?.schema ?? [];

        chartConfig.legendData = result?.config?.chart?.legendData;
        chartConfig.optionLegend = result?.config.chart?.optionLegend;
        chartConfig.valueData = result?.config?.chart?.valueData;
        chartConfig.showLegend = result?.config?.chart?.showLegend;
        chartConfig.showDataLabel = result?.config?.chart?.showDataLabel;
        chartConfig.pieData = result?.config?.chart?.pieData ?? [];
        chartConfig.colorChartPie = result?.config?.chart?.colorChartPie ?? [];
        chartConfig.configLegendPie = result?.config?.chart?.configLegendPie ?? [];

        const data = dataResult.data;
        const schema = dataResult.schema;
        const xAxisData = chartConfig.legendData ? chartConfig.legendData[0] : null;
        const yAxisData = chartConfig.valueData ? chartConfig.valueData : null;

        const xSchema = schema ? schema.find(e => xAxisData && xAxisData?.fieldAlias === e?.field_alias) : null;

        let dataField = null;

        if (xAxisData == null || yAxisData == null || xSchema == null) {
            return;
        }
        chartOptions.plotOptions.series = {
            point: {
                events: {
                    click(event) {
                        chartService.redirectLinkChart(event.point.options?.schema, event.point.options?.originalName, idChart, idReport, dataConditionForIsConfig);
                    }
                }
            }
        };
        chartOptions.legend.layout = chartConfig?.optionLegend !== 'bottom' && typeof chartConfig?.optionLegend !== 'undefined' ? 'vertical' : 'horizontal';
        chartOptions.legend.align = chartConfig?.optionLegend !== 'bottom' && typeof chartConfig?.optionLegend !== 'undefined' ? chartConfig?.optionLegend : 'center';
        chartOptions.legend.verticalAlign = chartConfig?.optionLegend !== 'bottom' && typeof chartConfig?.optionLegend !== 'undefined' ? 'middle' : 'bottom';
        chartOptions.legend.enabled = chartConfig.showLegend;
        chartOptions.plotOptions.pie.showInLegend = chartConfig.showLegend;
        chartOptions.plotOptions.pie.dataLabels.enabled = chartConfig.showDataLabel;
        chartOptions.series = [];
        data.sort((a, b) => {
            if (chartConfig.configLegendPie) {
                const nameA = chartConfig.configLegendPie.find(legend => legend.name === a[schema[0].field_alias]);
                const nameB = chartConfig.configLegendPie.find(legend => legend.name === b[schema[0].field_alias]);
                if (nameA && nameB) {
                    return chartConfig.configLegendPie.indexOf(nameA) - chartConfig.configLegendPie.indexOf(nameB);
                }
                return 0;
            }
        });

        dataField = data;

        if (chartConfig.configLegendPie) {
            data.forEach((value, index) => {
                if (!chartConfig.configLegendPie[index]?.color && chartConfig.configLegendPie[index]) {
                    const colorIndex = Number(index) % (defaultColor.length - 1); // Lấy vị trí của màu tương ứng
                    const color = defaultColor[colorIndex + 1]; // Lấy mã màu từ mảng colors
                    if (Number(index) > defaultColor.length - 2) {
                        chartConfig.configLegendPie[index].color = randomColor(defaultColor);
                    } else {
                        chartConfig.configLegendPie[index].color = color.value;
                    }
                }
            });
        }

        const mergedArray = data.map((item, index) => {
            if (!data[index].color) {
                const colorIndex = Number(index) % (defaultColor.length - 1); // Lấy vị trí của màu tương ứng
                const color = defaultColor[colorIndex + 1]; // Lấy mã màu từ mảng colors
                if (Number(index) > defaultColor.length - 2) {
                    data[index].color = randomColor(defaultColor);
                } else {
                    data[index].color = color.value;
                }
            }
            const name = item[schema[0].field_alias];
            const configItem = chartConfig.configLegendPie ? chartConfig.configLegendPie.find(config => config.name === name) : null;
            return {
                ...item,
                name: configItem ? configItem.name : null,
                color: configItem ? configItem.color : item.color,
                customLabel: configItem ? configItem.customLabel : null
            };
        });
        dataField = mergedArray;
        const yAxis = yAxisData[0], ySchema = schema.find(item => {
            return item.field_alias === yAxis.fieldAlias;
        });
        const seriesData = {
            colorByPoint: true, data: [], color: undefined, type: 'pie', innerSize: '50%',
        };
        for (const z in data) {
            if (!data[z].color) {
                const colorIndex = Number(z) % (defaultColor.length - 1); // Lấy vị trí của màu tương ứng
                const color = defaultColor[colorIndex + 1]; // Lấy mã màu từ mảng colors
                if (Number(z) > defaultColor.length - 2) {
                    data[z].color = randomColor(defaultColor);
                } else {
                    data[z].color = color.value;
                }
            }
            if (typeof dataField !== 'undefined') {
                seriesData.data.push({
                    y: dataField[z][ySchema?.field_alias],
                    name: dataField[z]?.customLabel ? dataField[z]?.customLabel : data[z][xSchema?.field_alias],
                    color: dataField[z] ? dataField[z]?.color : data[z]?.color,
                    schema: xSchema ?? null,
                    originalName: dataField[z].name ?? ''
                });
            } else {
                seriesData.data.push({
                    y: data[z][ySchema?.field_alias],
                    name: data[z][xSchema?.field_alias],
                    color: data[z]?.color ? data[z]?.color : 'red',
                    schema: xSchema ?? null,
                    originalName: data[z].name ?? ''
                });
            }
        }

        chartOptions.series.push(seriesData);
        ChartPie.createChart(chartId);
    }, createChart: function (chartId) {
        HighCharts.chart(`chart-item-${chartId}`, chartOptions)
    },
}

export default ChartPie