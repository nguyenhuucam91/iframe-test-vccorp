import {GridStack} from "gridstack";
import '../../../node_modules/gridstack/dist/gridstack.min.css'
import '../../../node_modules/gridstack/dist/gridstack-extra.css'

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