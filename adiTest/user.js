// user.js - ניהול המשתמש באתר
// שמירת השם ב-localStorage, הצגתו בכל העמודים, ויציאה מהמערכת.
// יש לצרף את הקובץ הזה לכל עמוד באתר.

const USER_KEY = "userName";       // המפתח שבו נשמר השם ב-localStorage
const LOGIN_PAGE = "index.html";   // עמוד הכניסה
const FIRST_PAGE = "products.html"; // העמוד שאליו עוברים אחרי הכניסה


// ---------- פונקציות בסיס ----------

function saveUserName(name) {
    localStorage.setItem(USER_KEY, name);
}

function getUserName() {
    return localStorage.getItem(USER_KEY);
}

function isLoggedIn() {
    return getUserName() != null;
}

function logout() {
    localStorage.removeItem(USER_KEY);
    window.location.href = LOGIN_PAGE;
}


// ---------- בדיקת תקינות השם ----------

// מחזירה הודעת שגיאה, או מחרוזת ריקה אם השם תקין
function validateFullName(name) {
    if (name === "") {
        return "יש להכניס שם מלא";
    }

    const words = name.split(" ");
    if (words.length < 2) {
        return "יש להכניס שם פרטי ושם משפחה";
    }

    // כל מילה: לפחות 2 אותיות בעברית או באנגלית (מותר גם ' או -)
    const wordPattern = /^[a-zA-Zא-ת'\-]{2,}$/;
    for (let i = 0; i < words.length; i++) {
        if (!wordPattern.test(words[i])) {
            return "השם יכול להכיל אותיות בלבד (לפחות 2 אותיות בכל מילה)";
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
        buttons[i].addEventListener("click", function () {
            if (confirm("האם לצאת מהחשבון?")) {
                logout();
            }
        });
    }
}

// בעמודים הפנימיים: אם אין משתמש מחובר - חוזרים לעמוד הכניסה
function requireLogin() {
    if (!isLoggedIn()) {
        alert("יש להיכנס עם שם מלא לפני השימוש באתר");
        window.location.href = LOGIN_PAGE;
    }
}


// ---------- עמוד הכניסה (index.html) ----------

function initLoginPage() {
    const loginForm = document.getElementById("loginForm");
    const nameInput = document.getElementById("fullName");
    const nameError = document.getElementById("nameError");

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
        alert("שלום " + name + ", ברוך הבא לחנות!");
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
    const isLoginPage = document.getElementById("loginForm") != null;

    if (isLoginPage) {
        initLoginPage();
    } else {
        requireLogin();
        showUserName();
    }

    connectLogoutButtons();
});
