import React, { forwardRef, useRef,  useEffect } from "react";
import swal from "sweetalert";
import { DeleteOutline, Edit } from "@material-ui/icons";
import {Button}  from "../../../components/CustomControl/Button";

import CustomTable from "components/CustomTable/CustomTable";
import { apiCall, apiOption , LoginUserInfo, language} from "../../../actions/api";
import ExecuteQueryHook from "../../../components/hooks/ExecuteQueryHook";

import moment from "moment";
/* import PgEntryFormAddEditModal from "./PgEntryFormAddEditModal";
 */

const TotalHouseholdAnimalInformation = (props) => {
  const serverpage = "totalhouseholdanimalinformation"; // this is .php server page

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

  const [fromDate, setFromDate] = useState(moment().subtract(7, 'days').format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));

  /* =====Start of Excel Export Code==== */
  const EXCEL_EXPORT_URL = process.env.REACT_APP_API_URL;

 /*  const PrintPDFExcelExportFunction = (reportType) => {
    let finalUrl = EXCEL_EXPORT_URL + "report/totalhouseholdanimalinformation_excel.php";

    window.open(
      finalUrl +
        "?action=TotalHouseholdAnimalInformationExport" +
        "&reportType=excel" +
        "&DivisionId=" + currDivisionId +
        "&DistrictId=" + currDistrictId +
        "&UpazilaId=" + currUpazilaId +
        "&StartDate=" + fromDate +
        "&EndDate=" + endDate +
        "&TimeStamp=" +
        Date.now()
    );
  };
 */

  const PrintPDFExcelExportFunction = (reportType) => {
    /* let finalUrl = EXCEL_EXPORT_URL + "report/print_pdf_excel_server.php"; */
    let finalUrl = EXCEL_EXPORT_URL + "report/TotalHouseholdAnimalInformationExport_csv.php";

    window.open(
      finalUrl +
        "?action=TotalHouseholdAnimalInformationExport" +
        "&reportType=excel" +
        "&DivisionId=" + currDivisionId +
        "&DistrictId=" + currDistrictId +
        "&UpazilaId=" + currUpazilaId +
        "&StartDate=" + fromDate +
        "&EndDate=" + endDate +
        "&TimeStamp=" +
        Date.now()
    );
  };



  /* =====End of Excel Export Code==== */

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    let data = { ...currentFilter };
    data[name] = value;


    setCurrentFilter(data);

    if (name === "StartDate") {
      setFromDate(value);

    } else if (name === "EndDate") {
      setEndDate(value);

    } 

  };


  return (
    <>
      <div class="subContainer inputAreaMobile">
        {/* <!-- ######-----TOP HEADER-----####### --> */}
        <div class="topHeader">
          <h4>
            Home ❯ Reports ❯ Total Household Animal Information
          </h4>
        </div> 

        {/* <!-- TABLE SEARCH AND GROUP ADD --> */}
       {/*  <div class="searchAdd3"> */}
          <div class="formControl-mobile">
              <label for="StartDate">From Date: </label>
                      <input
                        id="StartDate"
                        name="StartDate"
                        type="date"
                        className="numberInput"
                       /*  class={errorObject.StartDate}*/
                        value={fromDate} 
                        onChange={(e) => handleChange(e)}
                      />
          </div>

          <div class="formControl-mobile">
              <label for="EndDate">To Date: </label>
              <input
                        id="EndDate"
                        name="EndDate"
                        type="date"
                        className="numberInput"
                       /*  class={errorObject.EndDate}*/
                        value={endDate} 
                        onChange={(e) => handleChange(e)}
                      />
          </div>

          <div class="modalItem-mobile">
              <Button label={"Export"} class={"btnPrintExt"} onClick={PrintPDFExcelExportFunction} /> 
          </div>
      
      {/* </div> */}

        {/* <div class="subContainer">
          <div className="App">
            <CustomTable
              columns={columnList}
              rows={dataList?dataList:{}}
               actioncontrol={actioncontrol}
               isLoading={isLoading}
            />
          </div>
        </div> */}
      </div>
      

    </>
  );
};

export default TotalHouseholdAnimalInformation;