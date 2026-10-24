// user.js - ניהול המשתמש באתר
// שמירת השם ב-localStorage, הצגתו בכל העמודים, ויציאה מהמערכת.
// יש לצרף את הקובץ הזה לכל עמוד באתר, בתוך <head>.

const USER_KEY = "userName";       // המפתח שבו נשמר השם ב-localStorage
const LOGIN_PAGE = "index.html";   // עמוד הכניסה
const FIRST_PAGE = "shop.html";    // העמוד שאליו עוברים אחרי הכניסה


// ---------- פונקציות בסיס ----------

function saveUserName(name) {
    localStorage.setItem(USER_KEY, name);
}

function getUserName() {
    return localStorage.getItem(USER_KEY);
}

// הסל וההזמנות נשמרים בנפרד לכל משתמש, למשל "cart:נועה כהן" ו-"orders:נועה כהן"
// כך מי שנכנסת אחרי מישהי אחרת באותו מחשב לא רואה את הסל וההזמנות שלה
function getUserKey(name) {
    return name + ":" + getUserName();
}

function isLoggedIn() {
    return getUserName() != null;
}

async function logout() {
    const confirmed = await showConfirm(t("logout_msg"), {
        title: t("logout_title"),
        okText: t("logout_ok"),
        danger: true
    });

    if (confirmed) {
        localStorage.removeItem(USER_KEY);
        window.location.href = LOGIN_PAGE;
    }
}


// ---------- בדיקת תקינות השם ----------

// מחזירה הודעת שגיאה, או מחרוזת ריקה אם השם תקין
function validateFullName(name) {
    if (name === "") {
        return t("err_name_empty");
    }

    const words = name.split(" ");
    if (words.length < 2) {
        return t("err_name_two");
    }

    // כל מילה: לפחות 2 אותיות בעברית או באנגלית (מותר גם ' או -)
    const wordPattern = /^[a-zA-Zא-ת'\-]{2,}$/;
    for (let i = 0; i < words.length; i++) {
        if (!wordPattern.test(words[i])) {
            return t("err_name_letters");
        }
    }

    return "";
}

// מסירה רווחים מיותרים: "  ישראל   ישראלי " => "ישראל ישראלי"
function cleanName(name) {
    return name.trim().replace(/\s+/g, " ");
}


// ---------- הצגת השם בעמוד ----------

// כל אלמנט עם class="user-name" יקבל את שם המשתמש
function showUserName() {
    const name = getUserName();
    const elements = document.querySelectorAll(".user-name");

    for (let i = 0; i < elements.length; i++) {
        elements[i].textContent = name; // textContent ולא innerHTML - כדי שלא יוזרק HTML
    }
}

// כל כפתור עם class="logout-btn" יבצע יציאה
function connectLogoutButtons() {
    const buttons = document.querySelectorAll(".logout-btn");

    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", logout);
    }
}

// עמוד הכניסה מסומן ב-<html data-page="login"> (כך זה עובד גם כשהכתובת לא נגמרת ב-index.html)
function isLoginPage() {
    return document.documentElement.dataset.page === "login";
}

// בעמודים הפנימיים: אם אין משתמש מחובר - חוזרים לעמוד הכניסה
// רץ מיד כשהקובץ נטען (בתוך <head>), כדי שהעמוד לא יוצג בכלל
function requireLogin() {
    if (!isLoginPage() && !isLoggedIn()) {
        sessionStorage.setItem("loginNotice", "1");
        window.location.replace(LOGIN_PAGE);
    }
}

requireLogin();


// ---------- עמוד הכניסה (index.html) ----------

function initLoginPage() {
    const loginForm = document.getElementById("loginForm");
    const nameInput = document.getElementById("fullName");
    const nameError = document.getElementById("nameError");

    // הגיעו לכאן מעמוד אחר בלי להיכנס קודם
    if (sessionStorage.getItem("loginNotice")) {
        sessionStorage.removeItem("loginNotice");
        showToast(t("login_notice"), "warning");
    }

    // אם המשתמש כבר נכנס בעבר - מציגים לו "ברוך שובך" במקום הטופס
    if (isLoggedIn()) {
        document.getElementById("loginSection").classList.add("d-none");
        document.getElementById("welcomeSection").classList.remove("d-none");
        showUserName();
        return;
    }

    nameInput.focus();

    loginForm.addEventListener("submit", function (event) {
        event.preventDefault(); // שלא ירענן את העמוד

        const name = cleanName(nameInput.value);
        const error = validateFullName(name);

        if (error !== "") {
            nameError.textContent = error;
            nameInput.classList.add("is-invalid");
            nameInput.focus();
            return;
        }

        saveUserName(name);

        // הודעת "ברוכים הבאים" תוצג בעמוד החנות (layout.js)
        sessionStorage.setItem("welcomeNotice", name);
        window.location.href = FIRST_PAGE;
    });

    // ברגע שהמשתמש מתחיל לתקן - מורידים את סימון השגיאה
    nameInput.addEventListener("input", function () {
        nameInput.classList.remove("is-invalid");
    });

    loginForm.addEventListener("reset", function () {
        nameInput.classList.remove("is-invalid");
        nameInput.focus();
    });
}


// ---------- הפעלה כשהעמוד נטען ----------

document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("loginForm") != null) {
        initLoginPage();
    } else {
        showUserName();
    }

    connectLogoutButtons();
});
