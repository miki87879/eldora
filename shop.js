const productsContainer = document.getElementById("products-container");
const messageContainer = document.getElementById("message-container");


// הצגת המוצרים באתר
function displayProducts(productsToDisplay) {

    productsContainer.innerHTML = "";

    productsToDisplay.forEach(product => {

        const productCard = document.createElement("div");

        productCard.className = "col-md-4 col-sm-6 mb-4";

        productCard.innerHTML = `
            <div class="card h-100 shadow-sm">

                <img
                    src="${product.image}"
                    class="card-img-top"
                    alt="${product.name}"
                    style="height: 250px; object-fit: contain;"
                >

                <div class="card-body d-flex flex-column">

                    <h5 class="card-title">${product.name}</h5>

                    <p class="card-text">
                        ${product.description}
                    </p>

                    <p class="card-text">
                        <strong>Price:</strong> ₪${product.price}
                    </p>

                    <p class="card-text">
                        <strong>In stock:</strong> ${product.quantity}
                    </p>

                    <button
                        class="btn btn-dark mt-auto add-to-cart-btn"
                        data-id="${product.id}">
                        Add to Cart
                    </button>

                </div>

            </div>
        `;

        productsContainer.appendChild(productCard);
    });

    addCartButtonEvents();
}


// סינון המוצרים לפי קטגוריה
const filterButtons =
    document.querySelectorAll("#category-filter button");

filterButtons.forEach(button => {

    button.addEventListener("click", function () {

        const category = button.dataset.category;

        // אם לחצו על All מציגים את כל המוצרים
        if (category === "all") {

            displayProducts(products);

        } else {

            // מציגים רק את המוצרים מהקטגוריה שנבחרה
            const filteredProducts =
                getProductsByCategory(category);

            displayProducts(filteredProducts);
        }

    });

});


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


// הוספת מוצר לעגלה
function addToCart(productId) {

    // מוצאים את המוצר לפי המספר שלו
    const product = getProductById(productId);

    if (!product) {
        showMessage("Product not found.", "danger");
        return;
    }


    // לוקחים את העגלה שכבר שמורה
    let cart =
        JSON.parse(localStorage.getItem("cart")) || [];


    // בודקים אם המוצר כבר נמצא בעגלה
    const itemInCart =
        cart.find(item => item.id === productId);


    // בודקים מה תהיה הכמות אחרי ההוספה
    const requestedQuantity =
        itemInCart
            ? itemInCart.quantity + 1
            : 1;


    // בודקים שיש מספיק במלאי
    if (!checkStock(productId, requestedQuantity)) {

        showMessage(
            `Sorry! Only ${product.quantity} units are available.`,
            "warning"
        );

        return;
    }


    // אם המוצר כבר בעגלה מוסיפים לכמות
    if (itemInCart) {

        itemInCart.quantity++;

    } else {

        // אם הוא לא בעגלה מוסיפים אותו בפעם הראשונה
        cart.push({
            id: productId,
            quantity: 1
        });

    }


    // שומרים את העגלה
    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );


    // הודעה שהמוצר נוסף בהצלחה
    showMessage(
        `✓ ${product.name} was added to your cart!`,
        "success"
    );
}


// הצגת הודעה למשתמש
function showMessage(message, type) {

    messageContainer.innerHTML = `
        <div class="alert alert-${type} text-center shadow-sm">
            ${message}
        </div>
    `;

    // עולים למעלה כדי שההודעה תהיה גלויה
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    // אחרי 3 שניות ההודעה נעלמת
    setTimeout(function () {
        messageContainer.innerHTML = "";
    }, 3000);
}


// מציגים את כל המוצרים כשנכנסים לחנות
displayProducts(products);