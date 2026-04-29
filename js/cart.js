// =====================================================
// CART
// =====================================================
window.addToCart = function(id) {
    const pizza = pizzas.find(p => p.id === id);
    const existing = cart.find(i => i.id === id);
    existing ? existing.quantity++ : cart.push({ ...pizza, quantity: 1 });
    saveCart();
    updateCartUI();
    showToast(`🍕 ${pizza.name} added!`);
};

window.removeFromCart = function(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    updateCartUI();
};

window.updateQuantity = function(id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) removeFromCart(id);
    else { saveCart(); updateCartUI(); }
};

function saveCart() { localStorage.setItem('pizzaCart', JSON.stringify(cart)); }
function getSubtotal() { return cart.reduce((s, i) => s + i.price * i.quantity, 0); }

function getMaxDeliveryTime() {
    if (!cart.length) return null;
    return Math.max(...cart.map(i => i.deliveryTime));
}

function updateCartUI() {
    const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
    cartCountEl.textContent = totalItems;
    cartItemsCont.innerHTML = '';

    if (cart.length === 0) {
        cartItemsCont.innerHTML = `<div class="empty-cart"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg><p>Your cart is empty.</p></div>`;
        cartSubtotalEl.textContent = '₹0';
        cartTotalEl.textContent = '₹0';
        if (cartETA) cartETA.textContent = '— min';
        return;
    }

    const subtotal = getSubtotal();
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        const el = document.createElement('div');
        el.className = 'cart-item';
        el.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">${formatCurrency(item.price)} each</div>
                <div class="cart-controls">
                    <button class="qty-btn" onclick="updateQuantity(${item.id},-1)">−</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id},1)">+</button>
                    <span class="item-total">${formatCurrency(itemTotal)}</span>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
            </div>`;
        cartItemsCont.appendChild(el);
    });

    cartSubtotalEl.textContent = formatCurrency(subtotal);
    cartTotalEl.textContent = formatCurrency(subtotal + DELIVERY_FEE);
    if (cartETA) cartETA.textContent = `~${getMaxDeliveryTime()} min`;
}
