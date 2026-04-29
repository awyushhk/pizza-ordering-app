// =====================================================
// PAYMENT
// =====================================================
function openPaymentModal() {
    const subtotal = getSubtotal();
    paymentOrderSummary.textContent = `${formatCurrency(subtotal)} + ₹40 delivery = ${formatCurrency(subtotal + DELIVERY_FEE)}`;
    paymentError.classList.add('hidden');
    closeCart();
    openModal(paymentModal);
}

function getSelectedPayMethod() {
    return document.querySelector('input[name="payMethod"]:checked')?.value || 'card';
}

function validateAndPay() {
    const method = getSelectedPayMethod();
    const address = deliveryAddress.value.trim();
    paymentError.classList.add('hidden');
    if (!address) { showPayError('Please enter your delivery address.'); return; }
    if (method === 'card') {
        const num = cardNumber.value.replace(/\s/g, '');
        if (!num || num.length < 16) { showPayError('Enter a valid 16-digit card number.'); return; }
        if (!cardExpiry.value || cardExpiry.value.length < 5) { showPayError('Enter a valid expiry date.'); return; }
        if (!cardCvv.value || cardCvv.value.length < 3) { showPayError('Enter a valid CVV.'); return; }
        if (!cardName.value.trim()) { showPayError('Enter the name on your card.'); return; }
    }
    if (method === 'upi') {
        if (!upiId.value.trim() || !upiId.value.includes('@')) { showPayError('Enter a valid UPI ID.'); return; }
    }
    paymentSubmit.textContent = 'Processing...';
    paymentSubmit.disabled = true;
    setTimeout(() => {
        closeModal(paymentModal);
        successMsg.textContent = `Your order for ${formatCurrency(getSubtotal() + DELIVERY_FEE)} will be delivered to "${address}". Est. time: ~${getMaxDeliveryTime()} minutes.`;
        openModal(successModal);
        cart = [];
        saveCart();
        updateCartUI();
        paymentSubmit.textContent = 'Place Order';
        paymentSubmit.disabled = false;
        deliveryAddress.value = '';
        cardNumber.value = '';
        cardExpiry.value = '';
        cardCvv.value = '';
        cardName.value = '';
        upiId.value = '';
    }, 1800);
}

function showPayError(msg) { paymentError.textContent = msg; paymentError.classList.remove('hidden'); }
