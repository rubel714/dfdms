<?php
include("global.php");

$task = '';
if(isset($data->action)) {
	$task = trim($data->action);
}

switch($task){
	

	case "DataTypeList":
		$returnData = DataTypeList($data);
		break;
	
	case "PgGroupList":
		$returnData = PgGroupList($data);
		break;
	
	case "FarmerList":
		$returnData = FarmerList($data);
		break;
	
	case "QuarterList":
		$returnData = QuarterList($data);
		break;
	
	case "YearList":
		$returnData = YearList($data);
		break;
	
	case "GrassList":
		$returnData = GrassList($data);
		break;
	
	case "LandTypeList":
		$returnData = LandTypeList($data);
		break;

			
	case "RoleList":
		$returnData = RoleList($data);
		break;
	
	case "ParentQuestionList":
		$returnData = ParentQuestionList($data);
		break;
	
	case "DivisionList":
		$returnData = DivisionList($data);
		break;
	
	case "DistrictList":
		$returnData = DistrictList($data);
		break;

	case "UpazilaList":
		$returnData = UpazilaList($data);
		break;
		
	case "UnionList":
		$returnData = UnionList($data);
		break;

	case "QuestionTypeList":
		$returnData = QuestionTypeList($data);
		break;

	case "DesignationList":
		$returnData = DesignationList($data);
		break;
	case "gRoleList":
		$returnData = gRoleList($data);
		break;

	case "IsRegularBeneficiaryList":
		$returnData = IsRegularBeneficiaryList($data);
		break;

	case "QuestionMapCategoryList":
		$returnData = QuestionMapCategoryList($data);
		break;
		
	case "GenderList":
		$returnData = GenderList($data);
		break;

	case "BankList":
		$returnData = BankList($data);
		break;

	case "HeadOfHHSexList":
		$returnData = HeadOfHHSexList($data);
		break;
		
	case "TypeOfMemberList":
		$returnData = TypeOfMemberList($data);
		break;
		
	case "FamilyOccupationList":
		$returnData = FamilyOccupationList($data);
		break;
		
	case "CityCorporationList":
		$returnData = CityCorporationList($data);
		break;
		
	case "WardList":
		$returnData = WardList($data);
		break;
		
	case "DisabilityStatusList":
		$returnData = DisabilityStatusList($data);
		break;
	case "AgencyDepartmntList":
		$returnData = AgencyDepartmntList($data);
		break;
	case "PgGroupListByUnion":
		$returnData = PgGroupListByUnion($data);
		break;
		
	case "DivisionFilterList":
		$returnData = DivisionFilterList($data);
		break;
		
	case "DistrictFilterList":
		$returnData = DistrictFilterList($data);
		break;
		
	case "UpazilaFilterList":
		$returnData = UpazilaFilterList($data);
		break;
		
	case "UnionFilterList":
		$returnData = UnionFilterList($data);
		break;
		
	// case "NextInvoiceNumber":
	// 	$returnData = NextInvoiceNumber($data);
	// 	break;
		
		
}

