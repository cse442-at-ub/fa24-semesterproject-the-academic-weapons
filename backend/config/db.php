<?php

    $servername = "https://se-dev.cse.buffalo.edu/phpmyadmin/"; // Replace with the correct server hostname if different
    $username = "zcsanger"; // Replace with your MySQL username
    $password = "50404629"; // Replace with your MySQL password
    $dbname = "zcsanger_db"; // Your database name


// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname,);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

?>
