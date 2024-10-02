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
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit;
}

// Check if a file was uploaded
if (!isset($_FILES['profile_picture']) || $_FILES['profile_picture']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['success' => false, 'message' => 'File upload error']);
    exit;
}

// Validate the uploaded file (e.g., check file type and size)
$allowed_types = ['image/jpeg', 'image/png', 'image/gif'];
$file_type = $_FILES['profile_picture']['type'];
$file_size = $_FILES['profile_picture']['size'];

if (!in_array($file_type, $allowed_types) || $file_size > 2 * 1024 * 1024) { // 2MB limit
    echo json_encode(['success' => false, 'message' => 'Invalid file type or size']);
    exit;
}

// Move the uploaded file to a designated directory
$upload_dir = '../uploads/profile_pictures/';
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0777, true);
}

$file_name = basename($_FILES['profile_picture']['name']);
$target_file = $upload_dir . $file_name;

if (!move_uploaded_file($_FILES['profile_picture']['tmp_name'], $target_file)) {
    echo json_encode(['success' => false, 'message' => 'Failed to move uploaded file']);
    exit;
}

// Get the current user's ID from the session
$user_id = $_SESSION['id'];

// Prepare SQL statement to update the profile picture path
$sql = "UPDATE users SET profile_picture = ? WHERE id = ?";
$stmt = $conn->prepare($sql);



if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
    exit;
}

$stmt->bind_param("si", $target_file, $user_id);
if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Profile picture updated successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to update profile picture']);
}

$stmt->close(); // Close the statement
$conn->close(); // Close the connection
?>