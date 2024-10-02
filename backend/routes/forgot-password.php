<?php
include '../config/db.php'; // Your database connection file

header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
// Get the JSON input
$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? null;

// Validate the email input
if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email address.']);
    exit;
}

// Check if the email exists in your database (replace 'users' with your actual table name)
$query = "SELECT * FROM users WHERE email = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    // If the email does not exist in your database
    echo json_encode(['success' => false, 'message' => 'No account found with that email.']);
    exit;
}

$user = $result->fetch_assoc();
$userId = $user['id']; // Assuming 'id' is the primary key column in your 'users' table

// Create a unique token for password reset
$token = bin2hex(random_bytes(32));

// Set an expiry time for the token (e.g., 1 hour from now)
$expiry = date('Y-m-d H:i:s', strtotime('+1 hour'));

// Store the token and expiry in the database (replace 'users' with your actual table name)
$updateQuery = "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?";
$updateStmt = $conn->prepare($updateQuery);
$updateStmt->bind_param("ssi", $token, $expiry, $userId);
$updateStmt->execute();

// Check if the token was successfully stored
if ($updateStmt->affected_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Failed to generate reset token.']);
    exit;
}

// Construct the password reset link (replace 'http://your-domain.com' with your actual domain)
$resetLink = "http://localhost:5173/reset-password?token=$token";

// Email details
$subject = "Password Reset Request";
$body = "Hello,\n\nClick the link below to reset your password:\n$resetLink\n\nThis link will expire in 1 hour.\n\nIf you did not request a password reset, please ignore this email.";
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
?>
