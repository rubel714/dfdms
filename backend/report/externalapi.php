<?php

include_once ('../env.php');
include_once ('../source/api/pdolibs/pdo_lib.php');
/*
//sync off
localhost/dfdms/backend/report/externalapi.php?action=datasyncoff&status=1

//sync on
localhost/dfdms/backend/report/externalapi.php?action=datasyncoff&status=0


//sync off
https://dfdms.lddp.gov.bd/backend/report/externalapi.php?action=datasyncoff&status=1

//sync on
https://dfdms.lddp.gov.bd/backend/report/externalapi.php?action=datasyncoff&status=0

*/
$task = '';

if (isset($_GET['action'])) {
	$task = $_GET['action'];
}

switch($task){

	case "datasyncoff":
		datasyncoff();
		break;

	default :
		echo "{failure:true}";
		break;
}


function datasyncoff() {
	$status = $_GET['status'];

	$dbh = new Db();
	$sql = "update t_settings set Status=$status where SettingId='DataSyncOff';";
	$result = $dbh->query($sql);

	$dbh->CloseConnection();
	
	echo "Set $status done";
}

?>