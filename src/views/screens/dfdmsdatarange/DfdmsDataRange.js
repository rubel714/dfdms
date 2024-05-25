import React, { forwardRef, useRef, useEffect } from "react";
import swal from "sweetalert";
import { DeleteOutline, Edit } from "@material-ui/icons";
import { Button } from "../../../components/CustomControl/Button";

import CustomTable from "components/CustomTable/CustomTable";
import {
  apiCall,
  apiOption,
  LoginUserInfo,
  language,
} from "../../../actions/api";
import ExecuteQueryHook from "../../../components/hooks/ExecuteQueryHook";

/* import PgEntryFormAddEditModal from "./PgEntryFormAddEditModal";
 */

const DfdmsDataRange = (props) => {
  const serverpage = "dfdmsdatarange"; // this is .php server page

  const { useState } = React;
  const [bFirst, setBFirst] = useState(true);
  const [currentRow, setCurrentRow] = useState([]);
  const [showModal, setShowModal] = useState(false); //true=show modal, false=hide modal

  const { isLoading, data: dataList, error, ExecuteQuery } = ExecuteQueryHook(); //Fetch data
  const UserInfo = LoginUserInfo();

  const [currentFilter, setCurrentFilter] = useState([]);
  const [filedTypeList, setHouseholdFiledTypeList] = useState(null);
  const [districtList, setDistrictList] = useState(null);
  const [upazilaList, setUpazilaList] = useState(null);

  const [currFiledTypeId, setCurrfiledTypeId] = useState(UserInfo.FiledTypeId);
  const [currDataRange, setCurrDataRange] = useState("");
  const [currDistrictId, setCurrDistrictId] = useState(UserInfo.DistrictId);
  const [currUpazilaId, setCurrUpazilaId] = useState(UserInfo.UpazilaId);

  /* =====Start of Excel Export Code==== */
  const EXCEL_EXPORT_URL = process.env.REACT_APP_API_URL;

  const PrintPDFExcelExportFunction = (reportType) => {
    let finalUrl = EXCEL_EXPORT_URL + "report/dfdms_data_range_excel.php";

    let filedTypeName =
    filedTypeList[
      filedTypeList.findIndex(
        (filedTypeList_List) => filedTypeList_List.id == currFiledTypeId
      )
    ].name;

    window.open(
      finalUrl +
        "?action=MembersbyPGataExport" +
        "&reportType=excel" +
        "&FiledTypeId=" +
        currFiledTypeId +
        "&DataRange=" +
        currDataRange +
        "&filedTypeName=" +
        filedTypeName +
        "&TimeStamp=" +
        Date.now()
    );
  };



  /* =====End of Excel Export Code==== */

  const columnList = [
    { field: "rownumber", label: "SL", align: "center", width: "3%" },
    // { field: 'SL', label: 'SL',width:'10%',align:'center',visible:true,sort:false,filter:false },

    {
      field: "field",
      label: "Type",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "15%",
    },
    {
      field: "range",
      label: "Data Range",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "15%",
    },
    {
      field: "colname",
      label: "Number of House Hold",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: "9%",
    },
  ];

  if (bFirst) {
    /**First time call for datalist */

    getHouseholdFiledType();

    //getDataList();
    setBFirst(false);
  }

  /**Get data for table list */
  function getDataList() {
    let params = {
      action: "getDataList",
      lan: language(),
      UserId: UserInfo.UserId,
      FiledTypeId: currFiledTypeId,
      DataRange: currDataRange,
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

  function getHouseholdFiledType() {
    let params = {
      action: "HouseholdFiledTypeList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setHouseholdFiledTypeList(
        [{ id: "", name: "All" }].concat(res.data.datalist)
      );

      //setCurrfiledTypeId(selectDivisionId);
    });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    let data = { ...currentFilter };
    data[name] = value;

    setCurrentFilter(data);

    //for dependancy
    if (name === "FiledTypeId") {
      setCurrfiledTypeId(value);
    }
    if (name === "DataRange") {
      setCurrDataRange(value);
    }
  };

/*   useEffect(() => {
    getDataList();
  }, [currFiledTypeId]); */


  
  const ShowDataFunction = (reportType) => {
    getDataList();
  };


  return (
    <>
      <div class="bodyContainer">
        {/* <!-- ######-----TOP HEADER-----####### --> */}
        <div class="topHeader">
          <h4>Home ❯ Reports ❯ DFDMS Data Range</h4>
        </div>

        {/* <!-- TABLE SEARCH AND GROUP ADD --> */}
        <div class="searchAdd2">
          <div class="formControl-filter-data-label">
            <label for="FiledTypeId">Type: </label>
            <select
              class="dropdown_filter"
              id="FiledTypeId"
              name="FiledTypeId"
              value={currFiledTypeId}
              onChange={(e) => handleChange(e)}
            >
              {filedTypeList &&
                filedTypeList.map((item, index) => {
                  return <option value={item.id}>{item.name}</option>;
                })}
            </select>
          </div>

          <div class="formControl-filter-data-label">
            <label for="DataRange">Data Range: </label>
            <input
              type="text"
              id="DataRange"
              name="DataRange"
              placeholder="Enter Data Range"
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div class="formControl-filter-data-button">
            <Button
              label={"Show Data"}
              disabled={isLoading}
              class={"btnShowData"}
              onClick={ShowDataFunction}
            />
          </div>

          <div class="filter-button">
            <Button
              label={"Export"}
              class={"btnPrint"}
              onClick={PrintPDFExcelExportFunction}
            />
          </div>
        </div>

        {/* <!-- ####---THIS CLASS IS USE FOR TABLE GRID PRODUCT INFORMATION---####s --> */}
        <div class="subContainer">
          <div className="App">
            <CustomTable
              columns={columnList}
              rows={dataList ? dataList : {}}
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

export default DfdmsDataRange;
