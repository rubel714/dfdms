<?php

$task = '';
if(isset($data->action)) {
	$task = trim($data->action);
}

switch($task){
	
	case "getDataList":
		$returnData = getDataList($data);
	break;
	
	case "getGenderwisePGMemberDataList":
		$returnData = getGenderwisePGMemberDataList($data);
	break;
	
	case "getValueChainwisePGDistributionDataList":
		$returnData = getValueChainwisePGDistributionDataList($data);
	break;

	case "getValueChainwisePGDMemberistributionDataList":
		$returnData = getValueChainwisePGDMemberistributionDataList($data);
	break;

	default :
		echo "{failure:true}";
		break;
}

function getDataList($data){

	try{
		$dbh = new Db();
		$CurrentDate = date('d-M-Y');

		$TotalPG = 0;
		$TotalPGMember = 0;

		$query = "SELECT COUNT(f.`PGId`) AS TotalPG FROM `t_pg` f;";
		$resultdata = $dbh->query($query);
		foreach ($resultdata as $key => $row) {
			$TotalPG = $row["TotalPG"];
		}

		$query = "SELECT COUNT(f.`PGId`) AS TotalFarmer FROM `t_farmer` f;";
		$resultdata = $dbh->query($query);
		foreach ($resultdata as $key => $row) {
			$TotalPGMember = $row["TotalFarmer"];
		}

		// $TotalPG = 5500;
		$dataList = array("TotalPGMember"=>$TotalPGMember,"TotalPG"=>$TotalPG,"CurrentDate"=>$CurrentDate);
		

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $dataList
		];

	}catch(PDOException $e){
		$returnData = msg(0,500,$e->getMessage());
	}
	
	return $returnData;
}


function getGenderwisePGMemberDataList($data){

	try{
		$dbh = new Db();
	
		$query = "SELECT g.GenderName,g.ColorCode,COUNT(f.`PGId`) AS TotalPG 
		FROM `t_farmer` f
		INNER JOIN `t_gender` g ON f.`Gender` = g.GenderId
		group by g.GenderName,g.ColorCode;";
		$resultdata = $dbh->query($query);

		$dataList = array();
		foreach ($resultdata as $key => $row) {
			$TotalPG = $row["TotalPG"];
			settype($TotalPG,"integer");

			$dataList[] = array("name"=>$row["GenderName"],"y"=>$TotalPG,"color"=> $row["ColorCode"]);
		}




		// $jsonData = '[
		// 	{
		// 		"name": "Female",
		// 		"y": 57.7,
		// 		"count": 103810,
		// 		"color": "#C0A9F2"
		// 	},
		// 	{
		// 		"name": "Male",
		// 		"y": 42.29,
		// 		"count": 76076,
		// 		"color": "#C9F271"
		// 	},
		// 	{
		// 		"name": "Transgender",
		// 		"y": 0.01,
		// 		"count": 15,
		// 		"color": "#59C7EE"
		// 	}
		// ]';
		
		// $dataList = json_decode($jsonData, true);
		
		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $dataList
		];

	}catch(PDOException $e){
		$returnData = msg(0,500,$e->getMessage());
	}
	
	return $returnData;
}

function getValueChainwisePGDistributionDataList($data){

	try{
		$dbh = new Db();
	
		
		$query = "SELECT g.DivisionName,COUNT(f.`PGId`) AS TotalCount
		FROM `t_pg` f
		INNER JOIN `t_division` g ON f.`DivisionId` = g.DivisionId
		group by g.DivisionName;";
		$resultdata = $dbh->query($query);

		$dataList = array("categories"=>array(),"seriesData"=>array("name"=> "Number of PG","color"=>"#544fc5","data"=>array()));

		foreach ($resultdata as $key => $row) {

			$dataList["categories"][] = $row["DivisionName"];

			$TotalCount = $row["TotalCount"];
			settype($TotalCount,"integer");

			$dataList["seriesData"]["data"][] = $TotalCount;
			// $dataList[] = array("name"=>$row["GenderName"],"y"=>$TotalCount,"color"=> $row["ColorCode"]);
		}

		

		// $jsonData = ' {
		// 	"categories": ["Barishal", "Chattogram", "Dhaka", "Khulna", "Mymensing", "Rajshahi", "Rangpur", "Sylhet"],
		// 	"seriesData": [{
		// 	  "name": "Total",
		// 	  "data": [16951, 21695, 29612, 25932, 13460, 31626, 31320, 9305]
		// 	}]
		//   }';
		
		// $dataList = json_decode($jsonData, true);
		
		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $dataList
		];
		

	}catch(PDOException $e){
		$returnData = msg(0,500,$e->getMessage());
	}
	
	return $returnData;
}



function getValueChainwisePGDMemberistributionDataList($data){

	try{
		$dbh = new Db();
	

		
		$query = "SELECT g.DivisionName,COUNT(f.`PGId`) AS TotalCount
		FROM `t_farmer` f
		INNER JOIN `t_division` g ON f.`DivisionId` = g.DivisionId
		group by g.DivisionName;";
		$resultdata = $dbh->query($query);

		$dataList = array("categories"=>array(),"seriesData"=>array("name"=> "Number of Member","color"=>"#0EC5AE","data"=>array()));

		foreach ($resultdata as $key => $row) {

			$dataList["categories"][] = $row["DivisionName"];

			$TotalCount = $row["TotalCount"];
			settype($TotalCount,"integer");

			$dataList["seriesData"]["data"][] = $TotalCount;
			// $dataList[] = array("name"=>$row["GenderName"],"y"=>$TotalCount,"color"=> $row["ColorCode"]);
		}


		


		// $jsonData = ' {
		// 	"categories": ["Barishal", "Chattogram", "Dhaka", "Khulna", "Mymensing", "Rajshahi", "Rangpur", "Sylhet"],
		// 	"seriesData": [{
		// 	  "name": "Total",
		// 	  "data": [50000, 45000, 78000, 77000, 13460, 31626, 31320, 9305]
		// 	}]
		//   }';
		
		// $dataList = json_decode($jsonData, true);
		
		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $dataList
		];
		

	}catch(PDOException $e){
		$returnData = msg(0,500,$e->getMessage());
	}
	
	return $returnData;
}



?>