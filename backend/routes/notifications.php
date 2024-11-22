<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

include '../config/db.php';

// Get current date and calculate the week range
$currentDate = date("Y-m-d");
$nextWeekDate = date("Y-m-d", strtotime("+7 days"));
$nextDayDate = date("Y-m-d", strtotime("+1 day"));

// Query to get recurring transactions due in the next 7 days or 1 day
$sql = "
    SELECT id, name, price, category, date, recurring, next_recurrence_date
    FROM transactions
    WHERE recurring = 1
    AND next_recurrence_date IS NOT NULL
    AND (
        (next_recurrence_date >= '$currentDate' AND next_recurrence_date <= '$nextWeekDate') OR
        (next_recurrence_date = '$nextDayDate')
    )
";

// Debug: Print the query and dates being used
error_log("Current Date: $currentDate");
error_log("Next Week Date: $nextWeekDate");
error_log("Next Day Date: $nextDayDate");
error_log("SQL Query: $sql");

$result = $conn->query($sql);

if ($result === false) {
    // Log the SQL error if query fails
    error_log("SQL Error: " . $conn->error);
    http_response_code(500);
    echo json_encode(["error" => "Database query failed"]);
    die();
}

$notifications = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $notification = [
            "id" => $row["id"],
            "message" => "Upcoming Transaction: {$row['name']} - \${$row['price']}",
            "dueDate" => $row["next_recurrence_date"]
        ];
        $notifications[] = $notification;
    }
} else {
    // Log if no notifications found
    error_log("No recurring transactions found for the specified range.");
}

$conn->close();

echo json_encode($notifications);
