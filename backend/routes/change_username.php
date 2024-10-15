<?php
session_start();
include '../config/db.php'; // Ensure this sets up $conn

// Handle CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit; // End the script for OPTIONS requests
}

header('Content-Type: application/json');

// Check if the user is logged in
// if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
//     echo json_encode(['success' => false, 'message' => 'User not logged in']);
//     exit;
// }

// Get JSON input
$data = json_decode(file_get_contents('php://input'), true);
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['success' => false, 'message' => 'Invalid JSON: ' . json_last_error_msg()]);
    exit;
}

// Retrieve new username
$new_username = $data['newUsername'] ?? 'Default';

if (empty($new_username)) {
    echo json_encode(['success' => false, 'auth' => true, 'message' => 'New username is required']);
    exit;
}

// Get the current user's ID from the session
$user_id = $data['userID'];
$token = $data['userToken'];

$auth_stmt = $conn->prepare("SELECT * FROM users WHERE id = ? AND auth_token = ?");

$auth_stmt->bind_param("is", $user_id, $token);

$auth_stmt->execute();

$auth_result = $auth_stmt->get_result();

if ($auth_result->num_rows === 0) {
    echo json_encode(['success' => false, 'auth' => false, 'message' => 'Failed to authenticate User: ' . $user_id]);
    exit;
}

// Prepare SQL statement to update the username
$sql = "UPDATE users SET username = ? WHERE id = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(['success' => false, 'auth' => true,  'message' => 'Database error: ' . $conn->error]);
    exit;
}

$stmt->bind_param("si", $new_username, $user_id);
if ($stmt->execute()) {
    echo json_encode(['success' => true, 'auth' => true, 'message' => 'Username updated successfully']);
} else {
    echo json_encode(['success' => false, 'auth' => true, 'message' => 'Failed to update username']);
}

$stmt->close(); // Close the statement
$conn->close(); // Close the connection
?>