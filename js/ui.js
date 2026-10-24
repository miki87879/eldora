// ui.js - הודעות וחלונות קופצים בעיצוב אחיד, במקום alert ו-confirm
// משתמשים ב-Toast וב-Modal של Bootstrap


// מונע הזרקת HTML כשמציגים טקסט שהמשתמש הקליד
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}


// הודעה קטנה שקופצת בפינה ונעלמת לבד
// type: "success" | "danger" | "warning" | "info"
function showToast(message, type = "success", title = "") {
    let container = document.getElementById("toastContainer");

    if (!container) {
        container = document.createElement("div");
        container.id = "toastContainer";
        container.className = "toast-container position-fixed bottom-0 start-50 translate-middle-x p-3";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.setAttribute("role", type === "danger" ? "alert" : "status");
    toast.setAttribute("aria-live", "polite");

    toast.innerHTML = `
        <div class="d-flex align-items-start gap-3 py-3 px-3">
            <div class="flex-grow-1">
                ${title ? `<strong class="d-block">${escapeHtml(title)}</strong>` : ""}
                <span>${escapeHtml(message)}</span>
            </div>
            <button type="button" class="btn-close btn-sm mt-1" data-bs-dismiss="toast" aria-label="${t("close")}"></button>
        </div>
    `;

    container.appendChild(toast);

    // לא יותר מ-3 הודעות על המסך בבת אחת
    while (container.children.length > 3) {
        container.firstElementChild.remove();
    }

    const bsToast = new bootstrap.Toast(toast, { delay: 3500 });
    toast.addEventListener("hidden.bs.toast", () => toast.remove());
    bsToast.show();
}


// יוצר חלון קופץ ומוסיף אותו לעמוד
function createModal(innerHtml) {
    const modalElement = document.createElement("div");
    modalElement.className = "modal fade";
    modalElement.tabIndex = -1;
    modalElement.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content p-3 p-md-4">${innerHtml}</div>
        </div>
    `;
    document.body.appendChild(modalElement);
    return modalElement;
}


// חלון אישור במקום confirm. מחזיר Promise עם true (אישור) או false (ביטול)
// דוגמה: if (await showConfirm("למחוק?")) { ... }
function showConfirm(message, options) {
    options = options || {};
    const title = options.title || t("confirm_title");
    const okText = options.okText || t("ok");
    const cancelText = options.cancelText || t("cancel");
    const danger = options.danger || false;

    return new Promise(resolve => {
        const modalElement = createModal(`
            <div class="modal-body">
                <h2 class="modal-title mb-2">${escapeHtml(title)}</h2>
                <p class="text-muted-soft mb-0">${escapeHtml(message)}</p>
            </div>
            <div class="modal-footer border-0 justify-content-start gap-2">
                <button type="button" class="btn btn-outline-dark" data-bs-dismiss="modal">${escapeHtml(cancelText)}</button>
                <button type="button" class="btn ${danger ? "btn-danger" : "btn-dark"}" data-ok>${escapeHtml(okText)}</button>
            </div>
        `);

        const modal = new bootstrap.Modal(modalElement);
        let confirmed = false;

        modalElement.querySelector("[data-ok]").addEventListener("click", () => {
            confirmed = true;
            modal.hide();
        });

        modalElement.addEventListener("hidden.bs.modal", () => {
            modalElement.remove();
            resolve(confirmed);
        });

        modal.show();
    });
}


// חלון הודעה במקום alert. מחזיר Promise שמתממש כשהחלון נסגר
// bodyHtml יכול להכיל HTML (למשל פרטי הזמנה) - לא להכניס אליו טקסט של המשתמש בלי escapeHtml
function showAlert(title, bodyHtml, options) {
    options = options || {};
    const buttonText = options.buttonText || t("close");

    return new Promise(resolve => {
        const modalElement = createModal(`
            <div class="modal-body">
                <h2 class="modal-title mb-2">${escapeHtml(title)}</h2>
                <div>${bodyHtml}</div>
            </div>
            <div class="modal-footer border-0 justify-content-start">
                <button type="button" class="btn btn-dark" data-bs-dismiss="modal">${escapeHtml(buttonText)}</button>
            </div>
        `);

        const modal = new bootstrap.Modal(modalElement);

        modalElement.addEventListener("hidden.bs.modal", () => {
            modalElement.remove();
            resolve();
        });

        modal.show();
    });
}


// מציג גלגל טעינה בתוך כפתור (למשל בזמן "עיבוד התשלום")
function setButtonLoading(button, isLoading, loadingText = t("processing")) {
    if (isLoading) {
        button.dataset.originalHtml = button.innerHTML;
        button.disabled = true;
        button.innerHTML = `<span class="spinner-border spinner-border-sm ms-2" aria-hidden="true"></span>${loadingText}`;
    } else {
        button.disabled = false;
        button.innerHTML = button.dataset.originalHtml || button.innerHTML;
    }
}
