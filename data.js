// Enhanced Restaurant Website JavaScript
// Author: Assistant
// Features: Page Navigation, Cart Management, Order Tracking, Payment Processing, User Authentication

// Global Variables
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let currentPage = 'home';
let orders = JSON.parse(localStorage.getItem('orders')) || [];
let currentOrder = null;
let notifications = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    updateCartCount();
    loadUserSession();
    loadNotifications();
});

// Application Initialization
function initializeApp() {
    console.log('Initializing Anil\'s Food Zone App...');
    showHomePage();
    setupEventListeners();
    initializePaymentMethods();
    startOrderTrackingSystem();
}

// Setup Event Listeners
function setupEventListeners() {
    // Menu category buttons
    document.querySelectorAll('.menu-category-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            filterMenuItems(this.dataset.category);
            updateCategoryButtons(this);
        });
    });

    // Payment method change
    document.querySelectorAll('input[name="payment"]').forEach(radio => {
        radio.addEventListener('change', handlePaymentMethodChange);
    });

    // Delivery option change
    document.querySelectorAll('input[name="delivery"]').forEach(radio => {
        radio.addEventListener('change', handleDeliveryOptionChange);
    });

    // Real-time form validation
    setupFormValidation();
    
    // Keyboard shortcuts
    setupKeyboardShortcuts();
}

// ============ NAVIGATION SYSTEM ============
function showPage(pageId) {
    // Hide all pages
    const pages = ['home-page', 'menu-page', 'about-page', 'location-page', 'careers-page', 'order-page', 'cart-page', 'account-page', 'login-page', 'signup-page'];
    
    pages.forEach(page => {
        const element = document.getElementById(page);
        if (element) element.style.display = 'none';
    });
    
    // Show main site container
    const mainSite = document.getElementById('main-site');
    if (pageId === 'login-page' || pageId === 'signup-page' || pageId === 'account-page') {
        if (mainSite) mainSite.style.display = 'none';
        document.getElementById(pageId).style.display = 'block';
    } else {
        if (mainSite) mainSite.style.display = 'block';
        document.getElementById(pageId).style.display = 'block';
    }
    
    currentPage = pageId;
    updateActiveNavigation(pageId);
    
    // Page-specific initialization
    switch(pageId) {
        case 'menu-page':
            initializeMenuPage();
            break;
        case 'order-page':
            initializeOrderPage();
            break;
        case 'cart-page':
            refreshCartPage();
            break;
        case 'account-page':
            initializeAccountPage();
            break;
    }
}

function showHomePage() { showPage('home-page'); }
function showMenuPage() { showPage('menu-page'); }
function showAboutPage() { showPage('about-page'); }
function showLocationPage() { showPage('location-page'); }
function showCareersPage() { showPage('careers-page'); }
function showOrderPage() { showPage('order-page'); }
function showCartPage() { showPage('cart-page'); }
function showAccountPage() { 
    if (!currentUser) {
        showLoginPage();
        return;
    }
    showPage('account-page'); 
}
function showLoginPage() { showPage('login-page'); }
function showSignupPage() { showPage('signup-page'); }

function updateActiveNavigation(pageId) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const pageMap = {
        'home-page': 'Home',
        'menu-page': 'Menu',
        'about-page': 'About',
        'location-page': 'Location',
        'careers-page': 'Careers'
    };
    
    if (pageMap[pageId]) {
        const navItem = document.querySelector(`.nav-item[onclick*="${pageMap[pageId]}"]`);
        if (navItem) navItem.classList.add('active');
    }
}

// ============ MENU SYSTEM ============
function initializeMenuPage() {
    loadMenuItems();
    setupMenuSearch();
    setupMenuFilters();
}

function loadMenuItems() {
    const menuItems = [
        {
            id: 1, name: 'Tonkotsu Ramen', price: 299, category: 'ramen',
            image: 'pic 1.webp', rating: 4.8, reviews: 124,
            description: 'Rich pork bone broth simmered for 24 hours with chashu pork, soft-boiled egg, green onions, and nori sheets.',
            ingredients: ['Pork bone broth', 'Chashu pork', 'Ramen noodles', 'Soft-boiled egg', 'Green onions', 'Nori sheets'],
            tags: ['🔥 Bestseller'], spicy: 1, time: '20 min'
        },
        {
            id: 2, name: 'Spicy Miso Ramen', price: 249, category: 'ramen',
            image: 'pic 5.jpg', rating: 4.3, reviews: 98,
            description: 'Spicy miso-based broth with ground pork, bean sprouts, corn, ajitama egg, and chili oil.',
            ingredients: ['Miso broth', 'Ground pork', 'Bean sprouts', 'Corn', 'Ajitama egg', 'Chili oil'],
            tags: ['🌶️ Spicy'], spicy: 3, time: '18 min'
        },
        {
            id: 3, name: 'Vegetable Shoyu', price: 349, category: 'ramen',
            image: 'pic 6.jpg', rating: 4.5, reviews: 87,
            description: 'Soy sauce-based vegetable broth with seasonal vegetables, tofu, mushrooms, and bamboo shoots.',
            ingredients: ['Vegetable broth', 'Tofu', 'Mushrooms', 'Bamboo shoots', 'Seasonal vegetables'],
            tags: ['🌱 Vegan'], spicy: 0, time: '15 min'
        },
        {
            id: 4, name: 'Gyoza (6 pcs)', price: 179, category: 'sides',
            image: 'img 4.avif', rating: 4.7, reviews: 156,
            description: 'Pan-fried dumplings filled with pork and vegetables, served with dipping sauce.',
            ingredients: ['Pork', 'Cabbage', 'Garlic', 'Ginger', 'Dumpling wrapper'],
            tags: ['🥟 Popular'], spicy: 0, time: '12 min'
        },
        {
            id: 5, name: 'Matcha Latte', price: 149, category: 'beverages',
            image: 'img 3.webp', rating: 4.2, reviews: 67,
            description: 'Premium Japanese matcha powder with steamed milk, lightly sweetened.',
            ingredients: ['Matcha powder', 'Steamed milk', 'Sugar'],
            tags: ['🍵 Premium'], spicy: 0, time: '5 min'
        },
        {
            id: 6, name: 'Mochi Ice Cream (3 pcs)', price: 199, category: 'desserts',
            image: 'img 2.webp', rating: 4.6, reviews: 89,
            description: 'Traditional Japanese mochi filled with premium ice cream. Flavors: Vanilla, Green Tea, Red Bean.',
            ingredients: ['Mochi', 'Ice cream', 'Rice flour'],
            tags: ['🍨 Sweet'], spicy: 0, time: '2 min'
        }
    ];
    
    renderMenuItems(menuItems);
}

