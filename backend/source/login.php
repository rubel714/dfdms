<?php
// Allow from any origin
if (isset($_SERVER["HTTP_ORIGIN"])) {
    // You can decide if the origin in $_SERVER['HTTP_ORIGIN'] is something you want to allow, or as we do here, just allow all
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
} else {
    //No HTTP_ORIGIN set, so we allow any. You can disallow if needed here
    header("Access-Control-Allow-Origin: *");
}

header("Access-Control-Allow-Credentials: true");
header("Access-Control-Max-Age: 600");    // cache for 10 minutes

if ($_SERVER["REQUEST_METHOD"] == "OPTIONS") {
    if (isset($_SERVER["HTTP_ACCESS_CONTROL_REQUEST_METHOD"]))
        header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE, PUT"); //Make sure you remove those you do not want to support

    if (isset($_SERVER["HTTP_ACCESS_CONTROL_REQUEST_HEADERS"]))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    //Just exit with 200 OK with the above headers for OPTIONS method
    exit(0);
}

function msg($success, $status, $message, $extra = [])
{
    return array_merge([
        'success' => $success,
        'status' => $status,
        'message' => $message
    ], $extra);
}


require __DIR__ . '/classes/Database.php';
require __DIR__ . '/classes/JwtHandler.php';

$db_connection = new Database();
$conn = $db_connection->dbConnection();

$data = json_decode(file_get_contents("php://input"));
$returnData = [];
$menu_arr = array();

