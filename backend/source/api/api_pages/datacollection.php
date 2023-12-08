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

	case "changeReportStatus":
		$returnData = changeReportStatus($data);
		break;
	
	case "getFarmerInfo":
		$returnData = getFarmerInfo($data);
		break;
	
	case "getPGInfo":
		$returnData = getPGInfo($data);
		break;

	default:
		echo "{failure:true}";
		break;
}

function getDataList($data)
{

	$DivisionId = trim($data->DivisionId)?trim($data->DivisionId):0; 
	$DistrictId = trim($data->DistrictId)?trim($data->DistrictId):0; 
	$UpazilaId = trim($data->UpazilaId)?trim($data->UpazilaId):0; 
	$DataTypeId = trim($data->DataTypeId); 
	$YearId = trim($data->YearId); 
	$QuarterId = trim($data->QuarterId); 

	try {
		$dbh = new Db();

		$query = "SELECT a.`DataValueMasterId` as id, a.`DivisionId`, a.`DistrictId`, a.`UpazilaId`, a.`PGId`,a.FarmerId,a.Categories, a.`YearId`, a.`QuarterId`,
		 a.`Remarks`, a.`DataCollectorName`, a.`DataCollectionDate`, a.`UserId`,a.BPosted
		, concat(a.YearId,' (',e.QuarterName,')') QuarterName, b.DivisionName,c.DistrictName,d.UpazilaName,f.PGName
		,a.StatusId,a.DesignationId,a.PhoneNumber
		FROM t_datavaluemaster a
		inner join t_division b on a.DivisionId=b.DivisionId
		inner join t_district c on a.DistrictId=c.DistrictId
		inner join t_upazila d on a.UpazilaId=d.UpazilaId
		inner join t_quarter e on a.QuarterId=e.QuarterId
		inner join t_pg f on a.PGId=f.PGId
		WHERE (a.DivisionId = $DivisionId OR $DivisionId=0)
		AND (a.DistrictId = $DistrictId OR $DistrictId=0)
		AND (a.UpazilaId = $UpazilaId OR $UpazilaId=0)
		AND a.DataTypeId=$DataTypeId
		AND a.YearId = '$YearId'
		AND a.QuarterId = $QuarterId
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

		$query = "SELECT a.`QuestionId`, a.`QuestionCode`, 
		CASE WHEN a.`QuestionType`='Label' THEN b.`LabelName` ELSE a.`QuestionName` END QuestionName, a.`QuestionType`, 
		a.`IsMandatory`, a.`QuestionParentId`, b.`SortOrder`, 0 SortOrderChild,a.Settings,b.Category
		FROM t_questions a
		INNER JOIN t_datatype_questions_map b ON a.QuestionId=b.QuestionId
		WHERE b.DataTypeId = $DataTypeId

		UNION ALL

		SELECT child.`QuestionId`, child.`QuestionCode`, child.`QuestionName`, child.`QuestionType`, 
		child.`IsMandatory`, child.`QuestionParentId`, 
		(SELECT s.SortOrder FROM t_datatype_questions_map s WHERE s.QuestionId=child.QuestionParentId) `SortOrder`, 
		child.SortOrderChild,child.Settings,m.Category
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
		$query = "SELECT `DataValueMasterId` as id, `DivisionId`, `DistrictId`, `UpazilaId`,DataTypeId, `PGId`,FarmerId,Categories, `YearId`, `QuarterId`,
		 `Remarks`, `DataCollectorName`, `DataCollectionDate`, `UserId`, `BPosted`,StatusId, `UpdateTs`, `CreateTs`,a.DesignationId,a.PhoneNumber
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

		/**Items Details Data */
		$query = "SELECT a.DataValueItemDetailsId,a.`DataValueMasterId`, a.`DataValueItemId`, a.`GrassId`,
		a.LandTypeId,a.Cultivation,a.Production, a.Consumption,a.Sales
		FROM t_datavalueitemsdetails a
		where a.DataValueMasterId=$DataValueMasterId
		order by a.DataValueItemDetailsId;";
		$resultdataItemsDetails = $dbh->query($query);

		// $itemsDetails = array();
		// foreach ($resultdataItemsDetails as $row) {

		// 	if($row['QuestionType'] === "CheckText"){
		// 		$items[$row['QuestionCode']] = $row['DataValue'] === "0" ? false : $row['DataValue'];
		// 	}else{
		// 		$items[$row['QuestionCode']] = $row['DataValue'];
		// 	}
			
		// }

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => array("master" => $resultdataMaster, "items" => $items, "itemsdetails" => $resultdataItemsDetails)
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
			$FarmerId = isset($InvoiceMaster->FarmerId) && ($InvoiceMaster->FarmerId !== "") ? $InvoiceMaster->FarmerId : NULL;
			$DesignationId = isset($InvoiceMaster->DesignationId) && ($InvoiceMaster->DesignationId !== "") ? $InvoiceMaster->DesignationId : NULL;
			$Categories = isset($InvoiceMaster->Categories) && ($InvoiceMaster->Categories !== "") ? $InvoiceMaster->Categories : NULL;
			$YearId = $InvoiceMaster->YearId;
			$QuarterId = $InvoiceMaster->QuarterId;
			$Remarks = isset($InvoiceMaster->Remarks) && ($InvoiceMaster->Remarks !== "") ? $InvoiceMaster->Remarks : NULL;
			$PhoneNumber = isset($InvoiceMaster->PhoneNumber) && ($InvoiceMaster->PhoneNumber !== "") ? $InvoiceMaster->PhoneNumber : NULL;
			$DataCollectorName = $InvoiceMaster->DataCollectorName;
			$DataCollectionDate = $InvoiceMaster->DataCollectionDate;
			$UserId = $InvoiceMaster->UserId;
			$BPosted = $InvoiceMaster->BPosted;
			$StatusId = 1;

			$aQuerys = array();

			/**Insert or update master */
			if ($DataValueMasterId === "") {
				$q = new insertq();
				$q->table = 't_datavaluemaster';
			
				$q->columns = ['DivisionId', 'DistrictId', 'UpazilaId','DataTypeId', 'PGId','FarmerId','Categories', 'YearId', 'QuarterId','Remarks', 'DataCollectorName', 'DataCollectionDate', 'UserId', 'BPosted','StatusId','DesignationId','PhoneNumber'];
				$q->values = [$DivisionId,$DistrictId,$UpazilaId,$DataTypeId,$PGId,$FarmerId,$Categories,$YearId,$QuarterId,$Remarks,$DataCollectorName,$DataCollectionDate,$UserId,$BPosted,$StatusId,$DesignationId,$PhoneNumber];
				$q->pks = ['DataValueMasterId'];
				$q->bUseInsetId = true;
				$q->build_query();
				$aQuerys[] = $q;
			} else {
				$u = new updateq();
				$u->table = 't_datavaluemaster';
				$u->columns = ['PGId','FarmerId','Categories', 'YearId', 'QuarterId','Remarks', 'DataCollectorName', 'DataCollectionDate', 'BPosted','DesignationId','PhoneNumber'];
				$u->values = [$PGId,$FarmerId,$Categories,$YearId,$QuarterId,$Remarks,$DataCollectorName,$DataCollectionDate,$BPosted,$DesignationId,$PhoneNumber];
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

			if($success == 1){
				

				/**Insert or update items details */
				$InvoiceItemsDetails = isset($data->InvoiceItemsDetails) ? ($data->InvoiceItemsDetails) : [];
				if(count($InvoiceItemsDetails)>0){

					if ($DataValueMasterId === "") {
						$DataValueMasterId = $res['id'];
					}

					
					/**When the question has "Do you cultivate fodder (green grass)?" 
					 * and select YES then following code execute for save TABLE date under this question* */
					$sq = "SELECT ifnull(max(a.DataValueItemId),0) as DataValueItemId
					FROM t_datavalueitems a
					inner join t_questions b on a.QuestionId=b.QuestionId
					where a.DataValueMasterId=$DataValueMasterId
					and b.QuestionCode='GRASS__00000';"; 
					$sqr = $dbh->query($sq);
					$DataValueItemId = $sqr[0]["DataValueItemId"]; 
					// echo "==".$DataValueItemId."==";

					if($DataValueItemId > 0){
						$aQuerys = array();
						foreach($InvoiceItemsDetails as $key=>$DataValueDetails){

							$DataValueItemDetailsId = $DataValueDetails->DataValueItemDetailsId;
							//$DataValueItemId = $DataValueDetails->DataValueItemId;
							$GrassId = $DataValueDetails->GrassId;
							$LandTypeId = $DataValueDetails->LandTypeId;
							$Cultivation = $DataValueDetails->Cultivation;
							$Production = $DataValueDetails->Production;
							$Consumption = $DataValueDetails->Consumption;
							$Sales = $DataValueDetails->Sales;
							$RowType = $DataValueDetails->RowType;
							
							if ($RowType === "delete") {
								$d = new deleteq();
								$d->table = 't_datavalueitemsdetails';
								$d->pks = ['DataValueItemDetailsId'];
								$d->pk_values = [$DataValueItemDetailsId];
								$d->build_query();
								$aQuerys[] = $d;

							}
							else if ($RowType === "new") {
								$q = new insertq();
								$q->table = 't_datavalueitemsdetails';
								$q->columns = ['DataValueMasterId', 'DataValueItemId', 'GrassId','LandTypeId','Cultivation','Production','Consumption','Sales'];
								$q->values = [$DataValueMasterId,$DataValueItemId,$GrassId,$LandTypeId,$Cultivation,$Production,$Consumption,$Sales];
								$q->pks = ['DataValueItemDetailsId'];
								$q->bUseInsetId = false;
								$q->build_query();
								$aQuerys[] = $q;

							} else {
								$u = new updateq();
								$u->table = 't_datavalueitemsdetails';
								$u->columns = ['GrassId','LandTypeId','Cultivation','Production','Consumption','Sales'];
								$u->values = [$GrassId,$LandTypeId,$Cultivation,$Production,$Consumption,$Sales];
								$u->pks = ['DataValueItemDetailsId'];
								$u->pk_values = [$DataValueItemDetailsId];
								$u->build_query();
								$aQuerys[] = $u;
							}
			
						}

						$res1 = exec_query($aQuerys, $UserId, $lan);
						$success = ($res1['msgType'] === 'success') ? 1 : 0;
						$status = ($res1['msgType'] === 'success') ? 200 : 500;
						if($success==0){
							$returnData = [
								"success" => $success,
								"status" => $status,
								"id" => $res1['id'],
								"message" => $res1['msg']
							];
						}
				}


					
			}
		}


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
			$d->table = 't_datavalueitemsdetails';
			$d->pks = ['DataValueMasterId'];
			$d->pk_values = [$DataValueMasterId];
			$d->build_query();
			$aQuerys[] = $d;

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


function changeReportStatus($data)
{

	if ($_SERVER["REQUEST_METHOD"] != "POST") {
		return $returnData = msg(0, 404, 'Page Not Found!');
	}
	// CHECKING EMPTY FIELDS
	elseif (!isset($data->Id) || !isset($data->StatusId)) {
		$fields = ['fields' => ['Id','StatusId']];
		return $returnData = msg(0, 422, 'Please Fill in all Required Fields!', $fields);
	} else {

		$DataValueMasterId = $data->Id;
		$StatusId = $data->StatusId;
		$lan = trim($data->lan);
		$UserId = trim($data->UserId);

		$curDateTime = date('Y-m-d H:i:s');
		$UserFieldName = "";
		$DateFieldName = "";
		$BPosted = 0;

		if($StatusId == 2){
			$UserFieldName = "SubmitUserId";
			$DateFieldName = "SubmitDate";
		}else if($StatusId == 3){
			$UserFieldName = "AcceptUserId";
			$DateFieldName = "AcceptDate";
		}else if($StatusId == 5){
			$UserFieldName = "ApproveUserId";
			$DateFieldName = "ApproveDate";
			$BPosted = 1;
		}
		
	
		try {

			$aQuerys = array();

			$u = new updateq();
			$u->table = 't_datavaluemaster';
			$u->columns = ['StatusId',$UserFieldName,$DateFieldName,'BPosted'];
			$u->values = [$StatusId,$UserId,$curDateTime,$BPosted];
			$u->pks = ['DataValueMasterId'];
			$u->pk_values = [$DataValueMasterId];
			$u->build_query();
			$aQuerys[] = $u;


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




function getPGInfo($data)
{

	// echo "<pre>";
	// print_r($data);
	$PGId = trim($data->rowData->PGId);
	// echo $PGId;

	try {
		$dbh = new Db();

		$query = "SELECT a.*, b.`DivisionName`,c.`DistrictName`, d.`UpazilaName`, 
		 e.ValueChainName, f.UnionName,
		 CASE
        WHEN a.GenderId = 1 THEN 'Male'
        WHEN a.GenderId = 2 THEN 'Female'
        WHEN a.GenderId = 3 THEN 'Male-Female Both'
        ELSE 'Other'
    	END AS GenderName,
		CASE WHEN a.IsLeadByWomen = 1 THEN 'Yes' ELSE 'No' END AS IsLeadByWomenStatus,
		CASE WHEN a.IsActive = 1 THEN 'Active' ELSE 'Inactive' END AS ActiveStatus

		FROM t_pg a
		INNER JOIN t_division b ON a.`DivisionId` = b.`DivisionId`
		INNER JOIN t_district c ON a.`DistrictId` = c.`DistrictId`
		INNER JOIN t_upazila d ON a.`UpazilaId` = d.`UpazilaId`
		INNER JOIN t_union f ON a.`UnionId` = f.`UnionId`
		LEFT JOIN t_valuechain e ON a.`ValuechainId` = e.`ValuechainId`
		where a.PGId=$PGId;";
		$resultData = $dbh->query($query);

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $resultData
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}


function getFarmerInfo($data)
{

	// echo "<pre>";
	// print_r($data);
	$FarmerId = trim($data->rowData->FarmerId);
	// echo $FarmerId;

	try {
		$dbh = new Db();

		$query = "SELECT a.*, CASE WHEN a.IsRegular = 1 THEN 'Regular' ELSE 'Irregular' END AS RegularStatus,
		 CASE
        WHEN a.Gender = 1 THEN 'Male'
        WHEN a.Gender = 2 THEN 'Female'
        WHEN a.Gender = 3 THEN 'Male-Female Both'
        ELSE 'Other'
    	END AS GenderName,
		CASE WHEN a.DisabilityStatus = 1 THEN 'Yes' ELSE 'No' END AS isDisabilityStatus,
		CASE WHEN a.PGRegistered = 1 THEN 'Yes' ELSE 'No' END AS PGRegistered,
		CASE WHEN a.PGPartnershipWithOtherCompany = 1 THEN 'Yes' ELSE 'No' END AS PGPartnershipWithOtherCompany,
		CASE WHEN a.RelationWithHeadOfHH = 1 THEN 'HimselfIf/HerselfIf' ELSE 'Others' END AS RelationWithHeadOfHH,
		
		gh.TypeOfMember AS TypeOfMember,

		oc.OccupationName AS FamilyOccupation,

		CASE
        WHEN a.HeadOfHHSex = 1 THEN 'Male'
        WHEN a.HeadOfHHSex = 2 THEN 'Female'
        WHEN a.HeadOfHHSex = 5 THEN 'Transgender'
        ELSE 'Other'
    	END AS HeadOfHHSex,
		b.`DivisionName`,c.`DistrictName`, d.`UpazilaName`, 
		 e.ValueChainName, f.UnionName, g.PGName, a.Ward AS WardName, i.CityCorporationName, a.VillageName,
		 CASE WHEN a.IsHeadOfTheGroup = 1 THEN 'Yes' ELSE 'No' END AS HeadOfTheGroup
		
		FROM t_farmer a
		INNER JOIN t_division b ON a.`DivisionId` = b.`DivisionId`
		INNER JOIN t_district c ON a.`DistrictId` = c.`DistrictId`
		INNER JOIN t_upazila d ON a.`UpazilaId` = d.`UpazilaId`
		INNER JOIN t_union f ON a.`UnionId` = f.`UnionId`
		LEFT JOIN t_valuechain e ON a.`ValuechainId` = e.`ValuechainId`
		LEFT JOIN t_pg g ON a.`PGId` = g.`PGId`
		LEFT JOIN t_citycorporation i ON a.`CityCorporation` = i.`CityCorporation`
		LEFT JOIN t_typeofmember gh ON a.`TypeOfMember` = gh.`TypeOfMemberId`
		LEFT JOIN t_occupation oc ON a.`OccupationId` = oc.`OccupationId`

		


		where a.FarmerId=$FarmerId;";
		$resultData = $dbh->query($query);

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $resultData
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}

