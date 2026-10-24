// theme.js - מצב כהה / בהיר
// נטען בתוך <head>, כדי שהצבעים ייקבעו עוד לפני שהעמוד מוצג (בלי הבהוב)

const THEME_KEY = "theme";

function applyTheme(theme) {
    document.documentElement.setAttribute("data-bs-theme", theme);

    // מחליפים את האייקון בכפתור: ירח במצב בהיר, שמש במצב כהה
    const icon = document.querySelector("#themeToggle i");
    if (icon) {
        icon.className = theme === "dark" ? "bi bi-sun" : "bi bi-moon-stars";
    }
}

function toggleTheme() {
    const current = document.documentElement.getAttribute("data-bs-theme");
    const next = current === "dark" ? "light" : "dark";

    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
}

applyTheme(localStorage.getItem(THEME_KEY) || "light");
