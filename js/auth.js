// =====================================================
// AUTH
// =====================================================
function getUsers() { return JSON.parse(localStorage.getItem('sliceUsers')) || []; }
function saveUsers(u) { localStorage.setItem('sliceUsers', JSON.stringify(u)); }

function renderAuthState() {
    if (currentUser) {
        authSection.classList.add('hidden');
        userSection.classList.remove('hidden');
        userAvatar.textContent = currentUser.name.charAt(0).toUpperCase();
        userAvatar.title = `Logged in as ${currentUser.name}`;
    } else {
        authSection.classList.remove('hidden');
        userSection.classList.add('hidden');
    }
}

function showAuthModal(tab = 'login') { switchAuthTab(tab); openModal(authModal); }
function hideAuthModal() { closeModal(authModal); clearAuthErrors(); }

function switchAuthTab(tab) {
    const isLogin = tab === 'login';
    tabLogin.classList.toggle('active', isLogin);
    tabSignup.classList.toggle('active', !isLogin);
    formLogin.classList.toggle('hidden', !isLogin);
    formSignup.classList.toggle('hidden', isLogin);
    clearAuthErrors();
}

function clearAuthErrors() {
    [loginError, signupError].forEach(el => { el.classList.add('hidden'); el.textContent = ''; });
}

function showError(el, msg) { el.textContent = msg; el.classList.remove('hidden'); }

function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    if (!email || !password) { showError(loginError, 'Please fill in all fields.'); return; }
    const user = getUsers().find(u => u.email === email && u.password === password);
    if (!user) { showError(loginError, 'Invalid email or password.'); return; }
    currentUser = user;
    localStorage.setItem('sliceCurrentUser', JSON.stringify(currentUser));
    renderAuthState();
    hideAuthModal();
    showToast(`Welcome back, ${user.name}! 👋`, 'success');
    document.getElementById('loginEmail').value = '';
    document.getElementById('loginPassword').value = '';
}

function handleSignup() {
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const phone = document.getElementById('signupPhone').value.trim();
    const password = document.getElementById('signupPassword').value;
    if (!name || !email || !phone || !password) { showError(signupError, 'All fields are required.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError(signupError, 'Enter a valid email.'); return; }
    if (password.length < 6) { showError(signupError, 'Password must be at least 6 characters.'); return; }
    const users = getUsers();
    if (users.find(u => u.email === email)) { showError(signupError, 'Account already exists.'); return; }
    const newUser = { id: Date.now(), name, email, phone, password };
    users.push(newUser);
    saveUsers(users);
    currentUser = newUser;
    localStorage.setItem('sliceCurrentUser', JSON.stringify(currentUser));
    renderAuthState();
    hideAuthModal();
    showToast(`Welcome, ${name}! 🎉`, 'success');
    ['signupName','signupEmail','signupPhone','signupPassword'].forEach(id => document.getElementById(id).value = '');
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('sliceCurrentUser');
    renderAuthState();
    showToast('Logged out. See you soon! 👋');
}
