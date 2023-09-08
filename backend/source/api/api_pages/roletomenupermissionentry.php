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


	case "assignData":
		$returnData = assignData($data);
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

	$RoleId = trim($data->RoleId);
	
	try {
		$dbh = new Db();


		$query = "SELECT a.MenuId,IF(MenuLevel='menu_level_2',CONCAT(' -', a.MenuTitle),IF(MenuLevel='menu_level_3',CONCAT(' --', a.MenuTitle),a.MenuTitle)) menuname,
					CASE WHEN b.MenuId IS NULL THEN 0 ELSE 1 END bChecked, RoleMenuId
			   FROM `t_menu` a
			   LEFT JOIN t_role_menu_map b ON b.`MenuId` = a.`MenuId` AND b.RoleId = $RoleId
			   ORDER BY SortOrder;";

	/* 	echo $query ;
		exit; 
		*/

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



function assignData($data)
{

	if ($_SERVER["REQUEST_METHOD"] != "POST") {
		return $returnData = msg(0, 404, 'Page Not Found!');
	}{

		$MenuId = $data->rowData->MenuId;
		$lan = trim($data->lan);
		$UserId = trim($data->UserId);
		$RoleId = trim($data->RoleId);


		try {

			$dbh = new Db();

			$aQuerys = array();

			$q = new insertq();
			$q->table = 't_role_menu_map';
			$q->columns = ['RoleId', 'MenuId'];
			$q->values = [$RoleId, $MenuId];
			$q->pks = ['RoleMenuId'];
			$q->bUseInsetId = false;
			$q->build_query();
			$aQuerys[] = $q;


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



function deleteData($data)
{

	if ($_SERVER["REQUEST_METHOD"] != "POST") {
		return $returnData = msg(0, 404, 'Page Not Found!');
	}
	// CHECKING EMPTY FIELDS
	elseif (!isset($data->rowData->RoleMenuId)) {
		$fields = ['fields' => ['RoleMenuId']];
		return $returnData = msg(0, 422, 'Please Fill in all Required Fields!', $fields);
	} else {

		$RoleMenuId = $data->rowData->RoleMenuId;
		$lan = trim($data->lan);
		$UserId = trim($data->UserId);


		try {

			$dbh = new Db();

			$aQuerys = array();


			$d = new deleteq();
			$d->table = 't_role_menu_map';
			$d->pks = ['RoleMenuId'];
			$d->pk_values = [$RoleMenuId];
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
