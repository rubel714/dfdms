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

	$StartDate =  $_REQUEST['StartDate']?$_REQUEST['StartDate']:"";
	$EndDate =  $_REQUEST['EndDate']?$_REQUEST['EndDate']:"";
	
	/* if($lan == 'en_GB'){
		$sitetitle = $db->settingsinfo["sitetitleeng"];
	}else if($lan == 'fr_FR'){
		$sitetitle = $db->settingsinfo["sitetitlefr"];
	}else if($lan == 'pt_PT'){
		$sitetitle = $db->settingsinfo["sitetitlept"];
	} */
	
	$exportTime = date("Y-m-d-H-i-s", time()); 
	// $exportFilePath = "Facility-List-$exportTime.xlsx";
	$exportFilePath = "Total_Household_Animal_Information-$exportTime.".strtolower($ExportType);
	if(strtolower($ExportType) == "xlsx"){
		$writer = WriterFactory::create(Type::XLSX);
	}
	else if(strtolower($ExportType) == "csv"){
		$writer = WriterFactory::create(Type::CSV);
	}
	// $writer->setDefaultRowStyle($style)->openToFile($existingFilePath);
	$writer->openToFile("media/$exportFilePath");

/*
    $sql = " SELECT q.`DivisionName`,r.`DistrictName`,s.`UpazilaName`,u.UnionName,
	COUNT(a.HouseHoldId) NameOfTheFarmer,
	SUM(case when a.NameOfTheFarm != '' then 1 else 0 end) NameOfTheFarm,
	SUM(CASE WHEN a.`Gender`=1 THEN 1 ELSE 0 END) NumberOfMale,
	SUM(CASE WHEN a.`Gender`=2 THEN 1 ELSE 0 END) NumberOfFemale,
	SUM(CASE WHEN a.`Gender`=5 THEN 1 ELSE 0 END) NumberOfTransgender,
	SUM(CASE WHEN a.`Gender`=3 THEN 1 ELSE 0 END) NumberOfBoth,
	SUM(CASE WHEN a.`Gender`=4 THEN 1 ELSE 0 END) NumberOfOthers,
	SUM(CASE WHEN (a.NID='' OR a.NID IS NULL) THEN 0 ELSE 1 END) NumberOfNID,
	SUM(CASE WHEN a.IsPGMember=1 THEN 1 ELSE 0 END) NumberOfPGMember,

	SUM(a.`CowNative`) CowNative,SUM(a.`CowCross`) CowCross,SUM(a.`MilkCow`) MilkCow,
	SUM(a.`CowBullNative`) CowBullNative,SUM(a.`CowBullCross`) CowBullCross,
	SUM(a.`CowCalfMaleNative`) CowCalfMaleNative,SUM(a.`CowCalfMaleCross`) CowCalfMaleCross,
	SUM(a.`CowCalfFemaleNative`) CowCalfFemaleNative,SUM(a.`CowCalfFemaleCross`) CowCalfFemaleCross,
	SUM(a.`CowMilkProductionNative`) CowMilkProductionNative,SUM(a.`CowMilkProductionCross`) CowMilkProductionCross,
	SUM(a.`BuffaloAdultMale`) BuffaloAdultMale,SUM(a.`BuffaloAdultFemale`) BuffaloAdultFemale,
	SUM(a.`BuffaloCalfMale`) BuffaloCalfMale,SUM(a.`BuffaloCalfFemale`) BuffaloCalfFemale, 
	SUM(a.`BuffaloMilkProduction`) BuffaloMilkProduction, SUM(a.`GoatAdultMale`) GoatAdultMale, 
	SUM(a.`GoatAdultFemale`) GoatAdultFemale,SUM(a.`GoatCalfMale`) GoatCalfMale, 
	SUM(a.`GoatCalfFemale`) GoatCalfFemale, SUM(a.`SheepAdultMale`) SheepAdultMale, 
	SUM(a.`SheepAdultFemale`) SheepAdultFemale, SUM(a.`SheepCalfMale`) SheepCalfMale,
	SUM(a.`SheepCalfFemale`) SheepCalfFemale, SUM(a.`GoatSheepMilkProduction`) GoatSheepMilkProduction,
	SUM(a.`ChickenNative`) ChickenNative,SUM(a.`ChickenLayer`) ChickenLayer, SUM(a.`ChickenBroiler`) ChickenBroiler,
	SUM(a.`ChickenSonali`) ChickenSonali,
	SUM(a.`ChickenSonaliFayoumiCockerelOthers`) ChickenSonaliFayoumiCockerelOthers, SUM(a.`ChickenEgg`) ChickenEgg,	
	SUM(a.`DucksNumber`) DucksNumber,SUM(a.`DucksEgg`) DucksEgg,SUM(a.`PigeonNumber`) PigeonNumber,
	SUM(a.`QuailNumber`) QuailNumber,SUM(a.`OtherAnimalNumber`) OtherAnimalNumber,SUM(a.`LandTotal`) LandTotal,
	SUM(a.`LandOwn`) LandOwn,SUM(a.`LandLeased`) LandLeased

  FROM `t_householdlivestocksurvey` a 
	INNER JOIN t_gender b ON a.Gender = b.GenderId
	INNER JOIN `t_division` q ON a.`DivisionId`=q.`DivisionId`
	INNER JOIN `t_district` r ON a.`DistrictId`=r.`DistrictId`
	INNER JOIN `t_upazila` s ON a.`UpazilaId`=s.`UpazilaId`
	INNER JOIN `t_union` u ON a.`UnionId`=u.`UnionId`
	LEFT JOIN `t_designation` de ON a.`DesignationId`=de.`DesignationId`
	WHERE a.`DataCollectionDate` BETWEEN '$StartDate' AND '$EndDate'
	AND a.`YearId` = 2024
	GROUP BY q.`DivisionName`,r.`DistrictName`,s.`UpazilaName`,u.UnionName
	limit 0,10";	
*/
$sql = "SELECT q.`DivisionName`,r.`DistrictName`,s.`UpazilaName`,u.UnionName,

