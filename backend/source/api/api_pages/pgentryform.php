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


		$query = "SELECT a.PGId AS id, a.`DivisionId`, a.`DistrictId`, a.`UpazilaId`, a.`PGName`, a.`Address`, 
			b.`DivisionName`,c.`DistrictName`, d.`UpazilaName`, a.UnionId, a.PgGroupCode, 
			a.PgBankAccountNumber, y.BankName, a.ValuechainId, a.IsLeadByWomen, a.GenderId, a.IsActive, e.ValueChainName, f.UnionName
			, a.DateofPgInformation, a.BankId
			FROM `t_pg` a
			INNER JOIN t_division b ON a.`DivisionId` = b.`DivisionId`
			INNER JOIN t_district c ON a.`DistrictId` = c.`DistrictId`
			INNER JOIN t_upazila d ON a.`UpazilaId` = d.`UpazilaId`
			INNER JOIN t_union f ON a.`UnionId` = f.`UnionId`
			LEFT JOIN t_valuechain e ON a.`ValuechainId` = e.`ValuechainId`
			LEFT JOIN t_bank y ON a.`BankId` = y.`BankId`
			WHERE (a.DivisionId = $DivisionId OR $DivisionId=0)
			AND (a.DistrictId = $DistrictId OR $DistrictId=0)
			AND (a.UpazilaId = $UpazilaId OR $UpazilaId=0)
			ORDER BY b.`DivisionName`, c.`DistrictName`, d.`UpazilaName`, a.`PGName` ASC;";
		
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
		
		

		try{

			$dbh = new Db();
			$aQuerys = array();

			if($PGId == ""){
				$q = new insertq();
				$q->table = 't_pg';
				$q->columns = ['PGName','DivisionId','DistrictId','UpazilaId','Address', 'UnionId','PgGroupCode', 'PgBankAccountNumber','BankName', 'ValuechainId', 'IsLeadByWomen', 'GenderId', 'IsActive','BankId','DateofPgInformation'];
				$q->values = [$PGName,$DivisionId,$DistrictId,$UpazilaId,$Address, $UnionId, $PgGroupCode, $PgBankAccountNumber, $BankName, $ValuechainId, $IsLeadByWomen, $GenderId, $IsActive, $BankId, $DateofPgInformation];
				$q->pks = ['PGId'];
				$q->bUseInsetId = false;
				$q->build_query();
				$aQuerys = array($q); 
			}else{
				$u = new updateq();
				$u->table = 't_pg';
				$u->columns = ['PGName','DivisionId','DistrictId','UpazilaId','Address','UnionId','PgGroupCode', 'PgBankAccountNumber', 'BankName', 'ValuechainId', 'IsLeadByWomen', 'GenderId', 'IsActive','BankId','DateofPgInformation'];
				$u->values = [$PGName,$DivisionId,$DistrictId,$UpazilaId,$Address, $UnionId, $PgGroupCode, $PgBankAccountNumber, $BankName, $ValuechainId, $IsLeadByWomen, $GenderId, $IsActive, $BankId, $DateofPgInformation];
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


?>