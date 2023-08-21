import { GridStack } from "gridstack";
import GridTemplate from "./grid.html";
import ChartService from "../services/chartService";
import Filter from "../filter/filter";

let grid = {
    parentWpId: '#chart-container',
    dataConfig: [],
    option: {
        animate: true,
        placeholderClass: "grid-stack-placeholder",
        placeholderText: "",
        float: false,
        staticGrid: true,
        column: 12,
        alwaysShowResizeHandle: false,
        cellHeight: 80,
    },
    init: function (dataConfig) {
        grid.dataConfig = dataConfig ?? [];
        grid.store();
        GridStack.init(grid.option);
    },
    destroy: () => {
        GridStack.destroy();
    },
    store: () => {
        const parentEl = document.querySelector(grid.parentWpId);
        if (parentEl) {

            let elContent = ``;
            grid.dataConfig.forEach(item => {

                const newBox = new GridTemplate(item);

                const newObject = newBox.add();
                elContent += newObject;
            });
            parentEl.innerHTML = elContent;
            grid.linkChartDetail();
        }
    }, linkChartDetail (){
        grid.dataConfig.forEach(item => {
            if (item.report.configs.visualizeType !== 'chart-string') {
                const chartTitle = document.getElementById('chart-title-' + item.report.id);
                chartTitle.addEventListener(
                    'click',
                    function() {
                        ChartService.redirectDetailPublicChart(item.report.id, Filter.dataFilter);
                    },
                    false
                );
            }
        });
    }
}

export default grid
