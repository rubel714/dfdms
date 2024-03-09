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


		$query = "SELECT a.PGId AS id, b.`DivisionName`,c.`DistrictName`, d.`UpazilaName`, e.ValueChainName, a.`PGName`, 
		COUNT(f.`FarmerId`) AS NoOfMembers
		FROM `t_pg` a
		INNER JOIN t_division b ON a.`DivisionId` = b.`DivisionId`
		INNER JOIN t_district c ON a.`DistrictId` = c.`DistrictId`
		INNER JOIN t_upazila d ON a.`UpazilaId` = d.`UpazilaId`
		INNER JOIN t_valuechain e ON a.`ValuechainId` = e.`ValuechainId`
		INNER JOIN `t_farmer` f ON a.`PGId` = f.PGId
		WHERE (a.DivisionId = $DivisionId OR $DivisionId=0)
		AND (a.DistrictId = $DistrictId OR $DistrictId=0)
		AND (a.UpazilaId = $UpazilaId OR $UpazilaId=0)
		GROUP BY b.`DivisionName`,c.`DistrictName`, d.`UpazilaName`, e.ValueChainName,a.`PGName`;";
			
		
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