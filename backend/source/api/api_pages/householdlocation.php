<?php

$task = '';
if (isset($data->action)) {
	$task = trim($data->action);
}

switch ($task) {

	case "getDataList":
		$returnData = getDataList($data);
		break;

	default:
		echo "{failure:true}";
		break;
}

function getDataList($data)
{

	try {
		$dbh = new Db();
		$DivisionId = trim($data->DivisionId) ? trim($data->DivisionId) : 0;
		$DistrictId = trim($data->DistrictId) ? trim($data->DistrictId) : 0;
		$UpazilaId = trim($data->UpazilaId) ? trim($data->UpazilaId) : 0;


		$query = "SELECT a.`HouseHoldId`,b.`DivisionName`,c.`DistrictName`,d.`UpazilaName`,e.`UnionName`,a.`FarmerName`,a.`Phone`,f.`GenderName`,a.`Latitute`,a.`Longitute`
		FROM `t_householdlivestocksurvey` a
		INNER JOIN `t_division` b ON a.`DivisionId`=b.`DivisionId`
		INNER JOIN `t_district` c ON a.`DistrictId`=c.`DistrictId`
		INNER JOIN `t_upazila` d ON a.`UpazilaId`=d.`UpazilaId`
		INNER JOIN `t_union` e ON a.`UnionId`=e.`UnionId`
		INNER JOIN `t_gender` f ON a.`Gender`=f.`GenderId`
		WHERE (a.DivisionId = $DivisionId OR $DivisionId=0)
		 AND (a.DistrictId = $DistrictId OR $DistrictId=0)
		 AND (a.UpazilaId = $UpazilaId OR $UpazilaId=0);";

		$resultdata = $dbh->query($query);

		$dataList = array();
		foreach ($resultdata as $key => $row) {
			$dataList[] = $row;
		}

		$returnData = [
			"success" => 1,
			"status" => 200,
			"message" => "",
			"datalist" => $dataList
		];
	} catch (PDOException $e) {
		$returnData = msg(0, 500, $e->getMessage());
	}

	return $returnData;
}
