// ==========================================
// CHECKOUT PAGE
// ==========================================


// ==========================================
// שם המשתמש
// ==========================================

// מקבלים את שם המשתמש שנשמר בעמוד הכניסה
const userName = localStorage.getItem("userName");

const welcomeUser =
    document.getElementById("welcomeUser");

const fullNameInput =
    document.getElementById("fullName");


// אם קיים שם משתמש - מציגים אותו
if (userName) {

    welcomeUser.textContent =
        "שלום, " + userName;

    // מכניסים את השם אוטומטית לטופס
    fullNameInput.value = userName;
}


// ==========================================
// סל הקניות
// ==========================================

// מנסים לקבל את הסל מה-localStorage
let cart =
    JSON.parse(localStorage.getItem("cart"));


// כרגע שאר הקבוצה עדיין עובדת על הסל.
// לכן אם אין סל, נשתמש במוצרים לדוגמה.
if (!cart || cart.length === 0) {

    cart = [

        {
            id: 1,
            name: "שרשרת זהב",
            price: 250,
            quantity: 1
        },

        {
            id: 2,
            name: "עגילי פנינה",
            price: 180,
            quantity: 2
        },

        {
            id: 3,
            name: "צמיד כסף",
            price: 120,
            quantity: 1
        }

    ];
}


// ==========================================
// אלמנטים מה-HTML
// ==========================================

const orderSummary =
    document.getElementById("orderSummary");

const totalPriceElement =
    document.getElementById("totalPrice");


// ==========================================
// הצגת סיכום ההזמנה
// ==========================================

function displayOrder() {

    // מנקים תוכן קודם
    orderSummary.innerHTML = "";

    let total = 0;


    // עוברים על כל המוצרים בעגלה
    cart.forEach(function (product) {

        // מחיר לפי הכמות
        const productTotal =
            product.price * product.quantity;


        // מוסיפים למחיר הכולל
        total += productTotal;


        // יוצרים div חדש עבור המוצר
        const productRow =
            document.createElement("div");


        productRow.className =
            "order-item d-flex justify-content-between align-items-center";


        productRow.innerHTML = `

            <div>

                <strong>
                    ${product.name}
                </strong>

                <div class="text-secondary small">
                    כמות: ${product.quantity}
                </div>

            </div>


            <span>
                ${productTotal} ₪
            </span>

        `;


        // מוסיפים את המוצר למסך
        orderSummary.appendChild(productRow);
    });


    // מציגים את המחיר הכולל
    totalPriceElement.textContent =
        total + " ₪";
}


// מפעילים את הפונקציה כשהעמוד נטען
displayOrder();


// ==========================================
// טופס התשלום
// ==========================================

const checkoutForm =
    document.getElementById("checkoutForm");


checkoutForm.addEventListener(
    "submit",
    function (event) {

        // מונע מהעמוד להתרענן
        event.preventDefault();


        // קבלת הערכים מהטופס

        const fullName =
            fullNameInput.value.trim();

        const phone =
            document
                .getElementById("phone")
                .value
                .trim();

        const address =
            document
                .getElementById("address")
                .value
                .trim();

        const cardNumber =
            document
                .getElementById("cardNumber")
                .value
                .replace(/\s/g, "");

        const expiry =
            document
                .getElementById("expiry")
                .value
                .trim();

        const cvv =
            document
                .getElementById("cvv")
                .value
                .trim();


        // ==================================
        // בדיקות תקינות
        // ==================================


        // בדיקת שם

        if (fullName.length < 2) {

            alert("נא להזין שם מלא");

            return;
        }


        // בדיקת מספר טלפון ישראלי

        const cleanPhone =
            phone.replace(/-/g, "");


        if (!/^05\d{8}$/.test(cleanPhone)) {

            alert("נא להזין מספר טלפון תקין");

            return;
        }


        // בדיקת כתובת

        if (address.length < 5) {

            alert("נא להזין כתובת מלאה");

            return;
        }


        // בדיקת כרטיס אשראי

        if (!/^\d{16}$/.test(cardNumber)) {

            alert(
                "מספר כרטיס האשראי חייב להכיל 16 ספרות"
            );

            return;
        }


        // בדיקת תוקף

        if (!/^\d{2}\/\d{2}$/.test(expiry)) {

            alert(
                "יש להזין תוקף בפורמט MM/YY"
            );

            return;
        }


        // בדיקת CVV

        if (!/^\d{3}$/.test(cvv)) {

            alert(
                "CVV חייב להכיל 3 ספרות"
            );

            return;
        }


        // ==================================
        // ההזמנה הצליחה
        // ==================================

        const successMessage =
            document.getElementById(
                "successMessage"
            );


        successMessage.textContent =
            "ההזמנה בוצעה בהצלחה! תודה שקנית אצלנו 💎";


        // Bootstrap מסתיר אותו עם d-none
        // ולכן מסירים את המחלקה

        successMessage.classList.remove(
            "d-none"
        );


        // מרוקנים את העגלה
        localStorage.removeItem("cart");


        // מנקים את הטופס
        checkoutForm.reset();


        // מחזירים את שם המשתמש לשדה
        if (userName) {

            fullNameInput.value =
                userName;
        }


        // גלילה לראש העמוד כדי לראות
        // את הודעת ההצלחה

        window.scrollTo({

            top: 0,
            behavior: "smooth"

        });

    }
);