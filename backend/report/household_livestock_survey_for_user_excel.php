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
$UserId = isset($_REQUEST['UserId']) ? $_REQUEST['UserId'] : 0;

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
	a.`MilkCow`,
	a.`ChickenSonali`,
	a.`QuailNumber`,
	a.`OtherAnimalNumber`,
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
	WHERE (a.DivisionId = $DivisionId)
	AND (a.DistrictId = $DistrictId)
	AND (a.UpazilaId = $UpazilaId)
	AND a.UserId = $UserId
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
use PhpOffice\PhpSpreadsheet\Cell\DataType;


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
	/* ->SetCellValue('I5', 'Mother’s Name (মাতার নাম)')
	->SetCellValue('J5', 'Husband’s/Wife’s Name (স্বামীর / স্ত্রীর নাম)') */
	->SetCellValue('I5', 'Name of the farm (খামারের নাম)')
	->SetCellValue('J5', 'Mobile number (মোবাইল নং)')
	->SetCellValue('K5', 'Gender (জেন্ডার)')
	/* ->SetCellValue('N5', 'Is there any disability (প্রতিবন্ধি কিনা)') */
	->SetCellValue('L5', 'NID (জাতীয় পরিচয় পত্র/ ভোটার আইডি কার্ড নম্বর)')
	->SetCellValue('M5', 'Are you the member of a PG under LDDP (আপনি কি LDDP প্রকল্পের আওতাধীন কোনো পিজি\'র সদস্য) ?')

	->SetCellValue('N5', 'Number of family members (পরিবারের মোট সদস্য সংখ্যা)')
	->SetCellValue('O5', 'Latitude (অক্ষাংশ)')
	->SetCellValue('P5', 'Longitude (দ্রাঘিমাংশ)')

	->SetCellValue('Q5', 'Cow (গাভীর সংখ্যা)')
	->SetCellValue('S5', 'এখন দুধ দিচ্ছে এমন গাভীর সংখ্যা')
	->SetCellValue('T5', 'Bull/Castrated Bull (ষাঁড়/বলদ সংখ্যা)')
	->SetCellValue('V5', 'Calf Male (এঁড়ে বাছুর সংখ্যা)')
	->SetCellValue('X5', 'Calf Female (বকনা বাছুর সংখ্যা)')
	->SetCellValue('Z5', 'Household/Farm Total (Cows) Milk Production per day (Liter) (দৈনিক দুধের পরিমাণ (লিটার))')
	->SetCellValue('AB5', 'Adult Buffalo (মহিষের সংখ্যা)')
	->SetCellValue('AD5', 'Calf Buffalo (বাছুর মহিষের সংখ্যা)')
	->SetCellValue('AF5', 'Household/Farm Total (Buffalo) Milk Production per day (Liter) (দৈনিক দুধের পরিমাণ (লিটার))')
	->SetCellValue('AG5', 'Adult Goat (ছাগল সংখ্যা)')
	->SetCellValue('AI5', 'Calf (ছাগল বাচ্চার সংখ্যা)')
	->SetCellValue('AK5', 'Adult Sheep (ভেড়ার সংখ্যা)')
	->SetCellValue('AM5', 'Calf (ভেড়া বাচ্চার সংখ্যা)')
	->SetCellValue('AO5', 'Household/Farm Total (Goat) Milk Production per day (Liter) (দৈনিক দুধের পরিমাণ (লিটার))')
	->SetCellValue('AP5', 'Chicken (মুরগির সংখ্যা)')
	->SetCellValue('AU5', 'Household/Farm Total (Chicken) Daily Egg Production (দৈনিক ডিম উৎপাদন)')
	->SetCellValue('AV5', 'Number of Ducks/Swan (হাঁসের/রাজহাঁসের সংখ্যা)')
	->SetCellValue('AW5', 'Household/Farm Total (Duck) Daily Egg Production (দৈনিক ডিম উৎপাদন)')
	->SetCellValue('AX5', 'Number of Pigeon (কবুতরের সংখ্যা)')
	->SetCellValue('AY5', 'Number of Quail (কোয়েলের সংখ্যা)')
	->SetCellValue('AZ5', 'Number of other animals (Pig/Horse) (অন্যান্য প্রাণীর সংখ্যা (শুকর/ঘোড়া))')

	->SetCellValue('BA5', 'Total cultivable land in decimal (মোট চাষ যোগ্য জমির পরিমান (শতাংশ))')
	->SetCellValue('BB5', 'Own land for Fodder cultivation (নিজস্ব ঘাস চাষের জমি (শতাংশ))')
	->SetCellValue('BC5', 'Leased land for fodder cultivation (লিজ নেয়া ঘাস চাষের জমি (শতাংশ))')
	->SetCellValue('BD5', 'Date of Interview')
	->SetCellValue('BE5', 'Name of Enumerator')
	->SetCellValue('BF5', 'Enumerator Designation')
	->SetCellValue('BG5', 'Cell No. of Enumerator')
	->SetCellValue('BH5', 'Enumerator Comment')


	/* 
	
	






	 */
	
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
	->SetCellValue('Q6', 'Native (দেশি)')
	->SetCellValue('R6', 'Cross (শংকর)')
	->SetCellValue('S6', '')
	->SetCellValue('T6', 'Native (দেশি)')
	->SetCellValue('U6', 'Cross (শংকর)')
	->SetCellValue('V6', 'Native (দেশি)')
	->SetCellValue('W6', 'Cross (শংকর)')
	->SetCellValue('X6', 'Native (দেশি)')
	->SetCellValue('Y6', 'Cross (শংকর)')
	->SetCellValue('Z6', 'Native (দেশি)')
	->SetCellValue('AA6', 'Cross (শংকর)')
	->SetCellValue('AB6', 'Male (ষাঁড়)')
	->SetCellValue('AC6', 'Female (স্ত্রী)')
	->SetCellValue('AD6', 'Male (এঁড়ে বাছুর)')
	->SetCellValue('AE6', 'Female (বকনা)')
	->SetCellValue('AF6', '')
	->SetCellValue('AG6', 'Male (পাঁঠা/খাসি)')
	->SetCellValue('AH6', 'Female (ছাগী)')
	->SetCellValue('AI6', 'Male (পুং)')
	->SetCellValue('AJ6', 'Female (স্ত্রী)')
	->SetCellValue('AK6', 'Male (পাঁঠা/খাসি)')
	->SetCellValue('AL6', 'Female(ভেড়ি)')
	->SetCellValue('AM6', 'Male (পুং)')
	->SetCellValue('AN6', 'Female (স্ত্রী)')
	->SetCellValue('AO6', '')

	->SetCellValue('AP6', 'Native (দেশি)')
	->SetCellValue('AQ6', 'Layer (লেয়ার)')
	->SetCellValue('AR6', 'Broiler (ব্রয়লার)')
	->SetCellValue('AS6', 'Sonali (সোনালী)')
	->SetCellValue('AT6', 'Other Poultry (Fayoumi/ Cockerel/ Turkey)( ফাউমি / ককরেল/ টারকি)')
	->SetCellValue('AU6', '')
	->SetCellValue('AV6', '')
	->SetCellValue('AW6', '')
	->SetCellValue('AX6', '')
	->SetCellValue('AY6', '')
	->SetCellValue('AZ6', '')

	->SetCellValue('BA6', '')
	->SetCellValue('BB6', '')
	->SetCellValue('BC6', '')
	->SetCellValue('BD6', '')
	->SetCellValue('BE6', '')
	->SetCellValue('BF6', '')
	->SetCellValue('BG6', '')
	->SetCellValue('BH6', '')

	/* 

	




 */
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
	/* $spreadsheet->getActiveSheet()->mergeCells('Q5:Q6');
	$spreadsheet->getActiveSheet()->mergeCells('R5:R6'); */

	$spreadsheet->getActiveSheet()->mergeCells('Q5:R5');
	$spreadsheet->getActiveSheet()->mergeCells('S5:S6');
	$spreadsheet->getActiveSheet()->mergeCells('T5:U5');
	$spreadsheet->getActiveSheet()->mergeCells('V5:W5');
	$spreadsheet->getActiveSheet()->mergeCells('X5:Y5');
	$spreadsheet->getActiveSheet()->mergeCells('Z5:AA5');
	$spreadsheet->getActiveSheet()->mergeCells('AB5:AC5');
	$spreadsheet->getActiveSheet()->mergeCells('AD5:AE5');
	$spreadsheet->getActiveSheet()->mergeCells('AF5:AF6');
	$spreadsheet->getActiveSheet()->mergeCells('AG5:AH5');
	$spreadsheet->getActiveSheet()->mergeCells('AI5:AJ5');
	$spreadsheet->getActiveSheet()->mergeCells('AK5:AL5');
	$spreadsheet->getActiveSheet()->mergeCells('AM5:AN5');
	$spreadsheet->getActiveSheet()->mergeCells('AO5:AO6');
	$spreadsheet->getActiveSheet()->mergeCells('AP5:AT5');
	$spreadsheet->getActiveSheet()->mergeCells('AU5:AU6');
	$spreadsheet->getActiveSheet()->mergeCells('AV5:AV6');
	$spreadsheet->getActiveSheet()->mergeCells('AW5:AW6');
	$spreadsheet->getActiveSheet()->mergeCells('AX5:AX6');
	$spreadsheet->getActiveSheet()->mergeCells('AY5:AY6');
	$spreadsheet->getActiveSheet()->mergeCells('AZ5:AZ6');

	

	$spreadsheet->getActiveSheet()->mergeCells('BA5:BA6');
	$spreadsheet->getActiveSheet()->mergeCells('BB5:BB6');
	$spreadsheet->getActiveSheet()->mergeCells('BC5:BC6');
	$spreadsheet->getActiveSheet()->mergeCells('BD5:BD6');
	$spreadsheet->getActiveSheet()->mergeCells('BE5:BE6');
	$spreadsheet->getActiveSheet()->mergeCells('BF5:BF6');
	$spreadsheet->getActiveSheet()->mergeCells('BG5:BG6');
	$spreadsheet->getActiveSheet()->mergeCells('BH5:BH6');


	/* 
	

	

 */



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
$spreadsheet->getActiveSheet()->getStyle('X5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'X5');
$spreadsheet->getActiveSheet()->getStyle('Y5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'Y5');
$spreadsheet->getActiveSheet()->getStyle('Z5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'Z5'); 
$spreadsheet->getActiveSheet()->getStyle('AA5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AA5'); 
$spreadsheet->getActiveSheet()->getStyle('AB5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AB5'); 
$spreadsheet->getActiveSheet()->getStyle('AC5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AC5'); 
$spreadsheet->getActiveSheet()->getStyle('AD5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AD5'); 
$spreadsheet->getActiveSheet()->getStyle('AE5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AE5'); 
$spreadsheet->getActiveSheet()->getStyle('AF5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AF5'); 
$spreadsheet->getActiveSheet()->getStyle('AG5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AG5'); 
$spreadsheet->getActiveSheet()->getStyle('AH5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AH5'); 
$spreadsheet->getActiveSheet()->getStyle('AI5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AI5'); 
$spreadsheet->getActiveSheet()->getStyle('AJ5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AJ5'); 
$spreadsheet->getActiveSheet()->getStyle('AK5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AK5'); 
$spreadsheet->getActiveSheet()->getStyle('AL5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AL5'); 
$spreadsheet->getActiveSheet()->getStyle('AM5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AM5'); 
$spreadsheet->getActiveSheet()->getStyle('AN5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AN5'); 
$spreadsheet->getActiveSheet()->getStyle('AO5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AO5'); 
$spreadsheet->getActiveSheet()->getStyle('AP5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AP5'); 
$spreadsheet->getActiveSheet()->getStyle('AQ5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AQ5'); 
$spreadsheet->getActiveSheet()->getStyle('AR5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AR5'); 
$spreadsheet->getActiveSheet()->getStyle('AS5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AS5'); 
$spreadsheet->getActiveSheet()->getStyle('AT5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AT5'); 
$spreadsheet->getActiveSheet()->getStyle('AU5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AU5'); 
$spreadsheet->getActiveSheet()->getStyle('AV5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AV5'); 
$spreadsheet->getActiveSheet()->getStyle('AW5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AW5'); 
$spreadsheet->getActiveSheet()->getStyle('AX5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AX5'); 
$spreadsheet->getActiveSheet()->getStyle('AY5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AY5'); 
$spreadsheet->getActiveSheet()->getStyle('AZ5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AZ5'); 
$spreadsheet->getActiveSheet()->getStyle('BA5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'BA5'); 
$spreadsheet->getActiveSheet()->getStyle('BB5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'BB5'); 
$spreadsheet->getActiveSheet()->getStyle('BC5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'BC5'); 
$spreadsheet->getActiveSheet()->getStyle('BD5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'BD5'); 
$spreadsheet->getActiveSheet()->getStyle('BE5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'BE5'); 
$spreadsheet->getActiveSheet()->getStyle('BF5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'BF5'); 
$spreadsheet->getActiveSheet()->getStyle('BG5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'BG5'); 
$spreadsheet->getActiveSheet()->getStyle('BH5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'BH5'); 




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
$spreadsheet->getActiveSheet()->getStyle('V6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'V6');
$spreadsheet->getActiveSheet()->getStyle('W6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'W6');
$spreadsheet->getActiveSheet()->getStyle('X6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'X6');
$spreadsheet->getActiveSheet()->getStyle('Y6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'Y6');
$spreadsheet->getActiveSheet()->getStyle('Z6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'Z6'); 
$spreadsheet->getActiveSheet()->getStyle('AA6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AA6'); 
$spreadsheet->getActiveSheet()->getStyle('AB6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AB6'); 
$spreadsheet->getActiveSheet()->getStyle('AC6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AC6'); 
$spreadsheet->getActiveSheet()->getStyle('AD6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AD6'); 
$spreadsheet->getActiveSheet()->getStyle('AE6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AE6'); 
$spreadsheet->getActiveSheet()->getStyle('AF6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AF6'); 
$spreadsheet->getActiveSheet()->getStyle('AG6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AG6'); 
$spreadsheet->getActiveSheet()->getStyle('AH6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AH6'); 
$spreadsheet->getActiveSheet()->getStyle('AI6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AI6'); 
$spreadsheet->getActiveSheet()->getStyle('AJ6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AJ6'); 
$spreadsheet->getActiveSheet()->getStyle('AK6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AK6'); 
$spreadsheet->getActiveSheet()->getStyle('AL6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AL6'); 
$spreadsheet->getActiveSheet()->getStyle('AM6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AM6'); 
$spreadsheet->getActiveSheet()->getStyle('AN6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AN6'); 
$spreadsheet->getActiveSheet()->getStyle('AO6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AO6'); 
$spreadsheet->getActiveSheet()->getStyle('AP6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AP6'); 
$spreadsheet->getActiveSheet()->getStyle('AQ6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AQ6'); 
$spreadsheet->getActiveSheet()->getStyle('AR6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AR6'); 
$spreadsheet->getActiveSheet()->getStyle('AS6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AS6'); 
$spreadsheet->getActiveSheet()->getStyle('AT6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AT6'); 
$spreadsheet->getActiveSheet()->getStyle('AU6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AU6'); 
$spreadsheet->getActiveSheet()->getStyle('AV6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AV6'); 
$spreadsheet->getActiveSheet()->getStyle('AW6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AW6'); 
$spreadsheet->getActiveSheet()->getStyle('AX6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AX6'); 
$spreadsheet->getActiveSheet()->getStyle('AY6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AY6'); 
$spreadsheet->getActiveSheet()->getStyle('AZ6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'AZ6'); 
$spreadsheet->getActiveSheet()->getStyle('BA6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'BA6'); 
$spreadsheet->getActiveSheet()->getStyle('BB6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'BB6'); 
$spreadsheet->getActiveSheet()->getStyle('BC6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'BC6'); 
$spreadsheet->getActiveSheet()->getStyle('BD6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'BD6'); 
$spreadsheet->getActiveSheet()->getStyle('BE6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'BE6'); 
$spreadsheet->getActiveSheet()->getStyle('BF6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'BF6'); 
$spreadsheet->getActiveSheet()->getStyle('BG6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'BG6'); 
$spreadsheet->getActiveSheet()->getStyle('BH6')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'BH6'); 


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
$spreadsheet->getActiveSheet()->getStyle('Q5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('R5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

$spreadsheet->getActiveSheet()->getStyle('S5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('S5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('T5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('U5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER); 
$spreadsheet->getActiveSheet()->getStyle('V5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER); 
$spreadsheet->getActiveSheet()->getStyle('W5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER); 
$spreadsheet->getActiveSheet()->getStyle('X5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER); 
$spreadsheet->getActiveSheet()->getStyle('Y5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER); 
$spreadsheet->getActiveSheet()->getStyle('Z5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER); 
$spreadsheet->getActiveSheet()->getStyle('AA5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER); 
$spreadsheet->getActiveSheet()->getStyle('AB5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER); 
$spreadsheet->getActiveSheet()->getStyle('AC5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER); 
$spreadsheet->getActiveSheet()->getStyle('AD5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AE5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AF5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AG5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AH5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AI5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AJ5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AK5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AL5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AM5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AN5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AO5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AP5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AQ5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AR5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AS5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AT5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AU5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AV5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AW5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AX5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AY5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AZ5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('BA5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('BB5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('BC5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('BD5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('BE5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('BF5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('BG5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('BH')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);


$spreadsheet->getActiveSheet()->getStyle('Q6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
$spreadsheet->getActiveSheet()->getStyle('R6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
$spreadsheet->getActiveSheet()->getStyle('S6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
$spreadsheet->getActiveSheet()->getStyle('T6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
$spreadsheet->getActiveSheet()->getStyle('U6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT); 
$spreadsheet->getActiveSheet()->getStyle('V6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT); 
$spreadsheet->getActiveSheet()->getStyle('W6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT); 
$spreadsheet->getActiveSheet()->getStyle('X6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT); 
$spreadsheet->getActiveSheet()->getStyle('Y6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT); 
$spreadsheet->getActiveSheet()->getStyle('Z6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT); 
$spreadsheet->getActiveSheet()->getStyle('AA6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT); 
$spreadsheet->getActiveSheet()->getStyle('AB6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT); 
$spreadsheet->getActiveSheet()->getStyle('AC6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT); 
$spreadsheet->getActiveSheet()->getStyle('AD6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
$spreadsheet->getActiveSheet()->getStyle('AE6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
$spreadsheet->getActiveSheet()->getStyle('AF6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
$spreadsheet->getActiveSheet()->getStyle('AG6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
$spreadsheet->getActiveSheet()->getStyle('AH6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
$spreadsheet->getActiveSheet()->getStyle('AI6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
$spreadsheet->getActiveSheet()->getStyle('AJ6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
$spreadsheet->getActiveSheet()->getStyle('AK6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
$spreadsheet->getActiveSheet()->getStyle('AL6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
$spreadsheet->getActiveSheet()->getStyle('AM6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
$spreadsheet->getActiveSheet()->getStyle('AN6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
$spreadsheet->getActiveSheet()->getStyle('AO6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
$spreadsheet->getActiveSheet()->getStyle('AP6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
$spreadsheet->getActiveSheet()->getStyle('AQ6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
$spreadsheet->getActiveSheet()->getStyle('AR6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
$spreadsheet->getActiveSheet()->getStyle('AS6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
$spreadsheet->getActiveSheet()->getStyle('AT6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
$spreadsheet->getActiveSheet()->getStyle('AU6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
$spreadsheet->getActiveSheet()->getStyle('AV6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
$spreadsheet->getActiveSheet()->getStyle('AW6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
$spreadsheet->getActiveSheet()->getStyle('AX6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
$spreadsheet->getActiveSheet()->getStyle('AY6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
$spreadsheet->getActiveSheet()->getStyle('AZ6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
$spreadsheet->getActiveSheet()->getStyle('BA6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
$spreadsheet->getActiveSheet()->getStyle('BB6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
$spreadsheet->getActiveSheet()->getStyle('BC6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
$spreadsheet->getActiveSheet()->getStyle('BD6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
$spreadsheet->getActiveSheet()->getStyle('BE6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
$spreadsheet->getActiveSheet()->getStyle('BF6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
$spreadsheet->getActiveSheet()->getStyle('BG6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
$spreadsheet->getActiveSheet()->getStyle('BH6')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
 

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
$spreadsheet->getActiveSheet()->getStyle('X5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('Y5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('Z5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AA5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AB5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AC5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AD5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AE5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AF5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AG5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AH5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AI5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AJ5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AK5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AL5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AM5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AN5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AO5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AP5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AQ5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AR5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AS5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AT5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AU5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AV5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AW5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AX5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AY5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AZ5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('BA5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('BB5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('BC5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('BD5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('BE5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('BF5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('BG5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('BH5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);

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
$spreadsheet->getActiveSheet()->getStyle('M6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('N6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('O6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('P6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('Q6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('R6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('S6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('T6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('U6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('V6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('W6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('X6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('Y6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('Z6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AA6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AB6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AC6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AD6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AE6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AF6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AG6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AH6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AI6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AJ6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AK6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AL6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AM6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AN6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AO6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AP6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AQ6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AR6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AS6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AT6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AU6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AV6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AW6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AX6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AY6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('AZ6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('BA6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('BB6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('BC6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('BD6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('BE6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('BF6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('BG6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('BH6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);


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
 $spreadsheet->getActiveSheet()->getColumnDimension('AS')->setWidth(17);
 $spreadsheet->getActiveSheet()->getColumnDimension('AT')->setWidth(17);
 $spreadsheet->getActiveSheet()->getColumnDimension('AU')->setWidth(17);
 $spreadsheet->getActiveSheet()->getColumnDimension('BG')->setWidth(17);
 $spreadsheet->getActiveSheet()->getColumnDimension('HG')->setWidth(23);


/*Wrap text*/
$spreadsheet->getActiveSheet()->getStyle('A5')->getAlignment()->setWrapText(true);
$spreadsheet->getActiveSheet()->getStyle('D6:AAG6')->getAlignment()->setWrapText(true);


$spreadsheet->getActiveSheet()->getStyle('A5:A6')->getAlignment()->setWrapText(true);
$spreadsheet->getActiveSheet()->getStyle('B5:B6')->getAlignment()->setWrapText(true);
$spreadsheet->getActiveSheet()->getStyle('C5:C6')->getAlignment()->setWrapText(true);
$spreadsheet->getActiveSheet()->getStyle('D5:D6')->getAlignment()->setWrapText(true);
$spreadsheet->getActiveSheet()->getStyle('E5:E6')->getAlignment()->setWrapText(true);
$spreadsheet->getActiveSheet()->getStyle('F5:F6')->getAlignment()->setWrapText(true);
$spreadsheet->getActiveSheet()->getStyle('G5:G6')->getAlignment()->setWrapText(true);
$spreadsheet->getActiveSheet()->getStyle('H5:H6')->getAlignment()->setWrapText(true);
$spreadsheet->getActiveSheet()->getStyle('I5:I6')->getAlignment()->setWrapText(true);
$spreadsheet->getActiveSheet()->getStyle('J5:J6')->getAlignment()->setWrapText(true);
$spreadsheet->getActiveSheet()->getStyle('K5:K6')->getAlignment()->setWrapText(true);
$spreadsheet->getActiveSheet()->getStyle('L5:L6')->getAlignment()->setWrapText(true);
$spreadsheet->getActiveSheet()->getStyle('M5:M6')->getAlignment()->setWrapText(true);
$spreadsheet->getActiveSheet()->getStyle('N5:N6')->getAlignment()->setWrapText(true);
$spreadsheet->getActiveSheet()->getStyle('O5:O6')->getAlignment()->setWrapText(true);
$spreadsheet->getActiveSheet()->getStyle('P5:P6')->getAlignment()->setWrapText(true);

$spreadsheet->getActiveSheet()->getStyle('Q5:R5')->getAlignment()->setWrapText(true);
$spreadsheet->getActiveSheet()->getStyle('T5:U5')->getAlignment()->setWrapText(true);
$spreadsheet->getActiveSheet()->getStyle('V5:W5')->getAlignment()->setWrapText(true);
$spreadsheet->getActiveSheet()->getStyle('Z5:AA5')->getAlignment()->setWrapText(true);
$spreadsheet->getActiveSheet()->getStyle('AB5:AC5')->getAlignment()->setWrapText(true);
$spreadsheet->getActiveSheet()->getStyle('AD5:AE5')->getAlignment()->setWrapText(true);
$spreadsheet->getActiveSheet()->getStyle('AF5:AF6')->getAlignment()->setWrapText(true);
$spreadsheet->getActiveSheet()->getStyle('AG5:AH5')->getAlignment()->setWrapText(true);
$spreadsheet->getActiveSheet()->getStyle('AI5:AJ5')->getAlignment()->setWrapText(true);
$spreadsheet->getActiveSheet()->getStyle('AK5:AL5')->getAlignment()->setWrapText(true);
$spreadsheet->getActiveSheet()->getStyle('AM5:AN5')->getAlignment()->setWrapText(true);
$spreadsheet->getActiveSheet()->getStyle('AO5:AO6')->getAlignment()->setWrapText(true);
$spreadsheet->getActiveSheet()->getStyle('AU5:AU6')->getAlignment()->setWrapText(true);
$spreadsheet->getActiveSheet()->getStyle('AV5:AV6')->getAlignment()->setWrapText(true);
$spreadsheet->getActiveSheet()->getStyle('AW5:AW6')->getAlignment()->setWrapText(true);
$spreadsheet->getActiveSheet()->getStyle('AX5:AX6')->getAlignment()->setWrapText(true);
$spreadsheet->getActiveSheet()->getStyle('AY5:AY6')->getAlignment()->setWrapText(true);
$spreadsheet->getActiveSheet()->getStyle('AZ5:AZ6')->getAlignment()->setWrapText(true);
$spreadsheet->getActiveSheet()->getStyle('BA5:BA6')->getAlignment()->setWrapText(true);
$spreadsheet->getActiveSheet()->getStyle('BC5:BC6')->getAlignment()->setWrapText(true);
$spreadsheet->getActiveSheet()->getStyle('BD5:BD6')->getAlignment()->setWrapText(true);
$spreadsheet->getActiveSheet()->getStyle('BE5:BE6')->getAlignment()->setWrapText(true);
$spreadsheet->getActiveSheet()->getStyle('BF5:BF6')->getAlignment()->setWrapText(true);
$spreadsheet->getActiveSheet()->getStyle('BG5:BG6')->getAlignment()->setWrapText(true);
$spreadsheet->getActiveSheet()->getStyle('BH5:BH6')->getAlignment()->setWrapText(true);



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

$spreadsheet->getActiveSheet()->getStyle('Q5:Q5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('R5:R5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('S5:S5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('T5:T5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('U5:U5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('V5:V5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('W5:W5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('X5:X5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('Y5:Y5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('Z5:Z5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('AA5:AA5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('AB5:AB5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('AC5:AC5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('AD5:AD5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('AE5:AE5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('AF5:AF5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('AG5:AG5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('AH5:AH5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('AI5:AI5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('AJ5:AJ5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('AK5:AK5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('AL5:AL5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('AM5:AM5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('AN5:AN5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('AO5:AO5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('AP5:AP5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('AQ5:AQ5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('AR5:AR5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('AS5:AS5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('AT5:AT5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('AU5:AU5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('AV5:AV5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('AW5:AW5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('AX5:AX5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('AY5:AY5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('AZ5:AZ5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('BA5:BA5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('BB5:BB5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('BC5:BC5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('BD5:BD5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('BE5:BE5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('BF5:BF5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('BG5:BG5')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('BH5:BH5')->applyFromArray($styleThinBlackBorderOutline);

$spreadsheet->getActiveSheet()->getStyle('Q6:Q6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('R6:R6')->applyFromArray($styleThinBlackBorderOutline);
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
$spreadsheet->getActiveSheet()->getStyle('AD6:AD6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('AE6:AE6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('AF6:AF6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('AG6:AG6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('AH6:AH6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('AI6:AI6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('AJ6:AJ6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('AK6:AK6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('AL6:AL6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('AM6:AM6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('AN6:AN6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('AO6:AO6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('AP6:AP6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('AQ6:AQ6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('AR6:AR6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('AS6:AS6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('AT6:AT6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('AU6:AU6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('AV6:AV6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('AW6:AW6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('AX6:AX6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('AY6:AY6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('AZ6:AZ6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('BA6:BA6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('BB6:BB6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('BC6:BC6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('BD6:BD6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('BE6:BE6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('BF6:BF6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('BG6:BG6')->applyFromArray($styleThinBlackBorderOutline);
$spreadsheet->getActiveSheet()->getStyle('BH6:BH6')->applyFromArray($styleThinBlackBorderOutline);

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
		/* ->SetCellValue('I' . $j, $row['MotherName'])
		->SetCellValue('J' . $j, $row['HusbandWifeName']) */
		->SetCellValue('I' . $j, $row['NameOfTheFarm'])
		->SetCellValue('J' . $j, $row['Phone'])
		->SetCellValue('K' . $j, $row['GenderName'])
		/* ->SetCellValue('N' . $j, $row['IsDisabilityStatus']) */
		->SetCellValue('L' . $j, $row['NID'])
		->SetCellValue('M' . $j, $row['IsPGMemberStatus'])

		->SetCellValue('N' . $j, $row['FamilyMember']==''?0:$row['FamilyMember'])
		->SetCellValue('O' . $j, $row['Latitute'])
		->SetCellValue('P' . $j, $row['Longitute'])
		->SetCellValue('Q' . $j, $row['CowNative']==''?0:$row['CowNative'])
		->SetCellValue('R' . $j, $row['CowCross']==''?0:$row['CowCross'])
		->SetCellValue('S' . $j, $row['MilkCow']==''?0:$row['MilkCow'])
		->SetCellValue('T' . $j, $row['CowBullNative']==''?0:$row['CowBullNative'])
		->SetCellValue('U' . $j, $row['CowBullCross']==''?0:$row['CowBullCross'])
		->SetCellValue('V' . $j, $row['CowCalfMaleNative']==''?0:$row['CowCalfMaleNative'])
		->SetCellValue('W' . $j, $row['CowCalfMaleCross']==''?0:$row['CowCalfMaleCross'])
		->SetCellValue('X' . $j, $row['CowCalfFemaleNative']==''?0:$row['CowCalfFemaleNative'])
		->SetCellValue('Y' . $j, $row['CowCalfFemaleCross']==''?0:$row['CowCalfFemaleCross'])
		->SetCellValue('Z' . $j, $row['CowMilkProductionNative']==''?0:$row['CowMilkProductionNative'])
		->SetCellValue('AA' . $j, $row['CowMilkProductionCross']==''?0:$row['CowMilkProductionCross'])
		->SetCellValue('AB' . $j, $row['BuffaloAdultMale']==''?0:$row['BuffaloAdultMale'])
		->SetCellValue('AC' . $j, $row['BuffaloAdultFemale']==''?0:$row['BuffaloAdultFemale'])
		->SetCellValue('AD' . $j, $row['BuffaloCalfMale']==''?0:$row['BuffaloCalfMale'])
		->SetCellValue('AE' . $j, $row['BuffaloCalfFemale']==''?0:$row['BuffaloCalfFemale'])
		->SetCellValue('AF' . $j, $row['BuffaloMilkProduction']==''?0:$row['BuffaloMilkProduction'])
		->SetCellValue('AG' . $j, $row['GoatAdultMale']==''?0:$row['GoatAdultMale'])
		->SetCellValue('AH' . $j, $row['GoatAdultFemale']==''?0:$row['GoatAdultFemale'])
		->SetCellValue('AI' . $j, $row['GoatCalfMale']==''?0:$row['GoatCalfMale'])
		->SetCellValue('AJ' . $j, $row['GoatCalfFemale']==''?0:$row['GoatCalfFemale'])
		->SetCellValue('AK' . $j, $row['SheepAdultMale']==''?0:$row['SheepAdultMale'])
		->SetCellValue('AL' . $j, $row['SheepAdultFemale']==''?0:$row['SheepAdultFemale'])
		->SetCellValue('AM' . $j, $row['SheepCalfMale']==''?0:$row['SheepCalfMale'])
		->SetCellValue('AN' . $j, $row['SheepCalfFemale']==''?0:$row['SheepCalfFemale'])
		->SetCellValue('AO' . $j, $row['GoatSheepMilkProduction']==''?0:$row['GoatSheepMilkProduction'])
		->SetCellValue('AP' . $j, $row['ChickenNative']==''?0:$row['ChickenNative'])
		->SetCellValue('AQ' . $j, $row['ChickenLayer']==''?0:$row['ChickenLayer'])
		->SetCellValue('AR' . $j, $row['ChickenBroiler']==''?0:$row['ChickenBroiler'])
		->SetCellValue('AS' . $j, $row['ChickenSonali']==''?0:$row['ChickenSonali'])
		->SetCellValue('AT' . $j, $row['ChickenSonaliFayoumiCockerelOthers']==''?0:$row['ChickenSonaliFayoumiCockerelOthers'])
		->SetCellValue('AU' . $j, $row['ChickenEgg']==''?0:$row['ChickenEgg'])
		->SetCellValue('AV' . $j, $row['DucksNumber']==''?0:$row['DucksNumber'])
		->SetCellValue('AW' . $j, $row['DucksEgg']==''?0:$row['DucksEgg'])
		->SetCellValue('AX' . $j, $row['PigeonNumber']==''?0:$row['PigeonNumber'])
		->SetCellValue('AY' . $j, $row['QuailNumber']==''?0:$row['QuailNumber'])
		->SetCellValue('AZ' . $j, $row['OtherAnimalNumber']==''?0:$row['OtherAnimalNumber'])
		
		->SetCellValue('BA' . $j, $row['LandTotal']==''?0:$row['LandTotal'])
		->SetCellValue('BB' . $j, $row['LandOwn']==''?0:$row['LandOwn'])
		->SetCellValue('BC' . $j, $row['LandLeased']==''?0:$row['LandLeased'])
		->SetCellValue('BD' . $j, $row['DataCollectionDate']==''?'':$row['DataCollectionDate'])
		->SetCellValue('BE' . $j, $row['DataCollectorName']==''?'':$row['DataCollectorName'])
		->SetCellValue('BF' . $j, $row['DesignationName']==''?'':$row['DesignationName'])
		->SetCellValue('BG' . $j, $row['PhoneNumber']==''?'':$row['PhoneNumber'])
		->SetCellValue('BH' . $j, $row['Remarks']==''?'':$row['Remarks'])

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
	$spreadsheet->getActiveSheet()->getStyle('AC' . $j . ':AC' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('AD' . $j . ':AD' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('AE' . $j . ':AE' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('AF' . $j . ':AF' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('AG' . $j . ':AG' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('AH' . $j . ':AH' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('AI' . $j . ':AI' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('AJ' . $j . ':AJ' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('AK' . $j . ':AK' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('AL' . $j . ':AL' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('AM' . $j . ':AM' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('AN' . $j . ':AN' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('AO' . $j . ':AO' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('AP' . $j . ':AP' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('AQ' . $j . ':AQ' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('AR' . $j . ':AR' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('AS' . $j . ':AS' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('AT' . $j . ':AT' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('AU' . $j . ':AU' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('AV' . $j . ':AV' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('AW' . $j . ':AW' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('AX' . $j . ':AX' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('AY' . $j . ':AY' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('AZ' . $j . ':AZ' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('BA' . $j . ':BA' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('BB' . $j . ':BB' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('BC' . $j . ':BC' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('BD' . $j . ':BD' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('BE' . $j . ':BE' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('BF' . $j . ':BF' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('BG' . $j . ':BG' . $j)->applyFromArray($styleThinBlackBorderOutline);
	$spreadsheet->getActiveSheet()->getStyle('BH' . $j . ':BH' . $j)->applyFromArray($styleThinBlackBorderOutline);


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


	$spreadsheet->getActiveSheet()->setCellValueExplicit('L' . $j, $row['NID'], \PhpOffice\PhpSpreadsheet\Cell\DataType::TYPE_STRING);


	/* $spreadsheet->getActiveSheet()->getStyle('L' . $j)->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_NUMBER);
 */
	
	/* $spreadsheet->getActiveSheet()->getStyle('L' . $j . ':L' . $j)->getNumberFormat()->setFormatCode(PHPExcel_Style_NumberFormat::FORMAT_NUMBER);
 */

 /*    $spreadsheet->getActiveSheet()->getStyle('S' . $j)->getNumberFormat()->setFormatCode(NumberFormat::FORMAT_NUMBER_COMMA_SEPARATED1);
	$spreadsheet->getActiveSheet()->getStyle('S' . $j)->getNumberFormat()->setFormatCode('#,##0.0');
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
