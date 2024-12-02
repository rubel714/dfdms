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
		// $DivisionId = trim($data->DivisionId)?trim($data->DivisionId):0; 
		// $DistrictId = trim($data->DistrictId)?trim($data->DistrictId):0; 
		// $UpazilaId = trim($data->UpazilaId)?trim($data->UpazilaId):0; 


		$query = "SELECT g.`DivisionName`
		,SUM(CASE WHEN f.`ValueChain`='DAIRY' THEN 1 ELSE 0 END) Dairy
		,SUM(CASE WHEN f.`ValueChain`='BUFFALO' THEN 1 ELSE 0 END) Buffalo
		,SUM(CASE WHEN f.`ValueChain`='BEEFFATTENING' THEN 1 ELSE 0 END) BeefFattening
		,SUM(CASE WHEN f.`ValueChain`='GOAT' THEN 1 ELSE 0 END) Goat
		,SUM(CASE WHEN f.`ValueChain`='SHEEP' THEN 1 ELSE 0 END) Sheep
		,SUM(CASE WHEN f.`ValueChain`='SCAVENGINGCHICKENLOCAL' THEN 1 ELSE 0 END) ScavengingChickens
		,SUM(CASE WHEN f.`ValueChain`='DUCK' THEN 1 ELSE 0 END) Duck
		,SUM(CASE WHEN f.`ValueChain`='QUAIL' THEN 1 ELSE 0 END) Quail
		,SUM(CASE WHEN f.`ValueChain`='PIGEON' THEN 1 ELSE 0 END) Pigeon
		,COUNT(f.`FarmerId`) AS GrandTotal
		FROM `t_farmer` f
		INNER JOIN `t_division` g ON f.`DivisionId` = g.`DivisionId`
		where f.IsActive=1
		and f.StatusId=5

		GROUP BY g.DivisionName;";

		$resultdata = $dbh->query($query);

		$TotalDairy = 0;
		$TotalBuffalo = 0;
		$TotalBeefFattening = 0;
		$TotalGoat = 0;
		$TotalSheep = 0;
		$TotalScavengingChickens = 0;
		$TotalDuck = 0;
		$TotalQuail = 0;
		$TotalPigeon = 0;
		$TotalGrandTotal = 0;

		$dataList = array();
		foreach ($resultdata as $key => $row) {
			$dataList[] = $row;

			/**Calculate column total */
			$TotalDairy += $row["Dairy"];
			$TotalBuffalo += $row["Buffalo"];
			$TotalBeefFattening += $row["BeefFattening"];
			$TotalGoat += $row["Goat"];
			$TotalSheep += $row["Sheep"];
			$TotalScavengingChickens += $row["ScavengingChickens"];
			$TotalDuck += $row["Duck"];
			$TotalQuail += $row["Quail"];
			$TotalPigeon += $row["Pigeon"];
			$TotalGrandTotal += $row["GrandTotal"];
		}


		/**For Total row */
		if (count($dataList) > 0) {
			$row = array();
			$row["DivisionName"] = "Grand Total";
			$row["Dairy"] = $TotalDairy;
			$row["Buffalo"] = $TotalBuffalo;
			$row["BeefFattening"] = $TotalBeefFattening;
			$row["Goat"] = $TotalGoat;
			$row["Sheep"] = $TotalSheep;
			$row["ScavengingChickens"] = $TotalScavengingChickens;
			$row["Duck"] = $TotalDuck;
			$row["Quail"] = $TotalQuail;
			$row["Pigeon"] = $TotalPigeon;
			$row["GrandTotal"] = $TotalGrandTotal;
			$row["Percentage"] = 0;
			$dataList[] = $row;
		}




		/**Calculate Percentage */
		foreach ($dataList as $key => $row) {
			$row["Percentage"] = number_format(($row["GrandTotal"]*100)/$TotalGrandTotal,1);
			$dataList[$key] = $row;
		}

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $dataList
		];

	}catch(PDOException $e){
		$returnData = msg(0,500,$e->getMessage());
	}
	
	$dbh->CloseConnection();  /**Close database connection */
	return $returnData;
}


?>