function renderMenuItems(items) {
    const container = document.getElementById('menu-items');
    if (!container) return;
    
    container.innerHTML = items.map(item => `
        <div class="card p-4 cursor-pointer menu-item" data-category="${item.category}" onclick="openItemDetails(${item.id})">
            <div class="flex">
                <img src="${item.image}" alt="${item.name}" class="w-32 h-32 object-cover rounded-lg mr-4">
                <div class="flex-1">
                    <div class="flex justify-between items-start mb-2">
                        <div>
                            <div class="flex items-center gap-2 mb-1">
                                ${item.tags.map(tag => `<span class="food-tag bg-yellow-500 text-white">${tag}</span>`).join('')}
                            </div>
                            <h3 class="text-xl font-medium">${item.name}</h3>
                        </div>
                        <div class="text-right">
                            <div class="font-bold text-lg">₹ ${item.price}</div>
                            <div class="rating-stars text-sm">
                                ${renderStars(item.rating)}
                                <span class="text-gray-400 ml-1">(${item.reviews})</span>
                            </div>
                        </div>
                    </div>
                    <p class="text-gray-400 text-sm mb-3">${item.description}</p>
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-2 text-sm text-gray-500">
                            <span>🕒 ${item.time}</span>
                            <span>${getSpicyLevel(item.spicy)}</span>
                        </div>
                        <button class="gradient-btn px-4 py-2 text-white font-medium rounded-md" onclick="event.stopPropagation(); addToCart('${item.name}', ${item.price})">Add to Order</button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (hasHalf) stars += '<i class="fas fa-star-half-alt"></i>';
    
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

function getSpicyLevel(level) {
    switch(level) {
        case 0: return '🌱 Mild';
        case 1: return '🔥 Mild';
        case 2: return '🌶️ Medium';
        case 3: return '🌶️🌶️ Hot';
        default: return '🔥 Mild';
    }
}

function filterMenuItems(category) {
    const items = document.querySelectorAll('.menu-item');
    items.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

function updateCategoryButtons(activeBtn) {
    document.querySelectorAll('.menu-category-btn').forEach(btn => {
        btn.classList.remove('bg-yellow-500', 'text-white');
        btn.classList.add('bg-gray-800', 'text-gray-300');
    });
    
    activeBtn.classList.remove('bg-gray-800', 'text-gray-300');
    activeBtn.classList.add('bg-yellow-500', 'text-white');
}

function setupMenuSearch() {
    const searchInput = document.querySelector('input[placeholder="Search menu items..."]');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            const items = document.querySelectorAll('.menu-item');
            
            items.forEach(item => {
                const name = item.querySelector('h3').textContent.toLowerCase();
                const description = item.querySelector('p').textContent.toLowerCase();
                
                if (name.includes(query) || description.includes(query)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
}

// ============ ITEM DETAILS MODAL ============
function openItemDetails(itemId) {
    const modal = document.getElementById('item-details-modal');
    if (!modal) return;
    
    // Sample item data (in real app, fetch from API)
    const item = {
        name: 'Tonkotsu Ramen',
        price: 299,
        image: 'pic 1.webp',
        rating: 4.8,
        reviews: 124,
        time: '20 min',
        description: 'Rich pork bone broth simmered for 24 hours with chashu pork, soft-boiled egg, green onions, and nori sheets. This authentic recipe has been passed down through generations.',
        ingredients: ['Pork bone broth', 'Chashu pork', 'Ramen noodles', 'Soft-boiled egg', 'Green onions', 'Nori sheets', 'Bamboo shoots', 'Garlic oil'],
        tags: ['🔥 Bestseller', '⭐ Chef\'s Choice']
    };
    
    
    
    // Populate modal
    document.getElementById('modal-image').src = item.image;
    document.getElementById('modal-title').textContent = item.name;
    document.getElementById('modal-price').textContent = `₹ ${item.price}`;
    document.getElementById('modal-description').textContent = item.description;
    document.getElementById('modal-time').textContent = item.time;
    document.getElementById('modal-rating').innerHTML = renderStars(item.rating) + ` <span class="text-gray-400 ml-1">(${item.reviews} reviews)</span>`;
    
    // Tags
    const tagsContainer = document.getElementById('modal-tags');
    tagsContainer.innerHTML = item.tags.map(tag => 
        `<span class="food-tag bg-yellow-500 text-white">${tag}</span>`
    ).join('');
    
    // Ingredients
    const ingredientsList = document.getElementById('modal-ingredients');
    ingredientsList.innerHTML = item.ingredients.map(ing => `<li>${ing}</li>`).join('');
    
    // Update add button
    const addBtn = document.getElementById('modal-add-btn');
    addBtn.innerHTML = `<i class="fas fa-shopping-cart mr-2"></i> Add to Order - ₹${item.price}`;
    addBtn.setAttribute('data-name', item.name);
    addBtn.setAttribute('data-price', item.price);
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeItemDetails() {
    const modal = document.getElementById('item-details-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function addToCartFromModal() {
    const addBtn = document.getElementById('modal-add-btn');
    const name = addBtn.getAttribute('data-name');
    const price = parseInt(addBtn.getAttribute('data-price'));
    
    // Get customizations
    const quantity = parseInt(document.querySelector('#item-details-modal .text-lg.font-bold').textContent) || 1;
    const spiceLevel = document.querySelector('#item-details-modal input[name="spice"]:checked')?.value || 'mild';
    
    // Calculate add-ons
    let addOnPrice = 0;
    document.querySelectorAll('#item-details-modal input[type="checkbox"]:checked').forEach(checkbox => {
        const priceMatch = checkbox.nextElementSibling.textContent.match(/\+₹(\d+)/);
        if (priceMatch) addOnPrice += parseInt(priceMatch[1]);
    });
    
    const totalPrice = (price + addOnPrice) * quantity;
    
    addToCart(name, totalPrice, {
        quantity: quantity,
        spiceLevel: spiceLevel,
        addOns: Array.from(document.querySelectorAll('#item-details-modal input[type="checkbox"]:checked'))
            .map(cb => cb.nextElementSibling.textContent.split(' (+')[0])
    });
    
    closeItemDetails();
    showNotification('Item added to cart!', 'success');
}

// ============ CART SYSTEM ============
function addToCart(name, price, options = {}) {
    const existingItem = cart.find(item => item.name === name && JSON.stringify(item.options) === JSON.stringify(options));
    
    if (existingItem) {
        existingItem.quantity += options.quantity || 1;
    } else {
        cart.push({
            id: Date.now(),
            name: name,
            price: price,
            quantity: options.quantity || 1,
            options: options
        });
    }
    
    updateCartCount();
    saveCart();
    showNotification(`${name} added to cart!`, 'success');
    
    // Add animation effect
    animateAddToCart();
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartCount();
    saveCart();
    refreshCartPage();
    showNotification('Item removed from cart', 'info');
}

function updateCartQuantity(itemId, newQuantity) {
    const item = cart.find(item => item.id === itemId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(itemId);
        } else {
            item.quantity = newQuantity;
            updateCartCount();
            saveCart();
            refreshCartPage();
        }
    }
}

function clearCart() {
    cart = [];
    updateCartCount();
    saveCart();
    refreshCartPage();
    showNotification('Cart cleared', 'info');
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = count;
        cartCountElement.style.display = count > 0 ? 'flex' : 'none';
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function refreshCartPage() {
    const cartDetails = document.getElementById('cart-details');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTax = document.getElementById('cart-tax');
    const cartTotal = document.getElementById('cart-total');
    
    if (!cartDetails) return;
    
    if (cart.length === 0) {
        cartDetails.innerHTML = `
            <div class="text-gray-400 text-center py-8">
                <i class="fas fa-shopping-cart text-4xl mb-4 opacity-50"></i>
                <p>Your cart is empty</p>
                <p class="text-sm">Add some delicious items to get started</p>
            </div>`;
        return;
    }
    
    cartDetails.innerHTML = cart.map(item => `
        <div class="flex items-center p-4 border border-gray-700 rounded-lg">
            <img src="/api/placeholder/80/80" alt="${item.name}" class="w-20 h-20 object-cover rounded-lg mr-4">
            <div class="flex-1">
                <h3 class="font-bold mb-1">${item.name}</h3>
                <p class="text-gray-400 text-sm mb-2">₹${item.price} each</p>
                ${item.options && item.options.addOns ? 
                    `<p class="text-xs text-yellow-400">+ ${item.options.addOns.join(', ')}</p>` : ''}
                <div class="flex items-center space-x-4">
                    <div class="flex items-center border border-gray-600 rounded">
                        <button class="px-3 py-1 hover:bg-gray-700" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span class="px-3 py-1">${item.quantity}</span>
                        <button class="px-3 py-1 hover:bg-gray-700" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                    <span class="font-bold">₹${item.price * item.quantity}</span>
                </div>
            </div>
            <button class="text-red-500 hover:text-red-400 ml-4" onclick="removeFromCart(${item.id})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    // Calculate totals
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + tax + 29; // +29 for delivery
    
    if (cartSubtotal) cartSubtotal.textContent = `₹${subtotal}`;
    if (cartTax) cartTax.textContent = `₹${tax}`;
    if (cartTotal) cartTotal.textContent = `₹${total}`;
}

function animateAddToCart() {
    const cartIcon = document.querySelector('.fa-shopping-cart').parentElement;
    cartIcon.classList.add('animate-bounce');
    setTimeout(() => cartIcon.classList.remove('animate-bounce'), 500);
}

// ============ CHECKOUT & PAYMENT SYSTEM ============
function showCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'warning');
        return;
    }
    
    const modal = document.getElementById('checkout-modal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        populateCheckoutSummary();
    }
}

