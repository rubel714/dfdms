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


		$query = "SELECT 
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
			t_farmer a ;";
		
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
		$FarmerName = $data->rowData->FarmerName;
		$NID = $data->rowData->NID;
		$NidFrontPhoto = $data->rowData->NidFrontPhoto;
		$IsRegular = isset($data->rowData->IsRegular) && ($data->rowData->IsRegular !== "") ? $data->rowData->IsRegular : NULL;
		$NidBackPhoto = isset($data->rowData->NidBackPhoto) && ($data->rowData->NidBackPhoto !== "") ? $data->rowData->NidBackPhoto : NULL;
		//$IsRegular = isset($data->rowData->IsRegular) ? $data->rowData->IsRegular : 0;
		$QuestionParentId = isset($data->rowData->QuestionParentId) ? $data->rowData->QuestionParentId : 0;
		

	
		$DivisionId = 1;
		$DistrictId = 1;
		$UpazilaId = 1;
		$PGId = 1;
		$FarmerName = "Test Name";
		$NID = "91411428374x";
		$Phone = "01608022999";
		$FatherName = "Father Test Name";
		$ValueChain = "4. Goat";
		$MotherName = "";
		$LiveStockNo = 8;
		$LiveStockOther = null;
		$Address = "Savar, Dhaka, Dhaka";
		$IsRegular = 0;
		//$NidFrontPhoto = null;
		$NidBackPhoto = null;
		$BeneficiaryPhoto = null;
		$SpouseName = null;
		$Gender = 1;
		$FarmersAge = "50";
		$DisabilityStatus = null;
		$RelationWithHeadOfHH = null;
		$HeadOfHHSex = null;
		$PGRegistered = 0;
		$PGPartnershipWithOtherCompany = 0;
		$TypeOfMember = 0;
		$PGFarmerCode = "";
	


		try{

			$dbh = new Db();
			$aQuerys = array();

			if($FarmerId == ""){

				
				$q = new insertq();
				$q->table = 't_farmer';
				$q->columns = ['FarmerName','NID','NidFrontPhoto','NidBackPhoto','IsRegular', 'DivisionId', 'DistrictId', 'UpazilaId', 'PGId', 'Phone', 'FatherName', 'ValueChain', 'MotherName', 'LiveStockNo', 'LiveStockOther', 'Address', 'BeneficiaryPhoto', 'SpouseName', 'Gender', 'FarmersAge', 'DisabilityStatus', 'RelationWithHeadOfHH', 'HeadOfHHSex', 'PGRegistered', 'PGPartnershipWithOtherCompany', 'TypeOfMember', 'PGFarmerCode'];
				$q->values = [$FarmerName,$NID,$NidFrontPhoto,$NidBackPhoto,$IsRegular, $DivisionId, $DistrictId, $UpazilaId, $PGId, $Phone, $FatherName, $ValueChain, $MotherName, $LiveStockNo, $LiveStockOther, $Address, $BeneficiaryPhoto, $SpouseName, $Gender, $FarmersAge, $DisabilityStatus, $RelationWithHeadOfHH, $HeadOfHHSex, $PGRegistered, $PGPartnershipWithOtherCompany, $TypeOfMember, $PGFarmerCode];
				$q->pks = ['FarmerId'];
				$q->bUseInsetId = false;
				$q->build_query();
				$aQuerys = array($q); 

	
			}else{
				$u = new updateq();
				$u->table = 't_farmer';
				$u->columns = ['FarmerName','NID','NidFrontPhoto','NidBackPhoto','IsRegular', 'DivisionId', 'DistrictId', 'UpazilaId', 'PGId', 'Phone', 'FatherName', 'ValueChain', 'MotherName', 'LiveStockNo', 'LiveStockOther', 'Address', 'BeneficiaryPhoto', 'SpouseName', 'Gender', 'FarmersAge', 'DisabilityStatus', 'RelationWithHeadOfHH', 'HeadOfHHSex', 'PGRegistered', 'PGPartnershipWithOtherCompany', 'TypeOfMember', 'PGFarmerCode'];
				$u->values = [$FarmerName,$NID,$NidFrontPhoto,$NidBackPhoto,$IsRegular, $DivisionId, $DistrictId, $UpazilaId, $PGId, $Phone, $FatherName, $ValueChain, $MotherName, $LiveStockNo, $LiveStockOther, $Address, $BeneficiaryPhoto, $SpouseName, $Gender, $FarmersAge, $DisabilityStatus, $RelationWithHeadOfHH, $HeadOfHHSex, $PGRegistered, $PGPartnershipWithOtherCompany, $TypeOfMember, $PGFarmerCode];
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