<?php

include_once ('../env.php');
include_once ('../source/api/pdolibs/pdo_lib.php');

$tableProperties = array("header_list" => array(), "query_field" => array(), "table_header" => array(), "align" => array(), "width_print_pdf" => array(), "width_excel" => array(), "precision" => array(), "total" => array(), "report_save_name" => "");

// $menukey = $_REQUEST['menukey'];
// $lan = $_REQUEST['lan'];
// include_once ('../source/api/languages/lang_switcher_custom.php');

$siteTitle = reportsitetitleeng;

$task = '';

if (isset($_POST['action'])) {
	$task = $_POST['action'];
} else if (isset($_GET['action'])) {
	$task = $_GET['action'];
}

switch($task){
	
			
		case "DataTypeExport":
			DataTypeExport();
			break;
			
		case "RoleExport":
			RoleExport();
			break;

		case "RegularBeneficiaryExport":
			RegularBeneficiaryExport();
			break;
			
		case "MembersbyPGataExport":
			MembersbyPGataExport();
			break;
			
		case "UserDataExport":
			UserDataExport();
			break;

		case "RoleToMenuPermissionExport":
			RoleToMenuPermissionExport();
			break;

		case "DataTypeQuestionsMapExport":
			DataTypeQuestionsMapExport();
			break;

		case "QuestionDataExport":
			QuestionDataExport();
			break;
			
		case "PGDataExport":
			PGDataExport();
			break;
			
		// case "UserExport":
		// 	UserExport();
		// 	break;
		
		// case "RoleToMenuPermissionExport":
		// 	RoleToMenuPermissionExport();
		// 	break;
	
	default :
		echo "{failure:true}";
		break;
}


function DataTypeExport() {

	global $sql, $tableProperties, $TEXT, $siteTitle;
	// $ClientId = $_REQUEST['ClientId'];

	$sql = "SELECT DataTypeName
	FROM t_datatype 
	ORDER BY `DataTypeName`;";
	
    $tableProperties["query_field"] = array("DataTypeName");
    $tableProperties["table_header"] = array('Data Type Name');
    $tableProperties["align"] = array("left");
    $tableProperties["width_print_pdf"] = array("60%"); //when exist serial then here total 95% and 5% use for serial
    $tableProperties["width_excel"] = array("50");
    $tableProperties["precision"] = array("string"); //string,date,datetime,0,1,2,3,4
    $tableProperties["total"] = array(0); //not total=0, total=1
    $tableProperties["color_code"] = array(0); //colorcode field = 1 not color code field = 0
	$tableProperties["header_logo"] = 0; //include header left and right logo. 0 or 1
    $tableProperties["footer_signatory"] = 0; //include footer signatory. 0 or 1
    
	//Report header list
	$tableProperties["header_list"][0] = $siteTitle;
	$tableProperties["header_list"][1] = 'Data Type List';
	// $tableProperties["header_list"][1] = 'Heading 2';
	
	//Report save name. Not allow any type of special character
	$tableProperties["report_save_name"] = 'DataTypeList';
}

 

function RoleExport() {

	global $sql, $tableProperties, $TEXT, $siteTitle;
	
	$sql = "SELECT a.`RoleName`,a.DefaultRedirect
	FROM t_roles a
	ORDER BY a.RoleName;";
	
    $tableProperties["query_field"] = array("RoleName","DefaultRedirect");
    $tableProperties["table_header"] = array('Role Name','Default Redirect');
    $tableProperties["align"] = array("left","left");
    $tableProperties["width_print_pdf"] = array("30%","70%"); //when exist serial then here total 95% and 5% use for serial
    $tableProperties["width_excel"] = array("30","40");
    $tableProperties["precision"] = array("string","string"); //string,date,datetime,0,1,2,3,4
    $tableProperties["total"] = array(0,0); //not total=0, total=1
    $tableProperties["color_code"] = array(0,0); //colorcode field = 1 not color code field = 0
	$tableProperties["header_logo"] = 0; //include header left and right logo. 0 or 1
    $tableProperties["footer_signatory"] = 0; //include footer signatory. 0 or 1
    
	//Report header list
	$tableProperties["header_list"][0] = $siteTitle;
	$tableProperties["header_list"][1] = 'Role Information';
	// $tableProperties["header_list"][1] = 'Heading 2';
	
	//Report save name. Not allow any type of special character
	$tableProperties["report_save_name"] = 'Role_Information';
}
 
 