function closeCheckout() {
    const modal = document.getElementById('checkout-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function populateCheckoutSummary() {
    // This would populate the checkout summary with cart items
    console.log('Populating checkout summary...');
}

function initializePaymentMethods() {
    // Setup payment method handlers
    const paymentMethods = {
        upi: setupUPIPayment,
        card: setupCardPayment,
        netbanking: setupNetBanking,
        wallet: setupWalletPayment,
        cod: setupCOD
    };
    
    Object.entries(paymentMethods).forEach(([method, handler]) => {
        const radio = document.querySelector(`input[name="payment"][value="${method}"]`);
        if (radio) {
            radio.addEventListener('change', handler);
        }
    });
}

function handlePaymentMethodChange(event) {
    const method = event.target.value;
    
    // Hide all payment forms
    document.querySelectorAll('#card-form, #upi-form').forEach(form => {
        form.style.display = 'none';
    });
    
    // Show relevant form
    if (method === 'card') {
        document.getElementById('card-form').style.display = 'block';
    } else if (method === 'upi') {
        document.getElementById('upi-form').style.display = 'block';
    }
    
    // Update COD fee
    const codFee = document.getElementById('cod-fee');
    if (codFee) {
        codFee.textContent = method === 'cod' ? '₹5' : '₹0';
    }
}

function setupUPIPayment() {
    console.log('UPI payment selected');
}

function setupCardPayment() {
    console.log('Card payment selected');
    // Add card number formatting
    const cardInput = document.querySelector('#card-form input[placeholder*="1234"]');
    if (cardInput) {
        cardInput.addEventListener('input', formatCardNumber);
    }
}

function formatCardNumber(event) {
    let value = event.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    if (formattedValue !== event.target.value) {
        event.target.value = formattedValue;
    }
}

function setupNetBanking() {
    console.log('Net banking selected');
}

function setupWalletPayment() {
    console.log('Wallet payment selected');
}

function setupCOD() {
    console.log('COD selected');
}

function handleDeliveryOptionChange(event) {
    const option = event.target.value;
    const addressSection = document.getElementById('address-section');
    
    if (option === 'pickup' || option === 'dine-in') {
        addressSection.style.display = 'none';
    } else {
        addressSection.style.display = 'block';
    }
}

function processPayment() {
    const paymentMethod = document.querySelector('input[name="payment"]:checked')?.value;
    const termsAccepted = document.querySelector('#checkout-modal input[type="checkbox"]:checked');
    
    if (!termsAccepted) {
        showNotification('Please accept Terms & Conditions', 'error');
        return;
    }
    
    if (!paymentMethod) {
        showNotification('Please select a payment method', 'error');
        return;
    }
    
    // Create order
    const order = createOrder(paymentMethod);
    
    // Process based on payment method
    switch(paymentMethod) {
        case 'upi':
            processUPIPayment(order);
            break;
        case 'card':
            processCardPayment(order);
            break;
        case 'cod':
            processCODOrder(order);
            break;
        default:
            processOnlinePayment(order);
    }
}

function createOrder(paymentMethod) {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = Math.round(subtotal * 0.05);
    const deliveryFee = 29;
    const codFee = paymentMethod === 'cod' ? 5 : 0;
    const total = subtotal + tax + deliveryFee + codFee;
    
    const order = {
        id: 'ORD-' + Date.now(),
        items: [...cart],
        subtotal: subtotal,
        tax: tax,
        deliveryFee: deliveryFee,
        codFee: codFee,
        total: total,
        paymentMethod: paymentMethod,
        status: 'pending',
        timestamp: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 45 * 60000).toISOString(), // 45 minutes
        customerInfo: getCurrentCustomerInfo(),
        trackingSteps: [
            { step: 'Order Placed', time: new Date().toISOString(), completed: true },
            { step: 'Order Confirmed', time: null, completed: false },
            { step: 'Preparing', time: null, completed: false },
            { step: 'Out for Delivery', time: null, completed: false },
            { step: 'Delivered', time: null, completed: false }
        ]
    };
    
    return order;
}

function getCurrentCustomerInfo() {
    return {
        name: currentUser?.name || 'Guest Customer',
        phone: document.querySelector('#checkout-modal input[type="tel"]')?.value || '',
        email: document.querySelector('#checkout-modal input[type="email"]')?.value || '',
        address: document.querySelector('input[name="address"]:checked')?.nextElementSibling?.textContent || ''
    };
}

function processUPIPayment(order) {
    showPaymentProcessing();
    
    // Simulate UPI payment flow
    setTimeout(() => {
        hidePaymentProcessing();
        
        // Show UPI QR code or redirect to UPI app
        showUPIInterface(order);
    }, 1000);
}

function showUPIInterface(order) {
    const upiModal = createUPIModal(order);
    document.body.appendChild(upiModal);
    
    // Simulate payment confirmation after 10 seconds
    setTimeout(() => {
        confirmPayment(order);
        document.body.removeChild(upiModal);
    }, 10000);
}

