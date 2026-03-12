<?php
/**
 * Login API Endpoint
 * Handles user authentication
 */

require_once __DIR__ . '/../../config/Database.php';

// Initialize database
// $pdo is available

// Get POST data
$data = json_decode(file_get_contents('php://input'), true);

// Validate input
if (!$data || !isset($data['email']) || !isset($data['password'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Email and password are required']);
    exit;
}

// Check if user exists
$sql = "SELECT * FROM users WHERE email = :email";
$stmt = $pdo->prepare($sql);
$stmt->execute([':email' => $data['email']]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user) {
    // Verify password
    if (password_verify($data['password'], $user['password'])) {
        // Success
        $userSession = [
            'id' => $user['id'],
            'firstName' => $user['first_name'],
            'lastName' => $user['last_name'],
            'email' => $user['email'],
            'loginTime' => date('c')
        ];

        echo json_encode([
            'success' => true,
            'message' => 'Login successful!',
            'user' => $userSession
        ]);
    } else {
        // Invalid password
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Incorrect password!']);
    }
} else {
    // User not found
    http_response_code(404);
    echo json_encode([
        'success' => false, 
        'message' => 'You are not a registered user. Please register!',
        'notRegistered' => true
    ]);
}
?>
