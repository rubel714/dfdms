<?php
include("global.php");

$task = '';
if(isset($data->action)) {
	$task = trim($data->action);
}

switch($task){
	

	case "DataTypeList":
		$returnData = DataTypeList($data);
		break;
	
	case "PgGroupList":
		$returnData = PgGroupList($data);
		break;
	
	case "QuarterList":
		$returnData = QuarterList($data);
		break;
	
	case "YearList":
		$returnData = YearList($data);
		break;

			
	case "RoleList":
		$returnData = RoleList($data);
		break;
	
	
		
	// case "NextInvoiceNumber":
	// 	$returnData = NextInvoiceNumber($data);
	// 	break;
		
		
}

// echo json_encode($returnData);
return $returnData;

 
function DataTypeList($data) {
	try{

		$dbh = new Db();
		$query = "SELECT DataTypeId id, DataTypeName `name` FROM t_datatype  ORDER BY DataTypeName;"; 
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
 
function PgGroupList($data) {
	try{

		$DivisionId = trim($data->DivisionId);
		$DistrictId = trim($data->DistrictId);
		$UpazilaId = trim($data->UpazilaId);


		$dbh = new Db();
		
		$query = "SELECT `PGId` id,
			`DivisionId`,
			`DistrictId`,
			`UpazilaId`,
			`PGName` `name`,
			`Address`
			FROM t_pg  
			WHERE DivisionId=$DivisionId 
			AND DistrictId=$DistrictId
			AND UpazilaId=$UpazilaId
		ORDER BY PGName;"; 
	
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

   
 
function QuarterList($data) {
	try{

		$dbh = new Db();
		
		$query = "SELECT `QuarterId` id,`QuarterName` `name`
	 			 	FROM `t_quarter` 
					ORDER BY QuarterId;"; 
	
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
   
 
function YearList($data) {
	try{

		$dbh = new Db();
		
		$query = "SELECT `YearId` id,`YearName` `name`
	 			 	FROM `t_year` 
					ORDER BY YearName;"; 
	
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
 
function RoleList($data) {
	try{

		$dbh = new Db();
		
		$query = "SELECT `RoleId` id,`RoleName` `name`
	 			 	FROM `t_roles` 
					ORDER BY RoleName;"; 
	
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

   
// function NextInvoiceNumber($data) {
// 	try{

// 		$ClientId = trim($data->ClientId);
// 		$BranchId = trim($data->BranchId);
// 		$TransactionTypeId = trim($data->TransactionTypeId);
// 		$InvNo = getNextInvoiceNumber($ClientId,$BranchId,$TransactionTypeId);

// 		$returnData = [
// 			"success" => 1,
// 			"status" => 200,
// 			"message" => "",
// 			"datalist" => $InvNo
// 		];

// 	}catch(PDOException $e){
// 		$returnData = msg(0,500,$e->getMessage());
// 	}
	
// 	return $returnData;
// }