function createUPIModal(order) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-gray-900 rounded-lg p-8 max-w-md w-full mx-4 text-center">
            <h3 class="text-xl font-bold mb-4">UPI Payment</h3>
            <div class="bg-white p-4 rounded-lg mb-4">
                <div class="text-black text-xs">QR Code placeholder</div>
                <div class="w-48 h-48 bg-gray-200 mx-auto"></div>
            </div>
            <p class="text-gray-300 mb-4">Scan QR code with any UPI app</p>
            <p class="text-yellow-500 font-bold">Amount: ₹${order.total}</p>
            <div class="mt-4">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto"></div>
                <p class="text-sm text-gray-400 mt-2">Waiting for payment...</p>
            </div>
        </div>
    `;
    return modal;
}

function processCardPayment(order) {
    // Validate card details
    const cardNumber = document.querySelector('#card-form input[placeholder*="1234"]')?.value;
    const expiryDate = document.querySelector('#card-form input[placeholder="MM/YY"]')?.value;
    const cvv = document.querySelector('#card-form input[placeholder="123"]')?.value;
    const cardholderName = document.querySelector('#card-form input[placeholder="John Doe"]')?.value;
    
    if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
        showNotification('Please fill all card details', 'error');
        return;
    }
    
    showPaymentProcessing();
    
    // Simulate card payment processing
    setTimeout(() => {
        hidePaymentProcessing();
        
        // Random success/failure for demo
        if (Math.random() > 0.1) { // 90% success rate
            confirmPayment(order);
        } else {
            showNotification('Payment failed. Please try again.', 'error');
        }
    }, 3000);
}

function processCODOrder(order) {
    order.status = 'confirmed';
    confirmPayment(order);
}

function processOnlinePayment(order) {
    showPaymentProcessing();
    
    setTimeout(() => {
        hidePaymentProcessing();
        confirmPayment(order);
    }, 2000);
}

function confirmPayment(order) {
    // Add order to orders list
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Clear cart
    cart = [];
    saveCart();
    updateCartCount();
    
    // Close checkout
    closeCheckout();
    
    // Show success and start tracking
    showOrderConfirmation(order);
    startOrderTracking(order);
}

function showPaymentProcessing() {
    const processing = document.createElement('div');
    processing.id = 'payment-processing';
    processing.className = 'fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50';
    processing.innerHTML = `
        <div class="bg-gray-900 rounded-lg p-8 text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
            <h3 class="text-xl font-bold mb-2">Processing Payment</h3>
            <p class="text-gray-400">Please wait while we process your payment...</p>
        </div>
    `;
    document.body.appendChild(processing);
}

function hidePaymentProcessing() {
    const processing = document.getElementById('payment-processing');
    if (processing) {
        document.body.removeChild(processing);
    }
}

// ============ ORDER TRACKING SYSTEM ============
function startOrderTrackingSystem() {
    // Check for active orders and update their status
    setInterval(updateActiveOrders, 30000); // Check every 30 seconds
}

function updateActiveOrders() {
    const activeOrders = orders.filter(order => order.status !== 'delivered' && order.status !== 'cancelled');
    
    activeOrders.forEach(order => {
        updateOrderStatus(order);
    });
}

function updateOrderStatus(order) {
    const now = new Date();
    const orderTime = new Date(order.timestamp);
    const minutesElapsed = (now - orderTime) / (1000 * 60);
    
    // Simulate order progression
    if (minutesElapsed >= 2 && !order.trackingSteps[1].completed) {
        completeTrackingStep(order, 1, 'Order Confirmed');
    }
    if (minutesElapsed >= 5 && !order.trackingSteps[2].completed) {
        completeTrackingStep(order, 2, 'Preparing your delicious meal');
    }
    if (minutesElapsed >= 25 && !order.trackingSteps[3].completed) {
        completeTrackingStep(order, 3, 'Out for delivery');
    }
    if (minutesElapsed >= 45 && !order.trackingSteps[4].completed) {
        completeTrackingStep(order, 4, 'Delivered! Enjoy your meal');
        order.status = 'delivered';
    }
    
    // Save updated orders
    localStorage.setItem('orders', JSON.stringify(orders));
}

function completeTrackingStep(order, stepIndex, message) {
    order.trackingSteps[stepIndex].completed = true;
    order.trackingSteps[stepIndex].time = new Date().toISOString();
    
    // Send notification
    showNotification(`Order ${order.id}: ${message}`, 'success');
    
    // Update tracking display if visible
    updateTrackingDisplay(order);
}

function startOrderTracking(order) {
    currentOrder = order;
    showOrderTrackingModal(order);
}

function showOrderTrackingModal(order) {
    const modal = createOrderTrackingModal(order);
    document.body.appendChild(modal);
    
    // Auto-close after 10 seconds or when user clicks close
    setTimeout(() => {
        if (document.getElementById('order-tracking-modal')) {
            closeOrderTracking();
        }
    }, 10000);
}

function createOrderTrackingModal(order) {
    const modal = document.createElement('div');
    modal.id = 'order-tracking-modal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-gray-900 rounded-lg max-w-md w-full mx-4 overflow-hidden">
            <div class="bg-gradient-to-r from-green-600 to-green-500 p-6 text-center">
                <div class="text-4xl mb-2">🎉</div>
                <h3 class="text-xl font-bold text-white mb-2">Order Confirmed!</h3>
                <p class="text-green-100">Order ID: ${order.id}</p>
            </div>
            
            <div class="p-6">
                <div class="text-center mb-6">
                    <div class="text-2xl font-bold gold-text mb-2">₹${order.total}</div>
                    <p class="text-gray-400">Estimated delivery: 30-45 minutes</p>
                </div>
                
                <div class="space-y-4 mb-6">
                    ${order.trackingSteps.map((step, index) => `
                        <div class="flex items-center">
                            <div class="w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                                step.completed ? 'bg-green-500' : 'bg-gray-600'
                            }">
                                ${step.completed ? '✓' : index + 1}
                            </div>
                            <div class="flex-1">
                                <div class="font-medium ${step.completed ? 'text-green-400' : 'text-gray-400'}">${step.step}</div>
                                ${step.time ? `<div class="text-xs text-gray-500">${formatTime(step.time)}</div>` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="flex space-x-3">
                    <button onclick="closeOrderTracking()" class="flex-1 border border-gray-600 py-2 px-4 rounded-md hover:bg-gray-700">Close</button>
                    <button onclick="showDetailedTracking('${order.id}')" class="flex-1 gradient-btn py-2 px-4 text-white rounded-md">Track Order</button>
                </div>
                
                <div class="mt-4 text-center text-sm text-gray-400">
                    <p>Need help? Call us at (+91) 9878685848</p>
                </div>
            </div>
        </div>
    `;
    return modal;
}

function updateTrackingDisplay(order) {
    const modal = document.getElementById('order-tracking-modal');
    if (modal && currentOrder && currentOrder.id === order.id) {
        // Update the modal content
        const newModal = createOrderTrackingModal(order);
        modal.innerHTML = newModal.innerHTML;
    }
}

function closeOrderTracking() {
    const modal = document.getElementById('order-tracking-modal');
    if (modal) {
        document.body.removeChild(modal);
    }
}

function showDetailedTracking(orderId) {
    closeOrderTracking();
    
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const modal = createDetailedTrackingModal(order);
    document.body.appendChild(modal);
}

function createDetailedTrackingModal(order) {
    const modal = document.createElement('div');
    modal.id = 'detailed-tracking-modal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-gray-900 rounded-lg max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <div class="p-6 border-b border-gray-700">
                <div class="flex justify-between items-center">
                    <h3 class="text-xl font-bold">Order Tracking</h3>
                    <button onclick="closeDetailedTracking()" class="text-gray-400 hover:text-white">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
            </div>
            
            <div class="p-6">
                <!-- Order Info -->
                <div class="bg-gray-800 rounded-lg p-4 mb-6">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <div class="text-sm text-gray-400">Order ID</div>
                            <div class="font-bold">${order.id}</div>
                        </div>
                        <div>
                            <div class="text-sm text-gray-400">Total Amount</div>
                            <div class="font-bold gold-text">₹${order.total}</div>
                        </div>
                        <div>
                            <div class="text-sm text-gray-400">Order Time</div>
                            <div class="font-medium">${formatDateTime(order.timestamp)}</div>
                        </div>
                        <div>
                            <div class="text-sm text-gray-400">Estimated Delivery</div>
                            <div class="font-medium">${formatTime(order.estimatedDelivery)}</div>
                        </div>
                    </div>
                </div>
                
                <!-- Live Tracking -->
                <div class="mb-6">
                    <h4 class="text-lg font-bold mb-4">🚚 Live Tracking</h4>
                    <div class="relative">
                        ${order.trackingSteps.map((step, index) => `
                            <div class="flex items-start mb-6 relative">
                                ${index < order.trackingSteps.length - 1 ? 
                                    `<div class="absolute left-4 top-8 w-0.5 h-16 ${step.completed ? 'bg-green-500' : 'bg-gray-600'}"></div>` : ''}
                                <div class="w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                                    step.completed ? 'bg-green-500 text-white' : 'bg-gray-600 text-gray-300'
                                }">
                                    ${step.completed ? '✓' : index + 1}
                                </div>
                                <div class="flex-1">
                                    <div class="font-medium ${step.completed ? 'text-green-400' : 'text-gray-400'}">${step.step}</div>
                                    ${step.time ? `<div class="text-sm text-gray-500">${formatDateTime(step.time)}</div>` : 
                                        `<div class="text-sm text-gray-500">Pending</div>`}
                                    ${getStepDescription(step.step, step.completed)}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Order Items -->
                <div class="mb-6">
                    <h4 class="text-lg font-bold mb-4">📦 Order Items</h4>
                    <div class="space-y-3">
                        ${order.items.map(item => `
                            <div class="flex justify-between items-center p-3 bg-gray-800 rounded">
                                <div>
                                    <div class="font-medium">${item.name}</div>
                                    <div class="text-sm text-gray-400">Qty: ${item.quantity}</div>
                                </div>
                                <div class="font-bold">₹${item.price * item.quantity}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Delivery Info -->
                <div class="mb-6">
                    <h4 class="text-lg font-bold mb-4">🏠 Delivery Information</h4>
                    <div class="bg-gray-800 rounded-lg p-4">
                        <div class="mb-2">
                            <span class="text-gray-400">Customer:</span>
                            <span class="font-medium ml-2">${order.customerInfo.name}</span>
                        </div>
                        <div class="mb-2">
                            <span class="text-gray-400">Phone:</span>
                            <span class="font-medium ml-2">${order.customerInfo.phone}</span>
                        </div>
                        <div class="mb-2">
                            <span class="text-gray-400">Address:</span>
                            <span class="font-medium ml-2">${order.customerInfo.address}</span>
                        </div>
                    </div>
                </div>
                
                <!-- Actions -->
                <div class="flex space-x-3">
                    <button onclick="callRestaurant()" class="flex-1 gradient-btn py-3 text-white rounded-md">
                        <i class="fas fa-phone mr-2"></i> Call Restaurant
                    </button>
                    <button onclick="cancelOrder('${order.id}')" class="flex-1 border border-red-500 text-red-500 py-3 rounded-md hover:bg-red-500 hover:text-white">
                        <i class="fas fa-times mr-2"></i> Cancel Order
                    </button>
                </div>
            </div>
        </div>
    `;
    return modal;
}

function getStepDescription(step, completed) {
    const descriptions = {
        'Order Placed': completed ? 'Your order has been received and is being processed.' : '',
        'Order Confirmed': completed ? 'Restaurant has confirmed your order and started preparation.' : '',
        'Preparing': completed ? 'Our chefs are carefully preparing your delicious meal.' : '',
        'Out for Delivery': completed ? 'Your order is on the way! Our delivery partner will reach you soon.' : '',
        'Delivered': completed ? 'Your order has been delivered. Enjoy your meal!' : ''
    };
    
    return descriptions[step] ? `<div class="text-xs text-gray-500 mt-1">${descriptions[step]}</div>` : '';
}

function closeDetailedTracking() {
    const modal = document.getElementById('detailed-tracking-modal');
    if (modal) {
        document.body.removeChild(modal);
    }
}

function callRestaurant() {
    window.location.href = 'tel:+919878685848';
}

function cancelOrder(orderId) {
    if (confirm('Are you sure you want to cancel this order?')) {
        const order = orders.find(o => o.id === orderId);
        if (order) {
            order.status = 'cancelled';
            localStorage.setItem('orders', JSON.stringify(orders));
            closeDetailedTracking();
            showNotification('Order cancelled successfully', 'info');
        }
    }
}

// ============ ORDER CONFIRMATION & SUCCESS ============
function showOrderConfirmation(order) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm';
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-check-circle text-2xl mr-3"></i>
            <div>
                <div class="font-bold">Order Placed Successfully!</div>
                <div class="text-sm">Order ID: ${order.id}</div>
                <div class="text-sm">Est. delivery: 30-45 min</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
        }
    }, 5000);
}

