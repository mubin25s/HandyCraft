# Handycraft - Official Project Documentation

## Project Vision & Purpose
Handycraft is a sophisticated e-commerce platform dedicated to bridging the gap between traditional artisanal craftsmanship and modern digital commerce. In an era of mass industrial production, Handycraft provides a sanctuary for unique, one-of-a-kind items that carry the soul and story of their creators.

The project was conceived with three primary objectives:
1.  **Empowering Artisans:** Providing a robust platform for local craftsmen to showcase their skills and reach a global audience without the complexities of building their own technical infrastructure.
2.  **Preserving Heritage:** Encouraging the continuation of traditional crafting techniques (bamboo work, handweaving, pottery) by making them commercially viable in the modern market.
3.  **Sustainable Consumption:** Promoting eco-friendly and ethically sourced products as an alternative to "fast fashion" and disposable goods.

---

## Technical Architecture
Handycraft utilizes a modern, decoupled architecture designed for performance, reliability, and ease of maintenance.

### Frontend (User Interface)
The frontend is built using a "Vanilla Plus" approach—relying on pure, high-performance web standards while implementing advanced design patterns.

*   **HTML5 Semantic Structure:** Ensures maximum accessibility (A11y) and SEO optimization.
*   **Modern CSS3:** 
    *   **Custom Design System:** Uses CSS Variables for a consistent color palette (Chocolate, Light Brown, Ivory).
    *   **Responsive Layouts:** Implemented via CSS Grid and Flexbox for a seamless experience across mobile, tablet, and desktop.
    *   **Micro-animations:** Custom keyframe animations (`animations.css`) provide smooth state transitions and a premium feel.
*   **Vanilla JavaScript:** Lightweight and fast, handling dynamic product loading, asynchronous API calls, and local state management for the shopping cart.

### Backend (Server Logic)
The server-side is powered by a RESTful PHP architecture, focused on security and data integrity.

*   **PHP 8.x:** Handles business logic, authentication, and order processing.
*   **PDO (PHP Data Objects):** Utilized for database interactions to prevent SQL injection and ensure cross-database compatibility.
*   **Session Management:** Secure cookie-based session handling for user authentication and state persistence.
*   **RESTful APIs:** Provides JSON endpoints for the frontend to consume, allowing for future expansion into mobile apps.

### Database (Data Persistence)
*   **MySQL:** A relational database system storing product information, user credentials, category hierarchies, and order history.
*   **Normalization:** The schema is designed to minimize redundancy and ensure data consistency.

---

## Key Modules & Features

### 1. Dynamic Catalog System
The product catalog is dynamically generated from the backend. Users can filter by categories (Jewelry, Home Decor, Apparel, etc.) and view detailed product specifications.

### 2. Intelligent Shopping Cart
A persistent shopping cart implementation that allows users to add, remove, and update item quantities. It calculates totals in real-time and provides visual feedback through custom notifications.

### 3. Integrated Authentication
A secure login and registration system. It includes password hashing and protected API endpoints to ensure user data privacy.

### 4. Interactive Image Management
High-quality imagery is central to the project. The platform includes logic for handling product displays, including zoom effects and responsive image loading.

### 5. Seamless Checkout Workflow
A guided multi-step checkout process that collects shipping information and prepares orders for processing.

---

## Design Philosophy
The "Aesthetics of Craft" is the guiding principle for our UI/UX design:
*   **Warm Tones:** Using earthy colors like chocolate and brown to evoke the feeling of natural materials.
*   **Minimalism:** Clean white spaces to make the vibrant products the center of attention.
*   **Typography:** Elegant, readable fonts that balance traditional elegance with modern clarity.

---

## Future Roadmap
*   **Artisan Dashboard:** A dedicated space for creators to manage their own inventories.
*   **Global Shipping Integration:** Automated shipping rate calculations and international tracking.
*   **PWA Support:** Converting the platform into a Progressive Web App for offline access and push notifications.
