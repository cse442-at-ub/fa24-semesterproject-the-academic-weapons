<?php
include '../config/db.php'; // Ensure this sets up $conn

// Handle CORS
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: POST, GET, PUT, OPTIONS');
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['user_id'])) {
        $user_id = intval($_GET['user_id']);  // Sanitize input by converting to integer

        // Fetch savings goals / allocated_goal_amount for the authenticated user
        $stmt = $conn->prepare("SELECT monthly_saving_goal, current_goal_allocation FROM users WHERE id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($goal = $result->fetch_assoc()) {
            echo json_encode(['success' => true, 'monthly_saving_goal' => $goal['monthly_saving_goal'], 'current_goal_allocation' => $goal['current_goal_allocation']]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Goals not found']);
        }

        $stmt->close();
        $conn->close();
    } else {
        echo json_encode(array("error" => "No user ID parameter provided"));
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // JSON input
    $data = json_decode(file_get_contents('php://input'), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(['success' => false, 'message' => 'Invalid JSON: ' . json_last_error_msg()]);
        exit;
    }

    // Retrieve id and goal data
    $userID = $data['userID'] ?? null;
    $monthlySavingGoal = $data['monthlySavingGoal'] ?? null;
    $allocation = $data['allocation'] ?? null; // This can be positive (add) or negative (subtract)

    if (empty($userID) || (empty($monthlySavingGoal) && empty($allocation))) {
        echo json_encode(['success' => false, 'message' => 'User ID and at least one of the fields (monthlySavingGoal or allocation) are required']);
        exit;
    }

    // Update the saving goal in the users table
    if ($monthlySavingGoal !== null) {
        $stmt = $conn->prepare("UPDATE users SET monthly_saving_goal = ? WHERE id = ?");
        if (!$stmt) {
            echo json_encode(['success' => false, 'message' => 'Database prepare error: ' . $conn->error]);
            exit;
        }
        $stmt->bind_param("di", $monthlySavingGoal, $userID);
        
        if (!$stmt->execute()) {
            echo json_encode(['success' => false, 'message' => 'Database error: ' . $stmt->error]);
            exit;
        }
        $stmt->close();
    }
    
    // Update current_goal_allocation in the users table
    if ($allocation !== null) {
        $stmt = $conn->prepare("UPDATE users SET current_goal_allocation = current_goal_allocation + ? WHERE id = ?");
        if (!$stmt) {
            echo json_encode(['success' => false, 'message' => 'Database prepare error: ' . $conn->error]);
            exit;
        }
        $stmt->bind_param("di", $allocation, $userID);
        
        if (!$stmt->execute()) {
            echo json_encode(['success' => false, 'message' => 'Database error: ' . $stmt->error]);
            exit;
        }
        $stmt->close();
    }

    $conn->close(); // Close the connection

    // Success message
    echo json_encode(['success' => true, "message" => "Goals Piggybank successfully updated"]);
}
