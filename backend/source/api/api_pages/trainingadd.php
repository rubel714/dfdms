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
	case "deleteDataMany":
		$returnData = deleteDataMany($data);
	break;

	case "getFarmerDataList":
		$returnData = getFarmerDataList($data);
	break;

	case "getDataListMany":
		$returnData = getDataListMany($data);
	break;
		
	case "farmerAdd":
		$returnData = farmerAdd($data);
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


		$query = "SELECT a.TrainingId AS id, a.TrainingId, a.`DivisionId`, a.`DistrictId`, a.`UpazilaId`, a.PGId, 
			b.`DivisionName`,c.`DistrictName`, d.`UpazilaName`, f.`PGName`,
			a.TrainingDate, a.TrainingTitleId, a.TrainingDescription, a.VenueId, a.ValuechainId
			,g.TrainingTitle , h.Venue
			FROM `t_training` a
			INNER JOIN t_division b ON a.`DivisionId` = b.`DivisionId`
			INNER JOIN t_district c ON a.`DistrictId` = c.`DistrictId`
			LEFT JOIN t_upazila d ON a.`UpazilaId` = d.`UpazilaId`
			LEFT JOIN t_pg f ON a.`PGId` = f.`PGId`
			INNER JOIN t_training_title g ON a.`TrainingTitleId` = g.`TrainingTitleId`
			INNER JOIN t_venue h ON a.`VenueId` = h.`VenueId`
			WHERE (a.DivisionId = $DivisionId OR $DivisionId=0)
			AND (a.DistrictId = $DistrictId OR $DistrictId=0)
			AND (a.UpazilaId = $UpazilaId OR $UpazilaId=0)
			ORDER BY b.`DivisionName`, c.`DistrictName`, d.`UpazilaName`, f.`PGName` ASC;";

			/* echo $query;
			exit; */
		
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
		$TrainingId = $data->rowData->id;
		$EntryDate = date("Y-m-d H:i:s"); 
		$TrainingDate = isset($data->rowData->TrainingDate) ? $data->rowData->TrainingDate : '';
		$DivisionId = $data->rowData->DivisionId;
		$DistrictId = $data->rowData->DistrictId;
		$UpazilaId = $data->rowData->UpazilaId;
		$PGId = $data->rowData->PGId;
		$TrainingTitleId = $data->rowData->TrainingTitleId;
		$TrainingDescription = $data->rowData->TrainingDescription;
		$VenueId = $data->rowData->VenueId;
		$ValuechainId = $data->rowData->ValuechainId;


		try{

			$dbh = new Db();
			$aQuerys = array();

			if($TrainingId == ""){

				//$TrainingIdWH = "";

				$q = new insertq();
				$q->table = 't_training';
				$q->columns = ['EntryDate','TrainingDate','DivisionId','DistrictId','UpazilaId','PGId', 'TrainingTitleId','TrainingDescription', 'VenueId','UserId','ValuechainId'];
				$q->values = [$EntryDate,$TrainingDate,$DivisionId,$DistrictId,$UpazilaId,$PGId, $TrainingTitleId, $TrainingDescription, $VenueId, $UserId, $ValuechainId];
				$q->pks = ['TrainingId'];
				$q->bUseInsetId = true;
				$q->build_query();
				$aQuerys[] = $q;
			}else{

				//$TrainingIdWH = " WHERE TrainingId = $TrainingId";

				$u = new updateq();
				$u->table = 't_training';
				$u->columns = ['EntryDate','TrainingDate','DivisionId','DistrictId','UpazilaId','PGId', 'TrainingTitleId','TrainingDescription', 'VenueId','ValuechainId'];
				$u->values = [$EntryDate,$TrainingDate,$DivisionId,$DistrictId,$UpazilaId,$PGId, $TrainingTitleId, $TrainingDescription, $VenueId, $ValuechainId];
				$u->pks = ['TrainingId'];
				$u->pk_values = [$TrainingId];
				$u->bUseInsetId = false;
				$u->build_query();
				$aQuerys[] = $u;
			}

		
			$res = exec_query($aQuerys, $UserId, $lan);  
			$success=($res['msgType']=='success')?1:0;
			$status=($res['msgType']=='success')?200:500;
			
			
			if($res['msgType']=='success'){

				$queryD = "SELECT COALESCE(MAX(TrainingId), '') AS MaxTrainingId, `TrainingDate`,`DivisionId`,`DistrictId`,`UpazilaId`,`PGId`,`TrainingTitleId`,`TrainingDescription`,`VenueId`
				FROM t_training
				
				ORDER BY TrainingId DESC;";
					$lastTrainingIdsq = $dbh->query($queryD);
					$lastInsertedId = $lastTrainingIdsq[0]['MaxTrainingId'];

				}else{
					$lastInsertedId = "";
				}

			$returnData = [
			    "success" => $success ,
				"status" => $status,
				"UserId"=> $UserId,
				"LastInsertid" => $lastTrainingIdsq,
				"LastTrainingId" => $res['TrainingId'],
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
		
		$TrainingId = $data->rowData->id;
		$lan = trim($data->lan); 
		$UserId = trim($data->UserId); 

		try{

			$dbh = new Db();
			
            $d = new deleteq();
            $d->table = 't_training';
            $d->pks = ['TrainingId'];
            $d->pk_values = [$TrainingId];
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


function deleteDataMany($data) {
 
	if($_SERVER["REQUEST_METHOD"] != "POST"){
		return $returnData = msg(0,404,'Page Not Found!');
	}
	// CHECKING EMPTY FIELDS
	elseif(!isset($data->rowData->id)){
		$fields = ['fields' => ['id']];
		return $returnData = msg(0,422,'Please Fill in all Required Fields!',$fields);
	}else{
		
		$TrainingDetailsId = $data->rowData->id;
		$lan = trim($data->lan); 
		$UserId = trim($data->UserId); 

		try{

			$dbh = new Db();
			
            $d = new deleteq();
            $d->table = 't_training_details';
            $d->pks = ['TrainingDetailsId'];
            $d->pk_values = [$TrainingDetailsId];
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




function getFarmerDataList($data){

		$DivisionId = trim($data->DivisionId)?trim($data->DivisionId):0; 
		$DistrictId = trim($data->DistrictId)?trim($data->DistrictId):0; 
		$UpazilaId = trim($data->UpazilaId)?trim($data->UpazilaId):0; 
		$PGId = trim($data->PGId)?trim($data->PGId):0; 

	try{
		$dbh = new Db();
		$query = "SELECT 
			a.`FarmerId`,
			a.`FarmerId` id,
			a.`DivisionId`,
			a.`DistrictId`,
			a.`UpazilaId`,
			a.`UnionId`,
			a.`CityCorporation`,
			a.`Ward`,
			a.`PGId`,
			a.`FarmerName`,
			a.`NID`,
			a.`Phone`,
			a.`FatherName`,
			a.`ValueChain`,
			a.`MotherName`,
			a.`LiveStockNo`,
			a.`LiveStockOther`,
			a.`Address`,
			a.`IsRegular`,
			a.`NidFrontPhoto`,
			a.`NidBackPhoto`,
			a.`BeneficiaryPhoto`,
			a.`SpouseName`,
			a.`Gender`,
			a.`FarmersAge`,
			a.`DisabilityStatus`,
			a.`RelationWithHeadOfHH`,
			a.`HeadOfHHSex`,
			a.`PGRegistered`,
			a.`PGPartnershipWithOtherCompany`,
			a.`TypeOfMember`,
			a.`PGFarmerCode`,
			a.`OccupationId`,
			a.`VillageName`,
			a.`Latitute`,
			a.`Longitute`,
			a.`IsHeadOfTheGroup`,
			a.`ValuechainId`,
			a.`TypeOfFarmerId`,
			a.dob,
			case when a.IsRegular=1 then 'Regular' else 'No' end IsRegularBeneficiary,
			b.GenderName, c.ValueChainName, d.PGName, a.DepartmentId, a.ifOtherSpecify, a.DateOfRegistration
			, a.RegistrationNo, a.NameOfTheCompanyYourPgPartnerWith 
			, a.WhenDidYouStartToOperateYourFirm
			, a.NumberOfMonthsOfYourOperation
			, a.AreYouRegisteredYourFirmWithDlsRadioFlag
			, a.registrationDate
			, a.IfRegisteredYesRegistrationNo
			, a.FarmsPhoto
		  FROM
		  `t_farmer` a 
		  Inner Join t_gender b ON a.Gender = b.GenderId
		  LEFT JOIN t_valuechain c ON a.ValuechainId = c.ValuechainId
		  LEFT JOIN t_pg d ON a.PGId = d.PGId
		  WHERE (a.DivisionId = $DivisionId OR $DivisionId=0)
			AND (a.DistrictId = $DistrictId OR $DistrictId=0)
			AND (a.UpazilaId = $UpazilaId OR $UpazilaId=0)
			AND (a.PGId = $PGId OR $PGId=0)
		  ;";
		
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



function getDataListMany($data){

		$TrainingId = trim($data->TrainingId)?trim($data->TrainingId):0; 


	try{
		$dbh = new Db();
		$query = "SELECT 
			a.`FarmerId`,
			e.`TrainingDetailsId` id,
			a.`DivisionId`,
			a.`DistrictId`,
			a.`UpazilaId`,
			a.`UnionId`,
			a.`CityCorporation`,
			a.`Ward`,
			a.`PGId`,
			a.`FarmerName`,
			a.`NID`,
			a.`Phone`,
			a.`FatherName`,
			a.`ValueChain`,
			a.`MotherName`,
			a.`LiveStockNo`,
			a.`LiveStockOther`,
			a.`Address`,
			a.`IsRegular`,
			a.`NidFrontPhoto`,
			a.`NidBackPhoto`,
			a.`BeneficiaryPhoto`,
			a.`SpouseName`,
			a.`Gender`,
			a.`FarmersAge`,
			a.`DisabilityStatus`,
			a.`RelationWithHeadOfHH`,
			a.`HeadOfHHSex`,
			a.`PGRegistered`,
			a.`PGPartnershipWithOtherCompany`,
			a.`TypeOfMember`,
			a.`PGFarmerCode`,
			a.`OccupationId`,
			a.`VillageName`,
			a.`Latitute`,
			a.`Longitute`,
			a.`IsHeadOfTheGroup`,
			a.`ValuechainId`,
			a.`TypeOfFarmerId`,
			a.dob,
			case when a.IsRegular=1 then 'Regular' else 'No' end IsRegularBeneficiary,
			b.GenderName, c.ValueChainName, d.PGName, a.DepartmentId, a.ifOtherSpecify, a.DateOfRegistration
			, a.RegistrationNo, a.NameOfTheCompanyYourPgPartnerWith 
			, a.WhenDidYouStartToOperateYourFirm
			, a.NumberOfMonthsOfYourOperation
			, a.AreYouRegisteredYourFirmWithDlsRadioFlag
			, a.registrationDate
			, a.IfRegisteredYesRegistrationNo
			, a.FarmsPhoto
		  FROM
		  `t_farmer` a 
		  Inner Join t_gender b ON a.Gender = b.GenderId
		  Inner Join t_training_details e ON a.FarmerId = e.FarmerId
		  LEFT JOIN t_valuechain c ON a.ValuechainId = c.ValuechainId
		  LEFT JOIN t_pg d ON a.PGId = d.PGId
		  WHERE e.TrainingId = $TrainingId
		  ;";
		
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




function farmerAdd($data) {

	if($_SERVER["REQUEST_METHOD"] != "POST"){
		return $returnData = msg(0,404,'Page Not Found!');
	}else{
		

		$lan = trim($data->lan); 
		$UserId = trim($data->UserId); 
		/* $DataTypeId = trim($data->DataTypeId); 
		$SurveyId = trim($data->SurveyId);  */

		$DivisionId = trim($data->DivisionId)?trim($data->DivisionId):0; 
		$DistrictId = trim($data->DistrictId)?trim($data->DistrictId):0; 
		$UpazilaId = trim($data->UpazilaId)?trim($data->UpazilaId):0; 
		$PGId = trim($data->PGId)?trim($data->PGId):0; 
		$TrainingId = trim($data->TrainingId)?trim($data->TrainingId):0;


		$QMapId = $data->rowData->id;
		

		try{

			$dbh = new Db();
			$aQuerys = array();


			 $cq="SELECT a.`FarmerId` FROM  `t_training_details` a
		  		 WHERE TrainingId = $TrainingId " ;
		   	 $questionMapped = $dbh->query($cq);

		
			$initialValue = 0;
			foreach ($data->rowData as $row) {
				$shouldInsert = true;

				foreach ($questionMapped as $mappedRow) {
					if ($row->id == $mappedRow['FarmerId']) {
						$shouldInsert = false;
						//break; 
					}
				}

				/* if ($row->QuestionType == "Label") {
					$shouldInsert = true;
				} */
				
					if ($shouldInsert) {
						/* $LabelName = null;
						$MapType = 'Question';
						if($row->QuestionType == "Label"){
							$MapType = 'Label';
						}else{
							$MapType = 'Question';
						} */

						/* $q="SELECT IFNULL(MAX(SortOrder), 0) AS M FROM t_datatype_questions_map";
						$resultdata = $dbh->query($q);
						$currentSortOrder  = $resultdata[0]['M'];

						$initialValue++;
						$SortOrder = $currentSortOrder + $initialValue; */


						$q = new insertq();
						$q->table = 't_training_details';
						$q->columns = [
							'TrainingId',
							'FarmerId'
						];
						$q->values = [
							$TrainingId,
							$row->id
						];
					
						$q->pks = ['TrainingDetailsId'];
						$q->bUseInsetId = false;
						$q->build_query();
						$aQuerys[] = $q;
					}
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




?>