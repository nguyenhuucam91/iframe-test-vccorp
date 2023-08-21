import api from '../../api'
import ApiNotFoundError from '../../errors/ApiNotFoundError';
import './report.scss';
import Base from '../_base/base';

let reportDashBoard = {
    init: function () {
        return {
            apiUrl: ''
        };
    },
    getReportDetail: async function (url) {
        try {
            Base.setLoading(true);
            const data = await api.get(url)
            Base.setLoading(false);

            // const result = await api.get('http://localhost:4000/report-public/dash-board-detail/290?refresh=1&key=WrlVPnVuAywINfRFXwCcHrgfp&time=0')

            if (data?.status === 1) {

                return data?.report ?? null;

            }
        } catch (e) {
            console.error(e)
        }
    }
}

export default reportDashBoard