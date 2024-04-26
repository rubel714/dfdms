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




			$dailyfolder = date('Y_m_d');
			if (!file_exists("../../../logs/sync_upload_files/$dailyfolder")) {
				mkdir("../../../logs/sync_upload_files/$dailyfolder", 0777, true);
			}

			$pcName = gethostname();
			$logFileName = "../../../logs/sync_upload_files/" . $dailyfolder . "/" . $LoginName . "_" . $pcName . "_" . $dailyfolder . ".txt";
			file_put_contents($logFileName, "\n\n====Data Upload:" . date("Y-m-d H:i:s") . PHP_EOL, FILE_APPEND | LOCK_EX);
			file_put_contents($logFileName, "Input: " . json_encode($rowData) . PHP_EOL, FILE_APPEND | LOCK_EX);






			$query1 = "SELECT Status FROM t_settings WHERE SettingId = 'DataSyncOff';";
			$re = $dbh->query($query1);
			$SettingsDataSyncOffStatus = 0;
			foreach ($re as $r) {
				$SettingsDataSyncOffStatus = $r["Status"];
			}

			if ($SettingsDataSyncOffStatus == 1) {
				$returnData = [
					"success" => 0,
					"status" => 500,
					"UserId" => $UserId,
					"message" => "সার্ভারে ডাটা আপলোড এখন বন্ধ আছে"
				];
			} else {

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
				$hasNegative = 0;
				$negativeList = "";

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
					
					/*Check negative*/
					if(($NameOfTheFarm < 0) ||
					($CowNative < 0) ||
					($CowCross < 0) ||
					($MilkCow < 0) ||
					($CowBullNative < 0) ||
					($CowBullCross < 0) ||
					($CowCalfMaleNative < 0) ||
					($CowCalfMaleCross < 0) ||
					($CowCalfFemaleNative < 0) ||
					($CowCalfFemaleCross < 0) ||
					($CowMilkProductionNative < 0) ||
					($CowMilkProductionCross < 0) ||
					($BuffaloAdultMale < 0) ||
					($BuffaloAdultFemale < 0) ||
					($BuffaloCalfMale < 0) ||
					($BuffaloCalfFemale < 0) ||
					($BuffaloMilkProduction < 0) ||
					($GoatAdultMale < 0) ||
					($GoatAdultFemale < 0) ||
					($GoatCalfMale < 0) ||
					($GoatCalfFemale < 0) ||
					($SheepAdultMale < 0) ||
					($SheepAdultFemale < 0) ||
					($SheepCalfMale < 0) ||
					($SheepCalfFemale < 0) ||
					($GoatSheepMilkProduction < 0) ||
					($ChickenNative < 0) ||
					($ChickenLayer < 0) ||
					($ChickenSonaliFayoumiCockerelOthers < 0) ||
					($ChickenBroiler < 0) ||
					($ChickenSonali < 0) ||
					($ChickenEgg < 0) ||
					($DucksNumber < 0) ||
					($DucksEgg < 0) ||
					($PigeonNumber < 0) ||
					($QuailNumber < 0) ||
					($OtherAnimalNumber < 0) ||
					($FamilyMember < 0) ||
					($LandTotal < 0) ||
					($LandOwn < 0) ||
					($LandLeased < 0)){
						$hasNegative = 1;
						
						if ($negativeList == "") {
							$negativeList = $FarmerName . '-' . $Phone;
						} else {
							$negativeList .= ", " . $FarmerName . '-' . $Phone;
						}
					}


					$duplicate_key = $YearId . '_' . $DivisionId . '_' . $DistrictId . '_' . $UpazilaId . '_' . $UnionId . '_' . $Phone;

					if (array_key_exists($duplicate_key, $isDuplicateInCurrList)) {
						$isDuplicateInCurrList[$duplicate_key] += 1;
						$hasDuplicate = 1;
						if ($duplicatePhone == "") {
							$duplicatePhone = $FarmerName . '-' . $Phone;
						} else {
							$duplicatePhone .= ", " . $FarmerName . '-' . $Phone;
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
						if ($duplicatePhoneWithServer == "") {
							$duplicatePhoneWithServer = $FarmerName . '-' . $Phone;
						} else {
							$duplicatePhoneWithServer .= ", " . $FarmerName . '-' . $Phone;
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


				if ($hasNegative > 0) {
					$returnData = [
						"success" => 0,
						"status" => 500,
						"UserId" => $UserId,
						"message" => "Found negative data. " . $negativeList
					];
				}else if ($hasDuplicate > 0) {
					$returnData = [
						"success" => 0,
						"status" => 500,
						"UserId" => $UserId,
						"message" => "Found duplicate data. " . $duplicatePhone
					];
				} else if ($hasDuplicateWithServer > 0) {
					$returnData = [
						"success" => 0,
						"status" => 500,
						"UserId" => $UserId,
						"message" => "Found duplicate data in server. " . $duplicatePhoneWithServer
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
			}
			$dbh->CloseConnection();
		} catch (PDOException $e) {
			$returnData = msg(0, 500, $e->getMessage());
		}


		file_put_contents($logFileName, "Output: " . json_encode($returnData) . PHP_EOL, FILE_APPEND | LOCK_EX);
		return $returnData;
	}
}
