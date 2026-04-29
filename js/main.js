// =====================================================
// INIT
// =====================================================
async function initApp() {
    await fetchPizzas();
    renderMenu();
    renderReviewsTicker();
    updateCartUI();
    renderAuthState();
    setupEventListeners();
}

// =====================================================
// EVENT LISTENERS
// =====================================================
function setupEventListeners() {
    // Cart
    cartIcon.addEventListener('click', () => { cartOverlay.classList.add('active'); document.body.style.overflow = 'hidden'; });
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', e => { if (e.target === cartOverlay) closeCart(); });

    // Checkout
    checkoutBtn.addEventListener('click', () => {
        if (!cart.length) { showToast('Your cart is empty!'); return; }
        if (!currentUser) { showToast('Please login to checkout.'); closeCart(); showAuthModal('login'); return; }
        openPaymentModal();
    });

    // Auth nav
    loginNavBtn.addEventListener('click', () => showAuthModal('login'));
    signupNavBtn.addEventListener('click', () => showAuthModal('signup'));
    closeAuthModal.addEventListener('click', hideAuthModal);
    authModal.addEventListener('click', e => { if (e.target === authModal) hideAuthModal(); });
    tabLogin.addEventListener('click', () => switchAuthTab('login'));
    tabSignup.addEventListener('click', () => switchAuthTab('signup'));
    switchToSignup.addEventListener('click', () => switchAuthTab('signup'));
    switchToLogin.addEventListener('click', () => switchAuthTab('login'));
    loginSubmit.addEventListener('click', handleLogin);
    signupSubmit.addEventListener('click', handleSignup);
    document.getElementById('loginPassword').addEventListener('keydown', e => { if (e.key === 'Enter') handleLogin(); });
    document.getElementById('signupPassword').addEventListener('keydown', e => { if (e.key === 'Enter') handleSignup(); });
    userAvatar.addEventListener('click', () => { if (confirm(`Logged in as ${currentUser.name}.\nOK to logout.`)) handleLogout(); });

    // Payment modal
    closePaymentModal.addEventListener('click', () => closeModal(paymentModal));
    paymentModal.addEventListener('click', e => { if (e.target === paymentModal) closeModal(paymentModal); });
    paymentSubmit.addEventListener('click', validateAndPay);

    // Payment method tabs
    document.querySelectorAll('input[name="payMethod"]').forEach(radio => {
        radio.addEventListener('change', () => {
            const val = radio.value;
            cardDetails.classList.toggle('hidden', val !== 'card');
            upiDetails.classList.toggle('hidden', val !== 'upi');
            cashDetails.classList.toggle('hidden', val !== 'cash');
            document.querySelectorAll('.method-card').forEach(c => c.classList.remove('active'));
            radio.closest('.method-card').classList.add('active');
        });
    });

    // Card formatting
    cardNumber.addEventListener('input', () => {
        cardNumber.value = cardNumber.value.replace(/\D/g,'').substring(0,16).replace(/(.{4})/g,'$1  ').trim();
    });
    cardExpiry.addEventListener('input', () => {
        let v = cardExpiry.value.replace(/\D/g,'').substring(0,4);
        if (v.length >= 2) v = v.substring(0,2) + '/' + v.substring(2);
        cardExpiry.value = v;
    });
    cardCvv.addEventListener('input', () => {
        cardCvv.value = cardCvv.value.replace(/\D/g,'').substring(0,3);
    });

    // Detail modal
    closeDetailModal.addEventListener('click', () => closeModal(detailModal));
    detailModal.addEventListener('click', e => { if (e.target === detailModal) closeModal(detailModal); });

    // Star picker
    document.querySelectorAll('.star-picker .star').forEach(star => {
        star.addEventListener('click', () => {
            selectedStarRating = parseInt(star.dataset.val);
            document.querySelectorAll('.star-picker .star').forEach(s => {
                s.classList.toggle('active', parseInt(s.dataset.val) <= selectedStarRating);
            });
        });
        star.addEventListener('mouseover', () => {
            document.querySelectorAll('.star-picker .star').forEach(s => {
                s.classList.toggle('active', parseInt(s.dataset.val) <= parseInt(star.dataset.val));
            });
        });
        star.addEventListener('mouseout', () => {
            document.querySelectorAll('.star-picker .star').forEach(s => {
                s.classList.toggle('active', parseInt(s.dataset.val) <= selectedStarRating);
            });
        });
    });
    document.getElementById('reviewSubmit').addEventListener('click', submitReview);

    // Success modal
    successOkBtn.addEventListener('click', () => closeModal(successModal));

    // Category filter
    filterBar.addEventListener('click', e => {
        const btn = e.target.closest('.filter-btn');
        if (!btn) return;
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.dataset.cat;
        renderMenu(activeFilter);
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        document.getElementById('navbar').style.background =
            window.scrollY > 50 ? 'rgba(18,18,18,0.98)' : 'rgba(18,18,18,0.8)';
    });
}

// =====================================================
// BOOT
// =====================================================
initApp();
