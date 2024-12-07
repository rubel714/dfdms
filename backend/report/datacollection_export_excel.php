<?php

/* Database Connection */
include_once('../env.php');
include_once('../source/api/pdolibs/pdo_lib.php');
include_once('../source/api/pdolibs/function_global.php');

/* include PhpSpreadsheet library */
require("PhpSpreadsheet/vendor/autoload.php");

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


$lan = isset($_REQUEST['lan']) ? $_REQUEST['lan'] : "en_GB";
$menukey = isset($_REQUEST['menukey']) ? $_REQUEST['menukey'] : "";
include_once('../source/api/languages/lang_switcher_custom.php');

$db = new Db();

// echo "<pre>";
// print_r($_REQUEST);
// exit;
$YearId = isset($_REQUEST['YearId']) ? $_REQUEST['YearId'] : 0;
$QuarterId = isset($_REQUEST['QuarterId']) ? $_REQUEST['QuarterId'] : 0;
$DivisionId = (isset($_REQUEST['DivisionId']) && ($_REQUEST['DivisionId'] !='')) ? $_REQUEST['DivisionId'] : 0;
$DistrictId = (isset($_REQUEST['DistrictId']) && ($_REQUEST['DistrictId'] !=''))? $_REQUEST['DistrictId'] : 0;
$UpazilaId = (isset($_REQUEST['UpazilaId']) && ($_REQUEST['UpazilaId'] !=''))? $_REQUEST['UpazilaId'] : 0;
$DataTypeId = isset($_REQUEST['DataTypeId']) ? $_REQUEST['DataTypeId'] : 0;

$QuarterName = isset($_REQUEST['QuarterName']) ? $_REQUEST['QuarterName'] : '';
$DivisionName = isset($_REQUEST['DivisionName']) ? $_REQUEST['DivisionName'] : '';
$DistrictName = isset($_REQUEST['DistrictName']) ? $_REQUEST['DistrictName'] : '';
$UpazilaName = isset($_REQUEST['UpazilaName']) ? $_REQUEST['UpazilaName'] : '';


$filterSubHeader = 'Year: ' . $YearId . ', Quarter: ' . $QuarterName . ', Division: ' . $DivisionName . ', District: ' . $DistrictName . ', Upazila: ' . $UpazilaName;

$ReportTitle = "";
if ($DataTypeId == 1) {
	$ReportTitle = "PG data collection";
} else if ($DataTypeId == 2) {
	$ReportTitle = "Farmers data collection";
} else if ($DataTypeId == 3) {
	$ReportTitle = "Community data collection";
}

$siteTitle = reportsitetitleeng;

$reporttitlelist = explode('<br/>', $siteTitle);
if (count($reporttitlelist) > 1) {
	$reportHeaderList[0] = $reporttitlelist[count($reporttitlelist) - 1];
	for ($h = (count($reporttitlelist) - 2); $h >= 0; $h--) {
		array_unshift($reportHeaderList, $reporttitlelist[$h]);
	}
}



$SurveyId = 0;
$query1 = "SELECT a.SurveyId
		FROM t_datavaluemaster a
		WHERE (a.DivisionId = $DivisionId OR $DivisionId=0)
		AND (a.DistrictId = $DistrictId OR $DistrictId=0)
		AND (a.UpazilaId = $UpazilaId OR $UpazilaId=0)
		AND a.DataTypeId=$DataTypeId
		AND a.YearId = '$YearId'
		AND a.QuarterId = $QuarterId
		ORDER BY a.CreateTs DESC
		limit 0,1;";
	// echo $query1;
	// exit;
$resultdata1 = $db->query($query1);
foreach ($resultdata1 as $rr) {
	/**Get surveyid from first row of data */
	$SurveyId = $rr["SurveyId"];
}


// $ExcelColName = array(
// 	'1' => 'A',
// 	'2' => 'B',
// 	'3' => 'C',
// 	'4' => 'D',
// 	'5' => 'E'
// );

$index = 0;
$i = 0;



