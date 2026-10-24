// orders.js - עמוד "ההזמנות שלי"
// ההזמנות נשמרות ב-localStorage תחת המפתח "orders:<שם המשתמש>" (checkout.js שומר אותן אחרי תשלום)
// בפורמט: [{ number, date, items: [{ id, quantity, price }], total }]

const ordersList = document.getElementById("orders-list");
const ordersSummary = document.getElementById("orders-summary");


function getOrders() {
    return JSON.parse(localStorage.getItem(getUserKey("orders"))) || [];
}


// תאריך ושעה בפורמט של השפה שנבחרה
function formatDate(isoDate) {
    const date = new Date(isoDate);
    const locale = LANG === "he" ? "he-IL" : "en-GB";

    return date.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" }) +
        " · " +
        date.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
}


// שורה אחת של מוצר בתוך הזמנה
function createOrderItemHtml(item) {
    const product = getProductById(item.id);

    // אם המוצר כבר לא קיים בחנות - מדלגים עליו
    if (!product) {
        return "";
    }

    return `
        <div class="order-item">
            <img src="${product.image}" alt="${getProductName(product)}">
            <div class="flex-grow-1">
                <strong>${getProductName(product)}</strong>
                <div class="text-muted-soft small">${t("quantity", { n: item.quantity })}</div>
            </div>
            <span>${formatPrice(item.price * item.quantity)}</span>
        </div>
    `;
}


function renderOrders() {
    const orders = getOrders();

    if (orders.length === 0) {
        ordersList.innerHTML = `
            <div class="empty-state">
                <h3>${t("orders_empty_title")}</h3>
                <p>${t("orders_empty_text")}</p>
                <a href="shop.html" class="btn btn-dark">${t("all_jewelry")}</a>
            </div>`;
        return;
    }

    // סיכום: כמה הזמנות וכמה כסף בסך הכל
    let totalSpent = 0;
    orders.forEach(function (order) {
        totalSpent += order.total;
    });
    ordersSummary.textContent = "· " + (orders.length === 1 ? t("orders_count_one") : t("orders_count", { n: orders.length })) +
        " · " + t("orders_total_spent", { price: formatPrice(totalSpent) });

    ordersList.innerHTML = "";

    // ההזמנה האחרונה מוצגת ראשונה
    const newestFirst = orders.slice().reverse();

    newestFirst.forEach(function (order) {
        let itemsCount = 0;
        let itemsHtml = "";

        let itemsTotal = 0;

        order.items.forEach(function (item) {
            itemsCount += item.quantity;
            itemsTotal += item.price * item.quantity;
            itemsHtml += createOrderItemHtml(item);
        });

        // אם שולם משלוח - מציגים אותו כשורה נפרדת
        const shipping = order.total - itemsTotal;
        if (shipping > 0) {
            itemsHtml += `
                <div class="order-item order-shipping">
                    <span class="flex-grow-1 text-muted-soft">${t("shipping")}</span>
                    <span>${formatPrice(shipping)}</span>
                </div>`;
        }

        const orderElement = document.createElement("section");
        orderElement.className = "order-card";
        orderElement.innerHTML = `
            <div class="order-card-header">
                <div>
                    <h2 class="order-card-title">${t("order_label", { n: order.number })}</h2>
                    <span class="text-muted-soft small">${formatDate(order.date)}</span>
                </div>
                <div class="text-end">
                    <strong class="order-card-total">${formatPrice(order.total)}</strong>
                    <div class="text-muted-soft small">${itemsCount === 1 ? t("items_label_one") : t("items_label", { n: itemsCount })}</div>
                </div>
            </div>
            ${itemsHtml}
        `;

        ordersList.appendChild(orderElement);
    });
}


renderOrders();
