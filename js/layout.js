// layout.js - פס הודעה, תפריט עליון וכותרת תחתונה - זהים בכל העמודים
// נטען בסוף ה-body, אחרי user.js ו-ui.js ולפני הקובץ של העמוד

const STORE_NAME = "ELDORA";

// הקישורים בתפריט העליון
const NAV_LINKS = [
    { href: "shop.html", textKey: "nav_all" },
    { href: "orders.html", textKey: "my_orders" }
];

const currentPage = location.pathname.split("/").pop() || "index.html";


// סופר כמה פריטים יש בסל (הסל שמור בפורמט [{ id, quantity }])
function getCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    let count = 0;

    cart.forEach(function (item) {
        count += item.quantity;
    });

    return count;
}


// לקרוא לפונקציה הזו אחרי כל שינוי בסל, כדי שהמספר בתפריט יתעדכן
function updateCartBadge() {
    const badge = document.getElementById("cartBadge");
    if (!badge) {
        return;
    }

    const count = getCartCount();
    badge.textContent = count > 0 ? `(${count})` : "";
}


function renderHeader() {
    const isLoginPage = currentPage === "index.html";

    // פס הודעה עליון
    const announcement = document.createElement("div");
    announcement.className = "announcement";
    announcement.textContent = t("announcement");

    const links = NAV_LINKS.map(link => {
        const isActive = link.href === currentPage;
        return `<a class="header-link ${isActive ? "active" : ""}" href="${link.href}" ${isActive ? 'aria-current="page"' : ""}>${t(link.textKey)}</a>`;
    }).join("");

    // בעמוד הכניסה מציגים רק את שם החנות ואת כפתור מצב כהה
    const userArea = isLoginPage ? "" : `
        <div class="dropdown">
            <button class="user-menu-btn dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                ${t("hello")} <span class="user-first"></span><span class="user-rest"></span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end">
                <li><a class="dropdown-item" href="cart.html">${t("my_cart")}</a></li>
                <li><a class="dropdown-item" href="orders.html">${t("my_orders")}</a></li>
                <li><button type="button" class="dropdown-item danger logout-btn">${t("logout")}</button></li>
            </ul>
        </div>
        <a class="header-link ${currentPage === "cart.html" ? "active" : ""}" href="cart.html">${t("cart")} <span id="cartBadge"></span></a>`;

    const header = document.createElement("header");
    header.className = "site-header";
    header.innerHTML = `
        <div class="container">
            <a class="wordmark" href="${isLoginPage ? "index.html" : "shop.html"}">
                <img class="logo-mark" src="images/logo.svg" alt="">${STORE_NAME}
            </a>
            ${isLoginPage ? "" : `<nav class="header-nav">${links}</nav>`}
            <div class="header-actions">
                ${userArea}
                <button id="langToggle" class="lang-toggle" type="button" lang="${LANG === "he" ? "en" : "he"}" aria-label="${t("lang_switch")}" title="${t("lang_switch")}">
                    ${t("lang_switch_short")}
                </button>
                <button id="themeToggle" class="icon-btn" type="button" aria-label="${t("theme_toggle")}" title="${t("theme_toggle")}">
                    <i class="bi"></i>
                </button>
            </div>
        </div>`;

    document.body.prepend(header);
    document.body.prepend(announcement);

    // השם המלא, ובטלפון רק השם הפרטי (השאר מוסתר ב-CSS)
    const words = (getUserName() || "").split(" ");
    const first = header.querySelector(".user-first");
    if (first) {
        first.textContent = words[0];
        header.querySelector(".user-rest").textContent = words.length > 1 ? " " + words.slice(1).join(" ") : "";
    }

    document.getElementById("themeToggle").addEventListener("click", toggleTheme);
    document.getElementById("langToggle").addEventListener("click", toggleLanguage);
    applyTheme(document.documentElement.getAttribute("data-bs-theme"));
}


function renderFooter() {
    const footer = document.createElement("footer");
    footer.className = "site-footer";
    footer.innerHTML = `
        <div class="container">
            <div class="row g-4">
                <div class="col-md-5">
                    <a class="wordmark" href="shop.html">${STORE_NAME}</a>
                    <p class="mt-2 mb-0">${t("footer_tagline")}</p>
                </div>
                <div class="col-6 col-md-3">
                    <h3>${t("footer_service")}</h3>
                    <ul>
                        <li>${t("footer_free_ship")}</li>
                        <li>${t("footer_returns")}</li>
                        <li>${t("footer_warranty")}</li>
                        <li class="mt-2"><a href="tel:035550123" dir="ltr">03-555-0123</a></li>
                        <li>${t("footer_hours")}</li>
                    </ul>
                </div>
                <div class="col-6 col-md-4">
                    <h3>${t("footer_store")}</h3>
                    <ul>
                        <li><a href="shop.html">${t("nav_all")}</a></li>
                        <li><a href="cart.html">${t("my_cart")}</a></li>
                        <li><a href="orders.html">${t("my_orders")}</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">© ${new Date().getFullYear()} ${STORE_NAME} · ${t("footer_course")}</div>
        </div>`;
    document.body.append(footer);
}


// הודעת "ברוכים הבאים" אחרי כניסה מוצלחת (user.js שומר אותה רגע לפני המעבר לחנות)
function showWelcomeToast() {
    const name = sessionStorage.getItem("welcomeNotice");
    if (name) {
        sessionStorage.removeItem("welcomeNotice");
        showToast(t("welcome_msg"), "info", t("welcome_title", { name }));
    }
}


// כפתורי בחירת השפה בעמוד הכניסה
function connectLanguageButtons() {
    document.querySelectorAll(".lang-option").forEach(button => {
        const isActive = button.dataset.lang === LANG;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", isActive);
        button.addEventListener("click", () => {
            if (!isActive) {
                setLanguage(button.dataset.lang);
            }
        });
    });
}


// בונים את המסגרת של העמוד מיד כשהקובץ נטען
renderHeader();
renderFooter();
connectLanguageButtons();
updateCartBadge();
showWelcomeToast();

// עדכון המספר גם כשהסל משתנה בלשונית אחרת
window.addEventListener("storage", event => {
    if (event.key === "cart") {
        updateCartBadge();
    }
});