function RegularBeneficiaryExport() {

	global $sql, $tableProperties, $TEXT, $siteTitle;

	$DivisionId = $_REQUEST['DivisionId']?$_REQUEST['DivisionId']:0; 
	$DistrictId = $_REQUEST['DistrictId']?$_REQUEST['DistrictId']:0; 
	$UpazilaId =  $_REQUEST['UpazilaId']?$_REQUEST['UpazilaId']:0; 

	
	$sql = "SELECT a.*, CASE WHEN a.IsRegular = 1 THEN 'Regular' ELSE 'Irregular' END AS RegularStatus,
			gn.GenderName,
		CASE WHEN a.DisabilityStatus = 1 THEN 'Yes' ELSE 'No' END AS isDisabilityStatus,
		CASE WHEN a.PGRegistered = 1 THEN 'Yes' ELSE 'No' END AS PGRegistered,
		CASE WHEN a.PGPartnershipWithOtherCompany = 1 THEN 'Yes' ELSE 'No' END AS PGPartnershipWithOtherCompany,
		CASE WHEN a.RelationWithHeadOfHH = 1 THEN 'Himself/Herself' ELSE 'Others' END AS RelationWithHeadOfHH,
		
		gh.TypeOfMember AS TypeOfMember,
		oc.OccupationName AS FamilyOccupation,
		ghh.GenderName AS HeadOfHHSex,
		b.`DivisionName`,c.`DistrictName`, d.`UpazilaName`, 
			e.ValueChainName, f.UnionName, g.PGName, a.Ward AS WardName, i.CityCorporationName, a.VillageName,
			CASE WHEN a.IsHeadOfTheGroup = 1 THEN 'Yes' ELSE 'No' END AS HeadOfTheGroup,

			a.DepartmentId, a.ifOtherSpecify, a.DateOfRegistration
			, a.RegistrationNo, a.NameOfTheCompanyYourPgPartnerWith 
			, a.WhenDidYouStartToOperateYourFirm
			, a.NumberOfMonthsOfYourOperation
			, a.AreYouRegisteredYourFirmWithDlsRadioFlag
			, a.registrationDate
			, a.IfRegisteredYesRegistrationNo
			, a.FarmsPhoto
			
		FROM t_farmer a
		INNER JOIN t_division b ON a.`DivisionId` = b.`DivisionId`
		INNER JOIN t_district c ON a.`DistrictId` = c.`DistrictId`
		INNER JOIN t_upazila d ON a.`UpazilaId` = d.`UpazilaId`
		LEFT JOIN t_union f ON a.`UnionId` = f.`UnionId`
		LEFT JOIN t_valuechain e ON a.`ValuechainId` = e.`ValuechainId`
		LEFT JOIN t_occupation oc ON a.`OccupationId` = oc.`OccupationId`
		LEFT JOIN t_pg g ON a.`PGId` = g.`PGId`
		LEFT JOIN t_typeofmember gh ON a.`TypeOfMember` = gh.`TypeOfMemberId`
		LEFT JOIN t_citycorporation i ON a.`CityCorporation` = i.`CityCorporation`
		Inner Join t_gender gn ON a.Gender = gn.GenderId
		LEFT JOIN t_gender ghh ON a.HeadOfHHSex = ghh.GenderId
		
		WHERE (a.DivisionId = $DivisionId OR $DivisionId=0)
		AND (a.DistrictId = $DistrictId OR $DistrictId=0)
		AND (a.UpazilaId = $UpazilaId OR $UpazilaId=0)
		;";


		$db = new Db();
		$sqlrresultHeader = $db->query($sql);


		if($DivisionId == 0){
			$DivisionName = "Division: All, ";
		}else{
			$DivisionName =  "Division: ".$sqlrresultHeader[0]['DivisionName'];
		}

		if($DistrictId == 0){
			$DistrictName = ", District: All, ";
		}else{
			$DistrictName = ", District: ". $sqlrresultHeader[0]['DistrictName'];
		}
		if($UpazilaId == 0){
			$UpazilaName = ", Upazila: All";
		}else{
			$UpazilaName = ", Upazila: ". $sqlrresultHeader[0]['UpazilaName'];
		}

	
    $tableProperties["query_field"] = array('FarmerName','RegularStatus','NID','Phone','FatherName','MotherName','SpouseName','GenderName','FarmersAge','isDisabilityStatus','RelationWithHeadOfHH','ifOtherSpecify','HeadOfHHSex','PGRegistered','TypeOfMember','PGPartnershipWithOtherCompany','PGFarmerCode','FamilyOccupation','DivisionName','DistrictName','UpazilaName','UnionName','PGName','WardName','CityCorporationName','VillageName','Address','Latitute','Longitute','HeadOfTheGroup','ValueChainName','TypeOfFarmerId');
    $tableProperties["table_header"] = array("Beneficiary Name","Is Regular Beneficiary","Beneficiary NID","Mobile Number","Father's Name","Mother's Name","Spouse Name","Gender","Farmer's Age","Disability Status","Farmers Relationship with Head of HH","If others, specify","Farmer's Head of HH Sex","Do your PG/PO Registered?","Type Of Member","Do your PG make any productive partnership with any other company?","PG Farmer Code","Primary Occupation","Division","District","Upazila","Union","Name of Producer Group","Ward","City Corporation/ Municipality","Village","Address","Latitute","Longitute","Are You Head of The Group?","Value Chain","Farmer Type");
    $tableProperties["align"] = array("left","left");
    $tableProperties["width_print_pdf"] = array("30%","70%"); //when exist serial then here total 95% and 5% use for serial
    $tableProperties["width_excel"] = array("30","20","30","30","30","30","30");
    $tableProperties["precision"] = array("string","string"); //string,date,datetime,0,1,2,3,4
    $tableProperties["total"] = array(0,0); //not total=0, total=1
    $tableProperties["color_code"] = array(0,0); //colorcode field = 1 not color code field = 0
	$tableProperties["header_logo"] = 0; //include header left and right logo. 0 or 1
    $tableProperties["footer_signatory"] = 0; //include footer signatory. 0 or 1
    
	//Report header list
	$tableProperties["header_list"][0] = $siteTitle;
	$tableProperties["header_list"][1] = 'Farmer Profile List';
	$tableProperties["header_list"][2] = $DivisionName. $DistrictName. $UpazilaName;
	// $tableProperties["header_list"][1] = 'Heading 2';
	
	//Report save name. Not allow any type of special character
	$tableProperties["report_save_name"] = 'Farmer_Profile_List';
}
 
 

function MembersbyPGataExport() {

	global $sql, $tableProperties, $TEXT, $siteTitle;

	$DivisionId = $_REQUEST['DivisionId']?$_REQUEST['DivisionId']:0; 
	$DistrictId = $_REQUEST['DistrictId']?$_REQUEST['DistrictId']:0; 
	$UpazilaId =  $_REQUEST['UpazilaId']?$_REQUEST['UpazilaId']:0; 

	
	$sql = "SELECT a.PGId AS id, b.`DivisionName`,c.`DistrictName`, d.`UpazilaName`, e.ValueChainName, a.`PGName`, 
	COUNT(f.`FarmerId`) AS NoOfMembers
	FROM `t_pg` a
	INNER JOIN t_division b ON a.`DivisionId` = b.`DivisionId`
	INNER JOIN t_district c ON a.`DistrictId` = c.`DistrictId`
	INNER JOIN t_upazila d ON a.`UpazilaId` = d.`UpazilaId`
	INNER JOIN t_valuechain e ON a.`ValuechainId` = e.`ValuechainId`
	INNER JOIN `t_farmer` f ON a.`PGId` = f.PGId
	WHERE (a.DivisionId = $DivisionId OR $DivisionId=0)
	AND (a.DistrictId = $DistrictId OR $DistrictId=0)
	AND (a.UpazilaId = $UpazilaId OR $UpazilaId=0)
	GROUP BY b.`DivisionName`,c.`DistrictName`, d.`UpazilaName`, e.ValueChainName,a.`PGName`;";


		$db = new Db();
		$sqlrresultHeader = $db->query($sql);


		if($DivisionId == 0){
			$DivisionName = "Division: All, ";
		}else{
			$DivisionName =  "Division: ".$sqlrresultHeader[0]['DivisionName'];
		}

		if($DistrictId == 0){
			$DistrictName = ", District: All, ";
		}else{
			$DistrictName = ", District: ". $sqlrresultHeader[0]['DistrictName'];
		}
		if($UpazilaId == 0){
			$UpazilaName = ", Upazila: All";
		}else{
			$UpazilaName = ", Upazila: ". $sqlrresultHeader[0]['UpazilaName'];
		}

	
    $tableProperties["query_field"] = array('DivisionName','DistrictName','UpazilaName','ValueChainName','PGName','NoOfMembers');
    $tableProperties["table_header"] = array("Division","District","Upazila","Value Chain","Name of PG","No. of Members");
    $tableProperties["align"] = array("left","left");
    $tableProperties["width_print_pdf"] = array("30%","70%"); //when exist serial then here total 95% and 5% use for serial
    $tableProperties["width_excel"] = array("30","20","30","30","30","30","30");
    $tableProperties["precision"] = array("string","string"); //string,date,datetime,0,1,2,3,4
    $tableProperties["total"] = array(0,0); //not total=0, total=1
    $tableProperties["color_code"] = array(0,0); //colorcode field = 1 not color code field = 0
	$tableProperties["header_logo"] = 0; //include header left and right logo. 0 or 1
    $tableProperties["footer_signatory"] = 0; //include footer signatory. 0 or 1
    
	//Report header list
	$tableProperties["header_list"][0] = $siteTitle;
	$tableProperties["header_list"][1] = 'Members by PG	List';
	$tableProperties["header_list"][2] = $DivisionName. $DistrictName. $UpazilaName;
	// $tableProperties["header_list"][1] = 'Heading 2';
	
	//Report save name. Not allow any type of special character
	$tableProperties["report_save_name"] = 'Members_by_PG_List';
}
 
 

