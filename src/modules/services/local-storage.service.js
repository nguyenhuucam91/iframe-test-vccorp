import api from '../../api'
import {environment} from '../../environments/environment'
import Base from "../_base/base";

const host = environment.host;

const localStorageService = {
    locale: 'en',
    initLanguage() {
        return localStorageService.getLocale();
    },
    setLocate(lang) {
        localStorage.setItem('app_cdp_reporting_locale', lang);
    },
    async getLocale() {
        const locale = localStorage.getItem('app_cdp_reporting_locale');
        localStorageService.locale = locale || 'en';

        const url = `${host}/src/assets/i18n/${localStorageService.locale}.json?v=${Math.random()}`;
        const data = await api.get(url);
        Base.language = data;
        Base.locale = localStorageService.locale;

        const loadingDom = document.getElementsByClassName('text-loading');
        loadingDom[0].textContent = data.common.loading;

    }
}

export default localStorageService