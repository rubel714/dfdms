<?php

/* Database Connection */
include_once('../env.php');
include_once('../source/api/pdolibs/pdo_lib.php');
include_once('../source/api/pdolibs/function_global.php');

/* include PhpSpreadsheet library */
require("PhpSpreadsheet/vendor/autoload.php");


$lan = isset($_REQUEST['lan']) ? $_REQUEST['lan'] : "en_GB";
$menukey = isset($_REQUEST['menukey']) ? $_REQUEST['menukey'] : "";
include_once('../source/api/languages/lang_switcher_custom.php');

$db = new Db();


$DivisionId = isset($_REQUEST['DivisionId']) ? $_REQUEST['DivisionId'] : 0;
$DistrictId = isset($_REQUEST['DistrictId']) ? $_REQUEST['DistrictId'] : 0;
$UpazilaId = isset($_REQUEST['UpazilaId']) ? $_REQUEST['UpazilaId'] : 0;

if ($_REQUEST['DivisionId'] === '') {
    $DivisionId = 0;
}
if ($_REQUEST['DistrictId'] === '') {
    $DistrictId = 0;
}
if ($_REQUEST['UpazilaId'] === '') {
    $UpazilaId = 0;
}


$DivisionName = isset($_REQUEST['DivisionName']) ? $_REQUEST['DivisionName'] : '';
$DistrictName = isset($_REQUEST['DistrictName']) ? $_REQUEST['DistrictName'] : '';
$UpazilaName = isset($_REQUEST['UpazilaName']) ? $_REQUEST['UpazilaName'] : '';


$filterSubHeader = 'Division: ' . $DivisionName . ', District: ' . $DistrictName . ', Upazila: ' . $UpazilaName;

$dataList = array(
	'category' => array(),
	'series' => array()
);


$index = 0;
$i = 0;


