<?php

$task = '';
if (isset($data->action)) {
	$task = trim($data->action);
}

switch ($task) {

	case "getDataList":
		$returnData = getDataList($data);
		break;

	default:
		echo "{failure:true}";
		break;
}

function getDataList($data)
{

	try {
		$dbh = new Db();
		$DivisionId = trim($data->DivisionId) ? trim($data->DivisionId) : 0;
		$DistrictId = trim($data->DistrictId) ? trim($data->DistrictId) : 0;
		$UpazilaId = trim($data->UpazilaId) ? trim($data->UpazilaId) : 0;



		$query = "SELECT q.`DivisionName`,r.`DistrictName`,s.`UpazilaName`,t.`DivisionId`,t.`DistrictId`,t.`UpazilaId`
		 ,SUM(DairyPG) DairyPG,SUM(DairyFarmer) DairyFarmer
		 ,SUM(BuffaloPG) BuffaloPG, SUM(BuffaloFarmer) BuffaloFarmer
		 ,SUM(BeefFatteningPG) BeefFatteningPG, SUM(BeefFatteningFarmer) BeefFatteningFarmer
		 ,SUM(GoatPG) GoatPG, SUM(GoatFarmer) GoatFarmer
		 ,SUM(SheepPG) SheepPG, SUM(SheepFarmer) SheepFarmer
		 ,SUM(ScavengingChickensPG) ScavengingChickensPG, SUM(ScavengingChickensFarmer) ScavengingChickensFarmer
		 ,SUM(DuckPG) DuckPG, SUM(DuckFarmer) DuckFarmer
		 ,SUM(QuailPG) QuailPG, SUM(QuailFarmer) QuailFarmer
		 ,SUM(PigeonPG) PigeonPG,SUM(PigeonFarmer) PigeonFarmer		 
		 ,0 RowTotalPG, 0 RowTotalFarmer
		 FROM
		 
		 (SELECT f.`DivisionId`,f.`DistrictId`,f.`UpazilaId`
		 ,(CASE WHEN f.`ValuechainId`='DAIRY' THEN 1 ELSE 0 END) DairyPG,0 DairyFarmer
		 ,(CASE WHEN f.`ValuechainId`='BUFFALO' THEN 1 ELSE 0 END) BuffaloPG, 0 BuffaloFarmer
		 ,(CASE WHEN f.`ValuechainId`='BEEFFATTENING' THEN 1 ELSE 0 END) BeefFatteningPG, 0 BeefFatteningFarmer
		 ,(CASE WHEN f.`ValuechainId`='GOAT' THEN 1 ELSE 0 END) GoatPG, 0 GoatFarmer
		 ,(CASE WHEN f.`ValuechainId`='SHEEP' THEN 1 ELSE 0 END) SheepPG, 0 SheepFarmer
		 ,(CASE WHEN f.`ValuechainId`='SCAVENGINGCHICKENLOCAL' THEN 1 ELSE 0 END) ScavengingChickensPG, 0 ScavengingChickensFarmer
		 ,(CASE WHEN f.`ValuechainId`='DUCK' THEN 1 ELSE 0 END) DuckPG, 0 DuckFarmer
		 ,(CASE WHEN f.`ValuechainId`='QUAIL' THEN 1 ELSE 0 END) QuailPG, 0 QuailFarmer
		 ,(CASE WHEN f.`ValuechainId`='PIGEON' THEN 1 ELSE 0 END) PigeonPG,0 PigeonFarmer
		 FROM `t_pg` f
		 WHERE (f.DivisionId = $DivisionId OR $DivisionId=0)
		 AND (f.DistrictId = $DistrictId OR $DistrictId=0)
		 AND (f.UpazilaId = $UpazilaId OR $UpazilaId=0)
		 
		 UNION ALL
		 
		 SELECT f.`DivisionId`,f.`DistrictId`,f.`UpazilaId`
		 ,0 DairyPG, (CASE WHEN f.`ValueChain`='DAIRY' THEN 1 ELSE 0 END) DairyFarmer
		 ,0 BuffaloPG,(CASE WHEN f.`ValueChain`='BUFFALO' THEN 1 ELSE 0 END) BuffaloFarmer
		 ,0 BeefFatteningPG,(CASE WHEN f.`ValueChain`='BEEFFATTENING' THEN 1 ELSE 0 END) BeefFatteningFarmer
		 ,0 BeefFatteningPG,(CASE WHEN f.`ValueChain`='GOAT' THEN 1 ELSE 0 END) GoatFarmer
		 ,0 SheepPG,(CASE WHEN f.`ValueChain`='SHEEP' THEN 1 ELSE 0 END) SheepFarmer
		 ,0 ScavengingChickensPG,(CASE WHEN f.`ValueChain`='SCAVENGINGCHICKENLOCAL' THEN 1 ELSE 0 END) ScavengingChickensFarmer
		 ,0 DuckPG,(CASE WHEN f.`ValueChain`='DUCK' THEN 1 ELSE 0 END) DuckFarmer
		 ,0 QuailPG,(CASE WHEN f.`ValueChain`='QUAIL' THEN 1 ELSE 0 END) QuailFarmer
		 ,0 PigeonPG,(CASE WHEN f.`ValueChain`='PIGEON' THEN 1 ELSE 0 END) PigeonFarmer
		 FROM `t_farmer` f
		 WHERE (f.DivisionId = $DivisionId OR $DivisionId=0)
		 AND (f.DistrictId = $DistrictId OR $DistrictId=0)
		 AND (f.UpazilaId = $UpazilaId OR $UpazilaId=0)
		 ) t
		 INNER JOIN `t_division` q ON t.`DivisionId`=q.`DivisionId`
		 INNER JOIN `t_district` r ON t.`DistrictId`=r.`DistrictId`
		 INNER JOIN `t_upazila` s ON t.`UpazilaId`=s.`UpazilaId`
		 GROUP BY q.`DivisionName`,r.`DistrictName`,s.`UpazilaName`,t.`DivisionId`,t.`DistrictId`,t.`UpazilaId`;";

		$resultdata = $dbh->query($query);

		$TotalDairyPG = 0;
		$TotalDairyFarmer = 0;
		$TotalBuffaloPG = 0;
		$TotalBuffaloFarmer = 0;
		$TotalBeefFatteningPG = 0;
		$TotalBeefFatteningFarmer = 0;
		$TotalGoatPG = 0;
		$TotalGoatFarmer = 0;
		$TotalSheepPG = 0;
		$TotalSheepFarmer = 0;
		$TotalScavengingChickensPG = 0;
		$TotalScavengingChickensFarmer = 0;
		$TotalDuckPG = 0;
		$TotalDuckFarmer = 0;
		$TotalQuailPG = 0;
		$TotalQuailFarmer = 0;
		$TotalPigeonPG = 0;
		$TotalPigeonFarmer = 0;
		$TotalRowTotalPG = 0;
		$TotalRowTotalFarmer = 0;


		$dataList = array();
		foreach ($resultdata as $key => $row) {
			$row["RowTotalPG"]=$row["DairyPG"]+ $row["BuffaloPG"]+$row["BeefFatteningPG"]+$row["GoatPG"]+$row["SheepPG"]+$row["ScavengingChickensPG"]+$row["DuckPG"]+$row["QuailPG"]+$row["PigeonPG"];
			$row["RowTotalFarmer"]=$row["DairyFarmer"]+ $row["BuffaloFarmer"]+$row["BeefFatteningFarmer"]+$row["GoatFarmer"]+$row["SheepFarmer"]+$row["ScavengingChickensFarmer"]+$row["DuckFarmer"]+$row["QuailFarmer"]+$row["PigeonFarmer"];
			
			$dataList[] = $row;

			/**Calculate column total */
			$TotalDairyPG += $row["DairyPG"];
			$TotalDairyFarmer += $row["DairyFarmer"];
			$TotalBuffaloPG += $row["BuffaloPG"];
			$TotalBuffaloFarmer += $row["BuffaloFarmer"];
			$TotalBeefFatteningPG += $row["BeefFatteningPG"];
			$TotalBeefFatteningFarmer += $row["BeefFatteningFarmer"];
			$TotalGoatPG += $row["GoatPG"];
			$TotalGoatFarmer += $row["GoatFarmer"];
			$TotalSheepPG += $row["SheepPG"];
			$TotalSheepFarmer += $row["SheepFarmer"];
			$TotalScavengingChickensPG += $row["ScavengingChickensPG"];
			$TotalScavengingChickensFarmer += $row["ScavengingChickensFarmer"];
			$TotalDuckPG += $row["DuckPG"];
			$TotalDuckFarmer += $row["DuckFarmer"];
			$TotalQuailPG += $row["QuailPG"];
			$TotalQuailFarmer += $row["QuailFarmer"];
			$TotalPigeonPG += $row["PigeonPG"];
			$TotalPigeonFarmer += $row["PigeonFarmer"];

		
			$TotalRowTotalPG += $row["RowTotalPG"];
			$TotalRowTotalFarmer += $row["RowTotalFarmer"];
		}


		/**For Total row */
		if (count($dataList) > 0) {
			$row = array();
			// q.`DivisionName`,r.`DistrictName`,s.`UpazilaName`
			$row["DivisionName"]="";
			$row["DistrictName"]="";
			$row["UpazilaName"]="";
			$row["DairyPG"]=$TotalDairyPG;
			$row["DairyFarmer"]=$TotalDairyFarmer;
			$row["BuffaloPG"]=$TotalBuffaloPG;
			$row["BuffaloFarmer"]=$TotalBuffaloFarmer;
			$row["BeefFatteningPG"]=$TotalBeefFatteningPG;
			$row["BeefFatteningFarmer"]=$TotalBeefFatteningFarmer;
			$row["GoatPG"]=$TotalGoatPG;
			$row["GoatFarmer"]=$TotalGoatFarmer;
			$row["SheepPG"]=$TotalSheepPG;
			$row["SheepFarmer"]=$TotalSheepFarmer;
			$row["ScavengingChickensPG"]=$TotalScavengingChickensPG;
			$row["ScavengingChickensFarmer"]=$TotalScavengingChickensFarmer;
			$row["DuckPG"]=$TotalDuckPG;
			$row["DuckFarmer"]=$TotalDuckFarmer;
			$row["QuailPG"]=$TotalQuailPG;
			$row["QuailFarmer"]=$TotalQuailFarmer;
			$row["PigeonPG"]=$TotalPigeonPG;
			$row["PigeonFarmer"]=$TotalPigeonFarmer;

			$row["RowTotalPG"]=$TotalRowTotalPG;
			$row["RowTotalFarmer"]=$TotalRowTotalFarmer;




			$dataList[] = $row;
		}



		// $jsonData = '[
		// 	{"Division":"Barishal","District":"Barishal","Upazila":"Agailjhara","DairyPG":7,"DairyPGMembers":218,"BuffaloPG":null,"BuffaloPGMembers":null,"BeefFatteningPG":null,"BeefFatteningPGMembers":null,"GoatPG":null,"GoatPGMembers":null,"SheepPG":null,"SheepPGMembers":null,"ScavengingChickensPG":1,"ScavengingChickensPGMembers":31,"DuckPG":null,"DuckPGMembers":null,"QuailPG":null,"QuailPGMembers":null,"PigeonPG":null,"PigeonPGMembers":null,"TotalPG":8,"TotalPGMembers":249},
		// 	{"Division":"ss","District":"","Upazila":"Babugonj","DairyPG":5,"DairyPGMembers":200,"BuffaloPG":null,"BuffaloPGMembers":null,"BeefFatteningPG":1,"BeefFatteningPGMembers":29,"GoatPG":1,"GoatPGMembers":30,"SheepPG":null,"SheepPGMembers":null,"ScavengingChickensPG":1,"ScavengingChickensPGMembers":38,"DuckPG":null,"DuckPGMembers":null,"QuailPG":null,"QuailPGMembers":null,"PigeonPG":null,"PigeonPGMembers":null,"TotalPG":8,"TotalPGMembers":297},
		// 	{"Division":"","District":"","Upazila":"Bakergonj","DairyPG":5,"DairyPGMembers":183,"BuffaloPG":2,"BuffaloPGMembers":47,"BeefFatteningPG":1,"BeefFatteningPGMembers":37,"GoatPG":null,"GoatPGMembers":null,"SheepPG":null,"SheepPGMembers":null,"ScavengingChickensPG":null,"ScavengingChickensPGMembers":null,"DuckPG":2,"DuckPGMembers":80,"QuailPG":1,"QuailPGMembers":36,"PigeonPG":null,"PigeonPGMembers":null,"TotalPG":11,"TotalPGMembers":383},
		// 	{"Division":"","District":"","Upazila":"Banaripara","DairyPG":5,"DairyPGMembers":167,"BuffaloPG":null,"BuffaloPGMembers":null,"BeefFatteningPG":1,"BeefFatteningPGMembers":32,"GoatPG":null,"GoatPGMembers":null,"SheepPG":null,"SheepPGMembers":null,"ScavengingChickensPG":null,"ScavengingChickensPGMembers":null,"DuckPG":1,"DuckPGMembers":32,"QuailPG":null,"QuailPGMembers":null,"PigeonPG":null,"PigeonPGMembers":null,"TotalPG":7,"TotalPGMembers":231},
		// 	{"Division":"","District":"","Upazila":"Barishal Sadar","DairyPG":8,"DairyPGMembers":225,"BuffaloPG":2,"BuffaloPGMembers":51,"BeefFatteningPG":2,"BeefFatteningPGMembers":59,"GoatPG":2,"GoatPGMembers":55,"SheepPG":null,"SheepPGMembers":null,"ScavengingChickensPG":4,"ScavengingChickensPGMembers":122,"DuckPG":2,"DuckPGMembers":60,"QuailPG":null,"QuailPGMembers":null,"PigeonPG":2,"PigeonPGMembers":40,"TotalPG":22,"TotalPGMembers":612},
		// 	{"Division":"","District":"","Upazila":"Gouranadi","DairyPG":4,"DairyPGMembers":130,"BuffaloPG":null,"BuffaloPGMembers":null,"BeefFatteningPG":1,"BeefFatteningPGMembers":30,"GoatPG":null,"GoatPGMembers":null,"SheepPG":null,"SheepPGMembers":null,"ScavengingChickensPG":1,"ScavengingChickensPGMembers":30,"DuckPG":null,"DuckPGMembers":null,"QuailPG":null,"QuailPGMembers":null,"PigeonPG":null,"PigeonPGMembers":null,"TotalPG":6,"TotalPGMembers":190},
		// 	{"Division":"","District":"","Upazila":"Hizla","DairyPG":6,"DairyPGMembers":239,"BuffaloPG":2,"BuffaloPGMembers":81,"BeefFatteningPG":1,"BeefFatteningPGMembers":40,"GoatPG":null,"GoatPGMembers":null,"SheepPG":null,"SheepPGMembers":null,"ScavengingChickensPG":1,"ScavengingChickensPGMembers":39,"DuckPG":1,"DuckPGMembers":38,"QuailPG":null,"QuailPGMembers":null,"PigeonPG":null,"PigeonPGMembers":null,"TotalPG":11,"TotalPGMembers":437},
		// 	{"Division":"","District":"","Upazila":"Mehendigonj","DairyPG":5,"DairyPGMembers":121,"BuffaloPG":3,"BuffaloPGMembers":60,"BeefFatteningPG":1,"BeefFatteningPGMembers":24,"GoatPG":null,"GoatPGMembers":null,"SheepPG":null,"SheepPGMembers":null,"ScavengingChickensPG":1,"ScavengingChickensPGMembers":20,"DuckPG":1,"DuckPGMembers":20,"QuailPG":null,"QuailPGMembers":null,"PigeonPG":null,"PigeonPGMembers":null,"TotalPG":11,"TotalPGMembers":245},
		// 	{"Division":"","District":"","Upazila":"Muladi","DairyPG":5,"DairyPGMembers":142,"BuffaloPG":null,"BuffaloPGMembers":null,"BeefFatteningPG":1,"BeefFatteningPGMembers":30,"GoatPG":null,"GoatPGMembers":null,"SheepPG":null,"SheepPGMembers":null,"ScavengingChickensPG":1,"ScavengingChickensPGMembers":30,"DuckPG":null,"DuckPGMembers":null,"QuailPG":null,"QuailPGMembers":null,"PigeonPG":null,"PigeonPGMembers":null,"TotalPG":7,"TotalPGMembers":202},
		// 	{"Division":"","District":"","Upazila":"Uzirpur","DairyPG":5,"DairyPGMembers":151,"BuffaloPG":null,"BuffaloPGMembers":null,"BeefFatteningPG":1,"BeefFatteningPGMembers":29,"GoatPG":1,"GoatPGMembers":29,"SheepPG":null,"SheepPGMembers":null,"ScavengingChickensPG":1,"ScavengingChickensPGMembers":33,"DuckPG":null,"DuckPGMembers":null,"QuailPG":null,"QuailPGMembers":null,"PigeonPG":null,"PigeonPGMembers":null,"TotalPG":8,"TotalPGMembers":242},
		// 	{"Division":"","District":"Barishal Total","Upazila":null,"DairyPG":55,"DairyPGMembers":1776,"BuffaloPG":9,"BuffaloPGMembers":239,"BeefFatteningPG":10,"BeefFatteningPGMembers":310,"GoatPG":4,"GoatPGMembers":114,"SheepPG":null,"SheepPGMembers":null,"ScavengingChickensPG":14,"ScavengingChickensPGMembers":455,"DuckPG":5,"DuckPGMembers":154,"QuailPG":null,"QuailPGMembers":null,"PigeonPG":2,"PigeonPGMembers":40,"TotalPG":99,"TotalPGMembers":3088},
		// 	{"Division":"","District":"Bhola","Upazila":"Bhola Sadar","DairyPG":14,"DairyPGMembers":501,"BuffaloPG":5,"BuffaloPGMembers":161,"BeefFatteningPG":2,"BeefFatteningPGMembers":76,"GoatPG":1,"GoatPGMembers":36,"SheepPG":null,"SheepPGMembers":null,"ScavengingChickensPG":5,"ScavengingChickensPGMembers":189,"DuckPG":1,"DuckPGMembers":33,"QuailPG":null,"QuailPGMembers":null,"PigeonPG":null,"PigeonPGMembers":null,"TotalPG":28,"TotalPGMembers":996},
		// 	{"Division":"","District":"","Upazila":"Borhanuddin","DairyPG":6,"DairyPGMembers":198,"BuffaloPG":2,"BuffaloPGMembers":57,"BeefFatteningPG":1,"BeefFatteningPGMembers":35,"GoatPG":1,"GoatPGMembers":40,"SheepPG":null,"SheepPGMembers":null,"ScavengingChickensPG":3,"ScavengingChickensPGMembers":111,"DuckPG":1,"DuckPGMembers":39,"QuailPG":null,"QuailPGMembers":null,"PigeonPG":null,"PigeonPGMembers":null,"TotalPG":14,"TotalPGMembers":480},
		// 	{"Division":"","District":"","Upazila":"Charfashion","DairyPG":7,"DairyPGMembers":255,"BuffaloPG":2,"BuffaloPGMembers":69,"BeefFatteningPG":2,"BeefFatteningPGMembers":59,"GoatPG":1,"GoatPGMembers":34,"SheepPG":null,"SheepPGMembers":null,"ScavengingChickensPG":1,"ScavengingChickensPGMembers":40,"DuckPG":1,"DuckPGMembers":35,"QuailPG":null,"QuailPGMembers":null,"PigeonPG":null,"PigeonPGMembers":null,"TotalPG":14,"TotalPGMembers":492},
		// 	{"Division":"","District":"","Upazila":"Daulatkhan","DairyPG":4,"DairyPGMembers":138,"BuffaloPG":2,"BuffaloPGMembers":73,"BeefFatteningPG":1,"BeefFatteningPGMembers":40,"GoatPG":null,"GoatPGMembers":null,"SheepPG":null,"SheepPGMembers":null,"ScavengingChickensPG":null,"ScavengingChickensPGMembers":null,"DuckPG":2,"DuckPGMembers":77,"QuailPG":1,"QuailPGMembers":33,"PigeonPG":null,"PigeonPGMembers":null,"TotalPG":10,"TotalPGMembers":361},
		// 	{"Division":"","District":"","Upazila":"Lalmohon","DairyPG":6,"DairyPGMembers":239,"BuffaloPG":2,"BuffaloPGMembers":57,"BeefFatteningPG":1,"BeefFatteningPGMembers":40,"GoatPG":1,"GoatPGMembers":40,"SheepPG":null,"SheepPGMembers":null,"ScavengingChickensPG":2,"ScavengingChickensPGMembers":79,"DuckPG":1,"DuckPGMembers":40,"QuailPG":null,"QuailPGMembers":null,"PigeonPG":null,"PigeonPGMembers":null,"TotalPG":13,"TotalPGMembers":495},
		// 	{"Division":"","District":"","Upazila":"Monpura","DairyPG":1,"DairyPGMembers":40,"BuffaloPG":3,"BuffaloPGMembers":118,"BeefFatteningPG":null,"BeefFatteningPGMembers":null,"GoatPG":null,"GoatPGMembers":null,"SheepPG":null,"SheepPGMembers":null,"ScavengingChickensPG":2,"ScavengingChickensPGMembers":75,"DuckPG":1,"DuckPGMembers":35,"QuailPG":null,"QuailPGMembers":null,"PigeonPG":null,"PigeonPGMembers":null,"TotalPG":7,"TotalPGMembers":268},
		// 	{"Division":"","District":"","Upazila":"Tojumuddin","DairyPG":2,"DairyPGMembers":60,"BuffaloPG":1,"BuffaloPGMembers":28,"BeefFatteningPG":null,"BeefFatteningPGMembers":null,"GoatPG":null,"GoatPGMembers":null,"SheepPG":null,"SheepPGMembers":null,"ScavengingChickensPG":1,"ScavengingChickensPGMembers":29,"DuckPG":1,"DuckPGMembers":28,"QuailPG":null,"QuailPGMembers":null,"PigeonPG":null,"PigeonPGMembers":null,"TotalPG":5,"TotalPGMembers":145},
		// 	{"Division":"","District":"Bhola Total","Upazila":null,"DairyPG":40,"DairyPGMembers":1431,"BuffaloPG":17,"BuffaloPGMembers":563,"BeefFatteningPG":7,"BeefFatteningPGMembers":250,"GoatPG":4,"GoatPGMembers":150,"SheepPG":null,"SheepPGMembers":null,"ScavengingChickensPG":16,"ScavengingChickensPGMembers":600,"DuckPG":7,"DuckPGMembers":243,"QuailPG":null,"QuailPGMembers":null,"PigeonPG":null,"PigeonPGMembers":null,"TotalPG":91,"TotalPGMembers":3237},
		// 	{"Division":"Barishal Total","District":null,"Upazila":null,"DairyPG":null,"DairyPGMembers":257,"BuffaloPG":null,"BuffaloPGMembers":8622,"BeefFatteningPG":51,"BeefFatteningPGMembers":1502,"GoatPG":52,"GoatPGMembers":1680,"SheepPG":31,"SheepPGMembers":1004,"ScavengingChickensPG":2,"ScavengingChickensPGMembers":55,"DuckPG":88,"DuckPGMembers":3014,"QuailPG":27,"QuailPGMembers":911,"PigeonPG":null,"PigeonPGMembers":null,"TotalPG":6,"TotalPGMembers":163,"TotalPG":514,"TotalPGMembers":16951},
		// 	{"Division":"Grand Total","District":null,"Upazila":null,"DairyPG":null,"DairyPGMembers":3266,"BuffaloPG":null,"BuffaloPGMembers":107810,"BeefFatteningPG":126,"BeefFatteningPGMembers":3725,"GoatPG":658,"GoatPGMembers":21613,"SheepPG":395,"SheepPGMembers":12941,"ScavengingChickensPG":88,"ScavengingChickensPGMembers":2645,"DuckPG":765,"DuckPGMembers":24754,"QuailPG":189,"QuailPGMembers":6041,"PigeonPG":2,"PigeonPGMembers":48,"TotalPG":11,"TotalPGMembers":324,"TotalPG":5500,"TotalPGMembers":179901}
		// ]';


		//   $resultdata = json_decode($jsonData, true);

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $dataList
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	$dbh->CloseConnection();  /**Close database connection */
	return $returnData;
}
