<?php


// function getNextInvoiceNumber($ClientId,$BranchId,$TransactionTypeId) {

// 	$dbh = new Db();

// 	$query = "SELECT IFNULL(MAX(InvoiceNo),0)+1 NextNo 
// 	FROM t_transaction 
// 	WHERE ClientId = $ClientId
// 	AND BranchId = $BranchId
// 	AND TransactionTypeId = $TransactionTypeId;"; 
// 	$resultdata = $dbh->query($query);
// 	$NextNo = $resultdata[0]["NextNo"];

// 	return $NextNo;
// }
