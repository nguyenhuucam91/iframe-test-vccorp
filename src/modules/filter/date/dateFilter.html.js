import { environment } from "../../../environments/environment";
class DateFilterHtml {
    constructor(data) {
        this.data = data
    }
    add() {
        let itemNotFunc = `
        <div class="date-input-form field-value cursor-pointer">
            
        ${this.data.inputType === 1 ? '<input class="date-input item-selected-field-toggle p-10 cursor-pointer" type="date">' : ''}
        ${this.data.inputType === 2 ? 
        `<div class="date-input-form field-value cursor-pointer">
	        <input class="date-input item-selected-field-toggle p-10 cursor-pointer" type="number" min=0>
        </div>
        <div class="is-include cursor-pointer">
	        <input type="checkbox" name="is-include" value=false class="checkbox" id="checkboxDate">
	        <label for="checkboxDate">
		        Include today
	        </label>
        </div>`
        : ''}
        </div>
        `
        let itemHaveFunc = `
        <div class="date-input-form field-value cursor-pointer">
        <div class="date-between d-flex justify-content-between">
            <div class="style-select w-49">
                <select class="style-scroll">
                    <option value="">Select quarter</option>
                    ${this.optionF()}
                </select>
                <span class="h-icon chevron-down d-block pointer-event-none">
                    <svg aria-hidden="true" style="width: 16px; height: 16px;">
                        <use _ngcontent-serverApp-c260="" href="#icon-chevron-down"></use></svg>
                </span>
            </div>
            <!---->
            <div class="style-select w-49">
                <input type="text" placeholder="Enter year" class="ng-prist">
            </div>
        </div>    
        ${this.data.inputType === 1 ? '<input class="date-input item-selected-field-toggle p-10 cursor-pointer" type="date">' : ''}
        ${this.data.inputType === 2 ? 
        `<div class="date-input-form field-value cursor-pointer">
	        <input class="date-input item-selected-field-toggle p-10 cursor-pointer" type="number" min=0>
        </div>
        <div class="is-include cursor-pointer">
	        <input type="checkbox" name="is-include" value=false class="checkbox" id="checkboxDate">
	        <label for="checkboxDate">
		        Include today
	        </label>
        </div>`
        : ''}
        </div>
        `
        return itemHaveFunc;
    }

    optionF() {
        let opr = '';   
        for (const item of this.funcList) {
            opr += `
                <option value="${item.value}" class="pl-1 pr-1">${item.label}</option>
            `;
        }
        return opr;
    }
}

export default DateFilterHtml