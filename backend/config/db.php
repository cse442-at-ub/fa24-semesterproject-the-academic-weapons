<?php

$servername = "127.0.0.1";
// $username = "mjlyskaw";
// $password = "50393887";
// $dbname = "cse442_2024_fall_team_an_db"; Uncomment before push to dev
// $username = "journeys";
// $password = "50400674";
// $dbname = "journeys_db";
$username = "root";
$password = "";
$dbname = "cse442_2024_fall_team_an_db";

// Create connection
$conn = mysqli_connect($servername, $username, $password, $dbname,);

// Check connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

?>
