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

		/* $jsonData = '[
			{"id":1,"Division":"Barishal","Dairy":257,"Buffalo":51,"BeefFattening":52,"Goat":31,"Sheep":2,"ScavengingChickens":88,"Duck":27,"Quail":null,"Pigeon":6,"GrandTotal":514},
			{"id":2,"Division":"Chattogram","Dairy":371,"Buffalo":33,"BeefFattening":76,"Goat":32,"Sheep":9,"ScavengingChickens":113,"Duck":37,"Quail":null,"Pigeon":2,"GrandTotal":673},
			{"id":3,"Division":"Dhaka","Dairy":550,"Buffalo":7,"BeefFattening":95,"Goat":62,"Sheep":8,"ScavengingChickens":133,"Duck":29,"Quail":null,"Pigeon":2,"GrandTotal":886},
			{"id":4,"Division":"Khulna","Dairy":471,"Buffalo":6,"BeefFattening":101,"Goat":95,"Sheep":9,"ScavengingChickens":101,"Duck":25,"Quail":null,"Pigeon":null,"GrandTotal":808},
			{"id":5,"Division":"Mymensingh","Dairy":247,"Buffalo":null,"BeefFattening":57,"Goat":20,"Sheep":5,"ScavengingChickens":63,"Duck":14,"Quail":1,"Pigeon":1,"GrandTotal":408},
			{"id":6,"Division":"Rajshahi","Dairy":560,"Buffalo":9,"BeefFattening":116,"Goat":92,"Sheep":26,"ScavengingChickens":124,"Duck":22,"Quail":1,"Pigeon":null,"GrandTotal":950},
			{"id":7,"Division":"Rangpur","Dairy":635,"Buffalo":7,"BeefFattening":118,"Goat":49,"Sheep":18,"ScavengingChickens":110,"Duck":20,"Quail":null,"Pigeon":null,"GrandTotal":957},
			{"id":8,"Division":"Sylhet","Dairy":175,"Buffalo":13,"BeefFattening":43,"Goat":14,"Sheep":11,"ScavengingChickens":33,"Duck":15,"Quail":null,"Pigeon":null,"GrandTotal":304},
			{"id":9,"Division":"GrandTotal","Dairy":3266,"Buffalo":126,"BeefFattening":658,"Goat":395,"Sheep":88,"ScavengingChickens":765,"Duck":189,"Quail":2,"Pigeon":11,"GrandTotal":5500}
		]'; */

		$jsonData = '[
			{"Division":"Barishal","District":"Barishal","Upazila":"Agailjhara","DairyPG":7,"DairyPGMembers":218,"BuffaloPG":null,"BuffaloPGMembers":null,"BeefFatteningPG":null,"BeefFatteningPGMembers":null,"GoatPG":null,"GoatPGMembers":null,"SheepPG":null,"SheepPGMembers":null,"ScavengingChickensPG":1,"ScavengingChickensPGMembers":31,"DuckPG":null,"DuckPGMembers":null,"QuailPG":null,"QuailPGMembers":null,"PigeonPG":null,"PigeonPGMembers":null,"TotalPG":8,"TotalPGMembers":249},
			{"Division":"","District":"","Upazila":"Babugonj","DairyPG":5,"DairyPGMembers":200,"BuffaloPG":null,"BuffaloPGMembers":null,"BeefFatteningPG":1,"BeefFatteningPGMembers":29,"GoatPG":1,"GoatPGMembers":30,"SheepPG":null,"SheepPGMembers":null,"ScavengingChickensPG":1,"ScavengingChickensPGMembers":38,"DuckPG":null,"DuckPGMembers":null,"QuailPG":null,"QuailPGMembers":null,"PigeonPG":null,"PigeonPGMembers":null,"TotalPG":8,"TotalPGMembers":297},
			{"Division":"","District":"","Upazila":"Bakergonj","DairyPG":5,"DairyPGMembers":183,"BuffaloPG":2,"BuffaloPGMembers":47,"BeefFatteningPG":1,"BeefFatteningPGMembers":37,"GoatPG":null,"GoatPGMembers":null,"SheepPG":null,"SheepPGMembers":null,"ScavengingChickensPG":null,"ScavengingChickensPGMembers":null,"DuckPG":2,"DuckPGMembers":80,"QuailPG":1,"QuailPGMembers":36,"PigeonPG":null,"PigeonPGMembers":null,"TotalPG":11,"TotalPGMembers":383},
			{"Division":"","District":"","Upazila":"Banaripara","DairyPG":5,"DairyPGMembers":167,"BuffaloPG":null,"BuffaloPGMembers":null,"BeefFatteningPG":1,"BeefFatteningPGMembers":32,"GoatPG":null,"GoatPGMembers":null,"SheepPG":null,"SheepPGMembers":null,"ScavengingChickensPG":null,"ScavengingChickensPGMembers":null,"DuckPG":1,"DuckPGMembers":32,"QuailPG":null,"QuailPGMembers":null,"PigeonPG":null,"PigeonPGMembers":null,"TotalPG":7,"TotalPGMembers":231},
			{"Division":"","District":"","Upazila":"Barishal Sadar","DairyPG":8,"DairyPGMembers":225,"BuffaloPG":2,"BuffaloPGMembers":51,"BeefFatteningPG":2,"BeefFatteningPGMembers":59,"GoatPG":2,"GoatPGMembers":55,"SheepPG":null,"SheepPGMembers":null,"ScavengingChickensPG":4,"ScavengingChickensPGMembers":122,"DuckPG":2,"DuckPGMembers":60,"QuailPG":null,"QuailPGMembers":null,"PigeonPG":2,"PigeonPGMembers":40,"TotalPG":22,"TotalPGMembers":612},
			{"Division":"","District":"","Upazila":"Gouranadi","DairyPG":4,"DairyPGMembers":130,"BuffaloPG":null,"BuffaloPGMembers":null,"BeefFatteningPG":1,"BeefFatteningPGMembers":30,"GoatPG":null,"GoatPGMembers":null,"SheepPG":null,"SheepPGMembers":null,"ScavengingChickensPG":1,"ScavengingChickensPGMembers":30,"DuckPG":null,"DuckPGMembers":null,"QuailPG":null,"QuailPGMembers":null,"PigeonPG":null,"PigeonPGMembers":null,"TotalPG":6,"TotalPGMembers":190},
			{"Division":"","District":"","Upazila":"Hizla","DairyPG":6,"DairyPGMembers":239,"BuffaloPG":2,"BuffaloPGMembers":81,"BeefFatteningPG":1,"BeefFatteningPGMembers":40,"GoatPG":null,"GoatPGMembers":null,"SheepPG":null,"SheepPGMembers":null,"ScavengingChickensPG":1,"ScavengingChickensPGMembers":39,"DuckPG":1,"DuckPGMembers":38,"QuailPG":null,"QuailPGMembers":null,"PigeonPG":null,"PigeonPGMembers":null,"TotalPG":11,"TotalPGMembers":437},
			{"Division":"","District":"","Upazila":"Mehendigonj","DairyPG":5,"DairyPGMembers":121,"BuffaloPG":3,"BuffaloPGMembers":60,"BeefFatteningPG":1,"BeefFatteningPGMembers":24,"GoatPG":null,"GoatPGMembers":null,"SheepPG":null,"SheepPGMembers":null,"ScavengingChickensPG":1,"ScavengingChickensPGMembers":20,"DuckPG":1,"DuckPGMembers":20,"QuailPG":null,"QuailPGMembers":null,"PigeonPG":null,"PigeonPGMembers":null,"TotalPG":11,"TotalPGMembers":245},
			{"Division":"","District":"","Upazila":"Muladi","DairyPG":5,"DairyPGMembers":142,"BuffaloPG":null,"BuffaloPGMembers":null,"BeefFatteningPG":1,"BeefFatteningPGMembers":30,"GoatPG":null,"GoatPGMembers":null,"SheepPG":null,"SheepPGMembers":null,"ScavengingChickensPG":1,"ScavengingChickensPGMembers":30,"DuckPG":null,"DuckPGMembers":null,"QuailPG":null,"QuailPGMembers":null,"PigeonPG":null,"PigeonPGMembers":null,"TotalPG":7,"TotalPGMembers":202},
			{"Division":"","District":"","Upazila":"Uzirpur","DairyPG":5,"DairyPGMembers":151,"BuffaloPG":null,"BuffaloPGMembers":null,"BeefFatteningPG":1,"BeefFatteningPGMembers":29,"GoatPG":1,"GoatPGMembers":29,"SheepPG":null,"SheepPGMembers":null,"ScavengingChickensPG":1,"ScavengingChickensPGMembers":33,"DuckPG":null,"DuckPGMembers":null,"QuailPG":null,"QuailPGMembers":null,"PigeonPG":null,"PigeonPGMembers":null,"TotalPG":8,"TotalPGMembers":242},
			{"Division":"","District":"Barishal Total","Upazila":null,"DairyPG":55,"DairyPGMembers":1776,"BuffaloPG":9,"BuffaloPGMembers":239,"BeefFatteningPG":10,"BeefFatteningPGMembers":310,"GoatPG":4,"GoatPGMembers":114,"SheepPG":null,"SheepPGMembers":null,"ScavengingChickensPG":14,"ScavengingChickensPGMembers":455,"DuckPG":5,"DuckPGMembers":154,"QuailPG":null,"QuailPGMembers":null,"PigeonPG":2,"PigeonPGMembers":40,"TotalPG":99,"TotalPGMembers":3088},
			{"Division":"","District":"Bhola","Upazila":"Bhola Sadar","DairyPG":14,"DairyPGMembers":501,"BuffaloPG":5,"BuffaloPGMembers":161,"BeefFatteningPG":2,"BeefFatteningPGMembers":76,"GoatPG":1,"GoatPGMembers":36,"SheepPG":null,"SheepPGMembers":null,"ScavengingChickensPG":5,"ScavengingChickensPGMembers":189,"DuckPG":1,"DuckPGMembers":33,"QuailPG":null,"QuailPGMembers":null,"PigeonPG":null,"PigeonPGMembers":null,"TotalPG":28,"TotalPGMembers":996},
			{"Division":"","District":"","Upazila":"Borhanuddin","DairyPG":6,"DairyPGMembers":198,"BuffaloPG":2,"BuffaloPGMembers":57,"BeefFatteningPG":1,"BeefFatteningPGMembers":35,"GoatPG":1,"GoatPGMembers":40,"SheepPG":null,"SheepPGMembers":null,"ScavengingChickensPG":3,"ScavengingChickensPGMembers":111,"DuckPG":1,"DuckPGMembers":39,"QuailPG":null,"QuailPGMembers":null,"PigeonPG":null,"PigeonPGMembers":null,"TotalPG":14,"TotalPGMembers":480},
			{"Division":"","District":"","Upazila":"Charfashion","DairyPG":7,"DairyPGMembers":255,"BuffaloPG":2,"BuffaloPGMembers":69,"BeefFatteningPG":2,"BeefFatteningPGMembers":59,"GoatPG":1,"GoatPGMembers":34,"SheepPG":null,"SheepPGMembers":null,"ScavengingChickensPG":1,"ScavengingChickensPGMembers":40,"DuckPG":1,"DuckPGMembers":35,"QuailPG":null,"QuailPGMembers":null,"PigeonPG":null,"PigeonPGMembers":null,"TotalPG":14,"TotalPGMembers":492},
			{"Division":"","District":"","Upazila":"Daulatkhan","DairyPG":4,"DairyPGMembers":138,"BuffaloPG":2,"BuffaloPGMembers":73,"BeefFatteningPG":1,"BeefFatteningPGMembers":40,"GoatPG":null,"GoatPGMembers":null,"SheepPG":null,"SheepPGMembers":null,"ScavengingChickensPG":null,"ScavengingChickensPGMembers":null,"DuckPG":2,"DuckPGMembers":77,"QuailPG":1,"QuailPGMembers":33,"PigeonPG":null,"PigeonPGMembers":null,"TotalPG":10,"TotalPGMembers":361},
			{"Division":"","District":"","Upazila":"Lalmohon","DairyPG":6,"DairyPGMembers":239,"BuffaloPG":2,"BuffaloPGMembers":57,"BeefFatteningPG":1,"BeefFatteningPGMembers":40,"GoatPG":1,"GoatPGMembers":40,"SheepPG":null,"SheepPGMembers":null,"ScavengingChickensPG":2,"ScavengingChickensPGMembers":79,"DuckPG":1,"DuckPGMembers":40,"QuailPG":null,"QuailPGMembers":null,"PigeonPG":null,"PigeonPGMembers":null,"TotalPG":13,"TotalPGMembers":495},
			{"Division":"","District":"","Upazila":"Monpura","DairyPG":1,"DairyPGMembers":40,"BuffaloPG":3,"BuffaloPGMembers":118,"BeefFatteningPG":null,"BeefFatteningPGMembers":null,"GoatPG":null,"GoatPGMembers":null,"SheepPG":null,"SheepPGMembers":null,"ScavengingChickensPG":2,"ScavengingChickensPGMembers":75,"DuckPG":1,"DuckPGMembers":35,"QuailPG":null,"QuailPGMembers":null,"PigeonPG":null,"PigeonPGMembers":null,"TotalPG":7,"TotalPGMembers":268},
			{"Division":"","District":"","Upazila":"Tojumuddin","DairyPG":2,"DairyPGMembers":60,"BuffaloPG":1,"BuffaloPGMembers":28,"BeefFatteningPG":null,"BeefFatteningPGMembers":null,"GoatPG":null,"GoatPGMembers":null,"SheepPG":null,"SheepPGMembers":null,"ScavengingChickensPG":1,"ScavengingChickensPGMembers":29,"DuckPG":1,"DuckPGMembers":28,"QuailPG":null,"QuailPGMembers":null,"PigeonPG":null,"PigeonPGMembers":null,"TotalPG":5,"TotalPGMembers":145},
			{"Division":"","District":"Bhola Total","Upazila":null,"DairyPG":40,"DairyPGMembers":1431,"BuffaloPG":17,"BuffaloPGMembers":563,"BeefFatteningPG":7,"BeefFatteningPGMembers":250,"GoatPG":4,"GoatPGMembers":150,"SheepPG":null,"SheepPGMembers":null,"ScavengingChickensPG":16,"ScavengingChickensPGMembers":600,"DuckPG":7,"DuckPGMembers":243,"QuailPG":null,"QuailPGMembers":null,"PigeonPG":null,"PigeonPGMembers":null,"TotalPG":91,"TotalPGMembers":3237},
			{"Division":"Barishal Total","District":null,"Upazila":null,"DairyPG":null,"DairyPGMembers":257,"BuffaloPG":null,"BuffaloPGMembers":8622,"BeefFatteningPG":51,"BeefFatteningPGMembers":1502,"GoatPG":52,"GoatPGMembers":1680,"SheepPG":31,"SheepPGMembers":1004,"ScavengingChickensPG":2,"ScavengingChickensPGMembers":55,"DuckPG":88,"DuckPGMembers":3014,"QuailPG":27,"QuailPGMembers":911,"PigeonPG":null,"PigeonPGMembers":null,"TotalPG":6,"TotalPGMembers":163,"TotalPG":514,"TotalPGMembers":16951},
			{"Division":"Grand Total","District":null,"Upazila":null,"DairyPG":null,"DairyPGMembers":3266,"BuffaloPG":null,"BuffaloPGMembers":107810,"BeefFatteningPG":126,"BeefFatteningPGMembers":3725,"GoatPG":658,"GoatPGMembers":21613,"SheepPG":395,"SheepPGMembers":12941,"ScavengingChickensPG":88,"ScavengingChickensPGMembers":2645,"DuckPG":765,"DuckPGMembers":24754,"QuailPG":189,"QuailPGMembers":6041,"PigeonPG":2,"PigeonPGMembers":48,"TotalPG":11,"TotalPGMembers":324,"TotalPG":5500,"TotalPGMembers":179901}
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