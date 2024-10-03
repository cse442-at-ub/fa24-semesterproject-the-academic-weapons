<?php
// File: backend/registration.php

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
$data = json_decode(file_get_contents('php://input'), true);
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['success' => false, 'message' => 'Invalid JSON: ' . json_last_error_msg()]);
    exit;
}

// Retrieve email, username, and password
$email = $data['email'] ?? null;
$username = $data['username'] ?? null;
$password = $data['password'] ?? null;

if (empty($email) || empty($username) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Email, username, and password are required']);
    exit;
}

// Log user input for debugging
error_log("Inputted email: " . $email);
error_log("Inputted username: " . $username);
error_log("Inputted password: " . $password); // Be cautious with logging passwords

// Check if the email or username already exists
$sql = "SELECT * FROM users WHERE email = ? OR username = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
    exit;
}

$stmt->bind_param("ss", $email, $username);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Email or username already exists.']);
    $stmt->close(); // Close the statement
    $conn->close(); // Close the connection
    exit;
}

// Hash the password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Prepare SQL statement for inserting the new user
$insertSql = "INSERT INTO users (email, username, password) VALUES (?, ?, ?)";
$insertStmt = $conn->prepare($insertSql);

if (!$insertStmt) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
    exit;
}

$insertStmt->bind_param("sss", $email, $username, $hashedPassword);

if ($insertStmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Registration successful!']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $insertStmt->error]);
}

$insertStmt->close(); // Close the statement
$conn->close(); // Close the connection
?>
