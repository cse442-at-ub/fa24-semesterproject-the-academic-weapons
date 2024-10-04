<?php
// Enable error display for debugging (remove in production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include '../config/db.php'; // Ensure this sets up $conn

// Handle CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit; // End the script for OPTIONS requests
}

header('Content-Type: application/json');

// Get JSON input
$rawInput = file_get_contents('php://input');
error_log('Raw Input: ' . $rawInput); // Log the raw input to check the JSON format
$data = json_decode($rawInput, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['success' => false, 'message' => 'Invalid JSON: ' . json_last_error_msg()]);
    exit;
}

// Retrieve token and new password from the request body
$token = $data['token'] ?? null;
$password = $data['password'] ?? null;

error_log('Token received: ' . $token);
error_log('Password received: ' . $password);

// Check if token and password are present
if (empty($token) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Token and password are required']);
    exit;
}

// Debugging: Log database connection status
if (!$conn) {
    error_log('Database connection error: ' . mysqli_connect_error());
}

// Check if the token is valid and not expired
$sql = "SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > NOW()";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    error_log('Database error: ' . $conn->error); // Log the SQL error
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
    exit;
}

$stmt->bind_param("s", $token);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    error_log('No matching token found or token expired.');
    echo json_encode(['success' => false, 'message' => 'Invalid or expired token']);
    $stmt->close();
    $conn->close();
    exit;
}

// Hash the new password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Update user's password and clear the reset token
$updateSql = "UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE reset_token = ?";
$updateStmt = $conn->prepare($updateSql);

if (!$updateStmt) {
    error_log('Database error: ' . $conn->error);
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
    exit;
}

$updateStmt->bind_param("ss", $hashedPassword, $token);

if ($updateStmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Password has been reset successfully']);
} else {
    error_log('Error updating password: ' . $updateStmt->error);
    echo json_encode(['success' => false, 'message' => 'Error updating password: ' . $updateStmt->error]);
}

$updateStmt->close();
$stmt->close();
$conn->close();
?>
