$(document).ready(function () {
    let cart = [];
    const menuItems = {
        'Butter Chicken': 350,
        'Gulab Jamun': 100,
        'Tandoori Chicken': 400,
        'Rogan Josh': 450,
        'Pav Bhaji': 200,
        'Rasgulla': 80,
        'Idli & Sambar': 150,
        'Paneer Butter Masala': 300,
        'Masala Dosa': 180,
        'Butter Naan': 60,
        'Chicken Biryani': 350,
        'Aloo Paratha': 120,
    };

    // Initialize cart icon position
    $('.cart-icon').css({
        position: 'fixed',
        top: '10%',
        right: '20px',
        zIndex: 9999,
    });

    // Add item to cart
    window.addToCart = function (itemName) {
        if (!menuItems[itemName]) {
            showNotification('Invalid menu item!', 'error');
            return;
        }

        const price = menuItems[itemName];
        const existingItem = cart.find(item => item.name === itemName);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                name: itemName,
                price: price,
                quantity: 1,
            });
        }

        updateCart();
        showCartNotification(itemName);
    };

    // Update cart display
    function updateCart() {
        const $cartItems = $('#cartItems');
        const total = calculateTotal();
        const count = calculateCount();

        $cartItems.empty();

        cart.forEach(item => {
            const $cartItem = $(`
                <div class="cart-item" data-item="${item.name}">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">₹${item.price}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn minus">-</button>
                            <span class="quantity-value">${item.quantity}</span>
                            <button class="quantity-btn plus">+</button>
                            <button class="remove-item"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                </div>
            `);

            $cartItems.append($cartItem);
        });

        $('#cartCount').text(count);
        $('#cartTotal').text(total);

        if (cart.length === 0) {
            $cartItems.append('<div class="empty-cart">Your cart is empty</div>');
        }

        // Save cart to localStorage
        localStorage.setItem('restaurantCart', JSON.stringify(cart));
    }

    function calculateTotal() {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0);
    }

    function calculateCount() {
        return cart.reduce((count, item) => count + item.quantity, 0);
    }

    // Show notifications
    function showCartNotification(itemName) {
        showNotification(`Added ${itemName} to cart`, 'success');
    }

    function showNotification(message, type) {
        const $notification = $(`
            <div class="notification ${type}">
                ${message}
                <div class="notification-progress"></div>
            </div>
        `);

        $('body').append($notification);

        setTimeout(() => {
            $notification.addClass('show');
            setTimeout(() => {
                $notification.removeClass('show');
                setTimeout(() => {
                    $notification.remove();
                }, 300);
            }, 2000);
        }, 100);
    }

    // Cart toggle (open/close)
    $('.cart-icon, .close-cart').on('click', function (e) {
        e.stopPropagation();
        $('#cartSidebar').toggleClass('active');
    });

    // Modify quantity - Fixed event handler
    $('#cartItems').on('click', '.quantity-btn', function (e) {
        e.stopPropagation(); // Prevent event bubbling
        const $btn = $(this);
        const itemName = $btn.closest('.cart-item').data('item');
        const change = $btn.hasClass('plus') ? 1 : -1;

        const item = cart.find(item => item.name === itemName);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                cart = cart.filter(i => i.name !== itemName);
            }
            updateCart();
        }
    });

    // Remove item from cart - Fixed event handler
    $('#cartItems').on('click', '.remove-item', function (e) {
        e.stopPropagation(); // Prevent event bubbling
        const itemName = $(this).closest('.cart-item').data('item');
        cart = cart.filter(item => item.name !== itemName);
        updateCart();
    });

    // Checkout button - Fixed event handler
    $('#checkoutBtn').on('click', function (e) {
        e.stopPropagation(); // Prevent event bubbling
        if (cart.length === 0) {
            showNotification('Your cart is empty!', 'error');
            return;
        }

        const total = calculateTotal();
        showNotification(`Order placed successfully! Total: ₹${total}`, 'success');
        cart = [];
        updateCart();
        $('#cartSidebar').removeClass('active');
    });

    // Load saved cart from localStorage
    const savedCart = localStorage.getItem('restaurantCart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
            updateCart();
        } catch (e) {
            console.error('Error parsing saved cart:', e);
            localStorage.removeItem('restaurantCart');
        }
    }

    // Prevent cart from closing when clicking inside
    $('#cartSidebar').on('click', function (e) {
        e.stopPropagation();
    });

    // Close cart when clicking outside
    $(document).on('click', function (event) {
        if (!$(event.target).closest('#cartSidebar, .cart-icon').length) {
            $('#cartSidebar').removeClass('active');
        }
    });

    // Close cart with escape key
    $(document).on('keydown', function (event) {
        if (event.key === 'Escape') {
            $('#cartSidebar').removeClass('active');
        }
    });
});