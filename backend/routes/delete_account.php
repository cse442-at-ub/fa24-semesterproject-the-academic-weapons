<?php

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

// Retrieve userID, userToken, and password from the request
$userID = $data['userID'] ?? null;
$userToken = $data['userToken'] ?? null;
$password = $data['password'] ?? null;

if (empty($userID) || empty($userToken) || empty($password)) {
    echo json_encode(['success' => false, 'message' => 'User ID, token, and password are required']);
    exit;
}

// Fetch the user's information based on userID and userToken
$sql = "SELECT password, auth_token FROM users WHERE id = ? AND auth_token = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
    exit;
}

$stmt->bind_param("is", $userID, $userToken);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Account not found or invalid token']);
    $stmt->close();
    $conn->close();
    exit;
}

// Verify the password
$user = $result->fetch_assoc();
if (!password_verify($password, $user['password'])) {
    echo json_encode(['success' => false, 'message' => 'Incorrect password']);
    $stmt->close();
    $conn->close();
    exit;
}

$stmt->close(); // Close the statement

// Prepare SQL to delete the account
$deleteSql = "DELETE FROM users WHERE id = ?";
$deleteStmt = $conn->prepare($deleteSql);

if (!$deleteStmt) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $conn->error]);
    exit;
}

$deleteStmt->bind_param("i", $userID);

if ($deleteStmt->execute()) {
    echo json_encode(['success' => true, "auth" => True, 'message' => 'Account deleted successfully']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $deleteStmt->error]);
}

$deleteStmt->close(); // Close the statement
$conn->close(); // Close the connection
?>
