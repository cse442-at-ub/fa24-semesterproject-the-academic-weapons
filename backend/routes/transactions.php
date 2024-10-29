<?php

include '../config/db.php'; // Ensure this sets up $conn

// Handle CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, DELETE, UPDATE");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['id']) && isset($_GET['token'])) {
        $id = intval($_GET['id']);  // Sanitize input by converting to integer
        $token = $_GET['token'];

        // Authenticate user
        $auth_stmt = $conn->prepare("SELECT * FROM users WHERE id = ? AND auth_token = ?");
        $auth_stmt->bind_param("is", $id, $token);
        $auth_stmt->execute();
        $auth_result = $auth_stmt->get_result();

        if ($auth_result->num_rows === 0) {
            echo json_encode(['success' => false, 'message' => 'Failed to authenticate User: ' . $id]);
            exit;
        }

        // Process recurring transactions
        $today = new DateTime();
        $todayStr = $today->format('Y-m-d');

        // Get all recurring transactions for the user that are due for recurrence
        $recurrence_stmt = $conn->prepare("SELECT * FROM transactions WHERE user_id = ? AND recurring = 1 AND next_recurrence_date <= ?");
        $recurrence_stmt->bind_param("is", $id, $todayStr);
        $recurrence_stmt->execute();
        $recurring_transactions = $recurrence_stmt->get_result();

        while ($transaction = $recurring_transactions->fetch_assoc()) {
            // Calculate the next recurrence date (one month after today)
            $nextRecurrenceDate = (new DateTime($todayStr))->modify('+1 month')->format('Y-m-d');

            // Check if a transaction for this user with the same name and date already exists for the current month
            $existing_check_stmt = $conn->prepare("SELECT * FROM transactions WHERE user_id = ? AND name = ? AND date = ?");
            $existing_check_stmt->bind_param("iss", $id, $transaction['name'], $todayStr);
            $existing_check_stmt->execute();
            $existing_result = $existing_check_stmt->get_result();

            if ($existing_result->num_rows === 0) {
                // No duplicate found, so insert the new transaction for this month
                $insertStmt = $conn->prepare("INSERT INTO transactions (user_id, name, price, category, date, recurring, next_recurrence_date) VALUES (?, ?, ?, ?, ?, ?, ?)");
                $insertStmt->bind_param("isdssis", $transaction['user_id'], $transaction['name'], $transaction['price'], $transaction['category'], $todayStr, $transaction['recurring'], $nextRecurrenceDate);
                $insertStmt->execute();
                $insertStmt->close();
            }

            $existing_check_stmt->close();
        }

        $recurrence_stmt->close();

        // Fetch all transactions for the user (including any newly added recurring ones)
        $stmt = $conn->prepare("SELECT * FROM transactions WHERE user_id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();

        $transactions = array();
        while ($row = $result->fetch_assoc()) {
            $transactions[] = $row;
        }

        // Return transactions
        echo json_encode([
            'success' => true,
            'transactions' => $transactions,
        ]);

        $stmt->close();
        $conn->close();
    } else {
        echo json_encode(array("error" => "No ID or Token parameter provided"));
    }
}




if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get JSON input
    $data = json_decode(file_get_contents('php://input'), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(['success' => false, 'message' => 'Invalid JSON: ' . json_last_error_msg()]);
        exit;
    }

    // Retrieve transaction data
    $userID = $data['userID'] ?? null;
    $token = $data['userToken'] ?? null;
    $transaction = $data['saveItem'] ?? null;

    if (empty($userID) || empty($transaction) || empty($token)) {
        echo json_encode(['success' => false, 'message' => 'User ID, Token, and transaction data are required']);
        exit;
    }

    // Authenticate user
    $auth_stmt = $conn->prepare("SELECT * FROM users WHERE id = ? AND auth_token = ?");
    $auth_stmt->bind_param("is", $userID, $token);
    $auth_stmt->execute();
    $auth_result = $auth_stmt->get_result();

    if ($auth_result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Failed to authenticate User: ' . $userID]);
        exit;
    }
    $auth_stmt->close();

    // Prepare transaction data
    $name = $transaction['name'];
    $price = $transaction['price'];
    $category = $transaction['category'];
    $date = $transaction['date'];
    $recurring = $transaction['recurring'] ? 1 : 0;  // Assume recurring is boolean

    // Calculate next_recurrence_date for recurring transactions
    $next_recurrence_date = null;
    if ($recurring) {
        $next_recurrence_date = (new DateTime($date))->modify('+1 month')->format('Y-m-d');
    }

    // Insert the transaction into the database
    $stmt = $conn->prepare("INSERT INTO transactions (user_id, name, price, category, date, recurring, next_recurrence_date) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("isdssis", $userID, $name, $price, $category, $date, $recurring, $next_recurrence_date);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, "message" => "Transaction successfully inserted"]);
    } else {
        echo json_encode(['success' => false, "message" => "Error inserting transaction: " . $stmt->error]);
    }

    $stmt->close();
    $conn->close();
}