function UserDataExport() {

	global $sql, $tableProperties, $TEXT, $siteTitle;
	
	$sql = "SELECT a.UserId AS id, a.`DivisionId`, a.`DistrictId`, a.`UpazilaId`, a.UnionId, a.`UserName`, 
	a.Password,
	h.RoleGroupName,
	h.RoleIds,
	a.LoginName, a.`Email`, b.`DivisionName`,c.`DistrictName`, d.`UpazilaName`, u.UnionName,
	a.`IsActive`, case when a.IsActive=1 then 'Yes' else 'No' end IsActiveName, a.DesignationId, e.DesignationName
	,a.DateofJoining
		FROM `t_users` a
		LEFT JOIN (SELECT p.`UserId`,GROUP_CONCAT(q.RoleId ORDER BY q.`RoleId` ASC SEPARATOR ', ') RoleIds, GROUP_CONCAT(q.RoleName ORDER BY q.`RoleId` ASC SEPARATOR ', ') RoleGroupName
				 FROM t_user_role_map p
				 INNER JOIN `t_roles` q ON p.`RoleId` = q.`RoleId`					
				 GROUP BY p.`UserId`
			 ) h  ON a.`UserId` = h.`UserId`
		LEFT JOIN t_division b ON a.`DivisionId` = b.`DivisionId`
		LEFT JOIN t_district c ON a.`DistrictId` = c.`DistrictId`
		LEFT JOIN t_upazila d ON a.`UpazilaId` = d.`UpazilaId`
		LEFT JOIN t_union u ON a.`UnionId` = u.`UnionId`
		LEFT JOIN t_designation e ON a.`DesignationId` = e.`DesignationId`
		ORDER BY a.`UserName` ASC;";
	
    $tableProperties["query_field"] = array("UserName","LoginName","Email","DesignationName","DivisionName","DistrictName","UpazilaName","UnionName","DateofJoining","IsActiveName","RoleGroupName");
    $tableProperties["table_header"] = array('Name','Login User Name','Email','Designation','Division','District','Upazila','Union','Date of Joining','IsActive','Role');
    $tableProperties["align"] = array("left","left");
    $tableProperties["width_print_pdf"] = array("30%","70%"); //when exist serial then here total 95% and 5% use for serial
    $tableProperties["width_excel"] = array("30","40","30","15","20","20","20","20","20","7","30");
    $tableProperties["precision"] = array("string","string"); //string,date,datetime,0,1,2,3,4
    $tableProperties["total"] = array(0,0); //not total=0, total=1
    $tableProperties["color_code"] = array(0,0); //colorcode field = 1 not color code field = 0
	$tableProperties["header_logo"] = 0; //include header left and right logo. 0 or 1
    $tableProperties["footer_signatory"] = 0; //include footer signatory. 0 or 1
    
	//Report header list
	$tableProperties["header_list"][0] = $siteTitle;
	$tableProperties["header_list"][1] = 'User List';
	// $tableProperties["header_list"][1] = 'Heading 2';
	
	//Report save name. Not allow any type of special character
	$tableProperties["report_save_name"] = 'User_List';
}
 

function RoleToMenuPermissionExport() {

	global $sql, $tableProperties, $TEXT, $siteTitle;

	$RoleId = $_REQUEST['RoleId'];
	
	$sql = "SELECT a.MenuId,IF(MenuLevel='menu_level_2',CONCAT(' ----', a.MenuTitle),IF(MenuLevel='menu_level_3',CONCAT(' -----', a.MenuTitle),a.MenuTitle)) menuname,
	CASE WHEN b.MenuId IS NULL THEN 'No' ELSE 'Yes' END bChecked, RoleMenuId
	FROM `t_menu` a
	LEFT JOIN t_role_menu_map b ON b.`MenuId` = a.`MenuId` AND b.RoleId = $RoleId
	ORDER BY SortOrder;";


	$sqlr = "SELECT RoleName FROM `t_roles` a WHERE a.RoleId = $RoleId ORDER BY RoleName;";
	$db = new Db();
	$sqlrresult = $db->query($sqlr);
	$RoleName = $sqlrresult[0]['RoleName'];
	
    $tableProperties["query_field"] = array("menuname","bChecked");
    $tableProperties["table_header"] = array('Menu Name','Access');
    $tableProperties["align"] = array("left","left");
    $tableProperties["width_print_pdf"] = array("70%","30%"); //when exist serial then here total 95% and 5% use for serial
    $tableProperties["width_excel"] = array("40","20");
    $tableProperties["precision"] = array("string","string"); //string,date,datetime,0,1,2,3,4
    $tableProperties["total"] = array(0,0); //not total=0, total=1
    $tableProperties["color_code"] = array(0,0); //colorcode field = 1 not color code field = 0
	$tableProperties["header_logo"] = 0; //include header left and right logo. 0 or 1
    $tableProperties["footer_signatory"] = 0; //include footer signatory. 0 or 1
    
	//Report header list
	$tableProperties["header_list"][0] = $siteTitle;
	$tableProperties["header_list"][1] = 'Role to Menu Permission';
	$tableProperties["header_list"][2] = 'Role: '.$RoleName;
	// $tableProperties["header_list"][1] = 'Heading 2';
	
	//Report save name. Not allow any type of special character
	$tableProperties["report_save_name"] = 'Role_to_Menu_Permission';
}
 

