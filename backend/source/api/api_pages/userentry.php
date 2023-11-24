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


		
		$query = "SELECT a.UserId AS id, a.`DivisionId`, a.`DistrictId`, a.`UpazilaId`, a.UnionId, a.`UserName`, 
		a.Password,
		h.RoleGroupName,
		h.RoleIds,
		a.LoginName, a.`Email`, b.`DivisionName`,c.`DistrictName`, d.`UpazilaName`, u.UnionName,
		a.`IsActive`, case when a.IsActive=1 then 'Yes' else 'No' end IsActiveName, a.DesignationId, e.DesignationName
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
			ORDER BY b.`DivisionName`, c.`DistrictName`, d.`UpazilaName`, a.`UserName` ASC;";
	
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

		$id = $data->rowData->id;
		$UserName = $data->rowData->UserName;
		$pass_word = $data->rowData->Password;
		$Password = password_hash($pass_word, PASSWORD_DEFAULT);
		$LoginName = $data->rowData->LoginName;
		$DivisionId = $data->rowData->DivisionId? $data->rowData->DivisionId : null;
		$DistrictId = $data->rowData->DistrictId? $data->rowData->DistrictId : null;
		$UpazilaId = $data->rowData->UpazilaId? $data->rowData->UpazilaId : null;
		$UnionId = $data->rowData->UnionId? $data->rowData->UnionId : null;
		$Email = $data->rowData->Email;
		$DesignationId = $data->rowData->DesignationId;
		$IsActive = $data->rowData->IsActive ? $data->rowData->IsActive : 0;

		$Cpassword =  empty($data->rowData->Password) ?  '':$data->rowData->Password;	
		$PhotoUrl = 'rubel.jpg';
	
		$multiselectPGroup = isset($data->rowData->multiselectPGroup) ? $data->rowData->multiselectPGroup : '';


		$msgType = 'Please, Assign Roles';		
      

        if ($multiselectPGroup == '') {

			$returnData = [
			    "success" => 0 ,
				"status" => 0,
				"UserId"=> $UserId,
				"message" => $msgType
			];
            return $returnData;
            
        } 


		try{

			$dbh = new Db();
			$aQuerys = array();

			if($id == ""){
				$q = new insertq();
				$q->table = 't_users';
				$q->columns = ['UserName','LoginName','Password','DivisionId','DistrictId','UpazilaId','UnionId','Email','IsActive','DesignationId','PhotoUrl'];
				$q->values = [$UserName,$LoginName,$Password,$DivisionId,$DistrictId,$UpazilaId,$UnionId, $Email,$IsActive,$DesignationId,$PhotoUrl];
				$q->pks = ['UserId'];
				$q->bUseInsetId = true;
				$q->build_query();
				$aQuerys[] = $q;

				
				foreach ($multiselectPGroup as $keyrole_id => $RoleId) {

					if ($RoleId == 0){
						$RoleId = NULL;
					}
					$q = new insertq();
					$q->table = 't_user_role_map';
					$q->columns = ['UserId', 'RoleId'];
					$q->values = ['[LastInsertedId]', $RoleId];
					$q->pks = ['UserRoleId'];
					$q->bUseInsetId = false;
					$q->build_query();
					// $aQuerys = array($q);
					$aQuerys[] = $q;
				}


			}else{
				$u = new updateq();
				$u->table = 't_users';

					if($Cpassword != ''){
						$u->columns = ['UserName','LoginName','Password','DivisionId','DistrictId','UpazilaId','UnionId','Email','IsActive','DesignationId'];
						$u->values = [$UserName,$LoginName,$Password,$DivisionId,$DistrictId,$UpazilaId,$UnionId, $Email,$IsActive,$DesignationId];
						
					}else{
						$u->columns = ['UserName','LoginName','DivisionId','DistrictId','UpazilaId','UnionId','Email','IsActive','DesignationId'];
						$u->values = [$UserName,$LoginName,$DivisionId,$DistrictId,$UpazilaId,$UnionId, $Email,$IsActive,$DesignationId];
				
					}

				$u->pks = ['UserId'];
				$u->pk_values = [$id];
				$u->build_query();
				$aQuerys[] = $u;


				$query = "DELETE FROM `t_user_role_map` WHERE UserId = $id;";
				$aRow = $dbh->query($query);


				foreach ($multiselectPGroup as $keyrole_id => $RoleId) {

					if ($RoleId == 0){
						$RoleId = NULL;
					}
					$q = new insertq();
					$q->table = 't_user_role_map';
					$q->columns = ['UserId', 'RoleId'];
					$q->values = ['[LastInsertedId]', $RoleId];
					$q->pks = ['UserRoleId'];
					$q->bUseInsetId = false;
					$q->build_query();
					// $aQuerys = array($q);
					$aQuerys[] = $q;
				}



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
		
		$id = $data->rowData->id;
		$lan = trim($data->lan); 
		$UserId = trim($data->UserId); 

		try{

			$dbh = new Db();
			
            $d = new deleteq();
            $d->table = 't_users';
            $d->pks = ['UserId'];
            $d->pk_values = [$id];
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