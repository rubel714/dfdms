import React, { forwardRef, useRef,  useEffect } from "react";
import swal from "sweetalert";
import { DeleteOutline, Edit } from "@material-ui/icons";
import {Button}  from "../../../components/CustomControl/Button";

import CustomTable from "components/CustomTable/CustomTable";
import { apiCall, apiOption , LoginUserInfo, language} from "../../../actions/api";
import ExecuteQueryHook from "../../../components/hooks/ExecuteQueryHook";

import UnionEntryAddEditModal from "./UpazilaEntryAddEditModal";

const UpazilaEntry = (props) => {
  const serverpage = "upazilaentry"; // this is .php server page

  const { useState } = React;
  const [bFirst, setBFirst] = useState(true);
  const [currentRow, setCurrentRow] = useState([]);
  const [showModal, setShowModal] = useState(false); //true=show modal, false=hide modal

  const {isLoading, data: dataList, error, ExecuteQuery} = ExecuteQueryHook(); //Fetch data
  const UserInfo = LoginUserInfo();

  const [currentFilter, setCurrentFilter] = useState([]); 
  const [divisionList, setDivisionList] = useState(null);
  const [districtList, setDistrictList] = useState(null);
  const [upazilaList, setUpazilaList] = useState(null);


  const [currDivisionId, setCurrDivisionId] = useState(UserInfo.DivisionId);
  const [currDistrictId, setCurrDistrictId] = useState(UserInfo.DistrictId);


  /* =====Start of Excel Export Code==== */
  const EXCEL_EXPORT_URL = process.env.REACT_APP_API_URL;

  const PrintPDFExcelExportFunction = (reportType) => {
    let finalUrl = EXCEL_EXPORT_URL + "report/print_pdf_excel_server.php";


    
    window.open(
      finalUrl +
        "?action=UpazilaExport" +
        "&reportType=excel" +
        "&DivisionId=" + currDivisionId +
        "&DistrictId=" + currDistrictId +
        "&TimeStamp=" +
        Date.now()
    );
  };
  /* =====End of Excel Export Code==== */


  const columnList = [
    { field: "rownumber", label: "SL", align: "center", width: "3%" },
    // { field: 'SL', label: 'SL',width:'10%',align:'center',visible:true,sort:false,filter:false },
   
    {
      field: "DivisionName",
      label: "Division",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "20%",
    },
    {
      field: "DistrictName",
      label: "District",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "20%",
    },
    /* {
      field: "UpazilaName",
      label: "Upazila",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "20%",
    }, */
    {
      field: "UpazilaName",
      label: "Upazila Name",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
    },
    {
      field: "IsCityCorporationName",
      label: "Is City Corporation",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "6%",
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

    getDivision(
      UserInfo.DivisionId,
      UserInfo.DistrictId
    );

    //getDataList();
    setBFirst(false);
  }

  /**Get data for table list */
  function getDataList(){

   
    let params = {
      action: "getDataList",
      lan: language(),
      UserId: UserInfo.UserId,
      DivisionId: currDivisionId,
      DistrictId: currDistrictId,
    };
    // console.log('LoginUserInfo params: ', params);

    ExecuteQuery(serverpage, params);
  }

  /** Action from table row buttons*/
  function actioncontrol(rowData) {
    return (
      <>
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

    setCurrentRow({
            id: "",
            UpazilaName: "",
            DivisionId: "",
            DistrictId: "",
            IsCityCorporation: false,
          });
    openModal();
  };

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
    /* getDataList(); */
    if(response !=='close'){
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
      console.log('res: ', res);
      props.openNoticeModal({
        isOpen: true,
        msg: res.data.message,
        msgtype: res.data.success,
      });
      getDataList();
    });

  }


  function getDivision(
    selectDivisionId,
    SelectDistrictId
  ) {
    let params = {
      action: "DivisionFilterList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setDivisionList(
        [{ id: "", name: "All" }].concat(res.data.datalist)
      );


      //setCurrDivisionId(selectDivisionId);

      getDistrict(
        selectDivisionId,
        SelectDistrictId
      );

      /* getProductGeneric(
        selectDivisionId,
        SelectProductGenericId
      ); */


    });
  }


  
  function getDistrict(
    selectDivisionId,
    SelectDistrictId
  ) {
    let params = {
      action: "DistrictFilterList",
      lan: language(),
      UserId: UserInfo.UserId,
      DivisionId: selectDivisionId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setDistrictList(
        [{ id: "", name: "All" }].concat(res.data.datalist)
      );
   
      setCurrDistrictId(SelectDistrictId);
     
     
    });
  }



  
  const handleChange = (e) => {
    const { name, value } = e.target;
    let data = { ...currentFilter };
    data[name] = value;


    setCurrentFilter(data);

    //for dependancy
    if (name === "DivisionId") {
      setCurrDivisionId(value);

      setCurrDistrictId("");
      getDistrict(value, "", "");


    } else if (name === "DistrictId") {
      setCurrDistrictId(value);
    } 



  };


  useEffect(() => {
    getDataList();
  }, [currDivisionId, currDistrictId]);


  return (
    <>
      <div class="bodyContainer">
        {/* <!-- ######-----TOP HEADER-----####### --> */}
        <div class="topHeader">
          <h4>
            Home ❯ Admin ❯ Upazila Entry
          </h4>
        </div>

        {/* <!-- TABLE SEARCH AND GROUP ADD --> */}
        <div class="searchAdd6">
          <div class="formControl-filter-data-label">
              <label for="DivisionId">Division: </label>
              <select
                  class="dropdown_filter"
                  id="DivisionId"
                  name="DivisionId"
                  value={currDivisionId}
                  onChange={(e) => handleChange(e)}
              >
                  {divisionList &&
                      divisionList.map((item, index) => {
                          return <option value={item.id}>{item.name}</option>;
                      })}
              </select>
          </div>

          <div class="formControl-filter-data-label">
              <label for="DistrictId">District: </label>
              <select
                  class="dropdown_filter"
                  id="DistrictId"
                  name="DistrictId"
                  value={currDistrictId}
                  onChange={(e) => handleChange(e)}
              >
                  {districtList &&
                      districtList.map((item, index) => {
                          return <option value={item.id}>{item.name}</option>;
                      })}
              </select>
          </div>

          <div class="filter-button">
              <Button label={"ADD"} class={"btnAdd"} onClick={addData} />
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
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
      {/* <!-- BODY CONTAINER END --> */}


      {showModal && (<UnionEntryAddEditModal masterProps={props} currentRow={currentRow} modalCallback={modalCallback}/>)}


    </>
  );
};

export default UpazilaEntry;