$query = "SELECT q.`DivisionName`,r.`DistrictName`,s.`UpazilaName`,t.`DivisionId`,t.`DistrictId`,t.`UpazilaId`
	,SUM(DairyPG) DairyPG,SUM(DairyFarmer) DairyFarmer
	,SUM(BuffaloPG) BuffaloPG, SUM(BuffaloFarmer) BuffaloFarmer
	,SUM(BeefFatteningPG) BeefFatteningPG, SUM(BeefFatteningFarmer) BeefFatteningFarmer
	,SUM(GoatPG) GoatPG, SUM(GoatFarmer) GoatFarmer
	,SUM(SheepPG) SheepPG, SUM(SheepFarmer) SheepFarmer
	,SUM(ScavengingChickensPG) ScavengingChickensPG, SUM(ScavengingChickensFarmer) ScavengingChickensFarmer
	,SUM(DuckPG) DuckPG, SUM(DuckFarmer) DuckFarmer
	,SUM(QuailPG) QuailPG, SUM(QuailFarmer) QuailFarmer
	,SUM(PigeonPG) PigeonPG,SUM(PigeonFarmer) PigeonFarmer		 
	,0 RowTotalPG, 0 RowTotalFarmer
	FROM
	
	(SELECT f.`DivisionId`,f.`DistrictId`,f.`UpazilaId`
	,(CASE WHEN f.`ValuechainId`='DAIRY' THEN 1 ELSE 0 END) DairyPG,0 DairyFarmer
	,(CASE WHEN f.`ValuechainId`='BUFFALO' THEN 1 ELSE 0 END) BuffaloPG, 0 BuffaloFarmer
	,(CASE WHEN f.`ValuechainId`='BEEFFATTENING' THEN 1 ELSE 0 END) BeefFatteningPG, 0 BeefFatteningFarmer
	,(CASE WHEN f.`ValuechainId`='GOAT' THEN 1 ELSE 0 END) GoatPG, 0 GoatFarmer
	,(CASE WHEN f.`ValuechainId`='SHEEP' THEN 1 ELSE 0 END) SheepPG, 0 SheepFarmer
	,(CASE WHEN f.`ValuechainId`='SCAVENGINGCHICKENLOCAL' THEN 1 ELSE 0 END) ScavengingChickensPG, 0 ScavengingChickensFarmer
	,(CASE WHEN f.`ValuechainId`='DUCK' THEN 1 ELSE 0 END) DuckPG, 0 DuckFarmer
	,(CASE WHEN f.`ValuechainId`='QUAIL' THEN 1 ELSE 0 END) QuailPG, 0 QuailFarmer
	,(CASE WHEN f.`ValuechainId`='PIGEON' THEN 1 ELSE 0 END) PigeonPG,0 PigeonFarmer
	FROM `t_pg` f
	WHERE (f.DivisionId = $DivisionId OR $DivisionId=0)
	AND (f.DistrictId = $DistrictId OR $DistrictId=0)
	AND (f.UpazilaId = $UpazilaId OR $UpazilaId=0)
	
	UNION ALL
	
	SELECT f.`DivisionId`,f.`DistrictId`,f.`UpazilaId`
	,0 DairyPG, (CASE WHEN f.`ValueChain`='DAIRY' THEN 1 ELSE 0 END) DairyFarmer
	,0 BuffaloPG,(CASE WHEN f.`ValueChain`='BUFFALO' THEN 1 ELSE 0 END) BuffaloFarmer
	,0 BeefFatteningPG,(CASE WHEN f.`ValueChain`='BEEFFATTENING' THEN 1 ELSE 0 END) BeefFatteningFarmer
	,0 BeefFatteningPG,(CASE WHEN f.`ValueChain`='GOAT' THEN 1 ELSE 0 END) GoatFarmer
	,0 SheepPG,(CASE WHEN f.`ValueChain`='SHEEP' THEN 1 ELSE 0 END) SheepFarmer
	,0 ScavengingChickensPG,(CASE WHEN f.`ValueChain`='SCAVENGINGCHICKENLOCAL' THEN 1 ELSE 0 END) ScavengingChickensFarmer
	,0 DuckPG,(CASE WHEN f.`ValueChain`='DUCK' THEN 1 ELSE 0 END) DuckFarmer
	,0 QuailPG,(CASE WHEN f.`ValueChain`='QUAIL' THEN 1 ELSE 0 END) QuailFarmer
	,0 PigeonPG,(CASE WHEN f.`ValueChain`='PIGEON' THEN 1 ELSE 0 END) PigeonFarmer
	FROM `t_farmer` f
	WHERE (f.DivisionId = $DivisionId OR $DivisionId=0)
	AND (f.DistrictId = $DistrictId OR $DistrictId=0)
	AND (f.UpazilaId = $UpazilaId OR $UpazilaId=0)
	) t
	INNER JOIN `t_division` q ON t.`DivisionId`=q.`DivisionId`
	INNER JOIN `t_district` r ON t.`DistrictId`=r.`DistrictId`
	INNER JOIN `t_upazila` s ON t.`UpazilaId`=s.`UpazilaId`
	GROUP BY q.`DivisionName`,r.`DistrictName`,s.`UpazilaName`,t.`DivisionId`,t.`DistrictId`,t.`UpazilaId`

	;";


$resultdata = $db->query($query);


if ($lan == 'en_GB') {
	$siteTitle = reportsitetitleeng;
} else if ($lan == 'fr_FR') {
	$siteTitle = reportsitetitlefr;
}

