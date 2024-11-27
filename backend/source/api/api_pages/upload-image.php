<?php
header('Content-Type: application/json');

error_reporting(E_ALL);
ini_set('display_errors', 1);

function resizeImageByAspect($source, $destination, $max_dimension) {
    list($width, $height, $type) = getimagesize($source);

    // Skip resizing if both dimensions are less than or equal to the max dimension
    if ($width <= $max_dimension && $height <= $max_dimension) {
        return true; // No resizing needed
    }

    $rotate = 0;
    if ($type == IMAGETYPE_JPEG) {
        $exif = @exif_read_data($source);
        if ($exif && isset($exif['Orientation'])) {
            switch ($exif['Orientation']) {
                case 3: $rotate = 180; break;
                case 6: $rotate = -90; break;
                case 8: $rotate = 90; break;
            }
        }
    }

    if ($rotate == 90 || $rotate == -90) {
        list($width, $height) = [$height, $width];
    }

    if ($width >= $height) {
        $new_width = $max_dimension;
        $new_height = (int)($new_width * ($height / $width));
    } else {
        $new_height = $max_dimension;
        $new_width = (int)($new_height * ($width / $height));
    }

    switch ($type) {
        case IMAGETYPE_JPEG: $image = imagecreatefromjpeg($source); break;
        case IMAGETYPE_PNG: $image = imagecreatefrompng($source); break;
        case IMAGETYPE_GIF: $image = imagecreatefromgif($source); break;
        default:
            return 'unsupported'; // Unsupported file type
    }

    if ($rotate !== 0) {
        $image = imagerotate($image, $rotate, 0);
    }

    $resized_image = imagecreatetruecolor($new_width, $new_height);

    if ($type == IMAGETYPE_PNG || $type == IMAGETYPE_GIF) {
        imagecolortransparent($resized_image, imagecolorallocatealpha($resized_image, 0, 0, 0, 127));
        imagealphablending($resized_image, false);
        imagesavealpha($resized_image, true);
    }

    imagecopyresampled(
        $resized_image, $image,
        0, 0, 0, 0,
        $new_width, $new_height,
        $width, $height
    );

    switch ($type) {
        case IMAGETYPE_JPEG: imagejpeg($resized_image, $destination, 90); break;
        case IMAGETYPE_PNG: imagepng($resized_image, $destination); break;
        case IMAGETYPE_GIF: imagegif($resized_image, $destination); break;
    }

    imagedestroy($image);
    imagedestroy($resized_image);

    return true;
}

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_FILES["file"])) {
    if ($_POST["formName"] === "userProfile") {
        $targetDir = "./../../../src/assets/img/user/";
    } else {
        $targetDir = "./../../../src/assets/farmerimage/";
    }

    $timestamp = $_POST["timestamp"];

    if (!is_dir($targetDir)) {
        mkdir($targetDir, 0755, true);
    }

    $fileName = $timestamp . "_" . basename($_FILES["file"]["name"]);
    $targetFilePath = $targetDir . $fileName;

    // Move uploaded file
    if (move_uploaded_file($_FILES["file"]["tmp_name"], $targetFilePath)) {
        $resize_result = resizeImageByAspect($targetFilePath, $targetFilePath, 1080);

        if ($resize_result === true) {
            echo json_encode(["success" => 1, "message" => "File uploaded and resized successfully.", "filename" => $fileName]);
        } elseif ($resize_result === 'unsupported') {
            echo json_encode(["success" => 1, "message" => "Unsupported file type. File uploaded without resizing.", "filename" => $fileName]);
        } else {
            echo json_encode(["success" => 0, "message" => "Error during resizing.", "filename" => $fileName]);
        }
    } else {
        echo json_encode(["success" => 0, "message" => "Error uploading file."]);
    }
} else {
    echo json_encode(["success" => 0, "message" => "Invalid request."]);
}
?>