function DataTypeQuestionsMapExport() {

	global $sql, $tableProperties, $TEXT, $siteTitle;

	$DataTypeId = $_REQUEST['DataTypeId'];
	
	$sql = "SELECT a.QMapId AS id, a.MapType, b.DataTypeName, c.QuestionName, a.LabelName, c.QuestionCode, a.SortOrder, a.DataTypeId, a.Category
	,0 QDataCount
	FROM t_datatype_questions_map a
	INNER JOIN t_datatype b ON a.DataTypeId = b.DataTypeId
	INNER JOIN t_questions c ON a.QuestionId = c.QuestionId
	WHERE a.DataTypeId = $DataTypeId
	ORDER BY a.SortOrder ASC;";


	$sqlr = "SELECT DataTypeId, DataTypeName FROM t_datatype WHERE DataTypeId = $DataTypeId ORDER BY DataTypeName;";
	$db = new Db();
	$sqlrresult = $db->query($sqlr);
	$DataTypeName = $sqlrresult[0]['DataTypeName'];
	 

    $tableProperties["query_field"] = array("QuestionCode","QuestionName","DataTypeName","LabelName");
    $tableProperties["table_header"] = array('Question Code','Question Name','Type', 'Label Name');
    $tableProperties["align"] = array("left","left");
    $tableProperties["width_print_pdf"] = array("20%","30%"); //when exist serial then here total 95% and 5% use for serial
    $tableProperties["width_excel"] = array("20","60","25","60");
    $tableProperties["precision"] = array("string","string"); //string,date,datetime,0,1,2,3,4
    $tableProperties["total"] = array(0,0); //not total=0, total=1
    $tableProperties["color_code"] = array(0,0); //colorcode field = 1 not color code field = 0
	$tableProperties["header_logo"] = 0; //include header left and right logo. 0 or 1
    $tableProperties["footer_signatory"] = 0; //include footer signatory. 0 or 1
    
	//Report header list
	$tableProperties["header_list"][0] = $siteTitle;
	$tableProperties["header_list"][1] = 'Data Type Questions Map';
	$tableProperties["header_list"][2] = 'Data Type: '.$DataTypeName;
	// $tableProperties["header_list"][1] = 'Heading 2';
	
	//Report save name. Not allow any type of special character
	$tableProperties["report_save_name"] = 'Data_Type_Questions_Map';
}
 

function QuestionDataExport() {

	global $sql, $tableProperties, $TEXT, $siteTitle;
	
	$sql = "SELECT 
	tq.`QuestionId` id,
	tq. QuestionId,
	tq.`QuestionCode`,
	tq.`QuestionName`,
	tq.`QuestionType`,
	tq.`Settings`,
	tq.`IsMandatory`,
	tq.`QuestionParentId`,
	tq.`SortOrderChild`,
	tp.`QuestionName` AS ParentQuestionName
	, case when tq.IsMandatory=1 then 'Yes' else 'No' end IsMandatoryName
	, 0 AS QMapCount
FROM `t_questions` tq
LEFT JOIN `t_questions` tp ON tq.`QuestionParentId` = tp.`QuestionId`
ORDER BY tq.`QuestionCode`, tq.`SortOrderChild` ;";
	
    $tableProperties["query_field"] = array("QuestionCode","QuestionName","QuestionType","ParentQuestionName","Settings","IsMandatoryName");
    $tableProperties["table_header"] = array('Code','Question','Question Type','Parent Question','Settings','Is Mandatory');
    $tableProperties["align"] = array("left","left");
    $tableProperties["width_print_pdf"] = array("30%","70%"); //when exist serial then here total 95% and 5% use for serial
    $tableProperties["width_excel"] = array("20","50","20","50","15","20");
    $tableProperties["precision"] = array("string","string"); //string,date,datetime,0,1,2,3,4
    $tableProperties["total"] = array(0,0); //not total=0, total=1
    $tableProperties["color_code"] = array(0,0); //colorcode field = 1 not color code field = 0
	$tableProperties["header_logo"] = 0; //include header left and right logo. 0 or 1
    $tableProperties["footer_signatory"] = 0; //include footer signatory. 0 or 1
    
	//Report header list
	$tableProperties["header_list"][0] = $siteTitle;
	$tableProperties["header_list"][1] = 'Questions';
	// $tableProperties["header_list"][1] = 'Heading 2';
	
	//Report save name. Not allow any type of special character
	$tableProperties["report_save_name"] = 'Questions';
}




function PGDataExport() {

	global $sql, $tableProperties, $TEXT, $siteTitle;

	$DivisionId = $_REQUEST['DivisionId']?$_REQUEST['DivisionId']:0; 
	$DistrictId = $_REQUEST['DistrictId']?$_REQUEST['DistrictId']:0; 
	$UpazilaId =  $_REQUEST['UpazilaId']?$_REQUEST['UpazilaId']:0; 

	$sql = "SELECT a.PGId AS id, a.`DivisionId`, a.`DistrictId`, a.`UpazilaId`, a.`PGName`, a.`Address`, 
	b.`DivisionName`,c.`DistrictName`, d.`UpazilaName`, a.UnionId, a.PgGroupCode, 
	a.PgBankAccountNumber, y.BankName, a.ValuechainId, a.IsLeadByWomen, a.GenderId, a.IsActive, e.ValueChainName, f.UnionName
	,g.GenderName, a.DateofPgInformation,
		CASE WHEN a.IsLeadByWomen = 1 THEN 'Yes' ELSE 'No' END AS IsLeadByWomenStatus,
		CASE WHEN a.IsActive = 1 THEN 'Active' ELSE 'Inactive' END AS ActiveStatus
	FROM `t_pg` a
	INNER JOIN t_division b ON a.`DivisionId` = b.`DivisionId`
	INNER JOIN t_district c ON a.`DistrictId` = c.`DistrictId`
	INNER JOIN t_upazila d ON a.`UpazilaId` = d.`UpazilaId`
	INNER JOIN t_union f ON a.`UnionId` = f.`UnionId`
	LEFT JOIN t_valuechain e ON a.`ValuechainId` = e.`ValuechainId`
	LEFT JOIN t_bank y ON a.`BankId` = y.`BankId`
	LEFT JOIN t_gender g ON a.`GenderId` = g.`GenderId`
	WHERE (a.DivisionId = $DivisionId OR $DivisionId=0)
	AND (a.DistrictId = $DistrictId OR $DistrictId=0)
	AND (a.UpazilaId = $UpazilaId OR $UpazilaId=0)
	ORDER BY b.`DivisionName`, c.`DistrictName`, d.`UpazilaName`, a.`PGName` ASC;";

$db = new Db();
$sqlrresultHeader = $db->query($sql);


if($DivisionId == 0){
	$DivisionName = "Division: All, ";
}else{
	$DivisionName =  "Division: ".$sqlrresultHeader[0]['DivisionName'];
}

if($DistrictId == 0){
	$DistrictName = ", District: All, ";
}else{
	$DistrictName = ", District: ". $sqlrresultHeader[0]['DistrictName'];
}
if($UpazilaId == 0){
	$UpazilaName = ", Upazila: All";
}else{
	$UpazilaName = ", Upazila: ". $sqlrresultHeader[0]['UpazilaName'];
}



	
    $tableProperties["query_field"] = array("PgGroupCode","PGName","PgBankAccountNumber","BankName","ValueChainName","DivisionName","DistrictName","UpazilaName","UnionName","GenderName","IsLeadByWomenStatus","ActiveStatus","Address","DateofPgInformation");
    $tableProperties["table_header"] = array('Group Code','PG Name','Bank Account Number','Bank Name','Value Chain','Division','District','Upazila','Union','Group Members Gender','Is the Group Led by Women','Status','Address','Date of Pg Information');
    $tableProperties["align"] = array("left");
    $tableProperties["width_print_pdf"] = array("6%","5%","15%","5%","5%","5%","5%","5%","5%"); //when exist serial then here total 95% and 5% use for serial
    $tableProperties["width_excel"] = array("15","30","20","15","16","12","12","12","12","12","12","12","25");
    $tableProperties["precision"] = array("string","string","string","string","string","string","string","string","string","string","string","string"); //string,date,datetime,0,1,2,3,4
    $tableProperties["total"] = array(0,0,0,0,0,0,0,0,0,0,0,0); //not total=0, total=1
    $tableProperties["color_code"] = array(0,0,0,0,0,0,0,0,0,0,0,0); //colorcode field = 1 not color code field = 0
	$tableProperties["header_logo"] = 0; //include header left and right logo. 0 or 1
    $tableProperties["footer_signatory"] = 0; //include footer signatory. 0 or 1
    
	//Report header list
	$tableProperties["header_list"][0] = $siteTitle;
	$tableProperties["header_list"][1] = 'PG List';
	$tableProperties["header_list"][2] = $DivisionName. $DistrictName. $UpazilaName;
	// $tableProperties["header_list"][1] = 'Heading 2';
	
	//Report save name. Not allow any type of special character
	$tableProperties["report_save_name"] = 'PGList';
}

 

