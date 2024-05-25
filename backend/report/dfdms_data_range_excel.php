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

	$FiledTypeId = isset($_REQUEST['FiledTypeId']) ? $_REQUEST['FiledTypeId'] : "";
	$DataRange = isset($_REQUEST['DataRange']) ? $_REQUEST['DataRange'] : "";
	$filedTypeName = isset($_REQUEST['filedTypeName']) ? $_REQUEST['filedTypeName'] : "";
	
	$filterSubHeader = 'Type: '.$filedTypeName.', Range: '.$DataRange;
	
	$DBFieldArray = [
		"CowNative",
		"CowCross",
		"MilkCow",
		"CowBullNative",
		"CowBullCross",
		"CowCalfMaleNative",
		"CowCalfMaleCross",
		"CowCalfFemaleNative",
		"CowCalfFemaleCross",
		"CowMilkProductionNative",
		"CowMilkProductionCross",
		"BuffaloAdultMale",
		"BuffaloAdultFemale",
		"BuffaloCalfMale",
		"BuffaloCalfFemale",
		"BuffaloMilkProduction",
		"GoatAdultMale",
		"GoatAdultFemale",
		"GoatCalfMale",
		"GoatCalfFemale",
		"SheepAdultMale",
		"SheepAdultFemale",
		"SheepCalfMale",
		"SheepCalfFemale",
		"GoatSheepMilkProduction",
		"ChickenNative",
		"ChickenLayer",
		"ChickenBroiler",
		"ChickenSonali",
		"ChickenSonaliFayoumiCockerelOthers",
		"ChickenEgg",
		"DucksNumber",
		"DucksEgg",
		"PigeonNumber",
		"QuailNumber",
		"OtherAnimalNumber",
		"LandTotal",
		"LandOwn",
		"LandLeased"
	];


	$ReportFieldArray = array();
	if ($FiledTypeId == "") {
		$ReportFieldArray = $DBFieldArray;
	} else {
		$ReportFieldArray[] = $FiledTypeId;
	}


	$ReportRangeArray = array();

	$validRangePattern = '/^(\d+)(,\d+)*$/';

	if (!preg_match($validRangePattern, $DataRange)) {
		$DataRange = ""; 
	}

	if ($DataRange == "") {
		$ReportRangeArray[] = array("min" => 0, "max" => "", "colname" => "col0");
	} else {
		$ranges = explode(",", $DataRange);
		$min = 0;
		foreach ($ranges as $index => $range) {
			$max = (int) $range;
			$ReportRangeArray[] = array("min" => $min, "max" => $max, "colname" => "col" . $index);
			$min = $max + 1;
		}
		$ReportRangeArray[] = array("min" => $min, "max" => "", "colname" => "col" . count($ranges));
	}



	foreach ($ReportFieldArray as $idx => $fieldname) {
		$sql = "SELECT ";
		foreach ($ReportRangeArray as $idx1 => $range) {
			if ($range["max"] == "") {
				$sql .= "SUM(CASE WHEN $fieldname > {$range["min"]} THEN 1 ELSE 0 END) AS {$range["colname"]}";
			} else {
				$sql .= "SUM(CASE WHEN $fieldname > {$range["min"]} AND $fieldname <= {$range["max"]} THEN 1 ELSE 0 END) AS {$range["colname"]}";
			}
			if ($idx1 < count($ReportRangeArray) - 1) {
				$sql .= ", ";
			}
		}
		$sql .= " FROM t_householdlivestocksurvey WHERE IFNULL($fieldname, 0) > 0";
	}

	$resultdata = $db->query($sql);
	
	
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
	 $spreadsheet->getActiveSheet()->SetCellValue('C'.$rn, "Gender Status");
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

	//head - 4
	/* $spreadsheet->getActiveSheet()->SetCellValue('C'.$rn, $FacilityName);
	$spreadsheet->getActiveSheet()->getStyle('C'.$rn)->getFont();
	$spreadsheet -> getActiveSheet()->getStyle('C'.$rn) -> applyFromArray(array('font' => array('size' => '14', 'bold' => true)), 'A4');
	$spreadsheet -> getActiveSheet()->getStyle('C'.$rn) -> getAlignment()->setHorizontal(Alignment::VERTICAL_CENTER);
	$spreadsheet -> getActiveSheet() -> getStyle('C'.$rn)->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
	$spreadsheet->getActiveSheet()->mergeCells('C'.$rn.':G'.$rn);
		$rn++; */

	
	


	/*Value Set for Cells*/
    $spreadsheet -> getActiveSheet()											
			->SetCellValue('A5', 'Gender')
			->SetCellValue('B5', 'Dairy')
			->SetCellValue('C5', 'Buffalo')
			
			;
					
	/*Font Size for Cells*/
	//$spreadsheet -> getActiveSheet()->getStyle('A6') -> applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'A6');	
	$spreadsheet -> getActiveSheet()->getStyle('A5') -> applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'A5');
	$spreadsheet -> getActiveSheet()->getStyle('B5') -> applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'B5');
	$spreadsheet -> getActiveSheet()->getStyle('C5') -> applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'C5');

	/*Text Alignment Horizontal(HORIZONTAL_LEFT,HORIZONTAL_CENTER,HORIZONTAL_RIGHT)*/
	//$spreadsheet -> getActiveSheet()->getStyle('A6') -> getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
	$spreadsheet -> getActiveSheet()->getStyle('A5') -> getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
	$spreadsheet -> getActiveSheet()->getStyle('B5') -> getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
	$spreadsheet -> getActiveSheet()->getStyle('C5') -> getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);

	/*Text Alignment Vertical(VERTICAL_TOP,VERTICAL_CENTER,VERTICAL_BOTTOM)*/
	//$spreadsheet -> getActiveSheet() -> getStyle('A6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
	$spreadsheet -> getActiveSheet() -> getStyle('A5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
	$spreadsheet -> getActiveSheet() -> getStyle('B5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
	$spreadsheet -> getActiveSheet() -> getStyle('C5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);

	/*Width for Cells*/
	//$spreadsheet -> getActiveSheet() -> getColumnDimension('A') -> setWidth(15);
	$spreadsheet -> getActiveSheet() -> getColumnDimension('A') -> setWidth(30);
	$spreadsheet -> getActiveSheet() -> getColumnDimension('B') -> setWidth(15);
	$spreadsheet -> getActiveSheet() -> getColumnDimension('C') -> setWidth(15);

	/*Wrap text*/
	$spreadsheet->getActiveSheet()->getStyle('A5')->getAlignment()->setWrapText(true);
	
	/*border color set for cells*/
	//$spreadsheet -> getActiveSheet() -> getStyle('A6:A6') -> applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet -> getActiveSheet() -> getStyle('A5:A5') -> applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet -> getActiveSheet() -> getStyle('B5:B5') -> applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet -> getActiveSheet() -> getStyle('C5:C5') -> applyFromArray($styleThinBlackBorderOutline);

	$charList = array('1' => 'A', '2' => 'B', '3' => 'C', '4' => 'D', '5' =>'E', '6' => 'F', '7' => 'G', '8' => 'H', '9' => 'I', '10' => 'J', '11' => 'K', '12' => 'L', '13' => 'M', '14' => 'N', '15' => 'O');

	$index = 1;
	$rowNo = 10;

	
	$i=1; 
	$j=6;

	/* $dataList = array(); */


	$fieldLabel = array(
		"CowNative" => "Cow (গাভীর সংখ্যা) Native (দেশি)",
		"CowCross" => "Cow (গাভীর সংখ্যা) Cross (শংকর)",
		"MilkCow" => "এখন দুধ দিচ্ছে এমন গাভীর সংখ্যা",
		"CowBullNative" => "Bull/Castrated Bull (ষাঁড়/বলদ সংখ্যা) Native (দেশি)",
		"CowBullCross" => "Bull/Castrated Bull (ষাঁড়/বলদ সংখ্যা) Cross (শংকর)",
		"CowCalfMaleNative" => "Calf Male (এঁড়ে বাছুর সংখ্যা) Native (দেশি)",
		"CowCalfMaleCross" => "Calf Male (এঁড়ে বাছুর সংখ্যা) Cross (শংকর)",
		"CowCalfFemaleNative" => "Calf Female (বকনা বাছুর সংখ্যা) Native (দেশি)",
		"CowCalfFemaleCross" => "Calf Female (বকনা বাছুর সংখ্যা) Cross (শংকর)",
		"CowMilkProductionNative" => "Household/Farm Total (Cows) Milk Production per day (Liter)(দৈনিক দুধের পরিমাণ (লিটার)) Native (দেশি)",
		"CowMilkProductionCross" => "Household/Farm Total (Cows) Milk Production per day (Liter)(দৈনিক দুধের পরিমাণ (লিটার)) Cross (শংকর)",
		"BuffaloAdultMale" => "Adult Buffalo (মহিষের সংখ্যা) Male (ষাঁড়)",
		"BuffaloAdultFemale" => "Adult Buffalo (মহিষের সংখ্যা) Female (স্ত্রী)",
		"BuffaloCalfMale" => "Calf Buffalo (বাছুর মহিষের সংখ্যা) Male (এঁড়ে বাছুর)",
		"BuffaloCalfFemale" => "Calf Buffalo (বাছুর মহিষের সংখ্যা) Female (বকনা)",
		"BuffaloMilkProduction" => "Household/Farm Total (Buffalo) Milk Production per day (Liter) (দৈনিক দুধের পরিমাণ (লিটার))",
		"GoatAdultMale" => "Adult Goat (ছাগল সংখ্যা) Male (পাঁঠা/খাসি)",
		"GoatAdultFemale" => "Adult Goat (ছাগল সংখ্যা) Female (ছাগী)",
		"GoatCalfMale" => "Calf (ছাগল বাচ্চার সংখ্যা) Male (পুং)",
		"GoatCalfFemale" => "Calf (ছাগল বাচ্চার সংখ্যা) Female (স্ত্রী)",
		"SheepAdultMale" => "Adult Sheep (ভেড়ার সংখ্যা) Male (পাঁঠা/খাসি)",
		"SheepAdultFemale" => "Adult Sheep (ভেড়ার সংখ্যা) Female (ভেড়ি)",
		"SheepCalfMale" => "Calf (ভেড়া বাচ্চার সংখ্যা) Male (পুং)",
		"SheepCalfFemale" => "Calf (ভেড়া বাচ্চার সংখ্যা) Female (স্ত্রী)",
		"GoatSheepMilkProduction" => "Household/Farm Total (Goat) Milk Production per day (Liter) (দৈনিক দুধের পরিমাণ (লিটার))",
		"ChickenNative" => "Chicken (মুরগির সংখ্যা) Native (দেশি)",
		"ChickenLayer" => "Chicken (মুরগির সংখ্যা) Layer (লেয়ার)",
		"ChickenBroiler" => "Chicken (মুরগির সংখ্যা) Broiler (ব্রয়লার)",
		"ChickenSonali" => "Chicken (মুরগির সংখ্যা) Sonali (সোনালী)",
		"ChickenSonaliFayoumiCockerelOthers" => "Chicken (মুরগির সংখ্যা) Other Poultry (Fayoumi/ Cockerel/ Turkey)( ফাউমি / ককরেল/ টারকি)",
		"ChickenEgg" => "Household/Farm Total (Chicken) Daily Egg Production (দৈনিক ডিম উৎপাদন)",
		"DucksNumber" => "Number of Ducks/Goose (হাঁসের/রাজহাঁসের সংখ্যা)",
		"DucksEgg" => "Household/Farm Total (Duck) Daily Egg Production (দৈনিক ডিম উৎপাদন)",
		"PigeonNumber" => "Number of Pigeon (কবুতরের সংখ্যা)",
		"QuailNumber" => "Number of Quail (কোয়েলের সংখ্যা)",
		"OtherAnimalNumber" => "Number of other animals (Pig/Horse) (অন্যান্য প্রাণীর সংখ্যা (শুকর/ঘোড়া))",
		"LandTotal" => "Total cultivable land in decimal (মোট চাষ যোগ্য জমির পরিমাণ (শতাংশ))",
		"LandOwn" => "Own land for Fodder cultivation (নিজস্ব ঘাস চাষের জমি (শতাংশ))",
		"LandLeased" => "Leased land for fodder cultivation (লিজ নেয়া ঘাস চাষের জমি (শতাংশ))"
	);



	$dataList = array();
	foreach ($ReportFieldArray as $fieldname) {
		$label = $fieldLabel[$fieldname];  // Get the field label

		foreach ($resultdata as $key => $row) {
			foreach ($ReportRangeArray as $idx1 => $range) {
				$rangeDesc = "";
				if ($range["max"] == "") {
					$rangeDesc = "HH Count > " . $range["min"];
				} else {
					$rangeDesc = "HH Count " . ($range["min"] + 1) . "-" . $range["max"];
				}

				$dataList[] = [
					"field" => $label,
					"range" => $rangeDesc,
					"colname" => $row[$range['colname']]
				];
			}
		}
	}




		/**Calculate Percentage */
		foreach ($dataList as $key => $row) {
		

			$spreadsheet->getActiveSheet()							
				->SetCellValue('A'.$j, $row['field'])	
				->SetCellValue('B'.$j, $row['range'])																
				->SetCellValue('C'.$j, $row['colname'])														
			
				
			;

		$spreadsheet -> getActiveSheet() -> getStyle('A' . $j . ':A' . $j) -> applyFromArray($styleThinBlackBorderOutline);
		$spreadsheet -> getActiveSheet() -> getStyle('B' . $j . ':B' . $j) -> applyFromArray($styleThinBlackBorderOutline);
		$spreadsheet -> getActiveSheet() -> getStyle('C' . $j . ':C' . $j) -> applyFromArray($styleThinBlackBorderOutline);
	
		
		$spreadsheet -> getActiveSheet()->getStyle('A' . $j . ':A' . $j) -> getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
		$spreadsheet -> getActiveSheet()->getStyle('B' . $j . ':B' . $j) -> getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
		$spreadsheet -> getActiveSheet()->getStyle('C' . $j . ':C' . $j) -> getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);

		
		$spreadsheet -> getActiveSheet() -> getStyle('A' . $j . ':A' . $j)->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
		$spreadsheet -> getActiveSheet() -> getStyle('B' . $j . ':B' . $j)->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
		$spreadsheet -> getActiveSheet() -> getStyle('C' . $j . ':C' . $j)->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
	

		
		$spreadsheet->getActiveSheet()->getStyle('C'.$j)->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1);
		$spreadsheet->getActiveSheet()->getStyle('C'.$j)->getNumberFormat()->setFormatCode('#,##0'); 	
	
		
	
		$i++; $j++;



		}
	
	




/* * *********************************** */
/* * ************************************ */

date_default_timezone_set('Africa/Porto-Novo');

$exportTime = date("Y-m-d-His", time());
$writer = new Xlsx($spreadsheet);
$file = 'dfdms-data-range-' . $exportTime . '.xlsx'; //Save file name
$writer->save('media/' . $file);
header('Location:media/' . $file); //File open location

function cellColor($cells, $color) {
    global $spreadsheet;

    $spreadsheet->getActiveSheet()->getStyle($cells)->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB($color);
}

?>