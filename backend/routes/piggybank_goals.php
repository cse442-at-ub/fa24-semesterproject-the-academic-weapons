<?php
include '../config/db.php'; // Ensure this sets up $conn

// Handle CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, DELETE, UPDATE");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['user_id']) && isset($_GET['token'])) {
        $user_id = intval($_GET['user_id']);  // Sanitize input by converting to integer
        $token = $_GET['token'];

        $auth_stmt = $conn->prepare("SELECT * FROM users WHERE id = ? AND auth_token = ?");
        $auth_stmt->bind_param("is", $user_id, $token);
        $auth_stmt->execute();
        $auth_result = $auth_stmt->get_result();

        if ($auth_result->num_rows === 0) {
            echo json_encode(['success' => false, 'message' => 'Failed to authenticate User: ' . $user_id]);
            exit;
        }

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
        echo json_encode(array("error" => "No user ID or Token parameter provided"));
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
    $token = $data['userToken'] ?? null;
    $monthlySavingGoal = $data['monthlySavingGoal'] ?? null;
    $allocation = $data['allocation'] ?? null; // This can be positive (add) or negative (subtract)

    if (empty($userID) || (empty($monthlySavingGoal) && empty($allocation)) || empty($token)) {
        echo json_encode(['success' => false, 'message' => 'User ID, Token, and at least one of the fields (monthlySavingGoal or allocation) are required']);
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

    // update the saving goal
    if ($monthlySavingGoal !== null) {
        $stmt = $conn->prepare("UPDATE goals SET monthly_saving_goal = ? WHERE user_id = ?");
        $stmt->bind_param("di", $monthlySavingGoal, $userID);
        $stmt->execute();
        $stmt->close();
    }

    //  update current_goal_allocation
    if ($allocation !== null) {
        $stmt = $conn->prepare("UPDATE goals SET current_goal_allocation = current_goal_allocation + ? WHERE user_id = ?");
        $stmt->bind_param("di", $allocation, $userID);
        $stmt->execute();
        $stmt->close();
    }

    $conn->close(); // Close the connection

    //  success message
    echo json_encode(['success' => true, "message" => "Goals Piggybank successfully updated"]);
}