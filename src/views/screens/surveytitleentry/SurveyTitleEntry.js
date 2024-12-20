import React, { forwardRef, useRef } from "react";
import swal from "sweetalert";
import { DeleteOutline, Edit, FileCopyOutlined } from "@material-ui/icons";
import { Button } from "../../../components/CustomControl/Button";

import CustomTable from "components/CustomTable/CustomTable";
import {
  apiCall,
  apiOption,
  LoginUserInfo,
  language,
} from "../../../actions/api";
import ExecuteQueryHook from "../../../components/hooks/ExecuteQueryHook";

import SurveyTitleEntryAddEditModal from "./SurveyTitleEntryAddEditModal";

const SurveyTitleEntry = (props) => {
  const serverpage = "surveytitleentry"; // this is .php server page

  const { useState } = React;
  const [bFirst, setBFirst] = useState(true);
  const [currentRow, setCurrentRow] = useState([]);
  const [showModal, setShowModal] = useState(false); //true=show modal, false=hide modal

  const { isLoading, data: dataList, error, ExecuteQuery } = ExecuteQueryHook(); //Fetch data
  const UserInfo = LoginUserInfo();

  /* =====Start of Excel Export Code==== */
  const EXCEL_EXPORT_URL = process.env.REACT_APP_API_URL;

  const PrintPDFExcelExportFunction = (reportType) => {
    let finalUrl = EXCEL_EXPORT_URL + "report/print_pdf_excel_server.php";

    window.open(
      finalUrl +
        "?action=SurveyTitleDataExport" +
        "&reportType=excel" +
        // "&DistrictId=" + UserInfo.DistrictId +
        // "&UpazilaId=" + UserInfo.UpazilaId +
        "&TimeStamp=" +
        Date.now()
    );
  };
  /* =====End of Excel Export Code==== */

  const columnList = [
    { field: "rownumber", label: "SL", align: "center", width: "3%" },

    {
      field: "DataTypeName",
      label: "Data Type",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "20%",
    },
    {
      field: "SurveyTitle",
      label: "Survey Title",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
    },
    {
      field: "CurrentSurveyStatus",
      label: "Current Survey",
      align: "center",
      visible: true,
      sort: true,
      filter: true,
      width: "10%",
    },
    {
      field: "CreateTs",
      label: "Create Date",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "12%",
    },
    {
      field: "custom",
      label: "Action",
      width: "7%",
      align: "center",
      visible: true,
      sort: false,
      filter: false,
    },
  ];

  if (bFirst) {
    /**First time call for datalist */
    getDataList();
    setBFirst(false);
  }

  /**Get data for table list */
  function getDataList() {
    let params = {
      action: "getDataList",
      lan: language(),
      UserId: UserInfo.UserId,
    };
    // console.log('LoginUserInfo params: ', params);

    ExecuteQuery(serverpage, params);
  }

  /** Action from table row buttons*/
  function actioncontrol(rowData) {
    console.log("rowData: ", rowData);
    return (
      <>
        <FileCopyOutlined
          className={"table-edit-icon"}
          onClick={() => {
            copyData(rowData);
          }}
        />

        <Edit
          className={"table-edit-icon"}
          onClick={() => {
            editData(rowData);
          }}
        />

        <DeleteOutline
          className={"table-delete-icon"}
          onClick={() => {
            deleteData(rowData);
          }}
        />
      </>
    );
  }

  const addData = () => {
    // console.log("rowData: ", rowData);
    // console.log("dataList: ", dataList);

    setCurrentRow({
      id: "",
      SurveyTitle: "",
      DataTypeId: "",
      CurrentSurvey: false,
    });
    openModal();
  };

  const copyData = (rowData) => {
    console.log("rowData: ", rowData);
    // console.log("dataList: ", dataList);

    // setCurrentRow(rowData);
    // openModalCopy();
    
    swal({
      title: "Are you sure?",
      text: "You want to copy the survey - "+rowData.SurveyTitle,
      icon: "warning",
      className: "comment-swal",

      buttons: {
        confirm: {
          text: "Yes",
          value: true,
          visible: true,
          className: "",
          closeModal: true,
        },
        cancel: {
          text: "No",
          value: null,
          visible: true,
          className: "",
          closeModal: true,
        },
      },
      dangerMode: true,
    }).then((allowAction) => {
      if (allowAction) {
        copyApi(rowData);
      }
    });

  };

  
  function copyApi(rowData) {
    let params = {
      action: "dataCopy",
      lan: language(),
      UserId: UserInfo.UserId,
      rowData: rowData,
    };

    // apiCall.post("productgroup", { params }, apiOption()).then((res) => {
    apiCall.post(serverpage, { params }, apiOption()).then((res) => {
      console.log("res: ", res);
      props.openNoticeModal({
        isOpen: true,
        msg: res.data.message,
        msgtype: res.data.success,
      });
      getDataList();
    });
  }

  const editData = (rowData) => {
    // console.log("rowData: ", rowData);
    // console.log("dataList: ", dataList);

    setCurrentRow(rowData);
    openModal();
  };

  function openModal() {
    setShowModal(true); //true=modal show, false=modal hide
  }

  function modalCallback(response) {
    //response = close, addedit
    // console.log('response: ', response);
    if (response !== "close") {
      getDataList();
    }

    setShowModal(false); //true=modal show, false=modal hide
  }

  const deleteData = (rowData) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this data!",
      icon: "warning",
      buttons: {
        confirm: {
          text: "Yes",
          value: true,
          visible: true,
          className: "",
          closeModal: true,
        },
        cancel: {
          text: "No",
          value: null,
          visible: true,
          className: "",
          closeModal: true,
        },
      },
      dangerMode: true,
    }).then((allowAction) => {
      if (allowAction) {
        deleteApi(rowData);
      }
    });
  };

  function deleteApi(rowData) {
    let params = {
      action: "deleteData",
      lan: language(),
      UserId: UserInfo.UserId,
      rowData: rowData,
    };

    // apiCall.post("productgroup", { params }, apiOption()).then((res) => {
    apiCall.post(serverpage, { params }, apiOption()).then((res) => {
      console.log("res: ", res);
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
          <h4>Home ❯ Admin ❯ Survey Title</h4>
        </div>

        {/* <!-- TABLE SEARCH AND GROUP ADD --> */}
        <div class="exportAdd">
          <Button label={"ADD"} class={"btnAdd"} onClick={addData} />
          <Button
            label={"Export"}
            class={"btnPrint"}
            onClick={PrintPDFExcelExportFunction}
          />
        </div>

        {/* <!-- ####---THIS CLASS IS USE FOR TABLE GRID PRODUCT INFORMATION---####s --> */}
        <div class="subContainer">
          <div className="App">
            <CustomTable
              columns={columnList}
              rows={dataList ? dataList : {}}
              actioncontrol={actioncontrol}
              isLoading={isLoading}
              // paginationsize={20}
            />
          </div>
        </div>
      </div>
      {/* <!-- BODY CONTAINER END --> */}

      {showModal && (
        <SurveyTitleEntryAddEditModal
          masterProps={props}
          currentRow={currentRow}
          modalCallback={modalCallback}
        />
      )}

    </>
  );
};

export default SurveyTitleEntry;
