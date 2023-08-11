import reportDashBoard from "./modules/report/report";
import ChartPie from "./modules/highcharts/pie";
import ChartTable from "./modules/tables/table";
import grid from "./modules/grid-stack/grid";

const urlCurrent = document.URL;
let reportId = urlCurrent.substring(urlCurrent.lastIndexOf('/') + 1);
if (reportId === '' || reportId === 'index.html') {
    reportId = '290';
}
const report = reportDashBoard.init();
report.apiUrl = `https://cdp-reporting.admicro.vn/api/v1/report/public/get-by-id/${reportId}`

const reportData = reportDashBoard.getReportDetail(report.apiUrl);

reportData.then(result => {
    let nameReport = document.getElementById('name-report')
    nameReport.innerHTML = result.results.name ?? '';

    const listChart = result.dashboardConfig;

    listChart.forEach((item, index) => {
        let domChart = document.createElement('div');
        // domChart.setAttribute('id', `chart-item-${item.report.id}`)
        domChart.setAttribute('class', `chart-item`)
        domChart.setAttribute('class', `grid-stack-item`)
        domChart.setAttribute('gs-i', index)
        domChart.setAttribute('gs-x', item.x)
        domChart.setAttribute('gs-y', item.y)
        domChart.setAttribute('gs-w', item.w)
        domChart.setAttribute('gs-h', item.h)
        domChart.setAttribute('widget-configs', '')

        // domChart.textContent = item.report.configs.title;

        let divTitle = document.createElement('h4');
        divTitle.setAttribute('class', `chart-title`)
        divTitle.textContent = item.report.configs.title ?? '';

        let divChart = document.createElement('div');
        divChart.setAttribute('class', `chart-info`)
        divChart.setAttribute('type-chart', item.report.configs.visualizeType)

        divChart.appendChild(divTitle);

        if (item.report.configs.visualizeType !== 'chart-string') {
            let divChartId = document.createElement('div');
            divChartId.setAttribute('id', `chart-item-${item.report.id}`)
            divChartId.setAttribute('class', `chart-item`)

            divChart.appendChild(divChartId);
        }

        domChart.appendChild(divChart);

        document.getElementById('chart-container')?.appendChild(domChart);

        initChart(item);
    });

    grid.init();
})

function initChart(item) {
    const typeChart = item.report.configs.visualizeType
    // console.log('typeChart', typeChart);
    // console.log('item.report.id', item.report.id);
    switch (typeChart) {
        case 'chart-pie':
            let chart = ChartPie.init();
            chart.chartId = item.report.id;
            ChartPie.drawAt(chart.chartId);
            break;
        case 'table':
            ChartTable.drawAt(item.report.id);
            // let chart = ChartPie.init();
            // chart.chartId = item.report.id;
            // ChartPie.drawAt(chart.chartId);
            break;
        case 'chart-column':
            break
        default:
            break;
    }
}

// for (let i = 1; i <= 2; i++) {
//     let heading = document.createElement('h3')
//     let cvs = document.createElement('div')
//     cvs.setAttribute('id', `chartjs-bar${i}-canvas`)
//     cvs.setAttribute('class', `chart-demo`)
//     heading.textContent = `Chart no:${i}`
//     document.body.appendChild(heading)
//     document.body.appendChild(cvs)
// }
//
// //lazy loading
// const intersectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
//     const target = entry.target
//     if (entry.isIntersecting && !target.getAttribute('data-show')) {
//         let chartJs = ChartBar.init();
//         const dataIndex = target.getAttribute('data-index')
//         target.setAttribute('data-show', true)
//         chartJs.apiUrl = `http://ec2-3-81-181-4.compute-1.amazonaws.com:3000/api/chartjs-barchart`
//         console.log('chartJs', chartJs)
//         ChartBar.drawAt(chartJs, `chartjs-bar${dataIndex}-canvas`)
//     }
// }))
//
// document.querySelectorAll('.chart-demo').forEach((item,index) => {
//     item.setAttribute('data-index', index+1)
//     intersectionObserver.observe(item)
// })