// ============ USER AUTHENTICATION SYSTEM ============
function loadUserSession() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateUserInterface();
    }
}

function updateUserInterface() {
    const userMenu = document.getElementById('user-menu');
    if (userMenu && currentUser) {
        userMenu.innerHTML = `
            <a href="#" onclick="showAccountPage()" class="block px-4 py-2 hover:bg-gray-700 rounded-t-lg">
                <i class="fas fa-user mr-2"></i> ${currentUser.name}
            </a>
            <a href="#" onclick="showOrderHistory()" class="block px-4 py-2 hover:bg-gray-700">
                <i class="fas fa-history mr-2"></i> Order History
            </a>
            <a href="#" onclick="showAccountPage()" class="block px-4 py-2 hover:bg-gray-700">
                <i class="fas fa-cog mr-2"></i> Account Settings
            </a>
            <a href="#" onclick="logout()" class="block px-4 py-2 hover:bg-gray-700 rounded-b-lg text-red-400">
                <i class="fas fa-sign-out-alt mr-2"></i> Logout
            </a>
        `;
    }
}

function toggleUserMenu() {
    const userMenu = document.getElementById('user-menu');
    if (userMenu) {
        userMenu.style.display = userMenu.style.display === 'none' ? 'block' : 'none';
    }
}

// Hide user menu when clicking outside
document.addEventListener('click', function(event) {
    const userMenu = document.getElementById('user-menu');
    const userButton = event.target.closest('.fa-user-circle');
    
    if (userMenu && !userButton && !userMenu.contains(event.target)) {
        userMenu.style.display = 'none';
    }
});

