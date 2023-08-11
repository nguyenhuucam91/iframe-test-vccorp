import ChartPie from './modules/highcharts/pie'
import ChartBar from './modules/highcharts/bar'
import reportDashBoard from  './modules/report/report'
import ChartTable from "./modules/tables/table";
import InitGrid from "./modules/grid-stack/grid"

global.reportDashBoard = reportDashBoard
global.grid = InitGrid
global.ChartPie = ChartPie
global.ChartBar = ChartBar
global.ChartTable = ChartTable