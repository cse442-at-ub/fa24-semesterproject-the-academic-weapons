<?php
// update_income.php

// Enable CORS
header('Access-Control-Allow-Origin: *'); // Allow requests from any origin, change '*' to specific domain if needed
header('Access-Control-Allow-Methods: POST, GET, OPTIONS'); // Allow POST, GET, and OPTIONS methods
header('Access-Control-Allow-Headers: Content-Type, Authorization'); // Allow specific headers
header('Content-Type: application/json');

// Handle preflight requests (for OPTIONS method)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204); // No Content response for preflight requests
    exit;
}

// Include your database connection (modify this path if necessary)
include_once('../config/db.php');

// Handle POST request to update income
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Ensure necessary data is provided
    if (isset($_POST['user_id']) && isset($_POST['income_amount']) && isset($_POST['date'])) {
        $userID = intval($_POST['user_id']);
        $incomeAmount = floatval($_POST['income_amount']);
        $date = $_POST['date']; // Ensure that date is in 'YYYY-MM-DD' format

        // Prepare an SQL statement to insert into the 'income' table
        $query = "INSERT INTO income (user_id, income_amount, date) VALUES (?, ?, ?)";

        if ($stmt = $conn->prepare($query)) {
            // Bind the parameters to the SQL query
            $stmt->bind_param('ids', $userID, $incomeAmount, $date); // 'i' => integer, 'd' => double (decimal), 's' => string
            
            // Execute the statement
            if ($stmt->execute()) {
                // If successful, send a success response
                echo json_encode([
                    'success' => true,
                    'message' => 'Income updated successfully!'
                ]);
            } else {
                // If there's an error with execution
                echo json_encode([
                    'success' => false,
                    'message' => 'Error executing query: ' . $stmt->error
                ]);
            }

            $stmt->close();
        } else {
            // If the query preparation fails
            echo json_encode([
                'success' => false,
                'message' => 'Error preparing query: ' . $conn->error
            ]);
        }
    } else {
        // If any of the required POST fields are missing
        echo json_encode([
            'success' => false,
            'message' => 'Missing required fields: user_id, income_amount, or date.'
        ]);
    }
}

// Handle GET request to fetch total income for a user
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Ensure user_id is provided in the GET request
    if (isset($_GET['user_id'])) {
        $userID = intval($_GET['user_id']);
        $totalIncome = 0;

        // Check if current month income is requested
        if (isset($_GET['current_month']) && $_GET['current_month'] === 'true') {
            // Get the current year and month
            $currentYear = date('Y');
            $currentMonth = date('m');

            // Prepare an SQL query to calculate total income for the current month
            $query = "SELECT SUM(income_amount) AS totalIncome FROM income WHERE user_id = ? AND YEAR(date) = ? AND MONTH(date) = ?";

            if ($stmt = $conn->prepare($query)) {
                // Bind the parameters
                $stmt->bind_param('iii', $userID, $currentYear, $currentMonth); // 'i' => integer

                // Execute the query
                if ($stmt->execute()) {
                    // Bind the result to a variable
                    $stmt->bind_result($totalIncome);
                    $stmt->fetch();
                }
                $stmt->close();
            }
        } else {
            // Prepare an SQL query to calculate total income for the user
            $query = "SELECT SUM(income_amount) AS totalIncome FROM income WHERE user_id = ?";

            if ($stmt = $conn->prepare($query)) {
                // Bind the user ID parameter
                $stmt->bind_param('i', $userID); // 'i' => integer
                
                // Execute the query
                if ($stmt->execute()) {
                    // Bind the result to a variable
                    $stmt->bind_result($totalIncome);
                    $stmt->fetch();
                }
                $stmt->close();
            }
        }

        // Send the total income as a response
        echo json_encode([
            'success' => true,
            'totalIncome' => $totalIncome !== null ? $totalIncome : 0 // Return 0 if no income records are found
        ]);
    } else {
        // If user_id is not provided
        echo json_encode([
            'success' => false,
            'message' => 'Missing required field: user_id.'
        ]);
    }
}

$conn->close();
?>
