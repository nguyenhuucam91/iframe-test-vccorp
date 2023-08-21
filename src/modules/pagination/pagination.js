import './pagination.scss';
import ChartTable from "../tables/table";
let Pagination = {
    init: function () {
        return {};
    },
    create: function (dataChart, dataPagination, pageSizeOptions, total, lengthData) {
        let totalPage = Pagination.totalPage(total, dataPagination.pageSize);

        let paginatorContainer = document.createElement("div");
        paginatorContainer.setAttribute('class', `paginator-container`);

        let paginatorPageSize = document.createElement("div");
        paginatorPageSize.setAttribute('class', `paginator-page-size`);

        let paginatorPageSizeLabel = document.createElement("span");
        paginatorPageSizeLabel.setAttribute('class', `paginator-page-size-label`);
        paginatorPageSizeLabel.textContent = "Items per page:";
        paginatorPageSize.appendChild(paginatorPageSizeLabel);


        let paginatorPageSelectOption = document.createElement("div");
        paginatorPageSelectOption.setAttribute('class', `paginator-page-select-option`);

        paginatorPageSelectOption.addEventListener(
            'click',
            function(e) {
                let stop = true;
                let selectSizeOption = document.createElement("div");
                selectSizeOption.setAttribute('class', `select-page-option`);
                pageSizeOptions.forEach(item => {
                    const option = document.createElement("div");
                    option.setAttribute('class', `page-option-item`);
                    option.setAttribute('value', item);
                    if (dataPagination.pageSize === item) {
                        option.setAttribute('selected', 'selected');
                    }
                    option.textContent = item;
                    if (item != dataPagination.pageSize){
                        option.addEventListener(
                            'click',
                            function() {
                                dataPagination.pageSize = this.getAttribute("value");
                                stop = false;
                                ChartTable.drawAt(dataChart.chartId, dataChart.reportId, dataChart.dataFilter, Number(dataPagination.pageSize), dataPagination.pageIndex);
                            },
                            false
                        );
                    } else {
                        option.addEventListener(
                            'click',
                            function() {
                                selectSizeOption.remove();
                                stop = false;
                            },
                            false
                        );
                        selectSizeOption.remove()
                    }
                    if (stop){
                        selectSizeOption.appendChild(option);
                    }
                });
                paginatorPageSelectOption.appendChild(selectSizeOption);

                window.addEventListener(
                    'click',
                    function(event) {
                        if (!paginatorPageSelectOption.contains(event.target)){
                            selectSizeOption.remove()
                        }
                    });
            },
            false
        );

        let paginatorPageSizeValue = document.createElement("div");
        paginatorPageSizeValue.setAttribute('class', `paginator-page-size-value`);
        paginatorPageSizeValue.textContent = dataPagination.pageSize;
        paginatorPageSelectOption.appendChild(paginatorPageSizeValue);

        let paginatorSelectArrow = document.createElement("div");
        paginatorSelectArrow.setAttribute('class', `paginator-select-arrow`);

        let paginatorIconArrow = document.createElement("div");
        paginatorIconArrow.setAttribute('class', `paginator-icon-arrow`);
        paginatorSelectArrow.appendChild(paginatorIconArrow);

        paginatorPageSelectOption.appendChild(paginatorSelectArrow);

        paginatorPageSize.appendChild(paginatorPageSelectOption);

        paginatorContainer.appendChild(paginatorPageSize);

        let pageSizeOption = document.createElement("div");
        pageSizeOption.setAttribute('class', `paginator-size-option`);


        let paginatorRangeActions = document.createElement("div");
        paginatorRangeActions.setAttribute('class', `paginator-range-actions`);

        let paginatorRangeLabel = document.createElement("span");
        paginatorRangeLabel.setAttribute('class', `paginator-range-label`);
        paginatorRangeLabel.textContent = `${((dataPagination.pageSize * dataPagination.pageIndex) + 1)} – ${((dataPagination.pageSize * dataPagination.pageIndex) + lengthData)} of ${total}`;

        paginatorRangeActions.appendChild(paginatorRangeLabel);


        let navigationFirst = document.createElement("button");
        navigationFirst.setAttribute('class', `navigation-first mat-icon-button`);
        if (dataPagination.pageIndex === 0) {
            navigationFirst.setAttribute('disabled', `true`);
        } else {
            navigationFirst.removeAttribute('disabled');
            navigationFirst.addEventListener(
                'click',
                function() {
                    dataPagination.pageIndex = 0;
                    ChartTable.drawAt(dataChart.chartId, dataChart.reportId, dataChart.dataFilter, dataPagination.pageSize, dataPagination.pageIndex);
                },
                false
            );
        }
        navigationFirst.innerHTML = '<svg viewBox=\'0 0 24 24\' focusable="false" class="mat-paginator-icon"><path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"></path></svg>';
        paginatorRangeActions.appendChild(navigationFirst);


        let navigationPrev = document.createElement("button");
        navigationPrev.setAttribute('class', `navigation-prev mat-icon-button`);
        if (dataPagination.pageIndex === 0) {
            navigationPrev.setAttribute('disabled', `true`);
        } else {
            navigationPrev.removeAttribute('disabled');
            navigationPrev.addEventListener(
                'click',
                function() {
                    dataPagination.pageIndex--;
                    ChartTable.drawAt(dataChart.chartId, dataChart.reportId, dataChart.dataFilter, dataPagination.pageSize, dataPagination.pageIndex);
                },
                false
            );
        }
        navigationPrev.innerHTML = '<svg viewBox="0 0 24 24" focusable="false" class="mat-paginator-icon"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg>';
        paginatorRangeActions.appendChild(navigationPrev);

        let navigationNext = document.createElement("button");
        navigationNext.setAttribute('class', `navigation-next mat-icon-button`);
        if ((dataPagination.pageIndex + 1) === totalPage) {
            navigationNext.setAttribute('disabled', `true`);
        } else {
            navigationNext.removeAttribute('disabled');
            navigationNext.addEventListener(
                'click',
                function() {
                    dataPagination.pageIndex++;
                    ChartTable.drawAt(dataChart.chartId, dataChart.reportId, dataChart.dataFilter, dataPagination.pageSize, dataPagination.pageIndex);
                },
                false
            );
        }
        navigationNext.innerHTML = '<svg viewBox="0 0 24 24" focusable="false" class="mat-paginator-icon"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path></svg>';
        paginatorRangeActions.appendChild(navigationNext);

        let navigationLast = document.createElement("button");
        navigationLast.setAttribute('class', `navigation-last mat-icon-button`);
        if ((dataPagination.pageIndex + 1) === totalPage) {
            navigationLast.setAttribute('disabled', `true`);
        } else {
            navigationLast.removeAttribute('disabled');
            navigationLast.addEventListener(
                'click',
                function() {
                    dataPagination.pageIndex = totalPage;
                    ChartTable.drawAt(dataChart.chartId, dataChart.reportId, dataChart.dataFilter, dataPagination.pageSize, dataPagination.pageIndex);
                },
                false
            );
        }
        navigationLast.innerHTML = '<svg viewBox="0 0 24 24" focusable="false" class="mat-paginator-icon"><path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"></path></svg>';
        paginatorRangeActions.appendChild(navigationLast);

        paginatorContainer.appendChild(paginatorRangeActions);

        return paginatorContainer;
    },
    totalPage: function (total, pageSize) {
        return Math.ceil(total / pageSize);
    },
}

export default Pagination;
