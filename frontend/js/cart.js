// ========================================
// CART MANAGEMENT SYSTEM
// ========================================

// Initialize cart from localStorage or create empty cart
let cart = JSON.parse(localStorage.getItem('handycraft_cart')) || [];

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('handycraft_cart', JSON.stringify(cart));
    updateCartCount();
}

// Update cart count in header
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('#cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    cartCountElements.forEach(element => {
        element.textContent = totalItems;

        // Add bounce animation when count changes
        if (totalItems > 0) {
            element.classList.add('cart-bounce');
            setTimeout(() => element.classList.remove('cart-bounce'), 600);
        }
    });
}

// Add item to cart
function addToCart(product, quantity = 1) {
    // Check if product already exists in cart
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            quantity: quantity
        });
    }

    saveCart();
    showNotification(`${product.name} added to cart!`, 'success');

    return true;
}

// Remove item from cart
function removeFromCart(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId);

    if (itemIndex > -1) {
        const removedItem = cart[itemIndex];
        cart.splice(itemIndex, 1);
        saveCart();
        showNotification(`${removedItem.name} removed from cart`, 'info');

        // Reload cart page if we're on it
        if (window.location.pathname.includes('cart.html')) {
            displayCart();
        }
    }
}

// Update item quantity
function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);

    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            saveCart();

            // Reload cart page if we're on it
            if (window.location.pathname.includes('cart.html')) {
                displayCart();
            }
        }
    }
}

// Calculate cart totals
function calculateCartTotals() {
    let subtotal = 0;

    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });

    return {
        subtotal: subtotal,
        tax: subtotal * 0.1, // 10% tax
        shipping: subtotal > 50 ? 0 : 5.99, // Free shipping over $50
        total: subtotal + (subtotal * 0.1) + (subtotal > 50 ? 0 : 5.99)
    };
}

// Display cart items on cart page
function displayCart() {
    const cartContainer = document.getElementById('cartContainer');
    const emptyCart = document.getElementById('emptyCart');
    const continueSection = document.getElementById('continueSection');

    if (!cartContainer) return;

    if (cart.length === 0) {
        cartContainer.style.display = 'none';
        emptyCart.style.display = 'block';
        if (continueSection) continueSection.style.display = 'none';
        return;
    }

    cartContainer.style.display = 'grid';
    emptyCart.style.display = 'none';
    if (continueSection) continueSection.style.display = 'block';

    const totals = calculateCartTotals();

    cartContainer.innerHTML = `
        <div class="cart-items">
            <h2 style="color: var(--chocolate); margin-bottom: 1.5rem;">Cart Items</h2>
            ${cart.map(item => `
                <div class="cart-item animate-fadeIn">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                    <div class="cart-item-info">
                        <h3 class="cart-item-name">${item.name}</h3>
                        <p style="color: var(--gray-dark); font-size: 0.875rem; text-transform: capitalize;">
                            ${item.category}
                        </p>
                        <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                        
                        <div class="quantity-control">
                            <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity - 1})">
                                <i class="fas fa-minus"></i>
                            </button>
                            <input type="number" value="${item.quantity}" 
                                   class="quantity-input" 
                                   min="1" 
                                   onchange="updateQuantity('${item.id}', parseInt(this.value))"
                                   readonly>
                            <button class="quantity-btn" onclick="updateQuantity('${item.id}', ${item.quantity + 1})">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    <div style="margin-left: auto;">
                        <p style="font-size: 1.5rem; font-weight: 700; color: var(--light-brown); margin-bottom: 1rem;">
                            $${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <button class="remove-btn" onclick="removeFromCart('${item.id}')">
                            <i class="fas fa-trash"></i> Remove
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div class="cart-summary">
            <h3 style="color: var(--chocolate); margin-bottom: 1.5rem;">Order Summary</h3>
            
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>$${totals.subtotal.toFixed(2)}</span>
            </div>
            
            <div class="summary-row">
                <span>Tax (10%):</span>
                <span>$${totals.tax.toFixed(2)}</span>
            </div>
            
            <div class="summary-row">
                <span>Shipping:</span>
                <span>${totals.shipping === 0 ? 'FREE' : '$' + totals.shipping.toFixed(2)}</span>
            </div>
            
            ${totals.subtotal <= 50 ? `
                <p style="font-size: 0.875rem; color: var(--light-brown); margin-top: 0.5rem; text-align: center;">
                    Add $${(50 - totals.subtotal).toFixed(2)} more for free shipping!
                </p>
            ` : ''}
            
            <div class="summary-row total">
                <span>Total:</span>
                <span>$${totals.total.toFixed(2)}</span>
            </div>
            
            <button class="btn btn-primary checkout-btn" onclick="checkout()">
                Proceed to Checkout
            </button>
            
            <a href="products.html" class="btn btn-outline" style="width: 100%; margin-top: 1rem; text-align: center;">
                Continue Shopping
            </a>
        </div>
    `;
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty', 'error');
        return;
    }

    const totals = calculateCartTotals();
    showNotification(`Checkout initiated! Total: $${totals.total.toFixed(2)}`, 'success');

    // In a real application, this would redirect to a checkout page
    // For now, we'll just show a success message
    setTimeout(() => {
        alert(`Thank you for your order!\n\nOrder Summary:\nSubtotal: $${totals.subtotal.toFixed(2)}\nTax: $${totals.tax.toFixed(2)}\nShipping: ${totals.shipping === 0 ? 'FREE' : '$' + totals.shipping.toFixed(2)}\n\nTotal: $${totals.total.toFixed(2)}\n\nThis is a demo. In production, you would be redirected to payment.`);
    }, 500);
}

// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) return;

    const icons = {
        success: '<i class="fas fa-check-circle" style="color: var(--success);"></i>',
        error: '<i class="fas fa-exclamation-circle" style="color: var(--error);"></i>',
        info: '<i class="fas fa-info-circle" style="color: var(--light-brown);"></i>'
    };

    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem;">
            ${icons[type]}
            <span style="color: var(--chocolate); font-weight: 500;">${message}</span>
        </div>
    `;

    notification.style.display = 'block';
    notification.classList.add('notification');
    notification.classList.remove('hiding');

    setTimeout(() => {
        notification.classList.add('hiding');
        setTimeout(() => {
            notification.style.display = 'none';
            notification.classList.remove('notification', 'hiding');
        }, 400);
    }, 3000);
}

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});

// Export functions for global use
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.displayCart = displayCart;
window.checkout = checkout;
window.showNotification = showNotification;
