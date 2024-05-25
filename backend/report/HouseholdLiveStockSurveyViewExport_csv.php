<?php
// ini_set('max_execution_time', 36000);
// error_reporting(E_ALL);
// ini_set('memory_limit', '5500M');
// ini_set('display_errors', 'On');
// $myfile = fopen("TimeLogXLSX1.txt", "w") or die("Unable to open file!");
// $currdate = "Start Time:".date("Y_m_d_H_i_s");
// fwrite($myfile, $currdate);

/*Database Connection*/
include_once('../env.php');
include_once('../source/api/pdolibs/pdo_lib.php');
$db = new Db();
// $db = new PDO("mysql:host=localhost;dbname=siglrdc_db2","root","",array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
date_default_timezone_set('Africa/Kinshasa');

include_once 'spout/vendor/box/spout/src/Spout/Autoloader/autoload.php';

use Box\Spout\Common\Type;
use Box\Spout\Reader\ReaderFactory;
use Box\Spout\Writer\WriterFactory;
// use Box\Spout\Writer\Style\StyleBuilder;
// use Box\Spout\Writer\Style\Color;
// use Box\Spout\Writer\Style\Border;
// use Box\Spout\Writer\Style\BorderBuilder;

/*include PhpSpreadsheet library*/

$siteTitle = reportsitetitleeng;

$ExportType = 'csv';


$DivisionId = $_REQUEST['DivisionId'] ? $_REQUEST['DivisionId'] : 0;
$DistrictId = $_REQUEST['DistrictId'] ? $_REQUEST['DistrictId'] : 0;
$UpazilaId =  isset($_REQUEST['UpazilaId']) ? $_REQUEST['UpazilaId'] : 0;
$UpazilaId =  $UpazilaId == "" ? 0 : $UpazilaId;

$DivisionName = isset($_REQUEST['DivisionName']) ? $_REQUEST['DivisionName'] : '';
$DistrictName = isset($_REQUEST['DistrictName']) ? $_REQUEST['DistrictName'] : '';
$UpazilaName = isset($_REQUEST['UpazilaName']) ? $_REQUEST['UpazilaName'] : '';
$filterSubHeader = 'Division: ' . $DivisionName . ', District: ' . $DistrictName . ', Upazila: ' . $UpazilaName;


/* if($lan == 'en_GB'){
		$sitetitle = $db->settingsinfo["sitetitleeng"];
	}else if($lan == 'fr_FR'){
		$sitetitle = $db->settingsinfo["sitetitlefr"];
	}else if($lan == 'pt_PT'){
		$sitetitle = $db->settingsinfo["sitetitlept"];
	} */

$exportTime = date("Y-m-d-H-i-s", time());
// $exportFilePath = "Facility-List-$exportTime.xlsx";
$exportFilePath = "Total_Household_Animal_Information-$exportTime." . strtolower($ExportType);
/* if (strtolower($ExportType) == "xlsx") {
	$writer = WriterFactory::create(Type::XLSX);
} else if (strtolower($ExportType) == "csv") {
	$writer = WriterFactory::create(Type::CSV);
} */

$writer = WriterFactory::create(Type::CSV);

// $writer->setDefaultRowStyle($style)->openToFile($existingFilePath);
$writer->openToFile("media/$exportFilePath");


$sql = "SELECT 
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
AND (a.UpazilaId = $UpazilaId OR $UpazilaId=0)
AND a.`YearId` = 2024
ORDER BY q.`DivisionName`, r.`DistrictName`, s.`UpazilaName`, u.UnionName";

/* echo $sql ;
exit;  */

$result = $db->query($sql);

// $writer->addRowWithStyle($singleRow, $style);

$writer->addRow([$siteTitle]);
$writer->addRow(["Household Livestock Survey 2024"]);

$writer->addRow([$filterSubHeader]);

