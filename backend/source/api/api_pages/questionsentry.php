<?php

$task = '';
if(isset($data->action)) {
	$task = trim($data->action);
}

switch($task){
	
	case "getDataList":
		$returnData = getDataList($data);
	break;

	case "dataAddEdit":
		$returnData = dataAddEdit($data);
	break;
	
	case "deleteData":
		$returnData = deleteData($data);
	break;

	default :
		echo "{failure:true}";
		break;
}

function getDataList($data){

	try{
		$dbh = new Db();


		$query = "SELECT 
			`QuestionId` id,
			`QuestionCode`,
			`QuestionName`,
			`QuestionType`,
			`Settings`,
			`IsMandatory`,
			`QuestionParentId`,
			`SortOrderChild`
			, case when IsMandatory=1 then 'Mandatory' else 'Not Mandatory' end IsMandatoryName
		FROM `t_questions`
		ORDER BY QuestionName ASC;";
		
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



function dataAddEdit($data) {

	if($_SERVER["REQUEST_METHOD"] != "POST"){
		return $returnData = msg(0,404,'Page Not Found!');
	}else{
		
		
		$lan = trim($data->lan); 
		$UserId = trim($data->UserId); 

		$QuestionId = $data->rowData->id;
		$QuestionName = $data->rowData->QuestionName;
		$QuestionCode = $data->rowData->QuestionCode;
		$QuestionType = $data->rowData->QuestionType;
		$Settings = isset($data->rowData->Settings) && ($data->rowData->Settings !== "") ? $data->rowData->Settings : NULL;
		$IsMandatory = isset($data->rowData->IsMandatory) ? $data->rowData->IsMandatory : 0;
		


	

		try{

			$dbh = new Db();
			$aQuerys = array();

			if($QuestionId == ""){

				
				$q="SELECT (IFNULL(MAX(SortOrderChild),0) + 1) AS M FROM t_questions";
				$resultdata = $dbh->query($q);
				$SortOrderChild = $resultdata[0]['M'];


				$q = new insertq();
				$q->table = 't_questions';
				$q->columns = ['QuestionName','QuestionCode','QuestionType','Settings','IsMandatory','SortOrderChild'];
				$q->values = [$QuestionName,$QuestionCode,$QuestionType,$Settings,$IsMandatory,$SortOrderChild];
				$q->pks = ['QuestionId'];
				$q->bUseInsetId = false;
				$q->build_query();
				$aQuerys = array($q); 
			}else{
				$u = new updateq();
				$u->table = 't_questions';
				$u->columns = ['QuestionName','QuestionType','Settings','IsMandatory'];
				$u->values = [$QuestionName,$QuestionType,$Settings,$IsMandatory];
				$u->pks = ['QuestionId'];
				$u->pk_values = [$QuestionId];
				$u->build_query();
				$aQuerys = array($u);
			}

			$res = exec_query($aQuerys, $UserId, $lan);  
			$success=($res['msgType']=='success')?1:0;
			$status=($res['msgType']=='success')?200:500;

			$returnData = [
			    "success" => $success ,
				"status" => $status,
				"UserId"=> $UserId,
				"message" => $res['msg']
			];

		}catch(PDOException $e){
			$returnData = msg(0,500,$e->getMessage());
		}
		
		return $returnData;
	}
}


function deleteData($data) {
 
	if($_SERVER["REQUEST_METHOD"] != "POST"){
		return $returnData = msg(0,404,'Page Not Found!');
	}
	// CHECKING EMPTY FIELDS
	elseif(!isset($data->rowData->id)){
		$fields = ['fields' => ['id']];
		return $returnData = msg(0,422,'Please Fill in all Required Fields!',$fields);
	}else{
		
		$QuestionId = $data->rowData->id;
		$lan = trim($data->lan); 
		$UserId = trim($data->UserId); 

		try{

			$dbh = new Db();
			
            $d = new deleteq();
            $d->table = 't_questions';
            $d->pks = ['QuestionId'];
            $d->pk_values = [$QuestionId];
            $d->build_query();
            $aQuerys = array($d);

			$res = exec_query($aQuerys, $UserId, $lan);  
			$success=($res['msgType']=='success')?1:0;
			$status=($res['msgType']=='success')?200:500;

			$returnData = [
				"success" => $success ,
				"status" => $status,
				"UserId"=> $UserId,
				"message" => $res['msg']
			];
			
		}catch(PDOException $e){
			$returnData = msg(0,500,$e->getMessage());
		}
		
		return $returnData;
	}
}


?>