import './filter.scss';
import MyClass from './filter.html.js';
import { environment } from '../../environments/environment';
import DateFilter from './date/dateFilter';
let Filter = {
    parentId: null,
    dataFilter: [],
    onDataFilterChange: null,
    init: function (id, data) {
        Filter.parentId = id ?? null;
        Filter.dataFilter = data.filter ?? [];
        this.showFilter();
    },
    apply: () => {
        if (Filter.onDataFilterChange) {
            Filter.onDataFilterChange(Filter.dataFilter);
        }
    },
    showFilter: () => {
        const parentEl = document.querySelector(`#${Filter.parentId}`);
        if (parentEl) {
            parentEl.innerHTML = '';
            let elContent = ``;
            Filter.dataFilter.forEach(item => {
                const filterItem = new MyClass(item);
                const newObject = filterItem.add();
                elContent += newObject;
            });
            parentEl.innerHTML = elContent;
            setTimeout(() => {
                Filter.addEventDropdown2();
            }, 300);
        }
    },
    initActionBtn: function () {
    },
    initDropdownUser: function () {

    },
    reload: (index) => {
        Filter.showFilter();
    },
    addEventDropdown2: function () {
        Filter.dataFilter.forEach((item, i) => {
            const parent = document.querySelector('#' + item.field_name);
            const dataIndex = document.querySelector(`#item-edit-filter-${item.field_name}`);
            if (dataIndex) {
                let operatorSelected = environment.operators.find(e => e.value === item.operator);
                Filter.initFieldValueByCondition(item, parent);
                let toggleValue = parent.querySelector('.operator-select-field');
                toggleValue.innerHTML = operatorSelected.label;
                dataIndex.addEventListener('click', (event) => {
                    event.stopPropagation();
                    const child = parent.querySelector('.drop-aggregation');
                    const btnApply = child.querySelector('#btn-apply-filter');
                    const operatorEl = parent.querySelector('.operator-select-field');
                    const operatorDropdown = parent.querySelector('.dropdown-menu');
                    operatorEl.addEventListener('click', () => {
                        if (operatorDropdown.style.display === 'none' || operatorDropdown.style.display === '') {
                            operatorDropdown.style.display = 'block'
                        } else {
                            operatorDropdown.style.display = 'none'
                        }
                    });

                    //add select li 
                    let operatorSelectEl;
                    const listOperator = parent.querySelector('.list-operator');
                    const operator = listOperator.getElementsByTagName('li');
                    for (let i = 0; i < operator.length; i++) {
                        operator[i].addEventListener('click', function() {
                            for (let j = 0; j < operator.length; j++) {
                                operator[j].classList.remove('option-selected');
                            }
                            this.classList.add('option-selected');
                            operatorDropdown.style.display = 'none';
                            let value = this.getAttribute('data-value');
                            operatorSelected = environment.operators.find(e => e.value === value);
                            Filter.initFieldValueByCondition(operatorSelected, parent);
                            operatorSelectEl = listOperator.querySelector('.option-selected');
                            let toggleValue = parent.querySelector('.operator-select-field');
                            toggleValue.innerHTML = operatorSelected.label;
                        });
                    }
                    if (btnApply) {
                        btnApply.addEventListener('click', () => {
                            item.operator = operatorSelectEl ? operatorSelectEl.getAttribute('data-value') : item.operator;
                            Filter.reload(i);
                            Filter.apply();
                        })
                    }
                    child.classList.toggle('hide');
                    if (!child.classList.contains('hide')) {
                        child.style.display = 'block';
                    } else {
                        child.style.display = 'none';
                    }
                    const allDropAggregations = document.querySelectorAll('.drop-aggregation');
                    allDropAggregations.forEach(dropAggregation => {
                        if (dropAggregation !== child) {
                            dropAggregation.classList.add('hide');
                        }
                    });
                });
            }
        });
        Filter.clickDocument();

    },
    clickDocument() {
        // Filter.dataFilter.forEach((item, i) => {
        document.addEventListener('click', (e) => {
            // e.stopPropagation();
            // console.log(e.target.closest(`.filter-condition-fields`));
            // if (!e.target.closest(`.filter-condition-fields`)) {
            // const parent = document.querySelector('#' + item.field_name);
            // if (parent) {
            // const allDropAggregations = document.querySelectorAll('.drop-aggregation');
            // allDropAggregations.forEach(dropAggregation => {
            //     dropAggregation.classList.add('hide');
            // });
            // }

            // }
        })
        // });
    },
    initFieldValueByCondition(data, parentElement) {
        const typeData = environment.typesData;
        switch (JSON.stringify(data.type)) {
            case JSON.stringify(typeData.date):
                let fieldValue = DateFilter.initValueField(data);
                let btnAction = parentElement.querySelector('.btn-confirm-conditions-value');
                this.clearFieldValue(parentElement);
                btnAction.insertAdjacentHTML('beforebegin', fieldValue);
                break;
            case typeData.text:
                break;
            case typeData.number:
                break;
            default:
                break;
        }
    },
    clearFieldValue(parentEl) {
        let oldFieldValue = parentEl.querySelector('.field-value');
        if (oldFieldValue) {
            oldFieldValue.remove();
        }
    }
}

export default Filter;
