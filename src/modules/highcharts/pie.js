import api from '../../api'
import ApiNotFoundError from '../../errors/ApiNotFoundError';
import HighCharts from "highcharts";
import {environment} from "../../environments/environment";


const dataResult = {
    data: [],
    schema: []
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
        enabled: false,
        value: 0
    }
};

const chartOptions = {
    chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie',
        events: {},
    },
    title: {
        text: '',
        align: 'center',
        verticalAlign: 'middle',
        y: 0,
    },
    credits: {
        enabled: false,
    },
    tooltip: {},
    accessibility: {
        point: {
            valueSuffix: '%'
        }
    },
    plotOptions: {
        series: {},
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: false,
                formatter() {

                }
            },
            showInLegend: false,
        },
        startAngle: -90,
        endAngle: -180,
        center: [50, 50],
        size: '100%',
    },
    legend: {
        enabled: true,
        itemMarginBottom: 7,
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'bottom',

    },
    series: [],
    exporting: {
        enabled: false, // hide button
    }
}

const defaultColor = environment.typeColor;
let apiUrl = environment.apiBackend.chart;

const ChartPie = {
    init: function () {
        return {
            chartId: '',
            apiUrl: ''
        }
    },
    //actions
    drawAt: async (chartId) => {
        apiUrl = apiUrl.replace('{CHART_ID}', chartId);
        const body = {
            filters: []
        };
        try {
            // if (!apiUrl) {
            //   throw new ApiNotFoundError('Pie chart api url không được để trống');
            // }
            const data = await api.post(apiUrl, body);
            if (data?.status === 1) {
                ChartPie.handleData(data.chart, chartId);
            }
        } catch (e) {
            console.error(e)
        }
    },
    handleData: function (result, chartId) {
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

        // tslint:disable-next-line:one-variable-per-declaration
        const yAxis = yAxisData[0],
            // tslint:disable-next-line:prefer-const
            ySchema = schema.find(item => {
                return item.field_alias === yAxis.fieldAlias;
            });
        const seriesData = {
            // name: getFieldName(yAxis),
            colorByPoint: true,
            data: [],
            color: undefined,
            type: 'pie',
            innerSize: '50%',
        };
        // tslint:disable-next-line:forin
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
                    // tslint:disable-next-line:max-line-length
                    name: dataField[z]?.customLabel ? dataField[z]?.customLabel : data[z][xSchema?.field_alias],
                    color: dataField[z] ? dataField[z]?.color : data[z]?.color,
                    // color: chartConfig.configLegendPie[z] ? chartConfig.configLegendPie[z]?.color : null,
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
    },
    createChart: function (chartId) {
        HighCharts.chart(`chart-item-${chartId}`, chartOptions)
    }
}

export default ChartPie