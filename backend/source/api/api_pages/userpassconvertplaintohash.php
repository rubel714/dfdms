<?php

include_once ('../../../env.php');
include_once ('../pdolibs/pdo_lib.php');
$dbh = new Db();

$query = "SELECT * FROM t_users where UserId>=121000;";
$resultdata = $dbh->query($query);

$count=0;
//echo "<pre>";
foreach($resultdata as $key=>$row){
	//print_r($row);	
	// echo strlen($row['Password'])."==";
	if(strlen($row['Password'])<10){
		$count++;
		$Password = password_hash($row['Password'], PASSWORD_DEFAULT);
		$sql = "update t_users set Password='".$Password."' where UserId=".$row['UserId'].";";
		$resultdata = $dbh->query($sql);
	}
}

echo "Total hash password updated:".$count;

?>