function handleLogin(event) {
    event.preventDefault();
    
    const email = event.target.querySelector('input[type="email"]').value;
    const password = event.target.querySelector('input[type="password"]').value;
    
    if (!email || !password) {
        showNotification('Please fill all fields', 'error');
        return;
    }
    
    // Simulate login (in real app, make API call)
    setTimeout(() => {
        currentUser = {
            id: 1,
            name: 'John Doe',
            email: email,
            phone: '+91 9876543210',
            loyaltyPoints: 2450
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateUserInterface();
        showHomePage();
        showNotification('Welcome back!', 'success');
    }, 1000);
}

function handleSignup(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const email = formData.get('email');
    const phone = formData.get('phone');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    // Simulate signup
    setTimeout(() => {
        currentUser = {
            id: Date.now(),
            name: `${firstName} ${lastName}`,
            email: email,
            phone: phone,
            loyaltyPoints: 0
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateUserInterface();
        showHomePage();
        showNotification('Account created successfully!', 'success');
    }, 1000);
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateUserInterface();
    showHomePage();
    showNotification('Logged out successfully', 'info');
}

// ============ ACCOUNT MANAGEMENT ============
function initializeAccountPage() {
    if (!currentUser) {
        showLoginPage();
        return;
    }
    
    // Load user orders
    loadUserOrders();
    showAccountSection('profile');
}

function showAccountSection(section) {
    // Hide all sections
    document.querySelectorAll('.account-section').forEach(sec => {
        sec.style.display = 'none';
    });
    
    // Show selected section
    const targetSection = document.getElementById(`account-${section}`);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
    
    // Update navigation
    document.querySelectorAll('.account-nav-btn').forEach(btn => {
        btn.classList.remove('active', 'bg-gray-700');
    });
    
    const activeBtn = document.querySelector(`[onclick="showAccountSection('${section}')"]`);
    if (activeBtn) {
        activeBtn.classList.add('active', 'bg-gray-700');
    }
    
    // Load section-specific data
    switch(section) {
        case 'orders':
            loadOrderHistory();
            break;
        case 'favorites':
            loadFavorites();
            break;
        case 'loyalty':
            loadLoyaltyInfo();
            break;
        case 'reviews':
            loadUserReviews();
            break;
    }
}

function loadUserOrders() {
    const userOrders = orders.filter(order => order.customerInfo.email === currentUser?.email);
    console.log('User orders:', userOrders);
}

function loadOrderHistory() {
    const userOrders = orders.filter(order => order.customerInfo.email === currentUser?.email);
    const ordersContainer = document.querySelector('#account-orders .space-y-4');
    
    if (!ordersContainer) return;
    
    if (userOrders.length === 0) {
        ordersContainer.innerHTML = `
            <div class="text-center py-8 text-gray-400">
                <i class="fas fa-shopping-bag text-4xl mb-4 opacity-50"></i>
                <p>No orders yet</p>
                <button onclick="showOrderPage()" class="gradient-btn px-4 py-2 text-white mt-4 rounded-md">Start Ordering</button>
            </div>
        `;
        return;
    }
    
    ordersContainer.innerHTML = userOrders.map(order => `
        <div class="border border-gray-700 rounded-lg p-4">
            <div class="flex justify-between items-start mb-3">
                <div>
                    <h3 class="font-bold">${order.id}</h3>
                    <p class="text-gray-400 text-sm">${formatDateTime(order.timestamp)}</p>
                </div>
                <span class="food-tag ${getStatusColor(order.status)} text-white">${order.status}</span>
            </div>
            <div class="space-y-2 mb-3">
                ${order.items.map(item => `
                    <div class="flex justify-between">
                        <span>${item.quantity}x ${item.name}</span>
                        <span>₹${item.price * item.quantity}</span>
                    </div>
                `).join('')}
            </div>
            <div class="flex justify-between items-center border-t border-gray-700 pt-3">
                <span class="font-bold">Total: ₹${order.total}</span>
                <div class="space-x-2">
                    <button onclick="reorderItems('${order.id}')" class="text-yellow-500 text-sm hover:underline">Reorder</button>
                    <button onclick="showDetailedTracking('${order.id}')" class="text-yellow-500 text-sm hover:underline">Track</button>
                    ${order.status === 'delivered' ? '<button onclick="showReviewModal(\'' + order.id + '\')" class="text-yellow-500 text-sm hover:underline">Review</button>' : ''}
                </div>
            </div>
        </div>
    `).join('');
}

function getStatusColor(status) {
    const colors = {
        'pending': 'bg-yellow-500',
        'confirmed': 'bg-blue-500',
        'preparing': 'bg-orange-500',
        'out-for-delivery': 'bg-purple-500',
        'delivered': 'bg-green-500',
        'cancelled': 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
}

function reorderItems(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    // Add all items to cart
    order.items.forEach(item => {
        addToCart(item.name, item.price, { quantity: item.quantity });
    });
    
    showNotification('Items added to cart!', 'success');
    showCartPage();
}

function loadFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favoritesContainer = document.querySelector('#account-favorites .grid');
    
    if (!favoritesContainer) return;
    
    if (favorites.length === 0) {
        favoritesContainer.innerHTML = `
            <div class="col-span-2 text-center py-8 text-gray-400">
                <i class="fas fa-heart text-4xl mb-4 opacity-50"></i>
                <p>No favorites yet</p>
                <p class="text-sm">Heart items you love to save them here</p>
            </div>
        `;
        return;
    }
    
    // Render favorites (placeholder for now)
    console.log('Loading favorites:', favorites);
}

function loadLoyaltyInfo() {
    if (!currentUser) return;
    
    const pointsDisplay = document.querySelector('#account-loyalty .text-4xl');
    if (pointsDisplay) {
        pointsDisplay.textContent = currentUser.loyaltyPoints || 0;
    }
}

// ============ NOTIFICATION SYSTEM ============
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm ${getNotificationColor(type)}`;
    
    const icon = getNotificationIcon(type);
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="${icon} mr-3"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-3 text-white hover:text-gray-200">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
    
    // Store notification
    notifications.unshift({
        message: message,
        type: type,
        timestamp: new Date().toISOString()
    });
    
    // Keep only last 50 notifications
    notifications = notifications.slice(0, 50);
}

function getNotificationColor(type) {
    const colors = {
        'success': 'bg-green-600 text-white',
        'error': 'bg-red-600 text-white',
        'warning': 'bg-yellow-600 text-white',
        'info': 'bg-blue-600 text-white'
    };
    return colors[type] || colors.info;
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'fas fa-check-circle',
        'error': 'fas fa-exclamation-circle',
        'warning': 'fas fa-exclamation-triangle',
        'info': 'fas fa-info-circle'
    };
    return icons[type] || icons.info;
}

function loadNotifications() {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
        notifications = JSON.parse(savedNotifications);
    }
}

// ============ FORM VALIDATION ============
function setupFormValidation() {
    // Email validation
    document.querySelectorAll('input[type="email"]').forEach(input => {
        input.addEventListener('blur', validateEmail);
    });
    
    // Phone validation
    document.querySelectorAll('input[type="tel"]').forEach(input => {
        input.addEventListener('blur', validatePhone);
        input.addEventListener('input', formatPhoneNumber);
    });
    
    // Password strength
    document.querySelectorAll('input[type="password"]').forEach(input => {
        input.addEventListener('input', checkPasswordStrength);
    });
}

function validateEmail(event) {
    const email = event.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && !emailRegex.test(email)) {
        showFieldError(event.target, 'Please enter a valid email address');
    } else {
        clearFieldError(event.target);
    }
}

function validatePhone(event) {
    const phone = event.target.value;
    const phoneRegex = /^[\+]?[1-9][\d]{9,15}$/;
    
    if (phone && !phoneRegex.test(phone.replace(/\s/g, ''))) {
       showFieldError(event.target, 'Please enter a valid phone number');
    } else {
        clearFieldError(event.target);
    }
}

function formatPhoneNumber(event) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 10) {
        value = value.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    }
    event.target.value = value;
}

function checkPasswordStrength(event) {
    const password = event.target.value;
    const strengthIndicator = event.target.parentElement.querySelector('.password-strength');
    
    if (!strengthIndicator) return;
    
    const strength = calculatePasswordStrength(password);
    strengthIndicator.className = `password-strength ${strength.class}`;
    strengthIndicator.textContent = strength.text;
}

function calculatePasswordStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    const levels = [
        { class: 'text-red-500', text: 'Very Weak' },
        { class: 'text-red-400', text: 'Weak' },
        { class: 'text-yellow-500', text: 'Fair' },
        { class: 'text-blue-500', text: 'Good' },
        { class: 'text-green-500', text: 'Strong' }
    ];
    
    return levels[score] || levels[0];
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error text-red-500 text-sm mt-1';
    errorDiv.textContent = message;
    
    field.parentElement.appendChild(errorDiv);
    field.classList.add('border-red-500');
}

function clearFieldError(field) {
    const errorDiv = field.parentElement.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
    field.classList.remove('border-red-500');
}

// ============ KEYBOARD SHORTCUTS ============
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(event) {
        // Ctrl/Cmd + shortcuts
        if (event.ctrlKey || event.metaKey) {
            switch(event.key) {
                case 'h':
                    event.preventDefault();
                    showHomePage();
                    break;
                case 'm':
                    event.preventDefault();
                    showMenuPage();
                    break;
                case 'c':
                    event.preventDefault();
                    showCartPage();
                    break;
                case '/':
                    event.preventDefault();
                    focusSearchInput();
                    break;
            }
        }
        
        // Escape key
        if (event.key === 'Escape') {
            closeAllModals();
        }
    });
}

function focusSearchInput() {
    const searchInput = document.querySelector('input[placeholder*="Search"]');
    if (searchInput) {
        searchInput.focus();
    }
}

function closeAllModals() {
    const modals = document.querySelectorAll('[id$="-modal"]');
    modals.forEach(modal => {
        if (modal.style.display !== 'none') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// ============ UTILITY FUNCTIONS ============
function formatTime(timeString) {
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
}

function formatDateTime(timeString) {
    const date = new Date(timeString);
    return date.toLocaleString('en-US', { 
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
}

function formatDate(timeString) {
    const date = new Date(timeString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function generateOrderId() {
    return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
}

function calculateDeliveryTime() {
    const now = new Date();
    const deliveryTime = new Date(now.getTime() + (30 + Math.random() * 20) * 60000); // 30-50 minutes
    return deliveryTime.toISOString();
}

function getRandomDeliveryPerson() {
    const deliveryPeople = [
        { name: 'Rahul Kumar', phone: '+91 9876543210', rating: 4.8 },
        { name: 'Priya Sharma', phone: '+91 9876543211', rating: 4.9 },
        { name: 'Amit Singh', phone: '+91 9876543212', rating: 4.7 },
        { name: 'Neha Gupta', phone: '+91 9876543213', rating: 4.6 }
    ];
    
    return deliveryPeople[Math.floor(Math.random() * deliveryPeople.length)];
}

// ============ REVIEW SYSTEM ============
function showReviewModal(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const modal = createReviewModal(order);
    document.body.appendChild(modal);
}

function createReviewModal(order) {
    const modal = document.createElement('div');
    modal.id = 'review-modal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-gray-900 rounded-lg max-w-md w-full mx-4">
            <div class="p-6 border-b border-gray-700">
                <div class="flex justify-between items-center">
                    <h3 class="text-xl font-bold">Rate Your Order</h3>
                    <button onclick="closeReviewModal()" class="text-gray-400 hover:text-white">
                        <i class="fas fa-times text-xl"></i>
                    </button>
                </div>
            </div>
            
            <div class="p-6">
                <div class="text-center mb-6">
                    <div class="text-sm text-gray-400 mb-2">Order ${order.id}</div>
                    <div class="text-lg font-medium mb-4">How was your experience?</div>
                    
                    <!-- Overall Rating -->
                    <div class="mb-6">
                        <div class="text-sm text-gray-400 mb-2">Overall Rating</div>
                        <div class="flex justify-center space-x-2 mb-4">
                            ${[1,2,3,4,5].map(star => `
                                <button onclick="setRating(${star})" class="rating-star text-2xl text-gray-600 hover:text-yellow-500" data-rating="${star}">
                                    <i class="fas fa-star"></i>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Food Items Rating -->
                    <div class="space-y-4 mb-6">
                        ${order.items.map((item, index) => `
                            <div class="text-left">
                                <div class="font-medium mb-2">${item.name}</div>
                                <div class="flex justify-between items-center">
                                    <span class="text-sm text-gray-400">Food Quality</span>
                                    <div class="flex space-x-1">
                                        ${[1,2,3,4,5].map(star => `
                                            <button onclick="setItemRating(${index}, 'quality', ${star})" class="item-rating-star text-yellow-600 hover:text-yellow-500" data-item="${index}" data-type="quality" data-rating="${star}">
                                                <i class="fas fa-star text-sm"></i>
                                            </button>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <!-- Delivery Rating -->
                    <div class="mb-6">
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-400">Delivery Speed</span>
                            <div class="flex space-x-1">
                                ${[1,2,3,4,5].map(star => `
                                    <button onclick="setDeliveryRating(${star})" class="delivery-rating-star text-blue-600 hover:text-blue-500" data-rating="${star}">
                                        <i class="fas fa-star text-sm"></i>
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <!-- Comments -->
                    <div class="mb-6">
                        <textarea id="review-comments" placeholder="Share your feedback (optional)" class="w-full p-3 bg-gray-800 border border-gray-600 rounded-md resize-none" rows="3"></textarea>
                    </div>
                    
                    <!-- Photo Upload -->
                    <div class="mb-6">
                        <label class="block text-sm text-gray-400 mb-2">Add Photos (optional)</label>
                        <input type="file" multiple accept="image/*" class="w-full p-2 bg-gray-800 border border-gray-600 rounded-md">
                    </div>
                    
                    <button onclick="submitReview('${order.id}')" class="w-full gradient-btn py-3 text-white rounded-md">
                        Submit Review
                    </button>
                </div>
            </div>
        </div>
    `;
    return modal;
}

let currentReview = {
    overall: 0,
    items: {},
    delivery: 0,
    comments: ''
};

function setRating(rating) {
    currentReview.overall = rating;
    updateRatingStars('.rating-star', rating);
}

function setItemRating(itemIndex, type, rating) {
    if (!currentReview.items[itemIndex]) {
        currentReview.items[itemIndex] = {};
    }
    currentReview.items[itemIndex][type] = rating;
    updateRatingStars(`.item-rating-star[data-item="${itemIndex}"][data-type="${type}"]`, rating);
}

function setDeliveryRating(rating) {
    currentReview.delivery = rating;
    updateRatingStars('.delivery-rating-star', rating);
}

function updateRatingStars(selector, rating) {
    document.querySelectorAll(selector).forEach((star, index) => {
        if (index < rating) {
            star.classList.add('text-yellow-500');
            star.classList.remove('text-gray-600');
        } else {
            star.classList.remove('text-yellow-500');
            star.classList.add('text-gray-600');
        }
    });
}

function submitReview(orderId) {
    currentReview.comments = document.getElementById('review-comments').value;
    
    if (currentReview.overall === 0) {
        showNotification('Please provide an overall rating', 'warning');
        return;
    }
    
    // Save review (in real app, send to server)
    const review = {
        orderId: orderId,
        userId: currentUser?.id,
        timestamp: new Date().toISOString(),
        ...currentReview
    };
    
    let reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    reviews.push(review);
    localStorage.setItem('reviews', JSON.stringify(reviews));
    
    closeReviewModal();
    showNotification('Thank you for your feedback!', 'success');
    
    // Reset review data
    currentReview = { overall: 0, items: {}, delivery: 0, comments: '' };
}

function closeReviewModal() {
    const modal = document.getElementById('review-modal');
    if (modal) {
        document.body.removeChild(modal);
    }
}

// ============ LOYALTY PROGRAM ============
function updateLoyaltyPoints(orderTotal) {
    if (!currentUser) return;
    
    // 1 point per ₹10 spent
    const pointsEarned = Math.floor(orderTotal / 10);
    currentUser.loyaltyPoints = (currentUser.loyaltyPoints || 0) + pointsEarned;
    
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    if (pointsEarned > 0) {
        showNotification(`You earned ${pointsEarned} loyalty points!`, 'success');
    }
    
    checkLoyaltyTier();
}

function checkLoyaltyTier() {
    if (!currentUser) return;
    
    const points = currentUser.loyaltyPoints || 0;
    let tier = 'Bronze';
    let nextTier = 'Silver';
    let pointsToNext = 1000 - points;
    
    if (points >= 5000) {
        tier = 'Platinum';
        nextTier = 'Platinum';
        pointsToNext = 0;
    } else if (points >= 2500) {
        tier = 'Gold';
        nextTier = 'Platinum';
        pointsToNext = 5000 - points;
    } else if (points >= 1000) {
        tier = 'Silver';
        nextTier = 'Gold';
        pointsToNext = 2500 - points;
    }
    
    currentUser.loyaltyTier = tier;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    // Update UI if on loyalty page
    const tierDisplay = document.querySelector('#account-loyalty .tier-name');
    if (tierDisplay) {
        tierDisplay.textContent = tier;
    }
}

function redeemLoyaltyPoints(discount) {
    if (!currentUser) return false;
    
    const pointsRequired = discount * 10; // 10 points = ₹1
    
    if (currentUser.loyaltyPoints < pointsRequired) {
        showNotification('Insufficient loyalty points', 'error');
        return false;
    }
    
    currentUser.loyaltyPoints -= pointsRequired;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    showNotification(`₹${discount} discount applied!`, 'success');
    return true;
}

// ============ SEARCH FUNCTIONALITY ============
function setupGlobalSearch() {
    const searchInput = document.querySelector('#global-search');
    if (!searchInput) return;
    
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performGlobalSearch(this.value);
        }, 300);
    });
}

function performGlobalSearch(query) {
    if (query.length < 2) return;
    
    const results = searchMenuItems(query);
    displaySearchResults(results);
}

function searchMenuItems(query) {
    // This would search through menu items
    // For now, return mock results
    return [
        { type: 'menu', name: 'Tonkotsu Ramen', price: 299, category: 'ramen' },
        { type: 'menu', name: 'Spicy Miso Ramen', price: 249, category: 'ramen' }
    ].filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase())
    );
}

