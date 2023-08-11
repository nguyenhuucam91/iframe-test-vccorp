import api from '../../api'
import ApiNotFoundError from '../../errors/ApiNotFoundError';
import {GridStack} from "gridstack";

let reportDashBoard = {
    init: function () {
        return {
            apiUrl: ''
        };
    },
    getReportDetail: async function (url) {
        try {
            const data = await api.get(url)
            if (data?.status === 1) {

                return data?.report ?? null;

            }
        } catch (e) {
            console.error(e)
        }
    }
}

export default reportDashBoard