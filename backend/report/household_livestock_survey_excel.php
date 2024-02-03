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

	$query = "SELECT 
	q.`DivisionName`,r.`DistrictName`,s.`UpazilaName`,
	u.UnionName,
	a.`HouseHoldId`,
	a.`HouseHoldId` id,
	a.`YearId`,
	a.`DivisionId`,
	a.`DistrictId`,
	a.`UpazilaId`,
	a.`UnionId`,
	a.`Ward`,
	a.`Village`,
	a.`FarmerName`,
	a.`FatherName`,
	a.`MotherName`,
	a.`HusbandWifeName`,
	a.`NameOfTheFarm`,
	a.`Phone`,
	a.`Gender`,
	a.`IsDisability`,
	a.`NID`,
	a.`IsPGMember`,
	a.`Latitute`,
	a.`Longitute`,
	a.`CowNative`,
	a.`CowCross`,
	a.`CowBullNative`,
	a.`CowBullCross`,
	a.`CowCalfMaleNative`,
	a.`CowCalfMaleCross`,
	a.`CowCalfFemaleNative`,
	a.`CowCalfFemaleCross`,
	a.`CowMilkProductionNative`,
	a.`CowMilkProductionCross`,
	a.`BuffaloAdultMale`,
	a.`BuffaloAdultFemale`,
	a.`BuffaloCalfMale`,
	a.`BuffaloCalfFemale`,
	a.`BuffaloMilkProduction`,
	a.`GoatAdultMale`,
	a.`GoatAdultFemale`,
	a.`GoatCalfMale`,
	a.`GoatCalfFemale`,
	a.`SheepAdultMale`,
	a.`SheepAdultFemale`,
	a.`SheepCalfMale`,
	a.`SheepCalfFemale`,
	a.`GoatSheepMilkProduction`,
	a.`ChickenNative`,
	a.`ChickenLayer`,
	a.`ChickenSonaliFayoumiCockerelOthers`,
	a.`ChickenBroiler`,
	a.`ChickenEgg`,
	a.`DucksNumber`,
	a.`DucksEgg`,
	a.`PigeonNumber`,
	a.`FamilyMember`,
	a.`LandTotal`,
	a.`LandOwn`,
	a.`LandLeased`,
	a.`DataCollectionDate`,
	a.`DataCollectorName`,
	a.`DesignationId`,
	a.`PhoneNumber`,
	a.`Remarks`,
	a.`UserId`,
	a.`UpdateTs`,
	a.`CreateTs`,
	b.GenderName,
	case when a.IsDisability=1 then 'Yes' else 'No' end IsDisabilityStatus,
	case when a.IsPGMember=1 then 'Yes' else 'No' end IsPGMemberStatus,
	us.UserName, de.DesignationName
	
  FROM
  `t_householdlivestocksurvey` a 
  Inner Join t_gender b ON a.Gender = b.GenderId
  INNER JOIN `t_division` q ON a.`DivisionId`=q.`DivisionId`
	INNER JOIN `t_district` r ON a.`DistrictId`=r.`DistrictId`
	INNER JOIN `t_upazila` s ON a.`UpazilaId`=s.`UpazilaId`
	INNER JOIN `t_union` u ON a.`UnionId`=u.`UnionId`
	INNER JOIN `t_users` us ON a.`UserId`=us.`UserId`
	LEFT JOIN `t_designation` de ON a.`DesignationId`=de.`DesignationId`
  WHERE (a.DivisionId = $DivisionId OR $DivisionId=0)
	AND (a.DistrictId = $DistrictId OR $DistrictId=0)
	AND (a.UpazilaId = $UpazilaId OR $UpazilaId=0)
	AND a.`YearId` = 2024
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
$spreadsheet->getActiveSheet()->SetCellValue('C' . $rn, "Household Livestock Survey 2024");
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
	->SetCellValue('A5', 'Division (বিভাগ)')
	->SetCellValue('B5', 'District (জেলা)')
	->SetCellValue('C5', 'Upazila (উপজেলা)')
	->SetCellValue('D5', 'Union (ইউনিয়ন)')
	->SetCellValue('E5', 'Ward (ওয়ার্ড)')
	->SetCellValue('F5', 'Village (গ্রাম)')
	->SetCellValue('G5', 'Farmer’s Name (নাম)')
	->SetCellValue('H5', 'Father’s Name (পিতার নাম)')
	->SetCellValue('I5', 'Mother’s Name (মাতার নাম)')
	->SetCellValue('J5', 'Husband’s/Wife’s Name (স্বামীর / স্ত্রীর নাম)')
	->SetCellValue('K5', 'Name of the farm (খামারের নাম)')
	->SetCellValue('L5', 'Mobile number (মোবাইল নং)')
	->SetCellValue('M5', 'Gender (জেন্ডার)')
	->SetCellValue('N5', 'Is there any disability (প্রতিবন্ধি কিনা)')
	->SetCellValue('O5', 'NID (জাতীয় পরিচয় পত্র/ ভোটার আইডি কার্ড নম্বর)')
	->SetCellValue('P5', 'Are you the member of a PG under LDDP (আপনি কি LDDP প্রকল্পের আওতাধীন কোনো পিজি\'র সদস্য) ?')
	->SetCellValue('Q5', 'Latitude (অক্ষাংশ)')
	->SetCellValue('R5', 'Longitude (দ্রাঘিমাংশ)')

	->SetCellValue('S5', 'Cow (গাভীর সংখ্যা)')
	->SetCellValue('U5', 'Bull/Castrated Bull (ষাঁড়/বলদ সংখ্যা)')
	->SetCellValue('W5', 'Calf Male (এঁড়ে বাছুর সংখ্যা)')
	->SetCellValue('Y5', 'Calf Female (বকনা বাছুর সংখ্যা)')
	->SetCellValue('AA5', 'Milk Production per day (Liter)/(দৈনিক দুধের পরিমান (লিটার))')

	
	;


	$spreadsheet->getActiveSheet()
	->SetCellValue('A6', '')
	->SetCellValue('B6', '')
	->SetCellValue('C6', '')
	->SetCellValue('D6', '')
	->SetCellValue('E6', '')
	->SetCellValue('F6', '')
	->SetCellValue('G6', '')
	->SetCellValue('H6', '')
	->SetCellValue('I6', '')
	->SetCellValue('J6', '')
	->SetCellValue('K6', '')
	->SetCellValue('L6', '')
	->SetCellValue('M6', '')
	->SetCellValue('N6', '')
	->SetCellValue('O6', '')
	->SetCellValue('P6', '')
	->SetCellValue('Q6', '')
	->SetCellValue('R6', '')
	->SetCellValue('R6', '')
	->SetCellValue('S6', 'Native (দেশি)')
	->SetCellValue('T6', 'Cross (শংকর)')
	->SetCellValue('U6', 'Native (দেশি)')
	->SetCellValue('V6', 'Cross (শংকর)')
	->SetCellValue('W6', 'Native (দেশি)')
	->SetCellValue('X6', 'Cross (শংকর)')
	->SetCellValue('Y6', 'Native (দেশি)')
	->SetCellValue('Z6', 'Cross (শংকর)')
	->SetCellValue('AA6', 'Native (দেশি)')
	->SetCellValue('AB6', 'Cross (শংকর)')

	;


	$spreadsheet->getActiveSheet()->mergeCells('A5:A6');
	$spreadsheet->getActiveSheet()->mergeCells('B5:B6');
	$spreadsheet->getActiveSheet()->mergeCells('C5:C6');
	$spreadsheet->getActiveSheet()->mergeCells('D5:D6');
	$spreadsheet->getActiveSheet()->mergeCells('E5:E6');
	$spreadsheet->getActiveSheet()->mergeCells('F5:F6');
	$spreadsheet->getActiveSheet()->mergeCells('G5:G6');
	$spreadsheet->getActiveSheet()->mergeCells('H5:H6');
	$spreadsheet->getActiveSheet()->mergeCells('I5:I6');
	$spreadsheet->getActiveSheet()->mergeCells('J5:J6');
	$spreadsheet->getActiveSheet()->mergeCells('K5:K6');
	$spreadsheet->getActiveSheet()->mergeCells('L5:L6');
	$spreadsheet->getActiveSheet()->mergeCells('M5:M6');
	$spreadsheet->getActiveSheet()->mergeCells('N5:N6');
	$spreadsheet->getActiveSheet()->mergeCells('O5:O6');
	$spreadsheet->getActiveSheet()->mergeCells('P5:P6');
	$spreadsheet->getActiveSheet()->mergeCells('Q5:Q6');
	$spreadsheet->getActiveSheet()->mergeCells('R5:R6');

	$spreadsheet->getActiveSheet()->mergeCells('S5:T5');
	$spreadsheet->getActiveSheet()->mergeCells('U5:V5');
	$spreadsheet->getActiveSheet()->mergeCells('W5:X5');
	$spreadsheet->getActiveSheet()->mergeCells('Y5:Z5');
	$spreadsheet->getActiveSheet()->mergeCells('AA5:AB5');



	/* $spreadsheet->getActiveSheet()->mergeCells('D5:E5');
	$spreadsheet->getActiveSheet()->mergeCells('F5:G5');
	$spreadsheet->getActiveSheet()->mergeCells('H5:I5');
	$spreadsheet->getActiveSheet()->mergeCells('J5:K5');
	$spreadsheet->getActiveSheet()->mergeCells('L5:M5');
	$spreadsheet->getActiveSheet()->mergeCells('N5:O5');
	$spreadsheet->getActiveSheet()->mergeCells('P5:Q5');
	$spreadsheet->getActiveSheet()->mergeCells('R5:S5');
	$spreadsheet->getActiveSheet()->mergeCells('T5:U5');


	$spreadsheet->getActiveSheet()->mergeCells('V5:V6');
	$spreadsheet->getActiveSheet()->mergeCells('W5:W6'); */

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
$spreadsheet->getActiveSheet()->getStyle('D5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
$spreadsheet->getActiveSheet()->getStyle('E5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
$spreadsheet->getActiveSheet()->getStyle('F5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
$spreadsheet->getActiveSheet()->getStyle('G5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
$spreadsheet->getActiveSheet()->getStyle('H5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
$spreadsheet->getActiveSheet()->getStyle('I5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
$spreadsheet->getActiveSheet()->getStyle('J5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
$spreadsheet->getActiveSheet()->getStyle('K5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
$spreadsheet->getActiveSheet()->getStyle('L5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
$spreadsheet->getActiveSheet()->getStyle('M5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
$spreadsheet->getActiveSheet()->getStyle('N5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
$spreadsheet->getActiveSheet()->getStyle('O5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
$spreadsheet->getActiveSheet()->getStyle('P5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
$spreadsheet->getActiveSheet()->getStyle('Q5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
$spreadsheet->getActiveSheet()->getStyle('R5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);

$spreadsheet->getActiveSheet()->getStyle('S5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

$spreadsheet->getActiveSheet()->getStyle('S6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
$spreadsheet->getActiveSheet()->getStyle('T6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
 

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
$spreadsheet->getActiveSheet()->getStyle('M5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('N5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('O5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('P5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('Q5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('R5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
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

for ($column = 'E'; $column <= 'AZ'; $column++) {
    $spreadsheet->getActiveSheet()->getColumnDimension($column)->setWidth(17);
}

/* for ($column = 'S'; $column <= 'AZ'; $column++) {
    $spreadsheet->getActiveSheet()->getColumnDimension($column)->setWidth(25);
}
 */

 $spreadsheet->getActiveSheet()->getColumnDimension('S')->setWidth(17);
 $spreadsheet->getActiveSheet()->getColumnDimension('T')->setWidth(17);
 $spreadsheet->getActiveSheet()->getColumnDimension('U')->setWidth(17);
 $spreadsheet->getActiveSheet()->getColumnDimension('V')->setWidth(17);
 $spreadsheet->getActiveSheet()->getColumnDimension('W')->setWidth(17);
 $spreadsheet->getActiveSheet()->getColumnDimension('X')->setWidth(17);
 $spreadsheet->getActiveSheet()->getColumnDimension('Y')->setWidth(17);
 $spreadsheet->getActiveSheet()->getColumnDimension('Z')->setWidth(17);
 $spreadsheet->getActiveSheet()->getColumnDimension('AA')->setWidth(17);
 $spreadsheet->getActiveSheet()->getColumnDimension('AB')->setWidth(17);


/*Wrap text*/
$spreadsheet->getActiveSheet()->getStyle('A5')->getAlignment()->setWrapText(true);
$spreadsheet->getActiveSheet()->getStyle('D6:W6')->getAlignment()->setWrapText(true);

/*border color set for cells*/

$spreadsheet->getActiveSheet()->getStyle('A5:A6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('B5:B6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('C5:C6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('D5:D6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('E5:E6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('F5:F6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('G5:G6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('H5:H6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('I5:I6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('J5:J6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('K5:K6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('L5:L6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('M5:M6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('N5:N6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('O5:O6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('P5:P6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('Q5:Q6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('R5:R6')->applyFromArray($styleThinBlackBorderOutline);

$spreadsheet->getActiveSheet()->getStyle('S5:S5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('T5:T5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('U5:U5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('V5:V5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('W5:W5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('X5:X5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('Y5:Y5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('Z5:Z5')->applyFromArray($styleThinBlackBorderOutline);

$spreadsheet->getActiveSheet()->getStyle('S6:S6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('T6:T6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('U6:U6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('V6:V6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('W6:W6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('X6:X6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('Y6:Y6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('Z6:Z6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('AA6:AA6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('AB6:AB6')->applyFromArray($styleThinBlackBorderOutline);

$charList = array('1' => 'A', '2' => 'B', '3' => 'C', '4' => 'D', '5' => 'E', '6' => 'F', '7' => 'G', '8' => 'H', '9' => 'I', '10' => 'J', '11' => 'K', '12' => 'L', '13' => 'M', '14' => 'N', '15' => 'O');

$index = 1;
$rowNo = 10;


$i = 1;
$j = 7;


$dataList = array();



/**Calculate Percentage */
foreach ($resultdata as $key => $row) {
	/* $row["Percentage"] = ($row["GrandTotal"] * 100) / $TotalGrandTotal; */

	$spreadsheet->getActiveSheet()
		->SetCellValue('A' . $j, $row['DivisionName'])
		->SetCellValue('B' . $j, $row['DistrictName'])
		->SetCellValue('C' . $j, $row['UpazilaName'])
		->SetCellValue('D' . $j, $row['UnionName'])
		->SetCellValue('E' . $j, $row['Ward'])
		->SetCellValue('F' . $j, $row['Village'])
		->SetCellValue('G' . $j, $row['FarmerName'])
		->SetCellValue('H' . $j, $row['FatherName'])
		->SetCellValue('I' . $j, $row['MotherName'])
		->SetCellValue('J' . $j, $row['HusbandWifeName'])
		->SetCellValue('K' . $j, $row['NameOfTheFarm'])
		->SetCellValue('L' . $j, $row['Phone'])
		->SetCellValue('M' . $j, $row['GenderName'])
		->SetCellValue('N' . $j, $row['IsDisabilityStatus'])
		->SetCellValue('O' . $j, $row['NID'])
		->SetCellValue('P' . $j, $row['IsPGMemberStatus'])
		->SetCellValue('Q' . $j, $row['Latitute'])
		->SetCellValue('R' . $j, $row['Longitute'])
		->SetCellValue('S' . $j, $row['CowNative'])
		->SetCellValue('T' . $j, $row['CowCross'])
		->SetCellValue('U' . $j, $row['CowBullNative'])
		->SetCellValue('V' . $j, $row['CowBullCross'])
		->SetCellValue('W' . $j, $row['CowCalfMaleNative'])
		->SetCellValue('X' . $j, $row['CowCalfMaleCross'])
		->SetCellValue('Y' . $j, $row['CowCalfFemaleNative'])
		->SetCellValue('Z' . $j, $row['CowCalfFemaleCross'])
		->SetCellValue('AA' . $j, $row['CowMilkProductionNative'])
		->SetCellValue('AB' . $j, $row['CowMilkProductionCross'])

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
	$spreadsheet->getActiveSheet()->getStyle('X' . $j . ':X' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('Y' . $j . ':Y' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('Z' . $j . ':Z' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('AA' . $j . ':AA' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('AB' . $j . ':AB' . $j)->applyFromArray($styleThinBlackBorderOutline);


	$spreadsheet->getActiveSheet()->getStyle('A' . $j . ':A' . $j)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
	$spreadsheet->getActiveSheet()->getStyle('B' . $j . ':B' . $j)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
	$spreadsheet->getActiveSheet()->getStyle('C' . $j . ':C' . $j)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
	$spreadsheet->getActiveSheet()->getStyle('D' . $j . ':D' . $j)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
	$spreadsheet->getActiveSheet()->getStyle('E' . $j . ':E' . $j)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
	$spreadsheet->getActiveSheet()->getStyle('F' . $j . ':F' . $j)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
	$spreadsheet->getActiveSheet()->getStyle('G' . $j . ':G' . $j)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
	$spreadsheet->getActiveSheet()->getStyle('H' . $j . ':H' . $j)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
	$spreadsheet->getActiveSheet()->getStyle('I' . $j . ':I' . $j)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
	$spreadsheet->getActiveSheet()->getStyle('J' . $j . ':J' . $j)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
	$spreadsheet->getActiveSheet()->getStyle('K' . $j . ':K' . $j)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
	$spreadsheet->getActiveSheet()->getStyle('L' . $j . ':L' . $j)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
	$spreadsheet->getActiveSheet()->getStyle('M' . $j . ':M' . $j)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
	$spreadsheet->getActiveSheet()->getStyle('N' . $j . ':N' . $j)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
	$spreadsheet->getActiveSheet()->getStyle('O' . $j . ':O' . $j)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
	$spreadsheet->getActiveSheet()->getStyle('P' . $j . ':P' . $j)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
	$spreadsheet->getActiveSheet()->getStyle('Q' . $j . ':Q' . $j)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
	$spreadsheet->getActiveSheet()->getStyle('R' . $j . ':R' . $j)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);


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



 /* 	$spreadsheet->getActiveSheet()->getStyle('O' . $j)->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1);
	$spreadsheet->getActiveSheet()->getStyle('O' . $j)->getNumberFormat()->setFormatCode('#,##0.0');
 */

	$i++;
	$j++;
}




/* * *********************************** */
/* * ************************************ */

date_default_timezone_set('Africa/Porto-Novo');

$exportTime = date("Y-m-d-His", time());
$writer = new Xlsx($spreadsheet);
$file = 'Household_Livestock_Survey_2024-' . $exportTime . '.xlsx'; //Save file name
$writer->save('media/' . $file);
header('Location:media/' . $file); //File open location

function cellColor($cells, $color)
{
	global $spreadsheet;

	$spreadsheet->getActiveSheet()->getStyle($cells)->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB($color);
}
