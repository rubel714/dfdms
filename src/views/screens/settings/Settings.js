import React, { forwardRef, useRef } from "react";
import swal from "sweetalert";
import { DeleteOutline, Edit } from "@material-ui/icons";
import {Button}  from "../../../components/CustomControl/Button";

import CustomTable from "components/CustomTable/CustomTable";
import { apiCall, apiOption , LoginUserInfo, language} from "../../../actions/api";
import ExecuteQueryHook from "../../../components/hooks/ExecuteQueryHook";

const Settings = (props) => {
  const serverpage = "settings"; // this is .php server page

  const { useState } = React;
  const [bFirst, setBFirst] = useState(true);
  const [currentRow, setCurrentRow] = useState([]);
  const [showModal, setShowModal] = useState(false); //true=show modal, false=hide modal

  const {isLoading, data: dataList, error, ExecuteQuery} = ExecuteQueryHook(); //Fetch data
  const UserInfo = LoginUserInfo();

  


  const columnList = [
    { field: "Status", label: "Status", visible: false, align: "center" },
    { field: "rownumber", label: "SL", align: "center", width: "5%" },
    // { field: 'SL', label: 'SL',width:'10%',align:'center',visible:true,sort:false,filter:false },
    {
      field: "SettingName",
      label: "Settings Name",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
    },

    {
      field: "custom",
      label: "Access",
      width: "5%",
      align: "center",
      visible: true,
      // sort: false,
      // filter: false,
    },
  ];

  
  if (bFirst) {
    /**First time call for datalist */
    getDataList();
    setBFirst(false);
  }

  /**Get data for table list */
  function getDataList(){

   
    let params = {
      action: "getDataList",
      lan: language(),
      UserId: UserInfo.UserId,
      ClientId: UserInfo.ClientId,
      BranchId: UserInfo.BranchId,
    };
    // console.log('LoginUserInfo params: ', params);

    ExecuteQuery(serverpage, params);
  }

  /** Action from table row buttons*/
  function actioncontrolmaster(rowData) {
    return (
      <>
      
          {rowData.Status == 0 && (
            <span
              //className={"table-edit-icon"}
              className={"table-delete-icon clickable"}
              onClick={() => {
                assignData(rowData);
              }}
            >
              No
            </span>
          )}

          {rowData.Status == 1 && (
            <span
              className={"clickable"}
              onClick={() => {
                //deleteData(rowData);
                assignData(rowData);
              }}
            >
              Yes
            </span>
          )}
      </>
    );
  }

 
  
  const assignData = (rowData) => {

    assignApi(rowData);

  };

  function assignApi(rowData) {
    let params = {
      action: "assignData",
      lan: language(),
      UserId: UserInfo.UserId,
      rowData: rowData,
    };

    apiCall.post(serverpage, { params }, apiOption()).then((res) => {
      // console.log('res: ', res);
      props.openNoticeModal({
        isOpen: true,
        msg: res.data.message,
        msgtype: res.data.success,
      });
      getDataList();
    });
  }



  return (
    <>
      <div class="bodyContainer">
        {/* <!-- ######-----TOP HEADER-----####### --> */}
        <div class="topHeader">
          <h4>
            Home ❯ Admin ❯ Settings
          </h4>
        </div>

        {/* <!-- TABLE SEARCH AND GROUP ADD --> */}
        {/* <div class="searchAdd"> */}
        {/* <div class="exportAdd">
          <Button label={"ADD"} class={"btnAdd"} onClick={addData} />
          <Button label={"Export"} class={"btnPrint"} onClick={PrintPDFExcelExportFunction} />
        </div> */}

        {/* <!-- ####---THIS CLASS IS USE FOR TABLE GRID PRODUCT INFORMATION---####s --> */}
        <div class="subContainer">
          <div className="App">
           {/*  <CustomTable
              columns={columnList}
              rows={dataList?dataList:{}}
              actioncontrol={actioncontrolmaster}
              isLoading={isLoading}
            /> */}

                <CustomTable
                  columns={columnList}
                  rows={dataList ? dataList : {}}
                  actioncontrol={actioncontrolmaster}
                  ispagination={false}
                  isLoading={isLoading}

                />
          </div>
        </div>
      </div>
      {/* <!-- BODY CONTAINER END --> */}

    </>
  );
};

export default Settings;