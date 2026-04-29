// =====================================================
// STATE & CONSTANTS
// =====================================================
let pizzas = [];
let cart = JSON.parse(localStorage.getItem('pizzaCart')) || [];
let currentUser = JSON.parse(localStorage.getItem('sliceCurrentUser')) || null;
let currentDetailPizza = null;
let selectedStarRating = 0;
let activeFilter = 'All';

const DELIVERY_FEE = 40;
const formatCurrency = (amount) => `₹${Number(amount).toLocaleString('en-IN')}`;

// =====================================================
// DOM REFERENCES
// =====================================================
const menuGrid       = document.getElementById('menuGrid');
const cartIcon       = document.getElementById('cartIcon');
const cartOverlay    = document.getElementById('cartOverlay');
const closeCartBtn   = document.getElementById('closeCart');
const cartItemsCont  = document.getElementById('cartItems');
const cartCountEl    = document.getElementById('cartCount');
const cartSubtotalEl = document.getElementById('cartSubtotal');
const cartTotalEl    = document.getElementById('cartTotal');
const cartETA        = document.getElementById('cartETA');
const checkoutBtn    = document.getElementById('checkoutBtn');
const toast          = document.getElementById('toast');
const filterBar      = document.getElementById('filterBar');

// Auth
const authModal      = document.getElementById('authModal');
const loginNavBtn    = document.getElementById('loginNavBtn');
const signupNavBtn   = document.getElementById('signupNavBtn');
const closeAuthModal = document.getElementById('closeAuthModal');
const tabLogin       = document.getElementById('tabLogin');
const tabSignup      = document.getElementById('tabSignup');
const formLogin      = document.getElementById('formLogin');
const formSignup     = document.getElementById('formSignup');
const loginSubmit    = document.getElementById('loginSubmit');
const signupSubmit   = document.getElementById('signupSubmit');
const loginError     = document.getElementById('loginError');
const signupError    = document.getElementById('signupError');
const authSection    = document.getElementById('authSection');
const userSection    = document.getElementById('userSection');
const userAvatar     = document.getElementById('userAvatar');
const switchToSignup = document.getElementById('switchToSignup');
const switchToLogin  = document.getElementById('switchToLogin');

// Payment
const paymentModal        = document.getElementById('paymentModal');
const closePaymentModal   = document.getElementById('closePaymentModal');
const paymentSubmit       = document.getElementById('paymentSubmit');
const paymentError        = document.getElementById('paymentError');
const paymentOrderSummary = document.getElementById('paymentOrderSummary');
const deliveryAddress     = document.getElementById('deliveryAddress');
const cardDetails         = document.getElementById('cardDetails');
const upiDetails          = document.getElementById('upiDetails');
const cashDetails         = document.getElementById('cashDetails');
const cardNumber          = document.getElementById('cardNumber');
const cardExpiry          = document.getElementById('cardExpiry');
const cardCvv             = document.getElementById('cardCvv');
const cardName            = document.getElementById('cardName');
const upiId               = document.getElementById('upiId');

// Success & Detail
const successModal  = document.getElementById('successModal');
const successMsg    = document.getElementById('successMsg');
const successOkBtn  = document.getElementById('successOkBtn');
const detailModal   = document.getElementById('detailModal');
const closeDetailModal = document.getElementById('closeDetailModal');

// =====================================================
// DATA FETCH
// =====================================================
async function fetchPizzas() {
    try {
        const res = await fetch('db.json');
        if (!res.ok) throw new Error('Network error');
        pizzas = await res.json();
    } catch (err) {
        menuGrid.innerHTML = `<div style="text-align:center;color:var(--primary);grid-column:1/-1;padding:3rem;"><h3>Could not load the menu.</h3></div>`;
    }
}