$ColSettings = array(
	"SqlField" => ["SERIAL", "FarmerName", "SurveyTitle", "DataCollectionDate", "PGName", "ValueChainName", "UpazilaName", "DataCollectorName", "UserName", "CurrentStatus", "Remarks"],
	"ColName" => ["Sl", "Farmer", "Survey", "Date of Interview", "PG", "Value Chain", "Upazila", "Enumerator", "Entry By", "Status", "Comment"],
	"Alignment" => ["center", "left", "left", "left", "left", "left", "left", "left", "left", "left", "left"],
	"Width" => [10, 20, 22, 15, 22, 12, 12, 12, 12, 17, 20],
);



$query = "SELECT a.`QuestionId`, a.`QuestionCode`, 
CASE WHEN a.`QuestionParentId`>0 THEN (SELECT i.`QuestionName` FROM t_questions i WHERE i.QuestionId=a.`QuestionParentId`) ELSE a.`QuestionName` END QuestionName,
 a.`QuestionType`, a.`IsMandatory`, a.`QuestionParentId`, b.`SortOrder`, 0 SortOrderChild,a.Settings,b.Category
FROM t_questions a
INNER JOIN t_datatype_questions_map b ON a.QuestionId=b.QuestionId
WHERE b.DataTypeId = $DataTypeId
AND b.SurveyId=$SurveyId
AND a.QuestionType != 'MultiOption'
AND a.QuestionType != 'Label'


UNION ALL

SELECT child.`QuestionId`, child.`QuestionCode`, 
CASE WHEN child.`QuestionParentId`>0 THEN (SELECT CONCAT(i.`QuestionName`,' ',child.`QuestionName`) FROM t_questions i WHERE i.QuestionId=child.`QuestionParentId`) ELSE child.`QuestionName` END QuestionName,
 child.`QuestionType`, child.`IsMandatory`, child.`QuestionParentId`, 
(SELECT s.SortOrder FROM t_datatype_questions_map s WHERE s.QuestionId=child.QuestionParentId AND s.SurveyId=$SurveyId) `SortOrder`, 
child.SortOrderChild,child.Settings,m.Category
FROM t_questions AS child
INNER JOIN t_datatype_questions_map AS m ON child.QuestionParentId=m.QuestionId
WHERE child.QuestionParentId != 0 AND m.DataTypeId = $DataTypeId AND m.SurveyId=$SurveyId

ORDER BY SortOrder ASC, SortOrderChild ASC;";

$resultquestion = $db->query($query);
$questionList = array();

$sqlMany = "";

foreach ($resultquestion as $key1 => $row1) {

	$QuestionId = $row1["QuestionId"];
	$questionList[$QuestionId] = $row1;

	$ColSettings["SqlField"][] = "Q__" . $QuestionId; //$row1["QuestionName"];
	$ColSettings["ColName"][] = $row1["QuestionName"];
	$ColSettings["Alignment"][] = "left";
	$ColSettings["Width"][] = 15;


	$sqlMany .= ",(SELECT v.DataValue FROM t_datavalueitems v WHERE a.DataValueMasterId=v.DataValueMasterId AND v.QuestionId=$QuestionId) Q__$QuestionId";
}



$query = "SELECT a.`DataValueMasterId` as id, a.`DivisionId`, a.`DistrictId`, a.`UpazilaId`, a.`PGId`,a.FarmerId,
a.Categories, a.`YearId`, a.`QuarterId`, a.`Remarks`, 
a.`DataCollectorName`, a.`DataCollectionDate`, a.`UserId`,a.BPosted
, concat(a.YearId,' (',e.QuarterName,')') QuarterName, b.DivisionName,c.DistrictName,d.UpazilaName,f.PGName
,a.StatusId,a.DesignationId,a.PhoneNumber,
case when a.StatusId=1 then 'Waiting for Submit'
		when a.StatusId=2 then 'Waiting for Accept'
		when a.StatusId=3 then 'Waiting for Approve'
		when a.StatusId=5 then 'Approved'
		else '' end CurrentStatus,g.ValueChainName,h.UserName,i.SurveyTitle,a.SurveyId,j.FarmerName
		
		$sqlMany

		FROM t_datavaluemaster a
		inner join t_division b on a.DivisionId=b.DivisionId
		inner join t_district c on a.DistrictId=c.DistrictId
		inner join t_upazila d on a.UpazilaId=d.UpazilaId
		inner join t_quarter e on a.QuarterId=e.QuarterId
		inner join t_pg f on a.PGId=f.PGId
		inner join t_valuechain g on a.ValuechainId=g.ValuechainId
		inner join t_users h on a.UserId=h.UserId
		inner join t_survey i on a.SurveyId=i.SurveyId
		left join t_farmer j on a.FarmerId=j.FarmerId
		WHERE (a.DivisionId = $DivisionId OR $DivisionId=0)
		AND (a.DistrictId = $DistrictId OR $DistrictId=0)
		AND (a.UpazilaId = $UpazilaId OR $UpazilaId=0)
		AND a.DataTypeId=$DataTypeId
		AND a.YearId = '$YearId'
		AND a.QuarterId = $QuarterId
		ORDER BY a.CreateTs DESC;";
