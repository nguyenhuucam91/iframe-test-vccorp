import api from '../../api'
import ApiNotFoundError from '../../errors/ApiNotFoundError';
import './table.scss'
import Pagination from "../pagination/pagination";
import Base from '../_base/base';
import ChartService from "../services/chartService";

let ChartTable = {
    listChartId: [],
    init: function () {
        return {};
    }, drawAt: async function (chartId, reportId, dataFilter, pageSize = 10, pageIndex = 0) {
        try {
            ChartTable.listChartId.push(chartId);
            const dataChart = {
                chartId,
                reportId,
                dataFilter,
            }
            const dataPagination = {
                pageSize,
                pageIndex
            }
            setTimeout(() => {
                const checkPosition = Base.handleLazyLoadChart(chartId);
                if (checkPosition) {
                    ChartTable.getData(dataChart, dataPagination);
                }
            }, 300);

            addEventListener("scroll", (event) => {
                const subscribeScroll = Base.handleLazyLoadChart(chartId);
                if (subscribeScroll) {
                    ChartTable.getData(dataChart, dataPagination);
                }
            });
        } catch (e) {
            console.error(e)
        }
    },
    getData: async function (dataChart, dataPagination) {
        if (ChartTable.listChartId.includes(dataChart.chartId)) {
            let apiUrl = 'https://cdp-reporting.admicro.vn/api/v1/chart/public/query-data-by-condition/{CHART_ID}';
            apiUrl = apiUrl.replace('{CHART_ID}', dataChart.chartId);
            let pageSizeOptions = [10, 20, 30];


            const body = {
                filters: [],
                limit: dataPagination.pageSize,
                offset: dataPagination.pageIndex *  dataPagination.pageSize
            };

            const index = ChartTable.listChartId.indexOf(dataChart.chartId);
            if (index > -1) {
                ChartTable.listChartId.splice(index, 1);
            }

            Base.setLoading(true);
            const data = await api.post(apiUrl, body);
            Base.setLoading(false);
            const schema = data.chart.schema;
            const dataValue = data.chart.data;
            const length = data.chart.total;
            const sortTable = true;

            if (data?.status === 1) {

                const sectionChartTable = document.createElement("div");
                sectionChartTable.setAttribute('class', `section-chart-table`);

                const table = document.createElement("table");
                table.setAttribute('class', `table table-links table-hover table-striped table-nowrap`);
                const headerRow = document.createElement("tr");
                const thead = document.createElement("thead");
                table.appendChild(thead);
                schema.forEach(item => {
                    const headerCell1 = document.createElement("th");

                    if (item?.data_type === 'float' || item?.data_type === 'long' || item?.data_type === 'long') {
                        headerCell1.setAttribute('class', `text-right`);
                    } else {
                        headerCell1.setAttribute('class', `text-left`);
                    }

                    if (sortTable) {
                        const matSortHeaderContainer = document.createElement("div");
                        matSortHeaderContainer.setAttribute('class', `mat-sort-header-container`);

                        const matSortHeaderContent = document.createElement("div");
                        matSortHeaderContent.setAttribute('class', `mat-sort-header-content`);
                        matSortHeaderContent.textContent = item.field_mapping;
                        matSortHeaderContainer.appendChild(matSortHeaderContent);

                        const matSortHeaderArrow = document.createElement("div");
                        matSortHeaderArrow.setAttribute('class', `mat-sort-header-arrow`);

                        const contentSortHeaderArrow = `
                        <div class="mat-sort-header-indicator"><svg fill="#000000" height="8px" width="8px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 330 330" xml:space="preserve" stroke="#000000" stroke-width="24.04"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="XMLID_225_" d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393 c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393 s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"></path> </g></svg></div>`;

                        matSortHeaderArrow.innerHTML = contentSortHeaderArrow;

                        matSortHeaderContainer.appendChild(matSortHeaderArrow);

                        headerCell1.appendChild(matSortHeaderContainer);
                        headerCell1.classList.add('mat-sort-header');
                        headerCell1.setAttribute('aria-sort', `none`);

                        headerCell1.addEventListener(
                            'click',
                            function() {
                                let ariaSort = 'none';
                                const direction = this.getAttribute("aria-sort");
                                switch (direction){
                                    case 'none':
                                        ariaSort = 'asc';
                                        break;
                                    case 'asc':
                                        ariaSort = 'desc';
                                        break;
                                    case 'desc':
                                        break;
                                }
                                const sort = {
                                    active: item.field_alias,
                                    direction: ariaSort
                                }

                                const dataSorted = ChartTable.sortData(sort, dataValue);

                                const tbody = ChartTable.renderBodyTable(dataSorted, schema, data, dataChart);
                                table.tBodies[0].remove()
                                table.appendChild(tbody);

                                headerCell1.setAttribute('aria-sort', ariaSort);
                            },
                            false
                        );
                    } else {
                        const span = document.createElement("span");
                        span.textContent = item.field_mapping;
                        headerCell1.appendChild(span);
                    }

                    headerRow.appendChild(headerCell1);
                    thead.appendChild(headerRow);
                });

                const tbody = ChartTable.renderBodyTable(dataValue, schema, data, dataChart, dataPagination);

                table.appendChild(tbody);

                const tableResponsive = document.createElement("div");
                tableResponsive.setAttribute('class', `table-responsive style-scroll border-top fix-scroll-table`)
                tableResponsive.appendChild(table);

                sectionChartTable.appendChild(tableResponsive);

                if (length > dataPagination.pageSize) {
                    sectionChartTable.classList.add('has-paginate');
                    const pagination = document.createElement('div');
                    pagination.setAttribute('class', `pagination`);
                    let paginatorEl = Pagination.create(dataChart, dataPagination, pageSizeOptions, length, dataValue.length) ?? null;
                    sectionChartTable.appendChild(paginatorEl);
                }

                let domTable = document.getElementById(`chart-item-${dataChart.chartId}`);
                domTable.innerHTML = '';
                domTable.appendChild(sectionChartTable);
            }
        }
    },
    sortData: function (sort, dataValue) {
        const data = dataValue.slice();
        if (!sort.active || sort.direction === 'none') {
            return data;
        }

        return data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            for (const [key] of Object.entries(dataValue[0])) {
                if (sort.active === key) {
                    return ChartTable.compare(a[key], b[key], isAsc);
                }
            }
        });
    },
    compare(a, b, isAsc) {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    },
    renderBodyTable(dataValue, schema, data, dataChart) {
        const tbody = document.createElement("tbody");
        dataValue.forEach(item => {
            const dataRow = document.createElement("tr");

            schema.forEach(itemSchema => {
                const dataCell = document.createElement("td");

                if (itemSchema?.data_type === 'float' || itemSchema?.data_type === 'long' || itemSchema?.data_type === 'long') {
                    dataCell.setAttribute('class', `text-right`);
                } else {
                    dataCell.setAttribute('class', `text-left`);
                }

                if (itemSchema?.data_type === 'text' && !itemSchema.link_chart_id) {
                    if (Base.checkIsLink(item[itemSchema?.field_alias])) {
                        const a = document.createElement("a");
                        const link = Base.convertLink(item[itemSchema?.field_alias])
                        a.setAttribute('target', `_blank`);
                        a.setAttribute('class', `text-p-left`);
                        a.setAttribute('href', link);
                        a.textContent = ChartService.formatNumber(item[itemSchema.field_alias]) ?? null;
                        dataCell.appendChild(a);
                    } else {
                        const span = document.createElement("span")
                        span.setAttribute('class', `text-p-left`);
                        span.textContent = ChartService.formatNumber(item[itemSchema.field_alias]) ?? null;
                        dataCell.appendChild(span);
                    }
                }

                if (itemSchema?.data_type === 'text' && itemSchema.link_chart_id) {
                    const span = document.createElement("span")
                    span.setAttribute('class', `text-p-left`);
                    span.textContent = ChartService.formatNumber(item[itemSchema.field_alias]) ?? null;
                    if (itemSchema.link_chart_id) {
                        span.classList.add('link-chart');
                    }
                    span.addEventListener(
                        'click',
                        function() {
                            ChartService.linkChartReport(itemSchema, item, data.chart, dataChart.chartId, dataChart.reportId, dataChart.dataFilter);
                        },
                        false
                    );
                    dataCell.appendChild(span);
                }

                if (itemSchema?.data_type === 'float' || itemSchema?.data_type === 'long' || itemSchema?.data_type === 'int') {
                    const span = document.createElement("span")
                    span.setAttribute('class', `data-value`);
                    span.textContent = ChartService.formatNumber(item[itemSchema.field_alias]) ?? null;
                    if (itemSchema.link_chart_id) {
                        span.classList.add('link-chart');
                    }
                    span.addEventListener(
                        'click',
                        function() {
                            ChartService.linkChartReport(itemSchema, item, data.chart, dataChart.chartId, dataChart.reportId, dataChart.dataFilter);
                        },
                        false
                    );
                    dataCell.appendChild(span);
                }

                if (itemSchema?.data_type === 'datetime') {
                    const span = document.createElement("span")
                    span.setAttribute('class', `data-value`);
                    span.textContent =  ChartService.formatDateTime(item[itemSchema.field_alias], 'HH:mm:ss DD-MM-YYYY') ?? null;
                    if (itemSchema.link_chart_id) {
                        span.classList.add('link-chart');
                    }
                    span.addEventListener(
                        'click',
                        function() {
                            ChartService.linkChartReport(itemSchema, item, data.chart, dataChart.chartId, dataChart.reportId, dataChart.dataFilter);
                        },
                        false
                    );
                    dataCell.appendChild(span);
                }

                if (itemSchema?.data_type === 'date') {
                    const span = document.createElement("span")
                    span.setAttribute('class', `data-value`);
                    span.textContent =  ChartService.formatDateWithoutMoment(item[itemSchema.field_alias], 'DD-MM-YYYY') ?? null;
                    if (itemSchema.link_chart_id) {
                        span.classList.add('link-chart');
                    }
                    span.addEventListener(
                        'click',
                        function() {
                            ChartService.linkChartReport(itemSchema, item, data.chart, dataChart.chartId, dataChart.reportId, dataChart.dataFilter);
                        },
                        false
                    );
                    dataCell.appendChild(span);
                }

                dataRow.appendChild(dataCell);

            })

            tbody.appendChild(dataRow);
        });

        return tbody;
    }
}

export default ChartTable
