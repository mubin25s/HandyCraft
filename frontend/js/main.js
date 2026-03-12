// ========================================
// MAIN JAVASCRIPT - GENERAL FUNCTIONALITY
// ========================================

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Animate hamburger icon
            const spans = menuToggle.querySelectorAll('span');
            if (navLinks.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translateY(8px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close menu when clicking on a link
        const links = navLinks.querySelectorAll('.nav-link');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const spans = menuToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Don't prevent default if href is just "#"
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight - 20;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll reveal animation
function revealOnScroll() {
    const reveals = document.querySelectorAll('.scroll-reveal');

    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const revealPoint = 100;

        if (elementTop < windowHeight - revealPoint) {
            element.classList.add('active');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('DOMContentLoaded', revealOnScroll);

// Stagger animation for items
function initStaggerAnimation() {
    const staggerItems = document.querySelectorAll('.stagger-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Items already have stagger animation in CSS
                entry.target.style.opacity = '1';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    staggerItems.forEach(item => {
        observer.observe(item);
    });
}

document.addEventListener('DOMContentLoaded', initStaggerAnimation);

// Image lazy loading fallback (for browsers that don't support native lazy loading)
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
});

// Add to cart button ripple effect
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('add-to-cart-btn') ||
        e.target.closest('.add-to-cart-btn')) {
        const button = e.target.classList.contains('add-to-cart-btn') ?
            e.target : e.target.closest('.add-to-cart-btn');

        button.classList.add('btn-ripple');

        setTimeout(() => {
            button.classList.remove('btn-ripple');
        }, 600);
    }
});

// Update active navigation link based on current page
function updateActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPage = link.getAttribute('href').split('#')[0];

        if (linkPage === currentPage ||
            (currentPage === '' && linkPage === 'index.html') ||
            (currentPage === 'index.html' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', updateActiveNav);

// Back to top button (optional, can be added if needed)
function createBackToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = '<i class="fas fa-arrow-up"></i>';
    button.className = 'back-to-top';
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: var(--chocolate);
        color: var(--white);
        width: 50px;
        height: 50px;
        border-radius: 50%;
        display: none;
        align-items: center;
        justify-content: center;
        box-shadow: var(--shadow-lg);
        cursor: pointer;
        z-index: 999;
        transition: all 0.3s ease;
    `;

    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    button.addEventListener('mouseenter', () => {
        button.style.background = 'var(--chocolate-dark)';
        button.style.transform = 'translateY(-5px)';
    });

    button.addEventListener('mouseleave', () => {
        button.style.background = 'var(--chocolate)';
        button.style.transform = 'translateY(0)';
    });

    document.body.appendChild(button);

    // Show/hide based on scroll position
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            button.style.display = 'flex';
        } else {
            button.style.display = 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', createBackToTopButton);

// Generate placeholder image if needed
function setupPlaceholderImages() {
    // Create a simple placeholder image using canvas
    const createPlaceholder = (width = 300, height = 300) => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = '#F5E6D3';
        ctx.fillRect(0, 0, width, height);

        // Icon
        ctx.fillStyle = '#D4A574';
        ctx.font = 'bold 60px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🎨', width / 2, height / 2);

        // Text
        ctx.fillStyle = '#7B4B3A';
        ctx.font = '16px Arial';
        ctx.fillText('Handycraft', width / 2, height / 2 + 60);

        return canvas.toDataURL();
    };

    // Store placeholder for use
    window.placeholderImage = createPlaceholder();
}

document.addEventListener('DOMContentLoaded', setupPlaceholderImages);

// Handle image loading errors
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function () {
            if (window.placeholderImage) {
                this.src = window.placeholderImage;
            } else {
                // Fallback color block
                this.style.background = 'linear-gradient(135deg, #F5E6D3, #D4A574)';
                this.style.minHeight = '200px';
            }
        });
    });
});

// Add animation class to elements as they scroll into view
const observeElements = () => {
    const elements = document.querySelectorAll('.card, .category-card, .product-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
};

document.addEventListener('DOMContentLoaded', observeElements);

// Search functionality (can be expanded)
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        // Implement search logic here
        console.log('Searching for:', searchTerm);
    });
}

document.addEventListener('DOMContentLoaded', initSearch);

// Prevent form submission on Enter key (for search)
document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
        });
    });
});

// Console welcome message
console.log(
    '%c🎨 Welcome to Handycraft! %c\n' +
    'A beautiful e-commerce platform for handmade crafts.\n' +
    'Built with HTML, CSS, and JavaScript.',
    'color: #7B4B3A; font-size: 20px; font-weight: bold; font-family: "Cormorant Garamond", serif;',
    'color: #D4A574; font-size: 14px;'
);

// Performance monitoring (optional)
if (window.performance && window.performance.timing) {
    window.addEventListener('load', () => {
        const loadTime = window.performance.timing.domContentLoadedEventEnd -
            window.performance.timing.navigationStart;
        console.log(`%cPage loaded in ${loadTime}ms`, 'color: #D4A574; font-weight: bold;');
    });
}
