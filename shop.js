const filterButtons = document.querySelectorAll("#category-filter button");
filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            const category = button.dataset.category;
                    const products = document.querySelectorAll(".product-card");

        products.forEach(product => {
            const productCategory = product.dataset.category;

            if (category === "all" || productCategory === category) {
                product.style.display = "block";
            } else {
                product.style.display = "none";
            }
        });
    });
});