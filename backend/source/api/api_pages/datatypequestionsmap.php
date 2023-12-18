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

	case "downOrderData":
		$returnData = downOrderData($data);
		break;

	case "upOrderData":
		$returnData = upOrderData($data);
		break;

	default :
		echo "{failure:true}";
		break;
}

function getDataList($data){

	$DataTypeId = trim($data->DataTypeId);
	$SurveyId = trim($data->SurveyId);

	try{
		$dbh = new Db();
	 	$query = "SELECT a.QMapId AS id, a.MapType, b.DataTypeName, c.QuestionName, a.LabelName, c.QuestionCode, a.SortOrder, a.DataTypeId, a.Category, a.SurveyId
		,/*(SELECT COUNT(DataValueItemId)
		FROM t_datavaluemaster m
		INNER JOIN t_datavalueitems n ON m.DataValueMasterId=n.DataValueMasterId
		WHERE m.DataTypeId=a.DataTypeId AND n.QuestionId=a.QuestionId)*/ 0 QDataCount

		FROM t_datatype_questions_map a
		INNER JOIN t_datatype b ON a.DataTypeId = b.DataTypeId
		INNER JOIN t_questions c ON a.QuestionId = c.QuestionId
		WHERE a.DataTypeId = $DataTypeId
		AND a.SurveyId = $SurveyId
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
		WHERE QuestionParentId = 0
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
		$LabelName = $data->rowData->LabelName? $data->rowData->LabelName : null;
		$Category = $data->rowData->Category? $data->rowData->Category : null;

		try{

			$dbh = new Db();
			$aQuerys = array();

			$u = new updateq();
			$u->table = 't_datatype_questions_map';
			$u->columns = ['LabelName', 'Category'];
			$u->values = [$LabelName, $Category];
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
		$SurveyId = trim($data->SurveyId); 


		$QMapId = $data->rowData->id;
		

		try{

			$dbh = new Db();
			$aQuerys = array();

			$cq="SELECT QuestionId FROM t_datatype_questions_map WHERE DataTypeId = $DataTypeId AND SurveyId = $SurveyId";
		    $questionMapped = $dbh->query($cq);

		
			$initialValue = 0;
			foreach ($data->rowData as $row) {
				$shouldInsert = true;

				foreach ($questionMapped as $mappedRow) {
					if ($row->id == $mappedRow['QuestionId']) {
						$shouldInsert = false;
						//break; 
					}
				}

				if ($row->QuestionType == "Label") {
					$shouldInsert = true;
				}
				
					if ($shouldInsert) {
						$LabelName = null;
						$MapType = 'Question';
						if($row->QuestionType == "Label"){
							$MapType = 'Label';
						}else{
							$MapType = 'Question';
						}

						$q="SELECT IFNULL(MAX(SortOrder), 0) AS M FROM t_datatype_questions_map";
						$resultdata = $dbh->query($q);
						$currentSortOrder  = $resultdata[0]['M'];

						$initialValue++;
						$SortOrder = $currentSortOrder + $initialValue;


						$q = new insertq();
						$q->table = 't_datatype_questions_map';
						$q->columns = [
							'DataTypeId',
							'MapType',
							'QuestionId',
							'LabelName',
							'SortOrder',
							'SurveyId'
						];
						$q->values = [
							$DataTypeId,
							$MapType,
							$row->id,
							$LabelName,
							$SortOrder,
							$SurveyId
						];
					
						$q->pks = ['QMapId'];
						$q->bUseInsetId = false;
						$q->build_query();
						$aQuerys[] = $q;
					}
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




function downOrderData($data)
{
    if ($_SERVER["REQUEST_METHOD"] != "POST") {
        return $returnData = msg(0, 404, 'Page Not Found!');
    } {

        $id = $data->rowData->id;
        $lan = trim($data->lan);
        $UserId = trim($data->UserId);
        //$DataTypeId = trim($data->DataTypeId);
        $dataList = $data->dataList;

        try {

            $dbh = new Db();

            $aQuerys = array();

            // Find the index of the element with id = $id
            $currentIndex = null;
            foreach ($dataList as $index => $dataItem) {
                if ($dataItem->id == $id) {
                    $currentIndex = $index;
                    break;
                }
            }

            if ($currentIndex !== null && isset($dataList[$currentIndex + 1])) {
                // Swap SortOrder values between the current and next elements
                $currentSortOrder = $dataList[$currentIndex]->SortOrder;
                $nextSortOrder = $dataList[$currentIndex + 1]->SortOrder;

                $dataList[$currentIndex]->SortOrder = $nextSortOrder;
                $dataList[$currentIndex + 1]->SortOrder = $currentSortOrder;

                // Update the database
                $u1 = new updateq();
                $u1->table = 't_datatype_questions_map';
                $u1->columns = ['SortOrder'];
                $u1->values = [$dataList[$currentIndex]->SortOrder];
                $u1->pks = ['QMapId'];
                $u1->pk_values = [$id];
                $u1->build_query();
                $aQuerys[] = $u1;

                $u2 = new updateq();
                $u2->table = 't_datatype_questions_map';
                $u2->columns = ['SortOrder'];
                $u2->values = [$dataList[$currentIndex + 1]->SortOrder];
                $u2->pks = ['QMapId'];
                $u2->pk_values = [$dataList[$currentIndex + 1]->id];
                $u2->build_query();
                $aQuerys[] = $u2;

                // Execute the update queries here
                // Assuming there's a function to execute queries like execute_queries($aQuerys)
                // execute_queries($aQuerys);
            }

            $res = exec_query($aQuerys, $UserId, $lan);
            $success = ($res['msgType'] == 'success') ? 1 : 0;
            $status = ($res['msgType'] == 'success') ? 200 : 500;

            $returnData = [
                "success" => $success,
                "status" => $status,
                "UserId" => $UserId,
                //"message" => $res['msg']
                "message" => "SortOrder updated successfully."
            ];
        } catch (PDOException $e) {
            $returnData = msg(0, 500, $e->getMessage());
        }

        return $returnData;
    }
}

function upOrderData($data)
{
    if ($_SERVER["REQUEST_METHOD"] != "POST") {
        return $returnData = msg(0, 404, 'Page Not Found!');
    } {

        $id = $data->rowData->id;
        $lan = trim($data->lan);
        $UserId = trim($data->UserId);
        //$DataTypeId = trim($data->DataTypeId);
        $dataList = $data->dataList;

        try {

            $dbh = new Db();

            $aQuerys = array();

            // Find the index of the element with id = $id
            $currentIndex = null;
            foreach ($dataList as $index => $dataItem) {
                if ($dataItem->id == $id) {
                    $currentIndex = $index;
                    break;
                }
            }

            if ($currentIndex !== null && $currentIndex > 0) {
                // Swap SortOrder values between the current and previous elements
                $currentSortOrder = $dataList[$currentIndex]->SortOrder;
                $previousSortOrder = $dataList[$currentIndex - 1]->SortOrder;

                $dataList[$currentIndex]->SortOrder = $previousSortOrder;
                $dataList[$currentIndex - 1]->SortOrder = $currentSortOrder;

                // Update the database
                $u1 = new updateq();
                $u1->table = 't_datatype_questions_map';
                $u1->columns = ['SortOrder'];
                $u1->values = [$dataList[$currentIndex]->SortOrder];
                $u1->pks = ['QMapId'];
                $u1->pk_values = [$id];
                $u1->build_query();
                $aQuerys[] = $u1;

                $u2 = new updateq();
                $u2->table = 't_datatype_questions_map';
                $u2->columns = ['SortOrder'];
                $u2->values = [$dataList[$currentIndex - 1]->SortOrder];
                $u2->pks = ['QMapId'];
                $u2->pk_values = [$dataList[$currentIndex - 1]->id];
                $u2->build_query();
                $aQuerys[] = $u2;

                // Execute the update queries here
                // Assuming there's a function to execute queries like execute_queries($aQuerys)
                // execute_queries($aQuerys);
            }

            $res = exec_query($aQuerys, $UserId, $lan);
            $success = ($res['msgType'] == 'success') ? 1 : 0;
            $status = ($res['msgType'] == 'success') ? 200 : 500;

            $returnData = [
                "success" => $success,
                "status" => $status,
                "UserId" => $UserId,
                "message" => "SortOrder updated successfully."
            ];
        } catch (PDOException $e) {
            $returnData = msg(0, 500, $e->getMessage());
        }

        return $returnData;
    }
}




?>