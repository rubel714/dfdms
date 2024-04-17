<?php

$task = '';
if(isset($data->action)) {
	$task = trim($data->action);
}

switch($task){
	
	case "getDataList":
		$returnData = getDataList($data);
	break;

	case "getGenderwisePGMemberDataList":
		$returnData = getGenderwisePGMemberDataList($data);
	break;
	

	default :
		echo "{failure:true}";
		break;
}

function getDataList($data){

	try{
		$dbh = new Db();
		$CurrentDate = date('d-M-Y');

		$TotalFamilyMember = 0;
		$TotalCowNative = 0;
		$CowCross = 0;
		$MilkCow = 0;
		$CowBullNative = 0;
		$CowBullCross = 0;
		$TotalHouseHold = 0;
		$CowCalfMaleNative = 0;
		$CowCalfMaleCross = 0;
		$CowCalfFemaleNative = 0;
		$CowCalfFemaleCross = 0;
		$CowMilkProductionNative = 0;
		$CowMilkProductionCross = 0;
		$BuffaloAdultMale = 0;
		$BuffaloAdultFemale = 0;
		$BuffaloCalfMale = 0;
		$BuffaloCalfFemale = 0;
		$BuffaloMilkProduction = 0;
		$GoatAdultMale = 0;
		$GoatAdultFemale = 0;
		$GoatCalfMale = 0;
		$GoatCalfFemale = 0;
		$SheepAdultMale = 0;
		$SheepCalfMale = 0;
		$SheepCalfFemale = 0;
		$GoatSheepMilkProduction = 0;
		$ChickenNative = 0;
		$ChickenLayer = 0;
		$ChickenBroiler = 0;
		$ChickenSonali = 0;
		$ChickenSonaliFayoumiCockerelOthers = 0;
		$ChickenEgg = 0;
		$DucksNumber = 0;
		$DucksEgg = 0;
		$PigeonNumber = 0;
		$QuailNumber = 0;
		$OtherAnimalNumber = 0;
		$LandTotal = 0;
		$LandOwn = 0;
		$LandLeased = 0;
		$IndividualFarmers = 0;
		$TotalFarms = 0;

		$query = "SELECT COUNT(f.`HouseHoldId`) AS TotalHouseHold FROM `t_householdlivestocksurvey` f;";
		$resultdata = $dbh->query($query);
		foreach ($resultdata as $key => $row) {
			$TotalHouseHold = $row["TotalHouseHold"];
		}

		$query = "SELECT SUM(f.`FamilyMember`) AS TotalFamilyMember, 
		SUM(CASE WHEN IFNULL(f.`NameOfTheFarm`,'') = '' THEN 1 ELSE 0 END) AS IndividualFarmers,
        COUNT(CASE WHEN IFNULL(f.`NameOfTheFarm`,'') != '' THEN f.`NameOfTheFarm` END) AS TotalFarms,
		SUM(f.`CowNative`) AS TotalCowNative,
		SUM(f.`CowCross`) AS CowCross,
		SUM(f.`MilkCow`) AS MilkCow,
		SUM(f.`CowBullNative`) AS CowBullNative,
		SUM(f.`CowBullCross`) AS CowBullCross,
		SUM(f.`CowCalfMaleNative`) AS CowCalfMaleNative,
		SUM(f.`CowCalfMaleCross`) AS CowCalfMaleCross,
		SUM(f.`CowCalfFemaleNative`) AS CowCalfFemaleNative,
		SUM(f.`CowCalfFemaleCross`) AS CowCalfFemaleCross,
		SUM(f.`CowMilkProductionNative`) AS CowMilkProductionNative,
		SUM(f.`CowMilkProductionCross`) AS CowMilkProductionCross,
		SUM(f.`BuffaloAdultMale`) AS BuffaloAdultMale,
		SUM(f.`BuffaloAdultFemale`) AS BuffaloAdultFemale,
		SUM(f.`BuffaloCalfMale`) AS BuffaloCalfMale,
		SUM(f.`BuffaloCalfFemale`) AS BuffaloCalfFemale,
		SUM(f.`BuffaloMilkProduction`) AS BuffaloMilkProduction,
		SUM(f.`GoatAdultMale`) AS GoatAdultMale,
		SUM(f.`GoatAdultFemale`) AS GoatAdultFemale,
		SUM(f.`GoatCalfMale`) AS GoatCalfMale,
		SUM(f.`GoatCalfFemale`) AS GoatCalfFemale,
		SUM(f.`SheepAdultMale`) AS SheepAdultMale,
		SUM(f.`SheepAdultFemale`) AS SheepAdultFemale,
		SUM(f.`SheepCalfMale`) AS SheepCalfMale,
		SUM(f.`SheepCalfFemale`) AS SheepCalfFemale,
		SUM(f.`GoatSheepMilkProduction`) AS GoatSheepMilkProduction,
		SUM(f.`ChickenNative`) AS ChickenNative,
		SUM(f.`ChickenLayer`) AS ChickenLayer,
		SUM(f.`ChickenBroiler`) AS ChickenBroiler,
		SUM(f.`ChickenSonali`) AS ChickenSonali,
		SUM(f.`ChickenSonaliFayoumiCockerelOthers`) AS ChickenSonaliFayoumiCockerelOthers,
		SUM(f.`ChickenEgg`) AS ChickenEgg,
		SUM(f.`DucksNumber`) AS DucksNumber,
		SUM(f.`DucksEgg`) AS DucksEgg,
		SUM(f.`PigeonNumber`) AS PigeonNumber,
		SUM(f.`QuailNumber`) AS QuailNumber,
		SUM(f.`OtherAnimalNumber`) AS OtherAnimalNumber,
		SUM(f.`LandTotal`) AS LandTotal,
		SUM(f.`LandOwn`) AS LandOwn,
		SUM(f.`LandLeased`) AS LandLeased

		FROM `t_householdlivestocksurvey` f;";
		$resultdata = $dbh->query($query);
		foreach ($resultdata as $key => $row) {
			$IndividualFarmers = $row["IndividualFarmers"];
			$TotalFarms = $row["TotalFarms"];
			$TotalFamilyMember = $row["TotalFamilyMember"];
			$TotalCowNative = $row["TotalCowNative"];
			$CowCross = $row["CowCross"];
			$MilkCow = $row["MilkCow"];
			$CowBullNative = $row["CowBullNative"];
			$CowBullCross = $row["CowBullCross"];
			$CowCalfMaleNative = $row["CowCalfMaleNative"];
			$CowCalfMaleCross = $row["CowCalfMaleCross"];
			$CowCalfFemaleNative = $row["CowCalfFemaleNative"];
			$CowCalfFemaleCross = $row["CowCalfFemaleCross"];
			$CowMilkProductionNative = $row["CowMilkProductionNative"];
			$CowMilkProductionCross = $row["CowMilkProductionCross"];
			$BuffaloAdultMale = $row["BuffaloAdultMale"];
			$BuffaloAdultFemale = $row["BuffaloAdultFemale"];
			$BuffaloCalfMale = $row["BuffaloCalfMale"];
			$BuffaloCalfFemale = $row["BuffaloCalfFemale"];
			$BuffaloMilkProduction = $row["BuffaloMilkProduction"];
			$GoatAdultMale = $row["GoatAdultMale"];
			$GoatAdultFemale = $row["GoatAdultFemale"];
			$GoatCalfMale = $row["GoatCalfMale"];
			$GoatCalfFemale = $row["GoatCalfFemale"];
			$SheepAdultMale = $row["SheepAdultMale"];
			$SheepAdultFemale = $row["SheepAdultFemale"];
			$SheepCalfMale = $row["SheepCalfMale"];
			$SheepCalfFemale = $row["SheepCalfFemale"];
			$GoatSheepMilkProduction = $row["GoatSheepMilkProduction"];
			$ChickenNative = $row["ChickenNative"];
			$ChickenLayer = $row["ChickenLayer"];
			$ChickenBroiler = $row["ChickenBroiler"];
			$ChickenSonali = $row["ChickenSonali"];
			$ChickenSonaliFayoumiCockerelOthers = $row["ChickenSonaliFayoumiCockerelOthers"];
			$ChickenEgg = $row["ChickenEgg"];
			$DucksNumber = $row["DucksNumber"];
			$DucksEgg = $row["DucksEgg"];
			$PigeonNumber = $row["PigeonNumber"];
			$QuailNumber = $row["QuailNumber"];
			$OtherAnimalNumber = $row["OtherAnimalNumber"];
			$LandTotal = $row["LandTotal"];
			$LandOwn = $row["LandOwn"];
			$LandLeased = $row["LandLeased"];
		}

	
	
		$dataList = array("TotalFamilyMember"=>$TotalFamilyMember,
		"IndividualFarmers"=>$IndividualFarmers,
		"TotalFarms"=>$TotalFarms,
		"TotalHouseHold"=>$TotalHouseHold,
		"TotalCowNative"=>$TotalCowNative,
		"CowCross"=>$CowCross,
		"MilkCow"=>$MilkCow,
		"CowBullNative"=>$CowBullNative,
		"CowBullCross"=>$CowBullCross,
		"CowCalfMaleNative"=>$CowCalfMaleNative,
		"CowCalfMaleCross"=>$CowCalfMaleCross,
		"CowCalfFemaleNative"=>$CowCalfFemaleNative,
		"CowCalfFemaleCross"=>$CowCalfFemaleCross,
		"CowMilkProductionNative"=>$CowMilkProductionNative,
		"CowMilkProductionCross"=>$CowMilkProductionCross,
		"BuffaloAdultMale"=>$BuffaloAdultMale,
		"BuffaloAdultFemale"=>$BuffaloAdultFemale,
		"BuffaloCalfMale"=>$BuffaloCalfMale,
		"BuffaloCalfFemale"=>$BuffaloCalfFemale,
		"BuffaloMilkProduction"=>$BuffaloMilkProduction,
		"GoatAdultMale"=>$GoatAdultMale,
		"GoatAdultFemale"=>$GoatAdultFemale,
		"GoatCalfMale"=>$GoatCalfMale,
		"GoatCalfFemale"=>$GoatCalfFemale,
		"SheepAdultMale"=>$SheepAdultMale,
		"SheepAdultFemale"=>$SheepAdultFemale,
		"SheepCalfMale"=>$SheepCalfMale,
		"SheepCalfFemale"=>$SheepCalfFemale,
		"GoatSheepMilkProduction"=>$GoatSheepMilkProduction,
		"ChickenNative"=>$ChickenNative,
		"ChickenLayer"=>$ChickenLayer,
		"ChickenBroiler"=>$ChickenBroiler,
		"ChickenSonali"=>$ChickenSonali,
		"ChickenSonaliFayoumiCockerelOthers"=>$ChickenSonaliFayoumiCockerelOthers,
		"ChickenEgg"=>$ChickenEgg,
		"DucksNumber"=>$DucksNumber,
		"DucksEgg"=>$DucksEgg,
		"PigeonNumber"=>$PigeonNumber,
		"QuailNumber"=>$QuailNumber,
		"OtherAnimalNumber"=>$OtherAnimalNumber,
		"LandTotal"=>$LandTotal,
		"LandOwn"=>$LandOwn,
		"LandLeased"=>$LandLeased,
		"CurrentDate"=>$CurrentDate);
		

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $dataList
		];

	}catch(PDOException $e){
		$returnData = msg(0,500,$e->getMessage());
	}
	
	$dbh->CloseConnection();  /**Close database connection */
	return $returnData;
}




function getGenderwisePGMemberDataList($data){

	try{
		$dbh = new Db();
	
		$query = "SELECT g.GenderName,g.ColorCode,COUNT(f.`HouseHoldId`) AS TotalMembers
		FROM `t_householdlivestocksurvey` f
		INNER JOIN `t_gender` g ON f.`Gender` = g.GenderId
		group by g.GenderName,g.ColorCode;";
		$resultdata = $dbh->query($query);

		$dataList = array();
		foreach ($resultdata as $key => $row) {
			$TotalMembers = $row["TotalMembers"];
			settype($TotalMembers,"integer");

			$dataList[] = array("name"=>$row["GenderName"],"y"=>$TotalMembers,"color"=> $row["ColorCode"]);
		}


		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $dataList
		];

	}catch(PDOException $e){
		$returnData = msg(0,500,$e->getMessage());
	}
	
	$dbh->CloseConnection();  /**Close database connection */
	return $returnData;
}

?>