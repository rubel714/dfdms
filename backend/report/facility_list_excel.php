<?php
// ini_set('max_execution_time', 36000);
// error_reporting(E_ALL);
// ini_set('memory_limit', '5500M');
// ini_set('display_errors', 'On');
	// $myfile = fopen("TimeLogXLSX1.txt", "w") or die("Unable to open file!");
	// $currdate = "Start Time:".date("Y_m_d_H_i_s");
	// fwrite($myfile, $currdate);

	/*Database Connection*/
	include_once('../env.php');
	include_once('../source/api/pdolibs/pdo_lib.php');
	$db = new Db();
	// $db = new PDO("mysql:host=localhost;dbname=siglrdc_db2","root","",array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
	date_default_timezone_set('Africa/Kinshasa');
	
	include_once 'spout/vendor/box/spout/src/Spout/Autoloader/autoload.php';
	use Box\Spout\Common\Type;
	use Box\Spout\Reader\ReaderFactory;
	use Box\Spout\Writer\WriterFactory;	
	// use Box\Spout\Writer\Style\StyleBuilder;
	// use Box\Spout\Writer\Style\Color;
	// use Box\Spout\Writer\Style\Border;
	// use Box\Spout\Writer\Style\BorderBuilder;
	
	/*include PhpSpreadsheet library*/

	$siteTitle = reportsitetitleeng;

	$ExportType = 'csv';

	$DivisionId = $_REQUEST['DivisionId']?$_REQUEST['DivisionId']:0;
	$DistrictId = $_REQUEST['DistrictId']?$_REQUEST['DistrictId']:0;
	$UpazilaId =  $_REQUEST['UpazilaId']?$_REQUEST['UpazilaId']:0;
	$UserId =  $_REQUEST['UserId']?$_REQUEST['UserId']:0;

	$DivisionName = isset($_REQUEST['DivisionName']) ? $_REQUEST['DivisionName'] : '';
	$DistrictName = isset($_REQUEST['DistrictName']) ? $_REQUEST['DistrictName'] : '';
	$UpazilaName = isset($_REQUEST['UpazilaName']) ? $_REQUEST['UpazilaName'] : '';
	$filterSubHeader = 'Division: ' . $DivisionName . ', District: ' . $DistrictName . ', Upazila: ' . $UpazilaName;


	
	if($lan == 'en_GB'){
		$sitetitle = $db->settingsinfo["sitetitleeng"];
	}else if($lan == 'fr_FR'){
		$sitetitle = $db->settingsinfo["sitetitlefr"];
	}else if($lan == 'pt_PT'){
		$sitetitle = $db->settingsinfo["sitetitlept"];
	}
	
	$exportTime = date("Y-m-d-H-i-s", time()); 
	// $exportFilePath = "Facility-List-$exportTime.xlsx";
	$exportFilePath = "Facility-List-$exportTime.".strtolower($ExportType);
	if(strtolower($ExportType) == "xlsx"){
		$writer = WriterFactory::create(Type::XLSX);
	}
	else if(strtolower($ExportType) == "csv"){
		$writer = WriterFactory::create(Type::CSV);
	}
	// $writer->setDefaultRowStyle($style)->openToFile($existingFilePath);
	$writer->openToFile("media/$exportFilePath");


    $sql = " SELECT q.`DivisionName`
	FROM `t_householdlivestocksurvey` a Inner Join t_gender b ON a.Gender = b.GenderId INNER JOIN `t_division` q ON a.`DivisionId`=q.`DivisionId` INNER JOIN `t_district` r ON a.`DistrictId`=r.`DistrictId` INNER JOIN `t_upazila` s ON a.`UpazilaId`=s.`UpazilaId` INNER JOIN `t_union` u ON a.`UnionId`=u.`UnionId` INNER JOIN `t_users` us ON a.`UserId`=us.`UserId` LEFT JOIN `t_designation` de ON a.`DesignationId`=de.`DesignationId` WHERE a.`YearId` = 2024 ORDER BY q.`DivisionName`, r.`DistrictName`, s.`UpazilaName`, u.UnionName
	;";	


	$result = $db->query($sql);
	
	// $writer->addRowWithStyle($singleRow, $style);
	$writer->addRow([$siteTitle]);
	$writer->addRow(["Household Livestock Survey 2024"]);

	$writer->addRow([$filterSubHeader]);

	$writer->addRow(['Division Name']);
	
	$sl = 0;
	foreach($result as $aRow){
		$writer->addRow([$aRow['DivisionName']]);

	// $writer->addRowWithStyle($singleRow, $style);
	}

	$writer->close();
	// $currdate = " And End Time:".date("Y_m_d_H_i_s");
	// fwrite($myfile, $currdate);
	// fclose($myfile);
	header("Location:media/$exportFilePath"); //File open location

	
?>