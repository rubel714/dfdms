<?php

	/* Database Connection */
	include_once ('../env.php');
	include_once ('../source/api/pdolibs/pdo_lib.php');
	include_once ('../source/api/pdolibs/function_global.php');

	/* include PhpSpreadsheet library */
	require("PhpSpreadsheet/vendor/autoload.php");


	$lan = isset($_REQUEST['lan']) ? $_REQUEST['lan'] : "en_GB";
	$menukey = isset($_REQUEST['menukey']) ? $_REQUEST['menukey'] : "";
	include_once ('../source/api/languages/lang_switcher_custom.php');

	$db = new Db();


	$DivisionId = isset($_REQUEST['DivisionId']) ? $_REQUEST['DivisionId'] : 0;
	$DistrictId = isset($_REQUEST['DistrictId']) ? $_REQUEST['DistrictId'] : 0;
	$UpazilaId = isset($_REQUEST['UpazilaId']) ? $_REQUEST['UpazilaId'] : 0;


	$DivisionName = isset($_REQUEST['DivisionName']) ? $_REQUEST['DivisionName'] : '';
	$DistrictName = isset($_REQUEST['DistrictName']) ? $_REQUEST['DistrictName'] : '';
	$UpazilaName = isset($_REQUEST['UpazilaName']) ? $_REQUEST['UpazilaName'] : '';
	

	$filterSubHeader = 'Division: '.$DivisionName.', District: '.$DistrictName.', Upazila: '.$UpazilaName;
	
	$dataList = array(
		'category'=>array(),
		'series'=>array()
	);
		
	
	$index=0;
	$i=0;

	
	$query = "SELECT g.`DivisionName`
	,SUM(CASE WHEN f.`ValuechainId`='DAIRY' THEN 1 ELSE 0 END) Dairy
	,SUM(CASE WHEN f.`ValuechainId`='BUFFALO' THEN 1 ELSE 0 END) Buffalo
	,SUM(CASE WHEN f.`ValuechainId`='BEEFFATTENING' THEN 1 ELSE 0 END) BeefFattening
	,SUM(CASE WHEN f.`ValuechainId`='GOAT' THEN 1 ELSE 0 END) Goat
	,SUM(CASE WHEN f.`ValuechainId`='SHEEP' THEN 1 ELSE 0 END) Sheep
	,SUM(CASE WHEN f.`ValuechainId`='SCAVENGINGCHICKENLOCAL' THEN 1 ELSE 0 END) ScavengingChickens
	,SUM(CASE WHEN f.`ValuechainId`='DUCK' THEN 1 ELSE 0 END) Duck
	,SUM(CASE WHEN f.`ValuechainId`='QUAIL' THEN 1 ELSE 0 END) Quail
	,SUM(CASE WHEN f.`ValuechainId`='PIGEON' THEN 1 ELSE 0 END) Pigeon
	,COUNT(f.`PGId`) AS GrandTotal
	FROM `t_pg` f
	INNER JOIN `t_division` g ON f.`DivisionId` = g.`DivisionId`
	where f.IsActive=1

	GROUP BY g.DivisionName

	;";

	$resultdata = $db->query($query);
	
	
	if ($lan == 'en_GB') {
		$siteTitle = reportsitetitleeng;
	} else if ($lan == 'fr_FR') {
		$siteTitle = reportsitetitlefr;
	} 

	$reporttitlelist = explode('<br/>',$siteTitle);
		if(count($reporttitlelist) > 1){
			$reportHeaderList[0] = $reporttitlelist[count($reporttitlelist)-1];
			for($h=(count($reporttitlelist)-2); $h>=0; $h-- ){
				array_unshift($reportHeaderList, $reporttitlelist[$h]);
			}
		}



	use PhpOffice\PhpSpreadsheet\Spreadsheet;
	use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
	use PhpOffice\PhpSpreadsheet\Writer\Xls;	
	use PhpOffice\PhpSpreadsheet\Style\Alignment;
	use PhpOffice\PhpSpreadsheet\Style\Fill;
	use PhpOffice\PhpSpreadsheet\Style\Color;
	use PhpOffice\PhpSpreadsheet\Style\Border;
	use PhpOffice\PhpSpreadsheet\Style\NumberFormat;
	use PhpOffice\PhpSpreadsheet\Style\Protection;
	use PhpOffice\PhpSpreadsheet\Worksheet\PageSetup;
	use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
	use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;
	use PhpOffice\PhpSpreadsheet\Worksheet\Row;
	use PhpOffice\PhpSpreadsheet\Calculation\Calculation;
	use PhpOffice\PhpSpreadsheet\Cell\Cell;
	use PhpOffice\PhpSpreadsheet\Cell\DataValidation;	
	use PhpOffice\PhpSpreadsheet\IOFactory;	
	
	$spreadsheet = new Spreadsheet();
	
	/*Page Setup
	Page Orientation(ORIENTATION_LANDSCAPE/ORIENTATION_PORTRAIT), 
	Paper Size(PAPERSIZE_A3,PAPERSIZE_A4,PAPERSIZE_A5,PAPERSIZE_LETTER,PAPERSIZE_LEGAL etc)*/
	$spreadsheet->getActiveSheet()->getPageSetup()->setOrientation(PageSetup::ORIENTATION_PORTRAIT);
	$spreadsheet->getActiveSheet()->getPageSetup()->setPaperSize(PageSetup::PAPERSIZE_A4);
	
	/*Set Page Margins for a Worksheet*/
	$spreadsheet->getActiveSheet()->getPageMargins()->setTop(0.75);
	$spreadsheet->getActiveSheet()->getPageMargins()->setRight(0.70);
	$spreadsheet->getActiveSheet()->getPageMargins()->setLeft(0.70);
	$spreadsheet->getActiveSheet()->getPageMargins()->setBottom(0.75);	
	
	/*Center a page horizontally/vertically*/
	$spreadsheet->getActiveSheet()->getPageSetup()->setHorizontalCentered(false);
	$spreadsheet->getActiveSheet()->getPageSetup()->setVerticalCentered(true);

	/*Show/hide gridlines(true/false)*/
	$spreadsheet->getActiveSheet()->setShowGridlines(true);
	
	$spreadsheet->getActiveSheet()->getPageSetup()->setFitToWidth(1);
	$spreadsheet->getActiveSheet()->getPageSetup()->setFitToHeight(0);	
	
	//Activate work sheet
    $spreadsheet->createSheet(0);
    $spreadsheet->setActiveSheetIndex(0);
	$spreadsheet->getActiveSheet(0);
	
	//work sheet name
    $spreadsheet->getActiveSheet()->setTitle('data');
	
	/*Default Font Set*/
	$spreadsheet->getDefaultStyle()->getFont()->setName('Calibri');
	
	/*Default Font Size Set*/
	$spreadsheet->getDefaultStyle()->getFont()->setSize(11);
	
	
	/* Border color */
	$styleThinBlackBorderOutline = array('borders' => array('outline' => array('borderStyle' => Border::BORDER_THIN, 'color' => array('argb' => '5a5a5a'))));
	$rn=2;


	/*Draw image*/
	/* $drawing = new Drawing(); 
	$drawing->setPath('images/logo.png');
	$drawing->setCoordinates('A' . $rn);
	$drawing->setWidth(75);
	$drawing->setHeight(75);
	$drawing->setOffsetX(40);                    
	$drawing->setOffsetY(6);
	$drawing->setWorksheet($spreadsheet->getActiveSheet());
	$spreadsheet->getActiveSheet()->mergeCells('A2:B5');
	//$rn=2;
	
	$drawing = new Drawing(); 
	$drawing->setPath('images/benin_logo.png');
	$drawing->setCoordinates('L' . $rn);
	$drawing->setWidth(85);
	$drawing->setHeight(85);
	$drawing->setOffsetX(200);    // set x position 
	$drawing->setOffsetY(4);
	$drawing->setWorksheet($spreadsheet->getActiveSheet());
	$spreadsheet->getActiveSheet()->mergeCells('L2:M5'); */
	//$rn++;
	for($p = 0; $p < count($reporttitlelist); $p++){
		
		$spreadsheet->getActiveSheet()->SetCellValue('C'.$rn, $reporttitlelist[$p]);
		$spreadsheet->getActiveSheet()->getStyle('C'.$rn)->getFont();
		/* Font Size for Cells */
		$spreadsheet->getActiveSheet()->getStyle('C'.$rn)->applyFromArray(array('font' => array('size' => '13', 'bold' => true)), 'C'.$rn);
		/* Text Alignment Horizontal(HORIZONTAL_LEFT,HORIZONTAL_CENTER,HORIZONTAL_RIGHT) */
		$spreadsheet->getActiveSheet()->getStyle('C'.$rn)->getAlignment()->setHorizontal(Alignment::VERTICAL_CENTER);
		/* Text Alignment Vertical(VERTICAL_TOP,VERTICAL_CENTER,VERTICAL_BOTTOM) */
		$spreadsheet->getActiveSheet()->getStyle('C'.$rn)->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
		/* merge Cell */
		$spreadsheet->getActiveSheet()->mergeCells('C'.$rn.':G'.$rn);
		$rn++;
	

	 }
	 $spreadsheet->getActiveSheet()->SetCellValue('C'.$rn, "PG Distribution");
	$spreadsheet->getActiveSheet()->getStyle('C'.$rn)->getFont();
	$spreadsheet -> getActiveSheet()->getStyle('C'.$rn) -> applyFromArray(array('font' => array('size' => '14', 'bold' => true)), 'C'.$rn);
	$spreadsheet -> getActiveSheet()->getStyle('C'.$rn) -> getAlignment()->setHorizontal(Alignment::VERTICAL_CENTER);
	$spreadsheet -> getActiveSheet() -> getStyle('C'.$rn)->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
	$spreadsheet->getActiveSheet()->mergeCells('C'.$rn.':G'.$rn);
		$rn++;
	//head - 2
 	

	//head - 3
 	$spreadsheet->getActiveSheet()->SetCellValue('C'.$rn, $filterSubHeader);
	$spreadsheet->getActiveSheet()->getStyle('C'.$rn)->getFont();
	$spreadsheet -> getActiveSheet()->getStyle('C'.$rn) -> applyFromArray(array('font' => array('size' => '14', 'bold' => true)), 'C'.$rn);
	$spreadsheet -> getActiveSheet()->getStyle('C'.$rn) -> getAlignment()->setHorizontal(Alignment::VERTICAL_CENTER);
	$spreadsheet -> getActiveSheet() -> getStyle('C'.$rn)->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
	$spreadsheet->getActiveSheet()->mergeCells('C'.$rn.':G'.$rn);
		$rn++;



	/*Value Set for Cells*/
    $spreadsheet -> getActiveSheet()											
			->SetCellValue('A5', 'Division')
			->SetCellValue('B5', 'Dairy')
			->SetCellValue('C5', 'Buffalo')
			->SetCellValue('D5', 'Beef Fattening')
			->SetCellValue('E5', 'Goat')
			->SetCellValue('F5', 'Sheep')
			->SetCellValue('G5', 'Scavenging Chickens')
			->SetCellValue('H5', 'Duck')
			->SetCellValue('I5', 'Quail')
			->SetCellValue('J5', 'Pigeon')
			->SetCellValue('K5', 'Grand Total')
			->SetCellValue('L5', '% of Gender')
			
			;
					
	/*Font Size for Cells*/
	//$spreadsheet -> getActiveSheet()->getStyle('A6') -> applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'A6');	
	$spreadsheet -> getActiveSheet()->getStyle('A5') -> applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'A5');
	$spreadsheet -> getActiveSheet()->getStyle('B5') -> applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'B5');
	$spreadsheet -> getActiveSheet()->getStyle('C5') -> applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'C5');
	$spreadsheet -> getActiveSheet()->getStyle('D5') -> applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'D5');
	$spreadsheet -> getActiveSheet()->getStyle('E5') -> applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'E5');
	$spreadsheet -> getActiveSheet()->getStyle('F5') -> applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'F5');
	$spreadsheet -> getActiveSheet()->getStyle('G5') -> applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'G5');
	$spreadsheet -> getActiveSheet()->getStyle('H5') -> applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'H5');
	$spreadsheet -> getActiveSheet()->getStyle('I5') -> applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'I5');
	$spreadsheet -> getActiveSheet()->getStyle('J5') -> applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'J5');
	$spreadsheet -> getActiveSheet()->getStyle('K5') -> applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'K5');
	$spreadsheet -> getActiveSheet()->getStyle('L5') -> applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'L5');

	/*Text Alignment Horizontal(HORIZONTAL_LEFT,HORIZONTAL_CENTER,HORIZONTAL_RIGHT)*/
	//$spreadsheet -> getActiveSheet()->getStyle('A6') -> getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
	$spreadsheet -> getActiveSheet()->getStyle('A5') -> getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
	$spreadsheet -> getActiveSheet()->getStyle('B5') -> getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
	$spreadsheet -> getActiveSheet()->getStyle('C5') -> getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
	$spreadsheet -> getActiveSheet()->getStyle('D5') -> getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
	$spreadsheet -> getActiveSheet()->getStyle('E5') -> getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
	$spreadsheet -> getActiveSheet()->getStyle('F5') -> getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
	$spreadsheet -> getActiveSheet()->getStyle('G5') -> getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
	$spreadsheet -> getActiveSheet()->getStyle('H5') -> getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
	$spreadsheet -> getActiveSheet()->getStyle('I5') -> getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
	$spreadsheet -> getActiveSheet()->getStyle('J5') -> getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
	$spreadsheet -> getActiveSheet()->getStyle('K5') -> getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
	$spreadsheet -> getActiveSheet()->getStyle('L5') -> getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);

	/*Text Alignment Vertical(VERTICAL_TOP,VERTICAL_CENTER,VERTICAL_BOTTOM)*/
	//$spreadsheet -> getActiveSheet() -> getStyle('A6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
	$spreadsheet -> getActiveSheet() -> getStyle('A5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
	$spreadsheet -> getActiveSheet() -> getStyle('B5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
	$spreadsheet -> getActiveSheet() -> getStyle('C5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
	$spreadsheet -> getActiveSheet() -> getStyle('D5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
	$spreadsheet -> getActiveSheet() -> getStyle('E5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
	$spreadsheet -> getActiveSheet() -> getStyle('F5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
	$spreadsheet -> getActiveSheet() -> getStyle('G5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
	$spreadsheet -> getActiveSheet() -> getStyle('H5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
	$spreadsheet -> getActiveSheet() -> getStyle('I5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
	$spreadsheet -> getActiveSheet() -> getStyle('J5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
	$spreadsheet -> getActiveSheet() -> getStyle('K5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
	$spreadsheet -> getActiveSheet() -> getStyle('L5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);

	/*Width for Cells*/
	//$spreadsheet -> getActiveSheet() -> getColumnDimension('A') -> setWidth(15);
	$spreadsheet -> getActiveSheet() -> getColumnDimension('A') -> setWidth(30);
	$spreadsheet -> getActiveSheet() -> getColumnDimension('B') -> setWidth(15);
	$spreadsheet -> getActiveSheet() -> getColumnDimension('C') -> setWidth(15);
	$spreadsheet -> getActiveSheet() -> getColumnDimension('D') -> setWidth(15);
	$spreadsheet -> getActiveSheet() -> getColumnDimension('K') -> setWidth(17);
	$spreadsheet -> getActiveSheet() -> getColumnDimension('L') -> setWidth(17);

	/*Wrap text*/
	$spreadsheet->getActiveSheet()->getStyle('A5')->getAlignment()->setWrapText(true);
	
	/*border color set for cells*/
	//$spreadsheet -> getActiveSheet() -> getStyle('A6:A6') -> applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet -> getActiveSheet() -> getStyle('A5:A5') -> applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet -> getActiveSheet() -> getStyle('B5:B5') -> applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet -> getActiveSheet() -> getStyle('C5:C5') -> applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet -> getActiveSheet() -> getStyle('D5:D5') -> applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet -> getActiveSheet() -> getStyle('E5:E5') -> applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet -> getActiveSheet() -> getStyle('F5:F5') -> applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet -> getActiveSheet() -> getStyle('G5:G5') -> applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet -> getActiveSheet() -> getStyle('H5:H5') -> applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet -> getActiveSheet() -> getStyle('I5:I5') -> applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet -> getActiveSheet() -> getStyle('J5:J5') -> applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet -> getActiveSheet() -> getStyle('K5:K5') -> applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet -> getActiveSheet() -> getStyle('L5:L5') -> applyFromArray($styleThinBlackBorderOutline);

	$charList = array('1' => 'A', '2' => 'B', '3' => 'C', '4' => 'D', '5' =>'E', '6' => 'F', '7' => 'G', '8' => 'H', '9' => 'I', '10' => 'J', '11' => 'K', '12' => 'L', '13' => 'M', '14' => 'N', '15' => 'O');

	$index = 1;
	$rowNo = 10;

	
	$i=1; 
	$j=6;

	$TotalDairy = 0;
	$TotalBuffalo = 0;
	$TotalBeefFattening = 0;
	$TotalGoat = 0;
	$TotalSheep = 0;
	$TotalScavengingChickens = 0;
	$TotalDuck = 0;
	$TotalQuail = 0;
	$TotalPigeon = 0;
	$TotalGrandTotal = 0;
	$TotalPercentage = 0;

	$dataList = array();


		foreach ($resultdata as $key => $row) {
			$dataList[] = $row;

			/**Calculate column total */
			$TotalDairy += $row["Dairy"];
			$TotalBuffalo += $row["Buffalo"];
			$TotalBeefFattening += $row["BeefFattening"];
			$TotalGoat += $row["Goat"];
			$TotalSheep += $row["Sheep"];
			$TotalScavengingChickens += $row["ScavengingChickens"];
			$TotalDuck += $row["Duck"];
			$TotalQuail += $row["Quail"];
			$TotalPigeon += $row["Pigeon"];
			$TotalGrandTotal += $row["GrandTotal"];
		}


		/**For Total row */
		if (count($dataList) > 0) {
			$row = array();
			$row["DivisionName"] = "Grand Total";
			$row["Dairy"] = $TotalDairy;
			$row["Buffalo"] = $TotalBuffalo;
			$row["BeefFattening"] = $TotalBeefFattening;
			$row["Goat"] = $TotalGoat;
			$row["Sheep"] = $TotalSheep;
			$row["ScavengingChickens"] = $TotalScavengingChickens;
			$row["Duck"] = $TotalDuck;
			$row["Quail"] = $TotalQuail;
			$row["Pigeon"] = $TotalPigeon;
			$row["GrandTotal"] = $TotalGrandTotal;
			$row["Percentage"] = 0;
			$dataList[] = $row;
		}




		/**Calculate Percentage */
		foreach ($dataList as $key => $row) {
			$row["Percentage"] = ($row["GrandTotal"]*100)/$TotalGrandTotal;

			$spreadsheet->getActiveSheet()							
				->SetCellValue('A'.$j, $row['DivisionName'])	
				->SetCellValue('B'.$j, $row['Dairy'])																
				->SetCellValue('C'.$j, $row['Buffalo'])																
				->SetCellValue('D'.$j, $row['BeefFattening'])																
				 ->SetCellValue('E'.$j, $row['Goat'])
				->SetCellValue('F'.$j, $row['Sheep'])
				->SetCellValue('G'.$j, $row['ScavengingChickens'])
				->SetCellValue('H'.$j, $row['Duck'])
				->SetCellValue('I'.$j, $row['Quail'])
				->SetCellValue('J'.$j, $row['Pigeon'])
				->SetCellValue('K'.$j, $row['GrandTotal'])
				->SetCellValue('L'.$j, $row["Percentage"])
				
			;

			$spreadsheet -> getActiveSheet() -> getStyle('A' . $j . ':A' . $j) -> applyFromArray($styleThinBlackBorderOutline);
		$spreadsheet -> getActiveSheet() -> getStyle('B' . $j . ':B' . $j) -> applyFromArray($styleThinBlackBorderOutline);
		$spreadsheet -> getActiveSheet() -> getStyle('C' . $j . ':C' . $j) -> applyFromArray($styleThinBlackBorderOutline);
		$spreadsheet -> getActiveSheet() -> getStyle('D' . $j . ':D' . $j) -> applyFromArray($styleThinBlackBorderOutline);
		$spreadsheet -> getActiveSheet() -> getStyle('E' . $j . ':E' . $j) -> applyFromArray($styleThinBlackBorderOutline);
		$spreadsheet -> getActiveSheet() -> getStyle('F' . $j . ':F' . $j) -> applyFromArray($styleThinBlackBorderOutline);
		$spreadsheet -> getActiveSheet() -> getStyle('G' . $j . ':G' . $j) -> applyFromArray($styleThinBlackBorderOutline);
		$spreadsheet -> getActiveSheet() -> getStyle('H' . $j . ':H' . $j) -> applyFromArray($styleThinBlackBorderOutline);
		$spreadsheet -> getActiveSheet() -> getStyle('I' . $j . ':I' . $j) -> applyFromArray($styleThinBlackBorderOutline);
		$spreadsheet -> getActiveSheet() -> getStyle('J' . $j . ':J' . $j) -> applyFromArray($styleThinBlackBorderOutline);
		$spreadsheet -> getActiveSheet() -> getStyle('K' . $j . ':K' . $j) -> applyFromArray($styleThinBlackBorderOutline);
		$spreadsheet -> getActiveSheet() -> getStyle('L' . $j . ':L' . $j) -> applyFromArray($styleThinBlackBorderOutline);
	
		
		$spreadsheet -> getActiveSheet()->getStyle('A' . $j . ':A' . $j) -> getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
		$spreadsheet -> getActiveSheet()->getStyle('B' . $j . ':B' . $j) -> getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
		$spreadsheet -> getActiveSheet()->getStyle('C' . $j . ':C' . $j) -> getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
		$spreadsheet -> getActiveSheet()->getStyle('D' . $j . ':D' . $j) -> getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
		$spreadsheet -> getActiveSheet()->getStyle('E' . $j . ':E' . $j) -> getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
		$spreadsheet -> getActiveSheet()->getStyle('F' . $j . ':F' . $j) -> getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
		$spreadsheet -> getActiveSheet()->getStyle('G' . $j . ':G' . $j) -> getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
		$spreadsheet -> getActiveSheet()->getStyle('H' . $j . ':H' . $j) -> getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
		$spreadsheet -> getActiveSheet()->getStyle('I' . $j . ':I' . $j) -> getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
		$spreadsheet -> getActiveSheet()->getStyle('J' . $j . ':J' . $j) -> getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
		$spreadsheet -> getActiveSheet()->getStyle('K' . $j . ':K' . $j) -> getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
		$spreadsheet -> getActiveSheet()->getStyle('L' . $j . ':L' . $j) -> getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
		
		
		$spreadsheet -> getActiveSheet() -> getStyle('A' . $j . ':A' . $j)->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
		$spreadsheet -> getActiveSheet() -> getStyle('B' . $j . ':B' . $j)->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
		$spreadsheet -> getActiveSheet() -> getStyle('C' . $j . ':C' . $j)->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
		$spreadsheet -> getActiveSheet() -> getStyle('D' . $j . ':D' . $j)->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
		$spreadsheet -> getActiveSheet() -> getStyle('E' . $j . ':E' . $j)->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
		$spreadsheet -> getActiveSheet() -> getStyle('F' . $j . ':F' . $j)->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
		$spreadsheet -> getActiveSheet() -> getStyle('G' . $j . ':G' . $j)->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
		$spreadsheet -> getActiveSheet() -> getStyle('H' . $j . ':H' . $j)->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
		$spreadsheet -> getActiveSheet() -> getStyle('I' . $j . ':I' . $j)->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
		$spreadsheet -> getActiveSheet() -> getStyle('J' . $j . ':J' . $j)->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
		$spreadsheet -> getActiveSheet() -> getStyle('K' . $j . ':K' . $j)->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
		$spreadsheet -> getActiveSheet() -> getStyle('L' . $j . ':L' . $j)->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
	
		
		$spreadsheet->getActiveSheet()->getStyle('B'.$j)->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1);
		$spreadsheet->getActiveSheet()->getStyle('B'.$j)->getNumberFormat()->setFormatCode('#,##0'); 	
	
		
		$spreadsheet->getActiveSheet()->getStyle('C'.$j)->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1);
		$spreadsheet->getActiveSheet()->getStyle('C'.$j)->getNumberFormat()->setFormatCode('#,##0'); 	
	
		
		$spreadsheet->getActiveSheet()->getStyle('D'.$j)->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1);
		$spreadsheet->getActiveSheet()->getStyle('D'.$j)->getNumberFormat()->setFormatCode('#,##0'); 	
	
		
		$spreadsheet->getActiveSheet()->getStyle('E'.$j)->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1);
		$spreadsheet->getActiveSheet()->getStyle('E'.$j)->getNumberFormat()->setFormatCode('#,##0'); 	
	
		
		$spreadsheet->getActiveSheet()->getStyle('F'.$j)->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1);
		$spreadsheet->getActiveSheet()->getStyle('F'.$j)->getNumberFormat()->setFormatCode('#,##0'); 	
	
		
		$spreadsheet->getActiveSheet()->getStyle('G'.$j)->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1);
		$spreadsheet->getActiveSheet()->getStyle('G'.$j)->getNumberFormat()->setFormatCode('#,##0'); 	
	
		
		$spreadsheet->getActiveSheet()->getStyle('H'.$j)->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1);
		$spreadsheet->getActiveSheet()->getStyle('H'.$j)->getNumberFormat()->setFormatCode('#,##0'); 	
	

		
		$spreadsheet->getActiveSheet()->getStyle('I'.$j)->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1);
		$spreadsheet->getActiveSheet()->getStyle('I'.$j)->getNumberFormat()->setFormatCode('#,##0'); 	
	
		
		$spreadsheet->getActiveSheet()->getStyle('J'.$j)->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1);
		$spreadsheet->getActiveSheet()->getStyle('J'.$j)->getNumberFormat()->setFormatCode('#,##0'); 	
	
		
		$spreadsheet->getActiveSheet()->getStyle('K'.$j)->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1);
		$spreadsheet->getActiveSheet()->getStyle('K'.$j)->getNumberFormat()->setFormatCode('#,##0'); 	
	
	
		$spreadsheet->getActiveSheet()->getStyle('L'.$j)->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1);
		$spreadsheet->getActiveSheet()->getStyle('L'.$j)->getNumberFormat()->setFormatCode('#,##0.0'); 	
	
	
			$i++; $j++;



		}
	
	


/* * *********************************** */
/* * ************************************ */

date_default_timezone_set('Africa/Porto-Novo');

$exportTime = date("Y-m-d-His", time());
$writer = new Xlsx($spreadsheet);
$file = 'PG_Distribution-' . $exportTime . '.xlsx'; //Save file name
$writer->save('media/' . $file);
header('Location:media/' . $file); //File open location

function cellColor($cells, $color) {
    global $spreadsheet;

    $spreadsheet->getActiveSheet()->getStyle($cells)->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB($color);
}

?>