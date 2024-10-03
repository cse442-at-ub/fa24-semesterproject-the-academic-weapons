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

// Retrieve new pfp
$pfp = $data['pfp'] ?? 0;

if (empty($pfp)) {
    echo json_encode(['success' => false, 'message' => 'New pfp is required']);
    exit;
}

// Get the current user's ID from the session
$user_id = $data['userID'];

// Prepare SQL statement to update the pfp
$sql = "UPDATE users SET avatar = ? WHERE id = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
    exit;
}

$stmt->bind_param("si", $pfp, $user_id);
if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Profile picture updated successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to update username']);
}

$stmt->close(); // Close the statement
$conn->close(); // Close the connection
?>