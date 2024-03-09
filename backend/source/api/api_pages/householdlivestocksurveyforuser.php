<?php

$task = '';
if(isset($data->action)) {
	$task = trim($data->action);
}

switch($task){
	
	case "getDataList":
		$returnData = getDataList($data);
	break;

	default :
		echo "{failure:true}";
		break;
}

function getDataList($data){

	try{
		$dbh = new Db();

		$DivisionId = trim($data->DivisionId)?trim($data->DivisionId):0; 
		$DistrictId = trim($data->DistrictId)?trim($data->DistrictId):0; 
		$UpazilaId = trim($data->UpazilaId)?trim($data->UpazilaId):0; 
		$UserId = trim($data->UserId)?trim($data->UserId):0; 

	
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
		  INNER JOIN `t_division` q ON a.`DivisionId`=q.`DivisionId`
		  INNER JOIN `t_district` r ON a.`DistrictId`=r.`DistrictId`
		  INNER JOIN `t_upazila` s ON a.`UpazilaId`=s.`UpazilaId`
		  INNER JOIN `t_union` u ON a.`UnionId`=u.`UnionId`
		  Inner Join t_gender b ON a.Gender = b.GenderId
		  INNER JOIN `t_users` us ON a.`UserId`=us.`UserId`
		  LEFT JOIN `t_designation` de ON a.`DesignationId`=de.`DesignationId`
		  WHERE (a.DivisionId = $DivisionId)
			AND (a.DistrictId = $DistrictId)
			AND (a.UpazilaId = $UpazilaId)
			AND a.UserId = $UserId
			AND a.`YearId` = 2024
			ORDER BY q.`DivisionName`,r.`DistrictName`,s.`UpazilaName`,u.UnionName ;";
	

		$resultdata = $dbh->query($query);
		
		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $resultdata
		];

	}catch(PDOException $e){
		$returnData = msg(0,500,$e->getMessage());
	}
	$dbh->CloseConnection();  /**Close database connection */
	return $returnData;
}




?>