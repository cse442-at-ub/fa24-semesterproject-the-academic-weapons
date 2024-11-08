<?php
// change_password_homepage.php

// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Include the database connection
include_once('../config/db.php'); // Update path if necessary

// Check if the request is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

// Get the input data from the request
$data = json_decode(file_get_contents("php://input"), true);

$currentPassword = $data['currentPassword'] ?? '';
$newPassword = $data['newPassword'] ?? '';
$userID = $data['userID'] ?? '';
$userToken = $data['userToken'] ?? ''; // Include user token validation if needed

// Validate the inputs
if (empty($currentPassword) || empty($newPassword) || empty($userID)) {
    echo json_encode(['success' => false, 'message' => 'Please fill in all required fields']);
    exit;
}

// Validate the new password format
if (!preg_match('/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/', $newPassword)) {
    echo json_encode(['success' => false, 'message' => 'New password does not meet complexity requirements']);
    exit;
}

try {
    // Retrieve the user's current hashed password from the database
    $sql = "SELECT password FROM users WHERE id = ?";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
        exit;
    }

    $stmt->bind_param("i", $userID);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'User not found']);
        exit;
    }

    $user = $result->fetch_assoc();

    // Verify the current password
    if (!password_verify($currentPassword, $user['password'])) {
        echo json_encode(['success' => false, 'message' => 'Incorrect current password']);
        exit;
    }

    // Hash the new password
    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

    // Update the password in the database
    $update_sql = "UPDATE users SET password = ? WHERE id = ?";
    $update_stmt = $conn->prepare($update_sql);

    if (!$update_stmt) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
        exit;
    }

    $update_stmt->bind_param("si", $hashedPassword, $userID);

    if ($update_stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Password updated successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to update password']);
    }

    $update_stmt->close();
    $stmt->close();
    $conn->close();

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'An error occurred: ' . $e->getMessage()]);
}
?>