// echo $query;
// exit;
$resultdata = $db->query($query);








$ExcelColName = array();
for ($na = 0; $na < count($ColSettings["SqlField"]); $na++) {
	$ExcelColName[$na + 1] = generateAlphabet($na);
}






$ColumnCount = count($ColSettings["ColName"]);

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
	// $spreadsheet->getActiveSheet()->mergeCells('C' . $rn . ':K' . $rn);
	$spreadsheet->getActiveSheet()->mergeCells('C' . $rn . ':' . $ExcelColName[$ColumnCount] . $rn);
	$rn++;
}

//$spreadsheet->getActiveSheet()->SetCellValue('C'.$rn, "Farmers Data Collection");
$spreadsheet->getActiveSheet()->SetCellValue('C' . $rn, $ReportTitle);
$spreadsheet->getActiveSheet()->getStyle('C' . $rn)->getFont();
$spreadsheet->getActiveSheet()->getStyle('C' . $rn)->applyFromArray(array('font' => array('size' => '14', 'bold' => true)), 'C' . $rn);
$spreadsheet->getActiveSheet()->getStyle('C' . $rn)->getAlignment()->setHorizontal(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('C' . $rn)->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
// $spreadsheet->getActiveSheet()->mergeCells('C' . $rn . ':K' . $rn);
$spreadsheet->getActiveSheet()->mergeCells('C' . $rn . ':' . $ExcelColName[$ColumnCount] . $rn);
$rn++;
//head - 2


//head - 3
$spreadsheet->getActiveSheet()->SetCellValue('C' . $rn, $filterSubHeader);
$spreadsheet->getActiveSheet()->getStyle('C' . $rn)->getFont();
$spreadsheet->getActiveSheet()->getStyle('C' . $rn)->applyFromArray(array('font' => array('size' => '14', 'bold' => true)), 'C' . $rn);
$spreadsheet->getActiveSheet()->getStyle('C' . $rn)->getAlignment()->setHorizontal(Alignment::VERTICAL_CENTER);
$spreadsheet->getActiveSheet()->getStyle('C' . $rn)->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
// $spreadsheet->getActiveSheet()->mergeCells('C' . $rn . ':K' . $rn);
$spreadsheet->getActiveSheet()->mergeCells('C' . $rn . ':' . $ExcelColName[$ColumnCount] . $rn);
$rn++;


/*Value Set for Cells*/
// $spreadsheet->getActiveSheet()
// 	->SetCellValue('A5', 'Sl')
// 	->SetCellValue('B5', 'Farmer')
// 	->SetCellValue('C5', 'Survey')
// 	->SetCellValue('D5', 'Date of Interview')
// 	->SetCellValue('E5', 'PG')
// 	->SetCellValue('F5', 'Value Chain')
// 	->SetCellValue('G5', 'Upazila')
// 	->SetCellValue('H5', 'Enumerator')
// 	->SetCellValue('I5', 'Entry By')
// 	->SetCellValue('J5', 'Status')
// 	->SetCellValue('K5', 'Comment');

foreach ($ColSettings["ColName"] as $key => $ColName) {

	// $spreadsheet->getActiveSheet()->SetCellValue('A5', 'Sl');
	$spreadsheet->getActiveSheet()->SetCellValue($ExcelColName[$key + 1] . $rn, $ColName);
	$spreadsheet->getActiveSheet()->getStyle($ExcelColName[$key + 1] . $rn)->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), $ExcelColName[$key + 1] . $rn);

	if ($ColSettings["Alignment"][$key] == "center") {
		$spreadsheet->getActiveSheet()->getStyle($ExcelColName[$key + 1] . $rn)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
	} else if ($ColSettings["Alignment"][$key] == "right") {
		$spreadsheet->getActiveSheet()->getStyle($ExcelColName[$key + 1] . $rn)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
	} else {
		$spreadsheet->getActiveSheet()->getStyle($ExcelColName[$key + 1] . $rn)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
	}

	$spreadsheet->getActiveSheet()->getStyle($ExcelColName[$key + 1] . $rn)->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);

	$spreadsheet->getActiveSheet()->getColumnDimension($ExcelColName[$key + 1])->setWidth($ColSettings["Width"][$key]);

	$spreadsheet->getActiveSheet()->getStyle($ExcelColName[$key + 1] . $rn . ':' . $ExcelColName[$key + 1] . $rn)->applyFromArray($styleThinBlackBorderOutline);
}


