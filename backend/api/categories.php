<?php
/**
 * Categories API Endpoint
 * Handles category-related requests
 */

require_once __DIR__ . '/../config/Database.php';

// Initialize database
// $pdo is available from require_once

// Get request method
$method = $_SERVER['REQUEST_METHOD'];

// Handle GET requests
if ($method === 'GET') {
    // Get all categories with product counts
    $categories = [
        [
            'id' => 'jewelry',
            'name' => 'Jewelry & Accessories',
            'description' => 'Handcrafted jewelry and accessories',
            'icon' => '💎',
            'items' => ['Bracelets', 'Earrings', 'Necklaces', 'Rings & Anklets']
        ],
        [
            'id' => 'homedecor',
            'name' => 'Home Decor',
            'description' => 'Beautiful decor for your home',
            'icon' => '🏺',
            'items' => ['Vases & Planters', 'Cushion Covers', 'Candle Holders', 'Rugs & Bedsheets']
        ],
        [
            'id' => 'apparel',
            'name' => 'Apparel & Textiles',
            'description' => 'Handwoven clothing and textiles',
            'icon' => '👗',
            'items' => ['Saris & Kurtis', 'Shirts & Dresses', 'Bags & Purses', 'Hats & Footwear']
        ],
        [
            'id' => 'bathbeauty',
            'name' => 'Bath & Beauty',
            'description' => 'Natural and organic beauty products',
            'icon' => '🧴',
            'items' => ['Handmade Soaps', 'Essential Oils', 'Natural Skincare', 'Bath Accessories']
        ],
        [
            'id' => 'stationery',
            'name' => 'Stationery & Paper',
            'description' => 'Handmade paper products',
            'icon' => '📚',
            'items' => ['Handmade Notebooks', 'Bookmarks', 'Greeting Cards', 'Art Prints']
        ],
        [
            'id' => 'toys',
            'name' => 'Toys & Games',
            'description' => 'Fun and educational toys',
            'icon' => '🧸',
            'items' => ['Wooden Toys', 'Puzzles', 'Board Games', 'Educational Toys']
        ],
        [
            'id' => 'art',
            'name' => 'Arts & Collectives',
            'description' => 'Original artworks and crafts',
            'icon' => '🎨',
            'items' => ['Paintings', 'Sculptures', 'Wall Art', 'Handmade Crafts']
        ],
        [
            'id' => 'diy',
            'name' => 'DIY Supplies',
            'description' => 'Craft kits and materials',
            'icon' => '🛠️',
            'items' => ['Craft Kits', 'Materials', 'Tools', 'Instructions']
        ]
    ];
    
    // Add product counts
    foreach ($categories as &$category) {
        $sql = "SELECT COUNT(*) FROM products WHERE category = :category";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':category' => $category['id']]);
        $count = $stmt->fetchColumn();
        $category['productCount'] = (int)$count;
    }
    
    echo json_encode([
        'success' => true,
        'categories' => $categories
    ]);
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>
