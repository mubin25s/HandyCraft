<?php
/**
 * Register API Endpoint
 * Handles user registration
 */

require_once __DIR__ . '/../../config/Database.php';

// Initialize database
// $pdo available

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

// Validate input
if (!$data || !isset($data['firstName']) || !isset($data['lastName']) || !isset($data['email']) || !isset($data['password'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

// Check for valid Gmail
if (!preg_match('/^[a-zA-Z0-9._%+-]+@gmail\.com$/', $data['email'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Please use a Gmail address (@gmail.com)!']);
    exit;
}

// Check if email already exists
$sql = "SELECT id FROM users WHERE email = :email";
$stmt = $pdo->prepare($sql);
$stmt->execute([':email' => $data['email']]);

if ($stmt->rowCount() > 0) {
    http_response_code(409); // Conflict
    echo json_encode(['success' => false, 'message' => 'This email is already registered!']);
    exit;
}

// Hash password
$passwordHash = password_hash($data['password'], PASSWORD_DEFAULT);

// Insert user
$insertSql = "INSERT INTO users (first_name, last_name, email, password) VALUES (:first_name, :last_name, :email, :password)";

try {
    $stmt = $pdo->prepare($insertSql);
    $stmt->execute([
        ':first_name' => $data['firstName'],
        ':last_name' => $data['lastName'],
        ':email' => $data['email'],
        ':password' => $passwordHash
    ]);

    http_response_code(201);
    echo json_encode(['success' => true, 'message' => 'Registration successful! Please login.']);

} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Registration failed: ' . $e->getMessage()]);
}
?>
