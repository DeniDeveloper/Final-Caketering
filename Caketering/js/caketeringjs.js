// ==================== CAKETERING E-COMMERCE CORE LOGIC ====================

// --- STORAGE HELPERS ---
function getStorage(key, fallback) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : fallback;
    } catch (e) {
        console.error(`Error reading ${key} from localStorage:`, e);
        return fallback;
    }
}

function setStorage(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        console.error(`Error writing ${key} to localStorage:`, e);
        if (e.name === 'QuotaExceededError') {
            showNotification('Storage limit reached. Please clear browser storage.', 'error');
        }
    }
}

function escapeHtml(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/[&<>"']/g, function(m) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        }[m];
    });
}

// --- DEFAULT PRODUCT DATA ---
const DEFAULT_PRODUCTS = [
    {
        id: 1,
        name: "Strawberry Shortcake",
        category: "cakes",
        price: 850,
        image: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&auto=format&fit=crop&q=60",
        description: "Fresh strawberries layered with vanilla sponge and whipped cream",
        badge: "Best Seller",
        inStock: true,
        rating: 4.9,
        reviewsCount: 38,
        ingredients: "Fresh Strawberries, Vanilla Sponge, Heavy Cream, Sugar, Eggs, Milk",
        allergens: "Contains Milk, Eggs, Wheat (Gluten)"
    },
    {
        id: 2,
        name: "Chocolate Fudge Cake",
        category: "cakes",
        price: 950,
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=60",
        description: "Rich dark chocolate layers with ganache frosting",
        badge: "Popular",
        inStock: true,
        rating: 4.8,
        reviewsCount: 42,
        ingredients: "Belgian Dark Chocolate, Dutch Cocoa, Butter, Flour, Eggs, Vanilla",
        allergens: "Contains Milk, Eggs, Wheat"
    },
    {
        id: 3,
        name: "Red Velvet Cupcakes (6pcs)",
        category: "cupcakes",
        price: 450,
        image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=500&auto=format&fit=crop&q=60",
        description: "Classic red velvet with cream cheese frosting",
        badge: null,
        inStock: true,
        rating: 4.7,
        reviewsCount: 29,
        ingredients: "Cocoa, Buttermilk, Cream Cheese, Flour, Sugar, Vanilla",
        allergens: "Contains Dairy, Eggs, Gluten"
    },
    {
        id: 4,
        name: "Croissant Box (4pcs)",
        category: "pastries",
        price: 280,
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=60",
        description: "Buttery, flaky French croissants baked fresh",
        badge: "Fresh",
        inStock: true,
        rating: 4.9,
        reviewsCount: 51,
        ingredients: "French Butter, Wheat Flour, Yeast, Sugar, Sea Salt, Eggs",
        allergens: "Contains Milk, Eggs, Wheat"
    },
    {
        id: 5,
        name: "Ube Cake",
        category: "cakes",
        price: 780,
        image: "https://images.unsplash.com/photo-1519340333755-56e9c1d04579?w=500&auto=format&fit=crop&q=60",
        description: "Filipino purple yam cake with macapuno strings",
        badge: "Local Favorite",
        inStock: true,
        rating: 5.0,
        reviewsCount: 64,
        ingredients: "Real Ube Halaya, Macapuno Strings, Chiffon Cake Base, Whipped Cream",
        allergens: "Contains Dairy, Eggs, Wheat"
    },
    {
        id: 6,
        name: "Macarons (12pcs)",
        category: "cookies",
        price: 650,
        image: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=500&auto=format&fit=crop&q=60",
        description: "Assorted flavors: pistachio, raspberry, lemon, chocolate",
        badge: null,
        inStock: true,
        rating: 4.8,
        reviewsCount: 33,
        ingredients: "Almond Flour, Egg Whites, Sugar, Buttercream, Natural Fruit Puree",
        allergens: "Contains Tree Nuts (Almonds), Eggs, Dairy"
    },
    {
        id: 7,
        name: "Mango Cream Cake",
        category: "cakes",
        price: 920,
        image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=500&auto=format&fit=crop&q=60",
        description: "Sweet mangoes on chiffon cake with fresh cream",
        badge: "Seasonal",
        inStock: true,
        rating: 4.9,
        reviewsCount: 47,
        ingredients: "Ripe Carabao Mangoes, Chiffon Sponge, Fresh Cream, Sugar",
        allergens: "Contains Dairy, Eggs, Gluten"
    },
    {
        id: 8,
        name: "Chocolate Chip Cookies",
        category: "cookies",
        price: 350,
        image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500&auto=format&fit=crop&q=60",
        description: "Chewy cookies with Belgian chocolate chips",
        badge: null,
        inStock: true,
        rating: 4.6,
        reviewsCount: 22,
        ingredients: "Belgian Chocolate Chips, Brown Sugar, Butter, Flour, Vanilla",
        allergens: "Contains Dairy, Eggs, Wheat"
    },
    {
        id: 9,
        name: "Fruit Tart",
        category: "pastries",
        price: 180,
        image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=500&auto=format&fit=crop&q=60",
        description: "Butter tart shell with custard and fresh fruits",
        badge: null,
        inStock: true,
        rating: 4.7,
        reviewsCount: 19,
        ingredients: "Shortcrust Pastry, Vanilla Custard, Kiwi, Strawberries, Blueberries",
        allergens: "Contains Dairy, Eggs, Gluten"
    }
];

const DEFAULT_CUSTOM_CAKES = [];

const DEFAULT_ASSETS = [
    "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1519340333755-56e9c1d04579?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=500&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=500&auto=format&fit=crop&q=60"
];

// --- GLOBAL APPLICATION STATE ---
let products = getStorage('products', DEFAULT_PRODUCTS);
let customCakes = getStorage('customCakes', DEFAULT_CUSTOM_CAKES);
let users = getStorage('users', []);
let currentUser = getStorage('currentUser', null);
let orders = getStorage('orders', []);
let inquiries = getStorage('inquiries', []);
let assets = getStorage('assets', DEFAULT_ASSETS);
let cart = getStorage('cart', []);
let wishlist = getStorage('wishlist', []);
let productReviews = getStorage('productReviews', {});

// Admin credentials
const ADMIN_EMAIL = "caketering.ph@gmail.com";
const ALT_ADMIN_EMAIL = "admin@caketering.com";
const ADMIN_PASSWORD = "admin123";

// State trackers
let autoPopupTimeout = null;
let otpTimer = null;
let loginAttempts = {};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // Ensure products, customCakes, and assets are saved in storage if first run
    customCakes = customCakes.filter(c => c.occasion !== '50th Birthday' && c.occasion !== 'Wedding');
    setStorage('customCakes', customCakes);

    renderProducts('all');
    renderCustomCakesGallery();
    updateCartUI();
    updateWishlistUI();
    updateUserUI();
    updateAdminStats();

    if (currentUser && currentUser.isAdmin) {
        showAdminButton();
    }

    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail && document.getElementById('email-input')) {
        document.getElementById('email-input').value = rememberedEmail;
        const rememberCheckbox = document.getElementById('remember-me');
        if (rememberCheckbox) rememberCheckbox.checked = true;
    }
});

// Live Cross-Tab & Cross-Window Storage Synchronization
window.addEventListener('storage', (e) => {
    if (e.key === 'orders') {
        orders = getStorage('orders', []);
        updateAdminStats();
        if (typeof adminOrdersFilterState !== 'undefined') {
            filterAdminOrders(adminOrdersFilterState);
        }
    }
    if (e.key === 'customCakes') {
        customCakes = getStorage('customCakes', DEFAULT_CUSTOM_CAKES);
        updateAdminStats();
        renderCustomCakesGallery();
        if (typeof renderPortalCustom === 'function') renderPortalCustom();
    }
    if (e.key === 'users') {
        users = getStorage('users', []);
        updateAdminStats();
        renderPortalUsers();
        if (typeof renderUsersTable === 'function') renderUsersTable();
    }
    if (e.key === 'inquiries') {
        inquiries = getStorage('inquiries', []);
        updateAdminStats();
        renderPortalInquiries();
    }
});

// --- CUSTOM CAKES FUNCTIONS ---
function renderCustomCakesGallery() {
    const gallery = document.getElementById('custom-cakes-gallery');
    if (!gallery) return;

    const approvedCakes = customCakes.filter(cake => cake.status === 'completed' || cake.status === 'approved');

    if (approvedCakes.length === 0) {
        gallery.innerHTML = `
            <div class="col-span-full text-center py-12">
                <i class="fas fa-birthday-cake text-5xl text-gray-300 mb-4"></i>
                <p class="text-gray-500">No custom cakes in gallery yet. Be the first to request one!</p>
            </div>
        `;
        return;
    }

    gallery.innerHTML = approvedCakes.map(cake => `
        <div class="cake-card bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <div class="relative h-64 overflow-hidden">
                <img src="${cake.image || 'https://images.unsplash.com/photo-1535140728325-4a3708b436f1?w=500&auto=format&fit=crop&q=60'}" 
                     alt="Custom cake" 
                     loading="lazy" decoding="async"
                     class="w-full h-full object-cover">
                <span class="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-pink-600 shadow-sm">
                    ${cake.type ? cake.type.charAt(0).toUpperCase() + cake.type.slice(1) : 'Custom'}
                </span>
            </div>
            <div class="p-6">
                <h3 class="text-xl font-bold text-gray-800 mb-2">${escapeHtml(cake.occasion || 'Custom Order')}</h3>
                <p class="text-gray-600 text-sm mb-3">${escapeHtml((cake.description || '').substring(0, 100))}${cake.description && cake.description.length > 100 ? '...' : ''}</p>
                <div class="flex items-center text-sm text-gray-500">
                    <i class="fas fa-user mr-2"></i>
                    <span>${escapeHtml(cake.name || 'Customer')}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function showCustomOrderModal() {
    if (!currentUser) {
        showNotification('Please login first to request custom cake', 'warning');
        openAuthModal();
        return;
    }

    if (currentUser && !currentUser.isAdmin) {
        const nameInput = document.getElementById('custom-name');
        const emailInput = document.getElementById('custom-email');
        const phoneInput = document.getElementById('custom-phone');
        if (nameInput) nameInput.value = currentUser.name || '';
        if (emailInput) emailInput.value = currentUser.email || '';
        if (phoneInput && currentUser.phone) {
            phoneInput.value = currentUser.phone.replace('+63', '0');
        }
    }

    const dateInput = document.getElementById('custom-date');
    if (dateInput) {
        const minDate = new Date();
        minDate.setDate(minDate.getDate() + 3);
        dateInput.min = minDate.toISOString().split('T')[0];
    }

    document.getElementById('custom-order-modal').classList.remove('hidden');
}

function closeCustomOrderModal() {
    document.getElementById('custom-order-modal').classList.add('hidden');
    document.getElementById('custom-order-form').reset();
    const preview = document.getElementById('custom-image-preview');
    if (preview) preview.classList.remove('has-image');
    const previewImg = document.getElementById('preview-img');
    if (previewImg) previewImg.src = '';
    const fileName = document.getElementById('image-file-name');
    if (fileName) fileName.textContent = '';
}

function previewImage(input) {
    const preview = document.getElementById('custom-image-preview');
    const previewImg = document.getElementById('preview-img');
    const fileName = document.getElementById('image-file-name');

    if (input.files && input.files[0]) {
        const file = input.files[0];
        if (file.size > 5 * 1024 * 1024) {
            showNotification('Image size must be less than 5MB', 'error');
            input.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            if (previewImg) previewImg.src = e.target.result;
            if (preview) preview.classList.add('has-image');
            if (fileName) fileName.textContent = file.name;
        };
        reader.readAsDataURL(file);
    }
}

function submitCustomOrder(e) {
    e.preventDefault();

    const name = document.getElementById('custom-name').value;
    const phone = document.getElementById('custom-phone').value;
    const email = document.getElementById('custom-email').value;
    const type = document.getElementById('custom-type').value;
    const occasion = document.getElementById('custom-occasion').value;
    const flavor = document.getElementById('custom-flavor').value;
    const size = document.getElementById('custom-size').value;
    const date = document.getElementById('custom-date').value;
    const description = document.getElementById('custom-description').value;
    const budget = document.getElementById('custom-budget').value;
    const imageFile = document.getElementById('custom-image-file').files[0];

    const orderRef = 'CUST-' + Math.random().toString(36).substr(2, 8).toUpperCase();

    let imageData = null;
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imageData = e.target.result;
            saveCustomOrder();
        };
        reader.readAsDataURL(imageFile);
    } else {
        saveCustomOrder();
    }

    function saveCustomOrder() {
        const customOrder = {
            id: customCakes.length > 0 ? Math.max(...customCakes.map(c => c.id || 0)) + 1 : 1,
            ref: orderRef,
            name: name,
            phone: phone,
            email: email,
            type: type,
            occasion: occasion,
            flavor: flavor,
            size: size,
            preferredDate: date,
            date: date,
            description: description,
            budget: budget,
            image: imageData,
            status: 'pending',
            userId: currentUser?.id,
            createdAt: new Date().toISOString(),
            adminNotes: '',
            estimatedPrice: null
        };

        customCakes.push(customOrder);
        setStorage('customCakes', customCakes);

        closeCustomOrderModal();
        document.getElementById('custom-success-modal').classList.remove('hidden');

        showNotification(`📧 Custom cake request alert sent to caketering.ph@gmail.com for Ref ${orderRef}`, 'info');

        updateAdminStats();

        showNotification('Custom cake request submitted successfully!', 'success');
    }
}

function closeCustomSuccessModal() {
    document.getElementById('custom-success-modal').classList.add('hidden');
}

function showUserCustomOrders() {
    if (!currentUser) {
        showNotification('Please login first', 'warning');
        openAuthModal();
        return;
    }

    const userCustomOrders = customCakes.filter(cake => 
        cake.userId === currentUser.id || 
        (currentUser.email && cake.email === currentUser.email) || 
        (currentUser.phone && cake.phone === currentUser.phone)
    );

    const container = document.getElementById('user-custom-orders-list');

    if (userCustomOrders.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-birthday-cake text-5xl text-gray-300 mb-4"></i>
                <p class="text-gray-500">No custom cake requests yet</p>
                <button onclick="closeUserCustomOrdersModal(); showCustomOrderModal();" class="mt-4 text-pink-600 font-medium hover:underline">
                    Request a Custom Cake
                </button>
            </div>
        `;
    } else {
        container.innerHTML = userCustomOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(order => `
            <div class="order-history-card bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition">
                <div class="flex flex-wrap justify-between items-start mb-4">
                    <div>
                        <span class="text-sm text-gray-500">Order Reference</span>
                        <p class="font-mono font-bold">${escapeHtml(order.ref)}</p>
                    </div>
                    <span class="px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'approved' ? 'bg-green-100 text-green-800' :
                        order.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'completed' ? 'bg-purple-100 text-purple-800' :
                        'bg-red-100 text-red-800'
                    }">${escapeHtml(order.status)}</span>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                        <span class="text-gray-500">Type</span>
                        <p class="font-medium capitalize">${escapeHtml(order.type)}</p>
                    </div>
                    <div>
                        <span class="text-gray-500">Occasion</span>
                        <p class="font-medium">${escapeHtml(order.occasion)}</p>
                    </div>
                    <div>
                        <span class="text-gray-500">Flavor</span>
                        <p class="font-medium capitalize">${escapeHtml(order.flavor)}</p>
                    </div>
                    <div>
                        <span class="text-gray-500">Size</span>
                        <p class="font-medium">${escapeHtml(order.size)}</p>
                    </div>
                </div>

                <p class="text-sm text-gray-600 mb-3">${escapeHtml(order.description)}</p>

                ${order.estimatedPrice ? `
                    <div class="mb-3 p-3 bg-green-50 rounded-lg">
                        <span class="text-xs text-gray-500">Estimated Price</span>
                        <p class="text-lg font-bold text-green-600">₱${order.estimatedPrice}</p>
                    </div>
                ` : ''}

                <button onclick="viewCustomOrderDetails('${order.ref}')" class="text-pink-600 text-sm font-medium hover:underline">
                    View Details <i class="fas fa-chevron-right ml-1 text-xs"></i>
                </button>
            </div>
        `).join('');
    }

    document.getElementById('user-custom-orders-modal').classList.remove('hidden');
}