/*Font Size for Cells*/
//$spreadsheet -> getActiveSheet()->getStyle('A6') -> applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'A6');	
// $spreadsheet->getActiveSheet()->getStyle('A5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'A5');
// $spreadsheet->getActiveSheet()->getStyle('B5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'B5');
// $spreadsheet->getActiveSheet()->getStyle('C5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'C5');
// $spreadsheet->getActiveSheet()->getStyle('D5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'D5');
// $spreadsheet->getActiveSheet()->getStyle('E5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'E5');
// $spreadsheet->getActiveSheet()->getStyle('F5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'F5');
// $spreadsheet->getActiveSheet()->getStyle('G5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'G5');
// $spreadsheet->getActiveSheet()->getStyle('H5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'H5');
// $spreadsheet->getActiveSheet()->getStyle('I5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'I5');
// $spreadsheet->getActiveSheet()->getStyle('J5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'J5');
// $spreadsheet->getActiveSheet()->getStyle('K5')->applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'K5');
// $spreadsheet -> getActiveSheet()->getStyle('L5') -> applyFromArray(array('font' => array('size' => '12', 'bold' => true)), 'L5');

/*Text Alignment Horizontal(HORIZONTAL_LEFT,HORIZONTAL_CENTER,HORIZONTAL_RIGHT)*/
//$spreadsheet -> getActiveSheet()->getStyle('A6') -> getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
// $spreadsheet->getActiveSheet()->getStyle('A5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
// $spreadsheet->getActiveSheet()->getStyle('B5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
// $spreadsheet->getActiveSheet()->getStyle('C5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
// $spreadsheet->getActiveSheet()->getStyle('D5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
// $spreadsheet->getActiveSheet()->getStyle('E5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
// $spreadsheet->getActiveSheet()->getStyle('F5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
// $spreadsheet->getActiveSheet()->getStyle('G5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
// $spreadsheet->getActiveSheet()->getStyle('H5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
// $spreadsheet->getActiveSheet()->getStyle('I5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
// $spreadsheet->getActiveSheet()->getStyle('J5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
// $spreadsheet->getActiveSheet()->getStyle('K5')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
// $spreadsheet -> getActiveSheet()->getStyle('L5') -> getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);

/*Text Alignment Vertical(VERTICAL_TOP,VERTICAL_CENTER,VERTICAL_BOTTOM)*/
//$spreadsheet -> getActiveSheet() -> getStyle('A6')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
// $spreadsheet->getActiveSheet()->getStyle('A5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
// $spreadsheet->getActiveSheet()->getStyle('B5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
// $spreadsheet->getActiveSheet()->getStyle('C5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
// $spreadsheet->getActiveSheet()->getStyle('D5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
// $spreadsheet->getActiveSheet()->getStyle('E5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
// $spreadsheet->getActiveSheet()->getStyle('F5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
// $spreadsheet->getActiveSheet()->getStyle('G5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
// $spreadsheet->getActiveSheet()->getStyle('H5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
// $spreadsheet->getActiveSheet()->getStyle('I5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
// $spreadsheet->getActiveSheet()->getStyle('J5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
// $spreadsheet->getActiveSheet()->getStyle('K5')->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);

