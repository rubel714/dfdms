import React, { forwardRef, useRef,  useEffect } from "react";
import swal from "sweetalert";
import { DeleteOutline, Edit } from "@material-ui/icons";
import {Button}  from "../../../components/CustomControl/Button";

import CustomTable from "components/CustomTable/CustomTable";
import { apiCall, apiOption , LoginUserInfo, language} from "../../../actions/api";
import ExecuteQueryHook from "../../../components/hooks/ExecuteQueryHook";

/* import PgEntryFormAddEditModal from "./PgEntryFormAddEditModal";
 */

const MembersByPg = (props) => {
  const serverpage = "membersbypg"; // this is .php server page

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
  const [currUpazilaId, setCurrUpazilaId] = useState(UserInfo.UpazilaId);

  /* =====Start of Excel Export Code==== */
  const EXCEL_EXPORT_URL = process.env.REACT_APP_API_URL;

  const PrintPDFExcelExportFunction = (reportType) => {
    let finalUrl = EXCEL_EXPORT_URL + "report/print_pdf_excel_server.php";

    window.open(
      finalUrl +
        "?action=MembersbyPGataExport" +
        "&reportType=excel" +
        "&DivisionId=" + currDivisionId +
        "&DistrictId=" + currDistrictId +
        "&UpazilaId=" + currUpazilaId +
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
      width: "15%",
    },
    {
      field: "DistrictName",
      label: "District",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "15%",
    },
    {
      field: "UpazilaName",
      label: "Upazila",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "15%",
    },
   /*  {
      field: "UnionName",
      label: "Union",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "7%",
    }, */
    {
      field: "ValueChainName",
      label: "Value Chain",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "15%"
    },

    {
      field: "PGName",
      label: "Name of PG",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
    },
    {
      field: "NoOfMembers",
      label: "No. of Members",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: "9%"
    },
   
  ];

  
  if (bFirst) {
    /**First time call for datalist */

    getDivision(
      UserInfo.DivisionId,
      UserInfo.DistrictId,
      UserInfo.UpazilaId
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
      UpazilaId: currUpazilaId,
    };
    // console.log('LoginUserInfo params: ', params);

    ExecuteQuery(serverpage, params);
  }

  /** Action from table row buttons*/
   function actioncontrol(rowData) {
    return (
      <>
        {/* <Edit
          className={"table-edit-icon"}
          onClick={() => {
            editData(rowData);
          }}
        /> */}

        {/* <DeleteOutline
          className={"table-delete-icon"}
          onClick={() => {
            deleteData(rowData);
          }}
        /> */}
      </>
    );
  } 
 
 
  function getDivision(
    selectDivisionId,
    SelectDistrictId,
    selectUpazilaId
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
        SelectDistrictId,
        selectUpazilaId
      );


    });
  }


  
  function getDistrict(
    selectDivisionId,
    SelectDistrictId,
    selectUpazilaId
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
      getUpazila(
        selectDivisionId,
        SelectDistrictId,
        selectUpazilaId
      );
     
    });
  }


  
  function getUpazila(
    selectDivisionId,
    SelectDistrictId,
    selectUpazilaId
  ) {
    let params = {
      action: "UpazilaFilterList",
      lan: language(),
      UserId: UserInfo.UserId,
      DivisionId: selectDivisionId,
      DistrictId: SelectDistrictId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setUpazilaList(
        [{ id: "", name: "All" }].concat(res.data.datalist)
      );
  
      setCurrUpazilaId(selectUpazilaId);
      
     
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
      setCurrUpazilaId("");
      getDistrict(value, "", "");
      getUpazila(value, "", "");


    } else if (name === "DistrictId") {
      setCurrDistrictId(value);
       getUpazila(currentFilter.DivisionId, value, "");
    } else if (name === "UpazilaId") {
      setCurrUpazilaId(value);
    } 



  };


  useEffect(() => {
    getDataList();
  }, [currDivisionId, currDistrictId, currUpazilaId]);


  return (
    <>
      <div class="bodyContainer">
        {/* <!-- ######-----TOP HEADER-----####### --> */}
        <div class="topHeader">
          <h4>
            Home ❯ Reports ❯ PG Members
          </h4>
        </div>

        {/* <!-- TABLE SEARCH AND GROUP ADD --> */}
        <div class="searchAdd2">
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

          <div class="formControl-filter-data-label">
              <label for="UpazilaId">Upazila: </label>
              <select
                  id="UpazilaId"
                  name="UpazilaId"
                  class="dropdown_filter"
                  value={currUpazilaId}
                  onChange={(e) => handleChange(e)}
              >
                  {upazilaList &&
                      upazilaList.map((item, index) => {
                          return <option value={item.id}>{item.name}</option>;
                      })}
              </select>
          </div>

          
          <div class="filter-button">
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

    </>
  );
};

export default MembersByPg;