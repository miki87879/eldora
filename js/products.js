const products = [
    {
        id: 1,
        name: "שרשרת לב זהב",
        nameEn: "Gold Heart Necklace",
        price: 149,
        image: "images/heart-necklace.jpg",
        description: "שרשרת זהב עדינה עם תליון לב",
        descriptionEn: "Elegant gold heart necklace",
        category: "Necklaces",
        quantity: 8
    },
    {
        id: 2,
        name: "טבעת כסף",
        nameEn: "Silver Ring",
        price: 99,
        image: "images/silver-ring.jpg",
        description: "טבעת כסף אלגנטית לכל יום",
        descriptionEn: "Elegant silver ring",
        category: "Rings",
        quantity: 12
    },
    {
        id: 3,
        name: "עגילי חישוק זהב",
        nameEn: "Golden Hoop Earrings",
        price: 119,
        image: "images/golden-hoops.jpg",
        description: "עגילי חישוק קלאסיים בגוון זהב",
        descriptionEn: "Classic gold hoop earrings",
        category: "Earrings",
        quantity: 10
    },
    {
        id: 4,
        name: "שרשרת פנינים",
        nameEn: "Pearl Necklace",
        price: 179,
        image: "images/pearl-necklace.jpg",
        description: "שרשרת פנינים לבנות בעיצוב קלאסי",
        descriptionEn: "Classic white pearl necklace",
        category: "Necklaces",
        quantity: 6
    },
    {
        id: 5,
        name: "טבעת אבן נוצצת",
        nameEn: "Diamond Style Ring",
        price: 199,
        image: "images/diamond-ring.jpg",
        description: "טבעת אלגנטית עם אבן נוצצת בסגנון יהלום",
        descriptionEn: "Elegant sparkling stone ring",
        category: "Rings",
        quantity: 7
    },
    {
        id: 6,
        name: "צמיד שרשרת זהב",
        nameEn: "Gold Chain Bracelet",
        price: 129,
        image: "images/gold-chain-bracelet.jpg",
        description: "צמיד שרשרת עדין בגוון זהב",
        descriptionEn: "Delicate gold chain bracelet",
        category: "Bracelets",
        quantity: 10
    },
    {
        id: 7,
        name: "עגילי פנינה תלויים",
        nameEn: "Pearl Drop Earrings",
        price: 139,
        image: "images/pearl-earrings.jpg",
        description: "עגילי פנינה תלויים ואלגנטיים",
        descriptionEn: "Elegant pearl drop earrings",
        category: "Earrings",
        quantity: 9
    },
    {
        id: 8,
        name: "שרשרת כוכב כסף",
        nameEn: "Silver Star Necklace",
        price: 119,
        image: "images/silver-star-necklace.jpg",
        description: "שרשרת כסף מינימליסטית עם תליון כוכב",
        descriptionEn: "Minimalist silver star necklace",
        category: "Necklaces",
        quantity: 12
    },
    {
        id: 9,
        name: "טבעת רוז גולד",
        nameEn: "Rose Gold Ring",
        price: 109,
        image: "images/rose-gold-ring.jpg",
        description: "טבעת עדינה בגוון רוז גולד",
        descriptionEn: "Delicate rose gold ring",
        category: "Rings",
        quantity: 8
    },
    {
        id: 10,
        name: "צמיד צ'ארמס כסף",
        nameEn: "Silver Charm Bracelet",
        price: 159,
        image: "images/silver-charm-bracelet.jpg",
        description: "צמיד כסף עם תליוני צ'ארם",
        descriptionEn: "Silver bracelet with elegant charms",
        category: "Bracelets",
        quantity: 5
    },
    {
        id: 11,
        name: "עגילי קריסטל צמודים",
        nameEn: "Crystal Stud Earrings",
        price: 89,
        image: "images/crystal-earrings.jpg",
        description: "עגילים קטנים עם קריסטל נוצץ",
        descriptionEn: "Small sparkling crystal earrings",
        category: "Earrings",
        quantity: 15
    },
    {
        id: 12,
        name: "צמיד זהב קשיח",
        nameEn: "Gold Bangle Bracelet",
        price: 149,
        image: "images/bangle-bracelet.jpg",
        description: "צמיד קשיח בעיצוב מינימליסטי",
        descriptionEn: "Classic minimalist gold bangle",
        category: "Bracelets",
        quantity: 11
    }

];

// השם והתיאור בשפה שנבחרה (i18n.js)
function getProductName(product) {
    return LANG === "en" ? product.nameEn : product.name;
}

function getProductDescription(product) {
    return LANG === "en" ? product.descriptionEn : product.description;
}

function getProductById(id) {
    return products.find(product => product.id === id);
}


function getProductsByCategory(category) {
    return products.filter(product => product.category === category);
}

function checkStock(id, requestedQuantity) {
    const product = getProductById(id);

    if (!product) {
        return false;
    }

    return requestedQuantity > 0 &&
           Number.isInteger(requestedQuantity) &&
           product.quantity >= requestedQuantity;
}

function reduceStock(id, purchasedQuantity) {

    if (!checkStock(id, purchasedQuantity)) {
        return false;
    }

    const product = getProductById(id);

    product.quantity -= purchasedQuantity;
    saveStock();

    return true;
}


// ---------- שמירת המלאי ----------
// בלי זה המלאי חוזר לכמות המקורית בכל רענון של הדף
const STOCK_KEY = "stock";

function saveStock() {
    const stock = {};
    products.forEach(product => {
        stock[product.id] = product.quantity;
    });
    localStorage.setItem(STOCK_KEY, JSON.stringify(stock));
}

function loadStock() {
    const savedStock = JSON.parse(localStorage.getItem(STOCK_KEY));
    if (!savedStock) {
        return;
    }
    products.forEach(product => {
        if (savedStock[product.id] !== undefined) {
            product.quantity = savedStock[product.id];
        }
    });
}

loadStock();
