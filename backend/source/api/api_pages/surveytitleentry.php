<?php

$task = '';
if (isset($data->action)) {
	$task = trim($data->action);
}

switch ($task) {

	case "getDataList":
		$returnData = getDataList($data);
		break;

	case "dataAddEdit":
		$returnData = dataAddEdit($data);
		break;

	case "dataCopy":
		$returnData = dataCopy($data);
		break;

	case "deleteData":
		$returnData = deleteData($data);
		break;

	default:
		echo "{failure:true}";
		break;
}

function getDataList($data)
{

	try {
		$dbh = new Db();


		$query = "SELECT 
		tq.`SurveyId` id,
		tq. SurveyId,
		tq.`SurveyTitle`,
		tq.`DataTypeId`,
		tq.`CurrentSurvey`
		, CASE WHEN tq.CurrentSurvey=1 THEN 'Yes' ELSE 'No' END CurrentSurveyStatus
		, b.`DataTypeName`,tq.CreateTs
	FROM `t_survey` tq
	INNER JOIN `t_datatype` b ON tq.`DataTypeId`= b.DataTypeId
	ORDER BY b.`DataTypeName` ASC, tq.CreateTs DESC;";

		$resultdata = $dbh->query($query);

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $resultdata
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}



function dataAddEdit($data)
{

	if ($_SERVER["REQUEST_METHOD"] != "POST") {
		return $returnData = msg(0, 404, 'Page Not Found!');
	} else {


		$lan = trim($data->lan);
		$UserId = trim($data->UserId);

		$SurveyId = $data->rowData->id;
		$SurveyTitle = $data->rowData->SurveyTitle;
		$CurrentSurvey = isset($data->rowData->CurrentSurvey) ? $data->rowData->CurrentSurvey : 0;
		$DataTypeId = isset($data->rowData->DataTypeId) ? $data->rowData->DataTypeId : 0;

		$dbh = new Db();


		if ($CurrentSurvey == 1) {
			$q = "UPDATE t_survey SET `CurrentSurvey` = 0 WHERE `DataTypeId` = $DataTypeId ;";
			$resultdata = $dbh->query($q);
		}

		try {

			$aQuerys = array();

			if ($SurveyId == "") {


				/* $q = "SELECT (IFNULL(MAX(SortOrderChild),0) + 1) AS M FROM t_survey";
				$resultdata = $dbh->query($q);
				$SortOrderChild = $resultdata[0]['M']; */

				$q = new insertq();
				$q->table = 't_survey';
				$q->columns = ['SurveyTitle', 'CurrentSurvey', 'DataTypeId'];
				$q->values = [$SurveyTitle, $CurrentSurvey, $DataTypeId];
				$q->pks = ['SurveyId'];
				$q->bUseInsetId = false;
				$q->build_query();
				$aQuerys = array($q);
			} else {
				$u = new updateq();
				$u->table = 't_survey';
				$u->columns = ['SurveyTitle', 'CurrentSurvey', 'DataTypeId'];
				$u->values = [$SurveyTitle, $CurrentSurvey, $DataTypeId];
				$u->pks = ['SurveyId'];
				$u->pk_values = [$SurveyId];
				$u->build_query();
				$aQuerys = array($u);
			}

			$res = exec_query($aQuerys, $UserId, $lan);
			$success = ($res['msgType'] == 'success') ? 1 : 0;
			$status = ($res['msgType'] == 'success') ? 200 : 500;

			$returnData = [
				"success" => $success,
				"status" => $status,
				"UserId" => $UserId,
				"message" => $res['msg']
			];
		} catch (PDOException $e) {
			$returnData = msg(0, 500, $e->getMessage());
		}

		return $returnData;
	}
}


function dataCopy($data)
{

	if ($_SERVER["REQUEST_METHOD"] != "POST") {
		return $returnData = msg(0, 404, 'Page Not Found!');
	} else {


		$lan = trim($data->lan);
		$UserId = trim($data->UserId);

		$SurveyId = $data->rowData->id;
		$SurveyTitle = "Copy of ".$data->rowData->SurveyTitle;
		$CurrentSurvey = 0;//isset($data->rowData->CurrentSurvey) ? $data->rowData->CurrentSurvey : 0;
		$DataTypeId = isset($data->rowData->DataTypeId) ? $data->rowData->DataTypeId : 0;

		// exit;
		$dbh = new Db();


		// if ($CurrentSurvey == 1) {
		// 	$q = "UPDATE t_survey SET `CurrentSurvey` = 0 WHERE `DataTypeId` = $DataTypeId ;";
		// 	$resultdata = $dbh->query($q);
		// }

		try {

			$aQuerys = array();

			// if ($SurveyId == "") {
				$q = new insertq();
				$q->table = 't_survey';
				$q->columns = ['SurveyTitle', 'CurrentSurvey', 'DataTypeId'];
				$q->values = [$SurveyTitle, $CurrentSurvey, $DataTypeId];
				$q->pks = ['SurveyId'];
				$q->bUseInsetId = true;
				$q->build_query();
				$aQuerys = array($q);

				// SELECT * FROM `t_datatype_questions_map` WHERE `SurveyId` = 2; 


			// } else {
			// 	$u = new updateq();
			// 	$u->table = 't_survey';
			// 	$u->columns = ['SurveyTitle', 'CurrentSurvey', 'DataTypeId'];
			// 	$u->values = [$SurveyTitle, $CurrentSurvey, $DataTypeId];
			// 	$u->pks = ['SurveyId'];
			// 	$u->pk_values = [$SurveyId];
			// 	$u->build_query();
			// 	$aQuerys = array($u);
			// }

			$res = exec_query($aQuerys, $UserId, $lan);
			$success = ($res['msgType'] == 'success') ? 1 : 0;
			$status = ($res['msgType'] == 'success') ? 200 : 500;
			// echo "<pre>";
			// print_r($res);
			if($success){
				$NewSurveyId = $res['id'];
				//insert question set
				$sql = "INSERT INTO `t_datatype_questions_map`(`DataTypeId`, `SurveyId`, `MapType`, `QuestionId`, `LabelName`, `SortOrder`, `Category`)
				select DataTypeId,$NewSurveyId, `MapType`, `QuestionId`, `LabelName`, `SortOrder`, `Category`
				from t_datatype_questions_map 
				where DataTypeId=$DataTypeId 
				and SurveyId=$SurveyId";
				$result2 = $dbh->query($sql);

				$res['msg'] = "Survey copied successfully";
			}

			$returnData = [
				"success" => $success,
				"status" => $status,
				"UserId" => $UserId,
				"message" => $res['msg']
			];


		} catch (PDOException $e) {
			$returnData = msg(0, 500, $e->getMessage());
		}

		return $returnData;
	}
}


function deleteData($data)
{

	if ($_SERVER["REQUEST_METHOD"] != "POST") {
		return $returnData = msg(0, 404, 'Page Not Found!');
	}
	// CHECKING EMPTY FIELDS
	elseif (!isset($data->rowData->id)) {
		$fields = ['fields' => ['id']];
		return $returnData = msg(0, 422, 'Please Fill in all Required Fields!', $fields);
	} else {

		$SurveyId = $data->rowData->id;
		$lan = trim($data->lan);
		$UserId = trim($data->UserId);

		try {

			$dbh = new Db();

			$d = new deleteq();
			$d->table = 't_survey';
			$d->pks = ['SurveyId'];
			$d->pk_values = [$SurveyId];
			$d->build_query();
			$aQuerys = array($d);

			$res = exec_query($aQuerys, $UserId, $lan);
			$success = ($res['msgType'] == 'success') ? 1 : 0;
			$status = ($res['msgType'] == 'success') ? 200 : 500;

			$returnData = [
				"success" => $success,
				"status" => $status,
				"UserId" => $UserId,
				"message" => $res['msg']
			];
		} catch (PDOException $e) {
			$returnData = msg(0, 500, $e->getMessage());
		}

		return $returnData;
	}
}
