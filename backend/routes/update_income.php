<?php
// update_income.php

// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// Include your database connection (modify this path if necessary)
include_once('../config/db.php');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    handlePost($conn);
} else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    handlePut($conn);
} else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    handleDelete($conn);
} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    handleGet($conn);
}

function handleGet ($conn) {
    if (isset($_GET['user_id']) && isset($_GET['token'])) {
        $userID = intval($_GET['user_id']);
        $token = $_GET['token'];

        if (!authenticateUser($conn, $userID, $token)) {
            echo json_encode(['success' => false, 'message' => 'Failed to authenticate User: ' . $userID]);
            exit;
        }

        $totalIncome = 0;

        if (isset($_GET['current_month']) && $_GET['current_month'] === 'true') {
            $currentYear = date('Y');
            $currentMonth = date('m');
            $query = "SELECT SUM(income_amount) AS totalIncome FROM income WHERE user_id = ? AND YEAR(date) = ? AND MONTH(date) = ?";

            if ($stmt = $conn->prepare($query)) {
                $stmt->bind_param('iii', $userID, $currentYear, $currentMonth);
                if ($stmt->execute()) {
                    $stmt->bind_result($totalIncome);
                    $stmt->fetch();
                }
                $stmt->close();
            }

            echo json_encode(['success' => true, 'totalIncome' => $totalIncome !== null ? $totalIncome : 0]);
        } else if (isset($_GET['detailed']) && $_GET['detailed'] === 'true') {
            $query = "SELECT id, income_amount, category, date FROM income WHERE user_id = ? ORDER BY date DESC";
            $incomeRecords = [];

            if ($stmt = $conn->prepare($query)) {
                $stmt->bind_param('i', $userID);
                if ($stmt->execute()) {
                    $result = $stmt->get_result();
                    while ($row = $result->fetch_assoc()) {
                        $incomeRecords[] = $row;
                    }
                }
                $stmt->close();
            }

            echo json_encode(['success' => true, 'incomes' => $incomeRecords]);
        } else {
            $query = "SELECT SUM(income_amount) AS totalIncome FROM income WHERE user_id = ?";
            if ($stmt = $conn->prepare($query)) {
                $stmt->bind_param('i', $userID);
                if ($stmt->execute()) {
                    $stmt->bind_result($totalIncome);
                    $stmt->fetch();
                }
                $stmt->close();
            }

            echo json_encode(['success' => true, 'totalIncome' => $totalIncome !== null ? $totalIncome : 0]);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Missing required field: user_id.']);
    }
    $conn->close();
}

function handlePost ($conn) {
    $data = json_decode(file_get_contents('php://input'), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(['success' => false, 'message' => 'Invalid JSON: ' . json_last_error_msg()]);
        exit;
    }

    $userID = $data['user_id'];
    $token = $data['userToken'];

    if (!authenticateUser($conn, $userID, $token)) {
        echo json_encode(['success' => false, 'message' => 'Failed to authenticate User: ' . $userID]);
        exit;
    }

    $userID = $data['user_id'] ?? null;
    $incomeAmount = $data['income_amount'] ?? null;
    $category = $data['category'] ?? null;
    $date = $data['date'] ?? null;

    if (isset($userID) && isset($incomeAmount) && isset($category) && isset($date)) {

        $query = "INSERT INTO income (user_id, income_amount, category, date) VALUES (?, ?, ?, ?)";

        $stmt = $conn->prepare($query);
        $stmt->bind_param('idss', $userID, $incomeAmount, $category, $date);
        $stmt->execute();
        $stmt->close();

        echo json_encode(['success' => true, 'message' => 'Income record added successfully!']);

    } else {
        echo json_encode(['success' => false, 'message' => 'Missing required fields: user_id, income_amount, category, or date.']);
    }
    $conn->close();
}

function handlePut ($conn) {
    $data = json_decode(file_get_contents('php://input'), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(['success' => false, 'message' => 'Invalid JSON: ' . json_last_error_msg()]);
        exit;
    }

    $userID = $data['user_id'];
    $token = $data['userToken'];

    if (!authenticateUser($conn, $userID, $token)) {
        echo json_encode(['success' => false, 'message' => 'Failed to authenticate User: ' . $userID]);
        exit;
    }

    if (isset($data['id']) && isset($data['user_id']) && isset($data['income_amount']) && isset($data['category']) && isset($data['date'])) {
        $id = intval($data['id']);
        $userID = intval($data['user_id']);
        $incomeAmount = floatval($data['income_amount']);
        $category = $data['category'];
        $date = $data['date'];

        $query = "UPDATE income SET income_amount = ?, category = ?, date = ? WHERE id = ? AND user_id = ?";
        if ($stmt = $conn->prepare($query)) {
            $stmt->bind_param('dssii', $incomeAmount, $category, $date, $id, $userID);
            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'message' => 'Income record updated successfully!']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Error executing query: ' . $stmt->error]);
            }
            $stmt->close();
        } else {
            echo json_encode(['success' => false, 'message' => 'Error preparing query: ' . $conn->error]);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Missing required fields for updating income.']);
    }
    $conn->close();
}

function handleDelete ($conn) {
    $data = json_decode(file_get_contents('php://input'), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(['success' => false, 'message' => 'Invalid JSON: ' . json_last_error_msg()]);
        exit;
    }

    $userID = $data['user_id'];
    $token = $data['userToken'];

    if (!authenticateUser($conn, $userID, $token)) {
        echo json_encode(['success' => false, 'message' => 'Failed to authenticate User: ' . $userID]);
        exit;
    }

    if (isset($data['id'])) {
        $id = intval($data['id']);

        $query = "DELETE FROM income WHERE id = ?";
        if ($stmt = $conn->prepare($query)) {
            $stmt->bind_param('i', $id);
            if ($stmt->execute()) {
                if ($stmt->affected_rows > 0) {
                    echo json_encode(['success' => true, 'message' => 'Income entry deleted successfully.']);
                } else {
                    echo json_encode(['success' => false, 'message' => 'No income entry found with that ID.']);
                }
            } else {
                echo json_encode(['success' => false, 'message' => 'Error deleting income entry: ' . $stmt->error]);
            }
            $stmt->close();
        } else {
            echo json_encode(['success' => false, 'message' => 'Error preparing query: ' . $conn->error]);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid income ID.']);
    }
    $conn->close();
}

function authenticateUser($conn, $userID, $token) {
    $auth_stmt = $conn->prepare("SELECT * FROM users WHERE id = ? AND auth_token = ?");
    $auth_stmt->bind_param("is", $userID, $token);
    $auth_stmt->execute();
    $auth_result = $auth_stmt->get_result();
    $auth_stmt->close();

    return $auth_result->num_rows > 0;
}