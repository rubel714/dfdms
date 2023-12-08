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
			{"id":1,"Division":"Barishal","Dairy":8622,"Buffalo":1502,"BeefFattening":1680,"Goat":1004,"Sheep":55,"ScavengingChickens":3014,"Duck":911,"Quail":null,"Pigeon":163,"GrandTotal":16951},
			{"id":2,"Division":"Chattogram","Dairy":12088,"Buffalo":1036,"BeefFattening":2404,"Goat":1023,"Sheep":260,"ScavengingChickens":3641,"Duck":1184,"Quail":null,"Pigeon":59,"GrandTotal":21695},
			{"id":3,"Division":"Dhaka","Dairy":18585,"Buffalo":183,"BeefFattening":3208,"Goat":2059,"Sheep":227,"ScavengingChickens":4323,"Duck":965,"Quail":null,"Pigeon":62,"GrandTotal":29612},
			{"id":4,"Division":"Khulna","Dairy":15284,"Buffalo":163,"BeefFattening":3210,"Goat":3026,"Sheep":285,"ScavengingChickens":3175,"Duck":789,"Quail":null,"Pigeon":null,"GrandTotal":25932},
			{"id":5,"Division":"Mymensingh","Dairy":8285,"Buffalo":null,"BeefFattening":1859,"Goat":649,"Sheep":117,"ScavengingChickens":2059,"Duck":431,"Quail":20,"Pigeon":40,"GrandTotal":13460},
			{"id":6,"Division":"Rajshahi","Dairy":18691,"Buffalo":269,"BeefFattening":3980,"Goat":3116,"Sheep":802,"ScavengingChickens":4080,"Duck":660,"Quail":28,"Pigeon":null,"GrandTotal":31626},
			{"id":7,"Division":"Rangpur","Dairy":20858,"Buffalo":211,"BeefFattening":3934,"Goat":1648,"Sheep":560,"ScavengingChickens":3460,"Duck":649,"Quail":null,"Pigeon":null,"GrandTotal":31320},
			{"id":8,"Division":"Sylhet","Dairy":5397,"Buffalo":361,"BeefFattening":1338,"Goat":416,"Sheep":339,"ScavengingChickens":1002,"Duck":452,"Quail":null,"Pigeon":null,"GrandTotal":9305},
			{"id":9,"Division":"GrandTotal","Dairy":107810,"Buffalo":3725,"BeefFattening":21613,"Goat":12941,"Sheep":2645,"ScavengingChickens":24754,"Duck":6041,"Quail":48,"Pigeon":324,"GrandTotal":179901}
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