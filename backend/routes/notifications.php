<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Content-Type: application/json");

include '../config/db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Get user ID from query parameters
    if (!isset($_GET['userId'])) {
        echo json_encode(["success" => false, "message" => "User ID is required"]);
        exit;
    }

    $userId = intval($_GET['userId']); // Sanitize input
    $currentDate = date("Y-m-d");
    $nextWeekDate = date("Y-m-d", strtotime("+7 days"));

    // Retrieve recurring transactions for the user within the next week
    $recurringQuery = "
        SELECT id, name, price, category, date, recurring, next_recurrence_date
        FROM transactions
        WHERE user_id = ?
        AND recurring = 1
        AND next_recurrence_date IS NOT NULL
        AND next_recurrence_date BETWEEN ? AND ?
    ";

    $stmt = $conn->prepare($recurringQuery);
    $stmt->bind_param("iss", $userId, $currentDate, $nextWeekDate);
    $stmt->execute();
    $result = $stmt->get_result();

    // Insert new notifications only if they don't already exist
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $notificationCheckQuery = "
                SELECT id FROM notifications
                WHERE user_id = ? AND transaction_id = ?
            ";

            $checkStmt = $conn->prepare($notificationCheckQuery);
            $checkStmt->bind_param("ii", $userId, $row['id']);
            $checkStmt->execute();
            $checkResult = $checkStmt->get_result();

            // If no existing notification, create a new one
            if ($checkResult->num_rows === 0) {
                $insertNotificationQuery = "
                    INSERT INTO notifications (user_id, transaction_id, message, due_date, is_read)
                    VALUES (?, ?, ?, ?, 0)
                ";

                $message = "Upcoming Transaction: {$row['name']} - \${$row['price']}";
                $insertStmt = $conn->prepare($insertNotificationQuery);
                $insertStmt->bind_param("iiss", $userId, $row['id'], $message, $row['next_recurrence_date']);
                $insertStmt->execute();
                $insertStmt->close();
            }

            $checkStmt->close();
        }
    }

    // Retrieve all notifications for the user
    $fetchNotificationsQuery = "
        SELECT id, transaction_id, message, due_date, is_read
        FROM notifications
        WHERE user_id = ?
        ORDER BY due_date ASC
    ";

    $fetchStmt = $conn->prepare($fetchNotificationsQuery);
    $fetchStmt->bind_param("i", $userId);
    $fetchStmt->execute();
    $notificationsResult = $fetchStmt->get_result();

    $notifications = [];
    while ($notification = $notificationsResult->fetch_assoc()) {
        $notifications[] = [
            "id" => $notification['id'],
            "transactionId" => $notification['transaction_id'],
            "message" => $notification['message'],
            "dueDate" => $notification['due_date'],
            "isRead" => $notification['is_read'] == 1
        ];
    }

    $fetchStmt->close();
    $conn->close();

    echo json_encode([
        "success" => true,
        "notifications" => $notifications
    ]);
} elseif ($method === 'POST') {
    // Handle marking notifications as read
    $inputData = json_decode(file_get_contents("php://input"), true);

    if (isset($inputData['markAsRead']) && is_array($inputData['markAsRead'])) {
        $notificationIds = $inputData['markAsRead'];

        // Sanitize and validate IDs
        $ids = implode(',', array_map('intval', $notificationIds));

        // Update notifications as read
        $updateQuery = "UPDATE notifications SET is_read = 1 WHERE id IN ($ids)";
        $result = $conn->query($updateQuery);

        if ($result) {
            echo json_encode(["success" => true, "message" => "Notifications marked as read"]);
        } else {
            echo json_encode(["success" => false, "message" => "Failed to update notifications"]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Invalid request payload"]);
    }

    $conn->close();
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
}
?>
