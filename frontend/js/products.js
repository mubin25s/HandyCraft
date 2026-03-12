// ========================================
// PRODUCTS DATA & MANAGEMENT
// ========================================

// Cache for products to avoid excessive API calls if needed, 
// and to allow synchronous-like access for cart operations from listings
let currentProducts = [];

// Category information (Static metadata, could be fetched from backend/categories.php too, but kept here for UI config)
const categories = {
    all: { name: 'All Products', description: 'Browse our complete collection' },
    jewelry: { name: 'Jewelry & Accessories', description: 'Handcrafted jewelry and accessories' },
    homedecor: { name: 'Home Decor', description: 'Beautiful decor for your home' },
    apparel: { name: 'Apparel & Textiles', description: 'Handwoven clothing and textiles' },
    bathbeauty: { name: 'Bath & Beauty', description: 'Natural and organic beauty products' },
    stationery: { name: 'Stationery & Paper', description: 'Handmade paper products' },
    toys: { name: 'Toys & Games', description: 'Fun and educational toys' },
    art: { name: 'Arts & Collectives', description: 'Original artworks and crafts' },
    diy: { name: 'DIY Supplies', description: 'Craft kits and materials' }
};

// Fetch products from API
async function fetchProducts(category = 'all', sort = 'featured') {
    try {
        let url = '../backend/api/products.php?';
        const params = new URLSearchParams();
        
        if (category && category !== 'all') {
            params.append('category', category);
        }
        
        if (sort) {
            params.append('sort', sort);
        }
        
        const response = await fetch(url + params.toString());
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.success && data.products) {
            currentProducts = data.products; // Update cache
            return data.products;
        } else if (Array.isArray(data)) {
             // Handle case where API returns array directly (single product or list)
             currentProducts = data;
             return data;
        }
        
        return [];
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

// Fetch single product by ID
async function fetchProductById(id) {
    try {
        const response = await fetch(`../backend/api/products.php?id=${id}`);
        if (!response.ok) {
            if (response.status === 404) return null;
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

// Generate product card HTML
function generateProductCard(product) {
    const stars = generateStars(product.rating);

    return `
        <div class="product-card">
            ${product.sales > 200 ? '<div class="product-badge">Popular</div>' : ''}
            <div class="product-img-wrapper">
                <img src="${product.image}" 
                     alt="${product.name}" 
                     class="product-img" 
                     id="img-${product.id}"
                     width="300" 
                     height="300"
                     style="width: 100%; height: 300px; object-fit: cover; display: block;"
                     onerror="this.src='images/placeholder.jpg'">
                <div class="product-overlay" style="display: flex; gap: 0.5rem; justify-content: center; align-items: center;">
                    <button class="btn btn-primary btn-sm" onclick="quickAddToCart('${product.id}')">
                        Quick Add
                    </button>
                    <!-- Image Upload Feature -->
                    <input type="file" id="file-${product.id}" style="display: none;" accept="image/*" onchange="previewImage(this, '${product.id}')">
                    <button class="btn btn-secondary btn-sm" onclick="document.getElementById('file-${product.id}').click()" title="Test Image" style="padding: 0.25rem 0.5rem;">
                        <i class="fas fa-camera"></i>
                    </button>
                </div>
            </div>
            <div class="product-info">
                <p class="product-category">${categories[product.category] ? categories[product.category].name : product.category}</p>
                <h3 class="product-name">
                    <a href="product-detail.html?id=${product.id}" style="color: inherit;">
                        ${product.name}
                    </a>
                </h3>
                <div class="product-rating">
                    ${stars}
                    <span style="font-size: 0.875rem; color: var(--gray-dark); margin-left: 0.25rem;">
                        (${product.rating})
                    </span>
                </div>
                <div class="product-price-row">
                    <span class="product-price">$${Number(product.price).toFixed(2)}</span>
                    <button class="add-to-cart-btn" onclick="quickAddToCart('${product.id}')">
                        <i class="fas fa-cart-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Generate star rating HTML
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';

    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star star"></i>';
    }
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt star"></i>';
    }
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star star"></i>';
    }

    return stars;
}

// Quick add to cart from product listing
async function quickAddToCart(productId) {
    // Try to find in cache first
    let product = currentProducts.find(p => p.id === productId);
    
    // If not in cache (e.g. direct link or other page), fetch it
    if (!product) {
        product = await fetchProductById(productId);
    }
    
    if (product) {
        addToCart(product, 1);
    }
}

// Load products on products page
async function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    const productCount = document.getElementById('productCount');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');

    if (!productsGrid) return;

    // Show loading state
    productsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center;">Loading products...</div>';

    const category = categoryFilter ? categoryFilter.value : getURLParameter('category') || 'all';
    const sort = sortFilter ? sortFilter.value : 'featured';

    // Update category filter if URL has category parameter
    if (categoryFilter && getURLParameter('category')) {
        categoryFilter.value = getURLParameter('category');
    }

    // Update category title
    const categoryTitle = document.getElementById('categoryTitle');
    if (categoryTitle && category !== 'all' && categories[category]) {
        categoryTitle.textContent = categories[category].description;
    }

    const products = await fetchProducts(category, sort);

    if (productCount) {
        productCount.textContent = `${products.length} Product${products.length !== 1 ? 's' : ''}`;
    }

    if (products.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 0;">
                <p style="font-size: 1.25rem; color: var(--gray-dark);">No products found in this category.</p>
                <p style="font-size: 0.9rem; color: var(--gray-dark); margin-top: 1rem;">
                    If you see this and expect products, ensure the <strong>database setup script</strong> has been run.<br>
                    <a href="../backend/api/setup_database.php" target="_blank" style="color: var(--primary); text-decoration: underline;">Run Setup Script</a>
                </p>
            </div>
        `;
        return;
    }

    productsGrid.innerHTML = products.map(product => generateProductCard(product)).join('');
}

// Load featured products on homepage
async function loadFeaturedProducts() {
    const featuredGrid = document.getElementById('featuredProducts');
    if (!featuredGrid) return;
    
    featuredGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center;">Loading featured products...</div>';

    // Fetch top 8 featured
    let products = await fetchProducts('all', 'featured');
    const featured = products.slice(0, 8);
    
    featuredGrid.innerHTML = featured.map(product => generateProductCard(product)).join('');
}

// Load product detail page
async function loadProductDetail() {
    const productDetail = document.getElementById('productDetail');
    if (!productDetail) return;
    
    productDetail.innerHTML = '<div style="text-align: center;">Loading product details...</div>';

    const productId = getURLParameter('id');
    const product = await fetchProductById(productId);

    if (!product) {
        productDetail.innerHTML = `
            <div style="text-align: center; padding: 4rem 0;">
                <h2>Product not found</h2>
                <p style="margin: 1rem 0;">The product you're looking for doesn't exist.</p>
                <a href="products.html" class="btn btn-primary">Browse Products</a>
            </div>
        `;
        return;
    }

    const stars = generateStars(product.rating);

    productDetail.innerHTML = `
        <div class="grid grid-2" style="gap: 3rem; align-items: start;">
            <div class="img-zoom-container">
                <img src="${product.image}" 
                     alt="${product.name}" 
                     class="img-zoom" 
                     width="600" 
                     height="600"
                     style="width: 100%; height: 600px; object-fit: cover; display: block; border-radius: var(--radius-lg); box-shadow: var(--shadow-lg);"
                     onerror="this.src='images/placeholder.jpg'">
            </div>
            
            <div>
                <p style="color: var(--light-brown); font-weight: 600; text-transform: uppercase; font-size: 0.875rem; margin-bottom: 0.5rem;">
                    ${categories[product.category] ? categories[product.category].name : product.category}
                </p>
                <h1 style="color: var(--chocolate); margin-bottom: 1rem;">${product.name}</h1>
                
                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                    <div class="product-rating">
                        ${stars}
                        <span style="margin-left: 0.5rem; color: var(--gray-dark);">${product.rating}</span>
                    </div>
                    <span style="color: var(--gray-dark);">|</span>
                    <span style="color: var(--gray-dark);">${product.sales} sold</span>
                </div>
                
                <div style="background: var(--cream); padding: 1.5rem; border-radius: var(--radius-lg); margin-bottom: 1.5rem;">
                    <p class="product-price" style="font-size: 2.5rem; margin: 0;">$${Number(product.price).toFixed(2)}</p>
                </div>
                
                <p style="color: var(--gray-dark); margin-bottom: 1.5rem; line-height: 1.8;">
                    ${product.description}
                </p>
                
                <div style="margin-bottom: 1.5rem;">
                    <p style="font-weight: 600; color: var(--chocolate); margin-bottom: 0.5rem;">Materials:</p>
                    <p style="color: var(--gray-dark);">${product.materials}</p>
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                    <p style="font-weight: 600; color: var(--chocolate); margin-bottom: 0.5rem;">Stock Status:</p>
                    <p style="color: ${product.inStock ? 'var(--success)' : 'var(--error)'}; font-weight: 500;">
                        ${product.inStock ? '✓ In Stock' : '✗ Out of Stock'}
                    </p>
                </div>
                
                <div style="display: flex; gap: 1rem; margin-top: 2rem;">
                    <button class="btn btn-primary" onclick="quickAddToCart('${product.id}')" style="flex: 1;">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button class="btn btn-secondary" onclick="buyNow('${product.id}')">
                        Buy Now
                    </button>
                </div>
                
                <div style="margin-top: 2rem; padding-top: 2rem; border-top: 1px solid var(--cream-dark);">
                    <p style="color: var(--gray-dark); font-size: 0.875rem;">
                        🌿 Eco-friendly &nbsp;|&nbsp; 🤝 Fair trade &nbsp;|&nbsp; 🚚 Free shipping over $50
                    </p>
                </div>
            </div>
        </div>
    `;

    // Load related products
    loadRelatedProducts(product.category, product.id);
}

// Load related products
async function loadRelatedProducts(category, excludeId) {
    const relatedGrid = document.getElementById('relatedProducts');
    if (!relatedGrid) return;

    // Fetch products for category
    // Optimization: fetchProducts updates currentProducts cache, so we might have them already? 
    // Usually product detail pages are entered directly or from listing, so we might not have the full category list.
    // Let's just fetch top 4 items of this category (limit not implemented in backend, so filtering client side 
    // after fetching category is okay for small db)
    
    let products = await fetchProducts(category); // fetches all in category
    
    const related = products
        .filter(p => p.id !== excludeId)
        .slice(0, 4);

    if (related.length === 0) return;

    relatedGrid.innerHTML = related.map(product => generateProductCard(product)).join('');
}

// Buy now function
async function buyNow(productId) {
    let product = currentProducts.find(p => p.id === productId);
    if (!product) {
        product = await fetchProductById(productId);
    }
    
    if (product) {
        addToCart(product, 1);
        setTimeout(() => {
            window.location.href = 'checkout.html';
        }, 500);
    }
}

// Get URL parameter
function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Load featured products on homepage
    if (document.getElementById('featuredProducts')) {
        loadFeaturedProducts();
    }
});

// Export functions for global use
window.loadProducts = loadProducts;
window.loadProductDetail = loadProductDetail;
window.quickAddToCart = quickAddToCart;
window.buyNow = buyNow;

// Load products grouped by category for category.html
async function loadCategorySections() {
    const container = document.getElementById('categorySections');
    if (!container) return;

    // Show loading
    container.innerHTML = '<div style="text-align: center;">Loading categories...</div>';

    // Fetch ALL products to group them (efficient for small dataset)
    const allProducts = await fetchProducts('all');
    
    container.innerHTML = '';

    // Iterate through all categories (excluding 'all')
    Object.keys(categories).forEach(catKey => {
        if (catKey === 'all') return;

        const category = categories[catKey];
        const categoryProducts = allProducts.filter(p => p.category === catKey);

        if (categoryProducts.length === 0) return;

        // Create section for this category
        const sectionHtml = `
            <div class="category-section" style="margin-bottom: 4rem;">
                <div class="category-header" style="display: flex; justify-content: space-between; align-items: end; margin-bottom: 1.5rem; border-bottom: 2px solid var(--cream-dark); padding-bottom: 0.5rem;">
                    <div>
                        <h2 style="color: var(--chocolate); margin-bottom: 0.25rem;">${category.name}</h2>
                        <p style="color: var(--gray-dark);">${category.description}</p>
                    </div>
                    <a href="products.html?category=${catKey}" class="btn-link" style="color: var(--light-brown); font-weight: 600; text-decoration: none;">
                        View All <i class="fas fa-arrow-right" style="font-size: 0.8em;"></i>
                    </a>
                </div>
                
                <div class="grid grid-4">
                    ${categoryProducts.map(product => generateProductCard(product)).join('')}
                </div>
            </div>
        `;

        container.innerHTML += sectionHtml;
    });
}

window.loadCategorySections = loadCategorySections;

// Preview uploaded image
function previewImage(input, productId) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const img = document.getElementById(`img-${productId}`);
            if (img) {
                img.src = e.target.result;

                // Show notification
                const cleanName = input.files[0].name.replace(/\s+/g, '-').toLowerCase();
                console.log(`To use this image permanently: rename it to '${cleanName}' and move to frontend/images/`);

                // Notification simulation (if notification element exists)
                const notif = document.getElementById('notification');
                if (notif) {
                    notif.style.display = 'block';
                    notif.style.borderColor = 'var(--primary)';
                    notif.innerHTML = `<strong>Image Preview:</strong><br>To save, rename file to: <br><code>${cleanName}</code>`;
                    setTimeout(() => { notif.style.display = 'none'; }, 8000);
                }
            }
        }

        reader.readAsDataURL(input.files[0]);
    }
}
window.previewImage = previewImage;
