<?php

include '../config/db.php'; // Ensure this sets up $conn

// Handle CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");


if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['id']) && isset($_GET['token'])) {
        $id = intval($_GET['id']);  // Sanitize input by converting to integer
        $token = $_GET['token'];

        $auth_stmt = $conn->prepare("SELECT * FROM users WHERE id = ? AND auth_token = ?");

        $auth_stmt->bind_param("is", $id, $token);

        $auth_stmt->execute();

        $auth_result = $auth_stmt->get_result();

        if ($auth_result->num_rows === 0) {
            echo json_encode(['success' => false, 'message' => 'Failed to authenticate User: ' . $id]);
            exit;
        }

            // Prepare the SQL query
        $stmt = $conn->prepare("SELECT * FROM transactions WHERE user_id = ?");
        $stmt->bind_param("i", $id);

        // Execute the query
        $stmt->execute();

        // Get the result
        $result = $stmt->get_result();
        $transactions = array();

//         Check if any row was returned
         if ($result->num_rows > 0) {
             // Fetch the data and send it back as JSON
             // Initialize an array to store the transactions

             // Fetch all rows and add them to the transactions array
             while ($row = $result->fetch_assoc()) {
                 $transactions[] = $row;
             }
         }
         echo json_encode(['success' => true, 'transactions' => $transactions]);

        // Close the statement
        $stmt->close();
        $conn->close(); // Close the connection
    } else {
        // If 'id' parameter is missing, return an error
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

    // Retrieve id and transaction data
    $userID = $data['userID'] ?? null;
    $token = $data['userToken'] ?? null;
    $transaction = $data['saveItem'] ?? null;

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


    // Prepare an SQL statement to insert the transactions
    $stmt = $conn->prepare("INSERT INTO transactions (user_id, name, price, category, date) VALUES (?, ?, ?, ?, ?)");

    // Loop through each transaction and insert it into the database
    $name = $transaction['name'];
    $price = $transaction['price'];
    $category = $transaction['category'];
    $date = $transaction['date'];

    // Bind parameters (i for integer, d for decimal, s for strings)
    $stmt->bind_param("isdss", $userID, $name, $price, $category, $date);

    // Execute the prepared statement
    $stmt->execute();

    // Close the statement
    $stmt->close();
    $conn->close(); // Close the connection

    // Return success message
    echo json_encode(['success' => true, "message" => "Transactions successfully inserted"]);

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

    // Prepare an SQL statement to insert the transactions
    $stmt = $conn->prepare("DELETE FROM transactions WHERE id = ?");

    // Bind parameters (i for integer, d for decimal, s for strings)
    $stmt->bind_param("i", $removeID);

    // Execute the prepared statement
    $stmt->execute();

    // Close the statement
    $stmt->close();
    $conn->close(); // Close the connection

    // Return success message
    echo json_encode(['success' => true, "message" => "Transactions successfully inserted"]);

}