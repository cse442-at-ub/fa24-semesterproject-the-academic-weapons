<?php
include './db.php';

if ($conn) {
    echo "Connected successfully!";
} else {
    echo "Connection failed!";
}

// Close the connection
$conn->close();
?>
