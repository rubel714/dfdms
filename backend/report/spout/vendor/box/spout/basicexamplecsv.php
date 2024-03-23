<?php

	$myfile = fopen("TimeLogCSV.txt", "w") or die("Unable to open file!");
	$currdate = "Start Time:".date("Y_m_d_H_i_s");
	fwrite($myfile, $currdate);

	include_once 'src/Spout/Autoloader/autoload.php';
	
	use Box\Spout\Common\Type;
	use Box\Spout\Writer\WriterFactory;

	// $db = new PDO("mysql:host=localhost;dbname=infomedr_db","infomedr_dbadmin","F*xDkuFR8Kdp",array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
	$db = new PDO("mysql:host=localhost;dbname=siglrdc_db2","root","",array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));

	$newFilePath = 'my_export_file_name.csv';

	$writer = WriterFactory::create(Type::CSV);
	$writer->openToFile($newFilePath);

	$sql = "SELECT `Id`,`Year`,`MonthName`,`ProvinceName`,`BCZName`,`FacilityName`,`FacilityLevel`,`FacilityType`,`ProductGroup`,
	`ProductCode`,`ProductName`,`UnitName`,`OpeningStock`,`ReceiveQty`,`DispenseQty`,`AdjustQty`,`StockoutDays`,`ClosingStock`
	,`AMC`,`MOS`,`ReportedDate`,`Supplier`,`FacilityId` FROM `mv_cfm_stock` limit 0,15000";
	$result = $db->query($sql);
	
	$writer->addRow(['INFO MED RDC']);
	$writer->addRow(['MV Data List']);
	$writer->addRow(['Year: All, Month: All, Facility: All, Product Group: All, Product: All']);

	$writer->addRow(['Id', 'Year', 'MonthName', 'ProvinceName', 'BCZName', 'FacilityName',
	'FacilityLevel', 'FacilityType', 'ProductGroup', 'ProductCode', 'ProductName', 
	'UnitName', 'OpeningStock', 'ReceiveQty', 'DispenseQty', 'AdjustQty', 
	'StockoutDays', 'ClosingStock', 'AMC', 'MOS', 'ReportedDate', 'Supplier', 'FacilityId']);
	
	foreach($result as $val){
		$writer->addRow([$val["Id"], $val["Year"], $val["MonthName"], $val["ProvinceName"], $val["BCZName"], $val["FacilityName"], 
						$val["FacilityLevel"], $val["FacilityType"], $val["ProductGroup"], $val["ProductCode"], $val["ProductName"], 
						$val["UnitName"], $val["OpeningStock"], $val["ReceiveQty"], $val["DispenseQty"], $val["AdjustQty"], 
						$val["StockoutDays"], $val["ClosingStock"], $val["AMC"], $val["MOS"], $val["ReportedDate"], $val["Supplier"], $val["FacilityId"]]);
	}

	$writer->close();
	
	$currdate = " And End Time:".date("Y_m_d_H_i_s");
	fwrite($myfile, $currdate);
	fclose($myfile);
?>