function closeUserCustomOrdersModal() {
    document.getElementById('user-custom-orders-modal').classList.add('hidden');
}

function viewCustomOrderDetails(ref) {
    const order = customCakes.find(o => o.ref === ref);
    if (!order) return;

    let statusMsg = 'Your request is pending review by our baker team.';
    if (order.status === 'approved') statusMsg = 'Approved! We will begin crafting your cake.';
    if (order.status === 'in-progress') statusMsg = 'Your custom cake is currently being baked.';
    if (order.status === 'completed') statusMsg = 'Completed! Thank you for ordering with us.';

    const rows = `
        <div class="detail-row"><span class="detail-label">Reference</span><span class="detail-value font-mono font-bold">${escapeHtml(order.ref)}</span></div>
        <div class="detail-row"><span class="detail-label">Status</span><span class="detail-value text-pink-600 font-semibold uppercase">${escapeHtml(order.status)}</span></div>
        <div class="detail-row"><span class="detail-label">Customer</span><span class="detail-value">${escapeHtml(order.name)}</span></div>
        <div class="detail-row"><span class="detail-label">Phone</span><span class="detail-value">${escapeHtml(order.phone)}</span></div>
        <div class="detail-row"><span class="detail-label">Occasion</span><span class="detail-value">${escapeHtml(order.occasion)}</span></div>
        <div class="detail-row"><span class="detail-label">Flavor</span><span class="detail-value capitalize">${escapeHtml(order.flavor)}</span></div>
        <div class="detail-row"><span class="detail-label">Size</span><span class="detail-value">${escapeHtml(order.size)}</span></div>
        <div class="detail-row"><span class="detail-label">Target Date</span><span class="detail-value">${order.preferredDate || order.date}</span></div>
        ${order.estimatedPrice ? `<div class="detail-row"><span class="detail-label">Est. Price</span><span class="detail-value text-green-600 font-bold">₱${order.estimatedPrice}</span></div>` : ''}
        <div class="detail-section-title">Design Instructions</div>
        <div class="p-3 bg-gray-50 rounded-lg text-sm text-gray-700">${escapeHtml(order.description)}</div>
        <div class="mt-4 p-3 bg-pink-50 text-pink-700 rounded-lg text-xs font-medium"><i class="fas fa-info-circle mr-1"></i> ${statusMsg}</div>
    `;

    showDetailView('Custom Cake Request', rows);
}

// --- REUSABLE DETAIL VIEW MODAL ---
function showDetailView(title, contentHtml) {
    document.getElementById('detail-view-title').textContent = title;
    document.getElementById('detail-view-body').innerHTML = contentHtml;
    document.getElementById('detail-view-modal').classList.remove('hidden');
}

function closeDetailViewModal() {
    document.getElementById('detail-view-modal').classList.add('hidden');
}

// --- AUTHENTICATION FUNCTIONS ---
function switchAuthTab(tab) {
    ['email', 'phone', 'facebook'].forEach(t => {
        const tabEl = document.getElementById(`tab-${t}`);
        const sectionEl = document.getElementById(`${t}-login-section`);

        if (t === tab) {
            if (tabEl) {
                tabEl.classList.add('text-pink-600', 'border-b-2', 'border-pink-600');
                tabEl.classList.remove('text-gray-500');
            }
            if (sectionEl) sectionEl.classList.remove('hidden');
        } else {
            if (tabEl) {
                tabEl.classList.remove('text-pink-600', 'border-b-2', 'border-pink-600');
                tabEl.classList.add('text-gray-500');
            }
            if (sectionEl) sectionEl.classList.add('hidden');
        }
    });

    const regSection = document.getElementById('register-section');
    if (regSection) regSection.classList.add('hidden');
    const authTitle = document.getElementById('auth-title');
    if (authTitle) authTitle.textContent = 'Welcome to Caketering!';
}

function openAuthModal() {
    document.getElementById('auth-modal').classList.remove('hidden');
    switchAuthTab('email');
}

function closeAuthModal() {
    document.getElementById('auth-modal').classList.add('hidden');
}

function togglePasswordVisibility() {
    const passwordInput = document.getElementById('password-input');
    const icon = document.getElementById('toggle-password-icon');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

function loginWithEmail() {
    const email = document.getElementById('email-input').value.trim();
    const password = document.getElementById('password-input').value;
    const rememberMe = document.getElementById('remember-me')?.checked;

    if (!email || !password) {
        showNotification('Please enter email and password', 'error');
        return;
    }

    if (!validateEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    if ((email === ADMIN_EMAIL || email === ALT_ADMIN_EMAIL) && password === ADMIN_PASSWORD) {
        const adminUser = {
            id: 0,
            email: email,
            name: 'Admin',
            isAdmin: true,
            loginMethod: 'email',
            lastLogin: new Date().toISOString(),
            createdAt: new Date().toISOString()
        };

        currentUser = adminUser;
        setStorage('currentUser', adminUser);

        if (rememberMe) {
            localStorage.setItem('rememberedEmail', email);
        }

        if (!users.find(u => u.email === email)) {
            users.push(adminUser);
            setStorage('users', users);
        }

        updateUserUI();
        closeAuthModal();
        showNotification('Admin login successful!', 'success');
        showAdminButton();
        return;
    }

    let user = users.find(u => u.email === email);

    if (!user) {
        showNotification('Email not registered. Please sign up first.', 'error');
        return;
    } else {
        if (user.password !== btoa(password)) {
            showNotification('Invalid password', 'error');
            return;
        }
        user.lastLogin = new Date().toISOString();
        setStorage('users', users);
    }

    currentUser = user;
    setStorage('currentUser', user);

    if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
    }

    updateUserUI();
    closeAuthModal();
    showNotification(`Welcome back, ${user.name}!`, 'success');
}

function loginWithGoogle() {
    showNotification('Connecting to Google...', 'info');

    setTimeout(() => {
        const googleUser = {
            id: 'google_' + Math.random().toString(36).substr(2, 9),
            email: 'user@gmail.com',
            name: 'Google User',
            isAdmin: false,
            loginMethod: 'google',
            lastLogin: new Date().toISOString(),
            createdAt: new Date().toISOString()
        };

        currentUser = googleUser;
        setStorage('currentUser', googleUser);

        if (!users.find(u => u.email === googleUser.email)) {
            users.push(googleUser);
            setStorage('users', users);
        }

        updateUserUI();
        closeAuthModal();
        showNotification('Logged in with Google!', 'success');
    }, 1200);
}

function loginWithFacebook() {
    showNotification('Connecting to Facebook...', 'info');

    setTimeout(() => {
        const fbUser = {
            id: 'fb_' + Math.random().toString(36).substr(2, 9),
            email: 'user@facebook.com',
            name: 'Facebook User',
            isAdmin: false,
            loginMethod: 'facebook',
            lastLogin: new Date().toISOString(),
            createdAt: new Date().toISOString()
        };

        currentUser = fbUser;
        setStorage('currentUser', fbUser);

        if (!users.find(u => u.email === fbUser.email)) {
            users.push(fbUser);
            setStorage('users', users);
        }

        updateUserUI();
        closeAuthModal();
        showNotification('Logged in with Facebook!', 'success');
    }, 1200);
}

function showRegisterForm() {
    document.getElementById('email-login-section').classList.add('hidden');
    document.getElementById('phone-login-section').classList.add('hidden');
    document.getElementById('facebook-login-section').classList.add('hidden');
    document.getElementById('register-section').classList.remove('hidden');
    document.getElementById('auth-title').textContent = 'Create Account';
}

function showLoginForm() {
    document.getElementById('register-section').classList.add('hidden');
    document.getElementById('email-login-section').classList.remove('hidden');
    document.getElementById('auth-title').textContent = 'Welcome to Caketering!';
    switchAuthTab('email');
}

function registerUser() {
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    const phone = document.getElementById('register-phone').value.trim();
    const address = document.getElementById('register-address').value.trim();
    const agreeTerms = document.getElementById('register-agree-terms').checked;

    if (!name || !email || !password || !confirmPassword) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    if (!validateEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    if (password.length < 8) {
        showNotification('Password must be at least 8 characters', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }

    if (!agreeTerms) {
        showNotification('Please agree to the Terms and Privacy Policy', 'error');
        return;
    }

    if (users.find(u => u.email === email)) {
        showNotification('Email already registered. Please login.', 'error');
        return;
    }

    const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => typeof u.id === 'number' ? u.id : 0)) + 1 : 1,
        name: name,
        email: email,
        password: btoa(password),
        phone: phone ? '+63' + phone.replace(/^0/, '') : null,
        address: address,
        isAdmin: false,
        loginMethod: 'email',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        verified: true
    };

    users.push(newUser);
    setStorage('users', users);

    currentUser = newUser;
    setStorage('currentUser', newUser);

    updateUserUI();
    closeAuthModal();
    showNotification('Account created successfully!', 'success');
}

