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
		

		$query = "SELECT a.UpazilaId AS id, a.`DivisionId`, a.`DistrictId`, a.`UpazilaName`, 
			b.`DivisionName`,c.`DistrictName`,
			a.`IsCityCorporation`, case when a.IsCityCorporation=1 then 'Yes' else 'No' end IsCityCorporationName
			FROM `t_upazila` a
			INNER JOIN t_division b ON a.`DivisionId` = b.`DivisionId`
			INNER JOIN t_district c ON a.`DistrictId` = c.`DistrictId`
			WHERE (a.DivisionId = $DivisionId OR $DivisionId=0)
			AND (a.DistrictId = $DistrictId OR $DistrictId=0)
			
			ORDER BY b.`DivisionName`, c.`DistrictName`, a.`UpazilaName` ASC;";
		
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

		$UpazilaId = $data->rowData->id;
		$UpazilaName = $data->rowData->UpazilaName;
		$DivisionId = $data->rowData->DivisionId;
		$DistrictId = $data->rowData->DistrictId;
		$IsCityCorporation = $data->rowData->IsCityCorporation ? $data->rowData->IsCityCorporation : 0;
	
		try{

			$dbh = new Db();
			$aQuerys = array();

			if($UpazilaId == ""){
				$q = new insertq();
				$q->table = 't_upazila';
				$q->columns = ['UpazilaName','DivisionId','DistrictId','IsCityCorporation'];
				$q->values = [$UpazilaName,$DivisionId,$DistrictId,$IsCityCorporation];
				$q->pks = ['UpazilaId'];
				$q->bUseInsetId = false;
				$q->build_query();
				$aQuerys = array($q); 
			}else{
				$u = new updateq();
				$u->table = 't_upazila';
				$u->columns = ['UpazilaName','DivisionId','DistrictId','IsCityCorporation'];
				$u->values = [$UpazilaName,$DivisionId,$DistrictId,$IsCityCorporation];
				$u->pks = ['UpazilaId'];
				$u->pk_values = [$UpazilaId];
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
		
		$UpazilaId = $data->rowData->id;
		$lan = trim($data->lan); 
		$UserId = trim($data->UserId); 

		try{

			$dbh = new Db();
			
            $d = new deleteq();
            $d->table = 't_upazila';
            $d->pks = ['UpazilaId'];
            $d->pk_values = [$UpazilaId];
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