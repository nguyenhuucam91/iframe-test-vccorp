export const environment = {
    host: 'https://cdp-reporting.admicro.local',
    apiBackend: {
        report: 'https://cdp-reporting.admicro.vn/api/v1/report/public/get-by-id/{REPORT_ID}',
        chart: 'https://cdp-reporting.admicro.vn/api/v1/chart/public/query-data-by-condition/{CHART_ID}'
    },
    typeColor: [
        {value: '', color: "", typeButton: "button"},
        {value: '#3386C9', color: "#3386C9", typeButton: "button"},
        {value: '#88BF4D', color: "#88BF4D", typeButton: "button"},
        {value: '#A989C5', color: "#A989C5", typeButton: "button"},
        {value: '#EF8C8C', color: "#EF8C8C", typeButton: "button"},
        {value: '#F9D45C', color: "#F9D45C", typeButton: "button"},
        {value: '#F2A86F', color: "#F2A86F", typeButton: "button"},
        {value: '#98D9D9', color: "#98D9D9", typeButton: "button"},
        {value: '#7172AD', color: "#7172AD", typeButton: "button"},
        {value: '#51528D', color: "#51528D", typeButton: "button"},
        {value: '#69C8C8', color: "#69C8C8", typeButton: "button"},
        {value: '#ED9935', color: "#ED9935", typeButton: "button"},
        {value: '#F7C41F', color: "#F7C41F", typeButton: "button"},
        {value: '#E75454', color: "#E75454", typeButton: "button"},
        {value: '#C7EAEA', color: "#C7EAEA", typeButton: "button"},
        {value: '#689636', color: "#689636", typeButton: "button"},
        {value: '#F767A9', color: "#F767A9", typeButton: "button"},
    ],
    operators: [
        /* text */
        {id: 1, label: 'Is', value: 'is', valueSize: 'multi', type: ['text']},
        {id: 2, label: 'Is not', value: 'is_not', valueSize: 'multi', type: ['text']},
        {id: 3, label: 'Contains', value: 'contains', valueSize: 'no', type: ['text']},
        {id: 4, label: 'Not contain', value: 'not_contain', valueSize: 'no', type: ['text']},
        {id: 5, label: 'Startwith', value: 'startwith', valueSize: 'no', type: ['text']},
        {id: 6, label: 'Not startwith', value: 'not_startwith', valueSize: 'no', type: ['text']},
        {id: 7, label: 'Endwith', value: 'endwith', valueSize: 'no', type: ['text']},
        {id: 8, label: 'Not endwith', value: 'not_endwith', valueSize: 'no', type: ['text']},
        /* int, float, long */
        {id: 9, label: 'Equal', value: 'equal', valueSize: 'multi', type: ['float', 'int', 'long']},
        {id: 10, label: 'Not equal', value: 'not_equal', valueSize: 'multi', type: ['float', 'int', 'long']},
        {id: 11, label: 'Less than', value: 'less_than', valueSize: 'no', type: ['float', 'int', 'long']},
        {id: 12, label: 'Greater than', value: 'greater_than', valueSize: 'no', type: ['float', 'int', 'long']},
        {id: 13, label: 'Between', value: 'between', valueSize: 'multi', type: ['float', 'int', 'long']},
        
        /* data, dateTime */
        {id: 14, label: 'Before', value: 'before', valueSize: 'no', type: ['date', 'datetime'], haveFunction: true, inputType: 1},
        {id: 15, label: 'After', value: 'after', valueSize: 'no', type: ['date', 'datetime'], haveFunction: true, inputType: 1},
        {id: 16, label: 'Between date', value: 'between_date', valueSize: 'multi', type: ['date', 'datetime'], haveFunction: true, inputType: 1},
        {id: 17, label: 'Current day', value: 'current_day', valueSize: 'multi', type: ['date', 'datetime'], haveFunction: false, inputType: 0},
        {id: 18, label: 'Current week', value: 'current_week', valueSize: 'multi', type: ['date', 'datetime'], haveFunction: false, inputType: 0},
        {id: 19, label: 'Current month', value: 'current_month', valueSize: 'multi', type: ['date', 'datetime'], haveFunction: false, inputType: 0},
        {id: 20, label: 'Current year', value: 'current_year', valueSize: 'multi', type: ['date', 'datetime'], haveFunction: false, inputType: 0},
        {id: 21, label: 'On', value: 'on', valueSize: 'multi', type: ['date', 'datetime'], haveFunction: true, inputType: 1},
        {id: 22, label: 'Previous day', value: 'previous_day', valueSize: 'multi', type: ['date', 'datetime'], haveFunction: false, inputType: 2},
        {id: 23, label: 'Previous week', value: 'previous_week', valueSize: 'multi', type: ['date', 'datetime'], haveFunction: false, inputType: 2},
        {id: 24, label: 'Previous month', value: 'previous_month', valueSize: 'multi', type: ['date', 'datetime'], haveFunction: false, inputType: 2},
        {id: 25, label: 'Previous year', value: 'previous_year', valueSize: 'multi', type: ['date', 'datetime'], haveFunction: false, inputType: 2},
        /* all data type */
        {
            id: 26,
            label: 'is null',
            value: 'is_null',
            valueSize: 'no',
            type: ['text', 'float', 'int', 'long', 'date', 'datetime']
        },
        {
            id: 27,
            label: 'is not null',
            value: 'is_not_null',
            valueSize: 'no',
            type: ['text', 'float', 'int', 'long', 'date', 'datetime']
        }, 
    ],
    typesData: {
        date: ['date', 'datetime'],
        number: ['float', 'int', 'long'],
        text: ['text']
    },
    functions: [
        {id: 1, label: "by Year", display: "Year", value: "year", types: ["datetime", "date"], condition: true},
        {id: 2, label: "by Quarter ", display: "Quarter", value: "quarter", types: ["datetime", "date"], condition: true},
        {id: 3, label: "by Month", display: "Month", value: "month", types: ["datetime", "date"], condition: true},
        {id: 4, label: "by Week", display: "Week", value: "week", types: ["datetime", "date"], condition: true},
        {id: 5, label: "by Day", display: "Day", value: "day", types: ["datetime", "date"], condition: false},
        {id: 6, label: "by Hour", display: "Hour", value: "hour", types: ["datetime"], condition: false},
        {id: 7, label: "by Minute", display: "Minute", value: "minute", types: ["datetime"], condition: false},
        {id: 8, label: "by Second", display: "Second", value: "second", types: ["datetime"], condition: false}
    ],
    quarters: [
        {id: 1, label: "Quý 1", value: "Q1"},
        {id: 2, label: "Quý 2", value: "Q2"},
        {id: 3, label: "Quý 3", value: "Q3"},
        {id: 4, label: "Quý 4", value: "Q4"}
    ],
    months: [
        {id: 1, label: "Tháng 1", value: "01"},
        {id: 2, label: "Tháng 2", value: "02"},
        {id: 3, label: "Tháng 3", value: "03"},
        {id: 4, label: "Tháng 4", value: "04"},
        {id: 5, label: "Tháng 5", value: "05"},
        {id: 6, label: "Tháng 6", value: "06"},
        {id: 7, label: "Tháng 7", value: "07"},
        {id: 8, label: "Tháng 8", value: "08"},
        {id: 9, label: "Tháng 9", value: "09"},
        {id: 10, label: "Tháng 10", value: "10"},
        {id: 11, label: "Tháng 11", value: "11"},
        {id: 12, label: "Tháng 12", value: "12"}
    ],
}
