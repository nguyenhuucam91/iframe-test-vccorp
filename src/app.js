import reportDashBoard from "./modules/report/report";
import ChartTable from "./modules/tables/table";
import grid from "./modules/grid-stack/grid";
import Filter from "./modules/filter/filter";
import ChartPie from "./modules/highcharts/pie";
import ChartLine from "./modules/highcharts/line";
import ChartColumn from "./modules/highcharts/column";
import ChartBar from "./modules/highcharts/bar";
import ChartArea from "./modules/highcharts/area";
import ChartNumber from "./modules/number-chart/number";
import footer from "./modules/footer/footer";
import LocalStorageService from "./modules/services/local-storage.service";

const urlCurrent = document.URL;

let reportId = urlCurrent.substring(urlCurrent.lastIndexOf('/') + 1);
if (reportId === '' || reportId === 'index.html') {
    reportId = '290';
}

await LocalStorageService.initLanguage();

const report = reportDashBoard.init();
report.apiUrl = `https://cdp-reporting.admicro.vn/api/v1/report/public/get-by-id/${reportId}?key=WrlVPnVuAywINfRFXwCcHrgfp`

const reportData = reportDashBoard.getReportDetail(report.apiUrl);
let processDashboardConfig = [];
let processDataFilter = [];
let processResults = null;
const filterInstance = Object.create(Filter);

reportData.then(result => {
    processResults = result ?? null;
    processDashboardConfig = result.dashboardConfig ?? [];
    processDataFilter = result.filter ?? [];
    PROCESS.init();
    footer.init();
    footer.loadEvent();

})
function handleFooterEventInApp(event) {
    const updatedUrl = event.detail;
    console.log("Received updated URL:", updatedUrl);
    const urlSearchParams = new URLSearchParams(updatedUrl.split('?')[1]);
    const queryParams = Object.fromEntries(urlSearchParams.entries());

    // Kiểm tra xem tham số 'refresh' có tồn tại không
    if ('refresh' in queryParams) {
        const refreshValue = queryParams['refresh'];
        console.log(`Refresh value is: ${refreshValue}`);
        setTimeout(() => {
            console.log("Log after 5000ms");
        }, 5000);
    }
};
window.addEventListener('footerEvent', handleFooterEventInApp);
const PROCESS = {
    init: () => {
        let nameReport = document.getElementById('name-report');
        nameReport.innerHTML = processResults.results.name ?? '';
        Filter.init('filter', processResults);
        grid.init(processDashboardConfig);
        PROCESS.reloadAll();

        Filter.onDataFilterChange = (newDataFilter) => {
            //You can set a new data filter. Furthermore => tri
            // The data conditions have changed, and you call for reloading the data here. => tri
            console.log("New data filter:", newDataFilter);
        };

    },
    initChart: (item, dataFilter) => {
        const typeChart = item.report.configs.visualizeType;
        switch (typeChart) {
            case 'chart-area':
                ChartArea.drawAt(item.report.id, reportId);
                break;
            case 'chart-bar':
                ChartBar.drawAt(item.report.id, reportId);
                break;
            case 'chart-column':
                ChartColumn.drawAt(item.report.id, reportId);
                break;
            case 'chart-line':
                ChartLine.drawAt(item.report.id, reportId)
                break;
            case 'chart-pie':
                ChartPie.drawAt(item.report.id, reportId);
                break;
            case 'table':
                ChartTable.drawAt(item.report.id, reportId, dataFilter);
                break;
            case 'chart-number':
                ChartNumber.drawAt(item.report.id);
                break;
            default:
                break;
        }
    },

    reloadAll: () => {
        for (const item of processDashboardConfig) {
            PROCESS.initChart(item, processDataFilter);
        }
    },
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
