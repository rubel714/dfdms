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