function forgotPassword() {
    const email = prompt('Enter your email address to reset password:');
    if (email && validateEmail(email)) {
        showNotification('Password reset link sent to ' + email, 'success');
    } else if (email) {
        showNotification('Invalid email address', 'error');
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function sendOTP() {
    const phone = document.getElementById('phone-input').value.trim();
    const agreeTerms = document.getElementById('agree-terms')?.checked;

    if (document.getElementById('agree-terms') && !agreeTerms) {
        showNotification('Please agree to the Terms and Privacy Policy', 'error');
        return;
    }

    if (!/^9\d{9}$/.test(phone) && !/^09\d{9}$/.test(phone)) {
        showNotification('Please enter a valid Philippine mobile number (e.g., 9123456789)', 'error');
        return;
    }

    const cleanPhone = phone.replace(/^0/, '');
    const fullPhone = '+63' + cleanPhone;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiryTime = Date.now() + 5 * 60 * 1000;

    sessionStorage.setItem('pendingOTP', JSON.stringify({
        code: otp,
        expiry: expiryTime,
        phone: fullPhone
    }));

    document.getElementById('otp-phone').textContent = fullPhone;

    document.getElementById('phone-step').classList.add('hidden');
    document.getElementById('otp-step').classList.remove('hidden');

    startOTPTimer();

    showNotification(`DEMO MODE: Your OTP is ${otp} (Valid for 5 mins)`, 'info');
}

function startOTPTimer() {
    const timerDiv = document.getElementById('otp-timer');

    if (otpTimer) clearInterval(otpTimer);

    otpTimer = setInterval(() => {
        const storedOTP = JSON.parse(sessionStorage.getItem('pendingOTP'));
        if (storedOTP) {
            const timeLeft = Math.max(0, Math.floor((storedOTP.expiry - Date.now()) / 1000));
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;

            if (timerDiv) {
                timerDiv.innerHTML = `
                    <i class="fas fa-clock mr-1"></i> OTP expires in: ${minutes}:${seconds.toString().padStart(2, '0')}
                `;
            }

            if (timeLeft <= 0) {
                clearInterval(otpTimer);
                sessionStorage.removeItem('pendingOTP');
                if (timerDiv) timerDiv.innerHTML = '<span class="text-red-600">OTP expired. Please request again.</span>';
            }
        }
    }, 1000);
}

function moveToNext(current, next) {
    if (current.value.length >= 1) {
        const nextInput = document.querySelectorAll('.otp-input')[next];
        if (nextInput) nextInput.focus();
    }
}

function verifyOTP() {
    const otpInputs = document.querySelectorAll('.otp-input');
    const enteredOTP = Array.from(otpInputs).map(input => input.value).join('');

    if (enteredOTP.length !== 6) {
        showNotification('Please enter the 6-digit OTP', 'error');
        return;
    }

    const storedOTP = JSON.parse(sessionStorage.getItem('pendingOTP'));

    if (!storedOTP || Date.now() > storedOTP.expiry) {
        showNotification('OTP expired. Please request again.', 'error');
        sessionStorage.removeItem('pendingOTP');
        backToPhone();
        return;
    }

    if (enteredOTP !== storedOTP.code) {
        showNotification('Invalid OTP. Please try again.', 'error');
        otpInputs.forEach(input => input.value = '');
        if (otpInputs[0]) otpInputs[0].focus();
        return;
    }

    const phone = storedOTP.phone;
    let user = users.find(u => u.phone === phone);

    if (!user) {
        user = {
            id: users.length > 0 ? Math.max(...users.map(u => typeof u.id === 'number' ? u.id : 0)) + 1 : 1,
            phone: phone,
            name: 'Customer',
            email: '',
            address: '',
            isAdmin: false,
            loginMethod: 'phone',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            verified: true
        };
        users.push(user);
        setStorage('users', users);
    } else {
        user.lastLogin = new Date().toISOString();
        setStorage('users', users);
    }

    currentUser = user;
    setStorage('currentUser', user);

    updateUserUI();
    closeAuthModal();

    otpInputs.forEach(input => input.value = '');
    sessionStorage.removeItem('pendingOTP');
    if (otpTimer) clearInterval(otpTimer);

    showNotification('Login successful!', 'success');
}

function resendOTP() {
    sendOTP();
}

function backToPhone() {
    document.getElementById('phone-step').classList.remove('hidden');
    document.getElementById('otp-step').classList.add('hidden');
    if (otpTimer) clearInterval(otpTimer);
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUserUI();
    closeAdminDashboard();
    closeUserProfileModal();
    closeUserOrdersModal();
    closeUserCustomOrdersModal();
    closeAdminProductsModal();
    closeAdminOrdersModal();
    closeAdminCustomOrdersModal();
    closeAdminUsersModal();
    closeAnalyticsModal();
    closeAdminInquiriesModal();
    closeAssetLibraryModal();
    showNotification('Logged out successfully', 'info');
}

function updateUserUI() {
    const loginBtn = document.getElementById('login-btn');
    const userProfile = document.getElementById('user-profile');
    const userNameDisplay = document.getElementById('user-name-display');
    const adminBtn = document.getElementById('admin-btn');

    if (currentUser) {
        if (loginBtn) loginBtn.classList.add('hidden');
        if (userProfile) userProfile.classList.remove('hidden');

        if (currentUser.isAdmin) {
            if (userNameDisplay) userNameDisplay.textContent = 'Admin';
            if (adminBtn) adminBtn.classList.remove('hidden');
        } else {
            if (userNameDisplay) {
                if (currentUser.name && currentUser.name !== 'Customer') {
                    userNameDisplay.textContent = currentUser.name.split(' ')[0];
                } else if (currentUser.phone) {
                    const p = currentUser.phone;
                    userNameDisplay.textContent = p.substring(0, 5) + '***' + p.substring(p.length - 2);
                } else if (currentUser.email) {
                    userNameDisplay.textContent = currentUser.email.split('@')[0];
                } else {
                    userNameDisplay.textContent = 'Account';
                }
            }
            if (adminBtn) adminBtn.classList.add('hidden');
        }
    } else {
        if (loginBtn) loginBtn.classList.remove('hidden');
        if (userProfile) userProfile.classList.add('hidden');
        if (adminBtn) adminBtn.classList.add('hidden');
    }
}

function toggleUserMenu() {
    const menu = document.getElementById('user-menu');
    if (menu) menu.classList.toggle('hidden');
}

document.addEventListener('click', (e) => {
    const menu = document.getElementById('user-menu');
    const profileBtn = document.querySelector('#user-profile button');
    if (menu && !menu.classList.contains('hidden') && profileBtn && !profileBtn.contains(e.target) && !menu.contains(e.target)) {
        menu.classList.add('hidden');
    }
});

// --- USER PROFILE FUNCTIONS ---
function showUserProfile() {
    if (!currentUser) {
        showNotification('Please login first', 'warning');
        openAuthModal();
        return;
    }

    if (currentUser.isAdmin) {
        showNotification('Admin accounts manage settings via dashboard', 'info');
        return;
    }

    document.getElementById('profile-name').value = currentUser.name || '';
    document.getElementById('profile-email').value = currentUser.email || '';
    document.getElementById('profile-phone').value = currentUser.phone ? currentUser.phone.replace('+63', '') : '';
    document.getElementById('profile-address').value = currentUser.address || '';

    document.getElementById('profile-name-display').textContent = currentUser.name || 'Customer';
    document.getElementById('profile-email-display').textContent = currentUser.email || 'No email';

    const joinDate = currentUser.createdAt ? new Date(currentUser.createdAt) : new Date();
    document.getElementById('profile-joined').textContent = joinDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

    document.getElementById('user-profile-modal').classList.remove('hidden');
}

function closeUserProfileModal() {
    document.getElementById('user-profile-modal').classList.add('hidden');
}

function updateProfile(e) {
    e.preventDefault();

    const name = document.getElementById('profile-name').value.trim();
    const email = document.getElementById('profile-email').value.trim();
    const phone = document.getElementById('profile-phone').value.trim();
    const address = document.getElementById('profile-address').value.trim();
    const currentPassword = document.getElementById('profile-current-password').value;
    const newPassword = document.getElementById('profile-new-password').value;
    const confirmPassword = document.getElementById('profile-confirm-password').value;

    if (email && !validateEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    const existingUser = users.find(u => u.email === email && u.id !== currentUser.id);
    if (existingUser) {
        showNotification('Email is already in use by another account', 'error');
        return;
    }

    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
        users[userIndex].name = name;
        users[userIndex].email = email;
        users[userIndex].phone = phone ? '+63' + phone.replace(/^0/, '') : null;
        users[userIndex].address = address;

        if (currentPassword && newPassword && confirmPassword) {
            if (users[userIndex].password !== btoa(currentPassword)) {
                showNotification('Current password is incorrect', 'error');
                return;
            }

            if (newPassword.length < 8) {
                showNotification('New password must be at least 8 characters', 'error');
                return;
            }

            if (newPassword !== confirmPassword) {
                showNotification('New passwords do not match', 'error');
                return;
            }

            users[userIndex].password = btoa(newPassword);
        }

        setStorage('users', users);
        currentUser = users[userIndex];
        setStorage('currentUser', currentUser);

        updateUserUI();
        closeUserProfileModal();
        showNotification('Profile updated successfully!', 'success');

        document.getElementById('profile-current-password').value = '';
        document.getElementById('profile-new-password').value = '';
        document.getElementById('profile-confirm-password').value = '';
    }
}

// --- USER ORDERS FUNCTIONS ---
function showUserOrders() {
    if (!currentUser) {
        showNotification('Please login first', 'warning');
        openAuthModal();
        return;
    }

    if (currentUser.isAdmin) {
        showNotification('Admin accounts view orders in Dashboard', 'info');
        return;
    }

    document.getElementById('user-orders-modal').classList.remove('hidden');
    filterUserOrders('all');
}

function closeUserOrdersModal() {
    document.getElementById('user-orders-modal').classList.add('hidden');
}

function filterUserOrders(status) {
    document.querySelectorAll('.user-orders-filter').forEach(btn => {
        const btnText = btn.textContent.toLowerCase().trim();
        if (btnText === status || (status === 'all' && btnText === 'all')) {
            btn.classList.add('bg-pink-600', 'text-white');
            btn.classList.remove('bg-gray-100', 'text-gray-700');
        } else {
            btn.classList.remove('bg-pink-600', 'text-white');
            btn.classList.add('bg-gray-100', 'text-gray-700');
        }
    });

    const userOrders = orders.filter(o => 
        o.userId === currentUser.id || 
        (currentUser.email && o.email === currentUser.email) || 
        (currentUser.phone && o.phone === currentUser.phone)
    );

    const filteredOrders = status === 'all' ? userOrders : userOrders.filter(o => o.status === status);
    const ordersList = document.getElementById('user-orders-list');

    if (filteredOrders.length === 0) {
        ordersList.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-shopping-bag text-5xl text-gray-300 mb-4"></i>
                <p class="text-gray-500">No orders found</p>
                <button onclick="closeUserOrdersModal(); document.getElementById('menu').scrollIntoView({behavior: 'smooth'});" class="mt-4 text-pink-600 font-medium hover:underline">
                    Start Shopping
                </button>
            </div>
        `;
        return;
    }

    ordersList.innerHTML = filteredOrders.sort((a, b) => new Date(b.createdAt || b.datetime) - new Date(a.createdAt || a.datetime)).map(order => `
        <div class="order-history-card bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition">
            <div class="flex flex-wrap justify-between items-start mb-4">
                <div>
                    <span class="text-sm text-gray-500">Order Reference</span>
                    <p class="font-mono font-bold">${escapeHtml(order.ref)}</p>
                </div>
                <span class="px-3 py-1 rounded-full text-xs font-semibold ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'out-for-delivery' ? 'bg-orange-100 text-orange-800' :
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'completed' ? 'bg-purple-100 text-purple-800' :
                    'bg-red-100 text-red-800'
                }">${escapeHtml(order.status || 'pending')}</span>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                <div>
                    <span class="text-gray-500">Date</span>
                    <p class="font-medium">${new Date(order.createdAt || order.datetime).toLocaleDateString()}</p>
                </div>
                <div>
                    <span class="text-gray-500">Items</span>
                    <p class="font-medium">${order.items} item(s)</p>
                </div>
                <div>
                    <span class="text-gray-500">Total</span>
                    <p class="font-bold text-pink-600">₱${order.total}</p>
                </div>
                <div>
                    <span class="text-gray-500">Payment</span>
                    <p class="font-medium uppercase">${escapeHtml(order.paymentMethod || 'COD')}</p>
                </div>
            </div>

            ${order.instructions ? `
                <div class="mb-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
                    <span class="font-semibold text-gray-700">Instructions:</span> ${escapeHtml(order.instructions)}
                </div>
            ` : ''}

            <button onclick="viewUserOrderDetails('${order.ref}')" class="text-pink-600 text-sm font-medium hover:underline">
                View Order Details <i class="fas fa-chevron-right ml-1 text-xs"></i>
            </button>
        </div>
    `).join('');
}

function viewUserOrderDetails(ref) {
    const order = orders.find(o => o.ref === ref);
    if (!order) return;

    let itemsHtml = (order.cart || []).map(item => `
        <div class="detail-row">
            <span class="detail-label">${escapeHtml(item.name)} x${item.quantity}</span>
            <span class="detail-value">₱${item.price * item.quantity}</span>
        </div>
    `).join('');

    const content = `
        <div class="detail-row"><span class="detail-label">Reference</span><span class="detail-value font-mono font-bold">${escapeHtml(order.ref)}</span></div>
        <div class="detail-row"><span class="detail-label">Status</span><span class="detail-value text-pink-600 font-semibold uppercase">${escapeHtml(order.status || 'pending')}</span></div>
        <div class="detail-row"><span class="detail-label">Date Placed</span><span class="detail-value">${new Date(order.createdAt || order.datetime).toLocaleString()}</span></div>
        <div class="detail-row"><span class="detail-label">Delivery Date</span><span class="detail-value">${order.datetime}</span></div>
        <div class="detail-row"><span class="detail-label">Payment Method</span><span class="detail-value uppercase font-semibold text-blue-600">${escapeHtml(order.paymentMethod || 'COD')}</span></div>
        <div class="detail-section-title">Order Items</div>
        ${itemsHtml}
        <div class="detail-row mt-2 pt-2 border-t font-bold"><span class="detail-label">Delivery Fee</span><span class="detail-value">₱50.00</span></div>
        <div class="detail-row font-bold text-base"><span class="detail-label text-gray-900">Total</span><span class="detail-value text-pink-600">₱${order.total}</span></div>
        <div class="detail-section-title">Delivery Address</div>
        <div class="p-3 bg-gray-50 rounded-lg text-sm text-gray-700">${escapeHtml(order.address)}</div>
    `;

    showDetailView('Order Details', content);
}

// --- ADMIN FUNCTIONS ---
function showAdminButton() {
    const btn = document.getElementById('admin-btn');
    if (btn) btn.classList.remove('hidden');
}

// --- FULL-SCREEN EXECUTIVE ADMIN CONTROL CENTER PORTAL ---
let currentAdminTab = 'overview';
let adminOrdersFilterState = 'all';

function openAdminDashboard() {
    if (!currentUser?.isAdmin) {
        showNotification('Admin access required', 'error');
        return;
    }

    orders = getStorage('orders', []);
    customCakes = getStorage('customCakes', DEFAULT_CUSTOM_CAKES);
    users = getStorage('users', []);
    inquiries = getStorage('inquiries', []);

    const modal = document.getElementById('admin-portal-modal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        updateAdminStats();
        switchAdminTab(currentAdminTab || 'overview');
    }
}

function closeAdminDashboard() {
    const modal = document.getElementById('admin-portal-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

function switchAdminTab(tabName) {
    currentAdminTab = tabName;

    orders = getStorage('orders', []);
    customCakes = getStorage('customCakes', DEFAULT_CUSTOM_CAKES);
    users = getStorage('users', []);
    inquiries = getStorage('inquiries', []);

    // Update active nav styling
    const navButtons = document.querySelectorAll('.admin-portal-nav button');
    navButtons.forEach(btn => {
        btn.classList.remove('active', 'bg-pink-600', 'text-white');
        btn.classList.add('text-gray-300', 'hover:bg-gray-800');
    });

    const activeBtn = document.getElementById(`admin-tab-${tabName}`);
    if (activeBtn) {
        activeBtn.classList.add('active');
        activeBtn.classList.remove('text-gray-300', 'hover:bg-gray-800');
    }

    // Hide all view panels
    const views = ['overview', 'products', 'orders', 'custom', 'users', 'inquiries', 'assets'];
    views.forEach(v => {
        const el = document.getElementById(`admin-view-${v}`);
        if (el) el.classList.add('hidden');
    });

    // Show target view panel
    const targetView = document.getElementById(`admin-view-${tabName}`);
    if (targetView) targetView.classList.remove('hidden');

    // Update Header Section Title
    const titleEl = document.getElementById('admin-portal-section-title');
    const titles = {
        overview: 'Dashboard Overview',
        products: 'Products Management',
        orders: 'Customer Orders Tracking',
        custom: 'Custom Cake Requests',
        users: 'User Account Management',
        inquiries: 'Customer Support Inquiries',
        assets: 'Asset & Image Library'
    };
    if (titleEl) titleEl.textContent = titles[tabName] || 'Admin Dashboard';

    // Render tab content
    updateAdminStats();
    if (tabName === 'overview') renderPortalOverview();
    else if (tabName === 'products') renderPortalProducts();
    else if (tabName === 'orders') filterAdminOrders(adminOrdersFilterState || 'all');
    else if (tabName === 'custom') renderPortalCustom();
    else if (tabName === 'users') renderPortalUsers();
    else if (tabName === 'inquiries') renderPortalInquiries();
    else if (tabName === 'assets') renderPortalAssets();
}

function updateAdminStats() {
    orders = getStorage('orders', []);
    customCakes = getStorage('customCakes', DEFAULT_CUSTOM_CAKES);
    users = getStorage('users', []);
    inquiries = getStorage('inquiries', []);

    const catalogRev = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const customRev = customCakes.reduce((sum, c) => sum + (c.estimatedPrice || 0), 0);
    const totalRev = catalogRev + customRev;

    const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;
    const pendingCustomCount = customCakes.filter(c => c.status === 'pending').length;
    const unreadInquiriesCount = inquiries.filter(i => !i.read).length;

    // Update Badges
    const bProducts = document.getElementById('admin-badge-products');
    const bOrders = document.getElementById('admin-badge-orders');
    const bCustom = document.getElementById('admin-badge-custom');
    const bUsers = document.getElementById('admin-badge-users');
    const bInquiries = document.getElementById('admin-badge-inquiries');

    if (bProducts) bProducts.textContent = products.length;
    if (bOrders) bOrders.textContent = orders.length;
    if (bCustom) bCustom.textContent = customCakes.length;
    if (bUsers) bUsers.textContent = users.length;
    if (bInquiries) bInquiries.textContent = inquiries.length;

    // Update Overview KPIs
    const kpiRev = document.getElementById('portal-kpi-revenue');
    const kpiOrders = document.getElementById('portal-kpi-orders');
    const kpiCustom = document.getElementById('portal-kpi-custom');
    const kpiUsers = document.getElementById('portal-kpi-users');
    const kpiPendingOrders = document.getElementById('portal-kpi-pending-orders');
    const kpiPendingCustom = document.getElementById('portal-kpi-pending-custom');

    if (kpiRev) kpiRev.textContent = `₱${totalRev.toLocaleString()}`;
    if (kpiOrders) kpiOrders.textContent = orders.length;
    if (kpiCustom) kpiCustom.textContent = customCakes.length;
    if (kpiUsers) kpiUsers.textContent = users.length;
    if (kpiPendingOrders) kpiPendingOrders.textContent = pendingOrdersCount;
    if (kpiPendingCustom) kpiPendingCustom.textContent = pendingCustomCount;
}

function renderPortalOverview() {
    // Popular Products calculation
    const itemSales = {};
    orders.forEach(order => {
        (order.cart || []).forEach(item => {
            itemSales[item.name] = (itemSales[item.name] || 0) + item.quantity;
        });
    });

    const sortedSales = Object.entries(itemSales).sort((a, b) => b[1] - a[1]).slice(0, 4);
    const popContainer = document.getElementById('portal-popular-products');
    if (popContainer) {
        if (sortedSales.length === 0) {
            popContainer.innerHTML = `<p class="text-sm text-gray-400 py-4 text-center">No sales data recorded yet</p>`;
        } else {
            const maxVal = sortedSales[0][1] || 1;
            popContainer.innerHTML = sortedSales.map(([name, count]) => `
                <div class="space-y-1">
                    <div class="flex justify-between text-xs font-semibold">
                        <span class="text-gray-700">${escapeHtml(name)}</span>
                        <span class="text-pink-600 font-bold">${count} sold</span>
                    </div>
                    <div class="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div class="bg-gradient-to-r from-pink-500 to-rose-600 h-2 rounded-full" style="width: ${(count / maxVal) * 100}%"></div>
                    </div>
                </div>
            `).join('');
        }
    }

    // Status breakdown
    const statuses = ['pending', 'processing', 'out-for-delivery', 'delivered', 'completed'];
    const statusCounts = {};
    statuses.forEach(s => statusCounts[s] = orders.filter(o => o.status === s).length);

    const breakdownContainer = document.getElementById('portal-status-breakdown');
    if (breakdownContainer) {
        breakdownContainer.innerHTML = statuses.map(s => `
            <div class="flex justify-between items-center text-xs p-2 bg-gray-50 rounded-lg">
                <span class="capitalize font-medium text-gray-600">${s.replace(/-/g, ' ')}</span>
                <span class="font-bold px-2 py-0.5 rounded-full ${
                    s === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    s === 'processing' ? 'bg-blue-100 text-blue-800' :
                    s === 'out-for-delivery' ? 'bg-orange-100 text-orange-800' :
                    s === 'delivered' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                }">${statusCounts[s]}</span>
            </div>
        `).join('');
    }

    // Recent Orders Stream
    const recentOrders = orders.slice(-5).reverse();
    const recentContainer = document.getElementById('portal-recent-orders');
    if (recentContainer) {
        if (recentOrders.length === 0) {
            recentContainer.innerHTML = `<p class="text-sm text-gray-400 py-4 text-center">No orders submitted yet</p>`;
        } else {
            recentContainer.innerHTML = recentOrders.map(o => `
                <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition cursor-pointer" onclick="viewUserOrderDetails('${o.ref}')">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-xs font-bold">
                            <i class="fas fa-shopping-bag"></i>
                        </div>
                        <div>
                            <p class="text-xs font-bold font-mono text-gray-900">${escapeHtml(o.ref)}</p>
                            <p class="text-xs text-gray-500">${escapeHtml(o.name)} • ${new Date(o.createdAt || o.datetime).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-xs font-bold text-pink-600">₱${o.total}</p>
                        <span class="text-xs px-2 py-0.5 rounded-full capitalize ${
                            o.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            o.status === 'delivered' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }">${escapeHtml(o.status || 'pending')}</span>
                    </div>
                </div>
            `).join('');
        }
    }
}

function renderPortalProducts() {
    const tbody = document.getElementById('portal-products-table-body');
    if (!tbody) return;
    tbody.innerHTML = products.map(product => `
        <tr class="border-b border-gray-100 hover:bg-gray-50/50">
            <td class="p-3 text-xs font-mono text-gray-500">#${product.id}</td>
            <td class="p-3"><img src="${product.image}" class="w-10 h-10 object-cover rounded-lg shadow-sm" alt=""></td>
            <td class="p-3 font-semibold text-xs text-gray-900">${escapeHtml(product.name)}</td>
            <td class="p-3"><span class="capitalize text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-md font-medium">${escapeHtml(product.category)}</span></td>
            <td class="p-3 font-bold text-xs text-pink-600">₱${product.price}</td>
            <td class="p-3"><span class="text-xs px-2.5 py-1 rounded-full font-semibold ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">${product.inStock ? 'In Stock' : 'Out of Stock'}</span></td>
            <td class="p-3">
                <div class="flex items-center gap-2">
                    <button onclick="editProduct(${product.id})" class="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition" title="Edit">
                        <i class="fas fa-edit text-xs"></i>
                    </button>
                    <button onclick="deleteProduct(${product.id})" class="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition" title="Delete">
                        <i class="fas fa-trash text-xs"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function safeGetTime(dateStr) {
    if (!dateStr) return 0;
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? 0 : d.getTime();
}

function safeFormatDate(dateStr) {
    if (!dateStr) return 'N/A';
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return String(dateStr);
        return d.toLocaleDateString();
    } catch (e) {
        return String(dateStr);
    }
}

function renderPortalOrdersTable(status = 'all') {
    adminOrdersFilterState = status;
    const tbody = document.getElementById('portal-orders-table-body');
    if (!tbody) return;

    let allOrders = [];
    try {
        const raw = localStorage.getItem('orders');
        allOrders = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(allOrders)) {
            allOrders = allOrders && typeof allOrders === 'object' ? Object.values(allOrders) : [];
        }
    } catch (e) {
        console.error("Error parsing orders from storage:", e);
        allOrders = [];
    }

    orders = allOrders;

    // Filter orders by status
    const filtered = status === 'all' 
        ? allOrders 
        : allOrders.filter(o => o && String(o.status || 'pending').toLowerCase() === String(status).toLowerCase());

    // Highlight active filter button
    const filterBtns = document.querySelectorAll('.admin-orders-filter');
    filterBtns.forEach(btn => {
        const btnOnClick = btn.getAttribute('onclick') || btn.outerHTML || '';
        if (btnOnClick.includes(`'${status}'`) || btnOnClick.includes(`"${status}"`)) {
            btn.className = 'admin-orders-filter active px-4 py-2 rounded-xl bg-pink-600 text-white text-sm font-medium transition';
        } else {
            btn.className = 'admin-orders-filter px-4 py-2 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm font-medium transition';
        }
    });

    if (!filtered || filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center py-8 text-xs text-gray-400 font-medium">No customer orders found in '${escapeHtml(status)}' status.</td></tr>`;
        return;
    }

    // Sort newest first
    const sorted = [...filtered].sort((a, b) => {
        const timeA = safeGetTime(a?.createdAt || a?.datetime);
        const timeB = safeGetTime(b?.createdAt || b?.datetime);
        return timeB - timeA;
    });

    tbody.innerHTML = sorted.map(order => {
        if (!order) return '';
        const ref = escapeHtml(String(order.ref || '#CKT-ORD'));
        const customerName = escapeHtml(String(order.name || order.email || 'Customer'));
        const phone = escapeHtml(String(order.phone || 'N/A'));
        const dateStr = safeFormatDate(order.createdAt || order.datetime);
        const itemCount = order.items || (order.cart ? order.cart.length : 1);
        const totalVal = typeof order.total === 'number' ? order.total : parseFloat(order.total) || 0;
        const currStatus = String(order.status || 'pending').toLowerCase();

        return `
            <tr class="border-b border-gray-100 hover:bg-gray-50/50 transition">
                <td class="p-3 font-mono font-bold text-xs text-gray-900">${ref}</td>
                <td class="p-3 text-xs">
                    <p class="font-semibold text-gray-800">${customerName}</p>
                    <p class="text-gray-400">${phone}</p>
                </td>
                <td class="p-3 text-xs text-gray-500">${dateStr}</td>
                <td class="p-3 text-xs text-gray-700 font-medium">${itemCount} item(s)</td>
                <td class="p-3 text-xs font-bold text-pink-600">₱${totalVal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                <td class="p-3">
                    <select onchange="updateOrderStatus('${ref}', this.value)" class="text-xs font-semibold px-2 py-1 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-pink-500 outline-none">
                        <option value="pending" ${currStatus === 'pending' ? 'selected' : ''}>Pending</option>
                        <option value="processing" ${currStatus === 'processing' ? 'selected' : ''}>Processing</option>
                        <option value="out-for-delivery" ${currStatus === 'out-for-delivery' ? 'selected' : ''}>Out for Delivery</option>
                        <option value="delivered" ${currStatus === 'delivered' ? 'selected' : ''}>Delivered</option>
                        <option value="completed" ${currStatus === 'completed' ? 'selected' : ''}>Completed</option>
                        <option value="cancelled" ${currStatus === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </td>
                <td class="p-3">
                    <div class="flex items-center gap-1.5">
                        <button onclick="viewUserOrderDetails('${ref}')" class="px-3 py-1 bg-pink-50 text-pink-600 hover:bg-pink-100 rounded-lg text-xs font-semibold transition">
                            Details
                        </button>
                        <button onclick="deleteOrder('${ref}')" class="p-1 text-gray-400 hover:text-red-600 text-xs transition" title="Delete Order">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

function clearAllOrders() {
    orders = getStorage('orders', []);
    if (orders.length === 0) {
        showNotification('No customer orders to clear', 'warning');
        return;
    }
    if (confirm(`Are you sure you want to delete ALL ${orders.length} order history records? This action cannot be undone.`)) {
        orders = [];
        setStorage('orders', orders);
        updateAdminStats();
        renderPortalOrdersTable(adminOrdersFilterState || 'all');
        if (typeof renderPortalOverview === 'function') renderPortalOverview();
        showNotification('All customer orders cleared successfully!', 'success');
    }
}

function deleteOrder(ref) {
    orders = getStorage('orders', []);
    if (confirm(`Are you sure you want to delete order ${ref}?`)) {
        orders = orders.filter(o => o.ref !== ref);
        setStorage('orders', orders);
        updateAdminStats();
        renderPortalOrdersTable(adminOrdersFilterState || 'all');
        if (typeof renderPortalOverview === 'function') renderPortalOverview();
        showNotification(`Order ${ref} deleted`, 'info');
    }
}

function filterAdminOrders(status = 'all') {
    renderPortalOrdersTable(status);
}

function viewUserOrderDetails(ref) {
    const order = orders.find(o => o.ref === ref);
    if (!order) {
        showNotification('Order details not found', 'error');
        return;
    }

    const modal = document.getElementById('order-details-modal');
    const content = document.getElementById('order-details-content');
    if (!modal || !content) return;

    const itemsHtml = (order.cart || []).map(item => `
        <div class="flex justify-between items-center py-2 border-b border-gray-100 text-xs">
            <div class="flex items-center gap-3">
                <img src="${item.image}" class="w-10 h-10 object-cover rounded-lg" alt="">
                <div>
                    <p class="font-bold text-gray-800">${escapeHtml(item.name)}</p>
                    <p class="text-gray-400">Qty: ${item.quantity} × ₱${item.price}</p>
                </div>
            </div>
            <p class="font-bold text-pink-600">₱${(item.price * item.quantity).toFixed(2)}</p>
        </div>
    `).join('') || '<p class="text-xs text-gray-400 py-2">Itemized details not stored</p>';

    content.innerHTML = `
        <div class="space-y-4">
            <div class="flex justify-between items-start bg-pink-50 p-4 rounded-xl border border-pink-100">
                <div>
                    <span class="text-[10px] font-bold uppercase tracking-wider text-pink-600">Order Reference</span>
                    <h3 class="text-xl font-mono font-bold text-gray-900">${escapeHtml(order.ref)}</h3>
                    <p class="text-xs text-gray-500 mt-1">Placed on: ${safeFormatDate(order.createdAt || order.datetime)}</p>
                </div>
                <span class="px-3 py-1 text-xs font-bold rounded-full uppercase ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'out-for-delivery' ? 'bg-orange-100 text-orange-800' :
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    'bg-purple-100 text-purple-800'
                }">${escapeHtml(order.status)}</span>
            </div>

            <div class="grid grid-cols-2 gap-4 text-xs">
                <div class="bg-gray-50 p-3 rounded-xl">
                    <p class="font-bold text-gray-700 mb-1"><i class="fas fa-user text-pink-600 mr-1"></i> Customer Info</p>
                    <p class="font-semibold text-gray-900">${escapeHtml(order.name)}</p>
                    <p class="text-gray-600">${escapeHtml(order.phone)}</p>
                    <p class="text-gray-500">${escapeHtml(order.email || 'N/A')}</p>
                </div>
                <div class="bg-gray-50 p-3 rounded-xl">
                    <p class="font-bold text-gray-700 mb-1"><i class="fas fa-truck text-pink-600 mr-1"></i> Delivery & Payment</p>
                    <p class="text-gray-700"><strong>Address:</strong> ${escapeHtml(order.address)}</p>
                    <p class="text-gray-700"><strong>Method:</strong> ${escapeHtml((order.paymentMethod || 'cod').toUpperCase())}</p>
                    <p class="text-gray-700"><strong>Delivery Fee:</strong> ₱${(order.deliveryFee || 50).toFixed(2)}</p>
                </div>
            </div>

            ${order.instructions ? `
                <div class="bg-amber-50 p-3 rounded-xl text-xs text-amber-900 border border-amber-200">
                    <strong>Special Instructions:</strong> ${escapeHtml(order.instructions)}
                </div>
            ` : ''}

            <div>
                <h4 class="font-bold text-gray-800 text-xs uppercase tracking-wider mb-2">Order Items</h4>
                <div class="max-h-48 overflow-y-auto pr-1">
                    ${itemsHtml}
                </div>
            </div>

            <div class="flex justify-between items-center pt-3 border-t border-gray-200 text-sm font-bold">
                <span>Grand Total</span>
                <span class="text-xl text-pink-600">₱${(order.total || 0).toFixed(2)}</span>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
}

function closeOrderDetailsModal() {
    const modal = document.getElementById('order-details-modal');
    if (modal) modal.classList.add('hidden');
}

function renderPortalCustom() {
    const tbody = document.getElementById('portal-custom-table-body');
    if (!tbody) return;

    if (customCakes.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center py-8 text-xs text-gray-400">No custom cake requests found</td></tr>`;
        return;
    }

    tbody.innerHTML = customCakes.map(cake => `
        <tr class="border-b border-gray-100 hover:bg-gray-50/50">
            <td class="p-3 font-mono font-bold text-xs text-gray-900">${escapeHtml(cake.ref || '#CUST-' + cake.id)}</td>
            <td class="p-3 text-xs font-semibold text-gray-800">${escapeHtml(cake.name || 'Customer')}</td>
            <td class="p-3 text-xs capitalize text-gray-600">${escapeHtml(cake.type || 'Custom')}</td>
            <td class="p-3 text-xs text-gray-700">${escapeHtml(cake.occasion || 'General')}</td>
            <td class="p-3 text-xs text-gray-500">${escapeHtml(cake.date || 'TBD')}</td>
            <td class="p-3">
                <select onchange="updateCustomCakeStatus(${cake.id}, this.value)" class="text-xs font-semibold px-2 py-1 rounded-lg border border-gray-200 bg-white">
                    <option value="pending" ${cake.status === 'pending' ? 'selected' : ''}>Pending Quote</option>
                    <option value="approved" ${cake.status === 'approved' ? 'selected' : ''}>Approved</option>
                    <option value="in-progress" ${cake.status === 'in-progress' ? 'selected' : ''}>In Progress</option>
                    <option value="ready" ${cake.status === 'ready' ? 'selected' : ''}>Ready for Pickup/Delivery</option>
                    <option value="completed" ${cake.status === 'completed' ? 'selected' : ''}>Completed</option>
                </select>
            </td>
            <td class="p-3">
                <button onclick="viewCustomCakeDetails(${cake.id})" class="px-3 py-1 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 rounded-lg text-xs font-semibold transition">
                    View
                </button>
            </td>
        </tr>
    `).join('');
}

function updateOrderStatus(ref, newStatus) {
    orders = getStorage('orders', []);
    const order = orders.find(o => o.ref === ref);
    if (order) {
        order.status = newStatus;
        setStorage('orders', orders);
        updateAdminStats();
        renderPortalOrdersTable(adminOrdersFilterState || 'all');
        showNotification(`Order ${ref} status updated to ${newStatus}`, 'success');
    }
}

function updateCustomCakeStatus(id, newStatus) {
    const cake = customCakes.find(c => c.id === id);
    if (cake) {
        cake.status = newStatus;
        setStorage('customCakes', customCakes);
        renderCustomCakesGallery();
        updateAdminStats();
        showNotification(`Custom cake request status updated to ${newStatus}`, 'success');
    }
}

function viewCustomCakeDetails(id) {
    const cake = customCakes.find(c => c.id === id);
    if (cake && cake.ref) {
        viewCustomOrderDetails(cake.ref);
    } else if (cake) {
        editCustomOrder(id);
    }
}

function renderPortalUsers() {
    const tbody = document.getElementById('portal-users-table-body');
    if (!tbody) return;

    if (users.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center py-8 text-xs text-gray-400">No registered customer accounts found</td></tr>`;
        return;
    }

    tbody.innerHTML = users.map(u => `
        <tr class="border-b border-gray-100 hover:bg-gray-50/50">
            <td class="p-3 text-xs font-mono text-gray-500">#${u.id}</td>
            <td class="p-3 text-xs font-semibold text-gray-900">${escapeHtml(u.name || 'User')}</td>
            <td class="p-3 text-xs text-gray-600">${escapeHtml(u.email || 'N/A')}</td>
            <td class="p-3 text-xs text-gray-600">${escapeHtml(u.phone || 'N/A')}</td>
            <td class="p-3 text-xs uppercase font-mono text-gray-500">${escapeHtml(u.loginMethod || 'email')}</td>
            <td class="p-3 text-xs text-gray-400">${new Date(u.createdAt || Date.now()).toLocaleDateString()}</td>
            <td class="p-3">
                <div class="flex items-center gap-2">
                    <span class="text-xs px-2.5 py-1 rounded-full font-bold ${u.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600'}">
                        ${u.isAdmin ? 'Admin' : 'Customer'}
                    </span>
                    <button onclick="editUser(${u.id})" class="text-blue-600 hover:text-blue-800 p-1 text-xs font-bold" title="Edit Customer Account">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button onclick="deleteUser(${u.id})" class="text-red-500 hover:text-red-700 p-1 text-xs" title="Delete User">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function renderPortalInquiries() {
    const container = document.getElementById('portal-inquiries-list');
    if (!container) return;

    if (inquiries.length === 0) {
        container.innerHTML = `<div class="bg-white p-8 rounded-2xl border border-gray-200 text-center text-gray-400 text-xs">No customer inquiries submitted yet</div>`;
        return;
    }

    container.innerHTML = inquiries.map(iq => `
        <div class="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-2">
            <div class="flex justify-between items-start">
                <div>
                    <h4 class="font-bold text-gray-900 text-sm">${escapeHtml(iq.name)}</h4>
                    <p class="text-xs text-gray-500">${escapeHtml(iq.email)} • ${escapeHtml(iq.phone || 'No phone')}</p>
                </div>
                <div class="flex items-center gap-2">
                    <span class="text-xs text-gray-400">${new Date(iq.submittedAt).toLocaleDateString()}</span>
                    <button onclick="deleteInquiry(${iq.id})" class="text-red-500 hover:text-red-700 text-xs p-1" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="p-3 bg-gray-50 rounded-xl text-xs text-gray-700 leading-relaxed">
                <p class="font-bold text-gray-900 mb-1">Subject: ${escapeHtml(iq.subject)}</p>
                ${escapeHtml(iq.message)}
            </div>
        </div>
    `).join('');
}

function renderPortalAssets() {
    const grid = document.getElementById('portal-assets-grid');
    if (!grid) return;
    grid.innerHTML = assets.map((url, index) => `
        <div class="asset-card relative bg-white p-2 rounded-xl border border-gray-200 shadow-sm group">
            <img src="${url}" class="w-full h-32 object-cover rounded-lg" alt="Asset ${index}">
            <div class="mt-2 flex items-center justify-between gap-1">
                <button onclick="copyAssetUrl('${url}')" class="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition flex-1 truncate">
                    Copy URL
                </button>
                <button onclick="deleteAsset(${index})" class="text-xs bg-red-50 hover:bg-red-100 text-red-600 p-1.5 rounded transition">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// --- ADMIN PRODUCT MANAGEMENT ---
function showManageProducts() {
    if (!currentUser?.isAdmin) return;
    closeAdminDashboard();
    document.getElementById('admin-products-modal').classList.remove('hidden');
    renderProductsTable();
}

function closeAdminProductsModal() {
    document.getElementById('admin-products-modal').classList.add('hidden');
}

function renderProductsTable() {
    const tbody = document.getElementById('products-table-body');
    tbody.innerHTML = products.map(product => `
        <tr>
            <td>${product.id}</td>
            <td><img src="${product.image}" class="w-12 h-12 object-cover rounded-lg" alt=""></td>
            <td>${escapeHtml(product.name)}</td>
            <td><span class="capitalize">${escapeHtml(product.category)}</span></td>
            <td class="font-bold text-pink-600">₱${product.price}</td>
            <td><span class="status-badge ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">${product.inStock ? 'In Stock' : 'Out of Stock'}</span></td>
            <td>
                <div class="flex gap-2">
                    <button onclick="editProduct(${product.id})" class="text-blue-600 hover:text-blue-800" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteProduct(${product.id})" class="text-red-600 hover:text-red-800" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function showAddProductForm() {
    document.getElementById('product-form-title').textContent = 'Add Product';
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = '';
    document.getElementById('product-instock').checked = true;
    document.getElementById('product-form-modal').classList.remove('hidden');
}

function editProduct(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    document.getElementById('product-form-title').textContent = 'Edit Product';
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-image').value = product.image;
    document.getElementById('product-description').value = product.description;
    document.getElementById('product-badge').value = product.badge || '';
    document.getElementById('product-instock').checked = product.inStock;

    document.getElementById('product-form-modal').classList.remove('hidden');
}

function closeProductFormModal() {
    document.getElementById('product-form-modal').classList.add('hidden');
}

function saveProduct(e) {
    e.preventDefault();

    const id = document.getElementById('product-id').value;
    const productData = {
        name: document.getElementById('product-name').value.trim(),
        category: document.getElementById('product-category').value,
        price: parseFloat(document.getElementById('product-price').value),
        image: document.getElementById('product-image').value.trim(),
        description: document.getElementById('product-description').value.trim(),
        badge: document.getElementById('product-badge').value.trim() || null,
        inStock: document.getElementById('product-instock').checked
    };

    if (id) {
        const index = products.findIndex(p => p.id === parseInt(id));
        if (index !== -1) {
            products[index] = { ...products[index], ...productData };
            showNotification('Product updated successfully', 'success');
        }
    } else {
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push({ id: newId, ...productData });
        showNotification('Product added successfully', 'success');
    }

    setStorage('products', products);

    if (productData.image && !assets.includes(productData.image)) {
        assets.push(productData.image);
        setStorage('assets', assets);
    }

    renderProductsTable();
    filterCategory('all');
    closeProductFormModal();
    updateAdminStats();
}

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== id);
        setStorage('products', products);
        renderProductsTable();
        filterCategory('all');
        showNotification('Product deleted successfully', 'success');
        updateAdminStats();
    }
}

// --- ADMIN ORDERS MANAGEMENT ---
function showManageOrders() {
    if (!currentUser?.isAdmin) return;
    closeAdminDashboard();
    document.getElementById('admin-orders-modal').classList.remove('hidden');
    filterAdminOrders('all');
}

function closeAdminOrdersModal() {
    document.getElementById('admin-orders-modal').classList.add('hidden');
}

function filterAdminOrders(status) {
    document.querySelectorAll('.admin-orders-filter').forEach(btn => {
        const btnText = btn.textContent.toLowerCase().trim();
        if (btnText === status || (status === 'all' && btnText === 'all')) {
            btn.classList.add('bg-pink-600', 'text-white');
            btn.classList.remove('bg-gray-100', 'text-gray-700');
        } else {
            btn.classList.remove('bg-pink-600', 'text-white');
            btn.classList.add('bg-gray-100', 'text-gray-700');
        }
    });

    renderAdminOrdersTable(status);
}

function renderAdminOrdersTable(status) {
    const filteredOrders = status === 'all' ? orders : orders.filter(o => o.status === status);
    const tbody = document.getElementById('admin-orders-table-body');

    if (filteredOrders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-8 text-gray-500">
                    <i class="fas fa-box-open text-4xl mb-2"></i>
                    <p>No orders found</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filteredOrders.map(order => `
        <tr>
            <td><span class="font-mono font-bold">${escapeHtml(order.ref)}</span></td>
            <td>${escapeHtml(order.name)}</td>
            <td>${new Date(order.createdAt || order.datetime).toLocaleDateString()}</td>
            <td>${order.items}</td>
            <td class="font-bold text-pink-600">₱${order.total}</td>
            <td>
                <span class="status-badge ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'out-for-delivery' ? 'bg-orange-100 text-orange-800' :
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'completed' ? 'bg-purple-100 text-purple-800' :
                    'bg-red-100 text-red-800'
                }">${escapeHtml(order.status || 'pending')}</span>
            </td>
            <td>
                <div class="flex gap-2">
                    <button onclick="editOrder('${order.ref}')" class="text-blue-600 hover:text-blue-800" title="Edit Order">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteOrder('${order.ref}')" class="text-red-600 hover:text-red-800" title="Delete Order">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function editOrder(ref) {
    const order = orders.find(o => o.ref === ref);
    if (!order) return;

    document.getElementById('edit-order-ref').value = order.ref;
    document.getElementById('edit-order-name').value = order.name;
    document.getElementById('edit-order-phone').value = order.phone;
    document.getElementById('edit-order-address').value = order.address;
    document.getElementById('edit-order-datetime').value = order.datetime;
    document.getElementById('edit-order-status').value = order.status || 'pending';
    document.getElementById('edit-order-instructions').value = order.instructions || '';

    const itemsContainer = document.getElementById('edit-order-items');
    if (order.cart && order.cart.length > 0) {
        itemsContainer.innerHTML = order.cart.map(item => `
            <div class="flex justify-between items-center p-2 bg-white rounded-lg border border-gray-200">
                <div class="flex items-center gap-3">
                    <img src="${item.image}" class="w-10 h-10 object-cover rounded-lg" alt="">
                    <span class="font-medium">${escapeHtml(item.name)}</span>
                </div>
                <div class="flex items-center gap-4">
                    <span>₱${item.price} x ${item.quantity}</span>
                    <span class="font-bold">₱${item.price * item.quantity}</span>
                </div>
            </div>
        `).join('');
    } else {
        itemsContainer.innerHTML = '<p class="text-gray-500 text-center py-2">No items found</p>';
    }

    closeAdminOrdersModal();
    document.getElementById('edit-order-modal').classList.remove('hidden');
}

function closeEditOrderModal() {
    document.getElementById('edit-order-modal').classList.add('hidden');
    document.getElementById('admin-orders-modal').classList.remove('hidden');
}

function saveOrderChanges(e) {
    e.preventDefault();

    const ref = document.getElementById('edit-order-ref').value;
    const orderIndex = orders.findIndex(o => o.ref === ref);

    if (orderIndex === -1) return;

    orders[orderIndex] = {
        ...orders[orderIndex],
        name: document.getElementById('edit-order-name').value,
        phone: document.getElementById('edit-order-phone').value,
        address: document.getElementById('edit-order-address').value,
        datetime: document.getElementById('edit-order-datetime').value,
        status: document.getElementById('edit-order-status').value,
        instructions: document.getElementById('edit-order-instructions').value
    };

    setStorage('orders', orders);

    closeEditOrderModal();
    filterAdminOrders('all');
    updateAdminStats();
    showNotification('Order updated successfully', 'success');
}

function deleteOrder(ref) {
    if (confirm('Are you sure you want to delete this order?')) {
        orders = orders.filter(o => o.ref !== ref);
        setStorage('orders', orders);
        filterAdminOrders('all');
        updateAdminStats();
        showNotification('Order deleted successfully', 'success');
    }
}

// --- ADMIN CUSTOM ORDERS MANAGEMENT ---
function showManageCustomOrders() {
    if (!currentUser?.isAdmin) return;
    closeAdminDashboard();
    document.getElementById('admin-custom-orders-modal').classList.remove('hidden');
    renderAdminCustomOrdersTable();
}

function closeAdminCustomOrdersModal() {
    document.getElementById('admin-custom-orders-modal').classList.add('hidden');
}

function renderAdminCustomOrdersTable() {
    const tbody = document.getElementById('admin-custom-orders-table-body');

    if (customCakes.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-8 text-gray-500">
                    <i class="fas fa-birthday-cake text-4xl mb-2"></i>
                    <p>No custom cake requests</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = customCakes.map(cake => `
        <tr>
            <td><span class="font-mono font-bold">${escapeHtml(cake.ref || 'CUST-' + cake.id)}</span></td>
            <td>${escapeHtml(cake.name)}</td>
            <td><span class="capitalize">${escapeHtml(cake.type)}</span></td>
            <td>${escapeHtml(cake.occasion)}</td>
            <td>${cake.preferredDate || cake.date}</td>
            <td>
                <span class="status-badge ${
                    cake.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    cake.status === 'approved' ? 'bg-green-100 text-green-800' :
                    cake.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    cake.status === 'ready-for-pickup' ? 'bg-purple-100 text-purple-800' :
                    cake.status === 'completed' ? 'bg-indigo-100 text-indigo-800' :
                    'bg-red-100 text-red-800'
                }">${escapeHtml(cake.status)}</span>
            </td>
            <td>
                <div class="flex gap-2">
                    <button onclick="editCustomOrder(${cake.id})" class="text-blue-600 hover:text-blue-800" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteCustomOrder(${cake.id})" class="text-red-600 hover:text-red-800" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function editCustomOrder(id) {
    const cake = customCakes.find(c => c.id === id);
    if (!cake) return;

    document.getElementById('edit-custom-order-id').value = cake.id;
    document.getElementById('edit-custom-name').value = cake.name;
    document.getElementById('edit-custom-phone').value = cake.phone;
    document.getElementById('edit-custom-email').value = cake.email || '';
    document.getElementById('edit-custom-type').value = cake.type;
    document.getElementById('edit-custom-occasion').value = cake.occasion;
    document.getElementById('edit-custom-flavor').value = cake.flavor;
    document.getElementById('edit-custom-size').value = cake.size;
    document.getElementById('edit-custom-date').value = cake.preferredDate || cake.date;
    document.getElementById('edit-custom-description').value = cake.description;
    document.getElementById('edit-custom-status').value = cake.status || 'pending';
    document.getElementById('edit-custom-notes').value = cake.adminNotes || '';
    document.getElementById('edit-custom-price').value = cake.estimatedPrice || '';

    const imgPreview = document.getElementById('edit-custom-image');
    const imgContainer = document.getElementById('edit-custom-image-preview');
    const imgName = document.getElementById('edit-custom-image-name');

    if (cake.image && imgPreview && imgContainer) {
        imgPreview.src = cake.image;
        imgContainer.classList.add('has-image');
        if (imgName) imgName.textContent = 'Reference image provided';
    } else if (imgContainer) {
        imgContainer.classList.remove('has-image');
        if (imgName) imgName.textContent = '';
    }

    closeAdminCustomOrdersModal();
    document.getElementById('edit-custom-order-modal').classList.remove('hidden');
}

function closeEditCustomOrderModal() {
    document.getElementById('edit-custom-order-modal').classList.add('hidden');
    document.getElementById('admin-custom-orders-modal').classList.remove('hidden');
}

function saveCustomOrderChanges(e) {
    e.preventDefault();

    const id = parseInt(document.getElementById('edit-custom-order-id').value);
    const cakeIndex = customCakes.findIndex(c => c.id === id);

    if (cakeIndex === -1) return;

    customCakes[cakeIndex] = {
        ...customCakes[cakeIndex],
        name: document.getElementById('edit-custom-name').value,
        phone: document.getElementById('edit-custom-phone').value,
        email: document.getElementById('edit-custom-email').value,
        type: document.getElementById('edit-custom-type').value,
        occasion: document.getElementById('edit-custom-occasion').value,
        flavor: document.getElementById('edit-custom-flavor').value,
        size: document.getElementById('edit-custom-size').value,
        preferredDate: document.getElementById('edit-custom-date').value,
        description: document.getElementById('edit-custom-description').value,
        status: document.getElementById('edit-custom-status').value,
        adminNotes: document.getElementById('edit-custom-notes').value,
        estimatedPrice: document.getElementById('edit-custom-price').value ? 
            parseFloat(document.getElementById('edit-custom-price').value) : null,
        updatedAt: new Date().toISOString()
    };

    setStorage('customCakes', customCakes);

    renderCustomCakesGallery();
    closeEditCustomOrderModal();
    renderAdminCustomOrdersTable();
    updateAdminStats();
    showNotification('Custom order updated successfully', 'success');
}

function deleteCustomOrder(id) {
    if (confirm('Are you sure you want to delete this custom cake request?')) {
        customCakes = customCakes.filter(c => c.id !== id);
        setStorage('customCakes', customCakes);
        renderAdminCustomOrdersTable();
        renderCustomCakesGallery();
        updateAdminStats();
        showNotification('Custom order deleted successfully', 'success');
    }
}

// --- ADMIN USERS MANAGEMENT ---
function showManageUsers() {
    if (!currentUser?.isAdmin) return;
    closeAdminDashboard();
    document.getElementById('admin-users-modal').classList.remove('hidden');
    renderUsersTable();
}

function closeAdminUsersModal() {
    document.getElementById('admin-users-modal').classList.add('hidden');
}

function renderUsersTable() {
    const tbody = document.getElementById('users-table-body');

    if (users.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-8 text-gray-500">
                    <i class="fas fa-users text-4xl mb-2"></i>
                    <p>No registered users found</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.id}</td>
            <td>${escapeHtml(user.name || 'N/A')}</td>
            <td>${escapeHtml(user.email || 'N/A')}</td>
            <td>${escapeHtml(user.phone || 'N/A')}</td>
            <td><span class="uppercase text-xs px-2 py-1 bg-gray-100 rounded font-semibold">${escapeHtml(user.loginMethod || 'email')}</span></td>
            <td>${user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</td>
            <td>
                <div class="flex gap-2">
                    <button onclick="editUser(${user.id})" class="text-blue-600 hover:text-blue-800" title="Edit Account">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="toggleUserAdmin(${user.id})" class="text-${user.isAdmin ? 'red' : 'green'}-600 hover:text-${user.isAdmin ? 'red' : 'green'}-800" title="${user.isAdmin ? 'Revoke Admin' : 'Grant Admin'}">
                        <i class="fas fa-${user.isAdmin ? 'user-minus' : 'user-plus'}"></i>
                    </button>
                    <button onclick="deleteUser(${user.id})" class="text-red-600 hover:text-red-800" title="Delete User">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function deleteUser(userId) {
    if (userId === 0) {
        showNotification('Cannot delete main admin account', 'error');
        return;
    }

    const user = users.find(u => u.id === userId);
    if (!user) return;

    if (confirm(`Are you sure you want to delete user ${user.name || user.email || user.phone}?`)) {
        users = users.filter(u => u.id !== userId);
        setStorage('users', users);

        if (currentUser && currentUser.id === userId) {
            currentUser = null;
            localStorage.removeItem('currentUser');
            updateUserUI();
        }

        renderUsersTable();
        updateAdminStats();
        showNotification('User deleted successfully', 'success');
    }
}

function toggleUserAdmin(userId) {
    if (userId === 0) {
        showNotification('Cannot modify main admin account', 'error');
        return;
    }

    const user = users.find(u => u.id === userId);
    if (user) {
        user.isAdmin = !user.isAdmin;
        setStorage('users', users);
        renderUsersTable();
        renderPortalUsers();
        showNotification(`Updated admin privileges for ${user.email}`, 'success');
    }
}

function clearAllCustomerAccounts() {
    const customerCount = users.filter(u => !u.isAdmin).length;
    if (customerCount === 0) {
        showNotification('No customer accounts to clear', 'warning');
        return;
    }
    if (confirm(`Are you sure you want to delete ALL ${customerCount} customer accounts? This cannot be undone.`)) {
        users = users.filter(u => u.isAdmin);
        setStorage('users', users);
        
        if (currentUser && !currentUser.isAdmin) {
            currentUser = null;
            localStorage.removeItem('currentUser');
            updateUserUI();
        }
        
        renderUsersTable();
        renderPortalUsers();
        updateAdminStats();
        showNotification(`${customerCount} customer account(s) cleared successfully`, 'success');
    }
}

function editUser(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    document.getElementById('edit-user-id').value = userId;
    document.getElementById('edit-user-name').value = user.name || '';
    document.getElementById('edit-user-email').value = user.email || '';
    document.getElementById('edit-user-phone').value = user.phone || '';
    document.getElementById('edit-user-role').value = user.isAdmin ? 'admin' : 'customer';

    document.getElementById('edit-user-modal').classList.remove('hidden');
}

function closeEditUserModal() {
    document.getElementById('edit-user-modal').classList.add('hidden');
}

function saveUserChanges(e) {
    e.preventDefault();

    const userId = parseInt(document.getElementById('edit-user-id').value);
    const user = users.find(u => u.id === userId);
    if (!user) return;

    if (userId === 0) {
        showNotification('Cannot modify the main admin account from here', 'error');
        return;
    }

    user.name = document.getElementById('edit-user-name').value.trim();
    user.email = document.getElementById('edit-user-email').value.trim();
    user.phone = document.getElementById('edit-user-phone').value.trim();
    user.isAdmin = document.getElementById('edit-user-role').value === 'admin';

    setStorage('users', users);

    if (currentUser && currentUser.id === userId) {
        currentUser.name = user.name;
        currentUser.email = user.email;
        currentUser.phone = user.phone;
        currentUser.isAdmin = user.isAdmin;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateUserUI();
    }

    renderUsersTable();
    renderPortalUsers();
    updateAdminStats();
    closeEditUserModal();
    showNotification(`Account for "${user.name || user.email}" updated successfully`, 'success');
}

// --- ADMIN INQUIRIES MANAGEMENT ---
function showManageInquiries() {
    if (!currentUser?.isAdmin) return;
    closeAdminDashboard();
    document.getElementById('admin-inquiries-modal').classList.remove('hidden');
    renderAdminInquiries();
}

function closeAdminInquiriesModal() {
    document.getElementById('admin-inquiries-modal').classList.add('hidden');
}

function renderAdminInquiries() {
    const list = document.getElementById('admin-inquiries-list');
    if (!list) return;

    if (inquiries.length === 0) {
        list.innerHTML = `
            <div class="text-center text-gray-400 py-12">
                <i class="fas fa-envelope-open text-5xl mb-3"></i>
                <p>No customer inquiries yet.</p>
            </div>
        `;
        return;
    }

    list.innerHTML = inquiries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(inq => `
        <div class="inquiry-card bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div class="flex justify-between items-start mb-2">
                <div>
                    <h4 class="font-bold text-gray-800">${escapeHtml(inq.name)}</h4>
                    <p class="text-xs text-gray-500">${escapeHtml(inq.email)} • ${escapeHtml(inq.phone || 'No phone')}</p>
                </div>
                <div class="flex items-center gap-2">
                    <span class="text-xs text-gray-400">${new Date(inq.createdAt).toLocaleString()}</span>
                    <button onclick="deleteInquiry(${inq.id})" class="text-red-500 hover:text-red-700 p-1" title="Delete inquiry">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="mt-2">
                <span class="text-xs font-semibold px-2 py-1 bg-pink-50 text-pink-700 rounded-full">${escapeHtml(inq.subject)}</span>
            </div>
            <p class="text-sm text-gray-700 mt-3 p-3 bg-gray-50 rounded-lg">${escapeHtml(inq.message)}</p>
        </div>
    `).join('');
}

function deleteInquiry(id) {
    if (confirm('Delete this inquiry?')) {
        inquiries = inquiries.filter(i => i.id !== id);
        setStorage('inquiries', inquiries);
        renderAdminInquiries();
        showNotification('Inquiry deleted', 'info');
    }
}

// --- ADMIN ASSET LIBRARY MANAGEMENT ---
function showAssetLibrary() {
    if (!currentUser?.isAdmin) return;
    closeAdminDashboard();
    document.getElementById('admin-assets-modal').classList.remove('hidden');
    renderAssetLibrary();
}

function closeAssetLibraryModal() {
    document.getElementById('admin-assets-modal').classList.add('hidden');
}

function renderAssetLibrary() {
    const grid = document.getElementById('asset-library-grid');
    if (!grid) return;

    if (assets.length === 0) {
        grid.innerHTML = '<p class="text-gray-400 text-center col-span-full py-8">No assets stored.</p>';
        return;
    }

    grid.innerHTML = assets.map((url, idx) => `
        <div class="asset-card">
            <img src="${url}" alt="Asset ${idx + 1}" loading="lazy">
            <div class="asset-actions">
                <button onclick="copyAssetUrl('${url}')" title="Copy URL"><i class="fas fa-copy"></i></button>
                <button onclick="deleteAsset(${idx})" class="delete-asset" title="Delete Asset"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');
}

function handleAssetUpload(input) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        if (file.size > 5 * 1024 * 1024) {
            showNotification('Image file size limit is 5MB', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            assets.unshift(e.target.result);
            setStorage('assets', assets);
            renderAssetLibrary();
            showNotification('Asset uploaded to library!', 'success');
        };
        reader.readAsDataURL(file);
    }
}

function copyAssetUrl(url) {
    navigator.clipboard.writeText(url).then(() => {
        showNotification('Asset URL copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Failed to copy URL', 'error');
    });
}

function deleteAsset(idx) {
    if (confirm('Delete this asset from library?')) {
        assets.splice(idx, 1);
        setStorage('assets', assets);
        renderAssetLibrary();
        showNotification('Asset removed', 'info');
    }
}

// --- CONTACT FORM SUBMISSION ---
function handleContactSubmit(e) {
    e.preventDefault();

    const firstName = document.getElementById('contact-firstname').value.trim();
    const lastName = document.getElementById('contact-lastname').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const phone = document.getElementById('contact-phone').value.trim();
    const subject = document.getElementById('contact-subject').value;
    const message = document.getElementById('contact-message').value.trim();

    if (!firstName || !lastName || !email || !message) {
        showNotification('Please complete all required fields', 'error');
        return;
    }

    if (!validateEmail(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    const newInquiry = {
        id: Date.now(),
        name: `${firstName} ${lastName}`,
        email: email,
        phone: phone,
        subject: subject,
        message: message,
        createdAt: new Date().toISOString()
    };

    inquiries.push(newInquiry);
    setStorage('inquiries', inquiries);

    document.getElementById('contact-form').reset();
    document.getElementById('contact-success-modal').classList.remove('hidden');
    showNotification('Message sent successfully!', 'success');
}

function closeContactSuccessModal() {
    document.getElementById('contact-success-modal').classList.add('hidden');
}

// --- ANALYTICS ---
function showAnalytics() {
    if (!currentUser?.isAdmin) return;
    closeAdminDashboard();
    document.getElementById('analytics-modal').classList.remove('hidden');
    updateAnalytics();
}

function closeAnalyticsModal() {
    document.getElementById('analytics-modal').classList.add('hidden');
}

function updateAnalytics() {
    const range = document.getElementById('analytics-range').value;
    let filteredOrders = orders;
    let filteredCustomCakes = customCakes;

    if (range !== 'all') {
        const now = new Date();
        const startDate = new Date();

        switch(range) {
            case 'today':
                startDate.setHours(0, 0, 0, 0);
                break;
            case 'week':
                startDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(now.getMonth() - 1);
                break;
            case 'year':
                startDate.setFullYear(now.getFullYear() - 1);
                break;
        }

        filteredOrders = orders.filter(o => new Date(o.createdAt || o.datetime) >= startDate);
        filteredCustomCakes = customCakes.filter(c => new Date(c.createdAt || c.date) >= startDate);
    }

    const catalogRevenue = filteredOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const customRevenue = filteredCustomCakes.reduce((sum, c) => sum + (c.estimatedPrice || 0), 0);
    const totalRevenue = catalogRevenue + customRevenue;

    const totalOrders = filteredOrders.length;
    const avgOrderValue = totalOrders > 0 ? catalogRevenue / totalOrders : 0;

    const totalCustom = filteredCustomCakes.length;
    const pendingCustom = filteredCustomCakes.filter(c => c.status === 'pending').length;

    document.getElementById('analytics-revenue').textContent = `₱${totalRevenue.toLocaleString()}`;
    document.getElementById('analytics-orders').textContent = totalOrders;
    document.getElementById('analytics-avg').textContent = `₱${avgOrderValue.toFixed(2)}`;
    document.getElementById('analytics-custom').textContent = totalCustom;
    document.getElementById('analytics-pending-custom').textContent = pendingCustom;

    const productCounts = {};
    filteredOrders.forEach(order => {
        if (order.cart) {
            order.cart.forEach(item => {
                productCounts[item.name] = (productCounts[item.name] || 0) + item.quantity;
            });
        }
    });

    const popularProducts = Object.entries(productCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const popularProductsDiv = document.getElementById('popular-products');
    if (popularProducts.length === 0) {
        popularProductsDiv.innerHTML = '<p class="text-gray-500 text-center py-4">No sales data available</p>';
    } else {
        popularProductsDiv.innerHTML = popularProducts.map(([name, count]) => `
            <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span class="font-medium">${escapeHtml(name)}</span>
                <span class="text-pink-600 font-bold">${count} sold</span>
            </div>
        `).join('');
    }

    const statusCounts = {
        pending: filteredOrders.filter(o => o.status === 'pending' || !o.status).length,
        processing: filteredOrders.filter(o => o.status === 'processing').length,
        'out-for-delivery': filteredOrders.filter(o => o.status === 'out-for-delivery').length,
        delivered: filteredOrders.filter(o => o.status === 'delivered').length,
        completed: filteredOrders.filter(o => o.status === 'completed').length,
        cancelled: filteredOrders.filter(o => o.status === 'cancelled').length
    };

    const statusBreakdown = document.getElementById('status-breakdown');
    statusBreakdown.innerHTML = Object.entries(statusCounts).map(([status, count]) => `
        <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span class="capitalize text-sm font-medium text-gray-700">${status.replace(/-/g, ' ')}</span>
            <span class="font-bold text-gray-900">${count}</span>
        </div>
    `).join('');
}

// --- STOREFRONT PRODUCTS (SEARCH & SORTING ENHANCED) ---
let currentCategoryState = 'all';

function renderProducts(category) {
    if (category) currentCategoryState = category;
    const grid = document.getElementById('products-grid');
    if (!grid) return;

    const query = (document.getElementById('product-search-input')?.value || '').toLowerCase().trim();
    const sortVal = document.getElementById('product-sort-select')?.value || 'featured';

    let filtered = currentCategoryState === 'all' ? [...products] : products.filter(p => p.category === currentCategoryState);

    if (query) {
        filtered = filtered.filter(p => p.name.toLowerCase().includes(query) || (p.description || '').toLowerCase().includes(query));
    }

    if (sortVal === 'price-asc') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sortVal === 'price-desc') {
        filtered.sort((a, b) => b.price - a.price);
    } else if (sortVal === 'name-asc') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full text-center py-12 text-gray-400">
                <i class="fas fa-cookie text-5xl mb-3"></i>
                <p>No products found matching your search.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = '';
    filtered.forEach(product => {
        const isWishlisted = wishlist.some(item => item.id === product.id);
        const card = document.createElement('div');
        card.className = 'cake-card bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col justify-between';
        card.innerHTML = `
            <div>
                <div class="relative h-64 overflow-hidden group cursor-pointer" onclick="openQuickView(${product.id})">
                    <img src="${product.image}" alt="${escapeHtml(product.name)}" loading="lazy" decoding="async" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                    ${product.badge ? `<span class="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-pink-600 shadow-sm">${escapeHtml(product.badge)}</span>` : ''}
                    <button onclick="event.stopPropagation(); toggleWishlist(${product.id})" class="absolute top-4 right-4 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full shadow-md flex items-center justify-center transition hover:scale-110 ${isWishlisted ? 'text-pink-600' : 'text-gray-400 hover:text-pink-500'}">
                        <i class="${isWishlisted ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                    ${!product.inStock ? '<span class="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold">Out of Stock</span>' : ''}
                    <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <span class="px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-900 rounded-full text-xs font-bold shadow-md"><i class="fas fa-eye mr-1"></i> Quick View</span>
                    </div>
                </div>
                <div class="p-6 pb-2">
                    <div class="flex justify-between items-start mb-1">
                        <h3 class="text-xl font-bold text-gray-800 hover:text-pink-600 transition cursor-pointer" onclick="openQuickView(${product.id})">${escapeHtml(product.name)}</h3>
                        <span class="text-lg font-bold text-pink-600">₱${product.price}</span>
                    </div>
                    <div class="flex items-center gap-1 text-xs text-amber-500 mb-2">
                        <i class="fas fa-star"></i>
                        <span class="font-bold text-gray-800">${product.rating || 4.9}</span>
                        <span class="text-gray-400">(${product.reviewsCount || 25})</span>
                    </div>
                    <p class="text-gray-600 text-sm mb-4 line-clamp-2">${escapeHtml(product.description)}</p>
                </div>
            </div>
            <div class="p-6 pt-0">
                <button onclick="addToCart(${product.id})" ${!product.inStock ? 'disabled' : ''} class="w-full py-3 border-2 border-pink-100 text-pink-600 rounded-xl font-semibold hover:bg-pink-50 hover:border-pink-200 transition ${!product.inStock ? 'opacity-50 cursor-not-allowed' : ''}">
                    ${product.inStock ? 'Add to Order' : 'Out of Stock'}
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

function handleProductSearch() {
    renderProducts(currentCategoryState);
}

function handleProductSort() {
    renderProducts(currentCategoryState);
}

// --- PROMO CODE SYSTEM ---
let appliedDiscount = 0;
let appliedPromoCode = '';

function applyPromoCode() {
    const input = document.getElementById('cart-promo-code');
    if (!input) return;
    const code = input.value.trim().toUpperCase();

    if (!code) {
        showNotification('Please enter a promo code', 'warning');
        return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (code === 'SWEET10') {
        appliedDiscount = subtotal * 0.10;
        appliedPromoCode = 'SWEET10 (10% OFF)';
        showNotification('Promo code SWEET10 applied! 10% discount added.', 'success');
    } else if (code === 'WELCOME50') {
        appliedDiscount = Math.min(50, subtotal);
        appliedPromoCode = 'WELCOME50 (₱50 OFF)';
        showNotification('Promo code WELCOME50 applied! ₱50 discount added.', 'success');
    } else {
        showNotification('Invalid promo code. Try SWEET10 or WELCOME50', 'error');
        return;
    }

    updateCartUI();
}

// --- INTERACTIVE CUSTOM CAKE LIVE COST ESTIMATOR ---
function calculateLiveCustomPrice() {
    const size = document.getElementById('custom-size')?.value;
    const budget = document.getElementById('custom-budget')?.value;

    let base = 1200;
    if (size === '6-inch') base = 850;
    else if (size === '8-inch') base = 1500;
    else if (size === '10-inch') base = 2400;
    else if (size === '12-inch') base = 3200;
    else if (size === 'tiered') base = 4500;

    if (budget === '1000-2000') base = Math.max(1200, base);
    else if (budget === '2000-3000') base = Math.max(2200, base);
    else if (budget === '3000-5000') base = Math.max(3500, base);
    else if (budget === '5000+') base = Math.max(5000, base);

    const priceEl = document.getElementById('custom-live-price');
    if (priceEl) priceEl.textContent = `₱${base.toLocaleString()}`;
}

// --- PRINTABLE OFFICIAL RECEIPT INVOICE ---
function printReceipt(orderRef) {
    const order = orders.find(o => o.ref === orderRef);
    if (!order) {
        showNotification('Order reference not found', 'error');
        return;
    }

    const receiptWindow = window.open('', '_blank', 'width=650,height=800');
    if (!receiptWindow) {
        showNotification('Please allow pop-ups to print receipts', 'warning');
        return;
    }

    const itemsHtml = (order.cart || []).map(item => `
        <tr>
            <td style="padding:8px;border-bottom:1px solid #eee;">${escapeHtml(item.name)}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">x${item.quantity}</td>
            <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">₱${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
    `).join('');

    receiptWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Official Receipt - ${escapeHtml(order.ref)}</title>
            <style>
                body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 30px; color: #333; }
                .header { text-align: center; border-bottom: 2px solid #f43f5e; padding-bottom: 15px; margin-bottom: 20px; }
                .title { font-size: 24px; font-weight: bold; color: #f43f5e; margin: 0; }
                .subtitle { font-size: 12px; color: #666; margin-top: 4px; }
                .info { margin-bottom: 20px; font-size: 13px; display: flex; justify-content: space-between; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px; }
                th { background: #f8f9fa; text-align: left; padding: 10px; border-bottom: 2px solid #ddd; }
                .total-row { font-size: 15px; font-weight: bold; text-align: right; margin-top: 10px; }
                .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #888; border-top: 1px solid #eee; padding-top: 15px; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1 class="title">CAKETERING BAKESHOP</h1>
                <p class="subtitle">Artisan Pastries & Custom Cakes | Zamboanga City</p>
                <p class="subtitle">Email: caketering.ph@gmail.com</p>
            </div>

            <div class="info">
                <div>
                    <strong>Order Ref:</strong> ${escapeHtml(order.ref)}<br>
                    <strong>Customer:</strong> ${escapeHtml(order.name)}<br>
                    <strong>Phone:</strong> ${escapeHtml(order.phone)}
                </div>
                <div style="text-align:right;">
                    <strong>Date:</strong> ${new Date(order.createdAt || order.datetime).toLocaleDateString()}<br>
                    <strong>Payment:</strong> ${(order.paymentMethod || 'COD').toUpperCase()}<br>
                    <strong>Status:</strong> ${(order.status || 'Pending').toUpperCase()}
                </div>
            </div>

            <table>
                <thead>
                    <tr><th>Item</th><th style="text-align:center;">Qty</th><th style="text-align:right;">Amount</th></tr>
                </thead>
                <tbody>${itemsHtml}</tbody>
            </table>

            <div class="total-row">
                <p>Delivery Fee: ₱50.00</p>
                <p style="color:#f43f5e;font-size:18px;">TOTAL PAID / DUE: ₱${(order.total || 0).toFixed(2)}</p>
            </div>

            <div class="footer">
                <p>Thank you for celebrating with Caketering!</p>
                <p>Making life's moments sweeter, one cake at a time.</p>
            </div>
            <script>window.onload = function() { window.print(); };</script>
        </body>
        </html>
    `);
    receiptWindow.document.close();
}

function filterCategory(category) {
    document.querySelectorAll('.category-btn').forEach(btn => {
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    const grid = document.getElementById('products-grid');
    if (grid) {
        grid.style.opacity = '0';
        grid.style.transform = 'translateY(20px)';

        setTimeout(() => {
            renderProducts(category);
            grid.style.transition = 'all 0.3s ease';
            grid.style.opacity = '1';
            grid.style.transform = 'translateY(0)';
        }, 150);
    }
}

// --- CART FUNCTIONS ---
function addToCart(productId) {
    if (!currentUser) {
        showNotification('Please login first to add items to cart', 'warning');
        openAuthModal();
        return;
    }

    const product = products.find(p => p.id === productId);
    if (!product || !product.inStock) {
        showNotification('Sorry, this item is out of stock', 'error');
        return;
    }

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    setStorage('cart', cart);
    updateCartUI();
    showAddedNotification(product.name);

    const badge = document.getElementById('cart-badge');
    if (badge) {
        badge.classList.add('scale-125');
        setTimeout(() => badge.classList.remove('scale-125'), 200);
    }

    openCartAutomatically();
}

function openCartAutomatically() {
    if (autoPopupTimeout) clearTimeout(autoPopupTimeout);

    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');

    if (sidebar && sidebar.classList.contains('cart-closed')) {
        autoPopupTimeout = setTimeout(() => {
            sidebar.classList.remove('cart-closed');
            sidebar.classList.add('cart-open');
            if (overlay) {
                overlay.classList.remove('hidden');
                setTimeout(() => overlay.classList.remove('opacity-0'), 10);
            }
            document.body.style.overflow = 'hidden';
        }, 200);
    }
}

function scrollToMapLocation(e) {
    if (e) e.preventDefault();
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    if (sidebar && !sidebar.classList.contains('cart-closed')) {
        toggleCart();
    }
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    if (cart.length === 0) {
        appliedDiscount = 0;
        appliedPromoCode = '';
    }
    setStorage('cart', cart);
    updateCartUI();

    if (cart.length === 0) {
        setTimeout(() => {
            if (cart.length === 0) {
                const sidebar = document.getElementById('cart-sidebar');
                const overlay = document.getElementById('cart-overlay');
                if (sidebar && !sidebar.classList.contains('cart-closed')) {
                    sidebar.classList.remove('cart-open');
                    sidebar.classList.add('cart-closed');
                    if (overlay) overlay.classList.add('opacity-0');
                    setTimeout(() => {
                        if (overlay) overlay.classList.add('hidden');
                    }, 300);
                    document.body.style.overflow = '';
                }
            }
        }, 1200);
    }
}

function updateQuantity(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            setStorage('cart', cart);
            updateCartUI();
        }
    }
}

let currentDeliveryFee = 50;

function updateDeliveryZone() {
    const zoneSelect = document.getElementById('cart-delivery-zone');
    if (zoneSelect) {
        currentDeliveryFee = parseFloat(zoneSelect.value) || 50;
    }
    updateCartUI();
}

function updateCartUI() {
    const cartItems = document.getElementById('cart-items');
    const badge = document.getElementById('cart-badge');
    const subtotalEl = document.getElementById('cart-subtotal');
    const deliveryFeeEl = document.getElementById('cart-delivery-fee');
    const totalEl = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    if (cart.length === 0) {
        appliedDiscount = 0;
        appliedPromoCode = '';
    }

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const zoneSelect = document.getElementById('cart-delivery-zone');
    if (zoneSelect) {
        currentDeliveryFee = parseFloat(zoneSelect.value) || 50;
    }

    const discountRow = document.getElementById('promo-discount-row');
    const discountEl = document.getElementById('cart-discount');
    
    if (appliedDiscount > 0 && discountRow && discountEl && cart.length > 0) {
        discountRow.classList.remove('hidden');
        discountEl.textContent = `-₱${appliedDiscount.toFixed(2)}`;
    } else if (discountRow) {
        discountRow.classList.add('hidden');
    }

    const effectiveDelivery = subtotal > 0 ? currentDeliveryFee : 0;
    const total = subtotal > 0 ? Math.max(0, subtotal - appliedDiscount + effectiveDelivery) : 0;

    if (badge) {
        badge.textContent = totalItems;
        badge.classList.toggle('scale-0', totalItems === 0);
    }

    if (subtotalEl) subtotalEl.textContent = `₱${subtotal.toFixed(2)}`;
    if (deliveryFeeEl) deliveryFeeEl.textContent = `₱${effectiveDelivery.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `₱${total.toFixed(2)}`;
    if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;

    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="text-center text-gray-400 mt-20">
                <i class="fas fa-shopping-basket text-4xl mb-3"></i>
                <p>Your cart is empty</p>
                <button onclick="toggleCart()" class="mt-4 text-pink-600 font-medium hover:underline">Start Shopping</button>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="flex gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <img src="${item.image}" class="w-20 h-20 object-cover rounded-lg" alt="${escapeHtml(item.name)}">
                <div class="flex-1">
                    <h4 class="font-bold text-gray-800 text-sm mb-1">${escapeHtml(item.name)}</h4>
                    <p class="text-pink-600 font-bold text-sm mb-2">₱${item.price}</p>
                    <div class="flex items-center gap-3">
                        <button onclick="updateQuantity(${item.id}, -1)" class="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition">
                            <i class="fas fa-minus text-xs"></i>
                        </button>
                        <span class="font-semibold text-sm w-4 text-center">${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)" class="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition">
                            <i class="fas fa-plus text-xs"></i>
                        </button>
                    </div>
                </div>
                <button onclick="removeFromCart(${item.id})" class="text-gray-400 hover:text-red-500 transition self-start">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `).join('');
    }
}

function toggleCart() {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');

    if (sidebar.classList.contains('cart-closed')) {
        sidebar.classList.remove('cart-closed');
        sidebar.classList.add('cart-open');
        if (overlay) {
            overlay.classList.remove('hidden');
            setTimeout(() => overlay.classList.remove('opacity-0'), 10);
        }
        document.body.style.overflow = 'hidden';
    } else {
        sidebar.classList.remove('cart-open');
        sidebar.classList.add('cart-closed');
        if (overlay) overlay.classList.add('opacity-0');
        setTimeout(() => {
            if (overlay) overlay.classList.add('hidden');
        }, 300);
        document.body.style.overflow = '';
    }
}

function showAddedNotification(productName) {
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg transform translate-y-20 opacity-0 transition-all duration-300 z-50 flex items-center gap-3';
    notification.innerHTML = `
        <i class="fas fa-check-circle text-green-400"></i>
        <div>
            <p class="font-semibold text-sm">Added to cart</p>
            <p class="text-xs text-gray-300">${escapeHtml(productName)}</p>
        </div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.remove('translate-y-20', 'opacity-0');
    }, 50);

    setTimeout(() => {
        notification.classList.add('translate-y-20', 'opacity-0');
        setTimeout(() => notification.remove(), 300);
    }, 2500);
}

// --- CHECKOUT FUNCTIONS ---
function openCheckoutModal() {
    if (!currentUser) {
        showNotification('Please login first to checkout', 'warning');
        openAuthModal();
        return;
    }

    if (cart.length === 0) {
        showNotification('Your cart is empty', 'warning');
        return;
    }

    document.getElementById('checkout-modal').classList.remove('hidden');

    if (currentUser && !currentUser.isAdmin) {
        const phoneEl = document.getElementById('checkout-phone');
        const nameEl = document.getElementById('checkout-name');
        const addrEl = document.getElementById('checkout-address');

        if (phoneEl && currentUser.phone) phoneEl.value = currentUser.phone.replace('+63', '0');
        if (nameEl && currentUser.name) nameEl.value = currentUser.name;
        if (addrEl && currentUser.address) addrEl.value = currentUser.address;
    }

    const datetimeInput = document.getElementById('checkout-datetime');
    if (datetimeInput) {
        const now = new Date();
        now.setHours(now.getHours() + 24);
        const isoStr = now.toISOString().slice(0, 16);
        datetimeInput.min = isoStr;
        if (!datetimeInput.value) datetimeInput.value = isoStr;
    }
}

function closeCheckoutModal() {
    document.getElementById('checkout-modal').classList.add('hidden');
}

function processCheckout(e) {
    e.preventDefault();

    if (!currentUser) {
        showNotification('Please login first', 'warning');
        openAuthModal();
        return;
    }

    const btn = document.getElementById('place-order-btn');
    const originalContent = btn.innerHTML;

    const name = document.getElementById('checkout-name').value.trim();
    const phone = document.getElementById('checkout-phone').value.trim();
    const address = document.getElementById('checkout-address').value.trim();
    const datetime = document.getElementById('checkout-datetime').value;
    const instructions = document.getElementById('checkout-instructions').value.trim();

    const paymentRadios = document.getElementsByName('payment-method');
    let paymentMethod = 'cod';
    for (const radio of paymentRadios) {
        if (radio.checked) {
            paymentMethod = radio.value;
            break;
        }
    }

    if (!name || !phone || !address || !datetime) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    btn.innerHTML = '<div class="loader border-white border-t-transparent inline-block"></div><span class="ml-2">Processing Order...</span>';
    btn.disabled = true;

    const orderRef = '#CKT-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = Math.max(0, subtotal - appliedDiscount + currentDeliveryFee);

    const order = {
        ref: orderRef,
        name: name,
        phone: phone,
        address: address,
        datetime: datetime,
        instructions: instructions,
        paymentMethod: paymentMethod,
        items: cart.reduce((sum, item) => sum + item.quantity, 0),
        deliveryFee: currentDeliveryFee,
        total: total,
        status: 'pending',
        createdAt: new Date().toISOString(),
        userId: currentUser.id,
        email: currentUser.email,
        cart: [...cart]
    };

    orders.push(order);
    setStorage('orders', orders);

    setTimeout(() => {
        btn.innerHTML = originalContent;
        btn.disabled = false;

        closeCheckoutModal();

        const orderRefEl = document.getElementById('order-ref');
        if (orderRefEl) orderRefEl.textContent = orderRef;
        document.getElementById('success-modal').classList.remove('hidden');

        showNotification(`📧 Notification sent to caketering.ph@gmail.com for Order ${orderRef}`, 'info');

        cart = [];
        setStorage('cart', cart);
        updateCartUI();

        updateAdminStats();
    }, 1500);
}

function closeSuccessModal() {
    document.getElementById('success-modal').classList.add('hidden');
}

// --- NOTIFICATION SYSTEM ---
function showNotification(message, type = 'info', duration = 3000) {
    const colors = {
        success: 'bg-emerald-600',
        error: 'bg-rose-600',
        info: 'bg-blue-600',
        warning: 'bg-amber-600'
    };

    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };

    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 ${colors[type] || colors.info} text-white px-6 py-3 rounded-xl shadow-xl transform translate-x-full opacity-0 transition-all duration-300 z-[100] flex items-center gap-3`;
    notification.innerHTML = `
        <i class="fas ${icons[type] || icons.info}"></i>
        <div>
            <p class="font-semibold text-sm">${escapeHtml(message)}</p>
        </div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.remove('translate-x-full', 'opacity-0');
        notification.classList.add('translate-x-0', 'opacity-100');
    }, 50);

    setTimeout(() => {
        notification.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// --- UTILITY EFFECTS ---
window.addEventListener('scroll', () => {
    const btn = document.getElementById('back-to-top');
    if (btn) {
        if (window.scrollY > 400) {
            btn.classList.remove('opacity-0', 'invisible');
            btn.classList.add('opacity-100', 'visible');
        } else {
            btn.classList.add('opacity-0', 'invisible');
            btn.classList.remove('opacity-100', 'visible');
        }
    }

    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-md');
        } else {
            navbar.classList.remove('shadow-md');
        }
    }
});

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- WISHLIST SYSTEM ---
function toggleWishlist(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const index = wishlist.findIndex(item => item.id === productId);
    if (index !== -1) {
        wishlist.splice(index, 1);
        showNotification(`Removed ${product.name} from Wishlist`, 'info');
    } else {
        wishlist.push(product);
        showNotification(`Added ${product.name} to Wishlist! ❤️`, 'success');
    }

    setStorage('wishlist', wishlist);
    updateWishlistUI();
    renderProducts(currentCategoryState);
}

function updateWishlistUI() {
    const badge = document.getElementById('wishlist-badge');
    if (badge) {
        badge.textContent = wishlist.length;
        badge.classList.toggle('scale-0', wishlist.length === 0);
    }

    const container = document.getElementById('wishlist-items-container');
    if (!container) return;

    if (wishlist.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12 text-gray-400">
                <i class="far fa-heart text-5xl mb-3 text-pink-300"></i>
                <p class="font-medium text-gray-600">Your wishlist is empty</p>
                <p class="text-xs text-gray-400 mt-1">Explore our bakery catalog and save your favorites!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = wishlist.map(item => `
        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div class="flex items-center gap-4">
                <img src="${item.image}" class="w-16 h-16 object-cover rounded-xl shadow-sm" alt="${escapeHtml(item.name)}">
                <div>
                    <h4 class="font-bold text-gray-800 text-sm mb-1">${escapeHtml(item.name)}</h4>
                    <p class="text-pink-600 font-bold text-sm">₱${item.price}</p>
                </div>
            </div>
            <div class="flex items-center gap-2">
                <button onclick="moveWishlistItemToCart(${item.id})" class="px-4 py-2 bg-pink-600 text-white rounded-xl text-xs font-semibold hover:bg-pink-700 transition flex items-center gap-1.5 shadow-sm">
                    <i class="fas fa-shopping-bag"></i> Add to Cart
                </button>
                <button onclick="toggleWishlist(${item.id})" class="p-2 text-gray-400 hover:text-red-500 transition">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function openWishlistModal() {
    updateWishlistUI();
    document.getElementById('wishlist-modal').classList.remove('hidden');
}

function closeWishlistModal() {
    document.getElementById('wishlist-modal').classList.add('hidden');
}

function moveWishlistItemToCart(productId) {
    addToCart(productId);
    toggleWishlist(productId);
}

// --- QUICK VIEW & REVIEWS MODAL ---
function openQuickView(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const isWishlisted = wishlist.some(item => item.id === product.id);
    const reviews = productReviews[productId] || [
        { name: "Maria Santos", rating: 5, date: "2 days ago", comment: "Absolutely delicious and fresh! Arrived right on time for our celebration." },
        { name: "Juan Reyes", rating: 5, date: "1 week ago", comment: "The quality and taste are unmatched. Will definitely order again!" }
    ];

    const content = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            <div class="relative rounded-2xl overflow-hidden shadow-md">
                <img src="${product.image}" class="w-full h-80 md:h-96 object-cover" alt="${escapeHtml(product.name)}">
                ${product.badge ? `<span class="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-pink-600 shadow-sm">${escapeHtml(product.badge)}</span>` : ''}
            </div>
            <div class="space-y-4">
                <div>
                    <span class="text-xs uppercase font-bold text-pink-600 tracking-wider">${escapeHtml(product.category)}</span>
                    <h2 class="text-3xl font-bold text-gray-900 serif mt-1">${escapeHtml(product.name)}</h2>
                    <div class="flex items-center gap-2 mt-2">
                        <div class="flex text-amber-400 text-sm">
                            <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                        </div>
                        <span class="text-sm font-bold text-gray-800">${product.rating || 4.9}</span>
                        <span class="text-xs text-gray-500">(${reviews.length} reviews)</span>
                    </div>
                </div>

                <div class="text-2xl font-bold text-pink-600">₱${product.price}</div>
                <p class="text-gray-600 text-sm leading-relaxed">${escapeHtml(product.description)}</p>

                <div class="p-3 bg-pink-50 rounded-xl space-y-1 text-xs">
                    <p><span class="font-bold text-gray-800">Ingredients:</span> <span class="text-gray-600">${escapeHtml(product.ingredients || 'Fresh natural ingredients, butter, flour, sugar, vanilla')}</span></p>
                    <p><span class="font-bold text-gray-800">Allergens:</span> <span class="text-gray-600">${escapeHtml(product.allergens || 'Contains Dairy, Eggs, Gluten')}</span></p>
                </div>

                <div class="flex items-center gap-3 pt-2">
                    <button onclick="addToCart(${product.id}); closeQuickViewModal();" ${!product.inStock ? 'disabled' : ''} class="flex-1 btn-primary text-white py-3.5 rounded-xl font-bold shadow-md flex items-center justify-center gap-2 ${!product.inStock ? 'opacity-50 cursor-not-allowed' : ''}">
                        <i class="fas fa-shopping-bag"></i> ${product.inStock ? 'Add to Order' : 'Out of Stock'}
                    </button>
                    <button onclick="toggleWishlist(${product.id}); openQuickView(${product.id});" class="p-3.5 border-2 border-pink-100 rounded-xl hover:bg-pink-50 text-pink-600 transition">
                        <i class="${isWishlisted ? 'fas' : 'far'} fa-heart text-xl"></i>
                    </button>
                </div>
            </div>
        </div>

        <div class="border-t border-gray-100 mt-8 pt-6">
            <h3 class="text-xl font-bold text-gray-900 serif mb-4">Customer Reviews (${reviews.length})</h3>
            <div class="space-y-3 mb-6">
                ${reviews.map(r => `
                    <div class="p-4 bg-gray-50 rounded-2xl text-xs space-y-1">
                        <div class="flex justify-between items-center">
                            <span class="font-bold text-gray-900">${escapeHtml(r.name)}</span>
                            <span class="text-gray-400">${escapeHtml(r.date)}</span>
                        </div>
                        <div class="flex text-amber-400 text-xs">
                            ${'<i class="fas fa-star"></i>'.repeat(r.rating)}
                        </div>
                        <p class="text-gray-700 leading-relaxed">${escapeHtml(r.comment)}</p>
                    </div>
                `).join('')}
            </div>

            <form onsubmit="submitProductReview(event, ${product.id})" class="p-4 bg-pink-50/50 rounded-2xl border border-pink-100 space-y-3">
                <h4 class="text-xs font-bold text-pink-600 uppercase tracking-wider">Leave a Review</h4>
                <div class="grid grid-cols-2 gap-3">
                    <input type="text" id="review-author" required placeholder="Your Name" class="px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 bg-white">
                    <select id="review-rating" required class="px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 bg-white">
                        <option value="5">⭐⭐⭐⭐⭐ (5 Stars)</option>
                        <option value="4">⭐⭐⭐⭐ (4 Stars)</option>
                        <option value="3">⭐⭐⭐ (3 Stars)</option>
                    </select>
                </div>
                <textarea id="review-comment" required rows="2" placeholder="Write your review here..." class="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-pink-500 bg-white"></textarea>
                <button type="submit" class="w-full bg-gray-900 hover:bg-gray-800 text-white py-2 rounded-xl text-xs font-bold transition">Submit Review</button>
            </form>
        </div>
    `;

    document.getElementById('quick-view-content').innerHTML = content;
    document.getElementById('quick-view-modal').classList.remove('hidden');
}

function closeQuickViewModal() {
    document.getElementById('quick-view-modal').classList.add('hidden');
}

function submitProductReview(e, productId) {
    e.preventDefault();
    const author = document.getElementById('review-author').value.trim();
    const rating = parseInt(document.getElementById('review-rating').value);
    const comment = document.getElementById('review-comment').value.trim();

    if (!productReviews[productId]) {
        productReviews[productId] = [];
    }

    productReviews[productId].unshift({
        name: author,
        rating: rating,
        date: "Just now",
        comment: comment
    });

    setStorage('productReviews', productReviews);
    showNotification('Thank you for your review!', 'success');
    openQuickView(productId);
}

// --- PUBLIC ORDER TRACKER LOOKUP ---
function openTrackOrderModal() {
    document.getElementById('track-order-modal').classList.remove('hidden');
}

function closeTrackOrderModal() {
    document.getElementById('track-order-modal').classList.add('hidden');
}

function trackOrderLookup(e) {
    e.preventDefault();
    const inputRef = document.getElementById('track-input-ref').value.trim().toUpperCase();
    const cleanRef = inputRef.startsWith('#') ? inputRef : ('#' + inputRef);

    const order = orders.find(o => o.ref.toUpperCase() === cleanRef.toUpperCase() || o.ref.toUpperCase() === inputRef.toUpperCase());
    const customCake = customCakes.find(c => (c.ref && c.ref.toUpperCase() === inputRef.toUpperCase()) || ('CUST-' + c.id).toUpperCase() === inputRef.toUpperCase());

    const target = order || customCake;
    const resultDiv = document.getElementById('track-order-result');

    if (!target) {
        resultDiv.innerHTML = `
            <div class="p-6 bg-red-50 rounded-2xl text-center text-red-600 text-xs">
                <i class="fas fa-exclamation-circle text-3xl mb-2"></i>
                <p class="font-bold">No order found matching "${escapeHtml(inputRef)}"</p>
                <p class="text-gray-500 mt-1">Please double check your reference number in your receipt or confirmation message.</p>
            </div>
        `;
        return;
    }

    const isCustom = !order;
    const status = target.status || 'pending';

    const steps = [
        { key: 'pending', label: 'Placed' },
        { key: 'processing', label: 'Processing' },
        { key: 'in-progress', label: 'Baking' },
        { key: 'out-for-delivery', label: 'Out for Delivery' },
        { key: 'delivered', label: 'Delivered' }
    ];

    let currentStepIndex = 0;
    if (status === 'processing') currentStepIndex = 1;
    else if (status === 'in-progress' || status === 'approved') currentStepIndex = 2;
    else if (status === 'out-for-delivery' || status === 'ready') currentStepIndex = 3;
    else if (status === 'delivered' || status === 'completed') currentStepIndex = 4;

    resultDiv.innerHTML = `
        <div class="bg-gray-50 p-6 rounded-2xl space-y-4 border border-gray-200">
            <div class="flex justify-between items-start border-b pb-3 border-gray-200">
                <div>
                    <span class="text-xs text-gray-400 uppercase font-bold">Reference</span>
                    <p class="text-lg font-mono font-bold text-gray-900">${escapeHtml(target.ref || 'CUST-' + target.id)}</p>
                    <p class="text-xs text-gray-500">${escapeHtml(target.name)} • ${new Date(target.createdAt || Date.now()).toLocaleDateString()}</p>
                </div>
                <span class="px-3 py-1 bg-pink-100 text-pink-700 text-xs font-bold rounded-full uppercase">${escapeHtml(status)}</span>
            </div>

            <div>
                <p class="text-xs font-bold text-gray-500 uppercase mb-3">Order Status Progress</p>
                <div class="flex items-center justify-between relative">
                    <div class="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
                    <div class="absolute top-1/2 left-0 h-1 bg-pink-500 -translate-y-1/2 z-0 transition-all duration-500" style="width: ${(currentStepIndex / 4) * 100}%"></div>
                    ${steps.map((step, idx) => `
                        <div class="relative z-10 flex flex-col items-center">
                            <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${idx <= currentStepIndex ? 'bg-pink-600 text-white shadow-md' : 'bg-gray-200 text-gray-500'}">
                                ${idx <= currentStepIndex ? '<i class="fas fa-check"></i>' : (idx + 1)}
                            </div>
                            <span class="text-[10px] font-semibold mt-1 ${idx <= currentStepIndex ? 'text-pink-600' : 'text-gray-400'}">${step.label}</span>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="pt-2 text-xs text-gray-600 flex justify-between border-t border-gray-200">
                <span>${isCustom ? 'Custom Cake Request' : 'Standard Catalog Order'}</span>
                <span class="font-bold text-pink-600">Total: ₱${target.total || target.estimatedPrice || 'TBD'}</span>
            </div>
        </div>
    `;
}

// --- CSV EXPORTER FOR ADMIN ---
function exportOrdersCSV() {
    if (!orders || orders.length === 0) {
        showNotification('No orders available to export', 'warning');
        return;
    }

    const headers = ["Reference", "Customer Name", "Phone", "Email", "Date", "Items Count", "Total (PHP)", "Payment Method", "Status"];
    const rows = orders.map(o => [
        `"${o.ref}"`,
        `"${(o.name || '').replace(/"/g, '""')}"`,
        `"${(o.phone || '').replace(/"/g, '""')}"`,
        `"${(o.email || '').replace(/"/g, '""')}"`,
        `"${new Date(o.createdAt || o.datetime).toLocaleString()}"`,
        o.items || 1,
        o.total || 0,
        `"${o.paymentMethod || 'COD'}"`,
        `"${o.status || 'pending'}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `caketering_orders_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    showNotification('Exported orders CSV report successfully!', 'success');
}

function exportUsersCSV() {
    if (!users || users.length === 0) {
        showNotification('No users available to export', 'warning');
        return;
    }

    const headers = ["User ID", "Name", "Email", "Phone", "Login Method", "Role", "Joined Date"];
    const rows = users.map(u => [
        u.id,
        `"${(u.name || '').replace(/"/g, '""')}"`,
        `"${(u.email || '').replace(/"/g, '""')}"`,
        `"${(u.phone || '').replace(/"/g, '""')}"`,
        `"${u.loginMethod || 'email'}"`,
        u.isAdmin ? "Admin" : "Customer",
        `"${new Date(u.createdAt || Date.now()).toLocaleDateString()}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `caketering_customers_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    showNotification('Exported customers CSV report successfully!', 'success');
}