/*Width for Cells*/
// $spreadsheet->getActiveSheet()->getColumnDimension('A')->setWidth(10);
// $spreadsheet->getActiveSheet()->getColumnDimension('B')->setWidth(20);
// $spreadsheet->getActiveSheet()->getColumnDimension('C')->setWidth(22);
// $spreadsheet->getActiveSheet()->getColumnDimension('D')->setWidth(15);
// $spreadsheet->getActiveSheet()->getColumnDimension('E')->setWidth(22);
// $spreadsheet->getActiveSheet()->getColumnDimension('F')->setWidth(12);
// $spreadsheet->getActiveSheet()->getColumnDimension('G')->setWidth(12);
// $spreadsheet->getActiveSheet()->getColumnDimension('H')->setWidth(12);
// $spreadsheet->getActiveSheet()->getColumnDimension('I')->setWidth(12);
// $spreadsheet->getActiveSheet()->getColumnDimension('J')->setWidth(17);
// $spreadsheet->getActiveSheet()->getColumnDimension('K')->setWidth(20);

/*Wrap text*/
// $spreadsheet->getActiveSheet()->getStyle('A5')->getAlignment()->setWrapText(true);

/*border color set for cells*/
//$spreadsheet -> getActiveSheet() -> getStyle('A6:A6') -> applyFromArray($styleThinBlackBorderOutline);
// $spreadsheet->getActiveSheet()->getStyle('A5:A5')->applyFromArray($styleThinBlackBorderOutline);
// $spreadsheet->getActiveSheet()->getStyle('B5:B5')->applyFromArray($styleThinBlackBorderOutline);
// $spreadsheet->getActiveSheet()->getStyle('C5:C5')->applyFromArray($styleThinBlackBorderOutline);
// $spreadsheet->getActiveSheet()->getStyle('D5:D5')->applyFromArray($styleThinBlackBorderOutline);
// $spreadsheet->getActiveSheet()->getStyle('E5:E5')->applyFromArray($styleThinBlackBorderOutline);
// $spreadsheet->getActiveSheet()->getStyle('F5:F5')->applyFromArray($styleThinBlackBorderOutline);
// $spreadsheet->getActiveSheet()->getStyle('G5:G5')->applyFromArray($styleThinBlackBorderOutline);
// $spreadsheet->getActiveSheet()->getStyle('H5:H5')->applyFromArray($styleThinBlackBorderOutline);
// $spreadsheet->getActiveSheet()->getStyle('I5:I5')->applyFromArray($styleThinBlackBorderOutline);
// $spreadsheet->getActiveSheet()->getStyle('J5:J5')->applyFromArray($styleThinBlackBorderOutline);
// $spreadsheet->getActiveSheet()->getStyle('K5:K5')->applyFromArray($styleThinBlackBorderOutline);
// $spreadsheet -> getActiveSheet() -> getStyle('L5:L5') -> applyFromArray($styleThinBlackBorderOutline);

$j = 6;
$rn++;

$dataList = array();

foreach ($resultdata as $key => $row) {
	$dataList[] = $row;

	/**Calculate column total */
	// $TotalDairy += $row["Dairy"];
	// $TotalBuffalo += $row["Buffalo"];
	// $TotalBeefFattening += $row["BeefFattening"];
	// $TotalGoat += $row["Goat"];
	// $TotalSheep += $row["Sheep"];
	// $TotalScavengingChickens += $row["ScavengingChickens"];
	// $TotalDuck += $row["Duck"];
	// $TotalQuail += $row["Quail"];
	// $TotalPigeon += $row["Pigeon"];
	// $TotalGrandTotal += $row["GrandTotal"];
}




$sl = 1;


