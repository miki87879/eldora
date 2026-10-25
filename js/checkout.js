// ==========================================
// CHECKOUT PAGE
// ==========================================


// ==========================================
// אלמנטים מה-HTML
// ==========================================

const checkoutForm = document.getElementById("checkoutForm");
const fullNameInput = document.getElementById("fullName");
const phoneInput = document.getElementById("phone");
const addressInput = document.getElementById("address");
const cardNumberInput = document.getElementById("cardNumber");
const expiryInput = document.getElementById("expiry");
const cvvInput = document.getElementById("cvv");
const payButton = document.getElementById("payButton");

const orderSummary = document.getElementById("orderSummary");
const totalPriceElement = document.getElementById("totalPrice");
const subtotalPriceElement = document.getElementById("subtotalPrice");
const shippingPriceElement = document.getElementById("shippingPrice");


// ==========================================
// שם המשתמש
// ==========================================

// מכניסים את השם שנשמר בעמוד הכניסה אוטומטית לטופס
const userName = getUserName();

if (userName) {
    fullNameInput.value = userName;
}


// ==========================================
// סל הקניות
// ==========================================

// הסל נשמר בפורמט [{ id, quantity }] - את השם והמחיר לוקחים מ-products.js
function getOrderItems() {
    const cart = JSON.parse(localStorage.getItem(getUserKey("cart"))) || [];
    const items = [];

    cart.forEach(function (cartItem) {
        const product = getProductById(cartItem.id);

        // אם המוצר לא קיים - מדלגים עליו
        if (product) {
            items.push({ product: product, quantity: cartItem.quantity });
        }
    });

    return items;
}


// ==========================================
// הצגת סיכום ההזמנה
// ==========================================

function displayOrder() {

    const items = getOrderItems();

    // אם הסל ריק - מציגים הודעה במקום הטופס
    const isEmpty = items.length === 0;
    document.getElementById("emptyCheckout").classList.toggle("d-none", !isEmpty);
    document.getElementById("checkoutContent").classList.toggle("d-none", isEmpty);

    // מנקים תוכן קודם
    orderSummary.innerHTML = "";

    let total = 0;

    // עוברים על כל המוצרים בעגלה
    items.forEach(function (item) {

        const product = item.product;
        const quantity = item.quantity;

        // מחיר לפי הכמות
        const productTotal = product.price * quantity;

        // מוסיפים למחיר הכולל
        total += productTotal;

        const productRow = document.createElement("div");
        productRow.className = "order-item";

        productRow.innerHTML = `
            <img src="${product.image}" alt="${getProductName(product)}">

            <div class="flex-grow-1">
                <strong>${getProductName(product)}</strong>
                <div class="text-muted-soft small">${t("quantity", { n: quantity })}</div>
            </div>

            <span class="fw-semibold">${formatPrice(productTotal)}</span>
        `;

        orderSummary.appendChild(productRow);
    });

    // מציגים את המחיר הכולל
    // משלוח: חינם מעל ₪200 (getShippingPrice ב-products.js)
    const shipping = getShippingPrice(total);
    subtotalPriceElement.textContent = formatPrice(total);
    shippingPriceElement.textContent = shipping === 0 ? t("free") : formatPrice(shipping);

    // אריזת מתנה, אם נבחרה בסל
    const giftOptions = getGiftOptions();
    const gift = getGiftPrice();
    document.getElementById("giftRow").classList.toggle("d-none", gift === 0);
    document.getElementById("giftPrice").textContent = formatPrice(gift);
    const giftNote = document.getElementById("giftNote");
    giftNote.textContent = giftOptions.wrap && giftOptions.message ? "“" + giftOptions.message + "”" : "";
    giftNote.classList.toggle("d-none", giftNote.textContent === "");

    totalPriceElement.textContent = formatPrice(total + shipping + gift);

    // מחזירים את הסכום לתשלום, כולל משלוח ואריזה
    return total + shipping + gift;
}


// מפעילים את הפונקציה כשהעמוד נטען
displayOrder();


// ==========================================
// עזרה בהקלדה: רווחים במספר הכרטיס ו-/ בתוקף
// ==========================================

cardNumberInput.addEventListener("input", function () {
    const digits = cardNumberInput.value.replace(/\D/g, "").slice(0, 16);
    cardNumberInput.value = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
});

expiryInput.addEventListener("input", function () {
    const digits = expiryInput.value.replace(/\D/g, "").slice(0, 4);
    expiryInput.value = digits.length > 2 ? digits.slice(0, 2) + "/" + digits.slice(2) : digits;
});

cvvInput.addEventListener("input", function () {
    cvvInput.value = cvvInput.value.replace(/\D/g, "").slice(0, 3);
});


// ==========================================
// הצגת שגיאות ליד השדה (במקום alert)
// ==========================================

function setFieldError(input, message) {
    input.classList.toggle("is-invalid", message !== "");
    input.classList.toggle("is-valid", message === "");
    input.nextElementSibling.textContent = message;
}

// כשמתחילים לתקן שדה - מורידים ממנו את סימון השגיאה
checkoutForm.querySelectorAll("input").forEach(function (input) {
    input.addEventListener("input", function () {
        input.classList.remove("is-invalid");
    });
});


