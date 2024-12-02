<?php

$task = '';
if(isset($data->action)) {
	$task = trim($data->action);
}

switch($task){
	
	case "getDataList":
		$returnData = getDataList($data);
	break;

	
	case "assignData":
		$returnData = assignData($data);
		break;

	default :
		echo "{failure:true}";
		break;
}

function getDataList($data){

	
	$ClientId = trim($data->ClientId); 
	//$BranchId = trim($data->BranchId); 

	try{
		$dbh = new Db();
		$query = "SELECT SettingId AS id, SettingName, `Status`
		FROM t_settings
		ORDER BY `SettingId` ASC;";		
		
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



function assignData($data)
{

	if ($_SERVER["REQUEST_METHOD"] != "POST") {
		return $returnData = msg(0, 404, 'Page Not Found!');
	}{

		$SettingId = $data->rowData->id;
		$Status = $data->rowData->Status;
		$lan = trim($data->lan);
		$UserId = trim($data->UserId);

		$UpdatedStatus = ($Status == 0) ? 1 : 0;


		try {

			$dbh = new Db();

			$aQuerys = array();

			$u = new updateq();
			$u->table = 't_settings';
			$u->columns = ['Status'];
			$u->values = [$UpdatedStatus];
			$u->pks = ['SettingId'];
			$u->pk_values = [$SettingId];
			$u->build_query();
			$aQuerys = array($u);

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



?>