/**Calculate Percentage */
foreach ($dataList as $k => $row) {

	// $spreadsheet->getActiveSheet()
	// 	->SetCellValue('A' . $j, ($key + 1))
	// 	->SetCellValue('B' . $j, $row['FarmerName'])
	// 	->SetCellValue('C' . $j, $row['SurveyTitle'])
	// 	->SetCellValue('D' . $j, $row['DataCollectionDate'])
	// 	->SetCellValue('E' . $j, $row['PGName'])
	// 	->SetCellValue('F' . $j, $row['ValueChainName'])
	// 	->SetCellValue('G' . $j, $row['UpazilaName'])
	// 	->SetCellValue('H' . $j, $row['DataCollectorName'])
	// 	->SetCellValue('I' . $j, $row['UserName'])
	// 	->SetCellValue('J' . $j, $row['CurrentStatus'])
	// 	->SetCellValue('K' . $j, $row['Remarks']);

	//	"SqlField" => ["SERIAL", "FarmerName", "FarmerName", "FarmerName", "FarmerName", "FarmerName", "FarmerName", "FarmerName", "FarmerName", "FarmerName", "FarmerName"],
	foreach ($ColSettings["SqlField"] as $key => $field) {
		if ($field == "SERIAL") {
			$spreadsheet->getActiveSheet()->SetCellValue($ExcelColName[$key + 1] . $rn, $sl);
		} else {
			// $spreadsheet->getActiveSheet()->SetCellValue($ExcelColName[$key + 1] . $rn, $row[$field]);
			$spreadsheet->getActiveSheet()->SetCellValue($ExcelColName[$key + 1] . $rn, formatCellValue($field, $row[$field]));
		}

		$spreadsheet->getActiveSheet()->getStyle($ExcelColName[$key + 1] . $rn . ':' . $ExcelColName[$key + 1] . $rn)->applyFromArray($styleThinBlackBorderOutline);


		if ($ColSettings["Alignment"][$key] == "center") {
			$spreadsheet->getActiveSheet()->getStyle($ExcelColName[$key + 1] . $rn . ':' . $ExcelColName[$key + 1] . $rn)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
		} else if ($ColSettings["Alignment"][$key] == "right") {
			$spreadsheet->getActiveSheet()->getStyle($ExcelColName[$key + 1] . $rn . ':' . $ExcelColName[$key + 1] . $rn)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
		} else {
			$spreadsheet->getActiveSheet()->getStyle($ExcelColName[$key + 1] . $rn . ':' . $ExcelColName[$key + 1] . $rn)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
		}


		$spreadsheet->getActiveSheet()->getStyle($ExcelColName[$key + 1] . $rn . ':' . $ExcelColName[$key + 1] . $rn)->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
	}
	$sl++;
	$rn++;
	// $spreadsheet->getActiveSheet()->getStyle('A' . $j . ':A' . $j)->applyFromArray($styleThinBlackBorderOutline);
	// $spreadsheet->getActiveSheet()->getStyle('B' . $j . ':B' . $j)->applyFromArray($styleThinBlackBorderOutline);


	// $spreadsheet->getActiveSheet()->getStyle('A' . $j . ':A' . $j)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
	// $spreadsheet->getActiveSheet()->getStyle('B' . $j . ':B' . $j)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);


	// $spreadsheet->getActiveSheet()->getStyle('A' . $j . ':A' . $j)->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);
	// $spreadsheet->getActiveSheet()->getStyle('B' . $j . ':B' . $j)->getAlignment()->setVertical(Alignment::VERTICAL_CENTER);

	// $j++;
}






/* * *********************************** */
/* * ************************************ */

// date_default_timezone_set('Africa/Porto-Novo');

$exportTime = date("Y-m-d-His", time());
$writer = new Xlsx($spreadsheet);
$file = 'Data_Collection_' . $exportTime . '.xlsx'; //Save file name
$writer->save('media/' . $file);
header('Location:media/' . $file); //File open location




// $questionList[$QuestionId] = $row1;

function formatCellValue($field, $value)
{
	$retValue = "";
	global $questionList;

	$isQuestion = strpos($field, "__");

	// echo $field;
	// echo "===";
	// echo "---$isQuestion---,";
	if ($isQuestion > 0) {
		// echo "YES=";
		$qids = explode("__", $field);
		$qid = $qids[1];
		$qarr = $questionList[$qid];
		$questionType = $qarr["QuestionType"];

		if ($questionType == "YesNo") {
			if($value){
				$retValue = $value == "true" ? "Yes" : "No";
			}else{
				$retValue = $value;
			}
		} else if ($questionType == "Check") {
			if($value){
				$retValue = $value == "1" ? "Yes" : "No";
			}else{
				$retValue = $value;
			}
		} else {
			$retValue = $value;
		}
	} else {
		$retValue = $value;
	}


	return $retValue;
}




function cellColor($cells, $color)
{
	global $spreadsheet;

	$spreadsheet->getActiveSheet()->getStyle($cells)->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB($color);
}


//0=A,1=B,2=C .........
function generateAlphabet($na)
{
	$sa = "";
	while ($na >= 0) {
		$sa = chr($na % 26 + 65) . $sa;
		$na = floor($na / 26) - 1;
	}
	return $sa;
}
