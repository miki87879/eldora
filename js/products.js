
const products = [
    {
        id: 1,
        name: "Gold Heart Necklace",
        price: 149,
        image: "images/heart-necklace.jpg",
        description: "Elegant gold heart necklace",
        category: "Necklaces",
        quantity: 8
    },
    {
        id: 2,
        name: "Silver Ring",
        price: 99,
        image: "images/silver-ring.jpg",
        description: "Elegant silver ring",
        category: "Rings",
        quantity: 12
    },
    {
        id: 3,
        name: "Golden Hoop Earrings",
        price: 119,
        image: "images/golden-hoops.jpg",
        description: "Classic gold hoop earrings",
        category: "Earrings",
        quantity: 10
    },
    {
        id: 4,
        name: "Pearl Necklace",
        price: 179,
        image: "images/pearl-necklace.jpg",
        description: "Classic white pearl necklace",
        category: "Necklaces",
        quantity: 6
    },
    {
        id: 5,
        name: "Diamond Style Ring",
        price: 199,
        image: "images/diamond-ring.jpg",
        description: "Elegant sparkling stone ring",
        category: "Rings",
        quantity: 7
    },
    {
        id: 6,
        name: "Gold Chain Bracelet",
        price: 129,
        image: "images/gold-chain-bracelet.jpg",
        description: "Delicate gold chain bracelet",
        category: "Bracelets",
        quantity: 10
    },
    {
        id: 7,
        name: "Pearl Drop Earrings",
        price: 139,
        image: "images/pearl-earrings.jpg",
        description: "Elegant pearl drop earrings",
        category: "Earrings",
        quantity: 9
    },
    {
        id: 8,
        name: "Silver Star Necklace",
        price: 119,
        image: "images/silver-star-necklace.jpg",
        description: "Minimalist silver star necklace",
        category: "Necklaces",
        quantity: 12
    },
    {
        id: 9,
        name: "Rose Gold Ring",
        price: 109,
        image: "images/rose-gold-ring.jpg",
        description: "Delicate rose gold ring",
        category: "Rings",
        quantity: 8
    },
    {
        id: 10,
        name: "Silver Charm Bracelet",
        price: 159,
        image: "images/silver-charm-bracelet.jpg",
        description: "Silver bracelet with elegant charms",
        category: "Bracelets",
        quantity: 5
    },
    {
        id: 11,
        name: "Crystal Stud Earrings",
        price: 89,
        image: "images/crystal-earrings.jpg",
        description: "Small sparkling crystal earrings",
        category: "Earrings",
        quantity: 15
    },
    {
        id: 12,
        name: "Gold Bangle Bracelet",
        price: 149,
        image: "images/bangle-bracelet.jpg",
        description: "Classic minimalist gold bangle",
        category: "Bracelets",
        quantity: 11
    }

];

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

    return true;
}




