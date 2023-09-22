<?php
include("posttransaction.php");

$task = '';
if (isset($data->action)) {
	$task = trim($data->action);
}

switch ($task) {


	case "getDataList":
		$returnData = getDataList($data);
		break;

	case "getQuestionList":
		$returnData = getQuestionList($data);
		break;

	case "getDataSingle":
		$returnData = getDataSingle($data);
		break;

	case "dataAddEdit":
		$returnData = dataAddEdit($data);
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

	$DivisionId = trim($data->DivisionId); 
	$DistrictId = trim($data->DistrictId); 
	$UpazilaId = trim($data->UpazilaId); 
	$DataTypeId = trim($data->DataTypeId); 

	try {
		$dbh = new Db();

		$query = "SELECT a.`DataValueMasterId` as id, a.`DivisionId`, a.`DistrictId`, a.`UpazilaId`, a.`PGId`, a.`YearId`, a.`QuarterId`,
		 a.`Remarks`, a.`DataCollectorName`, a.`DataCollectionDate`, a.`UserId`,a.BPosted
		, concat(a.YearId,' (',e.QuarterName,')') QuarterName, b.DivisionName,c.DistrictName,d.UpazilaName,f.PGName
		FROM t_datavaluemaster a
		inner join t_division b on a.DivisionId=b.DivisionId
		inner join t_district c on a.DistrictId=c.DistrictId
		inner join t_upazila d on a.UpazilaId=d.UpazilaId
		inner join t_quarter e on a.QuarterId=e.QuarterId
		inner join t_pg f on a.PGId=f.PGId
		where a.DivisionId=$DivisionId
		and a.DistrictId=$DistrictId
		and a.UpazilaId=$UpazilaId
		and a.DataTypeId=$DataTypeId
		ORDER BY a.CreateTs DESC;";

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


function getQuestionList($data)
{

	$DataTypeId = trim($data->DataTypeId);
	try {
		$dbh = new Db();

		// $query = "SELECT a.`QuestionId`, a.`QuestionCode`, a.`QuestionName`, a.`QuestionType`, 
		// a.`IsMandatory`, a.`QuestionParentId`, b.`SortOrder`, a.SortOrderChild
		// FROM t_questions a
		// inner join t_datatype_questions_map b on a.QuestionId=b.QuestionId
		// where b.DataTypeId=$DataTypeId
		// ORDER BY b.SortOrder ASC, a.SortOrderChild ASC;";

		$query = "SELECT a.`QuestionId`, a.`QuestionCode`, a.`QuestionName`, a.`QuestionType`, 
		a.`IsMandatory`, a.`QuestionParentId`, b.`SortOrder`, 0 SortOrderChild,a.Settings
		FROM t_questions a
		INNER JOIN t_datatype_questions_map b ON a.QuestionId=b.QuestionId
		WHERE b.DataTypeId = $DataTypeId

		UNION ALL

		SELECT child.`QuestionId`, child.`QuestionCode`, child.`QuestionName`, child.`QuestionType`, 
		child.`IsMandatory`, child.`QuestionParentId`, 
		(SELECT s.SortOrder FROM t_datatype_questions_map s WHERE s.QuestionId=child.QuestionParentId) `SortOrder`, 
		child.SortOrderChild,child.Settings
		FROM t_questions AS child
		INNER JOIN t_datatype_questions_map AS m ON child.QuestionParentId=m.QuestionId
		WHERE child.QuestionParentId != 0 AND m.DataTypeId = $DataTypeId

		ORDER BY SortOrder ASC, SortOrderChild ASC;";

		$resultdata = $dbh->query($query);
		$datalist=array();
		foreach($resultdata as $row){

			if($row["QuestionType"] === "DropDown"){
				$Settings = $row["Settings"];

				$sq = "SELECT QueryStatic FROM t_questiondropdown 
				where DropdownName='$Settings';"; 
				$sqr = $dbh->query($sq);

				$Settingsdata = array();
				if($sqr){
					$Settingsquery = $sqr[0]["QueryStatic"]; 
					$Settingsdata = $dbh->query($Settingsquery);
				}

				array_unshift($Settingsdata,array("id"=>"","name"=>"নির্বাচন করুন"));
				// $Settingsdata[] = array("id"=>"","name"=>"নির্বাচন করুন");

				// $Settingsquery = "SELECT DesignationId as id, DesignationName as name 
				// FROM t_designation order by DesignationName"; 
				$row["SettingsList"]=$Settingsdata;

			}else{
				$row["SettingsList"]=[];
				
			}

			$datalist[] = $row;
		}

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $datalist
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}



function getDataSingle($data)
{
	$DataValueMasterId = trim($data->id);

	try {
		$dbh = new Db();

		/**Master Data */
		$query = "SELECT `DataValueMasterId` as id, `DivisionId`, `DistrictId`, `UpazilaId`, `PGId`, `YearId`, `QuarterId`,
		 `Remarks`, `DataCollectorName`, `DataCollectionDate`, `UserId`, `BPosted`, `UpdateTs`, `CreateTs`
		FROM t_datavaluemaster
		where DataValueMasterId=$DataValueMasterId;";
		$resultdataMaster = $dbh->query($query);


		/**Items Data */
		$query = "SELECT a.DataValueItemId as autoId,a.`DataValueItemId`, a.`DataValueMasterId`, a.`QuestionId`,
		b.QuestionCode,b.QuestionName,b.QuestionType, a.DataValue
		FROM t_datavalueitems a
		inner join t_questions b on a.QuestionId=b.QuestionId
		where a.DataValueMasterId=$DataValueMasterId;";
		$resultdataItems = $dbh->query($query);

		$items = array();
		foreach ($resultdataItems as $row) {

			if($row['QuestionType'] === "CheckText"){
				$items[$row['QuestionCode']] = $row['DataValue'] === "0" ? false : $row['DataValue'];
			}else{
				$items[$row['QuestionCode']] = $row['DataValue'];
			}
			
		}


		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => array("master" => $resultdataMaster, "items" => $items)
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

		try {

			$dbh = new Db();

			$data = $data->params;
		
			$lan = trim($data->lan);
			$UserId = trim($data->UserId);

			$InvoiceMaster = isset($data->InvoiceMaster) ? ($data->InvoiceMaster) : [];

			$DataValueMasterId = $InvoiceMaster->id;
			$DivisionId = $InvoiceMaster->DivisionId;
			$DistrictId = $InvoiceMaster->DistrictId;
			$UpazilaId = $InvoiceMaster->UpazilaId;
			$DataTypeId = $InvoiceMaster->DataTypeId;
			$PGId = $InvoiceMaster->PGId;
			$YearId = $InvoiceMaster->YearId;
			$QuarterId = $InvoiceMaster->QuarterId;
			$Remarks = isset($InvoiceMaster->Remarks) && ($InvoiceMaster->Remarks !== "") ? $InvoiceMaster->Remarks : NULL;
			$DataCollectorName = $InvoiceMaster->DataCollectorName;
			$DataCollectionDate = $InvoiceMaster->DataCollectionDate;
			$UserId = $InvoiceMaster->UserId;
			$BPosted = $InvoiceMaster->BPosted;


			$aQuerys = array();

			/**Insert or update master */
			if ($DataValueMasterId === "") {
				$q = new insertq();
				$q->table = 't_datavaluemaster';
				$q->columns = ['DivisionId', 'DistrictId', 'UpazilaId','DataTypeId', 'PGId', 'YearId', 'QuarterId','Remarks', 'DataCollectorName', 'DataCollectionDate', 'UserId', 'BPosted'];
				$q->values = [$DivisionId,$DistrictId,$UpazilaId,$DataTypeId,$PGId,$YearId,$QuarterId,$Remarks,$DataCollectorName,$DataCollectionDate,$UserId,$BPosted];
				$q->pks = ['DataValueMasterId'];
				$q->bUseInsetId = true;
				$q->build_query();
				$aQuerys[] = $q;
			} else {
				$u = new updateq();
				$u->table = 't_datavaluemaster';
				$u->columns = ['PGId', 'YearId', 'QuarterId','Remarks', 'DataCollectorName', 'DataCollectionDate', 'BPosted'];
				$u->values = [$PGId,$YearId,$QuarterId,$Remarks,$DataCollectorName,$DataCollectionDate,$BPosted];
				$u->pks = ['DataValueMasterId'];
				$u->pk_values = [$DataValueMasterId];
				$u->build_query();
				$aQuerys[] = $u;
			}


			/**Get question list */
			$query = "SELECT a.QuestionId,a.QuestionCode FROM t_questions a;";
			$resultdataQuestoins = $dbh->query($query);
			$questionList = array();
			foreach ($resultdataQuestoins as $rowq) {
				$questionList[$rowq['QuestionCode']] = $rowq['QuestionId'];
			}



			$dataValuesList = array();
			if ($DataValueMasterId !== "") {
				/**When Master exist then select items */

				$query = "SELECT DataValueItemId, QuestionId 
				FROM t_datavalueitems 
				where DataValueMasterId=$DataValueMasterId;";
				$resultdataD = $dbh->query($query);
				foreach ($resultdataD as $rowd) {
					$dataValuesList[$rowd['QuestionId']] = $rowd['DataValueItemId'];
				}
		
			}

// echo "<pre>";
// print_r($dataValuesList);
// print_r($questionList);
// exit;

			/**Insert or update items */
			$InvoiceItems = isset($data->InvoiceItems) ? ($data->InvoiceItems) : [];
			foreach($InvoiceItems as $QuestionCode=>$DataValue){
				// echo "$QuestionCode=>$DataValue======";


				$QuestionId = $questionList[$QuestionCode];

				$DataValueItemId = "";
				if(array_key_exists($QuestionId, $dataValuesList)){
					$DataValueItemId = $dataValuesList[$QuestionId];
				}
				
				// echo $DataValueItemId."==";

				// $dataValuesList[$rowd['QuestionId']] = $rowd['DataValueItemId'];

			

				if ($DataValueItemId === "") {

					if ($DataValueMasterId === "") {
						$MasterId = "[LastInsertedId]";
					} else {
						$MasterId = $DataValueMasterId;
					}
					$q = new insertq();
					$q->table = 't_datavalueitems';
					$q->columns = ['DataValueMasterId', 'QuestionId', 'DataValue'];
					$q->values = [$MasterId,$QuestionId,$DataValue];
					$q->pks = ['DataValueItemId'];
					$q->bUseInsetId = false;
					$q->build_query();
					$aQuerys[] = $q;
				} else {
					$u = new updateq();
					$u->table = 't_datavalueitems';
					$u->columns = ['DataValue'];
					$u->values = [$DataValue];
					$u->pks = ['DataValueItemId'];
					$u->pk_values = [$DataValueItemId];
					$u->build_query();
					$aQuerys[] = $u;
				}

			}

			// BQ1=>reBQ2=>3543BQ3=>345rfeBQ4.1=>3454BQ4.3=>34MQ15=>falseMQ16=>345
			// BQ1=>AAA======BQ2=>3000======BQ3=>BBB======BQ4.1=>18======BQ4.2=>10======MQ4.1=>1======MQ16=>200======
// exit;
// echo "<pre>";
// print_r($aQuerys);
// exit;

			$res = exec_query($aQuerys, $UserId, $lan);
			
			$success = ($res['msgType'] === 'success') ? 1 : 0;
			$status = ($res['msgType'] === 'success') ? 200 : 500;
			$returnData = [
				"success" => $success,
				"status" => $status,
				"id" => $res['id'],
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

		$DataValueMasterId = $data->rowData->id;
		$lan = trim($data->lan);
		$UserId = trim($data->UserId);

		try {

			// $dbh = new Db();

			$aQuerys = array();

			$d = new deleteq();
			$d->table = 't_datavalueitems';
			$d->pks = ['DataValueMasterId'];
			$d->pk_values = [$DataValueMasterId];
			$d->build_query();
			$aQuerys[] = $d;

			$d = new deleteq();
			$d->table = 't_datavaluemaster';
			$d->pks = ['DataValueMasterId'];
			$d->pk_values = [$DataValueMasterId];
			$d->build_query();
			$aQuerys[] = $d;


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
