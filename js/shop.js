const productsContainer = document.getElementById("products-container");


// שורת המלאי מתחת למחיר: כמה נשאר / נשארו מעט / אזל
function getStockNote(quantity) {
    if (quantity === 0) {
        return `<span class="stock-note out">${t("stock_out")}</span>`;
    }
    if (quantity <= 5) {
        return `<span class="stock-note low">${t("stock_low", { n: quantity })}</span>`;
    }
    return `<span class="stock-note">${t("stock_ok", { n: quantity })}</span>`;
}


// תווית קטנה על תמונת המוצר (חדש / רב מכר / מבצע)
function getBadgeHtml(product) {
    if (!product.badge) {
        return "";
    }
    return `<span class="product-badge badge-${product.badge}">${t("badge_" + product.badge)}</span>`;
}


// המחיר, ואם יש מבצע גם המחיר הקודם מחוק
function getPriceHtml(product) {
    let html = `<span class="product-price">${formatPrice(product.price)}</span>`;
    if (product.oldPrice) {
        html += ` <del class="product-old-price">${formatPrice(product.oldPrice)}</del>`;
    }
    return html;
}


// הצגת המוצרים באתר
function displayProducts(productsToDisplay) {

    productsContainer.innerHTML = "";

    productsToDisplay.forEach((product, index) => {

        const isOutOfStock = product.quantity === 0;
        const name = getProductName(product);

        const productCard = document.createElement("div");

        productCard.className = "col";
        productCard.style.setProperty("--i", index); // לסדר הכניסה ההדרגתית (style.css)

        productCard.innerHTML = `
            <article class="product-card ${isOutOfStock ? "out-of-stock" : ""}">

                <button type="button" class="product-img product-open" data-id="${product.id}"
                        aria-label="${t("open_details", { name: name })}">
                    <img src="${product.image}" alt="${name}" loading="lazy">
                    ${getBadgeHtml(product)}
                </button>

                <div class="product-meta">
                    <span class="product-category">${getCategoryName(product.category)} · ${t("sku")} ${product.id}</span>
                    <h2 class="product-title">
                        <button type="button" class="product-open" data-id="${product.id}">${name}</button>
                    </h2>
                    <p class="product-desc">${getProductDescription(product)}</p>

                    <div class="product-price-row">
                        <span>${getPriceHtml(product)}</span>
                        ${getStockNote(product.quantity)}
                    </div>

                    <button
                        class="btn btn-outline-dark w-100 add-to-cart-btn"
                        data-id="${product.id}"
                        ${isOutOfStock ? "disabled" : ""}>
                        ${isOutOfStock ? t("sold_out") : t("add_to_cart")}
                    </button>
                </div>

            </article>
        `;

        productsContainer.appendChild(productCard);
    });

    addCartButtonEvents();
}


// חיבור הפעולה לכפתורים של הוספה לעגלה
function addCartButtonEvents() {

    const buttons =
        document.querySelectorAll(".add-to-cart-btn");

    buttons.forEach(button => {

        button.addEventListener("click", function () {

            const productId =
                Number(button.dataset.id);

            addToCart(productId);

        });

    });

}


// הוספת מוצר לעגלה (amount = כמה יחידות להוסיף, ברירת מחדל 1)
function addToCart(productId, amount = 1) {

    // מוצאים את המוצר לפי המספר שלו
    const product = getProductById(productId);

    if (!product) {
        showToast(t("toast_not_found"), "danger");
        return;
    }


    // לוקחים את העגלה שכבר שמורה
    let cart =
        JSON.parse(localStorage.getItem(getUserKey("cart"))) || [];


    // בודקים אם המוצר כבר נמצא בעגלה
    const itemInCart =
        cart.find(item => item.id === productId);


    // בודקים מה תהיה הכמות אחרי ההוספה
    const requestedQuantity =
        itemInCart
            ? itemInCart.quantity + amount
            : amount;


    // בודקים שיש מספיק במלאי
    if (!checkStock(productId, requestedQuantity)) {

        showToast(
            t("toast_stock_full", { n: product.quantity }),
            "warning"
        );

        return;
    }


    // אם המוצר כבר בעגלה מוסיפים לכמות
    if (itemInCart) {

        itemInCart.quantity += amount;

    } else {

        // אם הוא לא בעגלה מוסיפים אותו בפעם הראשונה
        cart.push({
            id: productId,
            quantity: amount
        });

    }


    // שומרים את העגלה
    localStorage.setItem(
        getUserKey("cart"),
        JSON.stringify(cart)
    );

    updateCartBadge();


    // הודעה שהמוצר נוסף בהצלחה
    showToast(t("toast_added", { name: getProductName(product) }), "success");
}


