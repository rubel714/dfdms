<?php
header('Content-Type: application/json');

error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_FILES["file"])) {
    $targetDir = "./../../../media/";
	if (!is_dir($targetDir)) {
		mkdir($targetDir, 0755, true);
	}
    $timestamp = time();
    $fileName = $timestamp . "_" . basename($_FILES["file"]["name"]);
    $targetFilePath = $targetDir . $fileName;

    if (move_uploaded_file($_FILES["file"]["tmp_name"], $targetFilePath)) {
		echo json_encode(["success" => 1, "message" => "File uploaded successfully.", "filename" => $fileName]);
	} else {
		echo json_encode(["success" => 0, "message" => "Error uploading file."]);
	}
} else {
    echo json_encode(["success" => 0, "message" => "Invalid request."]);
}
?>
