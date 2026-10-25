// i18n.js - בחירת שפה (עברית / English) וכל הטקסטים של האתר בשתי השפות
// נטען בתוך <head>, מיד אחרי קובץ ה-CSS של Bootstrap, כדי שהכיוון והשפה ייקבעו לפני שהעמוד מוצג

const LANG_KEY = "lang";
const LANG = localStorage.getItem(LANG_KEY) === "en" ? "en" : "he";

const TEXTS = {
    he: {
        // כללי
        announcement: "משלוח חינם בהזמנה מעל ₪200 · החזרה עד 14 יום",
        nav_all: "כל התכשיטים",
        cart: "סל",
        hello: "שלום,",
        my_cart: "הסל שלי",
        logout: "יציאה מהחשבון",
        theme_toggle: "מעבר בין מצב כהה למצב בהיר",
        lang_switch: "English",
        lang_switch_short: "EN",
        footer_tagline: "תכשיטים עדינים לכל יום ולרגעים המיוחדים.",
        footer_service: "שירות לקוחות",
        footer_free_ship: "משלוח חינם מעל ₪200 (מתחת: ₪25)",
        footer_returns: "החזרה עד 14 יום",
        footer_warranty: "אחריות לשנה",
        footer_hours: "ימים א'–ה', 9:00 עד 18:00",
        footer_store: "החנות",
        footer_course: "פרויקט קורס",
        footer_team: "נבנה על ידי: טלי גלזמן, עדי שטיין, נועה משולם, אלינור אגד, שולמית דרויש וברכי אנגל",
        welcome_title: "שלום, {name}",
        welcome_msg: "שמחים לראות אותך. אפשר להתחיל לקנות.",
        logout_title: "לצאת מהחשבון?",
        logout_msg: "הסל שלך יישמר לפעם הבאה.",
        logout_ok: "יציאה",
        confirm_title: "האם להמשיך?",
        ok: "אישור",
        cancel: "ביטול",
        close: "סגירה",
        processing: "מעבד...",
        free: "חינם",
        shipping: "משלוח",
        subtotal: "סכום ביניים",
        gift_wrap: "אריזת מתנה",
        gift_message_placeholder: "ברכה לכרטיס (לא חובה)",
        free_shipping_left: "עוד {price} ותקבלו משלוח חינם",
        free_shipping_reached: "ההזמנה הזו זכאית למשלוח חינם",
        total: "סה\"כ",
        summary_title: "סיכום הזמנה",
        all_jewelry: "לכל התכשיטים",
        sku: "מק\"ט",
        price: "{n} ₪",

        // עמוד הכניסה
        title_login: "כניסה | Eldora",
        choose_lang: "שפה",
        login_title: "ברוכים הבאים",
        login_sub: "כדי להתחיל לקנות, הכניסו את שמכם המלא.",
        full_name: "שם מלא",
        name_placeholder: "לדוגמה: ישראל ישראלי",
        enter_shop: "כניסה לחנות",
        clear: "ניקוי",
        welcome_back_sub: "טוב לראות אותך שוב.",
        continue_shop: "המשך לחנות",
        not_me: "לא אני – החלפת משתמש",
        login_notice: "יש להיכנס עם שם מלא לפני השימוש באתר",
        err_name_empty: "יש להכניס שם מלא",
        err_name_two: "יש להכניס שם פרטי ושם משפחה",
        err_name_letters: "השם יכול להכיל אותיות בלבד (לפחות 2 אותיות בכל מילה)",
        login_img_alt: "שרשרת פנינים",

        // עמוד החנות
        title_shop: "החנות | Eldora",
        intro_hello: "שלום",
        intro_title: "הזהב שלך.<br>הסיפור שלך.",
        intro_text: "תכשיטים בזהב, כסף ופנינים שנבחרו אחד-אחד – לרגעים הקטנים של כל יום, ולאלה שזוכרים לתמיד.",
        intro_img_alt: "צמיד זהב קשיח",
        filter_aria: "סינון לפי קטגוריה",
        cat_all: "הכל",
        cat_Rings: "טבעות",
        cat_Necklaces: "שרשראות",
        cat_Bracelets: "צמידים",
        cat_Earrings: "עגילים",
        search_placeholder: "חיפוש",
        search_aria: "חיפוש מוצר",
        search_clear: "ניקוי החיפוש",
        sort_aria: "מיון המוצרים",
        sort_default: "מומלצים",
        sort_price_asc: "מחיר: מהנמוך לגבוה",
        sort_price_desc: "מחיר: מהגבוה לנמוך",
        sort_name: "שם: א-ת",
        results_all: "מציגים את כל {n} התכשיטים",
        results_some: "נמצאו {n} תכשיטים",
        no_results_title: "לא מצאנו תכשיטים שמתאימים לחיפוש",
        no_results_text: "נסו מילה אחרת או בחרו קטגוריה אחרת",
        show_all: "הצגת כל התכשיטים",
        stock_out: "אזל מהמלאי",
        stock_low: "נשארו {n} אחרונים",
        stock_ok: "{n} במלאי",
        add_to_cart: "הוספה לסל",
        sold_out: "אזל",
        toast_added: "נוסף לסל: {name}",
        toast_not_found: "המוצר לא נמצא",
        toast_stock_full: "יש במלאי רק {n} יחידות, וכולן כבר בסל.",
        open_details: "פרטים על {name}",
        badge_new: "חדש",
        badge_bestseller: "רב מכר",
        badge_sale: "מבצע",
        all_in_cart: "כל היחידות שבמלאי כבר נמצאות בסל שלך.",

        // עמוד הסל
        title_cart: "עגלת קניות | Eldora",
        cart_title: "סל הקניות",
        cart_sub: ", אלה התכשיטים שבסל שלך",
        items_count: "מספר פריטים",
        to_checkout: "מעבר לתשלום",
        continue_shopping: "המשך קניות",
        clear_cart: "ריקון העגלה",
        per_unit: "{price} ליחידה",
        empty_cart_title: "הסל ריק",
        empty_cart_text: "עוד לא נבחרו תכשיטים.",
        qty_aria: "כמות",
        qty_plus: "הוספת יחידה",
        qty_minus: "הורדת יחידה",
        remove_item: "מחיקה מהסל",
        toast_removed: "הוסר מהסל: {name}",
        toast_no_more: "אין במלאי יחידות נוספות של המוצר הזה",
        clear_title: "לרוקן את העגלה?",
        clear_msg: "כל המוצרים יוסרו מהעגלה.",
        clear_ok: "ריקון",
        toast_cleared: "העגלה רוקנה",

        // עמוד התשלום
        title_checkout: "סיום הזמנה | Eldora",
        checkout_title: "סיום הזמנה",
        checkout_sub: "עוד רגע והתכשיטים יוצאים לדרך",
        empty_checkout_title: "אין מוצרים לתשלום",
        empty_checkout_text: "הסל ריק.",
        step_shipping: "פרטי משלוח",
        step_payment: "פרטי תשלום",
        checkout_name_placeholder: "שם פרטי ושם משפחה",
        phone: "מספר טלפון",
        address: "כתובת למשלוח",
        address_placeholder: "רחוב, מספר בית ועיר",
        card_number: "מספר כרטיס אשראי",
        expiry: "תוקף",
        pay: "ביצוע הזמנה",
        mock_note: "תשלום מדומה לצורך הפרויקט – לא מתבצע חיוב אמיתי",
        edit_cart: "עריכת הסל",
        quantity: "כמות: {n}",
        err_name: "נא להזין שם מלא",
        err_phone: "נא להזין מספר טלפון תקין (10 ספרות, מתחיל ב-05)",
        err_address: "נא להזין כתובת מלאה",
        err_card: "מספר כרטיס האשראי חייב להכיל 16 ספרות",
        err_expiry_format: "יש להזין תוקף בפורמט MM/YY",
        err_expiry_month: "חודש התוקף לא תקין",
        err_expiry_past: "תוקף הכרטיס עבר",
        err_cvv: "CVV חייב להכיל 3 ספרות",
        toast_fix_fields: "יש לתקן את השדות המסומנים באדום",
        toast_stock_short: "נשארו במלאי רק {n} יחידות של {name}",
        paying: "מעבד את התשלום...",
        order_title: "תודה, ההזמנה התקבלה",
        order_text: "{name}, שלחנו את פרטי ההזמנה. התכשיטים יגיעו תוך 3-5 ימי עסקים.",
        order_number: "מספר הזמנה",
        amount_paid: "סכום ששולם",
        back_to_shop: "חזרה לחנות",
        to_my_orders: "להזמנות שלי",

        // עמוד ההזמנות שלי
        title_orders: "ההזמנות שלי | Eldora",
        my_orders: "ההזמנות שלי",
        orders_sub: "כל ההזמנות שבוצעו בחשבון הזה",
        orders_empty_title: "עדיין אין הזמנות",
        orders_empty_text: "הזמנות שתבצעו באתר יופיעו כאן.",
        order_label: "הזמנה מס' {n}",
        items_label: "{n} פריטים",
        items_label_one: "פריט אחד",
        orders_total_spent: "סה\"כ קניות: {price}",
        orders_count: "{n} הזמנות",
        orders_count_one: "הזמנה אחת"
    },

    en: {
        // General
        announcement: "Free shipping on orders over ₪200 · 14-day returns",
        nav_all: "All jewelry",
        cart: "Bag",
        hello: "Hi,",
        my_cart: "My bag",
        logout: "Log out",
        theme_toggle: "Switch between dark and light mode",
        lang_switch: "עברית",
        lang_switch_short: "עב",
        footer_tagline: "Delicate jewelry for every day and special moments.",
        footer_service: "Customer care",
        footer_free_ship: "Free shipping over ₪200 (otherwise ₪25)",
        footer_returns: "14-day returns",
        footer_warranty: "1-year warranty",
        footer_hours: "Sun–Thu 9:00–18:00",
        footer_store: "Shop",
        footer_course: "Course project",
        footer_team: "Built by: Taly Glazman, Adi Stein, Noa Meshulam, Elinor Eged, Shulamit Darwish and Brachi Engel",
        welcome_title: "Hi, {name}",
        welcome_msg: "Glad you're here. Happy shopping.",
        logout_title: "Log out?",
        logout_msg: "Your bag will be saved for next time.",
        logout_ok: "Log out",
        confirm_title: "Continue?",
        ok: "OK",
        cancel: "Cancel",
        close: "Close",
        processing: "Processing...",
        free: "Free",
        shipping: "Shipping",
        subtotal: "Subtotal",
        gift_wrap: "Gift wrapping",
        gift_message_placeholder: "Card message (optional)",
        free_shipping_left: "Add {price} more for free shipping",
        free_shipping_reached: "This order ships for free",
        total: "Total",
        summary_title: "Order summary",
        all_jewelry: "Shop all jewelry",
        sku: "SKU",
        price: "₪{n}",

        // Login page
        title_login: "Sign in | Eldora",
        choose_lang: "Language",
        login_title: "Welcome",
        login_sub: "To start shopping, please enter your full name.",
        full_name: "Full name",
        name_placeholder: "e.g. Jane Smith",
        enter_shop: "Enter the shop",
        clear: "Clear",
        welcome_back_sub: "Good to see you again.",
        continue_shop: "Continue to shop",
        not_me: "Not me – switch user",
        login_notice: "Please enter your full name before using the site",
        err_name_empty: "Please enter your full name",
        err_name_two: "Please enter a first and last name",
        err_name_letters: "Letters only (at least 2 letters in each word)",
        login_img_alt: "Pearl necklace",

        // Shop page
        title_shop: "Shop | Eldora",
        intro_hello: "Hi",
        intro_title: "Your gold.<br>Your story.",
        intro_text: "Gold, silver and pearl pieces, chosen one by one – for the small moments of every day, and the ones you remember forever.",
        intro_img_alt: "Gold bangle bracelet",
        filter_aria: "Filter by category",
        cat_all: "All",
        cat_Rings: "Rings",
        cat_Necklaces: "Necklaces",
        cat_Bracelets: "Bracelets",
        cat_Earrings: "Earrings",
        search_placeholder: "Search",
        search_aria: "Search products",
        search_clear: "Clear search",
        sort_aria: "Sort products",
        sort_default: "Featured",
        sort_price_asc: "Price: low to high",
        sort_price_desc: "Price: high to low",
        sort_name: "Name: A-Z",
        results_all: "Showing all {n} pieces",
        results_some: "{n} pieces found",
        no_results_title: "No jewelry matches your search",
        no_results_text: "Try another word or pick a different category",
        show_all: "Show all jewelry",
        stock_out: "Sold out",
        stock_low: "Only {n} left",
        stock_ok: "{n} in stock",
        add_to_cart: "Add to bag",
        sold_out: "Sold out",
        toast_added: "{name} added to your bag",
        toast_not_found: "Product not found",
        toast_stock_full: "Only {n} in stock, and they're all in your bag.",
        open_details: "Details for {name}",
        badge_new: "New",
        badge_bestseller: "Bestseller",
        badge_sale: "Sale",
        all_in_cart: "All units in stock are already in your bag.",

        // Cart page
        title_cart: "Bag | Eldora",
        cart_title: "Your bag",
        cart_sub: ", here's what you picked",
        items_count: "Items",
        to_checkout: "Checkout",
        continue_shopping: "Continue shopping",
        clear_cart: "Empty bag",
        per_unit: "{price} each",
        empty_cart_title: "Your bag is empty",
        empty_cart_text: "You haven't picked any jewelry yet.",
        qty_aria: "Quantity",
        qty_plus: "Add one",
        qty_minus: "Remove one",
        remove_item: "Remove from bag",
        toast_removed: "{name} removed from your bag",
        toast_no_more: "No more units of this item in stock",
        clear_title: "Empty your bag?",
        clear_msg: "All items will be removed.",
        clear_ok: "Empty",
        toast_cleared: "Your bag is empty",

        // Checkout page
        title_checkout: "Checkout | Eldora",
        checkout_title: "Checkout",
        checkout_sub: "Almost there – your jewelry is on its way",
        empty_checkout_title: "Nothing to pay for",
        empty_checkout_text: "Your bag is empty.",
        step_shipping: "Shipping details",
        step_payment: "Payment",
        checkout_name_placeholder: "Your full name",
        phone: "Phone number",
        address: "Shipping address",
        address_placeholder: "Street, number and city",
        card_number: "Card number",
        expiry: "Expiry",
        pay: "Place order",
        mock_note: "Mock payment for the course project – no real charge is made",
        edit_cart: "Edit bag",
        quantity: "Qty: {n}",
        err_name: "Please enter your full name",
        err_phone: "Please enter a valid phone number (10 digits, starting with 05)",
        err_address: "Please enter a full address",
        err_card: "Card number must have 16 digits",
        err_expiry_format: "Use the format MM/YY",
        err_expiry_month: "Invalid expiry month",
        err_expiry_past: "This card has expired",
        err_cvv: "CVV must have 3 digits",
        toast_fix_fields: "Please fix the fields marked in red",
        toast_stock_short: "Only {n} units of {name} left in stock",
        paying: "Processing payment...",
        order_title: "Thank you, your order is in",
        order_text: "{name}, we've sent your order details. Your jewelry will arrive in 3-5 business days.",
        order_number: "Order number",
        amount_paid: "Amount paid",
        back_to_shop: "Back to shop",
        to_my_orders: "View my orders",

        // My orders page
        title_orders: "My orders | Eldora",
        my_orders: "My orders",
        orders_sub: "All the orders you've placed",
        orders_empty_title: "No orders yet",
        orders_empty_text: "Once you place an order, it will show up here.",
        order_label: "Order #{n}",
        items_label: "{n} items",
        items_label_one: "1 item",
        orders_total_spent: "Total spent: {price}",
        orders_count: "{n} orders",
        orders_count_one: "1 order"
    }
};


