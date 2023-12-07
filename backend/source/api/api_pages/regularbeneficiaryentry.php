<?php

$task = '';
if(isset($data->action)) {
	$task = trim($data->action);
}

switch($task){
	
	case "getDataList":
		$returnData = getDataList($data);
	break;

	case "dataAddEdit":
		$returnData = dataAddEdit($data);
	break;
	
	case "deleteData":
		$returnData = deleteData($data);
	break;

	default :
		echo "{failure:true}";
		break;
}

function getDataList($data){

	try{
		$dbh = new Db();

		$DivisionId = trim($data->DivisionId)?trim($data->DivisionId):0; 
		$DistrictId = trim($data->DistrictId)?trim($data->DistrictId):0; 
		$UpazilaId = trim($data->UpazilaId)?trim($data->UpazilaId):0; 

		/* $query = "SELECT 
			a.`FarmerId` id,
			a.`DivisionId`,
			a.`DistrictId`,
			a.`UpazilaId`,
			a.`PGId`,
			a.`FarmerName`,
			a.`NID`,
			a.`Phone`,
			a.`FatherName`,
			a.`ValueChain`,
			a.`MotherName`,
			a.`LiveStockNo`,
			a.`LiveStockOther`,
			a.`Address`,
			a.`IsRegular`,
			a.`NidFrontPhoto`,
			a.`NidBackPhoto`,
			a.`BeneficiaryPhoto`,
			a.`SpouseName`,
			a.`Gender` AS GenderId,
			a.`FarmersAge`,
			a.`DisabilityStatus`,
			a.`RelationWithHeadOfHH`,
			a.`HeadOfHHSex`,
			a.`PGRegistered`,
			a.`PGPartnershipWithOtherCompany`,
			a.`TypeOfMember`,
			a.`PGFarmerCode`,
			case when a.IsRegular=1 then 'Regular' else 'No' end IsRegularBeneficiary
		FROM
			t_farmer a ;"; */
		
	$query = "SELECT 
			a.`FarmerId`,
			a.`FarmerId` id,
			a.`DivisionId`,
			a.`DistrictId`,
			a.`UpazilaId`,
			a.`UnionId`,
			a.`CityCorporation`,
			a.`Ward`,
			a.`PGId`,
			a.`FarmerName`,
			a.`NID`,
			a.`Phone`,
			a.`FatherName`,
			a.`ValueChain`,
			a.`MotherName`,
			a.`LiveStockNo`,
			a.`LiveStockOther`,
			a.`Address`,
			a.`IsRegular`,
			a.`NidFrontPhoto`,
			a.`NidBackPhoto`,
			a.`BeneficiaryPhoto`,
			a.`SpouseName`,
			a.`Gender`,
			a.`FarmersAge`,
			a.`DisabilityStatus`,
			a.`RelationWithHeadOfHH`,
			a.`HeadOfHHSex`,
			a.`PGRegistered`,
			a.`PGPartnershipWithOtherCompany`,
			a.`TypeOfMember`,
			a.`PGFarmerCode`,
			a.`OccupationId`,
			a.`VillageName`,
			a.`Latitute`,
			a.`Longitute`,
			a.`IsHeadOfTheGroup`,
			a.`ValuechainId`,
			a.`TypeOfFarmerId`,
			a.dob,
			case when a.IsRegular=1 then 'Regular' else 'No' end IsRegularBeneficiary,
			b.GenderName, c.ValueChainName, d.PGName, a.DepartmentId, a.ifOtherSpecify, a.DateOfRegistration
			, a.RegistrationNo, a.NameOfTheCompanyYourPgPartnerWith 
			, a.WhenDidYouStartToOperateYourFirm
			, a.NumberOfMonthsOfYourOperation
			, a.AreYouRegisteredYourFirmWithDlsRadioFlag
			, a.registrationDate
			, a.IfRegisteredYesRegistrationNo
			, a.FarmsPhoto
		  FROM
		  `t_farmer` a 
		  Inner Join t_gender b ON a.Gender = b.GenderId
		  LEFT JOIN t_valuechain c ON a.ValuechainId = c.ValuechainId
		  LEFT JOIN t_pg d ON a.PGId = d.PGId
		  WHERE (a.DivisionId = $DivisionId OR $DivisionId=0)
			AND (a.DistrictId = $DistrictId OR $DistrictId=0)
			AND (a.UpazilaId = $UpazilaId OR $UpazilaId=0)
		  ;";
		  

		
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



function dataAddEdit($data) {

	if($_SERVER["REQUEST_METHOD"] != "POST"){
		return $returnData = msg(0,404,'Page Not Found!');
	}else{
		


	



		$lan = trim($data->lan); 
		$UserId = trim($data->UserId); 

		$FarmerId = $data->rowData->id;

		$NidFrontPhoto = $data->rowData->NidFrontPhoto;
		
		//$NidBackPhoto = isset($data->rowData->NidBackPhoto) && ($data->rowData->NidBackPhoto !== "") ? $data->rowData->NidBackPhoto : NULL;

		$DivisionId = $data->rowData->DivisionId? $data->rowData->DivisionId : null;
		$DistrictId = $data->rowData->DistrictId? $data->rowData->DistrictId : null;
		$UpazilaId = $data->rowData->UpazilaId? $data->rowData->UpazilaId : null;

		$PGId = $data->rowData->PGId? $data->rowData->PGId : null;

		$FarmerName =  $data->rowData->FarmerName ? $data->rowData->FarmerName : null;
		$NID =  $data->rowData->NID ? $data->rowData->NID : null;
		$Phone = $data->rowData->Phone ? $data->rowData->Phone : null;
		$FatherName =  $data->rowData->FatherName ? $data->rowData->FatherName : null;
		$ValueChain = $data->rowData->ValueChain ? $data->rowData->ValueChain : null;
		$MotherName =  $data->rowData->MotherName ? $data->rowData->MotherName : null;
		$LiveStockNo = $data->rowData->LiveStockNo ? $data->rowData->LiveStockNo : null;
		$LiveStockOther = $data->rowData->LiveStockOther ? $data->rowData->LiveStockOther : null;
		$Address = $data->rowData->Address ? $data->rowData->Address : null;
		$IsRegular = isset($data->rowData->IsRegular) && ($data->rowData->IsRegular !== "") ? $data->rowData->IsRegular : null;
		$NidBackPhoto = $data->rowData->NidBackPhoto ? $data->rowData->NidBackPhoto : null;
		$BeneficiaryPhoto = $data->rowData->BeneficiaryPhoto ? $data->rowData->BeneficiaryPhoto : null;
		$SpouseName =  $data->rowData->SpouseName ? $data->rowData->SpouseName : null;
		$Gender = $data->rowData->Gender ? $data->rowData->Gender : null;
		$FarmersAge = $data->rowData->FarmersAge ? $data->rowData->FarmersAge : null;
		$DisabilityStatus = $data->rowData->DisabilityStatus ? $data->rowData->DisabilityStatus : null;
		$RelationWithHeadOfHH = $data->rowData->RelationWithHeadOfHH ? $data->rowData->RelationWithHeadOfHH : 1;
		$HeadOfHHSex = $data->rowData->HeadOfHHSex ? $data->rowData->HeadOfHHSex : null;
		$PGRegistered = $data->rowData->PGRegistered ? $data->rowData->PGRegistered : 0;
		$PGPartnershipWithOtherCompany =  $data->rowData->PGPartnershipWithOtherCompany ? $data->rowData->PGPartnershipWithOtherCompany : 0;
		$TypeOfMember = $data->rowData->TypeOfMember? $data->rowData->TypeOfMember : null;
		$PGFarmerCode = $data->rowData->PGFarmerCode? $data->rowData->PGFarmerCode : null;
		$OccupationId =  $data->rowData->OccupationId? $data->rowData->OccupationId : null;
		$UnionId = $data->rowData->UnionId? $data->rowData->UnionId : null;
		$CityCorporation = $data->rowData->CityCorporation? $data->rowData->CityCorporation : null;
		$Ward = $data->rowData->Ward? $data->rowData->Ward : null;
		$VillageName = $data->rowData->VillageName ? $data->rowData->VillageName : null;
		$Latitute =  $data->rowData->Latitute ? $data->rowData->Latitute : null;
		$Longitute =  $data->rowData->Longitute ? $data->rowData->Longitute : null;
		$IsHeadOfTheGroup = $data->rowData->IsHeadOfTheGroup ? $data->rowData->IsHeadOfTheGroup : 0;
		$ValuechainId = $data->rowData->ValuechainId ? $data->rowData->ValuechainId : null;

		$multiselectPGroup = isset($data->rowData->multiselectPGroup) ? $data->rowData->multiselectPGroup : '';
		$TypeOfFarmerIdc = implode(",", $multiselectPGroup);
		$TypeOfFarmerId = $TypeOfFarmerIdc? $TypeOfFarmerIdc : null;
	
		$dob = $data->rowData->dob ? $data->rowData->dob : null;
		$DepartmentId = $data->rowData->DepartmentId ? $data->rowData->DepartmentId : null;
		$ifOtherSpecify = $data->rowData->ifOtherSpecify ? $data->rowData->ifOtherSpecify : null;
		$DateOfRegistration = $data->rowData->DateOfRegistration ? $data->rowData->DateOfRegistration : null;
		$RegistrationNo = $data->rowData->RegistrationNo ? $data->rowData->RegistrationNo : null;
		$NameOfTheCompanyYourPgPartnerWith = $data->rowData->NameOfTheCompanyYourPgPartnerWith ? $data->rowData->NameOfTheCompanyYourPgPartnerWith : null;
		$WhenDidYouStartToOperateYourFirm = $data->rowData->WhenDidYouStartToOperateYourFirm ? $data->rowData->WhenDidYouStartToOperateYourFirm : null;
		$NumberOfMonthsOfYourOperation = $data->rowData->NumberOfMonthsOfYourOperation ? $data->rowData->NumberOfMonthsOfYourOperation : null;
		$AreYouRegisteredYourFirmWithDlsRadioFlag = $data->rowData->AreYouRegisteredYourFirmWithDlsRadioFlag ? $data->rowData->AreYouRegisteredYourFirmWithDlsRadioFlag : 0;
		$registrationDate = $data->rowData->registrationDate ? $data->rowData->registrationDate : null;
		$IfRegisteredYesRegistrationNo = $data->rowData->IfRegisteredYesRegistrationNo ? $data->rowData->IfRegisteredYesRegistrationNo : null;
		$FarmsPhoto = $data->rowData->FarmsPhoto ? $data->rowData->FarmsPhoto : null;


		try{
			
			$dbh = new Db();
			$aQuerys = array();

			if($FarmerId == ""){
				
				$q = new insertq();
				$q->table = 't_farmer';
				$q->columns = ['FarmerName','NID','NidFrontPhoto','NidBackPhoto','IsRegular', 'DivisionId', 'DistrictId', 'UpazilaId', 'UnionId', 'CityCorporation', 'Ward', 'PGId', 'Phone', 'FatherName', 'ValueChain', 'MotherName', 'LiveStockNo', 'LiveStockOther', 'Address', 'BeneficiaryPhoto', 'SpouseName', 'Gender', 'FarmersAge', 'DisabilityStatus', 'RelationWithHeadOfHH', 'HeadOfHHSex', 'PGRegistered', 'PGPartnershipWithOtherCompany', 'TypeOfMember', 'PGFarmerCode','OccupationId','VillageName','Latitute','Longitute','IsHeadOfTheGroup','ValuechainId', 'TypeOfFarmerId', 'dob','DepartmentId','ifOtherSpecify','DateOfRegistration','RegistrationNo','NameOfTheCompanyYourPgPartnerWith','WhenDidYouStartToOperateYourFirm','NumberOfMonthsOfYourOperation','AreYouRegisteredYourFirmWithDlsRadioFlag','registrationDate','IfRegisteredYesRegistrationNo','FarmsPhoto'];
				$q->values = [$FarmerName,$NID,$NidFrontPhoto,$NidBackPhoto,$IsRegular, $DivisionId, $DistrictId, $UpazilaId, $UnionId, $CityCorporation, $Ward, $PGId, $Phone, $FatherName, $ValueChain, $MotherName, $LiveStockNo, $LiveStockOther, $Address, $BeneficiaryPhoto, $SpouseName, $Gender, $FarmersAge, $DisabilityStatus, $RelationWithHeadOfHH, $HeadOfHHSex, $PGRegistered, $PGPartnershipWithOtherCompany, $TypeOfMember, $PGFarmerCode, $OccupationId, $VillageName,$Latitute, $Longitute,  $IsHeadOfTheGroup, $ValuechainId, $TypeOfFarmerId, $dob, $DepartmentId, $ifOtherSpecify, $DateOfRegistration, $RegistrationNo, $NameOfTheCompanyYourPgPartnerWith, $WhenDidYouStartToOperateYourFirm, $NumberOfMonthsOfYourOperation, $AreYouRegisteredYourFirmWithDlsRadioFlag, $registrationDate, $IfRegisteredYesRegistrationNo, $FarmsPhoto];
				$q->pks = ['FarmerId'];
				$q->bUseInsetId = false;
				$q->build_query();
				$aQuerys = array($q); 

	
			}else{
				
				$u = new updateq();
				$u->table = 't_farmer';
				$u->columns = ['FarmerName','NID','NidFrontPhoto','NidBackPhoto','IsRegular', 'DivisionId', 'DistrictId', 'UpazilaId', 'UnionId', 'CityCorporation', 'Ward', 'PGId', 'Phone', 'FatherName', 'ValueChain', 'MotherName', 'LiveStockNo', 'LiveStockOther', 'Address', 'BeneficiaryPhoto', 'SpouseName', 'Gender', 'FarmersAge', 'DisabilityStatus', 'RelationWithHeadOfHH', 'HeadOfHHSex', 'PGRegistered', 'PGPartnershipWithOtherCompany', 'TypeOfMember', 'PGFarmerCode','OccupationId','VillageName','Latitute','Longitute','IsHeadOfTheGroup','ValuechainId', 'TypeOfFarmerId', 'dob','DepartmentId','ifOtherSpecify','DateOfRegistration','RegistrationNo','NameOfTheCompanyYourPgPartnerWith','WhenDidYouStartToOperateYourFirm','NumberOfMonthsOfYourOperation','AreYouRegisteredYourFirmWithDlsRadioFlag','registrationDate','IfRegisteredYesRegistrationNo','FarmsPhoto'];
				$u->values = [$FarmerName,$NID,$NidFrontPhoto,$NidBackPhoto,$IsRegular, $DivisionId, $DistrictId, $UpazilaId, $UnionId, $CityCorporation, $Ward, $PGId, $Phone, $FatherName, $ValueChain, $MotherName, $LiveStockNo, $LiveStockOther, $Address, $BeneficiaryPhoto, $SpouseName, $Gender, $FarmersAge, $DisabilityStatus, $RelationWithHeadOfHH, $HeadOfHHSex, $PGRegistered, $PGPartnershipWithOtherCompany, $TypeOfMember, $PGFarmerCode, $OccupationId, $VillageName,$Latitute, $Longitute, $IsHeadOfTheGroup, $ValuechainId, $TypeOfFarmerId, $dob, $DepartmentId, $ifOtherSpecify, $DateOfRegistration, $RegistrationNo, $NameOfTheCompanyYourPgPartnerWith, $WhenDidYouStartToOperateYourFirm, $NumberOfMonthsOfYourOperation, $AreYouRegisteredYourFirmWithDlsRadioFlag, $registrationDate, $IfRegisteredYesRegistrationNo, $FarmsPhoto];
				$u->pks = ['FarmerId'];
				$u->pk_values = [$FarmerId];
				$u->build_query();
				$aQuerys = array($u);
			}

			$res = exec_query($aQuerys, $UserId, $lan);  
			$success=($res['msgType']=='success')?1:0;
			$status=($res['msgType']=='success')?200:500;

			$returnData = [
			    "success" => $success ,
				"status" => $status,
				"UserId"=> $UserId,
				"message" => $res['msg']
			];

		}catch(PDOException $e){
			$returnData = msg(0,500,$e->getMessage());
		}
		
		return $returnData;
	}
}


function deleteData($data) {
 
	if($_SERVER["REQUEST_METHOD"] != "POST"){
		return $returnData = msg(0,404,'Page Not Found!');
	}
	// CHECKING EMPTY FIELDS
	elseif(!isset($data->rowData->id)){
		$fields = ['fields' => ['id']];
		return $returnData = msg(0,422,'Please Fill in all Required Fields!',$fields);
	}else{
		
		$FarmerId = $data->rowData->id;
		$lan = trim($data->lan); 
		$UserId = trim($data->UserId); 

		try{

			$dbh = new Db();
			
            $d = new deleteq();
            $d->table = 't_farmer';
            $d->pks = ['FarmerId'];
            $d->pk_values = [$FarmerId];
            $d->build_query();
            $aQuerys = array($d);

			$res = exec_query($aQuerys, $UserId, $lan);  
			$success=($res['msgType']=='success')?1:0;
			$status=($res['msgType']=='success')?200:500;

			$returnData = [
				"success" => $success ,
				"status" => $status,
				"UserId"=> $UserId,
				"message" => $res['msg']
			];
			
		}catch(PDOException $e){
			$returnData = msg(0,500,$e->getMessage());
		}
		
		return $returnData;
	}
}


?>