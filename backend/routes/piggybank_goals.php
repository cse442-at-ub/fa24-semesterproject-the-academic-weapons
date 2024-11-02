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

    // Check if the monthly saving goal is negative
    if ($monthlySavingGoal < 0) {
        echo json_encode(['success' => false, 'message' => 'Monthly savings goal cannot be negative.']);
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
    if ($allocation !== null || $monthlySavingGoal !== null) {
        // Check current allocation and monthly saving goal
        $stmt = $conn->prepare("SELECT current_goal_allocation, monthly_saving_goal FROM users WHERE id = ?");
        $stmt->bind_param("i", $userID);
        $stmt->execute();
        $result = $stmt->get_result();
        $goal = $result->fetch_assoc();

        if ($goal) {
            $currentAllocation = $goal['current_goal_allocation'];

            // Handle allocation adjustment
            if ($allocation !== null) {
                $newAllocation = $currentAllocation + $allocation;

                // Ensure allocation does not exceed the monthly saving goal
                if ($monthlySavingGoal !== null && $newAllocation > $monthlySavingGoal) {
                    // Set new allocation to the monthly saving goal
                    $newAllocation = $monthlySavingGoal;
                }

                // Ensure allocation does not go below 0
                if ($newAllocation < 0) {
                    $newAllocation = 0; // Reset to 0 if it would become negative
                }

                // Update current_goal_allocation if it changes
                if ($newAllocation !== $currentAllocation) {
                    $stmt = $conn->prepare("UPDATE users SET current_goal_allocation = ? WHERE id = ?");
                    if (!$stmt) {
                        echo json_encode(['success' => false, 'message' => 'Database prepare error: ' . $conn->error]);
                        exit;
                    }
                    $stmt->bind_param("di", $newAllocation, $userID);
                    
                    if (!$stmt->execute()) {
                        echo json_encode(['success' => false, 'message' => 'Database error: ' . $stmt->error]);
                        exit;
                    }
                    $stmt->close();
                }
            }

            // Check if the new allocation exceeds the updated monthly savings goal
            if ($monthlySavingGoal !== null && $currentAllocation > $monthlySavingGoal) {
                // Cap the allocation to the new monthly saving goal
                $currentAllocation = $monthlySavingGoal;

                // Update current_goal_allocation in the database
                $stmt = $conn->prepare("UPDATE users SET current_goal_allocation = ? WHERE id = ?");
                if (!$stmt) {
                    echo json_encode(['success' => false, 'message' => 'Database prepare error: ' . $conn->error]);
                    exit;
                }
                $stmt->bind_param("di", $currentAllocation, $userID);
                
                if (!$stmt->execute()) {
                    echo json_encode(['success' => false, 'message' => 'Database error: ' . $stmt->error]);
                    exit;
                }
                $stmt->close();
            }
        }
    }

    $conn->close(); // Close the connection

    // Success message
    echo json_encode(['success' => true, "message" => "Goals Piggybank successfully updated"]);
}
?>
