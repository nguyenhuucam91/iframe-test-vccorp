const Base = {
    locale: 'en',
    language: null,
    init: function () {
        return {
            apiUrl: ''
        };
    },
    setLoading: function (isLoad) {
        try {
            const loading = document.getElementById('data-loading');
            if (isLoad) {
                loading.style.display = 'block';
            } else {
                loading.style.display = 'none';
            }
        } catch (e) {
            console.error(e)
        }
    },
    checkIsLink(str) {
        if (!str || typeof str !== 'string') {
            return false;
        }
        if (str?.startsWith("http://") || str?.startsWith("https://")) {
            return true;
        }

        const regex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
        return regex.test(str);
    },
    convertLink(link) {
        if (!link || typeof link !== 'string') {
            return link;
        }
        if (!link.startsWith('https://') && !link.startsWith('http://')) {
            return 'https://' + link;
        }
        return link;
    },
    handleLazyLoadChart(chartId) {
        const windowHeight = window.innerHeight;
        const element = document.getElementById(`chart-item-${chartId}`);
        if (element) {
            const topPos = element?.getBoundingClientRect().top || null;
            return !!(topPos < windowHeight && typeof chartId !== 'undefined');
        }
    }
}

export default Base
