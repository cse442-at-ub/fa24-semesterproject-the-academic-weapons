<?php
// update_income.php

// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// Include your database connection (modify this path if necessary)
include_once('../config/db.php');

// Route requests based on HTTP method
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    handlePost($conn);
} else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    handlePut($conn);
} else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    handleDelete($conn);
} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    handleGet($conn);
} else {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
    exit;
}

// Authenticate user
function authenticateUser($conn, $userID, $token) {
    $auth_stmt = $conn->prepare("SELECT * FROM users WHERE id = ? AND auth_token = ?");
    $auth_stmt->bind_param("is", $userID, $token);
    $auth_stmt->execute();
    $auth_result = $auth_stmt->get_result();
    $auth_stmt->close();

    return $auth_result->num_rows > 0;
}

// Handle GET requests
function handleGet($conn) {
    if (!isset($_GET['user_id']) || !isset($_GET['token'])) {
        echo json_encode(["success" => false, "message" => "User ID and token are required"]);
        exit;
    }

    $userID = intval($_GET['user_id']);
    $token = $_GET['token'];

    if (!authenticateUser($conn, $userID, $token)) {
        echo json_encode(["success" => false, "message" => "Authentication failed"]);
        exit;
    }

    if (isset($_GET['current_month']) && $_GET['current_month'] === 'true') {
        $currentYear = date('Y');
        $currentMonth = date('m');
        $query = "SELECT SUM(income_amount) AS totalIncome FROM income WHERE user_id = ? AND YEAR(date) = ? AND MONTH(date) = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param('iii', $userID, $currentYear, $currentMonth);
        $stmt->execute();
        $stmt->bind_result($totalIncome);
        $stmt->fetch();
        $stmt->close();
        echo json_encode(["success" => true, "totalIncome" => $totalIncome ?: 0]);
    } else if (isset($_GET['detailed']) && $_GET['detailed'] === 'true') {
        $query = "SELECT id, income_amount, category, date, recurring, next_recurrence_date FROM income WHERE user_id = ? ORDER BY date DESC";
        $stmt = $conn->prepare($query);
        $stmt->bind_param('i', $userID);
        $stmt->execute();
        $result = $stmt->get_result();
        $incomeRecords = [];
        while ($row = $result->fetch_assoc()) {
            $incomeRecords[] = $row;
        }
        $stmt->close();
        echo json_encode(["success" => true, "incomes" => $incomeRecords]);
    } else {
        $query = "SELECT SUM(income_amount) AS totalIncome FROM income WHERE user_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param('i', $userID);
        $stmt->execute();
        $stmt->bind_result($totalIncome);
        $stmt->fetch();
        $stmt->close();
        echo json_encode(["success" => true, "totalIncome" => $totalIncome ?: 0]);
    }
}

// Handle POST requests (Add new income)
function handlePost($conn) {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['user_id'], $data['userToken'], $data['income_amount'], $data['category'], $data['date'])) {
        echo json_encode(["success" => false, "message" => "Missing required fields"]);
        exit;
    }

    $userID = intval($data['user_id']);
    $token = $data['userToken'];
    $incomeAmount = floatval($data['income_amount']);
    $category = $data['category'];
    $date = $data['date'];
    $isRecurring = isset($data['is_recurring']) ? intval($data['is_recurring']) : 0;

    if (!authenticateUser($conn, $userID, $token)) {
        echo json_encode(["success" => false, "message" => "Authentication failed"]);
        exit;
    }

    $nextRecurrenceDate = $isRecurring ? date('Y-m-d', strtotime('+1 month', strtotime($date))) : null;

    $query = "INSERT INTO income (user_id, income_amount, category, date, recurring, next_recurrence_date) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('idssis', $userID, $incomeAmount, $category, $date, $isRecurring, $nextRecurrenceDate);
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Income added successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error adding income: " . $stmt->error]);
    }
    $stmt->close();
}

// Handle PUT requests (Update existing income)
function handlePut($conn) {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['user_id'], $data['userToken'], $data['id'], $data['income_amount'], $data['category'], $data['date'])) {
        echo json_encode(["success" => false, "message" => "Missing required fields"]);
        exit;
    }

    $userID = intval($data['user_id']);
    $token = $data['userToken'];
    $id = intval($data['id']);
    $incomeAmount = floatval($data['income_amount']);
    $category = $data['category'];
    $date = $data['date'];
    $isRecurring = isset($data['is_recurring']) ? intval($data['is_recurring']) : 0;

    if (!authenticateUser($conn, $userID, $token)) {
        echo json_encode(["success" => false, "message" => "Authentication failed"]);
        exit;
    }

    $nextRecurrenceDate = $isRecurring ? date('Y-m-d', strtotime('+1 month', strtotime($date))) : null;

    $query = "UPDATE income SET income_amount = ?, category = ?, date = ?, recurring = ?, next_recurrence_date = ? WHERE id = ? AND user_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('dssisii', $incomeAmount, $category, $date, $isRecurring, $nextRecurrenceDate, $id, $userID);
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Income updated successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error updating income: " . $stmt->error]);
    }
    $stmt->close();
}

// Handle DELETE requests (Delete income)
function handleDelete($conn) {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['userID'], $data['userToken'], $data['id'])) {
        echo json_encode(["success" => false, "message" => "Missing required fields"]);
        exit;
    }

    $userID = intval($data['userID']);
    $token = $data['userToken'];
    $id = intval($data['id']);

    if (!authenticateUser($conn, $userID, $token)) {
        echo json_encode(["success" => false, "message" => "Authentication failed"]);
        exit;
    }

    $query = "DELETE FROM income WHERE id = ? AND user_id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param('ii', $id, $userID);
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Income deleted successfully"]);
    } else {
        echo json_encode(["success" => false, "message" => "Error deleting income: " . $stmt->error]);
    }
    $stmt->close();
}
?>
