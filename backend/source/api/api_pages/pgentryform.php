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
	
	case "changeReportStatus":
		$returnData = changeReportStatus($data);
	break;
	
	case "changeReportStatusAll":
		$returnData = changeReportStatusAll($data);
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


		$query = "SELECT a.PGId AS id, a.`DivisionId`, a.`DistrictId`, a.`UpazilaId`, a.`PGName`, a.`Address`, 
			b.`DivisionName`,c.`DistrictName`, d.`UpazilaName`, a.UnionId, a.PgGroupCode, 
			a.PgBankAccountNumber, y.BankName, a.ValuechainId, a.IsLeadByWomen, a.GenderId, a.IsActive, e.ValueChainName, f.UnionName
			, a.DateofPgInformation, a.BankId
			,a.StatusId,case when a.StatusId=1 then 'Waiting for Submit'
			 when a.StatusId=2 then 'Waiting for Accept'
			 when a.StatusId=3 then 'Waiting for Approve'
			 when a.StatusId=5 then 'Approved'
			 else '' end CurrentStatus,h.UserName,a.UserId, a.`Latitute`, a.`Longitute`
			 ,a.AcceptReturnComments,a.ApproveReturnComments


			FROM `t_pg` a
			INNER JOIN t_division b ON a.`DivisionId` = b.`DivisionId`
			INNER JOIN t_district c ON a.`DistrictId` = c.`DistrictId`
			INNER JOIN t_upazila d ON a.`UpazilaId` = d.`UpazilaId`
			INNER JOIN t_union f ON a.`UnionId` = f.`UnionId`
			inner join t_users h on a.UserId=h.UserId
			LEFT JOIN t_valuechain e ON a.`ValuechainId` = e.`ValuechainId`
			LEFT JOIN t_bank y ON a.`BankId` = y.`BankId`
			WHERE (a.DivisionId = $DivisionId OR $DivisionId=0)
			AND (a.DistrictId = $DistrictId OR $DistrictId=0)
			AND (a.UpazilaId = $UpazilaId OR $UpazilaId=0)
			ORDER BY b.`DivisionName`, c.`DistrictName`, d.`UpazilaName` ASC, a.CreateTs DESC;";

			//ORDER BY b.`DivisionName`, c.`DistrictName`, d.`UpazilaName`, a.`PGName` ASC;";
		
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

		$PGId = $data->rowData->id;
		$PGName = $data->rowData->PGName;
		$DivisionId = $data->rowData->DivisionId;
		$DistrictId = $data->rowData->DistrictId;
		$UpazilaId = $data->rowData->UpazilaId;
		$Address = $data->rowData->Address;
		$UnionId = $data->rowData->UnionId;
		$PgGroupCode = $data->rowData->PgGroupCode;
		$PgBankAccountNumber = $data->rowData->PgBankAccountNumber;
		$BankName = "NA";
		$ValuechainId = $data->rowData->ValuechainId;
		$IsLeadByWomen = isset($data->rowData->IsLeadByWomen) ? $data->rowData->IsLeadByWomen : 0;
		$GenderId = isset($data->rowData->GenderId) ? $data->rowData->GenderId : 0;
		$IsActive = isset($data->rowData->IsActive) ? $data->rowData->IsActive : 0;
		$BankId = isset($data->rowData->BankId) ? $data->rowData->BankId : '';
		$DateofPgInformation = isset($data->rowData->DateofPgInformation) ? $data->rowData->DateofPgInformation : '';
		$Latitute =  $data->rowData->Latitute ? $data->rowData->Latitute : null;
		$Longitute =  $data->rowData->Longitute ? $data->rowData->Longitute : null;
		
		

		try{

			$dbh = new Db();
			$aQuerys = array();

			if($PGId == ""){
				$q = new insertq();
				$q->table = 't_pg';
				$q->columns = ['PGName','DivisionId','DistrictId','UpazilaId','Address', 'UnionId','PgGroupCode', 'PgBankAccountNumber','BankName', 'ValuechainId', 'IsLeadByWomen', 'GenderId', 'IsActive','BankId','DateofPgInformation','UserId','Latitute','Longitute'];
				$q->values = [$PGName,$DivisionId,$DistrictId,$UpazilaId,$Address, $UnionId, $PgGroupCode, $PgBankAccountNumber, $BankName, $ValuechainId, $IsLeadByWomen, $GenderId, $IsActive, $BankId, $DateofPgInformation,$UserId,$Latitute,$Longitute];
				$q->pks = ['PGId'];
				$q->bUseInsetId = false;
				$q->build_query();
				$aQuerys = array($q); 
			}else{
				$u = new updateq();
				$u->table = 't_pg';
				$u->columns = ['PGName','DivisionId','DistrictId','UpazilaId','Address','UnionId','PgGroupCode', 'PgBankAccountNumber', 'BankName', 'ValuechainId', 'IsLeadByWomen', 'GenderId', 'IsActive','BankId','DateofPgInformation','Latitute','Longitute'];
				$u->values = [$PGName,$DivisionId,$DistrictId,$UpazilaId,$Address, $UnionId, $PgGroupCode, $PgBankAccountNumber, $BankName, $ValuechainId, $IsLeadByWomen, $GenderId, $IsActive, $BankId, $DateofPgInformation,$Latitute,$Longitute];
				$u->pks = ['PGId'];
				$u->pk_values = [$PGId];
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
		
		$PGId = $data->rowData->id;
		$lan = trim($data->lan); 
		$UserId = trim($data->UserId); 

		try{

			$dbh = new Db();
			
            $d = new deleteq();
            $d->table = 't_pg';
            $d->pks = ['PGId'];
            $d->pk_values = [$PGId];
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




function changeReportStatus($data)
{

	if ($_SERVER["REQUEST_METHOD"] != "POST") {
		return $returnData = msg(0, 404, 'Page Not Found!');
	}
	// CHECKING EMPTY FIELDS
	elseif (!isset($data->Id) || !isset($data->StatusId)) {
		$fields = ['fields' => ['Id','StatusId']];
		return $returnData = msg(0, 422, 'Please Fill in all Required Fields!', $fields);
	} else {

		$PGId = $data->Id;
		$StatusId = $data->StatusId;
		$StatusNextPrev = $data->StatusNextPrev;
		$ReturnComments = $data->ReturnComments;
		$lan = trim($data->lan);
		$UserId = trim($data->UserId);

		$curDateTime = date('Y-m-d H:i:s');
		$UserFieldName = "";
		$DateFieldName = "";
		$ReturnCommentsFieldName = "";
		$BPosted = 0;


	
		
	
		try {

			$aQuerys = array();


			if($StatusNextPrev=="Next"){
				if($StatusId == 2){
					$UserFieldName = "SubmitUserId";
					$DateFieldName = "SubmitDate";
				}else if($StatusId == 3){
					$UserFieldName = "AcceptUserId";
					$DateFieldName = "AcceptDate";
				}else if($StatusId == 5){
					$UserFieldName = "ApproveUserId";
					$DateFieldName = "ApproveDate";
					$BPosted = 1;
				}

				$u = new updateq();
				$u->table = 't_pg';
				$u->columns = ['StatusId',$UserFieldName,$DateFieldName,'BPosted'];
				$u->values = [$StatusId,$UserId,$curDateTime,$BPosted];
				$u->pks = ['PGId'];
				$u->pk_values = [$PGId];
				$u->build_query();
				$aQuerys[] = $u;

			}else{
				if($StatusId == 1){
					$UserFieldName = "SubmitUserId";
					$DateFieldName = "SubmitDate";
					$ReturnCommentsFieldName = "AcceptReturnComments";

				}else if($StatusId == 2){
					$UserFieldName = "AcceptUserId";
					$DateFieldName = "AcceptDate";
					$ReturnCommentsFieldName = "ApproveReturnComments";
				}

				$u = new updateq();
				$u->table = 't_pg';
				$u->columns = ['StatusId',$UserFieldName,$DateFieldName,$ReturnCommentsFieldName,'BPosted'];
				$u->values = [$StatusId,NULL,NULL,$ReturnComments,$BPosted];
				$u->pks = ['PGId'];
				$u->pk_values = [$PGId];
				$u->build_query();
				$aQuerys[] = $u;
			}


			


			$res = exec_query($aQuerys, $UserId, $lan);
			$success = ($res['msgType'] == 'success') ? 1 : 0;
			$status = ($res['msgType'] == 'success') ? 200 : 500;

			$returnData = [
				"success" => $success,
				"status" => $status,
				"UserId" => $UserId,
				"message" => $res['msg']
			];
		} catch (PDOException $e) {
			$returnData = msg(0, 500, $e->getMessage());
		}

		return $returnData;
	}
}


function changeReportStatusAll($data)
{

	if ($_SERVER["REQUEST_METHOD"] != "POST") {
		return $returnData = msg(0, 404, 'Page Not Found!');
	}
	// CHECKING EMPTY FIELDS
	elseif ( !isset($data->StatusId)) {
		$fields = ['fields' => ['StatusId']];
		return $returnData = msg(0, 422, 'Please Fill in all Required Fields!', $fields);
	} else {

		$dbh = new Db();
		// $DataValueMasterId = $data->Id;
		$StatusId = $data->StatusId;
		$StatusNextPrev = $data->StatusNextPrev;
		$ReturnComments = $data->ReturnComments;
		$lan = trim($data->lan);
		$UserId = trim($data->UserId);
		$DivisionId = trim($data->DivisionId)?trim($data->DivisionId):0; 
		$DistrictId = trim($data->DistrictId)?trim($data->DistrictId):0; 
		$UpazilaId = trim($data->UpazilaId)?trim($data->UpazilaId):0; 
		// $DataTypeId = trim($data->DataTypeId); 
		// $YearId = trim($data->YearId); 
		// $QuarterId = trim($data->QuarterId); 

		$curDateTime = date('Y-m-d H:i:s');
		$UserFieldName = "";
		$DateFieldName = "";
		$ReturnCommentsFieldName = "";
		$BPosted = 0;
	
		try {

			$aQuerys = array();


			if($StatusNextPrev=="Next"){
				if($StatusId == 2){
					/**Submit all reports */
					$UserFieldName = "SubmitUserId";
					$DateFieldName = "SubmitDate";
					
					/**Only my reports will be submit all UserId=$UserId */
					$sql = "select PGId from t_pg 
					where UserId=$UserId 
					and StatusId=1
					and (DivisionId=$DivisionId OR $DivisionId=0)
					and (DistrictId=$DistrictId OR $DistrictId=0)
					and (UpazilaId=$UpazilaId OR $UpazilaId=0);";

				}else if($StatusId == 3){
					/**Accept all reports */
					$UserFieldName = "AcceptUserId";
					$DateFieldName = "AcceptDate";

					$sql = "select PGId from t_pg 
					where StatusId=2
					and (DivisionId=$DivisionId OR $DivisionId=0)
					and (DistrictId=$DistrictId OR $DistrictId=0)
					and (UpazilaId=$UpazilaId OR $UpazilaId=0);";

				}else if($StatusId == 5){
					/**Approve all reports */

					$UserFieldName = "ApproveUserId";
					$DateFieldName = "ApproveDate";
					$BPosted = 1;

					$sql = "select PGId from t_pg 
					where StatusId=3
					and (DivisionId=$DivisionId OR $DivisionId=0)
					and (DistrictId=$DistrictId OR $DistrictId=0)
					and (UpazilaId=$UpazilaId OR $UpazilaId=0);";
					
				}

				$rData = $dbh->query($sql);
				foreach($rData as $r){
		
					$PGId = $r["PGId"];

					$u = new updateq();
					$u->table = 't_pg';
					$u->columns = ['StatusId',$UserFieldName,$DateFieldName,'BPosted'];
					$u->values = [$StatusId,$UserId,$curDateTime,$BPosted];
					$u->pks = ['PGId'];
					$u->pk_values = [$PGId];
					$u->build_query();
					$aQuerys[] = $u;
				}

				

			}else{
				/**Not implement yet all return */


				// if($StatusId == 1){
				// 	$UserFieldName = "SubmitUserId";
				// 	$DateFieldName = "SubmitDate";
				// 	$ReturnCommentsFieldName = "AcceptReturnComments";

				// }else if($StatusId == 2){
				// 	$UserFieldName = "AcceptUserId";
				// 	$DateFieldName = "AcceptDate";
				// 	$ReturnCommentsFieldName = "ApproveReturnComments";
				// }

				// $u = new updateq();
				// $u->table = 't_pg';
				// $u->columns = ['StatusId',$UserFieldName,$DateFieldName,$ReturnCommentsFieldName,'BPosted'];
				// $u->values = [$StatusId,NULL,NULL,$ReturnComments,$BPosted];
				// $u->pks = ['DataValueMasterId'];
				// $u->pk_values = [$DataValueMasterId];
				// $u->build_query();
				// $aQuerys[] = $u;
			}


			if(count($aQuerys)==0){
				$returnData = [
					"success" => 0,
					"status" => 500,
					"UserId" => $UserId,
					"message" => "You have no reports"
				];
			}else{
				$res = exec_query($aQuerys, $UserId, $lan);
				$success = ($res['msgType'] == 'success') ? 1 : 0;
				$status = ($res['msgType'] == 'success') ? 200 : 500;
	
				$returnData = [
					"success" => $success,
					"status" => $status,
					"UserId" => $UserId,
					"message" => $res['msg']
				];
			}


	
		} catch (PDOException $e) {
			$returnData = msg(0, 500, $e->getMessage());
		}

		return $returnData;
	}
}

?>