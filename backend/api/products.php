<?php
/**
 * Products API Endpoint
 * Handles product-related requests
 */

require_once __DIR__ . '/../config/Database.php';

// Initialize database (already initialized in Database.php)
// $pdo is available from require_once

// Get request method
$method = $_SERVER['REQUEST_METHOD'];

// Handle different HTTP methods
switch ($method) {
    case 'GET':
        handleGet($pdo);
        break;
    case 'POST':
        handlePost($pdo);
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}

/**
 * Handle GET requests
 */
function handleGet($pdo) {
    // Get query parameters
    $category = isset($_GET['category']) ? $_GET['category'] : null;
    $sort = isset($_GET['sort']) ? $_GET['sort'] : 'featured';
    $id = isset($_GET['id']) ? $_GET['id'] : null;
    
    // If ID is provided, return single product
    if ($id) {
        $sql = "SELECT * FROM products WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':id' => $id]);
        $product = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($product) {
            // Fix types (MySQL returns strings for decimals)
            $product['price'] = (float)$product['price'];
            $product['rating'] = (float)$product['rating'];
            $product['sales'] = (int)$product['sales'];
            $product['inStock'] = (bool)$product['in_stock']; // Map in_stock to inStock for frontend compatibility
            
            echo json_encode($product);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Product not found']);
        }
        return;
    }
    
    // Build filter
    $sql = "SELECT * FROM products";
    $params = [];
    
    if ($category && $category !== 'all') {
        $sql .= " WHERE category = :category";
        $params[':category'] = $category;
    }
    
    // Add sorting
    switch ($sort) {
        case 'price-low':
            $sql .= " ORDER BY price ASC";
            break;
        case 'price-high':
            $sql .= " ORDER BY price DESC";
            break;
        case 'popular':
            $sql .= " ORDER BY sales DESC";
            break;
        case 'rating':
            $sql .= " ORDER BY rating DESC";
            break;
        case 'newest':
            $sql .= " ORDER BY created_at DESC";
            break;
        case 'featured':
        default:
            // Custom sort for featured (rating * sales) is complex in SQL, 
            // simplifing to just sales desc for now or using a calculated field
            $sql .= " ORDER BY (rating * sales) DESC";
            break;
    }
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Fix types for all products
    foreach ($products as &$p) {
        $p['price'] = (float)$p['price'];
        $p['rating'] = (float)$p['rating'];
        $p['sales'] = (int)$p['sales'];
        $p['inStock'] = (bool)$p['in_stock'];
    }
    
    echo json_encode([
        'success' => true,
        'count' => count($products),
        'products' => $products
    ]);
}

/**
 * Handle POST requests (for adding new products)
 */
function handlePost($pdo) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON data']);
        return;
    }
    
    $sql = "INSERT INTO products (id, name, price, category, image, rating, sales, materials, in_stock, description) 
            VALUES (:id, :name, :price, :category, :image, :rating, :sales, :materials, :in_stock, :description)";
            
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':id' => $data['id'],
            ':name' => $data['name'],
            ':price' => $data['price'],
            ':category' => $data['category'],
            ':image' => $data['image'],
            ':rating' => isset($data['rating']) ? $data['rating'] : 0,
            ':sales' => isset($data['sales']) ? $data['sales'] : 0,
            ':materials' => isset($data['materials']) ? $data['materials'] : '',
            ':in_stock' => isset($data['inStock']) ? ($data['inStock'] ? 1 : 0) : 1,
            ':description' => isset($data['description']) ? $data['description'] : ''
        ]);
        
        http_response_code(201);
        echo json_encode([
            'success' => true,
            'message' => 'Product created successfully'
        ]);
    } catch(PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}
?>