t.NameOfTheFarmer,
t.NameOfTheFarm,
t.FamilyMember,
t.NumberOfMale,
t.NumberOfFemale,
t.NumberOfTransgender,
t.NumberOfBoth,
t.NumberOfOthers,
t.NumberOfNID,
t.NumberOfPGMember,

t.CowNative,t.CowCross,t.MilkCow,
t.CowBullNative,t.CowBullCross,
t.CowCalfMaleNative,t.CowCalfMaleCross,
t.CowCalfFemaleNative,t.CowCalfFemaleCross,
t.CowMilkProductionNative,t.CowMilkProductionCross,
t.BuffaloAdultMale,t.BuffaloAdultFemale,
t.BuffaloCalfMale,t.BuffaloCalfFemale, 
t.BuffaloMilkProduction,t.GoatAdultMale, 
t.GoatAdultFemale,t.GoatCalfMale, 
t.GoatCalfFemale,t.SheepAdultMale, 
t.SheepAdultFemale,t.SheepCalfMale,
t.SheepCalfFemale,t.GoatSheepMilkProduction,
t.ChickenNative,t.ChickenLayer,t.ChickenBroiler,
t.ChickenSonali,
t.ChickenSonaliFayoumiCockerelOthers, t.ChickenEgg,	
t.DucksNumber,t.DucksEgg,t.PigeonNumber,
t.QuailNumber,t.OtherAnimalNumber,t.LandTotal,
t.LandOwn,t.LandLeased FROM



(SELECT a.YearId,a.`DivisionId`,a.`DistrictId`,a.`UpazilaId`,a.`UnionId`,

	COUNT(a.HouseHoldId) NameOfTheFarmer,
	SUM(CASE WHEN a.NameOfTheFarm != '' THEN 1 ELSE 0 END) NameOfTheFarm,
	SUM(a.FamilyMember) FamilyMember,
	SUM(CASE WHEN a.`Gender`=1 THEN 1 ELSE 0 END) NumberOfMale,
	SUM(CASE WHEN a.`Gender`=2 THEN 1 ELSE 0 END) NumberOfFemale,
	SUM(CASE WHEN a.`Gender`=5 THEN 1 ELSE 0 END) NumberOfTransgender,
	SUM(CASE WHEN a.`Gender`=3 THEN 1 ELSE 0 END) NumberOfBoth,
	SUM(CASE WHEN a.`Gender`=4 THEN 1 ELSE 0 END) NumberOfOthers,
	SUM(CASE WHEN (a.NID='' OR a.NID IS NULL) THEN 0 ELSE 1 END) NumberOfNID,
	SUM(CASE WHEN a.IsPGMember=1 THEN 1 ELSE 0 END) NumberOfPGMember,

	SUM(a.`CowNative`) CowNative,SUM(a.`CowCross`) CowCross,SUM(a.`MilkCow`) MilkCow,
	SUM(a.`CowBullNative`) CowBullNative,SUM(a.`CowBullCross`) CowBullCross,
	SUM(a.`CowCalfMaleNative`) CowCalfMaleNative,SUM(a.`CowCalfMaleCross`) CowCalfMaleCross,
	SUM(a.`CowCalfFemaleNative`) CowCalfFemaleNative,SUM(a.`CowCalfFemaleCross`) CowCalfFemaleCross,
	SUM(a.`CowMilkProductionNative`) CowMilkProductionNative,SUM(a.`CowMilkProductionCross`) CowMilkProductionCross,
	SUM(a.`BuffaloAdultMale`) BuffaloAdultMale,SUM(a.`BuffaloAdultFemale`) BuffaloAdultFemale,
	SUM(a.`BuffaloCalfMale`) BuffaloCalfMale,SUM(a.`BuffaloCalfFemale`) BuffaloCalfFemale, 
	SUM(a.`BuffaloMilkProduction`) BuffaloMilkProduction, SUM(a.`GoatAdultMale`) GoatAdultMale, 
	SUM(a.`GoatAdultFemale`) GoatAdultFemale,SUM(a.`GoatCalfMale`) GoatCalfMale, 
	SUM(a.`GoatCalfFemale`) GoatCalfFemale, SUM(a.`SheepAdultMale`) SheepAdultMale, 
	SUM(a.`SheepAdultFemale`) SheepAdultFemale, SUM(a.`SheepCalfMale`) SheepCalfMale,
	SUM(a.`SheepCalfFemale`) SheepCalfFemale, SUM(a.`GoatSheepMilkProduction`) GoatSheepMilkProduction,
	SUM(a.`ChickenNative`) ChickenNative,SUM(a.`ChickenLayer`) ChickenLayer, SUM(a.`ChickenBroiler`) ChickenBroiler,
	SUM(a.`ChickenSonali`) ChickenSonali,
	SUM(a.`ChickenSonaliFayoumiCockerelOthers`) ChickenSonaliFayoumiCockerelOthers, SUM(a.`ChickenEgg`) ChickenEgg,	
	SUM(a.`DucksNumber`) DucksNumber,SUM(a.`DucksEgg`) DucksEgg,SUM(a.`PigeonNumber`) PigeonNumber,
	SUM(a.`QuailNumber`) QuailNumber,SUM(a.`OtherAnimalNumber`) OtherAnimalNumber,SUM(a.`LandTotal`) LandTotal,
	SUM(a.`LandOwn`) LandOwn,SUM(a.`LandLeased`) LandLeased

  FROM `t_householdlivestocksurvey` a 

  WHERE a.`DataCollectionDate` BETWEEN '$StartDate' AND '$EndDate'
  GROUP BY a.YearId,a.`DivisionId`,a.`DistrictId`,a.`UpazilaId`,a.`UnionId`) t