function displaySearchResults(results) {
    const resultsContainer = document.getElementById('search-results');
    if (!resultsContainer) return;
    
    if (results.length === 0) {
        resultsContainer.innerHTML = '<div class="p-4 text-gray-400">No results found</div>';
        return;
    }
    
    resultsContainer.innerHTML = results.map(result => `
        <div class="p-3 hover:bg-gray-700 cursor-pointer border-b border-gray-600" onclick="selectSearchResult('${result.type}', '${result.name}')">
            <div class="font-medium">${result.name}</div>
            <div class="text-sm text-gray-400">₹${result.price} • ${result.category}</div>
        </div>
    `).join('');
}

function selectSearchResult(type, name) {
    if (type === 'menu') {
        showMenuPage();
        // Focus on the specific item
        setTimeout(() => {
            const menuItem = document.querySelector(`[data-name="${name}"]`);
            if (menuItem) {
                menuItem.scrollIntoView({ behavior: 'smooth' });
                menuItem.classList.add('highlight');
                setTimeout(() => menuItem.classList.remove('highlight'), 2000);
            }
        }, 500);
    }
    
    // Hide search results
    const resultsContainer = document.getElementById('search-results');
    if (resultsContainer) {
        resultsContainer.innerHTML = '';
    }
}

// ============ PROGRESSIVE WEB APP FEATURES ============
function initializePWA() {
    // Service Worker Registration
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    }
    
    // Install Prompt
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showInstallBanner();
    });
}

