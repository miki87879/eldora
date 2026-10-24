// ==========================================
// CART PAGE
// הסל נשמר ב-localStorage תחת המפתח "cart:<שם המשתמש>" (getUserKey ב-user.js)
// בפורמט: [{ id: מספר, quantity: מספר }]
// ==========================================

const cartItemsContainer = document.getElementById("cart-items");
const cartTotalElement = document.getElementById("cart-total");
const cartCountElement = document.getElementById("cart-count");
const cartSubtotalElement = document.getElementById("cart-subtotal");
const cartShippingElement = document.getElementById("cart-shipping");
const freeShippingNote = document.getElementById("free-shipping-note");
const clearCartButton = document.getElementById("clear-cart");
const checkoutLink = document.getElementById("checkout-link");


// קריאת הסל מה-localStorage (אם אין - מחזירים סל ריק)
function getCart() {
    return JSON.parse(localStorage.getItem(getUserKey("cart"))) || [];
}


// שמירת הסל ב-localStorage
function saveCart(cart) {
    localStorage.setItem(getUserKey("cart"), JSON.stringify(cart));
    updateCartBadge(); // המונה בתפריט העליון (layout.js)
}


// ציור הסל על המסך
function renderCart() {
    const cart = getCart();

    cartItemsContainer.innerHTML = "";
    let total = 0;
    let shownItems = 0;
    let itemsCount = 0;

    cart.forEach(function (item) {
        // מחפשים את פרטי המוצר לפי ה-id
        const product = getProductById(item.id);

        // אם המוצר לא קיים - מדלגים עליו
        if (!product) {
            return;
        }

        // מחיר השורה = מחיר ליחידה * כמות בסל
        const subtotal = product.price * item.quantity;
        total += subtotal;
        shownItems++;
        itemsCount += item.quantity;

        const row = document.createElement("div");
        row.className = "cart-item";

        row.innerHTML = `
            <img class="cart-item-image" src="${product.image}" alt="${getProductName(product)}">

            <div class="cart-item-info">
                <strong class="cart-item-name">${getProductName(product)}</strong>
                <div class="text-muted-soft small mt-1">${getCategoryName(product.category)} · ${t("sku")} ${product.id}</div>
                <div class="text-muted-soft small">${t("per_unit", { price: formatPrice(product.price) })}</div>
            </div>

            <div class="cart-item-actions">
                <div class="qty-control" role="group" aria-label="${t("qty_aria")}">
                    <button type="button" data-action="minus" data-id="${item.id}" aria-label="${t("qty_minus")}"><i class="bi bi-dash"></i></button>
                    <span class="cart-item-qty">${item.quantity}</span>
                    <button type="button" data-action="plus" data-id="${item.id}" aria-label="${t("qty_plus")}"><i class="bi bi-plus"></i></button>
                </div>

                <div class="cart-item-subtotal">${formatPrice(subtotal)}</div>

                <button type="button" class="btn-remove" data-action="remove" data-id="${item.id}" aria-label="${t("remove_item")}" title="${t("remove_item")}">
                    <i class="bi bi-x-lg"></i>
                </button>
            </div>
        `;

        cartItemsContainer.appendChild(row);
    });

    // אם אין מוצרים להצגה - הסל ריק
    if (shownItems === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-state cart-empty">
                <h3>${t("empty_cart_title")}</h3>
                <p>${t("empty_cart_text")}</p>
                <a href="shop.html" class="btn btn-dark">${t("all_jewelry")}</a>
            </div>`;
    }

    // משלוח: חינם מעל ₪200 (getShippingPrice ב-products.js)
    const shipping = getShippingPrice(total);
    cartSubtotalElement.textContent = formatPrice(total);
    cartShippingElement.textContent = shipping === 0 ? t("free") : formatPrice(shipping);
    cartTotalElement.textContent = formatPrice(total + shipping);
    cartCountElement.textContent = itemsCount;

    // כמה חסר למשלוח חינם
    if (shownItems === 0) {
        freeShippingNote.textContent = "";
    } else if (shipping > 0) {
        freeShippingNote.textContent = t("free_shipping_left", { price: formatPrice(FREE_SHIPPING_FROM - total) });
    } else {
        freeShippingNote.textContent = t("free_shipping_reached");
    }
    clearCartButton.classList.toggle("d-none", shownItems === 0);

    // כשהסל ריק אי אפשר לעבור לתשלום
    if (shownItems === 0) {
        checkoutLink.classList.add("disabled");
        checkoutLink.setAttribute("aria-disabled", "true");
    } else {
        checkoutLink.classList.remove("disabled");
        checkoutLink.removeAttribute("aria-disabled");
    }
}


// שינוי כמות: delta הוא +1 או -1
function changeQty(id, delta) {
    const cart = getCart();
    const item = cart.find(function (cartItem) {
        return cartItem.id === id;
    });

    if (!item) {
        return;
    }

    const newQuantity = item.quantity + delta;

    // הגדלה - רק אם יש מספיק במלאי
    if (delta > 0 && !checkStock(id, newQuantity)) {
        showToast(t("toast_no_more"), "warning");
        return;
    }

    if (newQuantity <= 0) {
        // ירדנו ל-0 - מוחקים את המוצר
        removeItem(id);
        return;
    }

    item.quantity = newQuantity;
    saveCart(cart);
    renderCart();
}


// מחיקת מוצר מהסל
function removeItem(id) {
    const product = getProductById(id);
    const cart = getCart().filter(function (cartItem) {
        return cartItem.id !== id;
    });

    saveCart(cart);
    renderCart();

    if (product) {
        showToast(t("toast_removed", { name: getProductName(product) }), "info");
    }
}


// ריקון הסל - רק אחרי אישור
clearCartButton.addEventListener("click", async function () {
    const confirmed = await showConfirm(t("clear_msg"), {
        title: t("clear_title"),
        okText: t("clear_ok"),
        danger: true
    });

    if (confirmed) {
        saveCart([]);
        renderCart();
        showToast(t("toast_cleared"), "info");
    }
});


// לחיצות על כפתורי + / - / מחיקה (event delegation על המכל)
cartItemsContainer.addEventListener("click", function (event) {
    const button = event.target.closest("button[data-action]");

    if (!button) {
        return;
    }

    const id = Number(button.dataset.id);
    const action = button.dataset.action;

    if (action === "plus") {
        changeQty(id, 1);
    } else if (action === "minus") {
        changeQty(id, -1);
    } else if (action === "remove") {
        removeItem(id);
    }
});


// כשהעמוד נטען - מציגים את הסל
renderCart();
