import React, { forwardRef, useRef, useEffect } from "react";
import Cookies from "js-cookie";
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

import HouseholdLivestockSurveyDataEntryAddEditModal from "./HouseholdLivestockSurveyDataEntryAddEditModal";
import moment from "moment";

const HouseholdLivestockSurveyDataEntry = (props) => {
  const serverpage = "householdlivestocksurveydataentry"; // this is .php server page

  const { useState } = React;
  const [listEditPanelToggle, setListEditPanelToggle] = useState(true);
  const [bFirst, setBFirst] = useState(true);
  const [currentRow, setCurrentRow] = useState([]);
  const [showModal, setShowModal] = useState(false); //true=show modal, false=hide modal
  const [isServerLoading, setIsServerLoading] = useState(false);

 /*  const { isLoading, data: dataList, error, ExecuteQuery } = ExecuteQueryHook(); //Fetch data
 */
  let dataList = JSON.parse(localStorage.getItem("householdlivestocksurveydataentry")) || [];
  
  const UserInfo = LoginUserInfo();
  
  const [currentFilter, setCurrentFilter] = useState([]);
  const [divisionList, setDivisionList] = useState(null);
  const [districtList, setDistrictList] = useState(null);
  const [upazilaList, setUpazilaList] = useState(null);

  const [currDivisionId, setCurrDivisionId] = useState(UserInfo.DivisionId);
  const [currDistrictId, setCurrDistrictId] = useState(UserInfo.DistrictId);
  const [currUpazilaId, setCurrUpazilaId] = useState(UserInfo.UpazilaId);
  const Cookie_UnionId = Cookies.get("Cookie_UnionId") || "";
  const Cookie_DataCollectorName =
    Cookies.get("Cookie_DataCollectorName") || "";
  const Cookie_DesignationId =
    Cookies.get("Cookie_DesignationId") || UserInfo.DesignationId;
  const Cookie_PhoneNumber = Cookies.get("Cookie_PhoneNumber") || "";

  const [currentDate, setCurrentDate] = useState(moment().format("YYYY-MM-DD"));

  /* =====Start of Excel Export Code==== */

  const EXCEL_EXPORT_URL = process.env.REACT_APP_API_URL;

  const PrintPDFExcelExportFunction = (reportType) => {
    let finalUrl =
      EXCEL_EXPORT_URL + "report/household_livestock_survey_excel.php";

   /*  let DivisionName =
      divisionList[
        divisionList.findIndex(
          (divisionList_List) => divisionList_List.id == currDivisionId
        )
      ].name;
    let DistrictName =
      districtList[
        districtList.findIndex(
          (districtList_List) => districtList_List.id == currDistrictId
        )
      ].name;
    let UpazilaName =
      upazilaList[
        upazilaList.findIndex(
          (upazilaList_List) => upazilaList_List.id == currUpazilaId
        )
      ].name;
 */
    window.open(
      finalUrl +
        "?action=MembersbyPGataExport" +
        "&reportType=excel" +
        "&DivisionId=" +
        currDivisionId +
        "&DistrictId=" +
        currDistrictId +
        "&UpazilaId=" +
        currUpazilaId +
       /*  "&DivisionName=" +
        DivisionName +
        "&DistrictName=" +
        DistrictName +
        "&UpazilaName=" +
        UpazilaName + */
        "&TimeStamp=" +
        Date.now()
    );
  };
  /* =====End of Excel Export Code==== */

  const columnList = [
    { field: "rownumber", label: "SL", align: "center", width: "3%" },
    {
      field: "FarmerName",
      label: "Farmer’s Name (নাম)",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
    },

    {
      field: "FatherName",
      label: "Father’s Name (পিতার নাম)",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "17%",
    },
    {
      field: "MotherName",
      label: "Mother’s Name (মাতার নাম)",
      align: "left",
      visible: false,
      sort: true,
      filter: true,
      width: "10%",
    },
    {
      field: "HusbandWifeName",
      label: "Husband’s/Wife’s Name (স্বামীর / স্ত্রীর নাম)",
      align: "left",
      visible: false,
      sort: true,
      filter: true,
      width: "17%",
    },
    {
      field: "NameOfTheFarm",
      label: "Name of the farm (খামারের নাম)",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "15%",
    },
    {
      field: "Phone",
      label: "Mobile number (মোবাইল নং)",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "13%",
    },
    {
      field: "GenderName",
      label: "Gender (জেন্ডার)",
      align: "left",
      visible: false,
      sort: true,
      filter: true,
      width: "7%",
    },
    {
      field: "IsDisabilityStatus",
      label: "Is there any disability (প্রতিবন্ধি কিনা)",
      align: "left",
      visible: false,
      sort: true,
      filter: true,
      width: "7%",
    },
    {
      field: "NID",
      label: "NID (জাতীয় পরিচয় পত্র/ ভোটার আইডি কার্ড নম্বর)",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "14%",
    },
    {
      field: "IsPGMemberStatus",
      label:
        "Are you the member of a PG under LDDP (আপনি কি LDDP প্রকল্পের আওতাধীন কোনো পিজি'র সদস্য) ?",
      align: "left",
      visible: false,
      sort: true,
      filter: true,
      width: "12%",
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

    /* getDivision(UserInfo.DivisionId, UserInfo.DistrictId, UserInfo.UpazilaId); */
    setBFirst(false);
  }

  /**Get data for table list */
  function getDataList() {
    let params = {
      action: "getDataList",
      lan: language(),
      UserId: UserInfo.UserId,
      DivisionId: currDivisionId,
      DistrictId: currDistrictId,
      UpazilaId: currUpazilaId,
    };
    // console.log('LoginUserInfo params: ', params);
    return;
    /* ExecuteQuery(serverpage, params); */
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

       {/*  <DeleteOutline
          className={"table-delete-icon"}
          onClick={() => {
            deleteData(rowData);
          }}
        /> */}

    {/*   {!(UserInfo.RoleId[0] == 10 || UserInfo.RoleId[0] == 11) && (
            <DeleteOutline
            className={"table-delete-icon"}
            onClick={() => {
              deleteData(rowData);
            }}
          />
        )}  */}



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
      UnionId: Cookie_UnionId,
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
      MilkCow: "",
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
      ChickenSonali: "",
      ChickenEgg: "",
      DucksNumber: "",
      DucksEgg: "",
      PigeonNumber: "",
      QuailNumber: "",
      OtherAnimalNumber: "",
      FamilyMember: "",
      LandTotal: "",
      LandOwn: "",
      LandLeased: "",
      DataCollectionDate: "",
      DataCollectorName: Cookie_DataCollectorName,
      DesignationId: Cookie_DesignationId,
      PhoneNumber: Cookie_PhoneNumber,
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
    if (response !== "close") {
      getDataList();
    }
    setShowModal(false); //true=modal show, false=modal hide
    setListEditPanelToggle(true);
  }

  const deleteData = (rowData) => {
    return;
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
     
      props.openNoticeModal({
        isOpen: true,
        msg: res.data.message,
        msgtype: res.data.success,
      });
      getDataList();
    });
  }

  /* function getDivision(selectDivisionId, SelectDistrictId, selectUpazilaId) {
    let params = {
      action: "DivisionFilterList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setDivisionList(res.data.datalist);

      getDistrict(selectDivisionId, SelectDistrictId, selectUpazilaId);
    });
  }

  function getDistrict(selectDivisionId, SelectDistrictId, selectUpazilaId) {
    let params = {
      action: "DistrictFilterList",
      lan: language(),
      UserId: UserInfo.UserId,
      DivisionId: selectDivisionId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setDistrictList([{ id: "", name: "All" }].concat(res.data.datalist));

      setCurrDistrictId(SelectDistrictId);
      getUpazila(selectDivisionId, SelectDistrictId, selectUpazilaId);
    });
  }

  function getUpazila(selectDivisionId, SelectDistrictId, selectUpazilaId) {
    let params = {
      action: "UpazilaFilterList",
      lan: language(),
      UserId: UserInfo.UserId,
      DivisionId: selectDivisionId,
      DistrictId: SelectDistrictId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setUpazilaList([{ id: "", name: "All" }].concat(res.data.datalist));

      setCurrUpazilaId(selectUpazilaId);
    });
  }
 */
  const handleChange = (e) => {
    const { name, value } = e.target;
    let data = { ...currentFilter };
    data[name] = value;

    setCurrentFilter(data);

    //for dependancy
    /* if (name === "DivisionId") {
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
    } */
  };

  useEffect(() => {
    getDataList();
  }, [currDivisionId, currDistrictId, currUpazilaId]);

  const backToList = () => {
    setListEditPanelToggle(true); // true = show list and hide add/edit panel
  };



  function syncData() {
    setIsServerLoading(true);
    let currentDataList = JSON.parse(localStorage.getItem("householdlivestocksurveydataentry")) || [];
  
    if (currentDataList.length === 0) {
      props.openNoticeModal({
        isOpen: true,
        msg: "No data available to upload.",
        msgtype: 0,
      });
      setIsServerLoading(false); 
      return; 
    }


    swal({
      title: "Are you sure?",
      text: "ডাটা আপলোড করার জন্য অবশ্যই ইন্টারনেট থাকতে হবে। সারাদিন ডাটা এন্ট্রি করার পর দিন শেষে নিচের Yes বাটন চাপবেন। Yes বাটন চাপলে আপনার ডাটা আপলোড হয়ে যাবে।",
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
      dangerMode: false,
    }).then((allowAction) => {
      if (allowAction) {
        let params = {
          action: "dataSyncUpload",
          lan: language(),
          UserId: UserInfo.UserId,
          DivisionId: UserInfo.DivisionId,
          DistrictId: UserInfo.DistrictId,
          UpazilaId: UserInfo.UpazilaId,
          rowData: currentDataList,
        };
    
        apiCall.post(serverpage, { params }, apiOption()).then((res) => {
       
          props.openNoticeModal({
            isOpen: true,
            msg: res.data.message,
            msgtype: res.data.success,
          });
    
          if (res.data.success === 1) {
            
            localStorage.removeItem("householdlivestocksurveydataentry");
            dataList = JSON.parse(localStorage.getItem("householdlivestocksurveydataentry")) || [];
    
          }
          setIsServerLoading(false); 
    
    
        }); 
      }else{
        setIsServerLoading(false);
      }
    });


   



  }

  return (
    <>
      <div class="bodyContainer">
        {/* <!-- ######-----TOP HEADER-----####### --> */}
        <div class="topHeader">
          <h4>Home ❯ Admin ❯ Household Livestock Survey 2024 Data Entry</h4>

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
                <label for="DivisionId">Division (বিভাগ): </label>

                <input
                  id="DivisionName"
                  name="DivisionName"
                  type="text"
                  disabled={true}
                  value={UserInfo.DivisionName}

                  />

                {/* <select
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
                </select> */}
              </div>

              <div class="formControl-filter-data-label">
                <label for="DistrictId">District (জেলা): </label>
                  <input
                    id="DistrictName"
                    name="DistrictName"
                    type="text"
                    disabled={true}
                    value={UserInfo.DistrictName}

                    />

                {/* <select
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
                </select> */}
              </div>

              <div class="formControl-filter-data-label">
                <label for="UpazilaId">Upazila (উপজেলা): </label>
                <input
                  id="UpazilaName"
                  name="UpazilaName"
                  type="text"
                  disabled={true}
                  value={UserInfo.UpazilaName}

                  />
                {/* <select
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
                </select> */}
              </div>

              <div class="filter-button">
                <Button disabled = {isServerLoading} label={"ADD"} class={"btnAdd"} onClick={addData} />

                <Button disabled = {isServerLoading} label={"Data Upload"} class={"btnSync"} onClick={syncData} />
                {/* <Button
                  label={"Export"}
                  class={"btnPrint"}
                  onClick={PrintPDFExcelExportFunction}
                /> */}
                
              </div>
            </div>

            {/* <!-- ####---THIS CLASS IS USE FOR TABLE GRID PRODUCT INFORMATION---####s --> */}
            <div class="subContainer">
              <div className="App">
                <CustomTable
                  columns={columnList}
                  rows={dataList ? dataList : {}}
                  actioncontrol={actioncontrol}
                  /* isLoading={isLoading} */
                />
              </div>
            </div>
          </>
        )}

        {!listEditPanelToggle && (
          <>
            {/* {!currentInvoice.BPosted && ( */}
            {1 == 1 && (
              <HouseholdLivestockSurveyDataEntryAddEditModal
                masterProps={props}
                currentRow={currentRow}
                modalCallback={modalCallback}
              />
            )}
          </>
        )}
      </div>
      {/* <!-- BODY CONTAINER END --> */}
    </>
  );
};

export default HouseholdLivestockSurveyDataEntry;