// IF REQUEST METHOD IS NOT EQUAL TO POST
if ($_SERVER["REQUEST_METHOD"] != "POST") {
    $returnData = msg(0, 404, 'Page Not Found!');
}
// CHECKING EMPTY FIELDS
else if (
    !isset($data->email)
    || empty(trim($data->email))

    || !isset($data->password)
    || empty(trim($data->password))
) {

    // $fields = ['fields' => ['Client', 'Branch', 'email', 'password']];
    $fields = ['fields' => ['email', 'password']];
    $returnData = msg(0, 422, 'Please Fill in all Required Fields!', $fields);
}
// IF THERE ARE NO EMPTY FIELDS THEN-
else {
 
    $Email = trim($data->email);
    $Passowrd = trim($data->password);

    $UserId = 0;
    $RoleId = 0;
    $memuList = array();

    try{
        $userRow = array();

        $sql = "SELECT * FROM t_users 
            WHERE (Email=:Email OR LoginName =:Email ) 
            AND IsActive=1";
        $query_u = $conn->prepare($sql);
        $query_u->bindValue(':Email', $Email, PDO::PARAM_STR);
        $query_u->execute();


        if($query_u->rowCount() === 0){
            $returnData = msg(0,422,'User not found!');
            echo json_encode($returnData);
            return;

        }else if($query_u->rowCount() === 1){
            $uRow = $query_u->fetch(PDO::FETCH_ASSOC);
            $UserId = $uRow['UserId'];
        }

        // $UserId = 33333333333333;
        
        $sql = "SELECT a.`UserId`,a.`UserName`,a.`LoginName`,a.`Email`,a.`Password`,
        a.`DesignationId`,a.`IsActive`,a.PhotoUrl,a.DivisionId,b.DivisionName,a.DistrictId,c.DistrictName,a.UpazilaId,d.UpazilaName
            FROM `t_users` a
            left join t_division b on a.DivisionId=b.DivisionId
            left join t_district c on a.DistrictId=c.DistrictId
            left join t_upazila d on a.UpazilaId=d.UpazilaId
            WHERE a.UserId=:UserId";

        $query_stmt = $conn->prepare($sql);
        $query_stmt->bindValue(':UserId', $UserId, PDO::PARAM_STR);
        $query_stmt->execute();
        $userRow = $query_stmt->fetch(PDO::FETCH_ASSOC);

        $fetch_userrole_by_user = "SELECT a.RoleId,b.RoleName,b.DefaultRedirect
        FROM `t_user_role_map` a
        inner join t_roles b on a.RoleId=b.RoleId 
        WHERE a.`UserId`=:UserId";
        $query_stmtrole = $conn->prepare($fetch_userrole_by_user);
        $query_stmtrole->bindValue(':UserId', $UserId,PDO::PARAM_STR);
        $query_stmtrole->execute();
        
        $rowrole = $query_stmtrole->fetchAll(PDO::FETCH_ASSOC);


        if(count($rowrole)>0){

            foreach($rowrole as $r){

                $RoleId = $r['RoleId'];
                $userRow["RoleId"][] = $r["RoleId"];
                $userRow["DefaultRedirect"] = $r['DefaultRedirect'];

                // $RoleId = $rowrole['RoleId'];
                // $userRow["RoleId"] = array($RoleId);
                // $userRow["DefaultRedirect"] = $rowrole['DefaultRedirect'];

            }
        }
        else{
            $RoleId = 0;
            $userRow["RoleId"] = [];
            $userRow["DefaultRedirect"] = "/home";

        }

        //when maintenance mode on then only Admin role user able to login
        if($query_stmt->rowCount()){
            
            if(loginonlyadmin==1){

                //role id = 1 = Super Admin. If site is maintenance mode then only super admin able to login
                if(!in_array(1,$userRow["RoleId"])){
                // if($RoleId != 1){
                    $returnData = [
                        "success" => 0,
                        "status" => 404,
                        "message" => "Site is under maintenance mode."
                    ];

                    echo json_encode($returnData);
                    return;
                }
                
            }
        }



         // IF THE USER IS FOUNDED
         if($query_stmt->rowCount()){
            $check_password = password_verify($Passowrd, $userRow['Password']);

            //if passord is valid
            if($check_password){

                $jwt = new JwtHandler();
                $token = $jwt->_jwt_encode_data(
                    'http://localhost/php_auth_api/',
                    array("UserId"=> $UserId)
                );

                
                $RoleIds = implode(',',$userRow["RoleId"]);
                 $query = "SELECT DISTINCT a.MenuId,a.MenuKey,a.MenuTitle,a.Url,a.ParentId,a.MenuLevel,a.SortOrder
                FROM t_menu a
                INNER JOIN t_role_menu_map b ON a.MenuId=b.MenuId 
                and b.RoleId IN ($RoleIds)
                order by a.SortOrder ASC;";

                $dataMenu = $conn->query($query)->fetchAll(PDO::FETCH_ASSOC);
                if(count($dataMenu)==0){
                    $returnData = [
                        "success" => 0,
                        "status" => 404,
                        "message" => "You have no assigned any menu"
                    ];
                }
                else{

                    foreach($dataMenu as $key => $menu) {
                        $memuList[] = $menu;
                    }

                }

                $userRow["UserAllowdMenuList"] = $memuList;
                $userRow["Password"] = "HIDDEN";
                // getStatusChangeAllow($conn, $userRow["RoleId"]);
                $userRow["StatusChangeAllow"] = ["Submit","Accept","Approve"];

                $returnData = [
                    'success' => 1,
                    'message' => 'You have successfully logged in.',
                    'token' => $token,
                    'user_data' => $userRow
                ];

            }
            else{
                $returnData = msg(0,422,'Invalid Password!');
            }

         }
         else{
            $returnData = msg(0,422,'User not found!');
         }






    }
    catch(PDOException $e){
        $returnData = msg(0,500,$e->getMessage());
    }






}

echo json_encode($returnData);



function getStatusChangeAllow($conn, $RoleList){
    $status = array();

    $query = "SELECT StatusId,StatusName,RoleIds FROM t_status;";
    $result = $conn->query($query)->fetchAll(PDO::FETCH_ASSOC);
    $statusList = array();
    foreach($result as $row){
        $statusList[$row["StatusId"]] = $row;
    }
    echo "<pre>";
    print_r($statusList);
    
    return $status;
}