// ==========================================
// CART PAGE
// הסל נשמר ב-localStorage תחת המפתח "cart"
// בפורמט: [{ id: מספר, quantity: מספר }]
// ==========================================

const cartItemsContainer = document.getElementById("cart-items");
const cartTotalElement = document.getElementById("cart-total");
const cartMessage = document.getElementById("cart-message");
const clearCartButton = document.getElementById("clear-cart");
const checkoutLink = document.getElementById("checkout-link");


// קריאת הסל מה-localStorage (אם אין - מחזירים סל ריק)
function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}


// שמירת הסל ב-localStorage
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
}


// הצגת הודעה קצרה למשתמש
function showCartMessage(text) {
    cartMessage.innerHTML = `<div class="alert alert-warning">${text}</div>`;

    // ההודעה נעלמת אחרי 3 שניות
    setTimeout(function () {
        cartMessage.innerHTML = "";
    }, 3000);
}


// ציור הסל על המסך
function renderCart() {
    const cart = getCart();

    cartItemsContainer.innerHTML = "";
    let total = 0;
    let shownItems = 0;

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

        const row = document.createElement("div");
        row.className = "cart-item d-flex align-items-center gap-3 py-3 border-bottom";

        row.innerHTML = `
            <img class="cart-item-image" src="${product.image}" alt="${product.name}"
                 width="80" height="80" style="object-fit: contain;">

            <div class="cart-item-info flex-grow-1">
                <strong class="cart-item-name">${product.name}</strong>
                <div class="cart-item-price text-secondary">${product.price} ₪ ליחידה</div>
            </div>

            <div class="cart-item-quantity d-flex align-items-center gap-2">
                <button type="button" class="btn btn-outline-dark btn-sm" data-action="minus" data-id="${item.id}">-</button>
                <span class="cart-item-qty">${item.quantity}</span>
                <button type="button" class="btn btn-outline-dark btn-sm" data-action="plus" data-id="${item.id}">+</button>
            </div>

            <div class="cart-item-subtotal fw-bold">${subtotal} ₪</div>

            <button type="button" class="btn btn-outline-danger btn-sm" data-action="remove" data-id="${item.id}">מחיקה</button>
        `;

        cartItemsContainer.appendChild(row);
    });

    // אם אין מוצרים להצגה - הסל ריק
    if (shownItems === 0) {
        cartItemsContainer.innerHTML = `<p class="cart-empty text-center text-secondary my-5">הסל ריק</p>`;
    }

    cartTotalElement.textContent = total + " ₪";

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
        showCartMessage("אין מספיק במלאי");
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
    const cart = getCart().filter(function (cartItem) {
        return cartItem.id !== id;
    });

    saveCart(cart);
    renderCart();
}


// ריקון הסל
clearCartButton.addEventListener("click", function () {
    saveCart([]);
    renderCart();
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