// function UserExport() {

// 	global $sql, $tableProperties, $TEXT, $siteTitle;
	
// 	$ClientId = $_REQUEST['ClientId'];
// 	$BranchId = $_REQUEST['BranchId'];
// 	$sql = "SELECT a.`UserName`,a.LoginName,a.Email,c.RoleName,d.DesignationName,
// 	case when a.IsActive=1 then 'Yes' else 'No' end Status
// 	FROM t_users a
// 	inner join t_user_role_map b on a.UserId=b.UserId
// 	inner join t_roles c on b.RoleId=c.RoleId
// 	inner join t_designation d on a.DesignationId=d.DesignationId
// 	where a.ClientId=$ClientId 
// 	and a.BranchId=$BranchId 
// 	ORDER BY a.UserName;";
	
//     $tableProperties["query_field"] = array("UserName","LoginName","Email","RoleName","DesignationName","Status");
//     $tableProperties["table_header"] = array('User Name','Login Name','Email','Role Name','Designation','Is Active');
//     $tableProperties["align"] = array("left","left","left","left","left","left");
//     $tableProperties["width_print_pdf"] = array("30%","20%","20%","10%","10%","10%"); //when exist serial then here total 95% and 5% use for serial
//     $tableProperties["width_excel"] = array("30","20","20","20","20","15");
//     $tableProperties["precision"] = array("string","string","string","string","string","string"); //string,date,datetime,0,1,2,3,4
//     $tableProperties["total"] = array(0,0,0,0,0,0); //not total=0, total=1
//     $tableProperties["color_code"] = array(0,0,0,0,0,0); //colorcode field = 1 not color code field = 0
// 	$tableProperties["header_logo"] = 0; //include header left and right logo. 0 or 1
//     $tableProperties["footer_signatory"] = 0; //include footer signatory. 0 or 1
//     // exit;
// 	//Report header list
// 	$tableProperties["header_list"][0] = $siteTitle;
// 	$tableProperties["header_list"][1] = 'User Information';
// 	// $tableProperties["header_list"][1] = 'Heading 2';
	
// 	//Report save name. Not allow any type of special character
// 	$tableProperties["report_save_name"] = 'User_Information';
// }


// function RoleToMenuPermissionExport() {

// 	global $sql, $tableProperties, $TEXT, $siteTitle;
	
// 	$ClientId = $_REQUEST['ClientId'];
// 	$BranchId = $_REQUEST['BranchId'];
// 	$RoleId = $_REQUEST['RoleId'];
// 	$RoleName = $_REQUEST['RoleName'];


// 	$sql = "SELECT IF(MenuLevel='menu_level_2',CONCAT(' -', a.MenuTitle),
// 		IF(MenuLevel='menu_level_3',CONCAT(' --', a.MenuTitle),a.MenuTitle)) menuname,
// 	CASE WHEN b.MenuId IS NULL THEN 'No' 
// 	WHEN b.PermissionType = 1 THEN 'View'
// 	ELSE 'Edit' END PermissionType
// 			   FROM `t_menu` a
// 			   LEFT JOIN t_role_menu_map b ON b.`MenuId` = a.`MenuId` AND b.ClientId = $ClientId AND b.BranchId = $BranchId and b.RoleId = $RoleId
// 			   ORDER BY SortOrder;";
	
//     $tableProperties["query_field"] = array("menuname","PermissionType");
//     $tableProperties["table_header"] = array('Menu Name','Access');
//     $tableProperties["align"] = array("left","left");
//     $tableProperties["width_print_pdf"] = array("50%","20%"); //when exist serial then here total 95% and 5% use for serial
//     $tableProperties["width_excel"] = array("50","20");
//     $tableProperties["precision"] = array("string","string"); //string,date,datetime,0,1,2,3,4
//     $tableProperties["total"] = array(0,0); //not total=0, total=1
//     $tableProperties["color_code"] = array(0,0); //colorcode field = 1 not color code field = 0
// 	$tableProperties["header_logo"] = 0; //include header left and right logo. 0 or 1
//     $tableProperties["footer_signatory"] = 0; //include footer signatory. 0 or 1
//     // exit;
// 	//Report header list
// 	$tableProperties["header_list"][0] = $siteTitle;
// 	$tableProperties["header_list"][1] = 'Role To Menu Permission Information';
// 	$tableProperties["header_list"][2] = $RoleName;
	
// 	//Report save name. Not allow any type of special character
// 	$tableProperties["report_save_name"] = 'Role_To_Menu_Permission_Information';
// }