if ($_SERVER['REQUEST_METHOD'] === 'UPDATE') {
    // Get JSON input
    $data = json_decode(file_get_contents('php://input'), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(['success' => false, 'message' => 'Invalid JSON: ' . json_last_error_msg()]);
        exit;
    }

    // Retrieve id and transaction data
    $userID = $data['userID'] ?? null;
    $token = $data['userToken'] ?? null;
    $transaction = $data['updateItem'] ?? null;

    if (empty($userID) || empty($transaction) || empty($token)) {
        echo json_encode(['success' => false, 'message' => 'User ID and Token and Save Item are required']);
        exit;
    }

    $auth_stmt = $conn->prepare("SELECT * FROM users WHERE id = ? AND auth_token = ?");
    $auth_stmt->bind_param("is", $userID, $token);
    $auth_stmt->execute();
    $auth_result = $auth_stmt->get_result();

    if ($auth_result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Failed to authenticate User: ' . $userID]);
        exit;
    }

    // Prepare an SQL statement to update the transactions
    $stmt = $conn->prepare("UPDATE transactions SET name = ?, price = ?, category = ?, date = ?,recurring=? WHERE id = ?");

    $name = $transaction['name'];
    $price = $transaction['price'];
    $category = $transaction['category'];
    $date = $transaction['date'];
    $recurring = isset($transaction['recurring']) && $transaction['recurring'] ? 1 : 0;
    $item_id = $transaction['id'];

    // Bind parameters (i for integer, d for decimal, s for strings)
    $stmt->bind_param("sdssii", $name, $price, $category, $date,$recurring, $item_id);

    // Execute the prepared statement
    $stmt->execute();

    // Close the statement
    $stmt->close();
    $conn->close(); // Close the connection

    // Return success message
    echo json_encode(['success' => true, "message" => "Transactions successfully updated"]);
}



if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Get JSON input
    $data = json_decode(file_get_contents('php://input'), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(['success' => false, 'message' => 'Invalid JSON: ' . json_last_error_msg()]);
        exit;
    }

    // Retrieve id and transaction data
    $userID = $data['userID'] ?? null;
    $token = $data['userToken'] ?? null;
    $removeID = $data['removeID'] ?? null;

    if (empty($userID) || empty($removeID) || empty($token)) {
        echo json_encode(['success' => false, 'message' => 'User ID and Token and Remove ID are required']);
        exit;
    }

    $auth_stmt = $conn->prepare("SELECT * FROM users WHERE id = ? AND auth_token = ?");
    $auth_stmt->bind_param("is", $userID, $token);
    $auth_stmt->execute();
    $auth_result = $auth_stmt->get_result();

    if ($auth_result->num_rows === 0) {
        echo json_encode(['success' => false, 'message' => 'Failed to authenticate User: ' . $userID]);
        exit;
    }

    // Prepare an SQL statement to delete the transactions
    $stmt = $conn->prepare("DELETE FROM transactions WHERE id = ?");
    $stmt->bind_param("i", $removeID);

    // Execute the prepared statement
    $stmt->execute();

    // Close the statement
    $stmt->close();
    $conn->close(); // Close the connection

    // Return success message
    echo json_encode(['success' => true, "message" => "Transaction successfully deleted"]);
}
?>