// כמה יחידות עוד אפשר להוסיף לסל (המלאי פחות מה שכבר בסל)
function getAvailableToAdd(product) {
    const cart = JSON.parse(localStorage.getItem(getUserKey("cart"))) || [];
    const itemInCart = cart.find(function (item) {
        return item.id === product.id;
    });
    const inCart = itemInCart ? itemInCart.quantity : 0;
    return product.quantity - inCart;
}


// ---------- חלון פרטי מוצר ----------
// לחיצה על התמונה או על שם המוצר פותחת חלון עם תמונה גדולה, תיאור ובחירת כמות

productsContainer.addEventListener("click", function (event) {
    const opener = event.target.closest(".product-open");
    if (opener) {
        showProductDetails(Number(opener.dataset.id));
    }
});

function showProductDetails(productId) {
    const product = getProductById(productId);
    const name = getProductName(product);
    const available = getAvailableToAdd(product);
    let amount = 1;

    const modalElement = document.createElement("div");
    modalElement.className = "modal fade";
    modalElement.tabIndex = -1;
    modalElement.innerHTML = `
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content product-modal">
                <button type="button" class="btn-close product-modal-close" data-bs-dismiss="modal" aria-label="${t("close")}"></button>
                <div class="row g-0">
                    <div class="col-md-6">
                        <div class="product-modal-img">
                            <img src="${product.image}" alt="${name}">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="product-modal-info">
                            <span class="product-category">${getCategoryName(product.category)} · ${t("sku")} ${product.id}</span>
                            <h2 class="modal-title mb-2">${name}</h2>
                            ${product.badge ? `<p class="mb-2"><span class="product-badge static badge-${product.badge}">${t("badge_" + product.badge)}</span></p>` : ""}
                            <p class="product-modal-price">${getPriceHtml(product)}</p>
                            <p class="text-muted-soft">${getProductDescription(product)}</p>
                            <p class="mb-4">${getStockNote(product.quantity)}</p>

                            <div class="d-flex gap-2">
                                <div class="qty-control" role="group" aria-label="${t("qty_aria")}">
                                    <button type="button" data-step="-1" aria-label="${t("qty_minus")}"><i class="bi bi-dash"></i></button>
                                    <span class="cart-item-qty" id="detailsAmount">1</span>
                                    <button type="button" data-step="1" aria-label="${t("qty_plus")}"><i class="bi bi-plus"></i></button>
                                </div>
                                <button type="button" class="btn btn-dark flex-grow-1" id="detailsAdd" ${available <= 0 ? "disabled" : ""}>
                                    ${available <= 0 ? t("sold_out") : t("add_to_cart")}
                                </button>
                            </div>
                            ${available <= 0 && product.quantity > 0 ? `<p class="small text-muted-soft mt-2">${t("all_in_cart")}</p>` : ""}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modalElement);

    const amountElement = modalElement.querySelector("#detailsAmount");

    // כפתורי + ו- : בין 1 לכמות שעוד אפשר להוסיף
    modalElement.querySelectorAll("[data-step]").forEach(function (button) {
        button.addEventListener("click", function () {
            const newAmount = amount + Number(button.dataset.step);
            if (newAmount >= 1 && newAmount <= available) {
                amount = newAmount;
                amountElement.textContent = amount;
            }
        });
    });

    const modal = new bootstrap.Modal(modalElement);

    modalElement.querySelector("#detailsAdd").addEventListener("click", function () {
        addToCart(productId, amount);
        modal.hide();
    });

    modalElement.addEventListener("hidden.bs.modal", function () {
        modalElement.remove();
    });

    modal.show();
}
