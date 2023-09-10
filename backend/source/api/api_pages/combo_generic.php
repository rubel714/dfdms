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
	
	case "FarmerList":
		$returnData = FarmerList($data);
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
	
	case "DivisionList":
		$returnData = DivisionList($data);
		break;
	
	case "DistrictList":
		$returnData = DistrictList($data);
		break;

	case "UpazilaList":
		$returnData = UpazilaList($data);
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

  
function FarmerList($data) {
	try{

		$DivisionId = trim($data->DivisionId);
		$DistrictId = trim($data->DistrictId);
		$UpazilaId = trim($data->UpazilaId);
		$PGId = trim($data->PGId);


		$dbh = new Db();
		
		$query = "SELECT `FarmerId` id,
			concat(`FarmerName`,'-',NID,'-',Phone) `name`
			FROM t_farmer  
			WHERE DivisionId=$DivisionId 
			AND DistrictId=$DistrictId
			AND UpazilaId=$UpazilaId
			AND (PGId=$PGId OR $PGId=0)
		ORDER BY FarmerName;"; 
	
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



function DivisionList($data) {
	try{
	
		$dbh = new Db();
		$query = "SELECT DivisionId id, DivisionName `name` FROM t_division ORDER BY DivisionName;"; 
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

function DistrictList($data) {
	try{
	
		$dbh = new Db();

		$DivisionId = trim($data->DivisionId)?trim($data->DivisionId):0; 
		$query = "SELECT DistrictId id, DistrictName `name` FROM t_district 
			where DivisionId=$DivisionId
			ORDER BY DistrictName;"; 

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

function UpazilaList($data) {
	try{
	
		$dbh = new Db();

		$DivisionId = trim($data->DivisionId)?trim($data->DivisionId):0; 
		$DistrictId = trim($data->DistrictId)?trim($data->DistrictId):0; 


		$query = "SELECT UpazilaId id, UpazilaName `name` FROM t_upazila 
			where DivisionId=$DivisionId
			AND DistrictId=$DistrictId
			ORDER BY UpazilaName;"; 

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
