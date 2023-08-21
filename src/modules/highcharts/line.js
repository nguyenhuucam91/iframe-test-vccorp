import api from '../../api'
import HighCharts from "highcharts";
import {environment} from "../../environments/environment";
import chartService from "../services/chartService";
import Base from "../_base/base";

const defaultColor = environment.typeColor;
let idReport;
let idChart;
let dataConditionForIsConfig = [];
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

let chartOptions = {}

const ChartLine = {
    listChartId: [],
    init: function () {
        return {
            chartId: '',
            apiUrl: ''
        }
    },
    drawAt: async (chartId, reportId) => {
        idReport = reportId;
        idChart = chartId;
        try {
            ChartLine.listChartId.push(chartId);
            setTimeout(() => {
                const checkPosition = Base.handleLazyLoadChart(chartId);
                if (checkPosition) {
                    ChartLine.getData(chartId);
                }
            }, 300);

            addEventListener("scroll", (event) => {
                const subscribeScroll = Base.handleLazyLoadChart(chartId);
                if (subscribeScroll) {
                    ChartLine.getData(chartId);
                }
            });
        } catch (e) {
            console.error(e)
        }
    },
    getData: async function (chartId) {
        if (ChartLine.listChartId.includes(chartId)) {
            let apiUrl = 'https://cdp-reporting.admicro.vn/api/v1/chart/public/query-data-by-condition/{CHART_ID}';
            apiUrl = apiUrl.replace('{CHART_ID}', chartId);
            const body = {
                filters: []
            };

            const index = ChartLine.listChartId.indexOf(chartId);
            if (index > -1) {
                ChartLine.listChartId.splice(index, 1);
            }

            Base.setLoading(true);
            const data = await api.post(apiUrl, body);
            Base.setLoading(false);
            if (data?.status === 1) {

                ChartLine.handleData(data.chart, chartId);
            }
        }
    },
    handleData: function (result, chartId) {
        dataResult.data = result?.data ?? [];
        dataResult.schema = result?.schema ?? [];
        chartConfig.xAxisData = result?.config?.chart?.xAxisData;
        chartConfig.yAxisData = result?.config?.chart?.yAxisData;
        chartConfig.colorChart = result?.config?.chart?.colorChart;
        chartConfig.typeDisplay = result?.config?.chart?.typeDisplay;
        chartConfig.xAxisName = result?.config?.chart?.xAxisName ?? '';
        chartConfig.yAxisName = result?.config?.chart?.yAxisName ?? '';
        chartConfig.yAxisNameRight = result?.config?.chart?.yAxisNameRight ?? '';
        chartConfig.showDataPoint = result?.config?.chart?.showDataPoint ?? false;
        chartConfig.showStacked = result?.config?.chart?.showStacked ?? false;
        chartConfig.goalLineData = result?.config?.chart?.goalLineData;
        chartConfig.legendData = result?.config?.chart?.legendData;
        chartConfig.legendValueItem = result?.config?.chart?.legendValueItem;
        chartService.convertDate(dataResult.schema, dataResult.data);
        if (chartConfig.legendData?.length) {
            ChartLine.initChart(chartConfig.legendData);
        } else {
            ChartLine.initChart([], chartConfig.yAxisData, dataResult.data, chartConfig.xAxisData);
        }
        const data = dataResult.data,
            schema = dataResult.schema,
            xAxisData = chartConfig.xAxisData ? chartConfig?.xAxisData[0] : null,
            yAxisData = chartConfig.yAxisData ? chartConfig?.yAxisData : null,
            xSchema = schema ? schema.find(e => xAxisData && xAxisData.fieldAlias === e.field_alias) : null;

        if (xAxisData == null || yAxisData == null || xSchema == null) {
            return;
        }

        chartOptions.series = [];

        let categories = [];

        for (const i in data) {
            categories.push(data[i][xSchema?.field_alias]);
        }

        categories = categories.filter((item, index) => {
            return categories.indexOf(item) === index;
        });

        if (chartConfig.goalLineData && typeof chartConfig.goalLineData.enabled !== 'undefined' && chartConfig.goalLineData.enabled === true) {
            chartOptions.yAxis[0].plotLines = [{
                color: '#aa0000',
                width: 2,
                zIndex: 5,
                value: chartConfig.goalLineData.value ?? 0,
                label: {
                    text: chartConfig.goalLineData.label ?? '',
                    style: {
                        color: '#aa0000'
                    }
                },
                dashStyle: 'dash'
            }];
        } else {
            chartOptions.yAxis.plotLines = [];
        }

        chartOptions.plotOptions.series = {
            stacking: 'normal',
            cursor: 'pointer',
            point: {
                events: {
                    click: function (event) {
                        chartService.redirectLinkChart(xSchema, this.category, idChart, idReport, dataConditionForIsConfig);
                    }
                }
            }
        };

        chartOptions.plotOptions.series.stacking = chartConfig.showStacked ?? 'normal';

        if (chartConfig.showStacked) {
            chartOptions.tooltip.formatter = null;
            chartOptions.plotOptions.series.stacking = chartConfig.showStacked ?? false;
            chartOptions.tooltip.pointFormat = '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.2f}%)<br/>';
        }

        chartOptions.xAxis.categories = categories;

        chartOptions.xAxis.title.text = chartConfig.xAxisName;

        chartOptions.yAxis[0].title.text = chartConfig.yAxisName;
        chartOptions.yAxis[1].title.text = chartConfig.yAxisNameRight;
        if (chartConfig.legendData && chartConfig.legendData.length > 0) {
            const resultArray = chartService.setUniqueLegendValueItem(dataResult, chartConfig);
            if (!chartService.checkArrays(resultArray, chartConfig.legendValueItem, chartConfig)) {
                // Set lại giá trị của legend value item để chúng có thể phù hợp để change color , .....
                chartService.setColorDefaultLegend(resultArray, resultArray, chartConfig);
                chartConfig.legendValueItem = resultArray;
            }
            for (const z in chartConfig.legendValueItem) {
                const seriesData = {
                    type: chartConfig?.legendValueItem ? chartConfig?.legendValueItem[z]?.typeDisplay : null,
                    name: '',
                    zIndex: chartConfig?.legendValueItem && (chartConfig?.legendValueItem[z]?.typeDisplay === '' || chartConfig?.legendValueItem[z]?.typeDisplay === 'column' || chartConfig?.legendValueItem[z]?.typeDisplay === 'bar') ? -1 : 5,
                    data: [],
                    color: chartConfig?.legendValueItem ? chartConfig?.legendValueItem[z]?.color : null,
                    dataLabels: {
                        enabled: chartConfig.showDataPoint ? chartConfig.showDataPoint : false,
                        rotation: 0,
                        color: 'black',
                        align: 'top',
                        y: 0, // 10 pixels down from the top
                        style: {
                            fontSize: '12px',
                            fontFamily: 'helvetica, arial, sans-serif',
                            textShadow: true,
                            fontWeight: 'normal'
                        },
                        formatter() {
                            // Tùy chỉnh giá trị hiển thị trong dataLabel
                            return chartService.customNumberFormat(this?.y, this?.y % 1 === 0 ? 0 : 2, ".", ",");
                        }
                    },
                };
                if (typeof chartConfig.legendValueItem !== 'undefined') {
                    seriesData.name = chartConfig.legendValueItem[z]?.customLabel || chartConfig.legendValueItem[z]?.customLabel === '' ? chartConfig.legendValueItem[z]?.customLabel : chartConfig.legendValueItem[z][chartConfig.legendData[0]?.fieldAlias];
                }
                for (const i in yAxisData) {
                    for (const j in yAxisData[i]) {
                        const dataSeries = data.filter(obj => obj[chartConfig?.legendData[0]?.fieldAlias] === chartConfig.legendValueItem[z][chartConfig?.legendData[0]?.fieldAlias]);
                        dataSeries.sort((a, b) => {
                            const indexA = categories.indexOf(a[xAxisData.fieldAlias]);
                            const indexB = categories.indexOf(b[xAxisData.fieldAlias]);
                            return indexA - indexB;
                        });
                        dataSeries.map((value, index) => {
                            seriesData.data.push(value[yAxisData[0][0].fieldAlias] ?? null);
                        });
                        chartOptions.yAxis[0].max = chartConfig.goalLineData?.enabled && chartConfig.goalLineData?.value >= Math.max(...seriesData.data) ? chartConfig.goalLineData?.value + 4 : null;
                    }
                }
                chartOptions.series.push(seriesData);
            }
        } else {
            for (const i in yAxisData) {
                for (const j in yAxisData[i]) {
                    const yAxis = yAxisData[i][j],
                        ySchema = schema.find(item => {
                            return item.field_alias === yAxis.fieldAlias;
                        });
                    if (!yAxisData[i][j]?.color) {
                        const colorIndex = Number(j) % (defaultColor.length - 1); // Lấy vị trí của màu tương ứng
                        const color = defaultColor[colorIndex + 1]; // Lấy mã màu từ mảng colors
                        yAxisData[i][j].color = color.value;
                    }
                    const seriesData = {
                        type: '',
                        name: chartService.getFieldName(yAxis),
                        yAxis: yAxisData[i][j]?.yAxis ? yAxisData[i][j]?.yAxis : 0,
                        data: [], color: null,
                        visible: yAxisData[i][j]?.visible,
                        dataLabels: {
                            enabled: chartConfig.showDataPoint ? chartConfig.showDataPoint : false,
                            rotation: 0,
                            color: 'black',
                            align: 'top',
                            y: 0, // 10 pixels down from the top
                            style: {
                                fontSize: '12px',
                                fontFamily: 'helvetica, arial, sans-serif',
                                textShadow: true,
                                fontWeight: 'normal'

                            },
                            formatter() {
                                // Tùy chỉnh giá trị hiển thị trong dataLabel
                                return chartService.customNumberFormat(this?.y, this?.y % 1 === 0 ? 0 : 2, ".", ",");
                            }
                        }
                    };
                    seriesData.color = yAxisData[i][j]?.color;
                    if (chartConfig.typeDisplay) {
                        if (typeof chartConfig.typeDisplay[i][j]?.typeDisplay !== 'undefined') {
                            seriesData.type = yAxisData[i][j]?.typeDisplay ? yAxisData[i][j]?.typeDisplay : null;
                        }
                    }
                    for (const z in data) {
                        seriesData.data.push(data[z][ySchema?.field_alias] ?? null);
                    }
                    chartOptions.yAxis[0].max = chartConfig.goalLineData?.enabled && chartConfig.goalLineData?.value >= Math.max(...seriesData.data) ? chartConfig.goalLineData?.value + 4 : null;
                    chartOptions.series.push(seriesData);
                }
            }
        }
        ChartLine.createChart(chartId);
    },
    createChart: function (chartId) {
        HighCharts.chart(`chart-item-${chartId}`, chartOptions)
    },
    initChart(legendData, data, pointData, xAxisData) {
        chartOptions = {
            chart: {
                type: 'line'
            },
            credits: {
                enabled: false,
            },
            title: {
                text: ''
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                categories: [],
                title: {
                    text: ''
                },
                labels: {
                    style: {
                        font: '12px Open Sans,sans-serif',
                        color: '#444',
                    }
                }
            },
            yAxis: [
                {
                    title: {
                        text: ''
                    },
                    gridLineColor: '#f4f6f8',
                    min: 0,
                    softMax: 0.01,
                    max: null,
                    labels: {
                        style: {
                            font: '12px Open Sans,sans-serif',
                            color: '#444',
                        }
                    },
                    plotLines: null
                },
                {
                    title: {
                        text: ''
                    },
                    opposite: true, // Đặt trục Y này ở phía bên phải
                },
            ],
            tooltip: {
                shared: true,
                useHTML: false,
                formatter() {
                    if (!legendData?.length && data && data?.length > 0) {
                        let tooltip = '';
                        data[0].forEach((value, index) => {
                            const name = chartService.getFieldName(value);
                            const dataPointInVisible = chartService.getMatchingPoint(pointData, this.points, xAxisData);
                            const pointTooltip = dataPointInVisible ? dataPointInVisible[value?.fieldAlias] : null;
                            tooltip += '<span style="color:' + value.color + '">\u25CF</span> ' + name + ': <b>' + chartService.customNumberFormat(pointTooltip, pointTooltip % 1 === 0 ? 0 : 2, ".", ",") + '</b><br/>';
                        });
                        return tooltip;
                    } else {
                        let tooltip = '<b>' + this?.x + '</b><br/>';
                        this.points.forEach((point) => {
                            tooltip += '<span style="color:' + point.color + '">\u25CF</span> ' + point.series.name + ': <b>' + chartService.customNumberFormat(point?.y, point.y % 1 === 0 ? 0 : 2, ".", ",") + '</b><br/>';
                        });
                        return tooltip;
                    }
                },
            },
            plotOptions: {
                series: {},
                area: {

                    lineWidth: 4,
                    marker: {
                        enabled: true,
                        symbol: 'circle',
                    }
                }
            },
            series: [],
            responsive: {
                rules: [{
                    condition: {
                        maxWidth: 500
                    },
                    chartOptions: {
                        legend: {
                            enabled: false
                        }
                    }
                }]
            },
            exporting: {
                enabled: false // hide button
            }
        };
    },
}

export default ChartLine