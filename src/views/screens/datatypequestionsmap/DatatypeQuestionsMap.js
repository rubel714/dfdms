import React, { forwardRef, useRef, useEffect } from "react";
import swal from "sweetalert";
import { DeleteOutline, Edit, ArrowUpward, ArrowDownward } from "@material-ui/icons";
import {Button}  from "../../../components/CustomControl/Button";

import {
  Typography,
  TextField,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

import CustomTable from "components/CustomTable/CustomTable";
import { apiCall, apiOption , LoginUserInfo, language} from "../../../actions/api";
import ExecuteQueryHook from "../../../components/hooks/ExecuteQueryHook";

import DatatypeQuestionsMapAddEditModal from "./DatatypeQuestionsMapAddEditModal";
import LabelEditModal from "./LabelEditModal";

const DatatypeQuestionsMap = (props) => {
  const serverpage = "datatypequestionsmap"; // this is .php server page

  const { useState } = React;
  const [bFirst, setBFirst] = useState(true);
  const [currentRow, setCurrentRow] = useState([]);
  const [showModal, setShowModal] = useState(false); //true=show modal, false=hide modal
  const [showModalLabel, setshowModalLabel] = useState(false); //true=show modal, false=hide modal

  const {isLoading, data: dataList, error, ExecuteQuery} = ExecuteQueryHook(); //Fetch data
  const UserInfo = LoginUserInfo();

  const [dataTypeList, setDataTypeList] = useState([]);
  const [currDataTypeId, setCurrDataTypeId] = useState(0);


 /* =====Start of Excel Export Code==== */
 const EXCEL_EXPORT_URL = process.env.REACT_APP_API_URL;

 const PrintPDFExcelExportFunction = (reportType) => {
   let finalUrl = EXCEL_EXPORT_URL + "report/print_pdf_excel_server.php";

   window.open(
     finalUrl +
       "?action=DataTypeQuestionsMapExport" +
       "&reportType=excel" +
       // "&DistrictId=" + UserInfo.DistrictId +
       "&DataTypeId=" + currDataTypeId +
       "&TimeStamp=" +
       Date.now()
   );
 };
 /* =====End of Excel Export Code==== */


  const columnList = [
    { field: "SortOrder", label: "SortOrder", align: "center", visible: false },
    { field: "DataTypeId", label: "DataTypeId", align: "center", visible: false },
    { field: "Category", label: "Category", align: "center", visible: false },
    { field: "rownumber", label: "SL", align: "center", width: "5%" },
    // { field: 'SL', label: 'SL',width:'10%',align:'center',visible:true,sort:false,filter:false },
    {
      field: "DataTypeName",
      label: "Data Type",
      align: "left",
      visible: false,
      sort: true,
      filter: true,
      width: "5%"
    },
    {
      field: "QuestionCode",
      label: "Question Code",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "7%"
    },
   
    {
      field: "QuestionName",
      label: "Question Name",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
    },
    {
      field: "MapType",
      label: "Type",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "5%"
    },
    {
      field: "LabelName",
      label: "Label Name",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "20%"
    },
    {
      field: "custom",
      label: "Action",
      width: "9%",
      align: "center",
      visible: true,
      sort: false,
      filter: false,
    },
  ];

  
  if (bFirst) {
    /**First time call for datalist */
    getDataTypeList();
    setBFirst(false);
  }


  
  function getDataTypeList() {
    let params = {
      action: "DataTypeList",
      lan: language(),
      UserId: UserInfo.UserId
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {

      setCurrDataTypeId(res.data.datalist[0]["id"]);
  
      setDataTypeList(res.data.datalist); 
      getDataList(res.data.datalist[0]["id"]);

    });
  }


  /**Get data for table list */
  function getDataList(currDataTypeId){

   
    let params = {
      action: "getDataList",
      lan: language(),
      UserId: UserInfo.UserId,
      DataTypeId: currDataTypeId,
    };
    // console.log('LoginUserInfo params: ', params);

    ExecuteQuery(serverpage, params);
  }

  /** Action from table row buttons*/
  function actioncontrol(rowData) {
    return (
      <>


        <ArrowDownward
            color="success"
            className={"table-edit-icon"}
            onClick={() => {
              downOrderApi(rowData);
            }}
          />

          <ArrowUpward
            color="primary"
            className={"table-edit-icon"}
            onClick={() => {
              upOrderApi(rowData);
            }}
          />

          {/* {rowData.MapType === "Label" && (
          <Edit
            className={"table-edit-icon"}
            onClick={() => {
              editData(rowData);
            }}
          />
        )} */}

        <Edit
          className={"table-edit-icon"}
          onClick={() => {
            editData(rowData);
          }}
        />


        {(rowData.QDataCount == 0) && (<DeleteOutline
          className={"table-delete-icon"}
          onClick={() => {
            deleteData(rowData);
          }}
        />)}
      </>
    );
  }


  function downOrderApi(rowData) {
    let params = {
      action: "downOrderData",
      lan: language(),
      UserId: UserInfo.UserId,
      DataTypeId: currDataTypeId,
      rowData: rowData,
      dataList: dataList,
    };

    apiCall.post(serverpage, { params }, apiOption()).then((res) => {
      // console.log('res: ', res);
      /* props.openNoticeModal({
        isOpen: true,
        msg: res.data.message,
        msgtype: res.data.success,
      }); */
      getDataList(currDataTypeId);
    });
  }

  function upOrderApi(rowData) {
    let params = {
      action: "upOrderData",
      lan: language(),
      UserId: UserInfo.UserId,
      DataTypeId: currDataTypeId,
      rowData: rowData,
      dataList: dataList,
    };

    apiCall.post(serverpage, { params }, apiOption()).then((res) => {
      // console.log('res: ', res);
      /* props.openNoticeModal({
        isOpen: true,
        msg: res.data.message,
        msgtype: res.data.success,
      }); */
      getDataList(currDataTypeId);
    });
  }


  const addData = () => {
    // console.log("rowData: ", rowData);
    // console.log("dataList: ", dataList);

    setCurrentRow({
            id: "",
            MapType: "",
            DataTypeId: currDataTypeId,
          });
    openModal();
  };

  const editData = (rowData) => {
    // console.log("rowData: ", rowData);
    // console.log("dataList: ", dataList);

    setCurrentRow(rowData);
    //openModal();
    openModalLable();
  };

  
  function openModal() {
    setShowModal(true); //true=modal show, false=modal hide
  }
  
  function openModalLable() {
    setshowModalLabel(true); //true=modal show, false=modal hide
  }

  function modalCallback(response) {
    //response = close, addedit
    // console.log('response: ', response);
    /* getDataList(currDataTypeId); */
    setShowModal(false); //true=modal show, false=modal hide
    setshowModalLabel(false); //true=modal show, false=modal hide

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
      console.log('res: ', res);
      props.openNoticeModal({
        isOpen: true,
        msg: res.data.message,
        msgtype: res.data.success,
      });
      getDataList(currDataTypeId);
    });

  }

  const handleChangeChoosenMany = (name, value) => {
    setCurrDataTypeId(value);
    getDataList(value);
  };


