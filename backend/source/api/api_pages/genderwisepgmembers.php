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


		/* $query = "SELECT a.PGId AS id, a.`DivisionId`, a.`DistrictId`, a.`UpazilaId`, a.`PGName`, a.`Address`, 
			b.`DivisionName`,c.`DistrictName`, d.`UpazilaName`, a.UnionId, a.PgGroupCode, 
			a.PgBankAccountNumber, a.BankName, a.ValuechainId, a.IsLeadByWomen, a.GenderId, a.IsActive, e.ValueChainName, f.UnionName,
			100 AS NoOfMembers
			FROM `t_pg` a
			INNER JOIN t_division b ON a.`DivisionId` = b.`DivisionId`
			INNER JOIN t_district c ON a.`DistrictId` = c.`DistrictId`
			INNER JOIN t_upazila d ON a.`UpazilaId` = d.`UpazilaId`
			INNER JOIN t_union f ON a.`UnionId` = f.`UnionId`
			LEFT JOIN t_valuechain e ON a.`ValuechainId` = e.`ValuechainId`
			WHERE (a.DivisionId = $DivisionId OR $DivisionId=0)
			AND (a.DistrictId = $DistrictId OR $DistrictId=0)
			AND (a.UpazilaId = $UpazilaId OR $UpazilaId=0)
			ORDER BY b.`DivisionName`, c.`DistrictName`, d.`UpazilaName`, a.`PGName` ASC;";
			
		
		$resultdata = $dbh->query($query); */

		$jsonData = '[
			{"id":1,"FirstCol":"Female","Dairy":47790,"Buffalo":502,"BeefFattening":8905,"Goat":12941,"Sheep":2645,"ScavengingChickens":24739,"Duck":6041,"Quail":48,"Pigeon":249,"GrandTotal":103860,"percentofSex":"57.70%"},
			{"id":2,"FirstCol":"Male","Dairy":60020,"Buffalo":3223,"BeefFattening":12708,"Goat":"","Sheep":"","ScavengingChickens":"","Duck":"","Quail":75,"Pigeon":324,"GrandTotal":76026,"percentofSex":"42.29%"},
			{"id":3,"FirstCol":"Transgender","Dairy":"","Buffalo":"","BeefFattening":"","Goat":"","Sheep":"","ScavengingChickens":15,"Duck":"","Quail":"","Pigeon":"","GrandTotal":15,"percentofSex":"0.01%"},
			{"id":4,"FirstCol":"Grand Total","Dairy":107810,"Buffalo":3725,"BeefFattening":21613,"Goat":12941,"Sheep":2645,"ScavengingChickens":24754,"Duck":6041,"Quail":48,"Pigeon":324,"GrandTotal":179901,"percentofSex":"100.00%"}
		  ]';  
		  $resultdata = json_decode($jsonData, true);

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


?>