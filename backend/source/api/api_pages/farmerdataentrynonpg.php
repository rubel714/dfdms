<?php

$task = '';
if(isset($data->action)) {
	$task = trim($data->action);
}

switch($task){
	
	case "getDataList":
		$returnData = getDataList($data);
	break;

	case "dataAddEdit":
		$returnData = dataAddEdit($data);
	break;
	
	case "deleteData":
		$returnData = deleteData($data);
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
			AND a.`YearId` = 2024
		  ORDER BY q.`DivisionName`,r.`DistrictName`,s.`UpazilaName`,u.UnionName;";
		  

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
	
	return $returnData;
}



function dataAddEdit($data) {

	if($_SERVER["REQUEST_METHOD"] != "POST"){
		return $returnData = msg(0,404,'Page Not Found!');
	}else{
		


		$lan = trim($data->lan); 
		$UserId = trim($data->UserId); 

		$HouseHoldId = $data->rowData->id;

		$DivisionId = $data->rowData->DivisionId? $data->rowData->DivisionId : null;
		$DistrictId = $data->rowData->DistrictId? $data->rowData->DistrictId : null;
		$UpazilaId = $data->rowData->UpazilaId? $data->rowData->UpazilaId : null;
		$UnionId = $data->rowData->UnionId? $data->rowData->UnionId : null;

		
		$YearId = 2024;
		$Village = $data->rowData->Village ? $data->rowData->Village : null;
		$FarmerName =  $data->rowData->FarmerName ? $data->rowData->FarmerName : null;
		$FatherName =  $data->rowData->FatherName ? $data->rowData->FatherName : null;
		$MotherName =  $data->rowData->MotherName ? $data->rowData->MotherName : null;
		$HusbandWifeName =  $data->rowData->HusbandWifeName ? $data->rowData->HusbandWifeName : null;
		$NameOfTheFarm =  $data->rowData->NameOfTheFarm ? $data->rowData->NameOfTheFarm : null;
		$Phone = $data->rowData->Phone ? $data->rowData->Phone : null;
		$Gender = $data->rowData->Gender ? $data->rowData->Gender : null;
		$IsDisability = $data->rowData->IsDisability ? $data->rowData->IsDisability : 0;
		$NID =  $data->rowData->NID ? $data->rowData->NID : "";
		$IsPGMember = $data->rowData->IsPGMember ? $data->rowData->IsPGMember : 0;
		$Latitute =  $data->rowData->Latitute ? $data->rowData->Latitute : null;
		$Longitute =  $data->rowData->Longitute ? $data->rowData->Longitute : null;
		$CowNative =  $data->rowData->CowNative ? $data->rowData->CowNative : null;
		$CowCross =  $data->rowData->CowCross ? $data->rowData->CowCross : null;
		$MilkCow =  $data->rowData->MilkCow ? $data->rowData->MilkCow : null;
		$CowBullNative =  $data->rowData->CowBullNative ? $data->rowData->CowBullNative : null;
		$CowBullCross =  $data->rowData->CowBullCross ? $data->rowData->CowBullCross : null;
		$CowCalfMaleNative =  $data->rowData->CowCalfMaleNative ? $data->rowData->CowCalfMaleNative : null;
		$CowCalfMaleCross =  $data->rowData->CowCalfMaleCross ? $data->rowData->CowCalfMaleCross : null;
		$CowCalfFemaleNative =  $data->rowData->CowCalfFemaleNative ? $data->rowData->CowCalfFemaleNative : null;
		$CowCalfFemaleCross =  $data->rowData->CowCalfFemaleCross ? $data->rowData->CowCalfFemaleCross : null;
		$CowMilkProductionNative =  $data->rowData->CowMilkProductionNative ? $data->rowData->CowMilkProductionNative : null;
		$CowMilkProductionCross =  $data->rowData->CowMilkProductionCross ? $data->rowData->CowMilkProductionCross : null;
		$BuffaloAdultMale =  $data->rowData->BuffaloAdultMale ? $data->rowData->BuffaloAdultMale : null;
		$BuffaloAdultFemale =  $data->rowData->BuffaloAdultFemale ? $data->rowData->BuffaloAdultFemale : null;
		$BuffaloCalfMale =  $data->rowData->BuffaloCalfMale ? $data->rowData->BuffaloCalfMale : null;
		$BuffaloCalfFemale =  $data->rowData->BuffaloCalfFemale ? $data->rowData->BuffaloCalfFemale : null;
		$BuffaloMilkProduction =  $data->rowData->BuffaloMilkProduction ? $data->rowData->BuffaloMilkProduction : null;
		$GoatAdultMale =  $data->rowData->GoatAdultMale ? $data->rowData->GoatAdultMale : null;
		$GoatAdultFemale =  $data->rowData->GoatAdultFemale ? $data->rowData->GoatAdultFemale : null;
		$GoatCalfMale =  $data->rowData->GoatCalfMale ? $data->rowData->GoatCalfMale : null;
		$GoatCalfFemale =  $data->rowData->GoatCalfFemale ? $data->rowData->GoatCalfFemale : null;
		$SheepAdultMale =  $data->rowData->SheepAdultMale ? $data->rowData->SheepAdultMale : null;
		$SheepAdultFemale =  $data->rowData->SheepAdultFemale ? $data->rowData->SheepAdultFemale : null;
		$SheepCalfMale =  $data->rowData->SheepCalfMale ? $data->rowData->SheepCalfMale : null;
		$SheepCalfFemale =  $data->rowData->SheepCalfFemale ? $data->rowData->SheepCalfFemale : null;
		$GoatSheepMilkProduction =  $data->rowData->GoatSheepMilkProduction ? $data->rowData->GoatSheepMilkProduction : null;
		$ChickenNative =  $data->rowData->ChickenNative ? $data->rowData->ChickenNative : null;
		$ChickenLayer =  $data->rowData->ChickenLayer ? $data->rowData->ChickenLayer : null;
		$ChickenSonaliFayoumiCockerelOthers =  $data->rowData->ChickenSonaliFayoumiCockerelOthers ? $data->rowData->ChickenSonaliFayoumiCockerelOthers : null;
		$ChickenBroiler =  $data->rowData->ChickenBroiler ? $data->rowData->ChickenBroiler : null;
		$ChickenSonali =  $data->rowData->ChickenSonali ? $data->rowData->ChickenSonali : null;
		$ChickenEgg =  $data->rowData->ChickenEgg ? $data->rowData->ChickenEgg : null;
		$DucksNumber =  $data->rowData->DucksNumber ? $data->rowData->DucksNumber : null;
		$DucksEgg =  $data->rowData->DucksEgg ? $data->rowData->DucksEgg : null;
		$PigeonNumber =  $data->rowData->PigeonNumber ? $data->rowData->PigeonNumber : null;
		$QuailNumber =  $data->rowData->QuailNumber ? $data->rowData->QuailNumber : null;
		$OtherAnimalNumber =  $data->rowData->OtherAnimalNumber ? $data->rowData->OtherAnimalNumber : null;
		$FamilyMember =  $data->rowData->FamilyMember ? $data->rowData->FamilyMember : null;
		$LandTotal =  $data->rowData->LandTotal ? $data->rowData->LandTotal : null;
		$LandOwn =  $data->rowData->LandOwn ? $data->rowData->LandOwn : null;
		$LandLeased =  $data->rowData->LandLeased ? $data->rowData->LandLeased : null;
		$DataCollectionDate =  $data->rowData->DataCollectionDate ? $data->rowData->DataCollectionDate : null;
		$DataCollectorName =  $data->rowData->DataCollectorName ? $data->rowData->DataCollectorName : null;
		$DesignationId =  $data->rowData->DesignationId ? $data->rowData->DesignationId : null;
		$PhoneNumber =  $data->rowData->PhoneNumber ? $data->rowData->PhoneNumber : null;
		$Remarks =  $data->rowData->Remarks ? $data->rowData->Remarks : null;
		$Ward =  $data->rowData->Ward ? $data->rowData->Ward : null;
		




		try{
			
			$dbh = new Db();
			$aQuerys = array();

			if($HouseHoldId == ""){
				
				$q = new insertq();
				$q->table = 't_householdlivestocksurvey';
				$q->columns = [
						'YearId',
						'DivisionId',
						'DistrictId',
						'UpazilaId',
						'UnionId',
						'Ward',
						'Village',
						'FarmerName',
						'FatherName',
						'MotherName',
						'HusbandWifeName',
						'NameOfTheFarm',
						'Phone',
						'Gender',
						'IsDisability',
						'NID',
						'IsPGMember',
						'Latitute',
						'Longitute',
						'CowNative',
						'CowCross',
						'MilkCow',
						'CowBullNative',
						'CowBullCross',
						'CowCalfMaleNative',
						'CowCalfMaleCross',
						'CowCalfFemaleNative',
						'CowCalfFemaleCross',
						'CowMilkProductionNative',
						'CowMilkProductionCross',
						'BuffaloAdultMale',
						'BuffaloAdultFemale',
						'BuffaloCalfMale',
						'BuffaloCalfFemale',
						'BuffaloMilkProduction',
						'GoatAdultMale',
						'GoatAdultFemale',
						'GoatCalfMale',
						'GoatCalfFemale',
						'SheepAdultMale',
						'SheepAdultFemale',
						'SheepCalfMale',
						'SheepCalfFemale',
						'GoatSheepMilkProduction',
						'ChickenNative',
						'ChickenLayer',
						'ChickenSonaliFayoumiCockerelOthers',
						'ChickenBroiler',
						'ChickenSonali',
						'ChickenEgg',
						'DucksNumber',
						'DucksEgg',
						'PigeonNumber',
						'QuailNumber',
						'OtherAnimalNumber',
						'FamilyMember',
						'LandTotal',
						'LandOwn',
						'LandLeased',
						'DataCollectionDate',
						'DataCollectorName',
						'DesignationId',
						'PhoneNumber',
						'Remarks',
						'UserId'
					];
				$q->values = [
					$YearId,
					$DivisionId,
					$DistrictId,
					$UpazilaId,
					$UnionId,
					$Ward,
					$Village,
					$FarmerName,
					$FatherName,
					$MotherName,
					$HusbandWifeName,
					$NameOfTheFarm,
					$Phone,
					$Gender,
					$IsDisability,
					$NID,
					$IsPGMember,
					$Latitute,
					$Longitute,
					$CowNative,
					$CowCross,
					$MilkCow,
					$CowBullNative,
					$CowBullCross,
					$CowCalfMaleNative,
					$CowCalfMaleCross,
					$CowCalfFemaleNative,
					$CowCalfFemaleCross,
					$CowMilkProductionNative,
					$CowMilkProductionCross,
					$BuffaloAdultMale,
					$BuffaloAdultFemale,
					$BuffaloCalfMale,
					$BuffaloCalfFemale,
					$BuffaloMilkProduction,
					$GoatAdultMale,
					$GoatAdultFemale,
					$GoatCalfMale,
					$GoatCalfFemale,
					$SheepAdultMale,
					$SheepAdultFemale,
					$SheepCalfMale,
					$SheepCalfFemale,
					$GoatSheepMilkProduction,
					$ChickenNative,
					$ChickenLayer,
					$ChickenSonaliFayoumiCockerelOthers,
					$ChickenBroiler,
					$ChickenSonali,
					$ChickenEgg,
					$DucksNumber,
					$DucksEgg,
					$PigeonNumber,
					$QuailNumber,
					$OtherAnimalNumber,
					$FamilyMember,
					$LandTotal,
					$LandOwn,
					$LandLeased,
					$DataCollectionDate,
					$DataCollectorName,
					$DesignationId,
					$PhoneNumber,
					$Remarks,
					$UserId
				];
				$q->pks = ['HouseHoldId'];
				$q->bUseInsetId = false;
				$q->build_query();
				$aQuerys = array($q); 

	
			}else{
				
				$u = new updateq();
				$u->table = 't_householdlivestocksurvey';
				$u->columns = [
						'YearId',
						'DivisionId',
						'DistrictId',
						'UpazilaId',
						'UnionId',
						'Ward',
						'Village',
						'FarmerName',
						'FatherName',
						'MotherName',
						'HusbandWifeName',
						'NameOfTheFarm',
						'Phone',
						'Gender',
						'IsDisability',
						'NID',
						'IsPGMember',
						'Latitute',
						'Longitute',
						'CowNative',
						'CowCross',
						'MilkCow',
						'CowBullNative',
						'CowBullCross',
						'CowCalfMaleNative',
						'CowCalfMaleCross',
						'CowCalfFemaleNative',
						'CowCalfFemaleCross',
						'CowMilkProductionNative',
						'CowMilkProductionCross',
						'BuffaloAdultMale',
						'BuffaloAdultFemale',
						'BuffaloCalfMale',
						'BuffaloCalfFemale',
						'BuffaloMilkProduction',
						'GoatAdultMale',
						'GoatAdultFemale',
						'GoatCalfMale',
						'GoatCalfFemale',
						'SheepAdultMale',
						'SheepAdultFemale',
						'SheepCalfMale',
						'SheepCalfFemale',
						'GoatSheepMilkProduction',
						'ChickenNative',
						'ChickenLayer',
						'ChickenSonaliFayoumiCockerelOthers',
						'ChickenBroiler',
						'ChickenSonali',
						'ChickenEgg',
						'DucksNumber',
						'DucksEgg',
						'PigeonNumber',
						'QuailNumber',
						'OtherAnimalNumber',
						'FamilyMember',
						'LandTotal',
						'LandOwn',
						'LandLeased',
						'DataCollectionDate',
						'DataCollectorName',
						'DesignationId',
						'PhoneNumber',
						'Remarks'
					];
				$u->values = [
					$YearId,
					$DivisionId,
					$DistrictId,
					$UpazilaId,
					$UnionId,
					$Ward,
					$Village,
					$FarmerName,
					$FatherName,
					$MotherName,
					$HusbandWifeName,
					$NameOfTheFarm,
					$Phone,
					$Gender,
					$IsDisability,
					$NID,
					$IsPGMember,
					$Latitute,
					$Longitute,
					$CowNative,
					$CowCross,
					$MilkCow,
					$CowBullNative,
					$CowBullCross,
					$CowCalfMaleNative,
					$CowCalfMaleCross,
					$CowCalfFemaleNative,
					$CowCalfFemaleCross,
					$CowMilkProductionNative,
					$CowMilkProductionCross,
					$BuffaloAdultMale,
					$BuffaloAdultFemale,
					$BuffaloCalfMale,
					$BuffaloCalfFemale,
					$BuffaloMilkProduction,
					$GoatAdultMale,
					$GoatAdultFemale,
					$GoatCalfMale,
					$GoatCalfFemale,
					$SheepAdultMale,
					$SheepAdultFemale,
					$SheepCalfMale,
					$SheepCalfFemale,
					$GoatSheepMilkProduction,
					$ChickenNative,
					$ChickenLayer,
					$ChickenSonaliFayoumiCockerelOthers,
					$ChickenBroiler,
					$ChickenSonali,
					$ChickenEgg,
					$DucksNumber,
					$DucksEgg,
					$PigeonNumber,
					$QuailNumber,
					$OtherAnimalNumber,
					$FamilyMember,
					$LandTotal,
					$LandOwn,
					$LandLeased,
					$DataCollectionDate,
					$DataCollectorName,
					$DesignationId,
					$PhoneNumber,
					$Remarks
				];
				$u->pks = ['HouseHoldId'];
				$u->pk_values = [$HouseHoldId];
				$u->build_query();
				$aQuerys = array($u);
			}

			$res = exec_query($aQuerys, $UserId, $lan);  
			$success=($res['msgType']=='success')?1:0;
			$status=($res['msgType']=='success')?200:500;

			$returnData = [
			    "success" => $success ,
				"status" => $status,
				"UserId"=> $UserId,
				"message" => $res['msg']
			];

		}catch(PDOException $e){
			$returnData = msg(0,500,$e->getMessage());
		}
		
		return $returnData;
	}
}


function deleteData($data) {
 
	if($_SERVER["REQUEST_METHOD"] != "POST"){
		return $returnData = msg(0,404,'Page Not Found!');
	}
	// CHECKING EMPTY FIELDS
	elseif(!isset($data->rowData->id)){
		$fields = ['fields' => ['id']];
		return $returnData = msg(0,422,'Please Fill in all Required Fields!',$fields);
	}else{
		
		$HouseHoldId = $data->rowData->id;
		$lan = trim($data->lan); 
		$UserId = trim($data->UserId); 

		try{

			$dbh = new Db();
			
            $d = new deleteq();
            $d->table = 't_householdlivestocksurvey';
            $d->pks = ['HouseHoldId'];
            $d->pk_values = [$HouseHoldId];
            $d->build_query();
            $aQuerys = array($d);

			$res = exec_query($aQuerys, $UserId, $lan);  
			$success=($res['msgType']=='success')?1:0;
			$status=($res['msgType']=='success')?200:500;

			$returnData = [
				"success" => $success ,
				"status" => $status,
				"UserId"=> $UserId,
				"message" => $res['msg']
			];
			
		}catch(PDOException $e){
			$returnData = msg(0,500,$e->getMessage());
		}
		
		return $returnData;
	}
}


?>