$writer->addRow(
	[
		'Division', 'District', 'Upazila', 'Union', 'Ward', 'Village', 'Farmer’s Name',
		'Father’s Name', 'Name of the farm', 'Mobile number',
		'Gender', 'NID', 'Are you the member of a PG under LDDP (আপনি কি LDDP প্রকল্পের আওতাধীন কোনো পিজি\'র সদস্য) ?', 'Number of family members',
		'Latitude', 'Longitude', 
		'Cow (Native)',
		'Cow (Cross)',
		'এখন দুধ দিচ্ছে এমন গাভীর সংখ্যা', 
		'Bull/Castrated Bull (Native)',
		'Bull/Castrated Bull (Cross)', 
		'Calf Male (Native)', 
		'Calf Male (Cross)',
		'Calf Female (Native)',
		'Calf Female (Cross)',
		'Household/Farm Total (Cows) Milk Production per day (Liter) (Native)', 
		'Household/Farm Total (Cows) Milk Production per day (Liter) (Cross)',
		'Adult Buffalo (Male)',
		'Adult Buffalo (Female)', 
		'Calf Buffalo (Male)', 
		'Calf Buffalo (Female)',
		'Household/Farm Total (Buffalo) Milk Production per day (Liter)', 
		'Adult Goat (Male)',
		'Adult Goat (Female)', 
		'Calf Goat (Male)', 
		'Calf Goat (Female)',
		'Adult Sheep (Male)', 
		'Adult Sheep (Female)', 
		'Calf Sheep (Male)', 
		'Calf Sheep (Female)', 
		'Household/Farm Total (Goat) Milk Production per day (Liter)',
		'Chicken (Native)', 
		'Chicken (Layer)', 
		'Chicken (Broiler)', 
		'Chicken (Sonali)', 
		'Chicken (Other Poultry (Fayoumi/ Cockerel/ Turkey)',
			'Household/Farm Total (Chicken) Daily Egg Production', 
			'Number of Ducks/Goose', 
			'Household/Farm Total (Duck) Daily Egg Production',
			'Number of Pigeon', 
			'Number of Quail', 
			'Number of other animals (Pig/Horse)',
			'Total cultivable land in decimal',
			'Own land for Fodder cultivation',
				'Leased land for fodder cultivation', 
				'User Name',
				'Entry Date Time', 
				'Date of Interview',
				'Name of Enumerator',
				'Enumerator Designation', 
				'Cell No. of Enumerator',
					'Enumerator Comment'

	],

);

$sl = 0;
foreach ($result as $aRow) {
	$writer->addRow([
		$aRow['DivisionName'],
		$aRow['DistrictName'],
		$aRow['UpazilaName'],
		$aRow['UnionName'],
		$aRow['Ward'],
		$aRow['Village'],
		$aRow['FarmerName'],
		$aRow['FatherName'],
		$aRow['NameOfTheFarm'],
		$aRow['Phone'],
		$aRow['GenderName'],
		$aRow['NID'],
		$aRow['IsPGMemberStatus'],
		$aRow['FamilyMember'],
		$aRow['Latitute'],
		$aRow['Longitute'],
		$aRow['CowNative'],
		$aRow['CowCross'],
		$aRow['MilkCow'],
		$aRow['CowBullNative'],
		$aRow['CowBullCross'],
		$aRow['CowCalfMaleNative'],
		$aRow['CowCalfMaleCross'],
		$aRow['CowCalfFemaleNative'],
		$aRow['CowCalfFemaleCross'],
		$aRow['CowMilkProductionNative'],
		$aRow['CowMilkProductionCross'],
		$aRow['BuffaloAdultMale'],
		$aRow['BuffaloAdultFemale'],
		$aRow['BuffaloCalfMale'],
		$aRow['BuffaloCalfFemale'],
		$aRow['BuffaloMilkProduction'],
		$aRow['GoatAdultMale'],
		$aRow['GoatAdultFemale'],
		$aRow['GoatCalfMale'],
		$aRow['GoatCalfFemale'],
		$aRow['SheepAdultMale'],
		$aRow['SheepAdultFemale'],
		$aRow['SheepCalfMale'],
		$aRow['SheepCalfFemale'],
		$aRow['GoatSheepMilkProduction'],
		$aRow['ChickenNative'],
		$aRow['ChickenLayer'],
		$aRow['ChickenBroiler'],
		$aRow['ChickenSonali'],
		$aRow['ChickenSonaliFayoumiCockerelOthers'],
		$aRow['ChickenEgg'],
		$aRow['DucksNumber'],
		$aRow['DucksEgg'],
		$aRow['PigeonNumber'],
		$aRow['QuailNumber'],
		$aRow['OtherAnimalNumber'],
		$aRow['LandTotal'],
		$aRow['LandOwn'],
		$aRow['LandLeased'],
		$aRow['UserName'],
		$aRow['CreateTs'],
		$aRow['DataCollectionDate'],
		$aRow['DataCollectorName'],
		$aRow['DesignationName'],
		$aRow['PhoneNumber'],
		$aRow['Remarks']
	]);

	// $writer->addRowWithStyle($singleRow, $style);
}

$writer->close();
// $currdate = " And End Time:".date("Y_m_d_H_i_s");
// fwrite($myfile, $currdate);
// fclose($myfile);
header("Location:media/$exportFilePath"); //File open location
