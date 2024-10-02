<?php
include '../config/db.php'; // Adjust the path to your actual db.php location

// Sample email for testing purposes
$test_email = "zcsanger@buffalo.edu";

// Validate the email format
if (empty($test_email) || !filter_var($test_email, FILTER_VALIDATE_EMAIL)) {
    echo "Invalid email address.";
    exit;
}

// Check if the email exists in your database
$query = "SELECT * FROM users WHERE email = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $test_email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo "No account found with that email.";
    exit;
}

$user = $result->fetch_assoc();
$userId = $user['id']; // Assuming 'id' is the primary key column in your 'users' table

// Create a unique token for password reset
$token = bin2hex(random_bytes(32));

// Set an expiry time for the token (e.g., 1 hour from now)
$expiry = date('Y-m-d H:i:s', strtotime('+1 hour'));

// Store the token and expiry in the database
$updateQuery = "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?";
$updateStmt = $conn->prepare($updateQuery);
$updateStmt->bind_param("ssi", $token, $expiry, $userId);
$updateStmt->execute();

// Check if the token was successfully stored
if ($updateStmt->affected_rows === 0) {
    echo "Failed to generate reset token.";
    exit;
}

// Construct the password reset link
$resetLink = "http://localhost:5173/reset-password?token=$token";

// Email details
$subject = "Password Reset Request";
$body = "Hello,\n\nClick the link below to reset your password:\n$resetLink\n\nThis link will expire in 1 hour.\n\nIf you did not request a password reset, please ignore this email.";
$headers = 'From: no-reply@yourdomain.com';

// Send the email
if (mail($test_email, $subject, $body, $headers)) {
    echo "Password reset email sent successfully.";
} else {
    echo "Failed to send password reset email.";
}

// Close the database connection
$stmt->close();
$updateStmt->close();
$conn->close();
?>
