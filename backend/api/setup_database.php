<?php
/**
 * Setup Database Script
 * Creates the database, tables, and populates initial data
 */

// Database settings (hardcoded here to ensure we can connect without DB existing)
$host = 'localhost';
$user = 'root';
$pass = '';
$dbname = 'handycraft_db';

try {
    // 1. Connect to MySQL (no DB selected)
    $pdo = new PDO("mysql:host=$host", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "Connected to MySQL server successfully.<br>";
    
    // 2. Create Database
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbname` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "Database '$dbname' created or already exists.<br>";
    
    // 3. Connect to the Database
    $pdo->exec("USE `$dbname`");
    
    // 4. Create Users Table
    $sqlUsers = "CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    $pdo->exec($sqlUsers);
    echo "Table 'users' created.<br>";
    
    // 5. Create Products Table
    $sqlProducts = "CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(10) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        category VARCHAR(50) NOT NULL,
        image VARCHAR(255) NOT NULL,
        rating DECIMAL(3, 1) DEFAULT 0,
        sales INT DEFAULT 0,
        materials TEXT,
        in_stock BOOLEAN DEFAULT TRUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    $pdo->exec($sqlProducts);
    echo "Table 'products' created.<br>";

    // 6. Create Orders Table
    $sqlOrders = "CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id VARCHAR(50) NOT NULL UNIQUE,
        user_id INT,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        address TEXT NOT NULL,
        city VARCHAR(50) NOT NULL,
        state VARCHAR(50) NOT NULL,
        zip VARCHAR(20) NOT NULL,
        payment_method VARCHAR(20) NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    $pdo->exec($sqlOrders);
    echo "Table 'orders' created.<br>";

    // 7. Create Order Items Table
    $sqlOrderItems = "CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id VARCHAR(50) NOT NULL,
        product_id VARCHAR(10) NOT NULL,
        product_name VARCHAR(100) NOT NULL,
        quantity INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
    )";
    $pdo->exec($sqlOrderItems);
    echo "Table 'order_items' created.<br>";
    
    // 6. Seed Product Data
    // We will clear the table first to ensure the latest 40 products are always loaded
    $pdo->exec("TRUNCATE TABLE products");
    
    $products = [
            // Jewelry & Accessories
            ['j001', 'Handwoven Bamboo Bracelet', 24.99, 'jewelry', 'images/Brac1.webp', 4.8, 156, 'Bamboo, Cotton Thread', 1, 'Beautiful handwoven bracelet made from sustainable bamboo'],
            ['j002', 'Silver Earrings with Turquoise', 45.99, 'jewelry', 'images/Ear1.avif', 4.9, 243, 'Sterling Silver, Turquoise', 1, 'Elegant silver earrings featuring natural turquoise stones'],
            ['j003', 'Wooden Bead Necklace', 32.99, 'jewelry', 'images/Nec1.webp', 4.7, 189, 'Sandalwood, Cotton Cord', 1, 'Aromatic sandalwood beads on a durable cotton cord'],
            ['j004', 'Macrame Bracelet Set', 18.99, 'jewelry', 'images/macr1.jpg', 4.6, 298, 'Cotton Thread, Wooden Beads', 1, 'Set of 3 macrame bracelets in earth tones'],
            ['j005', 'Clay Pendant Necklace', 29.99, 'jewelry', 'images/clay.jpg', 4.8, 167, 'Terracotta Clay, Leather Cord', 1, 'Unique terracotta pendant with traditional patterns'],

            // Home Decor
            ['h001', 'Ceramic Flower Vase', 38.99, 'homedecor', 'images/vase.webp', 4.9, 312, 'Ceramic', 1, 'Hand-painted ceramic vase with floral motifs'],
            ['h002', 'Embroidered Cushion Cover', 22.99, 'homedecor', 'images/emb1.jpg', 4.7, 421, 'Cotton, Silk Thread', 1, 'Beautifully embroidered cushion cover in cream tones'],
            ['h003', 'Wooden Candle Holder Set', 34.99, 'homedecor', 'images/candle.jpg', 4.8, 267, 'Mango Wood', 1, 'Set of 3 hand-carved wooden candle holders'],
            ['h004', 'Jute Wall Hanging', 27.99, 'homedecor', 'images/wall.webp', 4.6, 198, 'Jute, Cotton', 1, 'Bohemian-style jute wall hanging with tassels'],
            ['h005', 'Bamboo Plant Stand', 42.99, 'homedecor', 'images/bamboo.jpg', 4.9, 334, 'Bamboo', 1, '3-tier bamboo plant stand for indoor plants'],
            ['h006', 'Cotton Bedsheet Set', 56.99, 'homedecor', 'images/bedset.webp', 4.8, 289, 'Organic Cotton', 1, 'Hand-block printed cotton bedsheet with pillow covers'],

            // Apparel & Textiles
            ['a001', 'Handloom Cotton Sari', 89.99, 'apparel', 'images/sari.webp', 4.9, 145, 'Handloom Cotton', 1, 'Traditional handloom cotton sari with intricate border'],
            ['a002', 'Embroidered Kurti', 45.99, 'apparel', 'images/kurti.webp', 4.8, 267, 'Cotton, Silk Thread', 1, 'Elegant cotton kurti with hand embroidery'],
            ['a003', 'Handwoven Tote Bag', 28.99, 'apparel', 'images/tot.webp', 4.7, 398, 'Jute, Cotton Lining', 1, 'Eco-friendly jute tote bag with leather handles'],
            ['a004', 'Cotton Block Print Dress', 52.99, 'apparel', 'images/dress.webp', 4.8, 221, 'Organic Cotton', 1, 'Hand-block printed cotton dress in traditional patterns'],
            ['a005', 'Leather Sandals', 39.99, 'apparel', 'images/shoe.jpg', 4.6, 178, 'Genuine Leather', 1, 'Handcrafted leather sandals with comfortable sole'],

            // Bath & Beauty
            ['b001', 'Natural Soap Set', 19.99, 'bathbeauty', 'images/soap01.webp', 4.8, 567, 'Natural Oils, Essential Oils', 1, 'Set of 4 handmade natural soaps with different scents'],
            ['b002', 'Lavender Essential Oil', 16.99, 'bathbeauty', 'images/oil.webp', 4.9, 432, 'Pure Lavender Extract', 1, '100% pure lavender essential oil for relaxation'],
            ['b003', 'Herbal Face Cream', 24.99, 'bathbeauty', 'images/face.jpg', 4.7, 298, 'Natural Herbs, Aloe Vera', 1, 'Organic herbal face cream for all skin types'],
            ['b004', 'Bamboo Bath Brush', 12.99, 'bathbeauty', 'images/brush.webp', 4.6, 345, 'Bamboo, Natural Bristles', 1, 'Eco-friendly bamboo bath brush with sisal bristles'],

            // Stationery & Paper
            ['s001', 'Handmade Leather Journal', 32.99, 'stationery', 'images/poetry.jpg', 4.9, 412, 'Leather, Recycled Paper', 1, 'Leather-bound journal with handmade paper sheets'],
            ['s002', 'Wooden Bookmark Set', 8.99, 'stationery', 'images/bm.webp', 4.7, 598, 'Bamboo Wood', 1, 'Set of 5 laser-engraved wooden bookmarks'],
            ['s003', 'Greeting Card Pack', 14.99, 'stationery', 'images/card.webp', 4.8, 476, 'Handmade Paper', 1, 'Pack of 10 handmade greeting cards with envelopes'],
            ['s004', 'Recycled Paper Notebook', 11.99, 'stationery', 'images/book.avif', 4.6, 532, 'Recycled Paper', 1, 'Eco-friendly notebook with 200 recycled pages'],

            // Toys & Games
            ['t001', 'Wooden Puzzle Set', 26.99, 'toys', 'images/puz.jpg', 4.8, 289, 'Pine Wood', 1, 'Educational wooden puzzle for ages 3+'],
            ['t002', 'Handmade Rag Doll', 22.99, 'toys', 'images/doll.jpg', 4.9, 234, 'Cotton Fabric, Wool Stuffing', 1, 'Traditional handmade rag doll with changeable clothes'],
            ['t003', 'Wooden Building Blocks', 34.99, 'toys', 'images/blocks.jpg', 4.7, 367, 'Beech Wood', 1, 'Set of 50 natural wooden building blocks'],

            // Arts & Collectives
            ['ar001', 'Watercolor Landscape Painting', 78.99, 'art', 'images/picc.webp', 4.9, 89, 'Watercolor on Paper', 1, 'Original watercolor painting of mountain landscape'],
            ['ar002', 'Clay Sculpture', 65.99, 'art', 'images/clayscul.jpg', 4.8, 67, 'Terracotta Clay', 1, 'Hand-sculpted terracotta decorative piece'],
            ['ar003', 'Mandala Wall Art', 42.99, 'art', 'images/med.webp', 4.7, 156, 'Canvas, Acrylic Paint', 1, 'Hand-painted mandala on stretched canvas'],

            // DIY Supplies
            ['d001', 'Macrame Craft Kit', 29.99, 'diy', 'images/mac.jpg', 4.8, 345, 'Cotton Rope, Instructions', 1, 'Complete macrame kit for beginners with instructions'],
            ['d002', 'Clay Pottery Kit', 38.99, 'diy', 'images/clays2.webp', 4.7, 223, 'Natural Clay, Tools', 1, 'Air-dry clay pottery kit with shaping tools'],
            ['d003', 'Embroidery Starter Kit', 24.99, 'diy', 'images/ckit.jpg', 4.9, 412, 'Fabric, Thread, Needles', 1, 'Everything you need to start embroidery crafts'],
            ['d004', 'Candle Making Kit', 32.99, 'diy', 'images/kitsrange.avif', 4.6, 267, 'Wax, Wicks, Molds', 1, 'Complete candle making kit with natural soy wax'],

            // Additional Products (User Request)
            ['s005', 'Wooden Bookmark (Pattern 2)', 8.99, 'stationery', 'images/bm2.webp', 4.5, 120, 'Bamboo Wood', 1, 'Alternative pattern intricate wooden bookmark'],
            ['h007', 'Floral Embroidery Art', 35.99, 'homedecor', 'images/emb2.webp', 4.8, 85, 'Cotton, Wooden Hoop', 1, 'Hand-stitched floral embroidery wall art'],
            ['h008', 'Artificial Flower Arrangement', 28.99, 'homedecor', 'images/flower.avif', 4.7, 150, 'Silk, Plastic', 1, 'Lifelike artificial flower arrangement for home decor'],
            ['ar004', 'Nature Tapestry', 45.99, 'art', 'images/nt.jpg', 4.9, 60, 'Fabric', 1, 'Large wall tapestry depicting nature scenes'],
            ['b005', 'Rose Essential Oil', 18.99, 'bathbeauty', 'images/oil2.jpg', 4.8, 200, 'Rose Extract', 1, 'Premium rose essential oil for aromatherapy'],
            
            // 40th Product
            ['o001', 'Artisan Pottery Workshop', 149.99, 'diy', 'images/about-crafts.jpg', 5.0, 45, 'Voucher', 1, 'Gift voucher for a weekend pottery workshop with master artisans']
    ];

    $insertSql = "INSERT INTO products (id, name, price, category, image, rating, sales, materials, in_stock, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($insertSql);

    foreach ($products as $product) {
        $stmt->execute($product);
    }
    
    echo "Inserted " . count($products) . " products successfully.<br>";
    
    echo "<h3>Database Setup Complete!</h3>";
    
} catch(PDOException $e) {
    die("Setup Failed: " . $e->getMessage());
}
?>