/*   const [currDataTypeNameUse, setCurrDataTypeNameUse] = useState('');
  useEffect(() => {
    setCurrDataTypeNameUse(currDataTypeName);

  }, [currDataTypeName]);  */



  return (
    <>
      <div class="bodyContainer">
        {/* <!-- ######-----TOP HEADER-----####### --> */}
        <div class="topHeader">
          <h4>
           Home ❯ Admin ❯ Data Type Questions Map
          </h4>
        </div>

        {/* <!-- TABLE SEARCH AND GROUP ADD --> */}
        <div class="searchAdd">
          {/* <input type="text" placeholder="Search Product Group"/> */}
        
          {/* <button
            onClick={() => {
              addData();
            }}
            className="btnAdd"
          >
            ADD
          </button> */}


            <div class="formControl-filter">
               
               <label>Data Type:</label>
           
             {/* <div class="plusGroup"> */}
             <div class="">
               <Autocomplete
                 autoHighlight
                 // freeSolo
                 disableClearable
                 className="chosen_dropdown"
                 id="DataTypeId"
                 name="DataTypeId"
                 autoComplete
                 options={dataTypeList ? dataTypeList : []}
                 getOptionLabel={(option) => option.name}
                 defaultValue={{ id: 1, name: "PG Data" }}
                  
                 onChange={(event, valueobj) =>
                   handleChangeChoosenMany(
                     "DataTypeId",
                     valueobj ? valueobj.id : ""
                   )
                 }
                 renderOption={(option) => (
                   <Typography className="chosen_dropdown_font">
                     {option.name}
                   </Typography>
                 )}
                 renderInput={(params) => (
                   <TextField {...params} variant="standard" fullWidth />
                 )}
               />
             </div>
           </div>

           <div class="exportAdd">
          
             <Button label={"SELECT QUESTION"} class={"btnAdd"} onClick={addData} />
             <Button label={"Export"} class={"btnPrint"} onClick={PrintPDFExcelExportFunction} />
             </div>

        </div>

        {/* <!-- ####---THIS CLASS IS USE FOR TABLE GRID PRODUCT INFORMATION---####s --> */}
        <div class="subContainer">
          <div className="App">
            <CustomTable
              columns={columnList}
              rows={dataList?dataList:{}}
              actioncontrol={actioncontrol}
              ispagination={false}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
      {/* <!-- BODY CONTAINER END --> */}


      {showModal && (<DatatypeQuestionsMapAddEditModal masterProps={props} currentRow={currentRow} modalCallback={modalCallback}/>)}
      {showModalLabel && (<LabelEditModal masterProps={props} currentRow={currentRow} modalCallback={modalCallback}/>)}


    </>
  );
};

export default DatatypeQuestionsMap;