// מחזירה את הטקסט בשפה הנוכחית. {name}, {n} וכו' מוחלפים בערכים
// דוגמה: t("stock_low", { n: 3 }) => "נשארו 3 אחרונים"
function t(key, values) {
    let text = TEXTS[LANG][key];

    // אם שכחנו לתרגם מילה - מציגים את שם המפתח, כדי שיהיה קל לראות מה חסר
    if (text === undefined) {
        text = key;
    }

    if (values) {
        for (let name in values) {
            text = text.replace("{" + name + "}", values[name]);
        }
    }

    return text;
}

// מחיר בפורמט של השפה: "99 ₪" בעברית, "₪99" באנגלית
function formatPrice(amount) {
    return t("price", { n: amount });
}

function getCategoryName(category) {
    return t("cat_" + category);
}

function setLanguage(lang) {
    localStorage.setItem(LANG_KEY, lang);
    location.reload();
}

function toggleLanguage() {
    setLanguage(LANG === "he" ? "en" : "he");
}


// מחליף את הטקסטים הקבועים ב-HTML לפי מאפייני data-i18n
//   data-i18n="key"             – הטקסט של האלמנט
//   data-i18n-html="key"        – טקסט עם תגיות (למשל <br>)
//   data-i18n-placeholder="key" – placeholder של שדה
//   data-i18n-aria="key"        – aria-label
//   data-i18n-alt="key"         – alt של תמונה
function applyTranslations(root = document) {
    root.querySelectorAll("[data-i18n]").forEach(el => {
        el.textContent = t(el.dataset.i18n);
    });
    root.querySelectorAll("[data-i18n-html]").forEach(el => {
        el.innerHTML = t(el.dataset.i18nHtml);
    });
    root.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
        el.placeholder = t(el.dataset.i18nPlaceholder);
    });
    root.querySelectorAll("[data-i18n-aria]").forEach(el => {
        el.setAttribute("aria-label", t(el.dataset.i18nAria));
    });
    root.querySelectorAll("[data-i18n-alt]").forEach(el => {
        el.alt = t(el.dataset.i18nAlt);
    });
}


// ---------- קובעים שפה וכיוון מיד ----------

document.documentElement.lang = LANG;
document.documentElement.dir = LANG === "he" ? "rtl" : "ltr";

// באנגלית טוענים את Bootstrap הרגיל (משמאל לימין) במקום גרסת ה-RTL
if (LANG === "en") {
    const bootstrapCss = document.getElementById("bootstrap-css");
    if (bootstrapCss) {
        bootstrapCss.href = bootstrapCss.href.replace("bootstrap.rtl.min.css", "bootstrap.min.css");
    }
}

document.addEventListener("DOMContentLoaded", () => applyTranslations());
