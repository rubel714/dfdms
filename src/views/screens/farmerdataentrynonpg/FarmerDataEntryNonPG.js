import React, { forwardRef, useRef,  useEffect } from "react";
import swal from "sweetalert";
import { DeleteOutline, Edit } from "@material-ui/icons";
import {Button}  from "../../../components/CustomControl/Button";

import CustomTable from "components/CustomTable/CustomTable";
import { apiCall, apiOption , LoginUserInfo, language} from "../../../actions/api";
import ExecuteQueryHook from "../../../components/hooks/ExecuteQueryHook";

import RegularBeneficiaryEntryAddEditModal from "./FarmerDataEntryNonPGAddEditModal";
import moment from "moment";

const FarmerDataEntryNonPG = (props) => {
  const serverpage = "farmerdataentrynonpg"; // this is .php server page

  const { useState } = React;
  const [listEditPanelToggle, setListEditPanelToggle] = useState(true);
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

  const [currentDate, setCurrentDate] = useState(moment().format("YYYY-MM-DD"));



   /* =====Start of Excel Export Code==== */
   const EXCEL_EXPORT_URL = process.env.REACT_APP_API_URL;

   const PrintPDFExcelExportFunction = (reportType) => {
     let finalUrl = EXCEL_EXPORT_URL + "report/print_pdf_excel_server.php";
 
     window.open(
       finalUrl +
         "?action=RegularBeneficiaryExport" +
         "&reportType=excel" +
         "&DivisionId=" + currDivisionId +
         "&DistrictId=" + currDistrictId +
         "&UpazilaId=" + currUpazilaId +
         "&TimeStamp=" +
         Date.now()
     );
   };

   const PrintPDFExcelExportFunctionAll = (reportType) => {
     let finalUrl = EXCEL_EXPORT_URL + "report/print_pdf_excel_server.php";
 
     window.open(
       finalUrl +
         "?action=RegularBeneficiaryExport" +
         "&reportType=excel" +
         "&DivisionId=" + 0 +
         "&DistrictId=" + 0 +
         "&UpazilaId=" + 0 +
         "&TimeStamp=" +
         Date.now()
     );
   };
   /* =====End of Excel Export Code==== */
 

  const columnList = [
    { field: "rownumber", label: "SL", align: "center", width: "3%" }, 
    {
      field: "FarmerName",
      label: "Beneficiary Name",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
    },

    {
      field: "NID",
      label: "Beneficiary NID",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "10%",
    },
    {
      field: "Phone",
      label: "Mobile Number",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "10%",
    },
    {
      field: "FatherName",
      label: "Father's Name",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "12%",
    },
    {
      field: "MotherName",
      label: "Mother's Name",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "10%",
    },
    {
      field: "SpouseName",
      label: "Spouse Name",
      align: "left",
      visible: false,
      sort: true,
      filter: true,
      width: "10%",
    },
    {
      field: "GenderName",
      label: "Gender",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "7%",
    },
    {
      field: "FarmersAge",
      label: "Farmer's Age",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "7%",
    },
    {
      field: "ValueChainName",
      label: "Value Chain",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "7%",
    },
    {
      field: "PGName",
      label: "Name of Producer Group",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "12%",
    },
    {
      field: "IsRegularBeneficiary",
      label: "Is Regular Beneficiary?",
      align: "center",
      visible: false,
      sort: true,
      filter: true,
      width: "4%",
    },

    {
      field: "custom",
      label: "Action",
      width: "5%",
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
      UserInfo.DistrictId,
      UserInfo.UpazilaId
    );
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
    setCurrentRow({
            id: "",
            HouseHoldId: "",
            DivisionId: UserInfo.DivisionId,
            DistrictId: UserInfo.DistrictId,
            UpazilaId: UserInfo.UpazilaId,
            UnionId: "",
            Ward: "",
            Village: "",
            FarmerName: "",
            FatherName: "",
            MotherName: "",
            HusbandWifeName: "",
            NameOfTheFarm: "",
            Phone: "",
            Gender: "",
            IsDisability: 0,
            NID: "",
            IsPGMember: 0,
            Latitute: "",
            Longitute: "",
            CowNative: "",
            CowCross: "",
            CowBullNative: "",
            CowBullCross: "",
            CowCalfMaleNative: "",
            CowCalfMaleCross: "",
            CowCalfFemaleNative: "",
            CowCalfFemaleCross: "",
            CowMilkProductionNative: "",
            CowMilkProductionCross: "",
            BuffaloAdultMale: "",
            BuffaloAdultFemale: "",
            BuffaloCalfMale: "",
            BuffaloCalfFemale: "",
            BuffaloMilkProduction: "",
            GoatAdultMale: "",
            GoatAdultFemale: "",
            GoatCalfMale: "",
            GoatCalfFemale: "",
            SheepAdultMale: "",
            SheepAdultFemale: "",
            SheepCalfMale: "",
            SheepCalfFemale: "",
            GoatSheepMilkProduction: "",
            ChickenNative: "",
            ChickenLayer: "",
            ChickenSonaliFayoumiCockerelOthers: "",
            ChickenBroiler: "",
            ChickenEgg: "",
            DucksNumber: "",
            DucksEgg: "",
            PigeonNumber: "",
            FamilyMember: "",
            LandTotal: "",
            LandOwn: "",
            LandLeased: "",
            DataCollectionDate: "",
            DataCollectorName: UserInfo.UserName,
            DesignationId: UserInfo.DesignationId,
            PhoneNumber: UserInfo.Phone,
            DataCollectionDate: currentDate,
            UserId: UserInfo.UserId,
            Remarks: "",


          });

          setCurrentFilter({
            DivisionId: UserInfo.DivisionId,
            DistrictId: UserInfo.DistrictId,
            UpazilaId: UserInfo.UpazilaId,
       
          });
          setListEditPanelToggle(false);
    /* openModal(); */
  };

  const editData = (rowData) => {

    setCurrentRow(rowData);
    /* openModal(); */
    setListEditPanelToggle(false);
  };

  
  function openModal() {
    setShowModal(true); //true=modal show, false=modal hide
  }

  function modalCallback(response) {
    if(response !=='close'){
      getDataList();
    }
    setShowModal(false); //true=modal show, false=modal hide
    setListEditPanelToggle(true);

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
        res.data.datalist
      );

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


  const backToList = () => {
    setListEditPanelToggle(true); // true = show list and hide add/edit panel
  };


  return (
    <>
      <div class="bodyContainer">
        {/* <!-- ######-----TOP HEADER-----####### --> */}
        <div class="topHeader">
          <h4>
            Home ❯ Admin ❯ Household Livestock Survey 2024
          </h4>

          {!listEditPanelToggle ? (
              <>
                <Button
                  label={"Back To List"}
                  class={"btnClose"}
                  onClick={backToList}
                />
              </>
            ) : (
              <></>
            )}

        </div>

        {listEditPanelToggle && (
          <>
        {/* <!-- TABLE SEARCH AND GROUP ADD --> */}
        <div class="searchAdd3">
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
              <Button label={"ADD"} class={"btnAdd"} onClick={addData} />
              <Button label={"Export"} class={"btnPrint"} onClick={PrintPDFExcelExportFunction} />
              {/* <Button label={"All Data Export"} class={"btnPrint"} onClick={PrintPDFExcelExportFunctionAll} /> */}
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

        </>
        )}

        {!listEditPanelToggle && (
                  <>
                    {/* {!currentInvoice.BPosted && ( */}
                    {1 == 1 && (

                <RegularBeneficiaryEntryAddEditModal masterProps={props} currentRow={currentRow} modalCallback={modalCallback}/>

              )}
              </>
            )}

        
      </div>
      {/* <!-- BODY CONTAINER END --> */}
 
    </>

    

  );
};

export default FarmerDataEntryNonPG;