// echo json_encode($returnData);
return $returnData;

 
function DataTypeList($data) {
	try{

		$dbh = new Db();
		$query = "SELECT DataTypeId id, DataTypeName `name` FROM t_datatype  ORDER BY id ASC;"; 
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
 
function PgGroupList($data) {
	try{

		$DivisionId = trim($data->DivisionId);
		$DistrictId = trim($data->DistrictId);
		$UpazilaId = trim($data->UpazilaId);


		$dbh = new Db();
		
		$query = "SELECT `PGId` id,
			`DivisionId`,
			`DistrictId`,
			`UpazilaId`,
			`PGName` `name`,
			`Address`
			FROM t_pg  
			WHERE DivisionId=$DivisionId 
			AND DistrictId=$DistrictId
			AND UpazilaId=$UpazilaId
		ORDER BY PGName;"; 
	
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

  
function FarmerList($data) {
	try{

		$DivisionId = trim($data->DivisionId);
		$DistrictId = trim($data->DistrictId);
		$UpazilaId = trim($data->UpazilaId);
		$PGId = trim($data->PGId);


		$dbh = new Db();
		
		$query = "SELECT `FarmerId` id,
			concat(`FarmerName`,'-',NID,'-',Phone) `name`,ValuechainId
			FROM t_farmer  
			WHERE DivisionId=$DivisionId 
			AND DistrictId=$DistrictId
			AND UpazilaId=$UpazilaId
			AND (PGId=$PGId OR $PGId=0)
		ORDER BY FarmerName;"; 
	// 	$query = "SELECT `FarmerId` id,
	// 	concat(`FarmerName`,'-',NID,'-',Phone) `name`
	// 	FROM t_farmer  
		
	// ORDER BY FarmerName;"; 


		// $query = "SELECT `FarmerId` id,
		// concat(`FarmerName`,'-',NID,'-',Phone) `name`
		// FROM t_farmer  
		// WHERE (PGId=$PGId OR $PGId=0)
		// ORDER BY FarmerName;"; 

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
 
 
function QuarterList($data) {
	try{

		$dbh = new Db();
		
		$query = "SELECT `QuarterId` id,`QuarterName` `name`
	 			 	FROM `t_quarter` 
					ORDER BY QuarterId;"; 
	
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
   
 
function YearList($data) {
	try{

		$dbh = new Db();
		
		$query = "SELECT `YearId` id,`YearName` `name`
	 			 	FROM `t_year` 
					ORDER BY YearName;"; 
	
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
   
 
function GrassList($data) {
	try{

		$dbh = new Db();
		
		$query = "SELECT `GrassId` id,`GrassName` `name`
	 			 	FROM `t_grasslist` 
					ORDER BY GrassName;"; 
	
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
   
 
function LandTypeList($data) {
	try{

		$dbh = new Db();
		
		$query = "SELECT `LandTypeId` id,`LandType` `name`
	 			 	FROM `t_landtype` 
					ORDER BY LandType;"; 
	
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
 
function RoleList($data) {
	try{

		$dbh = new Db();
		
		$query = "SELECT `RoleId` id,`RoleName` `name`
	 			 	FROM `t_roles` 
					ORDER BY RoleName;"; 
	
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
 
function ParentQuestionList($data) {
	try{

		$dbh = new Db();
		
		$query = "SELECT `QuestionId` id,`QuestionName` `name`
			FROM `t_questions`
			WHERE `QuestionType` IN ('MultiOption', 'MultiRadio')
		ORDER BY QuestionName;"; 
		
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



function DivisionList($data) {
	try{
	
		$dbh = new Db();
		$query = "SELECT DivisionId id, DivisionName `name` FROM t_division ORDER BY DivisionName;"; 
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


function DistrictList($data) {
	try{
	
		$dbh = new Db();

		$DivisionId = trim($data->DivisionId)?trim($data->DivisionId):0; 
		$query = "SELECT DistrictId id, DistrictName `name` FROM t_district 
			where DivisionId=$DivisionId
			ORDER BY DistrictName;"; 

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

function UpazilaList($data) {
	try{
	
		$dbh = new Db();

		$DivisionId = trim($data->DivisionId)?trim($data->DivisionId):0; 
		$DistrictId = trim($data->DistrictId)?trim($data->DistrictId):0; 


		$query = "SELECT UpazilaId id, UpazilaName `name` FROM t_upazila 
			where DivisionId=$DivisionId
			AND DistrictId=$DistrictId
			ORDER BY UpazilaName;"; 

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



function UnionList($data) {
	try{
	
		$dbh = new Db();

		$DivisionId = trim($data->DivisionId)?trim($data->DivisionId):0; 
		$DistrictId = trim($data->DistrictId)?trim($data->DistrictId):0; 
		$UpazilaId = trim($data->UpazilaId)?trim($data->UpazilaId):0; 


		$query = "SELECT UnionId id, UnionName `name` FROM t_union 
			where DivisionId=$DivisionId
			AND DistrictId=$DistrictId
			AND UpazilaId=$UpazilaId
			ORDER BY UnionName;"; 

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


function QuestionTypeList($data) {
	try{
	
		$dbh = new Db();
		/* $query = "SELECT DivisionId id, DivisionName `name` FROM t_division ORDER BY DivisionName;"; 
		$resultdata = $dbh->query($query); 
		print_r($resultdata);
		exit; */
	
		$jsonData = '[
			{"id":"Label","name":"Label"},
			{"id":"Text","name":"Text"},
			{"id":"Number","name":"Number"},
			{"id":"Date","name":"Date"},
			{"id":"MultiOption","name":"MultiOption"},
			{"id":"YesNo","name":"YesNo"},
			{"id":"Check","name":"Check"},
			{"id":"CheckText","name":"CheckText"},
			{"id":"DropDown","name":"DropDown"},
			{"id":"MultiRadio","name":"MultiRadio"},
			{"id":"Radio","name":"Radio"}
		]';

		$resultdata = json_decode($jsonData, true);

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




function DesignationList($data) {
	try{

		$dbh = new Db();

		$query = "SELECT `DesignationId` id,`DesignationName` `name`
	 			 	FROM `t_designation` 
					ORDER BY DesignationName;"; 
	
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
 


function gRoleList($data) {
	try{

		$dbh = new Db();

		$query = "SELECT RoleId id, RoleName role
		FROM t_roles ORDER BY RoleName;"; 
	
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
 



function IsRegularBeneficiaryList($data) {
	try{
	
		$dbh = new Db();
	
		$jsonData = '[
			{"id":"1","name":"Regular"},
			{"id":"2","name":"Irregular"}
		]';

		$resultdata = json_decode($jsonData, true);

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



function QuestionMapCategoryList($data) {
	try{
	
		$dbh = new Db();
	

		$query = "SELECT ValuechainId id, ValueChainName name
		FROM t_valuechain ORDER BY ValueChainName;"; 

		$resultdata = $dbh->query($query);

		/* $jsonData = '[
			{"id":"DAIRY","name":"Dairy"},
			{"id":"BEEFFATTENING","name":"Beef Fattening"},
			{"id":"BUFFALO","name":"Buffalo"},
			{"id":"GOAT","name":"Goat"},
			{"id":"SHEEP","name":"Sheep"},
			{"id":"SCAVENGINGCHICKENLOCAL","name":"Scavenging Chicken Local"},
			{"id":"SONALI","name":"Sonali"},
			{"id":"COMMERCIALBROILER","name":"Commercial Broiler"},
			{"id":"QUAIL","name":"Quail"},
			{"id":"TURKEY","name":"Turkey"},
			{"id":"GUINEAFOWL","name":"Guinea Fowl"},
			{"id":"PIGEON","name":"Pigeon"},
			{"id":"DUCK","name":"Duck"},
			{"id":"LAYER","name":"Layer"}
		]'; */


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


function GenderList($data) {
	try{
	
		$dbh = new Db();
	

		$query = "SELECT GenderId id, GenderName name
		FROM t_gender ORDER BY GenderName;"; 

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

function BankList($data) {
	try{
	
		$dbh = new Db();
	

		$query = "SELECT BankId id, BankName name
		FROM t_bank ORDER BY BankName;"; 

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

function HeadOfHHSexList($data) {
	try{
	
		$dbh = new Db();
	

		$query = "SELECT GenderId id, GenderName name
		FROM t_gender ORDER BY GenderName;"; 

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

function TypeOfMemberList($data) {
	try{
	
		$dbh = new Db();
	

		$query = "SELECT TypeOfMemberId id, TypeOfMember name
		FROM t_typeofmember ORDER BY TypeOfMember;"; 

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

function FamilyOccupationList($data) {
	try{
	
		$dbh = new Db();
	

		$query = "SELECT OccupationId id, OccupationName name
		FROM t_occupation ORDER BY OccupationName;"; 

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

function CityCorporationList($data) {
	try{
	
		$dbh = new Db();
	

		$query = "SELECT CityCorporation id, CityCorporationName name
		FROM t_citycorporation ORDER BY CityCorporationName;"; 

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

function WardList($data) {
	try{
	
		$dbh = new Db();

		//$DivisionId = trim($data->DivisionId)?trim($data->DivisionId):0; 
		//$DistrictId = trim($data->DistrictId)?trim($data->DistrictId):0; 
		//$UpazilaId = trim($data->UpazilaId)?trim($data->UpazilaId):0; 
		$UnionId = trim($data->UnionId)?trim($data->UnionId):0; 


		$query = "SELECT Ward id, WardName `name` FROM t_ward 
			where UnionId=$UnionId
			ORDER BY WardName;"; 

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

function DisabilityStatusList($data) {
	try{
	
		$dbh = new Db();
	

		$jsonData = '[
			{"id":"1","name":"Yes"},
			{"id":"2","name":"No"}
		]';

		$resultdata = json_decode($jsonData, true);

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


function AgencyDepartmntList($data) {
	try{
	
		$dbh = new Db();

		$query = "SELECT DepartmentId id, DepartmentName `name` FROM t_department 
			ORDER BY DepartmentName;"; 

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


function PgGroupListByUnion($data) {
	try{

		$DivisionId = trim($data->DivisionId);
		$DistrictId = trim($data->DistrictId);
		$UpazilaId = trim($data->UpazilaId);
		$UnionId = trim($data->UnionId);
		$ValuechainId = trim($data->ValuechainId)?trim($data->ValuechainId):''; 
		
		

		$dbh = new Db();
		
		$query = "SELECT `PGId` id,
			`DivisionId`,
			`DistrictId`,
			`UpazilaId`,
			`PGName` `name`,
			`Address`
			FROM t_pg  
			WHERE DivisionId=$DivisionId 
			AND DistrictId=$DistrictId
			AND UpazilaId=$UpazilaId
			/* AND UnionId=$UnionId */
			AND (ValuechainId = '$ValuechainId' OR '$ValuechainId' ='')
		ORDER BY PGName;";

	
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




function DivisionFilterList($data) {
	try{
	
		$dbh = new Db();
		$query = "SELECT DivisionId id, DivisionName `name` FROM t_division ORDER BY DivisionName;"; 
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


function DistrictFilterList($data) {
	try{
	
		$dbh = new Db();

		$DivisionId = trim($data->DivisionId)?trim($data->DivisionId):0; 
		$query = "SELECT DistrictId id, DistrictName `name` FROM t_district 
			where (DivisionId = $DivisionId OR $DivisionId=0)
			ORDER BY DistrictName;"; 

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

function UpazilaFilterList($data) {
	try{
	
		$dbh = new Db();

		$DivisionId = trim($data->DivisionId)?trim($data->DivisionId):0; 
		$DistrictId = trim($data->DistrictId)?trim($data->DistrictId):0; 

		
		$query = "SELECT UpazilaId id, UpazilaName `name` FROM t_upazila 
			where (DivisionId = $DivisionId OR $DivisionId=0)
			AND (DistrictId = $DistrictId OR $DistrictId=0)
			ORDER BY UpazilaName;"; 

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



function UnionFilterList($data) {
	try{
	
		$dbh = new Db();

		$DivisionId = trim($data->DivisionId)?trim($data->DivisionId):0; 
		$DistrictId = trim($data->DistrictId)?trim($data->DistrictId):0; 
		$UpazilaId = trim($data->UpazilaId)?trim($data->UpazilaId):0; 





		$query = "SELECT UnionId id, UnionName `name` FROM t_union 
			where (DivisionId = $DivisionId OR $DivisionId=0)
			AND (DistrictId = $DistrictId OR $DistrictId=0)
			AND (UpazilaId = $UpazilaId OR $UpazilaId=0)
			ORDER BY UnionName;"; 

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


// function NextInvoiceNumber($data) {
// 	try{

// 		$ClientId = trim($data->ClientId);
// 		$BranchId = trim($data->BranchId);
// 		$TransactionTypeId = trim($data->TransactionTypeId);
// 		$InvNo = getNextInvoiceNumber($ClientId,$BranchId,$TransactionTypeId);

// 		$returnData = [
// 			"success" => 1,
// 			"status" => 200,
// 			"message" => "",
// 			"datalist" => $InvNo
// 		];

// 	}catch(PDOException $e){
// 		$returnData = msg(0,500,$e->getMessage());
// 	}
	
// 	return $returnData;
// }
