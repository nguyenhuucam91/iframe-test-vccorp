import { environment } from "../../../environments/environment";
import './dateFilter.scss'
import DateFilterHtml from "./dateFilter.html";
let DateFilter = {
    funcList: [],
    initValueField: function (data) {
        let operator = environment.operators.find(e => e.value === data.value);
        if (data.function) {
            let func = environment.functions.find(e => e.value === data.function);
            this.funcList = Object.keys(environment).find(e => e === func);
        }
        let html = new DateFilterHtml(operator);
        let valueField = html.add();
        return valueField;
    },
    initByCondition: function () {

    },
    initByFunc: function (data) {
        
        switch (key) {
            case value:
                
                break;
        
            default:
                break;
        }
    }
}

export default DateFilter