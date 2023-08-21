import ReportService from "./reportService";
import {environment} from "../../environments/environment";

const defaultColor = environment.typeColor;
import Base from "../_base/base";

const chartService = {
    getLinkChartReport(schema, data, linkChart, dataConditionForIsConfig = []) {
        if (linkChart) {
            const path = linkChart;
            const params = {};
            let key = "";
            switch (schema.data_type) {
                case 'int':
                case 'float':
                case 'long':
                    key = `,equal`;
                    break;
                case 'text':
                    key = `,is`;
                    break;
                case 'datetime':
                case 'date':
                    key = `,on`;
                    break;
                default:
                    key = `,is`;
            }
            if (schema.function !== "none" && (schema.function === 'week' || schema.function === 'year' || schema.function === 'quarter' || schema.function === 'month')) {
                key = `,on`;
            }
            const aggregation = ',none';
            let values = ',' + data;
            if (schema.function === 'week' && data !== '') {
                values = ',' + this.formatDataFuncWeek(data);
            }
            const func = ',' + schema.function;
            params[schema.field_name] = '~' + aggregation + func + key + values;
            const queryParams = Object.keys(params)
                .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(params[key]))
                .join("&");

            const url = path + (queryParams ? "?" + queryParams : "");
            let condition = '';
            if (dataConditionForIsConfig && dataConditionForIsConfig.length > 0) {
                const par = [];
                dataConditionForIsConfig.forEach(el => {
                    if (schema.field_name !== el.field_name) {
                        par.push(`${el.field_name}=${el.is_this ? 1 : '~'},${el.aggregation},${el.function},${el.operator},${el.values.join('|')}`);
                    }
                });
                condition = '&' + par.join('&');
            }
            return url + condition;
        }
    },
    formatDataFuncWeek(data) {
        const week = data.slice(0, 2);
        const year = data.slice(4, 8);
        return year + week;
    },
    formatDateWithoutMoment(dateString, format) {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return '';
        }
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        let formattedDate = format.replace('DD', day);
        formattedDate = formattedDate.replace('MM', month);
        formattedDate = formattedDate.replace('YYYY', year);

        return formattedDate;
    },
    linkChartReport(schema, data, dataTable, chartId, reportId, dataFilter) {
        const linkChart = schema.link_chart_id ?? null;
        const linkFieldAlias = schema.link_field_alias ?? null;
        let valueFilter;
        let valueSchema = null;
        if (linkFieldAlias) {
            valueFilter = data[schema.link_field_alias] ?? '';
            valueSchema = dataTable.schema.find(item => {
                return item.field_alias === linkFieldAlias;
            });
        } else {
            valueFilter = data[schema.field_alias] ?? '';
            valueSchema = schema;
        }

        if (data?.custom_destination) {
            const alias = schema.link_field_alias;
            const arrayData = [];
            dataTable?.data.forEach(item => {
                arrayData.push(item[alias]);
            });
            arrayData.pop();
            valueFilter = arrayData.join('|');
        }
        if (linkChart) {
            chartService.getConditionForIsConfigByChart(valueSchema, valueFilter, linkChart, chartId, reportId, dataFilter);
        }
    },
    formatDateTime(dateString, format) {
        const date = new Date(dateString);

        if (isNaN(date.getTime())) {
            return ''; // Trả về rỗng nếu không thể chuyển đổi thành ngày hợp lệ
        }

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hour = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        let formattedDateTime = format.replace('DD', day);
        formattedDateTime = formattedDateTime.replace('MM', month);
        formattedDateTime = formattedDateTime.replace('YYYY', year);
        formattedDateTime = formattedDateTime.replace('HH', hour);
        formattedDateTime = formattedDateTime.replace('mm', minutes);
        formattedDateTime = formattedDateTime.replace('ss', seconds);
        return formattedDateTime;
    },
    redirectLinkChart: async (schema, data, idChart, idReport, dataConditionForIsConfig) => {
        if (schema?.link_chart_id) {
            const queries = {
                isConfig: true,
                chartId: idChart ?? null,
                publicReport: 1
            };
            const result = await ReportService.getCondition(queries, idReport);
            const condition = [];
            if (result.status === 1) {
                const conditionByChart = result.data ?? [];
                if (conditionByChart.length > 0 && dataConditionForIsConfig.length > 0) {
                    this.dataConditionForIsConfig.forEach(item => {
                        conditionByChart.forEach(value => {
                            if (item.field_name === value.field_name) {
                                condition.push(item);
                            }
                        });
                    });
                }
            }
            const url = chartService.getLinkChartReport(schema, data, schema?.link_chart_id, condition);
            if (url) {
                window.open(url, "_blank");
            }
        }
    },
    customNumberFormat(number, decimals, decimalSeparator, thousandsSeparator) {
        if (typeof number !== 'number') {
            return '';
        }
        decimals = typeof decimals === 'undefined' ? 0 : decimals;
        decimalSeparator = typeof decimalSeparator === 'undefined' ? '.' : decimalSeparator;
        thousandsSeparator = typeof thousandsSeparator === 'undefined' ? ',' : thousandsSeparator;
        const roundedNumber = decimals === 0 ? Math.round(number) : parseFloat(number.toFixed(decimals));
        const parts = roundedNumber.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
        const formattedNumber = parts.join(decimalSeparator);
        return formattedNumber;
    },
    convertDate(schema, data) {
        const dateField = schema.find(e => e.data_type === 'date');
        if (typeof dateField?.field_alias !== 'undefined') {
            data.forEach(e => {
                e[dateField?.field_alias] = this.formatDateWithoutMoment(e[dateField?.field_alias], 'DD-MM-YYYY')
            });
        }
    },
    getFieldName(field) {
        return field?.customLabel ?? field.fieldMapping;
    },
    getMatchingPoint(data, pointCheckX, xAxisData) {
        for (const element of data) {
            const point = element;
            const x = pointCheckX[0]?.x;
            if (point[xAxisData[0]?.fieldAlias] === x) {
                return point;
            }
        }
        return null;
    },
    setUniqueLegendValueItem(dataResult, chartConfig) {
        const newArray = dataResult?.data?.map(obj => {
            const newObj = {};
            newObj[chartConfig?.legendData[0]?.fieldAlias] = obj[chartConfig.legendData[0]?.fieldAlias];
            return newObj;
        });
        const uniqueValues = [...new Set(newArray.map(obj => obj[chartConfig?.legendData[0]?.fieldAlias]))];
        const dataFake = chartConfig?.legendValueItem ?? [];
        const indexes = uniqueValues.map(function (element) {
            return dataFake.findIndex((obj) => {
                return obj.name === element;
            });
        });
        const resultArray = uniqueValues.map((value, z) => ({
            [chartConfig?.legendData[0]?.fieldAlias]: value,
            name: value === chartConfig?.legendValueItem[indexes[z]]?.name ? chartConfig?.legendValueItem[indexes[z]]?.name : value,
            customLabel: value === chartConfig?.legendValueItem[indexes[z]]?.name ? chartConfig?.legendValueItem[indexes[z]]?.customLabel : value,
            color: value === chartConfig?.legendValueItem[indexes[z]]?.name ? chartConfig?.legendValueItem[indexes[z]]?.color : null
        }));
        return resultArray;
    },
    checkArrays(array1, array2, chartConfig) {
        if (array1?.length !== array2?.length) {
            return false;
        } else {
            const configLegendValues = array2.map(item => item.name);
            const dataValues = array1.map(item => item[chartConfig?.legendData[0]?.fieldAlias]);
            const isMatch = configLegendValues.every(value => dataValues.includes(value));
            return isMatch;
        }
    },
    setColorDefaultLegend(data, dataMapField, chartConfig) {
        data.map((value, index) => {
            if (!data[index]?.color && dataMapField[index]) {
                const colorIndex = Number(index) % (defaultColor?.length - 1);
                const color = defaultColor[colorIndex + 1];
                if (Number(index) > defaultColor?.length - 2) {
                    dataMapField[index].color = this.randomColor(defaultColor);
                } else {
                    dataMapField[index].color = color?.value;
                }
                dataMapField[index].customLabel = data[index][chartConfig?.legendData[0]?.fieldAlias];
                dataMapField[index].fieldMapping = data[index][chartConfig?.legendData[0]?.fieldAlias];
            }
        });
    },
    randomColor(usedColors) {
        const hue = Math.floor(Math.random() * 360);
        const saturation = Math.floor(Math.random() * 100);
        const lightness = Math.floor(Math.random() * 100);
        const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        if (usedColors.includes(color)) {
            return this.randomColor(usedColors);
        } else {
            return color;
        }
    },
    truncatedName(value) {
        if (value) {
            return value.length > 10 ? value.substring(0, 15) + ' ...' : value;
        }
    },
    formatNumber(value) {
        if (!isNaN(value)) {
            return value?.toLocaleString(undefined, {
                minimumFractionDigits: value % 1 === 0 ? 0 : 2,
                maximumFractionDigits: value % 1 === 0 ? 0 : 2,
                useGrouping: true,
            });
        } else {
            return value;
        }
    },
    customFormatNumber(value, minimumFractionDigits, maximumFractionDigits, useGrouping) {
        return value.toLocaleString(undefined, {
            minimumFractionDigits: minimumFractionDigits,
            maximumFractionDigits: maximumFractionDigits,
            useGrouping: useGrouping,
        });
    },
    async getConditionForIsConfigByChart(valueSchema, valueFilter, linkChart, chartId, reportId, dataFilter) {
        const queries = {
            isConfig: true,
            chartId: chartId ?? null,
            publicReport: 1
        };
        Base.setLoading(true);
        const result = await ReportService.getCondition(queries, reportId);
        Base.setLoading(false);
        const condition = [];
        if (result.status === 1) {
            const conditionByChart = result.data ?? [];
            if (conditionByChart.length > 0 && dataFilter.length > 0) {
                dataFilter.forEach(item => {
                    conditionByChart.forEach(value => {
                        if (item.field_name === value.field_name) {
                            condition.push(item);
                        }
                    });
                });
            }
        }
        const url = chartService.getLinkChartReport(valueSchema, valueFilter, linkChart, condition);
        if (url) {
            window.open(url, "_blank");
        }
    },
    redirectDetailPublicChart(chartId, dataFilter) {
        const params = {};
        dataFilter.forEach((el, i) => {
            const key = `${el.field_name}`;
            params[key] = `${el.is_this ? 1 : '~'},${el.aggregation},${el.function},${el.operator},${el.values.join('|')}`;
        });
        const path = `https://cdp-reporting.admicro.vn/report-public/chart/${chartId}`;

        let setParamConvert = '';
        if (Object.keys(params).length > 0) {
            setParamConvert = setParamConvert + '?';
            Object.entries(params).forEach(([key, value], index) => {
                setParamConvert = setParamConvert + key + '=' + value;
                if ((index + 1) !== Object.keys(params).length){
                    setParamConvert = setParamConvert + '&';
                }
            });
        }
        window.location = path + setParamConvert;
    }
}
export default chartService
