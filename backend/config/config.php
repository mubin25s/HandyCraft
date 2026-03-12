<?php
/**
 * Database Configuration
 * MongoDB connection settings for Handycraft E-commerce
 */

// MySQL Connection Settings
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'handycraft_db');

// API Settings
define('API_VERSION', 'v1');
define('API_BASE_URL', 'http://localhost:8000/api/');

// Error Reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// CORS Settings (for development)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// Timezone
date_default_timezone_set('UTC');

// Handle OPTIONS requests for CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>
