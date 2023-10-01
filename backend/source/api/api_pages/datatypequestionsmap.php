<?php

$task = '';
if(isset($data->action)) {
	$task = trim($data->action);
}

switch($task){
	
	case "getDataList":
		$returnData = getDataList($data);
	break;
	
	case "getQuestionDataList":
		$returnData = getQuestionDataList($data);
	break;

	case "dataAddEdit":
		$returnData = dataAddEdit($data);
	break;
	
	case "questionAdd":
		$returnData = questionAdd($data);
	break;
	
	case "deleteData":
		$returnData = deleteData($data);
	break;

	default :
		echo "{failure:true}";
		break;
}

function getDataList($data){

	$DataTypeId = trim($data->DataTypeId);

	try{
		$dbh = new Db();
		$query = "SELECT a.QMapId AS id, a.MapType, b.DataTypeName, c.QuestionName, a.LabelName
		FROM t_datatype_questions_map a
		INNER JOIN t_datatype b ON a.DataTypeId = b.DataTypeId
		INNER JOIN t_questions c ON a.QuestionId = c.QuestionId
		WHERE a.DataTypeId = $DataTypeId
		ORDER BY a.SortOrder ASC;";
		
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



function getQuestionDataList($data){


	try{
		$dbh = new Db();
		$query = "SELECT 
		`QuestionId` AS id,
		`QuestionCode`,
		`QuestionName`,
		`QuestionType`,
		`Settings`,
		`IsMandatory`,
		`QuestionParentId`,
		`SortOrderChild`,
		`UpdateTs`,
		`CreateTs` 
	  FROM
		`t_questions` 
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

		$QMapId = $data->rowData->id;
		$LabelName = $data->rowData->LabelName;


		try{

			$dbh = new Db();
			$aQuerys = array();

			$u = new updateq();
			$u->table = 't_datatype_questions_map';
			$u->columns = ['LabelName'];
			$u->values = [$LabelName];
			$u->pks = ['QMapId'];
			$u->pk_values = [$QMapId];
			$u->build_query();
			$aQuerys = array($u);
			
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


function questionAdd($data) {

	if($_SERVER["REQUEST_METHOD"] != "POST"){
		return $returnData = msg(0,404,'Page Not Found!');
	}else{
		

		$lan = trim($data->lan); 
		$UserId = trim($data->UserId); 
		$DataTypeId = trim($data->DataTypeId); 

		$QMapId = $data->rowData->id;
		

		try{

			$dbh = new Db();
			$aQuerys = array();


			foreach ($data->rowData as $row) {

				$LabelName = null;
                $MapType = 'Question';
				if($row->QuestionType == "Label"){
					$MapType = 'Label';
				}else{
					$MapType = 'Question';
				}

				$q="SELECT (IFNULL(MAX(SortOrder),0) + 1) AS M FROM t_datatype_questions_map";
				$resultdata = $dbh->query($q);
				$SortOrder = $resultdata[0]['M'];

				$q = new insertq();
				$q->table = 't_datatype_questions_map';
				$q->columns = [
					'DataTypeId',
					'MapType',
					'QuestionId',
					'LabelName',
					'SortOrder'
				];
				$q->values = [
					$DataTypeId,
					$MapType,
					$row->id,
					$LabelName,
					$SortOrder
				];
			
				$q->pks = ['QMapId'];
				$q->bUseInsetId = false;
				$q->build_query();
				$aQuerys[] = $q;
			}
			

			/* if($QMapId == ""){
				$q = new insertq();
				$q->table = 't_datatype_questions_map';
				$q->columns = ['MapType'];
				$q->values = [$MapType];
				$q->pks = ['QMapId'];
				$q->bUseInsetId = false;
				$q->build_query();
				$aQuerys = array($q); 
			}else{
				$u = new updateq();
				$u->table = 't_datatype_questions_map';
				$u->columns = ['MapType'];
				$u->values = [$MapType];
				$u->pks = ['QMapId'];
				$u->pk_values = [$QMapId];
				$u->build_query();
				$aQuerys = array($u);
			} */
			
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
		
		$QMapId = $data->rowData->id;
		$lan = trim($data->lan); 
		$UserId = trim($data->UserId); 

		try{

			$dbh = new Db();
			
            $d = new deleteq();
            $d->table = 't_datatype_questions_map';
            $d->pks = ['QMapId'];
            $d->pk_values = [$QMapId];
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