$reporttitlelist = explode('<br/>', $siteTitle);
if (count($reporttitlelist) > 1) {
	$reportHeaderList[0] = $reporttitlelist[count($reporttitlelist) - 1];
	for ($h = (count($reporttitlelist) - 2); $h >= 0; $h--) {
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
$rn = 2;


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
for ($p = 0; $p < count($reporttitlelist); $p++) {

	$spreadsheet->getActiveSheet()->SetCellValue('C' . $rn, $reporttitlelist[$p]);
	$spreadsheet->getActiveSheet()->getStyle('C' . $rn)->getFont();
	/* Font Size for Cells */
	$spreadsheet->getActiveSheet()->getStyle('C' . $rn)->applyFromArray(array('font' => array('size' => '13', 'bold' => true)), 'C' . $rn);
	/* Text Alignment Horizontal(HORIZONTAL_LEFT,HORIZONTAL_CENTER,HORIZONTAL_RIGHT) */
	$spreadsheet->getActiveSheet()->getStyle('C' . $rn)->getAlignment()->setHorizontal(Alignment::VERTICAL_CENTER);
	/* Text Alignment Vertical(VERTICAL_TOP,VERTICAL_CENTER,VERTICAL_BOTTOM) */
	$spreadsheet->getActiveSheet()->getStyle('C' . $rn)->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
	/* merge Cell */
	$spreadsheet->getActiveSheet()->mergeCells('C' . $rn . ':G' . $rn);
	$rn++;
}
$spreadsheet->getActiveSheet()->SetCellValue('C' . $rn, "Division, District, Upazila wise PG and PG members information");
$spreadsheet->getActiveSheet()->getStyle('C' . $rn)->getFont();
$spreadsheet->getActiveSheet()->getStyle('C' . $rn)->applyFromArray(array('font' => array('size' => '14', 'bold' => true)), 'C' . $rn);
$spreadsheet->getActiveSheet()->getStyle('C' . $rn)->getAlignment()->setHorizontal(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('C' . $rn)->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->mergeCells('C' . $rn . ':G' . $rn);
$rn++;
//head - 2


//head - 3
$spreadsheet->getActiveSheet()->SetCellValue('C' . $rn, $filterSubHeader);
$spreadsheet->getActiveSheet()->getStyle('C' . $rn)->getFont();
$spreadsheet->getActiveSheet()->getStyle('C' . $rn)->applyFromArray(array('font' => array('size' => '14', 'bold' => true)), 'C' . $rn);
$spreadsheet->getActiveSheet()->getStyle('C' . $rn)->getAlignment()->setHorizontal(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('C' . $rn)->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->mergeCells('C' . $rn . ':G' . $rn);
$rn++;



/*Value Set for Cells*/
$spreadsheet->getActiveSheet()
	->SetCellValue('A5', 'Division')
	->SetCellValue('B5', 'District')
	->SetCellValue('C5', 'Upazila')
	->SetCellValue('D5', 'Dairy')
	->SetCellValue('F5', 'Buffalo')
	->SetCellValue('H5', 'Beef Fattening')
	->SetCellValue('J5', 'Goat')
	->SetCellValue('L5', 'Sheep')
	->SetCellValue('N5', 'Scavenging Chickens')
	->SetCellValue('P5', 'Duck')
	->SetCellValue('R5', 'Quail')
	->SetCellValue('T5', 'Pigeon')
	->SetCellValue('V5', 'Total PG')
	->SetCellValue('W5', 'Total PG Members')
	
	;


	$spreadsheet->getActiveSheet()
	->SetCellValue('A6', '')
	->SetCellValue('B6', '')
	->SetCellValue('C6', '')
	->SetCellValue('D6', 'PG')
	->SetCellValue('E6', 'PG Members')
	->SetCellValue('F6', 'PG')
	->SetCellValue('G6', 'PG Members')
	->SetCellValue('H6', 'PG')
	->SetCellValue('I6', 'PG Members')
	->SetCellValue('J6', 'PG')
	->SetCellValue('K6', 'PG Members')
	->SetCellValue('L6', 'PG')
	->SetCellValue('M6', 'PG Members')
	->SetCellValue('N5', 'PG')
	->SetCellValue('O6', 'PG Members')
	->SetCellValue('P6', 'PG')
	->SetCellValue('Q6', 'PG Members')
	->SetCellValue('R6', 'PG')
	->SetCellValue('S6', 'PG Members')
	->SetCellValue('T6', 'PG')
	->SetCellValue('U6', 'PG Members')
	->SetCellValue('V6', '')
	->SetCellValue('W6', '')
	
	;


	$spreadsheet->getActiveSheet()->mergeCells('A5:A6');
	$spreadsheet->getActiveSheet()->mergeCells('B5:B6');
	$spreadsheet->getActiveSheet()->mergeCells('C5:C6');

	$spreadsheet->getActiveSheet()->mergeCells('D5:E5');
	$spreadsheet->getActiveSheet()->mergeCells('F5:G5');
	$spreadsheet->getActiveSheet()->mergeCells('H5:I5');
	$spreadsheet->getActiveSheet()->mergeCells('J5:K5');
	$spreadsheet->getActiveSheet()->mergeCells('L5:M5');
	$spreadsheet->getActiveSheet()->mergeCells('N5:O5');
	$spreadsheet->getActiveSheet()->mergeCells('P5:Q5');
	$spreadsheet->getActiveSheet()->mergeCells('R5:S5');
	$spreadsheet->getActiveSheet()->mergeCells('T5:U5');


	$spreadsheet->getActiveSheet()->mergeCells('V5:V6');
	$spreadsheet->getActiveSheet()->mergeCells('W5:W6');

/*Font Size for Cells*/
//$spreadsheet -> getActiveSheet()->getStyle('A6') -> applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'A6');	
$spreadsheet->getActiveSheet()->getStyle('A5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'A5');
$spreadsheet->getActiveSheet()->getStyle('B5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'B5');
$spreadsheet->getActiveSheet()->getStyle('C5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'C5');
$spreadsheet->getActiveSheet()->getStyle('D5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'D5');
$spreadsheet->getActiveSheet()->getStyle('E5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'E5');
$spreadsheet->getActiveSheet()->getStyle('F5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'F5');
$spreadsheet->getActiveSheet()->getStyle('G5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'G5');
$spreadsheet->getActiveSheet()->getStyle('H5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'H5');
$spreadsheet->getActiveSheet()->getStyle('I5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'I5');
$spreadsheet->getActiveSheet()->getStyle('J5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'J5');
$spreadsheet->getActiveSheet()->getStyle('K5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'K5');
$spreadsheet->getActiveSheet()->getStyle('L5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'L5');
$spreadsheet->getActiveSheet()->getStyle('M5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'M5');
$spreadsheet->getActiveSheet()->getStyle('N5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'N5');
$spreadsheet->getActiveSheet()->getStyle('O5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'O5');
$spreadsheet->getActiveSheet()->getStyle('P5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'P5');
$spreadsheet->getActiveSheet()->getStyle('Q5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'Q5');
$spreadsheet->getActiveSheet()->getStyle('R5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'R5');
$spreadsheet->getActiveSheet()->getStyle('S5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'S5');
$spreadsheet->getActiveSheet()->getStyle('T5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'T5');
$spreadsheet->getActiveSheet()->getStyle('U5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'U5');
$spreadsheet->getActiveSheet()->getStyle('V5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'V5');
$spreadsheet->getActiveSheet()->getStyle('W5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'W5');


$spreadsheet->getActiveSheet()->getStyle('D6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'D6');
$spreadsheet->getActiveSheet()->getStyle('E6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'E6');
$spreadsheet->getActiveSheet()->getStyle('F6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'F6');
$spreadsheet->getActiveSheet()->getStyle('G6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'G6');
$spreadsheet->getActiveSheet()->getStyle('H6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'H6');
$spreadsheet->getActiveSheet()->getStyle('I6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'I6');
$spreadsheet->getActiveSheet()->getStyle('J6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'J6');
$spreadsheet->getActiveSheet()->getStyle('K6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'K6');
$spreadsheet->getActiveSheet()->getStyle('L6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'L6');
$spreadsheet->getActiveSheet()->getStyle('M6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'M6');
$spreadsheet->getActiveSheet()->getStyle('N6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'N6');
$spreadsheet->getActiveSheet()->getStyle('O6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'O6');
$spreadsheet->getActiveSheet()->getStyle('P6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'P6');
$spreadsheet->getActiveSheet()->getStyle('Q6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'Q6');
$spreadsheet->getActiveSheet()->getStyle('R6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'R6');
$spreadsheet->getActiveSheet()->getStyle('S6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'S6');
$spreadsheet->getActiveSheet()->getStyle('T6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'T6');
$spreadsheet->getActiveSheet()->getStyle('U6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'U6');

/*Text Alignment Horizontal(HORIZONTAL_LEFT,HORIZONTAL_CENTER,HORIZONTAL_RIGHT)*/
//$spreadsheet -> getActiveSheet()->getStyle('A6') -> getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('A5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
$spreadsheet->getActiveSheet()->getStyle('B5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
$spreadsheet->getActiveSheet()->getStyle('C5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
$spreadsheet->getActiveSheet()->getStyle('D5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('F5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('H5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('J5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('L5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('N5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('P5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('R5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('T5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);


$spreadsheet->getActiveSheet()->getStyle('D6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
$spreadsheet->getActiveSheet()->getStyle('F6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
$spreadsheet->getActiveSheet()->getStyle('H6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
$spreadsheet->getActiveSheet()->getStyle('J6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
$spreadsheet->getActiveSheet()->getStyle('L6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
$spreadsheet->getActiveSheet()->getStyle('N6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
$spreadsheet->getActiveSheet()->getStyle('P6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
$spreadsheet->getActiveSheet()->getStyle('R6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
$spreadsheet->getActiveSheet()->getStyle('T6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
$spreadsheet->getActiveSheet()->getStyle('U6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);

/*Text Alignment Vertical(VERTICAL_TOP,VERTICAL_CENTER,VERTICAL_BOTTOM)*/
//$spreadsheet -> getActiveSheet() -> getStyle('A6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('A5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('B5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('C5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('D5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('E5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('F5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('G5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('H5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('I5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('J5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('K5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('L5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('V5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('W5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);

$spreadsheet->getActiveSheet()->getStyle('A6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('B6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('C6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('D6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('E6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('F6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('G6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('H6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('I6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('J6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('K6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('L6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('V6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('W6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);


/*Width for Cells*/
//$spreadsheet -> getActiveSheet() -> getColumnDimension('A') -> setWidth(15);
$spreadsheet->getActiveSheet()->getColumnDimension('A')->setWidth(17);
$spreadsheet->getActiveSheet()->getColumnDimension('B')->setWidth(17);
$spreadsheet->getActiveSheet()->getColumnDimension('C')->setWidth(17);
$spreadsheet->getActiveSheet()->getColumnDimension('D')->setWidth(12);
for ($column = 'D'; $column <= 'W'; $column++) {
    $spreadsheet->getActiveSheet()->getColumnDimension($column)->setWidth(12);
}



/*Wrap text*/
$spreadsheet->getActiveSheet()->getStyle('A5')->getAlignment()->setWrapText(true);
$spreadsheet->getActiveSheet()->getStyle('D6:W6')->getAlignment()->setWrapText(true);

/*border color set for cells*/
//$spreadsheet -> getActiveSheet() -> getStyle('A6:A6') -> applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('A5:A6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('B5:B6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('C5:C6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('D5:D5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('E5:E5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('F5:F5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('G5:G5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('H5:H5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('I5:I5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('J5:J5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('K5:K5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('L5:L5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('M5:M5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('N5:N5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('O5:O5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('P5:P5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('Q5:Q5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('R5:R5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('S5:S5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('T5:T5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('U5:U5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('V5:V5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('W5:W5')->applyFromArray($styleThinBlackBorderOutline);



$spreadsheet->getActiveSheet()->getStyle('D6:D6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('E6:E6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('F6:F6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('G6:G6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('H6:H6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('I6:I6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('J6:J6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('K6:K6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('L6:L6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('M6:M6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('N6:N6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('O6:O6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('P6:P6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('Q6:Q6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('R6:R6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('S6:S6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('T6:T6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('U6:U6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('V6:V6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('W6:W6')->applyFromArray($styleThinBlackBorderOutline);

$charList = array('1' => 'A', '2' => 'B', '3' => 'C', '4' => 'D', '5' => 'E', '6' => 'F', '7' => 'G', '8' => 'H', '9' => 'I', '10' => 'J', '11' => 'K', '12' => 'L', '13' => 'M', '14' => 'N', '15' => 'O');

$index = 1;
$rowNo = 10;


$i = 1;
$j = 7;

$TotalDairyPG = 0;
$TotalDairyFarmer = 0;
$TotalBuffaloPG = 0;
$TotalBuffaloFarmer = 0;
$TotalBeefFatteningPG = 0;
$TotalBeefFatteningFarmer = 0;
$TotalGoatPG = 0;
$TotalGoatFarmer = 0;
$TotalSheepPG = 0;
$TotalSheepFarmer = 0;
$TotalScavengingChickensPG = 0;
$TotalScavengingChickensFarmer = 0;
$TotalDuckPG = 0;
$TotalDuckFarmer = 0;
$TotalQuailPG = 0;
$TotalQuailFarmer = 0;
$TotalPigeonPG = 0;
$TotalPigeonFarmer = 0;
$TotalRowTotalPG = 0;
$TotalRowTotalFarmer = 0;
$TotalGrandTotal = 0;
$TotalPercentage = 0;

$dataList = array();


foreach ($resultdata as $key => $row) {
	$dataList[] = $row;

	/**Calculate column total */
	$TotalDairyPG += $row["DairyPG"];
			$TotalDairyFarmer += $row["DairyFarmer"];
			$TotalBuffaloPG += $row["BuffaloPG"];
			$TotalBuffaloFarmer += $row["BuffaloFarmer"];
			$TotalBeefFatteningPG += $row["BeefFatteningPG"];
			$TotalBeefFatteningFarmer += $row["BeefFatteningFarmer"];
			$TotalGoatPG += $row["GoatPG"];
			$TotalGoatFarmer += $row["GoatFarmer"];
			$TotalSheepPG += $row["SheepPG"];
			$TotalSheepFarmer += $row["SheepFarmer"];
			$TotalScavengingChickensPG += $row["ScavengingChickensPG"];
			$TotalScavengingChickensFarmer += $row["ScavengingChickensFarmer"];
			$TotalDuckPG += $row["DuckPG"];
			$TotalDuckFarmer += $row["DuckFarmer"];
			$TotalQuailPG += $row["QuailPG"];
			$TotalQuailFarmer += $row["QuailFarmer"];
			$TotalPigeonPG += $row["PigeonPG"];
			$TotalPigeonFarmer += $row["PigeonFarmer"];

			$TotalRowTotalPG += $row["RowTotalPG"];
			$TotalRowTotalFarmer += $row["RowTotalFarmer"];
}


/**For Total row */
if (count($dataList) > 0) {
	$row = array();
	$row["DivisionName"]="";
			$row["DistrictName"]="";
			$row["UpazilaName"]="";
			$row["DairyPG"]=$TotalDairyPG;
			$row["DairyFarmer"]=$TotalDairyFarmer;
			$row["BuffaloPG"]=$TotalBuffaloPG;
			$row["BuffaloFarmer"]=$TotalBuffaloFarmer;
			$row["BeefFatteningPG"]=$TotalBeefFatteningPG;
			$row["BeefFatteningFarmer"]=$TotalBeefFatteningFarmer;
			$row["GoatPG"]=$TotalGoatPG;
			$row["GoatFarmer"]=$TotalGoatFarmer;
			$row["SheepPG"]=$TotalSheepPG;
			$row["SheepFarmer"]=$TotalSheepFarmer;
			$row["ScavengingChickensPG"]=$TotalScavengingChickensPG;
			$row["ScavengingChickensFarmer"]=$TotalScavengingChickensFarmer;
			$row["DuckPG"]=$TotalDuckPG;
			$row["DuckFarmer"]=$TotalDuckFarmer;
			$row["QuailPG"]=$TotalQuailPG;
			$row["QuailFarmer"]=$TotalQuailFarmer;
			$row["PigeonPG"]=$TotalPigeonPG;
			$row["PigeonFarmer"]=$TotalPigeonFarmer;

			$row["RowTotalPG"]=$TotalRowTotalPG;
			$row["RowTotalFarmer"]=$TotalRowTotalFarmer;
	$dataList[] = $row;
}




/**Calculate Percentage */
foreach ($dataList as $key => $row) {
	/* $row["Percentage"] = ($row["GrandTotal"] * 100) / $TotalGrandTotal; */

	$spreadsheet->getActiveSheet()
		->SetCellValue('A' . $j, $row['DivisionName'])
		->SetCellValue('B' . $j, $row['DistrictName'])
		->SetCellValue('C' . $j, $row['UpazilaName'])
		->SetCellValue('D' . $j, $row['DairyPG'])
		->SetCellValue('E' . $j, $row['DairyFarmer'])
		->SetCellValue('F' . $j, $row['BuffaloPG'])
		->SetCellValue('G' . $j, $row['BuffaloFarmer'])
		->SetCellValue('H' . $j, $row['BeefFatteningPG'])
		->SetCellValue('I' . $j, $row['BeefFatteningFarmer'])
		->SetCellValue('J' . $j, $row['GoatPG'])
		->SetCellValue('K' . $j, $row['GoatFarmer'])
		->SetCellValue('L' . $j, $row['SheepPG'])
		->SetCellValue('M' . $j, $row['SheepFarmer'])
		->SetCellValue('N' . $j, $row['ScavengingChickensPG'])
		->SetCellValue('O' . $j, $row['ScavengingChickensFarmer'])
		->SetCellValue('P' . $j, $row['DuckPG'])
		->SetCellValue('Q' . $j, $row['DuckFarmer'])
		->SetCellValue('R' . $j, $row['QuailPG'])
		->SetCellValue('S' . $j, $row['QuailFarmer'])
		->SetCellValue('T' . $j, $row['PigeonPG'])
		->SetCellValue('U' . $j, $row['PigeonFarmer'])
		->SetCellValue('V' . $j, $row['RowTotalPG'])
		->SetCellValue('W' . $j, $row["RowTotalFarmer"])


		
		;
		

	$spreadsheet->getActiveSheet()->getStyle('A' . $j . ':A' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('B' . $j . ':B' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('C' . $j . ':C' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('D' . $j . ':D' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('E' . $j . ':E' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('F' . $j . ':F' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('G' . $j . ':G' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('H' . $j . ':H' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('I' . $j . ':I' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('J' . $j . ':J' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('K' . $j . ':K' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('L' . $j . ':L' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('M' . $j . ':M' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('N' . $j . ':N' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('O' . $j . ':O' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('P' . $j . ':P' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('Q' . $j . ':Q' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('R' . $j . ':R' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('S' . $j . ':S' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('T' . $j . ':T' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('U' . $j . ':U' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('V' . $j . ':V' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('W' . $j . ':W' . $j)->applyFromArray($styleThinBlackBorderOutline);


	$spreadsheet->getActiveSheet()->getStyle('A' . $j . ':A' . $j)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
	$spreadsheet->getActiveSheet()->getStyle('B' . $j . ':B' . $j)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
	$spreadsheet->getActiveSheet()->getStyle('C' . $j . ':C' . $j)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
	$spreadsheet->getActiveSheet()->getStyle('D' . $j . ':D' . $j)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
	$spreadsheet->getActiveSheet()->getStyle('E' . $j . ':E' . $j)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
	$spreadsheet->getActiveSheet()->getStyle('F' . $j . ':F' . $j)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
	$spreadsheet->getActiveSheet()->getStyle('G' . $j . ':G' . $j)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
	$spreadsheet->getActiveSheet()->getStyle('H' . $j . ':H' . $j)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
	$spreadsheet->getActiveSheet()->getStyle('I' . $j . ':I' . $j)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
	$spreadsheet->getActiveSheet()->getStyle('J' . $j . ':J' . $j)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
	$spreadsheet->getActiveSheet()->getStyle('K' . $j . ':K' . $j)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
	$spreadsheet->getActiveSheet()->getStyle('L' . $j . ':L' . $j)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);


	$spreadsheet->getActiveSheet()->getStyle('A' . $j . ':A' . $j)->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
	$spreadsheet->getActiveSheet()->getStyle('B' . $j . ':B' . $j)->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
	$spreadsheet->getActiveSheet()->getStyle('C' . $j . ':C' . $j)->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
	$spreadsheet->getActiveSheet()->getStyle('D' . $j . ':D' . $j)->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
	$spreadsheet->getActiveSheet()->getStyle('E' . $j . ':E' . $j)->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
	$spreadsheet->getActiveSheet()->getStyle('F' . $j . ':F' . $j)->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
	$spreadsheet->getActiveSheet()->getStyle('G' . $j . ':G' . $j)->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
	$spreadsheet->getActiveSheet()->getStyle('H' . $j . ':H' . $j)->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
	$spreadsheet->getActiveSheet()->getStyle('I' . $j . ':I' . $j)->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
	$spreadsheet->getActiveSheet()->getStyle('J' . $j . ':J' . $j)->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
	$spreadsheet->getActiveSheet()->getStyle('K' . $j . ':K' . $j)->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
	$spreadsheet->getActiveSheet()->getStyle('L' . $j . ':L' . $j)->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);


	$spreadsheet->getActiveSheet()->getStyle('B' . $j)->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1);
	$spreadsheet->getActiveSheet()->getStyle('B' . $j)->getNumberFormat()->setFormatCode('#,##0');


	$spreadsheet->getActiveSheet()->getStyle('C' . $j)->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1);
	$spreadsheet->getActiveSheet()->getStyle('C' . $j)->getNumberFormat()->setFormatCode('#,##0');


	$spreadsheet->getActiveSheet()->getStyle('D' . $j)->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1);
	$spreadsheet->getActiveSheet()->getStyle('D' . $j)->getNumberFormat()->setFormatCode('#,##0');


	$spreadsheet->getActiveSheet()->getStyle('E' . $j)->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1);
	$spreadsheet->getActiveSheet()->getStyle('E' . $j)->getNumberFormat()->setFormatCode('#,##0');


	$spreadsheet->getActiveSheet()->getStyle('F' . $j)->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1);
	$spreadsheet->getActiveSheet()->getStyle('F' . $j)->getNumberFormat()->setFormatCode('#,##0');


	$spreadsheet->getActiveSheet()->getStyle('G' . $j)->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1);
	$spreadsheet->getActiveSheet()->getStyle('G' . $j)->getNumberFormat()->setFormatCode('#,##0');


	$spreadsheet->getActiveSheet()->getStyle('H' . $j)->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1);
	$spreadsheet->getActiveSheet()->getStyle('H' . $j)->getNumberFormat()->setFormatCode('#,##0');



	$spreadsheet->getActiveSheet()->getStyle('I' . $j)->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1);
	$spreadsheet->getActiveSheet()->getStyle('I' . $j)->getNumberFormat()->setFormatCode('#,##0');


	$spreadsheet->getActiveSheet()->getStyle('J' . $j)->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1);
	$spreadsheet->getActiveSheet()->getStyle('J' . $j)->getNumberFormat()->setFormatCode('#,##0');


	$spreadsheet->getActiveSheet()->getStyle('K' . $j)->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1);
	$spreadsheet->getActiveSheet()->getStyle('K' . $j)->getNumberFormat()->setFormatCode('#,##0');


	$spreadsheet->getActiveSheet()->getStyle('L' . $j)->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1);
	$spreadsheet->getActiveSheet()->getStyle('L' . $j)->getNumberFormat()->setFormatCode('#,##0.0');


	$i++;
	$j++;
}




/* * *********************************** */
/* * ************************************ */

date_default_timezone_set('Africa/Porto-Novo');

$exportTime = date("Y-m-d-His", time());
$writer = new Xlsx($spreadsheet);
$file = 'Division-District-Upazila-wise-PG-and-PG-members-information-' . $exportTime . '.xlsx'; //Save file name
$writer->save('media/' . $file);
header('Location:media/' . $file); //File open location

function cellColor($cells, $color)
{
	global $spreadsheet;

	$spreadsheet->getActiveSheet()->getStyle($cells)->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB($color);
}
