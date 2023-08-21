import { environment } from "../../environments/environment";
class MyClass {
    check = null;
    constructor(data) {
        this.data = data;
        this.operatorList = environment.operators.filter(e => { return data.operator_collection.indexOf(e.id.toString()) !== -1 });
        this.checkInputType()
    }

    add() {
        const item = `
                    <div id=${this.data.field_name} class="condition-fields filter-condition-fields" >
                        <div class="item-selected-field cursor-pointer drop-conditions-filter conditions">
                            <div class="item-edit-filter-condition rounded" id=item-edit-filter-${this.data.field_name}>
                                    <span class="d-flex value-item"></span>
                                    <span class="mr-1"></span><span class="mr-1">${this.data.label ?? 'any filter'}</span>
                                    <span class="text-muted value-condition mr-1 value-item">${environment.operators.find(e => e.value === this.data.operator).label}</span>
                            </div>
                            <div id="drop-filter-das" class="drop-aggregation drop-conditions drop-conditions-filter p-0 hide">
                                <div class="p-2 mb-0">
                                    <div class="select-field-where">
                                        <div class="item-selected-field dropdown curDef">
                                            <div class="item-selected-field-toggle" data-toggle="dropdown"><span class="text-middle">${this.data.label ?? 'any filter'}</span></div>
                                        </div>
                                    </div>
                                    <div class="input-operator ${this.operatorList.length ? '' : 'hide'}" id="add-operator">
                                    <div class="item-selected-field-toggle operator-select-field" data-toggle="dropdown"> 
                                    </div>
                                    <div class="dropdown-menu pl-1 pr-1 drop-field style-scroll mlr-10">
                                            <ul class="list-operator p-0">
                                                ${this.optionF()}
                                            </ul>
                                        </div>
                                    <div class="btn-confirm-conditions-value d-flex mt-2">
                                        <button class="btn btn-sm btn-light text-capitalize btn-submit mr-2 w-50 cursor-pointer">Cancel</button>
                                        <button class="btn btn-sm btn-primary text-capitalize btn-submit w-50 cursor-pointer" id="btn-apply-filter">Apply</button>
                                 </div>
                            </div>
                        </div>
                    </div>`
        return item;
    }

    optionF() {
        let opr = '';   
        for (const item of this.operatorList) {
            opr += `
                <li data-value="${item.value}" class="pl-1 pr-1">${item.label}</li>
            `;
        }
        return opr;
    }

    checkInputType() {
        
    }

    functionToExecute() {
    }

}

export default MyClass;
