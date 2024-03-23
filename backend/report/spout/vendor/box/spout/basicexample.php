<?php
	// $currdata = date("Y_m_d_H_i_s");
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
		   
	$db = new PDO("mysql:host=localhost;dbname=siglrdc_db2","root","",array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));

	$newFilePath = 'my_report_file_name.xlsx';
	// $newFilePath = 'my_report_file_name.csv';

	// $writer = WriterFactory::create(Type::XLSX);
	$writer = WriterFactory::create(Type::XLSX);
	// $writer->setDefaultRowStyle($style)->openToFile($existingFilePath);
	$writer->openToFile($newFilePath);


	$sql = "SELECT `Id`,`Year`,`MonthName`,`ProvinceName`,`BCZName`,`FacilityName`,`FacilityLevel`,`FacilityType`,`ProductGroup`,
	`ProductCode`,`ProductName`,`UnitName`,`OpeningStock`,`ReceiveQty`,`DispenseQty`,`AdjustQty`,`StockoutDays`,`ClosingStock`
	,`AMC`,`MOS`,`ReportedDate`,`Supplier`,`FacilityId` FROM `mv_cfm_stock`";
	$result = $db->query($sql);
	
	// $writer->addRowWithStyle($singleRow, $style);
	$writer->addRow(['INFO MED RDC']);
	$writer->addRow(['MV Data List']);
	$writer->addRow(['Year: All, Month: All, Facility: All, Product Group: All, Product: All']);
	// $writer->addRow(['Start', $currdata]);
	// $writer->addRowWithStyle(['Start', $currdata, '', '', ''], $style);


	$writer->addRow(['Id', 'Year', 'MonthName', 'ProvinceName', 'BCZName', 'FacilityName',
	'FacilityLevel', 'FacilityType', 'ProductGroup', 'ProductCode', 'ProductName', 
	'UnitName', 'OpeningStock', 'ReceiveQty', 'DispenseQty', 'AdjustQty', 
	'StockoutDays', 'ClosingStock', 'AMC', 'MOS', 'ReportedDate', 'Supplier', 'FacilityId']);
	
	foreach($result as $val){
		$writer->addRow([$val["Id"], $val["Year"], $val["MonthName"], $val["ProvinceName"], $val["BCZName"], $val["FacilityName"], 
						$val["FacilityLevel"], $val["FacilityType"], $val["ProductGroup"], $val["ProductCode"], $val["ProductName"], 
						$val["UnitName"], $val["OpeningStock"], $val["ReceiveQty"], $val["DispenseQty"], $val["AdjustQty"], 
						$val["StockoutDays"], $val["ClosingStock"], $val["AMC"], $val["MOS"], $val["ReportedDate"], $val["Supplier"], $val["FacilityId"]]);

	// $writer->addRowWithStyle($singleRow, $style);
	}

	// $currdata = date("Y_m_d_H_i_s");
	// $writer->addRow(['End', $currdata]);

	$writer->close();
?>