import {GridStack} from "gridstack";

let grid = {
    init: function () {
        GridStack.init({
            animate: true,
            placeholderClass: "grid-stack-placeholder",
            placeholderText: "",
            float: false,
            staticGrid: true,
            column: 12,
            alwaysShowResizeHandle: false,
            cellHeight: 80,
        });
    }
}

export default grid