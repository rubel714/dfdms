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
			{"id":1,"Division":"Barishal","Dairy":257,"Buffalo":51,"BeefFattening":52,"Goat":31,"Sheep":2,"ScavengingChickens":88,"Duck":27,"Quail":null,"Pigeon":6,"GrandTotal":514},
			{"id":2,"Division":"Chattogram","Dairy":371,"Buffalo":33,"BeefFattening":76,"Goat":32,"Sheep":9,"ScavengingChickens":113,"Duck":37,"Quail":null,"Pigeon":2,"GrandTotal":673},
			{"id":3,"Division":"Dhaka","Dairy":550,"Buffalo":7,"BeefFattening":95,"Goat":62,"Sheep":8,"ScavengingChickens":133,"Duck":29,"Quail":null,"Pigeon":2,"GrandTotal":886},
			{"id":4,"Division":"Khulna","Dairy":471,"Buffalo":6,"BeefFattening":101,"Goat":95,"Sheep":9,"ScavengingChickens":101,"Duck":25,"Quail":null,"Pigeon":null,"GrandTotal":808},
			{"id":5,"Division":"Mymensingh","Dairy":247,"Buffalo":null,"BeefFattening":57,"Goat":20,"Sheep":5,"ScavengingChickens":63,"Duck":14,"Quail":1,"Pigeon":1,"GrandTotal":408},
			{"id":6,"Division":"Rajshahi","Dairy":560,"Buffalo":9,"BeefFattening":116,"Goat":92,"Sheep":26,"ScavengingChickens":124,"Duck":22,"Quail":1,"Pigeon":null,"GrandTotal":950},
			{"id":7,"Division":"Rangpur","Dairy":635,"Buffalo":7,"BeefFattening":118,"Goat":49,"Sheep":18,"ScavengingChickens":110,"Duck":20,"Quail":null,"Pigeon":null,"GrandTotal":957},
			{"id":8,"Division":"Sylhet","Dairy":175,"Buffalo":13,"BeefFattening":43,"Goat":14,"Sheep":11,"ScavengingChickens":33,"Duck":15,"Quail":null,"Pigeon":null,"GrandTotal":304},
			{"id":9,"Division":"GrandTotal","Dairy":3266,"Buffalo":126,"BeefFattening":658,"Goat":395,"Sheep":88,"ScavengingChickens":765,"Duck":189,"Quail":2,"Pigeon":11,"GrandTotal":5500}
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