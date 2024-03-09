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

		try {

			$dbh = new Db();
			$aQuerys = array();

			$currTime = date("YmdHis");
			$query1 = "SELECT LoginName FROM t_users
			WHERE UserId = $UserId;";
			$re = $dbh->query($query1);

			$LoginName = 0;
			foreach ($re as $r) {
				$LoginName = $r["LoginName"];
			}
			// $logFileName = "../../../logs/sync_upload_files/".$LoginName."_".$currTime.".txt";
			$logFileName = "../../../logs/sync_upload_files/".$LoginName.".txt";
			file_put_contents($logFileName, "\n\n====Data Upload:".date("Y-m-d H:i:s"). PHP_EOL , FILE_APPEND | LOCK_EX);
			file_put_contents($logFileName, json_encode($rowData). PHP_EOL , FILE_APPEND | LOCK_EX);
			



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
			$isDuplicateInCurrListWithServer = array();
			$hasDuplicate = 0;
			$hasDuplicateWithServer = 0;
			$duplicatePhone = "";
			$duplicatePhoneWithServer = "";

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
						$duplicatePhone = $FarmerName.'-'.$Phone;
					}else{
						$duplicatePhone .= ", ".$FarmerName.'-'.$Phone;
					}
				} else {
					$isDuplicateInCurrList[$duplicate_key] = 1;
				}



				/**Duplicate check with database. */
				/**If found duplicate then just ignore this row */
				if (array_key_exists($duplicate_key, $old_DataList)) {
					/**when duplicate then skip */
					//continue;
					$hasDuplicateWithServer = 1;

					// $isDuplicateInCurrListWithServer = array(); 
					if($duplicatePhoneWithServer == ""){
						$duplicatePhoneWithServer = $FarmerName.'-'.$Phone;
					}else{
						$duplicatePhoneWithServer .= ", ".$FarmerName.'-'.$Phone;
					}

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
			}else if ($hasDuplicateWithServer > 0) {
				$returnData = [
					"success" => 0,
					"status" => 500,
					"UserId" => $UserId,
					"message" => "Found duplicate data in server. ".$duplicatePhoneWithServer
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
