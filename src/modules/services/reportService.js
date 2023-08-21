import api from '../../api/index'

const reportService = {

     getCondition: async (queries, reportId) => {
        const options = {
            params: {},
            headers: {
                Accept: 'application/json'
            }
        };
        delete queries.publicReport;
        for (const i in queries) {
            options.params[i] = queries[i];
        }
        const response = await api.get("https://cdp-reporting.admicro.vn/api/v1/report/public/filter/get-condition/" + reportId, options);
        return {
            status: response?.status,
            message: response?.message,
            data: response?.data
        }
    }

}
export default reportService
