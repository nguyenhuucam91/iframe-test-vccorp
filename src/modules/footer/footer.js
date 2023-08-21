import FooterHtml from "./footer.html";
import LocalStorageService from "../services/local-storage.service";
import './footer.scss';
let footer = {
    init: () => {
        const elObject = new FooterHtml().add();
        document.querySelector('.footer').innerHTML = elObject;
    },
    handleFooterEvent: (updatedUrl) => {
        console.log("handleFooterEvent", updatedUrl);
        // window.location.href = updatedUrl
        history.pushState({}, "", updatedUrl);

    },
    updateUrlParam(url, key, value) {
        const urlObj = new URL(url);
        urlObj.searchParams.set(key, value);
        return urlObj.href;
    },
    loadEvent: () => {
        const toggleLanguage = document.getElementById("toggle-language");
        const boxSelectLanguage = document.getElementById("box-select-language");
        const languageItem = document.querySelectorAll(".language-item");
        const configLanguage = document.querySelector(".config-language");
        toggleLanguage.addEventListener("click", () => {
            boxSelectLanguage.classList.toggle("show");

            languageItem.forEach(item => {
                item.addEventListener("click", () => {
                    LocalStorageService.setLocate(lang);
                    window.location.reload();
                });
            });
            window.addEventListener(
                'click',
                function (event) {
                    if (!configLanguage.contains(event.target)) {
                        boxSelectLanguage.classList.remove('show');
                    }
                });

        });

        const footerButtonTimeReload = document.getElementById("footer-button");
        const dropdownRefresh = document.getElementById("dropdown-auto-refresh");
        const refreshItems = document.querySelectorAll(".refresh-item");
        footerButtonTimeReload.addEventListener("click", () => {
            dropdownRefresh.classList.toggle("show");

            refreshItems.forEach(item => {
                item.addEventListener("click", () => {
                    // Đóng dropdown
                    dropdownRefresh.classList.remove("show");
                    const selectedValue = item.getAttribute("data-value");
                    // const apiUrlWithTime = `${report.apiUrl}&time=${selectedValue}`;
                    // Gọi hàm xử lý sự kiện từ footer.js
                    const apiUrlWithTime = footer.updateUrlParam('https://cdp-reporting.admicro.local/290', 'refresh', selectedValue ?? 0);

                    footer.handleFooterEvent(apiUrlWithTime);
                });
            });
        });
    }
}

export default footer
