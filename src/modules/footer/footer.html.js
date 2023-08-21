import Base from "../_base/base";

class FooterTemplate {

    constructor() {
        
    }

    add() {
        const item = `
                <div class="footer-public-report">
                    <div class="title-bottom">
                        <a class="d-flex align-items-center logo-mini" href="/">
                            <img src="https://cdp-reporting.admicro.vn/assets/default/images/logo-mini.png" alt="">
                            <span> CDP Reporting </span>
                        </a>
                    </div>
                    <div class="footer-option">
                        <div class="config-language language">
                            <a id="toggle-language">
                                <img src="https://cdp-reporting.admicro.vn/assets/default/images/lang/${Base.locale  === 'en' ? 'en.png' : 'vi.svg'}" height="19" alt="">
                                <span class="arrow-language">
                                    <svg fill="#000000" height="8px" width="8px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 330 330" xml:space="preserve" stroke="#000000" stroke-width="16.04"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path id="XMLID_225_" d="M325.607,79.393c-5.857-5.857-15.355-5.858-21.213,0.001l-139.39,139.393L25.607,79.393 c-5.857-5.857-15.355-5.858-21.213,0.001c-5.858,5.858-5.858,15.355,0,21.213l150.004,150c2.813,2.813,6.628,4.393,10.606,4.393 s7.794-1.581,10.606-4.394l149.996-150C331.465,94.749,331.465,85.251,325.607,79.393z"></path> </g></svg>
                                </span>
                            </a>
                            <div id="box-select-language" class="dropdown-menu box-select-language">
                                <a class="language-item active" lang="en">
                                    <img src="https://cdp-reporting.admicro.vn/assets/default/images/lang/en.png" height="19" alt=""> English
                                </a>
                                <a class="language-item" lang="vi">
                                    <img src="https://cdp-reporting.admicro.vn/assets/default/images/lang/vi.svg" height="19" alt=""> Tiếng Việt
                                </a>
                            </div>
                        </div>
                        <div class="auto-refresh">
                            <button id="footer-button" class="active">
                                <span>6:18</span>
                                <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"/></svg>
                            </button>
                            <div class="dropdown-menu public-time-footer" id="dropdown-auto-refresh">
                                <h6 class="dropdown-header-public">Auto refresh</h6>
                                <span class="dropdown-item-public refresh-item" data-value="off"> Off</span>
                                <span class="dropdown-item-public refresh-item" data-value="1"> 1 minute</span>
                                <span class="dropdown-item-public refresh-item" data-value="5"> 5 minute</span>
                                <span class="dropdown-item-public refresh-item" data-value="10"> 10 minute </span>
                                <span class="dropdown-item-public refresh-item text-success" data-value=15> 15 minute
                                </span>
                                <span class="dropdown-item-public refresh-item" data-value="30"> 30 minute</span>
                                <span class="dropdown-item-public refresh-item"> 60 minute </span>
                            </div>
                        </div>
                        <div class="button-fullscreen">
                            <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M344 0H488c13.3 0 24 10.7 24 24V168c0 9.7-5.8 18.5-14.8 22.2s-19.3 1.7-26.2-5.2l-39-39-87 87c-9.4 9.4-24.6 9.4-33.9 0l-32-32c-9.4-9.4-9.4-24.6 0-33.9l87-87L327 41c-6.9-6.9-8.9-17.2-5.2-26.2S334.3 0 344 0zM168 512H24c-13.3 0-24-10.7-24-24V344c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2l39 39 87-87c9.4-9.4 24.6-9.4 33.9 0l32 32c9.4 9.4 9.4 24.6 0 33.9l-87 87 39 39c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8z"/></svg>
                        </div>
                    </div>
                </div>
                `
        return item;
    }
}

export default FooterTemplate;