//==================================================================================
//=================Dynamic Export Print, Excel, Pdf, CSV============================
//==================================================================================


	$db = new Db();

	//Execute sql command
	$result = $db->query($sql);

	

	$serial = 0;
	$useSl = 1;
	$columnTotalList = array();
	$reportHeaderList = $tableProperties["header_list"];

	$reportType = $_REQUEST['reportType'];
	$reportSaveName = str_replace(' ', '_', $tableProperties["report_save_name"]);


	//Table Header Start
	if ($reportType == 'print' || $reportType == 'pdf') {

		echo '<!DOCTYPE html>
		<html>
			 <head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />	
				<meta http-equiv="content-type" content="text/html; charset=utf-8" />
				<link href="css/bootstrap.min.css" rel="stylesheet"/>
				<link href="css/font-awesome.min.css" rel="stylesheet"/>
				<link href="css/custom.css" rel="stylesheet"/>
				<link href="css/base.css" rel="stylesheet"/>
				<link href="css/exportstyle.css" rel="stylesheet"/>
			<style>
				body {
					color:#727272;
				}
				table.display tr.even.row_selected td {
    				background-color: #4DD4FD;
			    }    
			    table.display tr.odd.row_selected td {
			    	background-color: #4DD4FD;
			    }
			    .SL{
			        text-align: center !important;
			    }
				.right-aln{
					text-align: right !important;
				}
				.left-aln{
					text-align: left !important;
				}
				.center-aln {
					text-align: center !important;
				}
			    td.Countries{cursor: pointer;}
			    th, td {
					border: 1px solid #e4e4e4 !important;
				}
				.margin-bottom {
					margin-bottom: 40px;
				}


				.BottomDiv{
					width:30%;
					text-align:center;
					display: block;
				}
				.content_area {
						text-align: center;
						font-size: 14px;
						font-weight: bold;
					}
	
					.margin_top{
						margin-top: 10px;
					}
					.margin_button{
						margin-bottom:120px;
					}
					.footer_Padding{
						border: 1px solid #ccc;
						min-height: 130px;
						padding-top: 10px;
					}
					.marginTop0{
						margin-top: 0px;
					}
			</style>
			</head>
			<body><div class="container-fluid margin-bottom">
			<div class="row"> 
			<div class="col-md-12">
          	<div class="table-responsive">
           	<div class="panel-heading" style="text-align:center;">';
			
			$reportHeaderListCount = count($reportHeaderList);
			
			//Report Header
			 for($i=0; $i<$reportHeaderListCount; $i++){
				if($i==0){
					if($tableProperties["header_logo"] == 1){
						echo '<div class="row margin_top">

						<div class="col-md-4 col-sm-4 col-lg-4">
							<div class="content-body" style="text-align:left;">
							<img src="images/logo.png" alt="National health family logo" style="width: 90px;height: auto;">
							</div>
						</div>

						<div class="col-md-4 col-sm-4 col-lg-4">
							<div class="content-body_text">
								<div class="content_area">
								
									<h4>'.$reportHeaderList[$i].'</h4>
									
								</div>
							</div>
						</div>

						<div class="col-md-4 col-sm-4 col-lg-4">
							<div class="content-body">
							<img src="images/benin_logo.png" alt="National health family logo" style="float: right;width: 65px;height: auto;">
							</div>
						</div>
					</div>';
					}else{
						echo '<div class="row margin_top">

						<div class="col-md-12 col-sm-12 col-lg-12">
							<div class="content-body_text">
								<div class="content_area">
								
									<h4>'.$reportHeaderList[$i].'</h4>
									
								</div>
							</div>
						</div>

					</div>';
					}
				}


					//echo '<h2>'.$reportHeaderList[$i].'</h2>';
				else if($i==1)
					echo '<h5 class="marginTop0">'.$reportHeaderList[$i].'</h5>';
				else
					echo '<h5>'.$reportHeaderList[$i].'</h5>';
			}
			
			echo '</div>';
			
			
		$fontsize = "";
		if ($reportType == 'pdf') {
			$fontsize = "font-size:10px;";
		}
		echo '<table class="table table-striped table-bordered display" cellspacing="0" cellpadding="5" width="100%" border="0.5" style="margin:0 auto; ' . $fontsize . '">    	
				<tbody><tr>';

		if ($useSl > 0) {
			echo '<th style="width:5%; text-align:center;"><strong>SL.</strong></th>';
		}

		foreach ($tableProperties["table_header"] as $index => $header) {
			echo '<th style="width:' . $tableProperties["width_print_pdf"][$index] . '; text-align:' . $tableProperties["align"][$index] . ';"><strong>' . $header . '</strong></th>';
		}
		echo '</tr>';


		
		
	} else if ($reportType == 'excel') {

		//include xlsxwriter
		set_include_path( get_include_path().PATH_SEPARATOR);
		include_once("xlsxwriter/xlsxwriter.class.php");
		
		///////////for logo left and right header 29/03/2023
		require_once("xlsxwriter/xlsxwriterplus.class.php");
		///////////for logo left and right header 29/03/2023
		
		
		$sheetName = "Data";
		$rowStyle = array('border' => 'left,right,top,bottom', 'border-style' => 'thin');

		///////////for logo left and right header 29/03/2023. off first line and add 2nd line
		// $writer = new XLSXWriter();
		$writer = new XLSWriterPlus();
		///////////for logo left and right header 29/03/2023

		$tableHeaderList = array();

		if ($useSl > 0) {
			$tableHeaderList["SL."] = '0';
			array_unshift($tableProperties["width_excel"], 8);
		}

		foreach ($tableProperties["table_header"] as $index => $header) {
			
			$header = remove_html_tag($header);
			
			if (is_numeric($tableProperties["precision"][$index])) {
				// $tableHeaderList[$fieldLabelList[getActualFieldName($val)]] = '0.0';
				$precision = $tableProperties["precision"][$index];
				$format = "#,##0";
				if ($precision > 0) {
					$decimalPoint = ".";
					$decimalPoint = str_pad($decimalPoint, ($precision + 1), "0", STR_PAD_RIGHT);
					$format = "#,##0" . $decimalPoint;
				}
				// $tableHeaderList[$fieldLabelList[getActualFieldName($val)]] = '#,##0.0';
				$tableHeaderList[$header] = $format;
			} else {
				$tableHeaderList[$header] = '@';
			}
		}

		//For multiline report title 13/11/2022
		$reporttitle = $reportHeaderList[0];
		$reporttitlelist = explode('<br/>',$reporttitle);
		if(count($reporttitlelist) > 1){
			$reportHeaderList[0] = $reporttitlelist[count($reporttitlelist)-1];
			for($h=(count($reporttitlelist)-2); $h>=0; $h-- ){
				array_unshift($reportHeaderList, $reporttitlelist[$h]);
			}
		}
		//For multiline report title 13/11/2022
	

		////////last column width max 8 because of logo width 29/03/2023
		if($tableProperties["header_logo"] == 1){
			$lastcolw = $tableProperties["width_excel"][count($tableProperties["width_excel"])-1];
			if($lastcolw>8){
				$tableProperties["width_excel"][count($tableProperties["width_excel"])-1] = 10;
			}
		}
		////////last column width max 8 because of logo width 29/03/2023


		$writer->writeSheetHeader(
				$sheetName, $tableHeaderList, array(
			// 'widths'=>array(5,20,20,20,20,20,15,15,15,15,15,10,10),
			'widths' => $tableProperties["width_excel"],
			'font-style' => 'bold',
			'font-size' => 11,
			'fill' => '#b4c6e7',
			'border' => 'left,right,top,bottom',
			'border-style' => 'thin',
			'halign' => 'left',
			'fitToWidth' => '1',
			// 'report_headers'=>array('Health Comodity Mangement','Stock status data', 'Year: 2018, Month: January')
			'report_headers' => $reportHeaderList
				)
		);
		//Report Header and table header end
	} else if ($reportType == 'csv') {

		$writer = WriterFactory::create(Type::CSV);
		$writer->openToFile("media/$reportSaveName.csv");
	
		//Report Header start
		foreach ($reportHeaderList as $val) {
			$writer->addRow([$val]);
		}
		//Report Header end
		//Table Header start
		$tableHeaderList = array();
		if ($useSl > 0) {
			$tableHeaderList[] = "SL.";
		}

		foreach ($tableProperties["table_header"] as $index => $header) {
			$tableHeaderList[] = $header;
		}
		$writer->addRow($tableHeaderList); //$writer->addRow(['A','B']);
		//Table Header end
	}
	//Table Header End
	//Data list start
	foreach ($result as $row) {
		if ($reportType == 'print' || $reportType == 'pdf') {
			echo '<tr>';

			if ($useSl > 0) {
				echo '<td style="width:5%; text-align:center;">' . ++$serial . '</td>';
			}

			foreach ($tableProperties["query_field"] as $index => $fieldName) {

				if ($tableProperties["color_code"][$index] == 1) {
					echo '<td style="width:' . $tableProperties["width_print_pdf"][$index] . '; background-color:' . $row[$fieldName] . ';"></td>';
				} else {
					echo '<td style="width:' . $tableProperties["width_print_pdf"][$index] . '; text-align:' . $tableProperties["align"][$index] . ';">' . getValueFormat($row[$fieldName], $tableProperties["precision"][$index], $reportType) . '</td>';
				}

				if ($tableProperties["total"][$index] == 1) {
					if (array_key_exists($index, $columnTotalList)) {
						$columnTotalList[$index] += $row[$fieldName];
					} else {
						$columnTotalList[$index] = $row[$fieldName];
					}
				} else {
					$columnTotalList[$index] = "";
				}
			}
			echo '</tr>';
			
		} else if ($reportType == 'excel') {

			$isColorCode = false;
			if (in_array(1, $tableProperties["color_code"])) {
				$isColorCode = true;
			}

			$rowStyleModify = array();
			$rowStyleModify = $rowStyle;

			$rowdata = array();
			if ($useSl > 0) {
				$rowdata[] = ++$serial;

				if ($isColorCode) {
					$rowStyleModify[] = ['fill' => ''];
				}
			}

			foreach ($tableProperties["query_field"] as $index => $fieldName) {

				if ($tableProperties["color_code"][$index] == 1) {
					$rowStyleModify[] = ['fill' => $row[$fieldName]];
					$rowdata[] = "";
				} else {
					if ($isColorCode) {
						$rowStyleModify[] = ['fill' => ''];
					}
					$rowdata[] = getValueFormat(remove_html_tag($row[$fieldName]), $tableProperties["precision"][$index], $reportType);
				}


				if ($tableProperties["total"][$index] == 1) {
					if (array_key_exists($index, $columnTotalList)) {
						$columnTotalList[$index] += $row[$fieldName];
					} else {
						$columnTotalList[$index] = $row[$fieldName];
					}
				} else {
					$columnTotalList[$index] = "";
				}
			}

			$writer->writeSheetRow($sheetName, $rowdata, $rowStyleModify);
		} else if ($reportType == 'csv') {
			$rowdata = array();
			if ($useSl > 0) {
				$rowdata[] = ++$serial;
			}

			foreach ($tableProperties["query_field"] as $index => $fieldName) {
				$rowdata[] = getValueFormat($row[$fieldName], $tableProperties["precision"][$index], $reportType);

				if ($tableProperties["total"][$index] == 1) {
					if (array_key_exists($index, $columnTotalList)) {
						$columnTotalList[$index] += $row[$fieldName];
					} else {
						$columnTotalList[$index] = $row[$fieldName];
					}
				} else {
					$columnTotalList[$index] = "";
				}
			}
			$writer->addRow($rowdata);
		}
	}
	//Data list end

	if ($reportType == 'print' || $reportType == 'pdf') {

		if (in_array(1, $tableProperties["total"])) {
			echo '<tr>';

			if ($useSl > 0) {
				echo '<td></td>';
			}

			foreach ($columnTotalList as $index => $totalValue) {
				echo '<td style="width:' . $tableProperties["width_print_pdf"][$index] . '; text-align:' . $tableProperties["align"][$index] . ';">' . getValueFormat($totalValue, $tableProperties["precision"][$index], $reportType) . '</td>';
			}
			echo '</tr>';
		}

		echo'</tbody></table>';

			if($tableProperties["footer_signatory"] == 1){
				echo	'<div class="row margin_top">
						<div class="col-md-12 col-lg-12">
							<div class="footer_Padding">
						
								<div class="col-md-6 col-lg-6">
									<div class="footer_section">
										<p> '.$TEXT["Nom et signature du gestionnaire"].' </p>
									</div>
								</div>	
								<div class="col-md-6 col-lg-6">
									<div class="footer_section text-right">
										<p> '.$TEXT["Nom et signature du responsable du site de PEC"].' </p>
									</div>
								</div> 
							</div>
						</div>
					</div>';
				
				}


		echo '	</div>
				</div>   
				</div>  
			 </div>
		 </body></html>';	
		 
	} else if ($reportType == 'excel') {

		if (in_array(1, $tableProperties["total"])) {
			$rowTotalStyle = array('font-style' => 'bold', 'border' => 'left,right,top,bottom', 'border-style' => 'thin');
			$rowdata = array();

			if ($useSl > 0) {
				$rowdata[] = "";
			}

			foreach ($columnTotalList as $index => $totalValue) {
				$rowdata[] = getValueFormat($totalValue, $tableProperties["precision"][$index], $reportType);
			}
			$writer->writeSheetRow($sheetName, $rowdata, $rowTotalStyle);
		}

		/* Report header merge */
		$end_col = count($tableProperties["query_field"]) - 1; //column count - 1
		if ($useSl > 0) {
			$end_col++;
		}

		foreach ($reportHeaderList as $start_row => $val) {
			$writer->markMergedCell($sheetName, $start_row, $start_col = 0, $end_row = $start_row, $end_col);
			// $writer->markMergedCell($sheetName, $start_row=0, $start_col=0, $end_row=0, $end_col=12);
			// $writer->markMergedCell($sheetName, $start_row=1, $start_col=0, $end_row=1, $end_col=12);
		}



///////////for logo left and right header 29/03/2023
		if($tableProperties["header_logo"] == 1){
			$writer->addImage($sheetName,realpath('./images/logo.png'),'logo.png', 1, [
				'startColNum' => 0,
				'endColNum' => 1,
				'startRowNum' => 0,
				'endRowNum' => 3,
			]);
			// $columnTotalCount = count($columnTotalList);
			$columnTotalCount = count($tableProperties["query_field"]);
	
			$writer->addImage($sheetName,realpath('./images/benin_logo.png'),'benin_logo.png', 2, [
				'startColNum' => $columnTotalCount,
				'endColNum' => ($columnTotalCount + 1),
				'startRowNum' => 0,
				'endRowNum' => 3,
			]);
		}
///////////for logo left and right header 29/03/2023



/////////////////for footer signator//////////////////////// 29/03/2023/////////////////
		if($tableProperties["footer_signatory"] == 1){
			// $writer->writeSheetRow($sheetName, [], []);/// for a blank row

			// $rowdata = array();
			// $rowdata[] = 'Nom et signature du gestionnaire';
			// // $rowdata[3] = 'Nom et signature du responsable du site de PEC';

			// $rowTypeOverwrite = array();
			$middleColIdx = (int)(count($tableProperties["table_header"])/2);
			// for($f=0; $f<count($tableProperties["table_header"]); $f++){
			// 	$rowTypeOverwrite[] = 'string';

			// 	if($f == $middleColIdx){
			// 		$rowdata[] = 'Nom et signature du responsable du site de PEC';
			// 	}
			// 	else{
			// 		$rowdata[] = '';
			// 	}

			// }
			// $writer->setSheetColumnTypes($sheetName,['string','string','string','string','string']);
			// $writer->setSheetColumnTypes($sheetName,$rowTypeOverwrite);

			// $rowTotalStyle = array('font-style' => 'normal', 'border' => 'left,right,top,bottom', 'border-style' => 'thin','height'=>'80','valign'=>'top');
			// $writer->writeSheetRow($sheetName, $rowdata, $rowTotalStyle);

			// echo 'Rubel:';
			$footerrowposition = 0;
			if (in_array(1, $tableProperties["total"])) {
				//when total available
				$footerrowposition = count($reportHeaderList) + ($tableHearC=1) + count($result)+ ($tableTotalC=1) + ($gaprowC=1) ;
			}else{
				//when total not available
				$footerrowposition = count($reportHeaderList) + ($tableHearC=1)+ count($result) + ($gaprowC=1) ;
			}


			// $rowTotalStyle = array('font-style' => 'normal', 'border' => 'left,right,top,bottom', 'border-style' => 'thin','height'=>'80','valign'=>'top','halign'=>'left');
			$rowTotalStyle = array('height'=>'80','valign'=>'top','halign'=>'left');
			$writer->writeCellextra($sheetName,$footerrowposition, 0, $TEXT["Nom et signature du gestionnaire"], $rowTotalStyle);

			$rowTotalStyle = array('height'=>'80','valign'=>'top','halign'=>'right');
			$writer->writeCellextra($sheetName,$footerrowposition, ($middleColIdx+1), $TEXT["Nom et signature du responsable du site de PEC"],$rowTotalStyle);

			$writer->markMergedCell($sheetName, $footerrowposition, $start_col = 0, $end_row = $footerrowposition, ($middleColIdx));
			$writer->markMergedCell($sheetName, $footerrowposition, $start_col = ($middleColIdx+1), $end_row = $footerrowposition, count($tableProperties["table_header"]));


			///////// $writer->writeCellextra($sheetName,75, 0, 'Rubel');
			///////// $writer->writeCellextra($sheetName,75, 5, 'Softworks');
		}



/////////////////for footer signator//////////////////////// 29/03/2023/////////////////



		$exportTime = date("Y_m_d_H_i_s", time());
		$exportFilePath = $reportSaveName .'_'.$exportTime. ".xlsx";
		$writer->writeToFile("media/$exportFilePath");
		header('Location:media/' . $exportFilePath); //File open location	
	
	} else if ($reportType == 'csv') {

		if (in_array(1, $tableProperties["total"])) {
			$rowdata = array();

			if ($useSl > 0) {
				$rowdata[] = "";
			}

			foreach ($columnTotalList as $index => $totalValue) {
				$rowdata[] = getValueFormat($totalValue, $tableProperties["precision"][$index], $reportType);
			}
			$writer->addRow($rowdata);
		}

		$writer->close();
		// header('Location:../media/' . $reportSaveName . ".csv"); //File open location
		
		$exportTime = date("Y_m_d_H_i_s", time());
		$exportFilePath = $reportSaveName .'_'.$exportTime. ".xlsx";
		$writer->writeToFile("media/$exportFilePath");
		header('Location:media/' . $exportFilePath); //File open location			
	}
	

function getValueFormat($value, $precision, $reportType) {
    $retVal = "";

    if ($precision === 'date') {
        if (validateDate($value, 'Y-m-d')) {
            $retVal = date('d-m-Y', strtotime($value));
        } else {
            $retVal = $value;
        }
    } else if ($precision === 'datetime') {
        if (validateDate($value, 'Y-m-d H:i:s')) {
            $retVal = date('d-m-Y', strtotime($value));
        } else {
            $retVal = $value;
        }
    } else if ($precision === 'string') {
        $retVal = $value;
    } else if (is_numeric($precision)) {
        // $retVal = getNumberFormat($value, $precision);
        $retVal = number_format($value, $precision);
        //when Excel then no need to COMA it is will auto format
        if ($reportType === 'excel') {
            $retVal = str_replace(",", "", $retVal);
        }
    } else {
        $retVal = $value;
    }

    return $retVal;
}

function validateDate($date, $format = 'Y-m-d H:i:s') {
    $d = DateTime::createFromFormat($format, $date);
    return $d && $d->format($format) == $date;
}

function remove_html_tag($text){
	$text = str_replace( '<', ' < ',$text );
	return trim(strip_tags($text));
}

?>