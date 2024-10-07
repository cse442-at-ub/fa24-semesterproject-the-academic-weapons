<?php
// File: backend/login.php

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

// Get JSON input
$data = json_decode(file_get_contents('php://input'), true);
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode(['success' => false, 'message' => 'Invalid JSON: ' . json_last_error_msg()]);
    exit;
}

// Retrieve username (or email) and password
$email = $data['email'] ?? null;
$password = $data['password'] ?? null;

if (empty($email) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'Email and password are required']);
    exit;
}

// Log user input for debugging
error_log("Inputted email: " . $email);
error_log("Inputted password: " . $password); // Be cautious with logging passwords

// Prepare SQL statement to check if email exists
$sql = "SELECT * FROM users WHERE email = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
    exit;
}

$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {

    $user = $result->fetch_assoc();

    // Verify the hashed password
    if (password_verify($password, $user['password'])) {
        $token = bin2hex(random_bytes(32));
        $expiry = date('Y-m-d H:i:s', strtotime('+24 hour'));

        $updateQuery = "UPDATE users SET auth_token = ?, auth_token_expire = ? WHERE id = ?";

        $updateStmt = $conn->prepare($updateQuery);
        if (!$updateStmt) {
            echo json_encode(['success' => false, 'message' => 'Failed to prepare update statement: ' . $conn->error]);
            exit;
        }
        $updateStmt->bind_param("ssi", $token, $expiry, $user['id']);

        if (!$updateStmt->execute()) {
            echo json_encode(['success' => false, 'message' => 'Update query execution failed: ' . $updateStmt->error]);
            exit;
        }

        echo json_encode(['success' => true, 'message' => 'Login successful', 'id' => $user['id'], 'username' => $user['username'], 'pfp' => $user['avatar'], 'auth_token' => $token]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid password']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'User not found']);
}

$stmt->close(); // Close the statement
$conn->close(); // Close the connection