function showInstallBanner() {
    const banner = document.createElement('div');
    banner.id = 'install-banner';
    banner.className = 'fixed bottom-4 left-4 right-4 bg-yellow-600 text-black p-4 rounded-lg shadow-lg z-50';
    banner.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <div class="font-bold">Install Anil's Food Zone</div>
                <div class="text-sm">Get faster access and offline features</div>
            </div>
            <div class="space-x-2">
                <button onclick="installApp()" class="bg-black text-yellow-600 px-4 py-2 rounded font-medium">Install</button>
                <button onclick="dismissInstallBanner()" class="text-black">✕</button>
            </div>
        </div>
    `;
    document.body.appendChild(banner);
}

function installApp() {
    const deferredPrompt = window.deferredPrompt;
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            }
            window.deferredPrompt = null;
        });
    }
    dismissInstallBanner();
}

function dismissInstallBanner() {
    const banner = document.getElementById('install-banner');
    if (banner) {
        document.body.removeChild(banner);
    }
}

// ============ ANALYTICS & TRACKING ============
function trackEvent(eventName, eventData = {}) {
    // Mock analytics tracking
    console.log('Analytics Event:', eventName, eventData);
    
    // In real app, send to analytics service
    const event = {
        name: eventName,
        data: eventData,
        timestamp: new Date().toISOString(),
        userId: currentUser?.id || 'anonymous',
        sessionId: getSessionId()
    };
    
    // Store locally for demo
    let analytics = JSON.parse(localStorage.getItem('analytics')) || [];
    analytics.push(event);
    localStorage.setItem('analytics', JSON.stringify(analytics.slice(-100))); // Keep last 100 events
}

function getSessionId() {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
        sessionId = 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
}

// Track page views
function trackPageView(pageName) {
    trackEvent('page_view', { page: pageName });
}

// Track menu interactions
function trackMenuInteraction(action, itemName) {
    trackEvent('menu_interaction', { action, item: itemName });
}

// Track order events
function trackOrderEvent(action, orderData) {
    trackEvent('order_' + action, orderData);
}

// ============ ERROR HANDLING ============
function setupErrorHandling() {
    window.addEventListener('error', function(event) {
        logError('JavaScript Error', {
            message: event.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            error: event.error
        });
    });
    
    window.addEventListener('unhandledrejection', function(event) {
        logError('Unhandled Promise Rejection', {
            reason: event.reason
        });
    });
}

function logError(type, errorData) {
    console.error(type, errorData);
    
    // In real app, send to error logging service
    const errorLog = {
        type: type,
        data: errorData,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        userId: currentUser?.id || 'anonymous'
    };
    
    // Store locally for demo
    let errors = JSON.parse(localStorage.getItem('errors')) || [];
    errors.push(errorLog);
    localStorage.setItem('errors', JSON.stringify(errors.slice(-50))); // Keep last 50 errors
}

// ============ INITIALIZATION ============
// Initialize PWA features
document.addEventListener('DOMContentLoaded', function() {
    initializePWA();
    setupErrorHandling();
    setupGlobalSearch();
    
    // Track initial page load
    trackPageView('home');
});

// Export functions for testing (if in Node.js environment)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        addToCart,
        removeFromCart,
        updateCartQuantity,
        calculatePasswordStrength,
        formatTime,
        formatDateTime,
        generateOrderId,
        trackEvent
    };
}

console.log('Enhanced Restaurant Website JavaScript loaded successfully! 🍜');