INNER JOIN `t_division` q ON t.`DivisionId`=q.`DivisionId`
INNER JOIN `t_district` r ON t.`DistrictId`=r.`DistrictId`
INNER JOIN `t_upazila` s ON t.`UpazilaId`=s.`UpazilaId`
INNER JOIN `t_union` u ON t.`UnionId`=u.`UnionId`";



	$result = $db->query($sql);
	
	// $writer->addRowWithStyle($singleRow, $style);

	$filterSubHeader = "From Date: ".$StartDate. ", To Date: ".$EndDate;

	$writer->addRow([$siteTitle]);
	$writer->addRow(["Total Household Animal Information"]);

	$writer->addRow([$filterSubHeader]);

	$writer->addRow(['Division','District','Upazila','Union/Pourashava','Total Number of Farmers','Total Number of Farm','Family Member',
	'Total Number of Male','Total Number of Female','Total Number of Hijra',
	'Total Number of Male-Female','Total Number of Others','Total Number of NID','Total Number of PG Member',
	'Cow (Native)','Cow (Cross)', 'এখন দুধ দিচ্ছে এমন গাভীর সংখ্যা', 'Bull/Castrated Bull (Native)', 'Bull/Castrated Bull (Cross)', 'Calf Male (Native)', 'Calf Male (Cross)', 'Calf Female (Native)', 'Calf Female (Cross)','Household/Farm Total (Cows) Milk Production per day (Liter) (Native)','Household/Farm Total (Cows) Milk Production per day (Liter) (Cross)','Adult Buffalo (Male)','Adult Buffalo (Female)', 'Calf Buffalo (Male)', 'Calf Buffalo (Female)', 'Household/Farm Total (Buffalo) Milk Production per day (Liter)','Adult Goat (Male)','Adult Goat (Female)', 'Calf Goat (Male)', 'Calf Goat (Female)','Adult Sheep (Male)','Adult Sheep (Female)', 'Calf Sheep (Male)', 'Calf Sheep (Female)','Household/Farm Total (Goat) Milk Production per day (Liter)','Chicken (Native)','Chicken (Layer)','Chicken (Broiler)','Chicken (Sonali)','Chicken (Other Poultry (Fayoumi/ Cockerel/ Turkey)','Household/Farm Total (Chicken) Daily Egg Production','Number of Ducks/Goose','Household/Farm Total (Duck) Daily Egg Production','Number of Pigeon','Number of Quail','Number of other animals (Pig/Horse)','Total cultivable land in decimal','Own land for Fodder cultivation','Leased land for fodder cultivation']);
	
	$sl = 0;
	foreach($result as $aRow){
		$writer->addRow([$aRow['DivisionName'],
		$aRow['DistrictName'],
		$aRow['UpazilaName'],
		$aRow['UnionName'],
		$aRow['NameOfTheFarmer'],
		$aRow['NameOfTheFarm'],
		$aRow['FamilyMember'],
		$aRow['NumberOfMale'],
		$aRow['NumberOfFemale'],
		$aRow['NumberOfTransgender'],
		$aRow['NumberOfBoth'],
		$aRow['NumberOfOthers'],
		$aRow['NumberOfNID'],
		$aRow['NumberOfPGMember'],
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
		$aRow['LandLeased']
	]);

	// $writer->addRowWithStyle($singleRow, $style);
	}

	$writer->close();
	// $currdate = " And End Time:".date("Y_m_d_H_i_s");
	// fwrite($myfile, $currdate);
	// fclose($myfile);
	header("Location:media/$exportFilePath"); //File open location

	
?>