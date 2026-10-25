// search.js - חיפוש, סינון לפי קטגוריה ומיון בעמוד החנות
// נטען אחרי products.js ו-shop.js (משתמש ב-products וב-displayProducts)

const searchInput = document.getElementById("search-input");
const searchClearButton = document.getElementById("search-clear");
const sortSelect = document.getElementById("sort-select");
const categoryButtons = document.querySelectorAll("#category-filter button");
const resultsCount = document.getElementById("results-count");
const noResults = document.getElementById("no-results");

// מה המשתמש בחר כרגע
const filters = {
    query: "",
    category: "all",
    sort: "default"
};


// האם המוצר מתאים לטקסט שהוקלד (בשם, בתיאור או בקטגוריה)
function matchesSearch(product, query) {
    if (query === "") {
        return true;
    }

    const text = (getProductName(product) + " " + getProductDescription(product) + " " + getCategoryName(product.category)).toLowerCase();
    return text.includes(query);
}


function sortProducts(list) {
    const sorted = list.slice(); // עותק, כדי לא לשנות את הסדר המקורי

    if (filters.sort === "price-asc") {
        sorted.sort((a, b) => a.price - b.price);
    } else if (filters.sort === "price-desc") {
        sorted.sort((a, b) => b.price - a.price);
    } else if (filters.sort === "name") {
        sorted.sort((a, b) => getProductName(a).localeCompare(getProductName(b), LANG));
    }

    return sorted;
}


// מפעילים את כל הבחירות יחד ומציגים את התוצאה
function applyFilters() {
    const query = filters.query.trim().toLowerCase();

    const filtered = products.filter(product =>
        (filters.category === "all" || product.category === filters.category) &&
        matchesSearch(product, query)
    );

    displayProducts(sortProducts(filtered));

    resultsCount.textContent = filtered.length === products.length
        ? t("results_all", { n: products.length })
        : t("results_some", { n: filtered.length });

    noResults.classList.toggle("d-none", filtered.length > 0);
    searchClearButton.classList.toggle("d-none", filters.query === "");
}


function setCategory(category) {
    filters.category = category;

    categoryButtons.forEach(button => {
        const isActive = button.dataset.category === category;
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", isActive);
    });

    applyFilters();
}


function resetFilters() {
    filters.query = "";
    filters.sort = "default";
    searchInput.value = "";
    sortSelect.value = "default";
    setCategory("all");
}


// ---------- חיבור לכפתורים ולשדות ----------

searchInput.addEventListener("input", function () {
    filters.query = searchInput.value;
    applyFilters();
});

searchClearButton.addEventListener("click", function () {
    searchInput.value = "";
    filters.query = "";
    applyFilters();
    searchInput.focus();
});

sortSelect.addEventListener("change", function () {
    filters.sort = sortSelect.value;
    applyFilters();
});

categoryButtons.forEach(button => {
    button.addEventListener("click", function () {
        setCategory(button.dataset.category);
    });
});

document.getElementById("reset-filters").addEventListener("click", resetFilters);

// אריחי הקטגוריות בראש העמוד: מסננים וגוללים אל המוצרים
document.querySelectorAll(".category-tile").forEach(tile => {
    tile.addEventListener("click", function () {
        setCategory(tile.dataset.category);
        document.getElementById("toolbar").scrollIntoView({ behavior: "smooth", block: "start" });
    });
});


// מציגים את כל המוצרים כשנכנסים לחנות.
// רק בפעם הראשונה הכרטיסים נכנסים בהדרגה; בחיפוש ובסינון הם מופיעים מיד
productsContainer.classList.add("first-load");
applyFilters();
setTimeout(function () {
    productsContainer.classList.remove("first-load");
}, 1200);
