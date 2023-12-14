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

		$TotalPGMember = 40000;
		$TotalPG = 15000;

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
	
		$jsonData = '[
			{
				"name": "Female",
				"y": 57.7,
				"count": 103810,
				"color": "#C0A9F2"
			},
			{
				"name": "Male",
				"y": 42.29,
				"count": 76076,
				"color": "#C9F271"
			},
			{
				"name": "Transgender",
				"y": 0.01,
				"count": 15,
				"color": "#59C7EE"
			}
		]';
		
		$dataList = json_decode($jsonData, true);
		
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
	

		$jsonData = ' {
			"categories": ["Barishal", "Chattogram", "Dhaka", "Khulna", "Mymensing", "Rajshahi", "Rangpur", "Sylhet"],
			"seriesData": [{
			  "name": "Total",
			  "data": [16951, 21695, 29612, 25932, 13460, 31626, 31320, 9305]
			}]
		  }';
		
		$dataList = json_decode($jsonData, true);
		
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
	

		$jsonData = ' {
			"categories": ["Barishal", "Chattogram", "Dhaka", "Khulna", "Mymensing", "Rajshahi", "Rangpur", "Sylhet"],
			"seriesData": [{
			  "name": "Total",
			  "data": [50000, 45000, 78000, 77000, 13460, 31626, 31320, 9305]
			}]
		  }';
		
		$dataList = json_decode($jsonData, true);
		
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