<?php

include '../config/db.php'; // Ensure this sets up $conn

// Handle CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    getWidgetOrder($conn);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    saveWidgetOrder($conn);
}

function getWidgetOrder($conn)
{
    if (isset($_GET['id']) && isset($_GET['token'])) {
        $id = intval($_GET['id']);
        $token = $_GET['token'];

        if (!authenticateUser($conn, $id, $token)) {
            echo json_encode(['success' => false, 'message' => 'Failed to authenticate User: ' . $id]);
            exit;
        }

        $stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();

            if ($user['widget_order'] != null) {
                echo json_encode(['success' => true, 'widget_order' => json_decode($user['widget_order'])]);
            } else {
                echo json_encode(['success' => true, 'widget_order' => "Default"]);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'User not found']);
        }

        $stmt->close();
        $conn->close();
    } else {
        echo json_encode(['error' => 'No ID or Token parameter provided']);
    }
}

function saveWidgetOrder($conn)
{
    $data = json_decode(file_get_contents('php://input'), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(['success' => false, 'message' => 'Invalid JSON: ' . json_last_error_msg()]);
        exit;
    }

    $userID = $data['userID'] ?? null;
    $token = $data['userToken'] ?? null;
    $widgetOrder = $data['newOrder'] ?? null;

    if (empty($userID) || empty($widgetOrder) || empty($token)) {
        echo json_encode(['success' => false, 'message' => 'User ID, Token, and widget order data are required']);
        exit;
    }

    if (!authenticateUser($conn, $userID, $token)) {
        echo json_encode(['success' => false, 'message' => 'Failed to authenticate User: ' . $userID]);
        exit;
    }

    $json_order = json_encode($widgetOrder);

    $stmt = $conn->prepare("UPDATE users SET widget_order = ? WHERE id = ?");

    $stmt->bind_param("si", $json_order, $userID);
    $stmt->execute();
    $stmt->close();
    $conn->close();

    echo json_encode(['success' => true, 'message' => 'Order successfully updated']);
}

function authenticateUser($conn, $userID, $token) {
    $auth_stmt = $conn->prepare("SELECT * FROM users WHERE id = ? AND auth_token = ?");
    $auth_stmt->bind_param("is", $userID, $token);
    $auth_stmt->execute();
    $auth_result = $auth_stmt->get_result();
    $auth_stmt->close();

    return $auth_result->num_rows > 0;
}