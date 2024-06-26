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

import RegularBeneficiaryEntryAddEditModal from "./FarmerDataEntryNonPGAddEditModal";
import moment from "moment";

const FarmerDataEntryNonPG = (props) => {
  const serverpage = "farmerdataentrynonpg"; // this is .php server page

  const { useState } = React;
  const [listEditPanelToggle, setListEditPanelToggle] = useState(true);
  const [bFirst, setBFirst] = useState(true);
  const [currentRow, setCurrentRow] = useState([]);
  const [showModal, setShowModal] = useState(false); //true=show modal, false=hide modal

  const { isLoading, data: dataList, error, ExecuteQuery } = ExecuteQueryHook(); //Fetch data
  const UserInfo = LoginUserInfo();
  console.log('UserInfo: ', UserInfo.RoleId[0]);

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
   /*  let finalUrl =
      EXCEL_EXPORT_URL + "report/household_livestock_survey_excel.php"; */

       //let finalUrl = EXCEL_EXPORT_URL + "report/print_pdf_excel_server.php";
     let finalUrl = EXCEL_EXPORT_URL + "report/HouseholdLiveStockSurveyViewExport_csv.php";

    let DivisionName =
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

    window.open(
      finalUrl +
        "?action=HouseholdLiveStockSurveyViewExport" +
        "&reportType=excel" +
        "&DivisionId=" +
        currDivisionId +
        "&DistrictId=" +
        currDistrictId +
        "&UpazilaId=" +
        currUpazilaId +
        "&DivisionName=" +
        DivisionName +
        "&DistrictName=" +
        DistrictName +
        "&UpazilaName=" +
        UpazilaName +
        "&TimeStamp=" +
        Date.now()
    );
  };
  /* =====End of Excel Export Code==== */

  const columnList = [
    { field: "rownumber", label: "SL", align: "center", width: 100},
    {
      field: "DivisionName",
      label: "Division (বিভাগ)",
      align: "left",
      visible: true,
      sort: true,
      width: "10%",
      filter: true,
    }, 
    {
      field: "DistrictName",
      label: "District (জেলা)",
      align: "left",
      visible: true,
      sort: true,
      width: "10%",
      filter: true,
    }, 
    {
      field: "UpazilaName",
      label: "Upazila (উপজেলা)",
      align: "left",
      visible: true,
      sort: true,
      width: "10%",
      filter: true,
    }, 
     {
      field: "UnionName",
      label: "Union (ইউনিয়ন)",
      align: "left",
      visible: true,
      sort: true,
      width: 200,
      filter: true,
    }, 
     {
      field: "Ward",
      label: "Ward (ওয়ার্ড)",
      align: "left",
      visible: true,
      sort: true,
      width: 100,
      filter: true,
    }, 
     {
      field: "Village",
      label: "Village (গ্রাম)",
      align: "left",
      visible: true,
      sort: true,
      width: 100,
      filter: true,
    }, 
    {
      field: "FarmerName",
      label: "Farmer’s Name (নাম)",
      align: "left",
      visible: true,
      sort: true,
      width: 100,
      filter: true,
    },

    {
      field: "FatherName",
      label: "Father’s Name (পিতার নাম)",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "MotherName",
      label: "Mother’s Name (মাতার নাম)",
      align: "left",
      visible: false,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "HusbandWifeName",
      label: "Husband’s/Wife’s Name (স্বামীর / স্ত্রীর নাম)",
      align: "left",
      visible: false,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "NameOfTheFarm",
      label: "Name of the farm (খামারের নাম)",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "Phone",
      label: "Mobile number (মোবাইল নং)",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "GenderName",
      label: "Gender (জেন্ডার)",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "IsDisabilityStatus",
      label: "Is there any disability (প্রতিবন্ধি কিনা)",
      align: "left",
      visible: false,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "NID",
      label: "NID (জাতীয় পরিচয় পত্র/ ভোটার আইডি কার্ড নম্বর)",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "IsPGMemberStatus",
      label:
        "Are you the member of a PG under LDDP (আপনি কি LDDP প্রকল্পের আওতাধীন কোনো পিজি'র সদস্য) ?",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "FamilyMember",
      label:
        "Number of family members (পরিবারের মোট সদস্য সংখ্যা)",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "Latitute",
      label:
        "Latitude (অক্ষাংশ)",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "Longitute",
      label:
        "Longitude (দ্রাঘিমাংশ)",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "CowNative",
      label:
        "Cow (Native)",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "CowCross",
      label:
        "Cow (Cross)",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "MilkCow",
      label:
        "এখন দুধ দিচ্ছে এমন গাভীর সংখ্যা",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "CowBullNative",
      label:
        "Bull/Castrated Bull (Native)",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "CowBullCross",
      label:
        "Bull/Castrated Bull (Cross)",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "CowCalfMaleNative",
      label:
        "Calf Male (Native)",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "CowCalfMaleCross",
      label:
        "Calf Male (Cross)",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "CowCalfFemaleNative",
      label:
        "Calf Female (Native)",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "CowCalfFemaleCross",
      label:
        "Calf Female (Cross)",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "CowMilkProductionNative",
      label:
        "Household/Farm Total (Cows) Milk Production per day (Liter) (Native)",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "CowMilkProductionCross",
      label:
        "Household/Farm Total (Cows) Milk Production per day (Liter) (Cross)",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "BuffaloAdultMale",
      label:
        "Adult Buffalo (Male)",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "BuffaloAdultFemale",
      label:
        "Adult Buffalo (Female)",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "BuffaloCalfMale",
      label:
        "Calf Buffalo (Male)",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "BuffaloCalfFemale",
      label:
        "Calf Buffalo (Female)",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "BuffaloMilkProduction",
      label:
        "Household/Farm Total (Buffalo) Milk Production per day (Liter)",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "GoatAdultMale",
      label:
        "Adult Goat (Male)",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "GoatAdultFemale",
      label:
        "Adult Goat (Female)",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "GoatCalfMale",
      label:
        "Calf Goat (Male)",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "GoatCalfFemale",
      label:
        "Calf Goat (Female)",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "SheepAdultMale",
      label:
        "Adult Sheep (Male)",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "SheepAdultFemale",
      label:
        "Adult Sheep (Female)",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "SheepCalfMale",
      label:
        "Calf Sheep (Male)",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "SheepCalfFemale",
      label:
        "Calf Sheep (Female)",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "GoatSheepMilkProduction",
      label:
        "Household/Farm Total (Goat) Milk Production per day (Liter)",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "ChickenNative",
      label:
        "Chicken (Native)",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "ChickenLayer",
      label:
        "Chicken (Layer)",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "ChickenBroiler",
      label:
        "Chicken (Broiler)",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "ChickenSonali",
      label:
        "Chicken (Sonali)",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "ChickenSonaliFayoumiCockerelOthers",
      label:
        "Chicken (Other Poultry (Fayoumi/ Cockerel/ Turkey)",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "ChickenEgg",
      label:
        "Household/Farm Total (Chicken) Daily Egg Production",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "DucksNumber",
      label:
        "Number of Ducks/Goose",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "DucksEgg",
      label:
        "Household/Farm Total (Duck) Daily Egg Production",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "PigeonNumber",
      label:
        "Number of Pigeon",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "QuailNumber",
      label:
        "Number of Quail",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "OtherAnimalNumber",
      label:
        "Number of other animals (Pig/Horse)",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "LandTotal",
      label:
        "Total cultivable land in decimal",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "LandOwn",
      label:
        "Own land for Fodder cultivation",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "LandLeased",
      label:
        "Leased land for fodder cultivation",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "UserName",
      label:
        "User Name",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "CreateTs",
      label:
        "Entry Date Time",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
   
    {
      field: "DataCollectionDate",
      label:
        "Date of Interview",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "DataCollectorName",
      label:
        "Name of Enumerator",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "DesignationName",
      label:
        "Enumerator Designation",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
    },
    {
      field: "PhoneNumber",
      label:
        "Cell No. of Enumerator ",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: 100,
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

    getDivision(UserInfo.DivisionId, UserInfo.DistrictId, UserInfo.UpazilaId);
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
    //return;
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

       

       {(UserInfo.RoleId[0] == 1) && (
            <DeleteOutline
            className={"table-delete-icon"}
            onClick={() => {
              deleteData(rowData);
            }}
          />
        )} 



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

  function getDivision(selectDivisionId, SelectDistrictId, selectUpazilaId) {
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
      setDistrictList([{ id: "", name: "Select District" }].concat(res.data.datalist));
      /* setDistrictList(res.data.datalist); */

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
      setUpazilaList([{ id: "", name: "Select Upazila" }].concat(res.data.datalist));
      /* setUpazilaList(res.data.datalist); */

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
          <h4>Home ❯ Admin ❯ Household Livestock Survey 2024 View</h4>

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
                <label for="DistrictId">District (জেলা): </label>
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
                <label for="UpazilaId">Upazila (উপজেলা): </label>
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
                {/*<Button label={"ADD"} class={"btnAdd"} onClick={addData} />*/}
                <Button
                  label={"Export"}
                  class={"btnPrint"}
                  onClick={PrintPDFExcelExportFunction}
                /> 
                
              </div>
            </div>

            {/* <!-- ####---THIS CLASS IS USE FOR TABLE GRID PRODUCT INFORMATION---####s --> */}
            <div class="subContainer">
              <div className="App CustomScroll">
                <CustomTable
                  columns={columnList}
                  rows={dataList ? dataList : {}}
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
              <RegularBeneficiaryEntryAddEditModal
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

export default FarmerDataEntryNonPG;
