<?php
// update_income.php

// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

// Handle preflight requests (for OPTIONS method)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// Include your database connection (modify this path if necessary)
include_once('../config/db.php');

// Handle POST request to insert new income
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['user_id']) && isset($_POST['income_amount']) && isset($_POST['category']) && isset($_POST['date'])) {
        $userID = intval($_POST['user_id']);
        $incomeAmount = floatval($_POST['income_amount']);
        $category = $_POST['category'];
        $date = $_POST['date'];

        $query = "INSERT INTO income (user_id, income_amount, category, date) VALUES (?, ?, ?, ?)";
        if ($stmt = $conn->prepare($query)) {
            $stmt->bind_param('idss', $userID, $incomeAmount, $category, $date);
            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'message' => 'Income record added successfully!']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Error executing query: ' . $stmt->error]);
            }
            $stmt->close();
        } else {
            echo json_encode(['success' => false, 'message' => 'Error preparing query: ' . $conn->error]);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Missing required fields: user_id, income_amount, category, or date.']);
    }
}

// Handle PUT request to update existing income
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    parse_str(file_get_contents("php://input"), $inputData);
    if (isset($inputData['id']) && isset($inputData['user_id']) && isset($inputData['income_amount']) && isset($inputData['category']) && isset($inputData['date'])) {
        $id = intval($inputData['id']);
        $userID = intval($inputData['user_id']);
        $incomeAmount = floatval($inputData['income_amount']);
        $category = $inputData['category'];
        $date = $inputData['date'];

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
}

// Handle DELETE request to remove an income record
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    parse_str(file_get_contents("php://input"), $inputData);
    if (isset($inputData['id'])) {
        $id = intval($inputData['id']);

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
}

// Handle GET request to fetch total income for a user or detailed income records
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['user_id'])) {
        $userID = intval($_GET['user_id']);
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
}

$conn->close();
?>
