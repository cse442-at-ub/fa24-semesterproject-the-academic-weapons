<?php
include '../config/db.php'; // Your database connection file

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $conn->connect_error]);
    exit;
}

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$data = json_decode(file_get_contents('php://input'), true);

$email = $data['email'] ?? null;


// // Validate the email input
// if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
//     echo json_encode(['success' => false, 'message' => 'Invalid email address.']);
//     exit;
// }

// Check if the email exists in your database
$query = "SELECT * FROM users WHERE email = ?";
$stmt = $conn->prepare($query);
if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Failed to prepare statement: ' . $conn->error]);
    exit;
}
$stmt->bind_param("s", $email);
if (!$stmt->execute()) {
    echo json_encode(['success' => false, 'message' => 'Query execution failed: ' . $stmt->error]);
    exit;
}
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'No account found with that email.']);
    exit;
}

$user = $result->fetch_assoc();
$userId = $user['id'];

// Create a unique token for password reset
$token = bin2hex(random_bytes(32));
$expiry = date('Y-m-d H:i:s', strtotime('+24 hour'));

// Store the token and expiry in the database
$updateQuery = "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?";
$updateStmt = $conn->prepare($updateQuery);
if (!$updateStmt) {
    echo json_encode(['success' => false, 'message' => 'Failed to prepare update statement: ' . $conn->error]);
    exit;
}
$updateStmt->bind_param("ssi", $token, $expiry, $userId);
if (!$updateStmt->execute()) {
    echo json_encode(['success' => false, 'message' => 'Update query execution failed: ' . $updateStmt->error]);
    exit;
}

// Construct the password reset link
$resetLink = "https://se-prod.cse.buffalo.edu/CSE442/2024-Fall/cse-442an/#/reset-password?token=$token";

// Email details
$subject = "Password Reset Request";
$body = "Hello,\n\nPlease see your code below:\nCode: $token\nClick the link below to reset your password:\n$resetLink\n\nThis link will expire in 24 hour.\n\nIf you did not request a password reset, please ignore this email.";
$headers = 'From: no-reply@yourdomain.com';

// Send the email
if (mail($email, $subject, $body, $headers)) {
    echo json_encode(['success' => true, 'message' => 'Password reset email sent successfully.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to send password reset email.']);
}

// Close the database connection
$stmt->close();
$updateStmt->close();
$conn->close();