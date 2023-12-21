import React, { forwardRef, useRef,  useEffect } from "react";
import swal from "sweetalert";
import { DeleteOutline, Edit } from "@material-ui/icons";
import {Button}  from "../../../components/CustomControl/Button";

import CustomTable from "components/CustomTable/CustomTable";
import { apiCall, apiOption , LoginUserInfo, language} from "../../../actions/api";
import ExecuteQueryHook from "../../../components/hooks/ExecuteQueryHook";

/* import PgEntryFormAddEditModal from "./PgEntryFormAddEditModal";
 */

const ValueChainWisePGMemberDistribution = (props) => {
  const serverpage = "valuechainwisepgmemberdistribution"; // this is .php server page

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
    let finalUrl = EXCEL_EXPORT_URL + "report/value_chain_wise_pg_member_distribution_excel.php";

   /*  let DivisionName=divisionList[divisionList.findIndex(divisionList_List => divisionList_List.id == currDivisionId)].name;
    let DistrictName=districtList[districtList.findIndex(districtList_List => districtList_List.id == currDistrictId)].name;
    let UpazilaName=upazilaList[upazilaList.findIndex(upazilaList_List => upazilaList_List.id == currUpazilaId)].name;
    */

    window.open(
      finalUrl +
        "?action=MembersbyPGataExport" +
        "&reportType=excel" +
        "&DivisionId=" + currDivisionId +
        "&DistrictId=" + currDistrictId +
        "&UpazilaId=" + currUpazilaId +
        /* "&DivisionName=" + DivisionName +
        "&DistrictName=" + DistrictName +
        "&UpazilaName=" + UpazilaName + */
        "&TimeStamp=" +
        Date.now()
    );
  };
  /* =====End of Excel Export Code==== */


  const columnList = [
    { field: "rownumber", label: "SL", visible:false, align: "center", width: "3%" },
    // { field: 'SL', label: 'SL',width:'10%',align:'center',visible:true,sort:false,filter:false },
   
    {
      field: "DivisionName",
      label: "Division",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "10%",
    },
    {
      field: "Dairy",
      label: "Dairy",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: "7%",
    },
    {
      field: "Buffalo",
      label: "Buffalo",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: "7%",
    },
 
    {
      field: "BeefFattening",
      label: "Beef Fattening",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: "7%"
    },

    {
      field: "Goat",
      label: "Goat",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: "7%"
    },
    {
      field: "Sheep",
      label: "Sheep",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: "7%"
    },
    {
      field: "ScavengingChickens",
      label: "Scavenging Chickens",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: "7%"
    },
    {
      field: "Duck",
      label: "Duck",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: "7%"
    },
    {
      field: "Quail",
      label: "Quail",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: "7%"
    },
    {
      field: "Pigeon",
      label: "Pigeon",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: "7%"
    },
    {
      field: "GrandTotal",
      label: "Grand Total",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: "7%"
    },
    {
      field: "Percentage",
      label: "% of Division",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: "7%"
    },
   
  ];

  
  if (bFirst) {
    /**First time call for datalist */

    // getDivision(
    //   UserInfo.DivisionId,
    //   UserInfo.DistrictId,
    //   UserInfo.UpazilaId
    // );

    getDataList();
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
 

  // function getDivision(
  //   selectDivisionId,
  //   SelectDistrictId,
  //   selectUpazilaId
  // ) {
  //   let params = {
  //     action: "DivisionFilterList",
  //     lan: language(),
  //     UserId: UserInfo.UserId,
  //   };

  //   apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
  //     setDivisionList(
  //       [{ id: "", name: "All" }].concat(res.data.datalist)
  //     );


  //     getDistrict(
  //       selectDivisionId,
  //       SelectDistrictId,
  //       selectUpazilaId
  //     );


  //   });
  // }


  
  // function getDistrict(
  //   selectDivisionId,
  //   SelectDistrictId,
  //   selectUpazilaId
  // ) {
  //   let params = {
  //     action: "DistrictFilterList",
  //     lan: language(),
  //     UserId: UserInfo.UserId,
  //     DivisionId: selectDivisionId,
  //   };

  //   apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
  //     setDistrictList(
  //       [{ id: "", name: "All" }].concat(res.data.datalist)
  //     );
   
  //     setCurrDistrictId(SelectDistrictId);
  //     getUpazila(
  //       selectDivisionId,
  //       SelectDistrictId,
  //       selectUpazilaId
  //     );
     
  //   });
  // }


  
  // function getUpazila(
  //   selectDivisionId,
  //   SelectDistrictId,
  //   selectUpazilaId
  // ) {
  //   let params = {
  //     action: "UpazilaFilterList",
  //     lan: language(),
  //     UserId: UserInfo.UserId,
  //     DivisionId: selectDivisionId,
  //     DistrictId: SelectDistrictId,
  //   };

  //   apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
  //     setUpazilaList(
  //       [{ id: "", name: "All" }].concat(res.data.datalist)
  //     );
  
  //     setCurrUpazilaId(selectUpazilaId);
      
     
  //   });
  // }


  
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   let data = { ...currentFilter };
  //   data[name] = value;


  //   setCurrentFilter(data);

  //   //for dependancy
  //   if (name === "DivisionId") {
  //     setCurrDivisionId(value);

  //     setCurrDistrictId("");
  //     setCurrUpazilaId("");
  //     getDistrict(value, "", "");
  //     getUpazila(value, "", "");


  //   } else if (name === "DistrictId") {
  //     setCurrDistrictId(value);
  //      getUpazila(currentFilter.DivisionId, value, "");
  //   } else if (name === "UpazilaId") {
  //     setCurrUpazilaId(value);
  //   } 



  // };


  // useEffect(() => {
  //   getDataList();
  // }, [currDivisionId, currDistrictId, currUpazilaId]);


  return (
    <>
      <div class="bodyContainer">
        {/* <!-- ######-----TOP HEADER-----####### --> */}
        <div class="topHeader">
          <h4>
            Home ❯ Reports ❯ Farmer Distribution
          </h4>
        </div>

        {/* <!-- TABLE SEARCH AND GROUP ADD --> */}
      
          
          <div class="exportAdd">
              <Button label={"Export"} class={"btnPrint"} onClick={PrintPDFExcelExportFunction} /> 
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


     {/*  {showModal && (<PgEntryFormAddEditModal masterProps={props} currentRow={currentRow} modalCallback={modalCallback}/>)}
 */}

    </>
  );
};

export default ValueChainWisePGMemberDistribution;