<?php
	$myfile = fopen("TimeLogXLSX.txt", "w") or die("Unable to open file!");
	$currdate = "Start Time:".date("Y_m_d_H_i_s");
	fwrite($myfile, $currdate);
	
	include_once 'src/Spout/Autoloader/autoload.php';
	
	use Box\Spout\Common\Type;
	use Box\Spout\Reader\ReaderFactory;
	use Box\Spout\Writer\WriterFactory;	
	use Box\Spout\Writer\Style\StyleBuilder;
	use Box\Spout\Writer\Style\Color;
	use Box\Spout\Writer\Style\Border;
	use Box\Spout\Writer\Style\BorderBuilder;

	//drive\htdocs\spout\vendor\box\spout\src\Spout\Writer\Style\BorderBuilder.php
	// $border = (new BorderBuilder())
    // ->setBorderBottom(Color::RED, Border::WIDTH_MEDIUM, Border::STYLE_SOLID)
    // ->build();
	
	$style = (new StyleBuilder())
           // ->setFontBold()
           // ->setFontSize(12)
           // ->setFontColor(Color::BLACK)
           ->setShouldWrapText()
           // ->setBackgroundColor(Color::WHITE)
		   // ->setBorder($border)
           ->build();
// $db = new PDO("mysql:host=localhost;dbname=infomedr_db","infomedr_dbadmin","F*xDkuFR8Kdp",array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
	$db = new PDO("mysql:host=localhost;dbname=siglrdc_db2","root","",array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));

	$newFilePath = 'my_export_file_name.xlsx';
	$writer = WriterFactory::create(Type::XLSX);
	// $writer->setDefaultRowStyle($style)->openToFile($existingFilePath);
	$writer->openToFile($newFilePath);

	$sql = "SELECT `Id`,`Year`,`MonthName`,`ProvinceName`,`BCZName`,`FacilityName`,`FacilityLevel`,`FacilityType`,`ProductGroup`,
	`ProductCode`,`ProductName`,`UnitName`,`OpeningStock`,`ReceiveQty`,`DispenseQty`,`AdjustQty`,`StockoutDays`,`ClosingStock`
	,`AMC`,`MOS`,`ReportedDate`,`Supplier`,`FacilityId` FROM `mv_cfm_stock` limit 0,1500";
	$result = $db->query($sql);
	
	// $writer->addRowWithStyle($singleRow, $style);
	$writer->addRow(['INFO MED RDC']);
	$writer->addRow(['MV Data List']);
	$writer->addRow(['Year: All, Month: All, Facility: All, Product Group: All, Product: All']);
	// $writer->addRowWithStyle(['Start', $currdata, '', '', ''], $style);


	$writer->addRow(['Id', 'Year', 'MonthName', 'ProvinceName', 'BCZName', 'FacilityName',
	'FacilityLevel', 'FacilityType', 'ProductGroup', 'ProductCode', 'ProductName', 
	'UnitName', 'OpeningStock', 'ReceiveQty', 'DispenseQty', 'AdjustQty', 
	'StockoutDays', 'ClosingStock', 'AMC', 'MOS', 'ReportedDate', 'Supplier', 'FacilityId']);
	
	foreach($result as $key=>$val){
		$writer->addRow([$val["Id"], $val["Year"], $val["MonthName"], $val["ProvinceName"], $val["BCZName"], $val["FacilityName"], 
		$val["FacilityLevel"], $val["FacilityType"], $val["ProductGroup"], $val["ProductCode"], $val["ProductName"], 
		$val["UnitName"], (double)$val["OpeningStock"], (double)$val["ReceiveQty"], $val["DispenseQty"], $val["AdjustQty"], 
		$val["StockoutDays"], $val["ClosingStock"], $val["AMC"], $val["MOS"], $val["ReportedDate"], $val["Supplier"], $val["FacilityId"]]);

	// $writer->addRowWithStyle($singleRow, $style);
	}

	$writer->close();
	
	$currdate = " And End Time:".date("Y_m_d_H_i_s");
	fwrite($myfile, $currdate);
	fclose($myfile);
?>