// ==========================================
// בדיקות תקינות
// מחזירה true אם כל השדות תקינים
// ==========================================

function validateForm() {

    const fullName = fullNameInput.value.trim();
    const cleanPhone = phoneInput.value.trim().replace(/-/g, "");
    const address = addressInput.value.trim();
    const cardNumber = cardNumberInput.value.replace(/\s/g, "");
    const expiry = expiryInput.value.trim();
    const cvv = cvvInput.value.trim();

    // לכל שדה: הודעת שגיאה, או "" אם הוא תקין

    // בדיקת שם
    setFieldError(fullNameInput, fullName.length < 2 ? t("err_name") : "");

    // בדיקת מספר טלפון ישראלי
    setFieldError(phoneInput, !/^05\d{8}$/.test(cleanPhone) ? t("err_phone") : "");

    // בדיקת כתובת
    setFieldError(addressInput, address.length < 5 ? t("err_address") : "");

    // בדיקת כרטיס אשראי
    setFieldError(cardNumberInput, !/^\d{16}$/.test(cardNumber) ? t("err_card") : "");

    // בדיקת תוקף
    setFieldError(expiryInput, getExpiryError(expiry));

    // בדיקת CVV
    setFieldError(cvvInput, !/^\d{3}$/.test(cvv) ? t("err_cvv") : "");

    // אם יש שדה עם שגיאה - עוברים אליו
    const firstInvalid = checkoutForm.querySelector(".is-invalid");

    if (firstInvalid) {
        firstInvalid.focus();
        return false;
    }

    return true;
}

// תוקף בפורמט MM/YY, חודש 01-12, ולא בעבר
function getExpiryError(expiry) {
    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
        return t("err_expiry_format");
    }

    const month = Number(expiry.slice(0, 2));
    const year = 2000 + Number(expiry.slice(3));

    if (month < 1 || month > 12) {
        return t("err_expiry_month");
    }

    const now = new Date();
    if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)) {
        return t("err_expiry_past");
    }

    return "";
}


// ==========================================
// טופס התשלום
// ==========================================

checkoutForm.addEventListener("submit", function (event) {

    // מונע מהעמוד להתרענן
    event.preventDefault();

    if (!validateForm()) {
        showToast(t("toast_fix_fields"), "danger");
        return;
    }

    const items = getOrderItems();

    // בודקים שוב שיש מספיק במלאי (אולי המלאי השתנה מאז שהמוצר נוסף לסל)
    const missing = items.find(function (item) {
        return !checkStock(item.product.id, item.quantity);
    });
    if (missing) {
        showToast(t("toast_stock_short", { n: missing.product.quantity, name: getProductName(missing.product) }), "warning");
        return;
    }

    // מדמים עיבוד תשלום של שנייה
    setButtonLoading(payButton, true, t("paying"));

    setTimeout(function () {

        // ==================================
        // ההזמנה הצליחה
        // ==================================

        const total = displayOrder();
        const orderNumber = Math.floor(100000 + Math.random() * 900000);

        // שומרים את ההזמנה בהיסטוריה (עמוד "ההזמנות שלי")
        saveOrder(orderNumber, items, total);

        // מורידים מהמלאי את מה שנקנה
        items.forEach(function (item) {
            reduceStock(item.product.id, item.quantity);
        });

        // מרוקנים את העגלה ואת בחירת אריזת המתנה
        localStorage.removeItem(getUserKey("cart"));
        localStorage.removeItem(getUserKey("gift"));
        updateCartBadge();

        setButtonLoading(payButton, false);

        showAlert(
            t("order_title"),
            `<p class="text-muted-soft mb-0">${t("order_text", { name: escapeHtml(fullNameInput.value.trim()) })}</p>
             <div class="order-details">
                 <div><span>${t("order_number")}</span><strong>${orderNumber}</strong></div>
                 <div><span>${t("amount_paid")}</span><strong>${formatPrice(total)}</strong></div>
             </div>`,
            { buttonText: t("to_my_orders") }
        ).then(function () {
            window.location.href = "orders.html";
        });

    }, 1000);
});


// שמירת הזמנה ב-localStorage תחת המפתח "orders:<שם המשתמש>"
// שומרים גם את המחיר ששולם, כדי שההיסטוריה לא תשתנה אם המחיר יתעדכן
function saveOrder(orderNumber, items, total) {
    const orders = JSON.parse(localStorage.getItem(getUserKey("orders"))) || [];
    const orderItems = [];

    items.forEach(function (item) {
        orderItems.push({
            id: item.product.id,
            quantity: item.quantity,
            price: item.product.price
        });
    });

    let itemsTotal = 0;
    orderItems.forEach(function (item) {
        itemsTotal += item.price * item.quantity;
    });

    orders.push({
        number: orderNumber,
        date: new Date().toISOString(),
        items: orderItems,
        shipping: getShippingPrice(itemsTotal),
        giftWrap: getGiftPrice(),
        total: total
    });

    localStorage.setItem(getUserKey("orders"), JSON.stringify(orders));
}
