<?php

$task = '';
if (isset($data->action)) {
	$task = trim($data->action);
}

switch ($task) {

	case "dataSyncUpload":
		$returnData = dataSyncUpload($data);
		break;

	default:
		echo "{failure:true}";
		break;
}

function dataSyncUpload($data)
{

	if ($_SERVER["REQUEST_METHOD"] != "POST") {
		return $returnData = msg(0, 404, 'Page Not Found!');
	} else {

		$lan = trim($data->lan);
		$UserId = trim($data->UserId);

		$DivisionId = trim($data->DivisionId);
		$DistrictId = trim($data->DistrictId);
		$UpazilaId = trim($data->UpazilaId);
		$YearId = 2024;
		$rowData = $data->rowData;

		// echo "<pre>";
		// echo count($rowData);
		// print_r($rowData);
		// exit;
		// $HouseHoldId = $data->rowData->id;
		// $DivisionId = $data->rowData->DivisionId? $data->rowData->DivisionId : null;
		// $DistrictId = $data->rowData->DistrictId? $data->rowData->DistrictId : null;
		// $UpazilaId = $data->rowData->UpazilaId? $data->rowData->UpazilaId : null;
		// $UnionId = $data->rowData->UnionId? $data->rowData->UnionId : null;

		// $YearId = 2024;
		// $Village = $data->rowData->Village ? $data->rowData->Village : null;
		// $FarmerName =  $data->rowData->FarmerName ? $data->rowData->FarmerName : null;
		// $FatherName =  $data->rowData->FatherName ? $data->rowData->FatherName : null;
		// $MotherName =  $data->rowData->MotherName ? $data->rowData->MotherName : null;
		// $HusbandWifeName =  $data->rowData->HusbandWifeName ? $data->rowData->HusbandWifeName : null;
		// $NameOfTheFarm =  $data->rowData->NameOfTheFarm ? $data->rowData->NameOfTheFarm : null;
		// $Phone = $data->rowData->Phone ? $data->rowData->Phone : null;
		// $Gender = $data->rowData->Gender ? $data->rowData->Gender : null;
		// $IsDisability = $data->rowData->IsDisability ? $data->rowData->IsDisability : 0;
		// $NID =  $data->rowData->NID ? $data->rowData->NID : "";
		// $IsPGMember = $data->rowData->IsPGMember ? $data->rowData->IsPGMember : 0;
		// $Latitute =  $data->rowData->Latitute ? $data->rowData->Latitute : null;
		// $Longitute =  $data->rowData->Longitute ? $data->rowData->Longitute : null;
		// $CowNative =  $data->rowData->CowNative ? $data->rowData->CowNative : null;
		// $CowCross =  $data->rowData->CowCross ? $data->rowData->CowCross : null;
		// $MilkCow =  $data->rowData->MilkCow ? $data->rowData->MilkCow : null;
		// $CowBullNative =  $data->rowData->CowBullNative ? $data->rowData->CowBullNative : null;
		// $CowBullCross =  $data->rowData->CowBullCross ? $data->rowData->CowBullCross : null;
		// $CowCalfMaleNative =  $data->rowData->CowCalfMaleNative ? $data->rowData->CowCalfMaleNative : null;
		// $CowCalfMaleCross =  $data->rowData->CowCalfMaleCross ? $data->rowData->CowCalfMaleCross : null;
		// $CowCalfFemaleNative =  $data->rowData->CowCalfFemaleNative ? $data->rowData->CowCalfFemaleNative : null;
		// $CowCalfFemaleCross =  $data->rowData->CowCalfFemaleCross ? $data->rowData->CowCalfFemaleCross : null;
		// $CowMilkProductionNative =  $data->rowData->CowMilkProductionNative ? $data->rowData->CowMilkProductionNative : null;
		// $CowMilkProductionCross =  $data->rowData->CowMilkProductionCross ? $data->rowData->CowMilkProductionCross : null;
		// $BuffaloAdultMale =  $data->rowData->BuffaloAdultMale ? $data->rowData->BuffaloAdultMale : null;
		// $BuffaloAdultFemale =  $data->rowData->BuffaloAdultFemale ? $data->rowData->BuffaloAdultFemale : null;
		// $BuffaloCalfMale =  $data->rowData->BuffaloCalfMale ? $data->rowData->BuffaloCalfMale : null;
		// $BuffaloCalfFemale =  $data->rowData->BuffaloCalfFemale ? $data->rowData->BuffaloCalfFemale : null;
		// $BuffaloMilkProduction =  $data->rowData->BuffaloMilkProduction ? $data->rowData->BuffaloMilkProduction : null;
		// $GoatAdultMale =  $data->rowData->GoatAdultMale ? $data->rowData->GoatAdultMale : null;
		// $GoatAdultFemale =  $data->rowData->GoatAdultFemale ? $data->rowData->GoatAdultFemale : null;
		// $GoatCalfMale =  $data->rowData->GoatCalfMale ? $data->rowData->GoatCalfMale : null;
		// $GoatCalfFemale =  $data->rowData->GoatCalfFemale ? $data->rowData->GoatCalfFemale : null;
		// $SheepAdultMale =  $data->rowData->SheepAdultMale ? $data->rowData->SheepAdultMale : null;
		// $SheepAdultFemale =  $data->rowData->SheepAdultFemale ? $data->rowData->SheepAdultFemale : null;
		// $SheepCalfMale =  $data->rowData->SheepCalfMale ? $data->rowData->SheepCalfMale : null;
		// $SheepCalfFemale =  $data->rowData->SheepCalfFemale ? $data->rowData->SheepCalfFemale : null;
		// $GoatSheepMilkProduction =  $data->rowData->GoatSheepMilkProduction ? $data->rowData->GoatSheepMilkProduction : null;
		// $ChickenNative =  $data->rowData->ChickenNative ? $data->rowData->ChickenNative : null;
		// $ChickenLayer =  $data->rowData->ChickenLayer ? $data->rowData->ChickenLayer : null;
		// $ChickenSonaliFayoumiCockerelOthers =  $data->rowData->ChickenSonaliFayoumiCockerelOthers ? $data->rowData->ChickenSonaliFayoumiCockerelOthers : null;
		// $ChickenBroiler =  $data->rowData->ChickenBroiler ? $data->rowData->ChickenBroiler : null;
		// $ChickenSonali =  $data->rowData->ChickenSonali ? $data->rowData->ChickenSonali : null;
		// $ChickenEgg =  $data->rowData->ChickenEgg ? $data->rowData->ChickenEgg : null;
		// $DucksNumber =  $data->rowData->DucksNumber ? $data->rowData->DucksNumber : null;
		// $DucksEgg =  $data->rowData->DucksEgg ? $data->rowData->DucksEgg : null;
		// $PigeonNumber =  $data->rowData->PigeonNumber ? $data->rowData->PigeonNumber : null;
		// $QuailNumber =  $data->rowData->QuailNumber ? $data->rowData->QuailNumber : null;
		// $OtherAnimalNumber =  $data->rowData->OtherAnimalNumber ? $data->rowData->OtherAnimalNumber : null;


		try {

			$dbh = new Db();
			$aQuerys = array();





			$query1 = "SELECT HouseHoldId,YearId,DivisionId,DistrictId,UpazilaId,UnionId,Phone
		FROM t_householdlivestocksurvey
		WHERE YearId = $YearId
		AND DivisionId = $DivisionId
		AND DistrictId = $DistrictId
		AND UpazilaId = $UpazilaId;";
			$resultdata1 = $dbh->query($query1);

			$old_DataList = array();
			foreach ($resultdata1 as $row1) {
				$old_DataList[$row1["YearId"] . '_' . $row1["DivisionId"] . '_' . $row1["DistrictId"] . '_' . $row1["UpazilaId"] . '_' . $row1["UnionId"] . '_' . $row1["Phone"]] = $row1["HouseHoldId"];
			}
			// 		echo "<pre>";
			// 		print_r($old_DataList);
			// exit;
			$isDuplicateInCurrList = array();
			$hasDuplicate = 0;
			$duplicatePhone = "";

			foreach ($rowData as $row) {
				$row = (array)$row;
				// print_r($row);
				$YearId = 2024;
				$DivisionId = $row["DivisionId"];
				$DistrictId = $row["DistrictId"];
				$UpazilaId = $row["UpazilaId"];
				$UnionId = $row["UnionId"];
				$Ward = $row["Ward"];
				$Village = $row["Village"];
				$FarmerName = $row["FarmerName"];
				$FatherName = $row["FatherName"];
				$MotherName = $row["MotherName"];
				$HusbandWifeName = $row["HusbandWifeName"];
				$NameOfTheFarm = $row["NameOfTheFarm"];
				$Phone = $row["Phone"];
				$Gender = $row["Gender"];
				$IsDisability = $row["IsDisability"];
				$NID = $row["NID"];
				$IsPGMember = $row["IsPGMember"];
				$Latitute = $row["Latitute"];
				$Longitute = $row["Longitute"];
				$CowNative = $row["CowNative"];
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
				$ChickenSonaliFayoumiCockerelOthers = $row["ChickenSonaliFayoumiCockerelOthers"];
				$ChickenBroiler = $row["ChickenBroiler"];
				$ChickenSonali = $row["ChickenSonali"];
				$ChickenEgg = $row["ChickenEgg"];
				$DucksNumber = $row["DucksNumber"];
				$DucksEgg = $row["DucksEgg"];
				$PigeonNumber = $row["PigeonNumber"];
				$QuailNumber = $row["QuailNumber"];
				$OtherAnimalNumber = $row["OtherAnimalNumber"];
				$FamilyMember = $row["FamilyMember"];
				$LandTotal = $row["LandTotal"];
				$LandOwn = $row["LandOwn"];
				$LandLeased = $row["LandLeased"];
				$DataCollectionDate = $row["DataCollectionDate"];
				$DataCollectorName = $row["DataCollectorName"];
				$DesignationId = $row["DesignationId"];
				$PhoneNumber = $row["PhoneNumber"];
				$Remarks = $row["Remarks"];
				$UserId = $row["UserId"];


				$duplicate_key = $YearId . '_' . $DivisionId . '_' . $DistrictId . '_' . $UpazilaId . '_' . $UnionId . '_' . $Phone;

				if (array_key_exists($duplicate_key, $isDuplicateInCurrList)) {
					$isDuplicateInCurrList[$duplicate_key] += 1;
					$hasDuplicate = 1;
					if($duplicatePhone == ""){
						$duplicatePhone = $Phone;
					}else{
						$duplicatePhone .= ", ".$Phone;
					}
				} else {
					$isDuplicateInCurrList[$duplicate_key] = 1;
				}



				/**Duplicate check with database. */
				/**If found duplicate then just ignore this row */
				if (array_key_exists($duplicate_key, $old_DataList)) {
					/**when duplicate then skip */
					continue;
				}


				$q = new insertq();
				$q->table = 't_householdlivestocksurvey';
				$q->columns = [
					'YearId', 'DivisionId', 'DistrictId', 'UpazilaId', 'UnionId', 'Ward', 'Village', 'FarmerName',
					'FatherName', 'MotherName', 'HusbandWifeName', 'NameOfTheFarm', 'Phone', 'Gender', 'IsDisability',
					'NID', 'IsPGMember', 'Latitute', 'Longitute', 'CowNative', 'CowCross', 'MilkCow', 'CowBullNative',
					'CowBullCross', 'CowCalfMaleNative', 'CowCalfMaleCross', 'CowCalfFemaleNative', 'CowCalfFemaleCross',
					'CowMilkProductionNative', 'CowMilkProductionCross', 'BuffaloAdultMale', 'BuffaloAdultFemale',
					'BuffaloCalfMale', 'BuffaloCalfFemale', 'BuffaloMilkProduction', 'GoatAdultMale', 'GoatAdultFemale',
					'GoatCalfMale', 'GoatCalfFemale', 'SheepAdultMale', 'SheepAdultFemale', 'SheepCalfMale',
					'SheepCalfFemale', 'GoatSheepMilkProduction', 'ChickenNative', 'ChickenLayer',
					'ChickenSonaliFayoumiCockerelOthers', 'ChickenBroiler', 'ChickenSonali', 'ChickenEgg',
					'DucksNumber', 'DucksEgg', 'PigeonNumber', 'QuailNumber', 'OtherAnimalNumber', 'FamilyMember',
					'LandTotal', 'LandOwn', 'LandLeased', 'DataCollectionDate', 'DataCollectorName', 'DesignationId',
					'PhoneNumber', 'Remarks', 'UserId'
				];
				$q->values = [
					$YearId, $DivisionId, $DistrictId, $UpazilaId, $UnionId, $Ward, $Village, $FarmerName,
					$FatherName, $MotherName, $HusbandWifeName, $NameOfTheFarm, $Phone, $Gender, $IsDisability,
					$NID, $IsPGMember, $Latitute, $Longitute, $CowNative, $CowCross, $MilkCow, $CowBullNative,
					$CowBullCross, $CowCalfMaleNative, $CowCalfMaleCross, $CowCalfFemaleNative, $CowCalfFemaleCross,
					$CowMilkProductionNative, $CowMilkProductionCross, $BuffaloAdultMale, $BuffaloAdultFemale,
					$BuffaloCalfMale, $BuffaloCalfFemale, $BuffaloMilkProduction, $GoatAdultMale, $GoatAdultFemale,
					$GoatCalfMale, $GoatCalfFemale, $SheepAdultMale, $SheepAdultFemale, $SheepCalfMale,
					$SheepCalfFemale, $GoatSheepMilkProduction, $ChickenNative, $ChickenLayer,
					$ChickenSonaliFayoumiCockerelOthers, $ChickenBroiler, $ChickenSonali, $ChickenEgg,
					$DucksNumber, $DucksEgg, $PigeonNumber, $QuailNumber, $OtherAnimalNumber, $FamilyMember,
					$LandTotal, $LandOwn, $LandLeased, $DataCollectionDate, $DataCollectorName, $DesignationId,
					$PhoneNumber, $Remarks, $UserId
				];
				$q->pks = ['HouseHoldId'];
				$q->bUseInsetId = false;
				$q->build_query();
				$aQuerys[] = $q;
			}

			
			if ($hasDuplicate > 0) {
				$returnData = [
					"success" => 0,
					"status" => 500,
					"UserId" => $UserId,
					"message" => "Found duplicate data. ".$duplicatePhone
				];
			} else if (count($aQuerys) > 0) {
				$res = exec_query($aQuerys, $UserId, $lan, false);
				$success = ($res['msgType'] == 'success') ? 1 : 0;
				$status = ($res['msgType'] == 'success') ? 200 : 500;

				$returnData = [
					"success" => $success,
					"status" => $status,
					"UserId" => $UserId,
					"message" => $res['msg']
				];
			} else {
				$returnData = [
					"success" => 1,
					"status" => 200,
					"UserId" => $UserId,
					"message" => "Data uploaded successfully"
				];
			}
		} catch (PDOException $e) {
			$returnData = msg(0, 500, $e->getMessage());
		}

		return $returnData;
	}
}
