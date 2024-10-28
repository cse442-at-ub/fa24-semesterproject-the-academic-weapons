<?php

include '../config/db.php';

// Handle CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, DELETE, UPDATE, PUT, PATCH");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    handleGetRequest($conn);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    handlePostRequest($conn);
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    handleDeleteRequest($conn);
} elseif ($_SERVER['REQUEST_METHOD'] === 'UPDATE') {
    handleUpdateRequest($conn);
} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    handlePutRequest($conn);
} elseif ($_SERVER['REQUEST_METHOD'] === 'PATCH') {
    handlePatchRequest($conn);
}

function handleGetRequest($conn) {
    if (isset($_GET['id']) && isset($_GET['token'])) {
        $id = intval($_GET['id']);
        $token = $_GET['token'];

        if (!authenticateUser($conn, $id, $token)) {
            echo json_encode(['success' => false, 'message' => 'Failed to authenticate User: ' . $id]);
            exit;
        }

        $stmt = $conn->prepare("SELECT * FROM goals WHERE user_id = ?");
        $stmt->bind_param("i", $id);
        $stmt->execute();
        $result = $stmt->get_result();
        $goals = [];

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $goals[] = $row;
            }
        }
        echo json_encode(['success' => true, 'goals' => $goals]);

        $stmt->close();
        $conn->close();
    } else {
        echo json_encode(['error' => 'No ID or Token parameter provided']);
    }
}

function handlePostRequest($conn) {
    $data = json_decode(file_get_contents('php://input'), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(['success' => false, 'message' => 'Invalid JSON: ' . json_last_error_msg()]);
        exit;
    }

    $userID = $data['userID'] ?? null;
    $token = $data['userToken'] ?? null;
    $goal = $data['goal'] ?? null;

    if (empty($userID) || empty($goal) || empty($token)) {
        echo json_encode(['success' => false, 'message' => 'User ID, Token, and Goal data are required']);
        exit;
    }

    if (!authenticateUser($conn, $userID, $token)) {
        echo json_encode(['success' => false, 'message' => 'Failed to authenticate User: ' . $userID]);
        exit;
    }

    $stmt = $conn->prepare("INSERT INTO goals (user_id, name, cost, date, category) VALUES (?, ?, ?, ?, ?)");
    $name = $goal['name'];
    $cost = $goal['cost'];
    $date = $goal['date'];
    $category = $goal['category'];

    $stmt->bind_param("isdss", $userID, $name, $cost, $date, $category);
    $stmt->execute();
    $stmt->close();
    $conn->close();

    echo json_encode(['success' => true, 'message' => 'Goal successfully inserted']);
}

function handleUpdateRequest($conn) {
    $data = json_decode(file_get_contents('php://input'), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(['success' => false, 'message' => 'Invalid JSON: ' . json_last_error_msg()]);
        exit;
    }

    $userID = $data['userID'] ?? null;
    $token = $data['userToken'] ?? null;
    $goalID = $data['goalID'] ?? null;
    $allocation = $data['allocation'] ?? 0;

    if (empty($userID) || empty($goalID) || empty($token) || $allocation < 0) {
        echo json_encode(['success' => false, 'message' => 'User ID, Token, and Goal ID are required']);
        exit;
    }

    if (!authenticateUser($conn, $userID, $token)) {
        echo json_encode(['success' => false, 'message' => 'Failed to authenticate User: ' . $userID]);
        exit;
    }

    $stmt = $conn->prepare("UPDATE goals SET allocated = ? WHERE id = ?");
    $stmt->bind_param("di", $allocation, $goalID);
    $stmt->execute();
    $stmt->close();
    $conn->close();

    echo json_encode(['success' => true, 'message' => 'Goal successfully allocated']);
}

function handlePatchRequest($conn) {
    $data = json_decode(file_get_contents('php://input'), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(['success' => false, 'message' => 'Invalid JSON: ' . json_last_error_msg()]);
        exit;
    }

    $goal = $data['updateItem'] ?? null;
    $userID = $data['userID'] ?? null;
    $token = $data['userToken'] ?? null;
    $goalID = $goal['id'] ?? null;
    $name = $goal['name'] ?? null;
    $cost = $goal['cost'] ?? null;
    $date = $goal['date'] ?? null;
    $category = $goal['category'] ?? null;
    $allocated = $goal['allocated'] ?? 0;

    if (empty($userID) || empty($goalID) || empty($token) || empty($goal)) {
        echo json_encode(['success' => false, 'message' => 'User ID, Token, Goal, and Goal ID are required']);
        exit;
    }

    if (!authenticateUser($conn, $userID, $token)) {
        echo json_encode(['success' => false, 'message' => 'Failed to authenticate User: ' . $userID]);
        exit;
    }

    $stmt = $conn->prepare("UPDATE goals SET name = ?, cost = ?, category = ?, date = ?, allocated = ? WHERE id = ?");
    $stmt->bind_param("sdssdi", $name, $cost, $category, $date, $allocated, $goalID);
    $stmt->execute();
    $stmt->close();
    $conn->close();

    echo json_encode(['success' => true, 'message' => 'Goal successfully updated']);
}

function handlePutRequest($conn) {
    $data = json_decode(file_get_contents('php://input'), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(['success' => false, 'message' => 'Invalid JSON: ' . json_last_error_msg()]);
    }

    $userID = $data['userID'] ?? null;
    $token = $data['userToken'] ?? null;
    $goalID = $data['goalID'] ?? null;
    $completion = $data['completion'] ?? 0;
    $date_completion = $data['date'] ?? null;

    if (empty($userID) || empty($token) || empty($goalID) || ($completion < 0)) {
        echo json_encode(['success' => false, 'message' => 'User ID, Token, and Goal ID are required']);
    }

    if (!authenticateUser($conn, $userID, $token)) {
        echo json_encode(['success' => false, 'message' => 'Failed to authenticate User: ' . $userID]);
    }

    $stmt = $conn->prepare("UPDATE goals SET complete = ?, completed_date = ? WHERE id = ?");
    $stmt->bind_param("isi", $completion, $date_completion, $goalID);
    $stmt->execute();
    $stmt->close();
    $conn->close();
    echo json_encode(['success' => true, 'message' => 'Goal successfully updated']);
}

function handleDeleteRequest($conn) {
    $data = json_decode(file_get_contents('php://input'), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(['success' => false, 'message' => 'Invalid JSON: ' . json_last_error_msg()]);
        exit;
    }

    $userID = $data['userID'] ?? null;
    $token = $data['userToken'] ?? null;
    $goalID = $data['goalID'] ?? null;

    if (empty($userID) || empty($goalID) || empty($token)) {
        echo json_encode(['success' => false, 'message' => 'User ID, Token, and Goal ID are required']);
        exit;
    }

    if (!authenticateUser($conn, $userID, $token)) {
        echo json_encode(['success' => false, 'message' => 'Failed to authenticate User: ' . $userID]);
        exit;
    }

    $stmt = $conn->prepare("DELETE FROM goals WHERE id = ?");
    $stmt->bind_param("i", $goalID);
    $stmt->execute();
    $stmt->close();
    $conn->close();

    echo json_encode(['success' => true, 'message' => 'Goal successfully deleted']);
}

function authenticateUser($conn, $userID, $token) {
    $auth_stmt = $conn->prepare("SELECT * FROM users WHERE id = ? AND auth_token = ?");
    $auth_stmt->bind_param("is", $userID, $token);
    $auth_stmt->execute();
    $auth_result = $auth_stmt->get_result();
    $auth_stmt->close();

    return $auth_result->num_rows > 0;
}
?>