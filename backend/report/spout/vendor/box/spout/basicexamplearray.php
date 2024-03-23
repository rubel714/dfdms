<?php
	set_time_limit(0);
	ini_set('memory_limit', '2500M');
	include_once 'src/Spout/Autoloader/autoload.php';

	use Box\Spout\Common\Type;
	use Box\Spout\Writer\WriterFactory;
	
	$db = new PDO("mysql:host=localhost;dbname=siglrdc_db2","root","");
	
	// $sql = "SELECT `BackboneId`,`BackboneName` FROM `t_backbone`";
	$sql = "SELECT `Id`,`Year`,`MonthName`,`FacilityName`,`ProductCode` FROM `mv_cfm_stock`";
	$result = $db->query($sql);

	$rows=array();
	// $rows[] = array('BackboneId', 'BackboneName');
	$rows[] = array('Id', 'Year', 'MonthName', 'FacilityName', 'ProductCode');
	
	foreach($result as $key=>$val){
		// $BackboneId = $val["BackboneId"];
		// $BackboneName = $val["BackboneName"];
		// $rows[] = array($BackboneId, $BackboneName);

		$rows[] = array($val["Id"], $val["Year"], $val["MonthName"], $val["FacilityName"], $val["ProductCode"]);
	}

    $writer = WriterFactory::create(Type::XLSX);
    $fileName = 'backbonelist' . time() . '.xlsx';
    $writer->openToBrowser($fileName);
    $writer->addRows($rows);
    $writer->close();
?>