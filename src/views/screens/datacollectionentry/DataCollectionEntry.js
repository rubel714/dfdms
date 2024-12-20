import React, { forwardRef, useRef, useContext, useEffect } from "react";
import swal from "sweetalert";
import { DeleteOutline, Edit, ViewList, InsertCommentTwoTone  } from "@material-ui/icons";

import { Button } from "../../../components/CustomControl/Button";
import moment from "moment";

import { Typography, TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

import CustomTable from "components/CustomTable/CustomTable";
import {
  apiCall,
  apiOption,
  LoginUserInfo,
  language,
} from "../../../actions/api";
import ExecuteQueryHook from "../../../components/hooks/ExecuteQueryHook";
import FarmerInfoModal from "./FarmerInfoModal";
import PGInfoModal from "./PGInfoModal";

const DataCollectionEntry = (props) => {
  // console.log("props.DataTypeId: ", props.DataTypeId);
  const serverpage = "datacollection"; // this is .php server page

  const { useState } = React;
  const [bFirst, setBFirst] = useState(true);

  const [entryFormTitle, setEntryFormTitle] = useState("");
  const [entryFormSubTitle, setEntryFormSubTitle] = useState("");

  const [listEditPanelToggle, setListEditPanelToggle] = useState(true); //when true then show list, when false then show add/edit
  const [pgGroupList, setPgGroupList] = useState(null);
  const [farmerList, setFarmerList] = useState(null);
  const [surveyList, setSurveyList] = useState(null);
  const [quarterList, setQuarterList] = useState(null);
  const [yearList, setYearList] = useState(null);
  const [filterYearList, setFilterYearList] = useState(null);
  const [DesignationList, setDesignationList] = useState(null);

  const [valuechainList, setValuechainList] = useState(null);
  // const [currValuechainId, setCurrValuechainId] = useState(null);

  const [currentFilter, setCurrentFilter] = useState([]); //this is for master information. It will send to sever for save
  const [currentInvoice, setCurrentInvoice] = useState([]); //this is for master information. It will send to sever for save
  const [manyDataList, setManyDataList] = useState([]); //This is for many table. It will send to sever for save

  const [currentDate, setCurrentDate] = useState(moment().format("YYYY-MM-DD"));
  const [currentYear, setCurrentYear] = useState(moment().format("YYYY"));

  let curMonthId = parseInt(moment().format("MM"));
  let defaultMonthId = 1;
  if (curMonthId <= 3) {
    defaultMonthId = 1;
  } else if (curMonthId <= 6) {
    defaultMonthId = 2;
  } else if (curMonthId <= 9) {
    defaultMonthId = 3;
  } else {
    defaultMonthId = 4;
  }
  // console.log('curMonthId: ', parseInt(curMonthId));

  const UserInfo = LoginUserInfo();
  console.log("UserInfo: ", UserInfo);

  const [currentQuarterId, setcurrentQuarterId] = useState(defaultMonthId);
  const [dataTypeId, setDataTypeId] = useState(props.DataTypeId);
  // const [SurveyId, setSurveyId] = useState(0);

  const [errorObjectMaster, setErrorObjectMaster] = useState({});
  const [errorObjectMany, setErrorObjectMany] = useState({});

  const [questionsList, setQuestionsList] = useState([]);

  const [showPGModal, setShowPGModal] = useState(false); //true=show modal, false=hide modal
  const [showFarmerModal, setShowFarmerModal] = useState(false); //true=show modal, false=hide modal
  const [showReturnCommentsModal, setShowReturnCommentsModal] = useState(false); //true=show modal, false=hide modal
  const [returnCommentsObj, setReturnCommentsObj] = useState({
    id: 0,
    statusid: 0,
    nextprev: "",
    comments: "",
  }); //true=show modal, false=hide modal

  const [landTypeList, setLandTypeList] = useState([]);

  const [currFilterYearId, setcurrFilterYearId] = useState(currentYear);
  const [currFilterQuarterId, setcurrFilterQuarterId] =
    useState(currentQuarterId);

  const [divisionList, setDivisionList] = useState(null);
  const [districtList, setDistrictList] = useState(null);
  const [upazilaList, setUpazilaList] = useState(null);

  const [currDivisionId, setCurrDivisionId] = useState(UserInfo.DivisionId);
  const [currDistrictId, setCurrDistrictId] = useState(UserInfo.DistrictId);
  const [currUpazilaId, setCurrUpazilaId] = useState(UserInfo.UpazilaId);

  // {
  //   LandTypeId: 1,
  //   LandType: "Homostead",
  // },
  // {
  //   LandTypeId: 2,
  //   LandType: "Cultivable Land",
  // },
  // {
  //   LandTypeId: 3,
  //   LandType: "Others",
  // },

  const [grassList, setGrassList] = useState([]);
  // {
  //   GrassId: 1,
  //   GrassName: "Dema",
  // },
  // {
  //   GrassId: 2,
  //   GrassName: "Gama",
  // },
  // {
  //   GrassId: 3,
  //   GrassName: "Jambu",
  // },
  // {
  //   GrassId: 4,
  //   GrassName: "Job",
  // },
  // {
  //   GrassId: 5,
  //   GrassName: "Napier",
  // },

  const [grassTypeTableRow, setGrassTypeTableRow] = useState([]);
  // {
  //   DataValueItemDetailsId: 1,
  //   DataValueItemId: 239,
  //   GrassId: 1,
  //   LandTypeId: 3,
  //   Cultivation: 100,
  //   Production: 50,
  //   Consumption: 20,
  //   Sales: 30,
  //   RowType:0
  // },
  // {
  //   DataValueItemDetailsId: 2,
  //   DataValueItemId: 239,
  //   GrassId: 1,
  //   LandTypeId: 2,
  //   Cultivation: 300,
  //   Production: 40,
  //   Consumption: 60,
  //   Sales: 10,
  //   RowType:0
  // },
  // {
  //   DataValueItemDetailsId: 3,
  //   DataValueItemId: 239,
  //   GrassId: 5,
  //   LandTypeId: 2,
  //   Cultivation: 300,
  //   Production: 40,
  //   Consumption: 60,
  //   Sales: 25,
  //   RowType:0
  // },

  let qvList = {
    DAIRY: "displaynone",
    BEEFFATTENING: "displaynone",
    BUFFALO: "displaynone",
    GOAT: "displaynone",
    SHEEP: "displaynone",
    SCAVENGINGCHICKENLOCAL: "displaynone",
    QUAIL: "displaynone",
    PIGEON: "displaynone",
    DUCK: "displaynone",
  };

  const [questionsVisibleList, setQuestionsVisibleList] = useState(qvList);

  // console.log("questionsVisibleList: ", questionsVisibleList);
  // console.log("questionsVisibleList: ", questionsVisibleList[2]);

  //   const [questionsList, setQuestionsList] = useState([
  //   {
  //     QuestionId: 1,
  //     QuestionCode: "BQ1",
  //     QuestionName: "BQ1. দলের নাম (Group name)",
  //     QuestionType: "Text",
  //     IsMandatory: 1,
  //     SortOrder: 1,
  //   },
  //   {
  //     QuestionId: 2,
  //     QuestionCode: "BQ2",
  //     QuestionName: "BQ2. দলের প্রকারঃ (Value Chain)",
  //     QuestionType: "Number",
  //     IsMandatory: 1,
  //     SortOrder: 2,
  //   },
  //   {
  //     QuestionId: 3,
  //     QuestionCode: "BQ3",
  //     QuestionName: "BQ3. দলের আই,ডিঃ ( Group identity code)",
  //     QuestionType: "Text",
  //     IsMandatory: 0,
  //     SortOrder: 3,
  //   },
  //   {
  //     QuestionId: 4,
  //     QuestionCode: "BQ4",
  //     QuestionName: "BQ4. পিজি এর সদস্য সংখ্যা (Number of PG members)",
  //     QuestionType: "Label",
  //     IsMandatory: 0,
  //     SortOrder: 4,
  //   },
  //   {
  //     QuestionId: 5,
  //     QuestionCode: "BQ4.1",
  //     QuestionName: "পুরুষ / Male",
  //     QuestionType: "Number",
  //     IsMandatory: 0,
  //     SortOrder: 5,
  //   },
  //   {
  //     QuestionId: 6,
  //     QuestionCode: "BQ4.2",
  //     QuestionName: "নারী/Female",
  //     QuestionType: "Number",
  //     IsMandatory: 0,
  //     SortOrder: 6,
  //   },
  //   {
  //     QuestionId: 7,
  //     QuestionCode: "BQ4.3",
  //     QuestionName: "ট্রান্সজেন্ডার /Transgender",
  //     QuestionType: "Number",
  //     IsMandatory: 0,
  //     SortOrder: 7,
  //   },
  //   {
  //     QuestionId: 8,
  //     QuestionCode: "BQ5",
  //     QuestionName: "BQ5. পিজি গঠনের তারিখ (Date of the PG formation)",
  //     QuestionType: "Date",
  //     IsMandatory: 0,
  //     SortOrder: 8,
  //   },
  //   {
  //     QuestionId: 9,
  //     QuestionCode: "BQ6",
  //     QuestionName: "BQ6. গ্রাম/ওয়ার্ডঃ (Village/Ward)",
  //     QuestionType: "Text",
  //     IsMandatory: 0,
  //     SortOrder: 9,
  //   },
  //   {
  //     QuestionId: 10,
  //     QuestionCode: "BQ7",
  //     QuestionName: "BQ7. ইউনিয়ন/পৌরসভাঃ (Union/ Municipality)",
  //     QuestionType: "Text",
  //     IsMandatory: 0,
  //     SortOrder: 10,
  //   },
  //   {
  //     QuestionId: 11,
  //     QuestionCode: "MQ1",
  //     QuestionName: "MQ1. পিজি কি নিবন্ধিত? (Is the PG registered)",
  //     QuestionType: "YesNO",
  //     IsMandatory: 0,
  //     SortOrder: 11,
  //   },
  //   {
  //     QuestionId: 12,
  //     QuestionCode: "MQ2",
  //     QuestionName:
  //       "MQ2. এই পিজির কি দৃশ্যমান জায়গায় সাইনবোর্ড আছে? (Does this have a signboard in a visible place?)",
  //     QuestionType: "YesNO",
  //     IsMandatory: 0,
  //     SortOrder: 12,
  //   },
  //   {
  //     QuestionId: 13,
  //     QuestionCode: "MQ3",
  //     QuestionName:
  //       "MQ3. পিজি এর কি স্থায়ী অফিস আছে? (Does this PG have a permanent office?)",
  //     QuestionType: "YesNO",
  //     IsMandatory: 0,
  //     SortOrder: 13,
  //   },
  //   {
  //     QuestionId: 14,
  //     QuestionCode: "MQ4",
  //     QuestionName:
  //       "MQ4. নিচের কোন অফিস সরঞ্জামাদি LDDP থেকে পেয়েছেন? (Which of the following main office equipment the PG have received from LDDP?)",
  //     QuestionType: "MultiOption",
  //     IsMandatory: 0,
  //     SortOrder: 14,
  //   },
  //   {
  //     QuestionId: 15,
  //     QuestionCode: "MQ4.1",
  //     QuestionName: "কম্পিউটার/ল্যাপটপ/প্রিন্টার",
  //     QuestionType: "Check",
  //     IsMandatory: 0,
  //     SortOrder: 15,
  //   },
  //   {
  //     QuestionId: 16,
  //     QuestionCode: "MQ4.2",
  //     QuestionName: "টেবিল চেয়ার",
  //     QuestionType: "Check",
  //     IsMandatory: 0,
  //     SortOrder: 16,
  //   },
  //   {
  //     QuestionId: 17,
  //     QuestionCode: "MQ4.3",
  //     QuestionName: "আলমারি/ফাইল কেবিনেট",
  //     QuestionType: "Check",
  //     IsMandatory: 0,
  //     SortOrder: 17,
  //   },
  //   {
  //     QuestionId: 16,
  //     QuestionCode: "MQ4.4",
  //     QuestionName: "অন্যান্য (উল্লেখ করুন)",
  //     QuestionType: "CheckText",
  //     IsMandatory: 0,
  //     SortOrder: 16,
  //   },
  //   {
  //     QuestionId: 17,
  //     QuestionCode: "MQ6",
  //     QuestionName:
  //       "MQ6. পিজি এর কি নির্বাহী কমিটি আছে? (Does this PG have an executive committee?)",
  //     QuestionType: "YesNo",
  //     IsMandatory: 0,
  //     SortOrder: 17,
  //   },
  //   {
  //     QuestionId: 18,
  //     QuestionCode: "MQ9",
  //     QuestionName:
  //       "MQ9. পিজি মিটিং কি নিয়মিত হয়? (Does PG meeting held on a regular basis?)",
  //     QuestionType: "YesNo",
  //     IsMandatory: 0,
  //     SortOrder: 18,
  //   },
  //   {
  //     QuestionId: 19,
  //     QuestionCode: "MQ10",
  //     QuestionName:
  //       "MQ10. সর্বশেষ মিটিং এ কতজন সদস্য উপস্থিত ছিল? (How many members attended the last meeting?)",
  //     QuestionType: "Text",
  //     IsMandatory: 0,
  //     SortOrder: 19,
  //   },
  //   {
  //     QuestionId: 20,
  //     QuestionCode: "MQ15",
  //     QuestionName:
  //       "MQ15. পিজির সদস্যদের কি সঞ্চয় পাস বই আছে? (Do the members of this PG have a savings passbook?)",
  //     QuestionType: "YesNo",
  //     IsMandatory: 0,
  //     SortOrder: 20,
  //   },
  //   {
  //     QuestionId: 21,
  //     QuestionCode: "MQ16",
  //     QuestionName:
  //       "MQ16. মাসিক সঞ্চয়ের হার কত টাকা? (What is the rate of monthly savings in taka?)",
  //     QuestionType: "Number",
  //     IsMandatory: 0,
  //     SortOrder: 21,
  //   },
  // ]);
  // console.log("questionsList: ", questionsList);

  const { isLoading, data: dataList, error, ExecuteQuery } = ExecuteQueryHook(); //Fetch data master list

  const {
    isLoading: isLoadingSingle,
    data: dataListSingle,
    error: errorSingle,
    ExecuteQuery: ExecuteQuerySingle,
  } = ExecuteQueryHook(); //Fetch data for single

  /* =====Start of Excel Export Code==== */
  const EXCEL_EXPORT_URL = process.env.REACT_APP_API_URL;

  const PrintPDFExcelExportFunction = (reportType) => {
    let finalUrl = EXCEL_EXPORT_URL + "report/datacollection_export_excel.php";

    let QuarterName =
      quarterList[
        quarterList.findIndex((list) => list.id == currFilterQuarterId)
      ].name;
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
        "?action=DataExport" +
        "&reportType=excel" +
        "&YearId=" +
        currFilterYearId +
        "&QuarterId=" +
        currFilterQuarterId +
        "&QuarterName=" +
        QuarterName +
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
        "&DataTypeId=" +
        dataTypeId +
        "&TimeStamp=" +
        Date.now()
    );
  };
  /* =====End of Excel Export Code==== */

  const newInvoice = () => {
    console.log("dataTypeId: ", dataTypeId);
    setQuestionsVisibleList(qvList);
    let currentSurveyId = 0;
    if (surveyList) {
      let currentSurveyRow = surveyList.filter((obj) => {
        if (obj.CurrentSurvey == 1) {
          return obj;
        }
      });
      console.log("currentSurvey Row: ", currentSurveyRow);

      if (currentSurveyRow.length > 0) {
        currentSurveyId = currentSurveyRow[0].id;
      }
      console.log("aa currentSurvey Id: ", currentSurveyId);
    }
    getQuestionList(currentSurveyId, 0);

    setCurrentInvoice({
      id: "",
      DivisionId: UserInfo.DivisionId,
      DistrictId: UserInfo.DistrictId,
      UpazilaId: UserInfo.UpazilaId,
      YearId: currentYear,
      QuarterId: currentQuarterId,
      DataTypeId: dataTypeId,
      SurveyId: currentSurveyId,
      ValuechainId: "",
      PGId: "",
      FarmerId: "",
      Categories: "",
      Remarks: "",
      DataCollectorName: UserInfo.UserName,
      DesignationId: UserInfo.DesignationId,
      PhoneNumber: UserInfo.Phone,
      DataCollectionDate: currentDate,
      UserId: UserInfo.UserId,
      BPosted: 0,
    });

    setCurrentFilter({
      DivisionId: UserInfo.DivisionId,
      DistrictId: UserInfo.DistrictId,
      UpazilaId: UserInfo.UpazilaId,
      YearId: currentYear,
      QuarterId: currentQuarterId,
    });

    setManyDataList([]);
  };

  // function getRandomNumber(min, max) {
  //   return Math.floor(Math.random() * (max - min + 1)) + min;
  // }

  const addGrassTypeRow = () => {
    //console.log('deleteGrassTypeRow: ', 'deleteGrassTypeRow');

    let rows = [];
    //let autoId=0;

    grassTypeTableRow.forEach((row, i) => {
      //autoId++;
      let newRow = {};

      newRow.DataValueItemDetailsId = row.DataValueItemDetailsId;
      newRow.GrassId = row.GrassId;
      newRow.LandTypeId = row.LandTypeId;
      newRow.Cultivation = row.Cultivation;
      newRow.Production = row.Production;
      newRow.Consumption = row.Consumption;
      newRow.Sales = row.Sales;
      newRow.RowType = row.RowType;
      // newRow.autoId = row.DataValueItemDetailsId;

      rows.push(newRow);
    });

    let newRow = {};
    newRow.DataValueItemDetailsId = Date.now();
    newRow.GrassId = "";
    newRow.LandTypeId = "";
    newRow.Cultivation = null;
    newRow.Production = null;
    newRow.Consumption = null;
    newRow.Sales = null;
    newRow.RowType = "new";
    // newRow.autoId = Date.now();

    rows.push(newRow);

    setGrassTypeTableRow(rows);
  };

  const changeCustomTableCellExtend = (e, field, id) => {
    console.log(e);
    const { name, value } = e.target;

    console.log("name, value, id: ", field, value, id);

    let rows = [];
    // let autoId=0;

    grassTypeTableRow.forEach((row, i) => {
      //autoId++;
      let newRow = {};

      if (row.DataValueItemDetailsId == id) {
        newRow.DataValueItemDetailsId = row.DataValueItemDetailsId;

        if (field == "GrassId") {
          newRow.GrassId = value;
        } else {
          newRow.GrassId = row.GrassId;
        }

        if (field == "LandTypeId") {
          newRow.LandTypeId = value;
        } else {
          newRow.LandTypeId = row.LandTypeId;
        }

        if (field == "Cultivation") {
          newRow.Cultivation = value;
        } else {
          newRow.Cultivation = row.Cultivation;
        }

        if (field == "Production") {
          newRow.Production = value;
        } else {
          newRow.Production = row.Production;
        }

        if (field == "Consumption") {
          newRow.Consumption = value;
        } else {
          newRow.Consumption = row.Consumption;
        }

        if (field == "Sales") {
          newRow.Sales = value;
        } else {
          newRow.Sales = row.Sales;
        }

        newRow.RowType = row.RowType;
        // newRow.autoId = row.autoId;
      } else {
        newRow.DataValueItemDetailsId = row.DataValueItemDetailsId;
        newRow.GrassId = row.GrassId;
        newRow.LandTypeId = row.LandTypeId;
        newRow.Cultivation = row.Cultivation;
        newRow.Production = row.Production;
        newRow.Consumption = row.Consumption;
        newRow.Sales = row.Sales;

        newRow.RowType = row.RowType;
        // newRow.autoId = row.autoId;
      }

      rows.push(newRow);
    });

    setGrassTypeTableRow(rows);
    console.log("rows: ", rows);
  };

  const deleteGrassTypeRow = (e, id) => {
    console.log("deleteGrassTypeRow: ", "deleteGrassTypeRow");
    // console.log(e);
    //const { name, value } = e.target;

    console.log("id: ", id);
    let rows = [];

    grassTypeTableRow.forEach((row, i) => {
      let newRow = {};

      newRow.DataValueItemDetailsId = row.DataValueItemDetailsId;
      newRow.GrassId = row.GrassId;
      newRow.LandTypeId = row.LandTypeId;
      newRow.Cultivation = row.Cultivation;
      newRow.Production = row.Production;
      newRow.Consumption = row.Consumption;
      newRow.Sales = row.Sales;

      if (row.DataValueItemDetailsId == id) {
        newRow.RowType = "delete";
      } else {
        newRow.RowType = row.RowType;
      }

      rows.push(newRow);
    });

    setGrassTypeTableRow(rows);
    console.log("rows: ", rows);
  };

  const changeComments = (e) => {
    // console.log(e);
    const { name, value } = e.target;

    let cData = { ...returnCommentsObj };
    console.log("cData: ", cData);
    cData["comments"] = value;
    console.log(" name, value: ", name, value);

    setReturnCommentsObj(cData);
    // console.log("rows: ", rows);
  };

  // Function to handle the input change
  // window.changeCustomTableCell = (value) => {
  //   changeCustomTableCellExtend(value);
  // };
  //   const htmlContent = `
  //   <input type="number" value="120" onchange="changeCustomTableCell(6)" />
  // `;

  if (bFirst) {
    if (dataTypeId === 1) {
      setEntryFormTitle("গ্রুপের তথ্য সংগ্রহ ফরম (PG data collection form)");
      setEntryFormSubTitle(
        "ত্রৈমাসিক তথ্য সংগ্রহ এবং সংরক্ষণ (Quarterly Data Collection and Storage)"
      );
    } else if (dataTypeId === 2) {
      setEntryFormTitle("খামারীর তথ্য ফরম (Farmers Data Collection Form)");
      setEntryFormSubTitle(
        "ত্রৈমাসিক তথ্য সংগ্রহ এবং সংরক্ষণ (Quarterly Data Collection and Storage)"
      );
    } else if (dataTypeId === 3) {
      setEntryFormTitle(
        "গ্ৰুপের তথ্য সংগ্রহ ফরম (Community Data Collection Form)"
      );
      setEntryFormSubTitle(
        "ত্রৈমাসিক তথ্য সংগ্রহ এবং সংরক্ষণ (Quarterly Data Collection and Storage)"
      );
    }

    /**First time call for datalist */
    newInvoice();

    // getQuestionList();
    //getPgGroupList();
    getSurveyList();
    getYearList();
    getDesignation();
    getValuechainIdList();

    getLandTypeList();
    getGrassList();

    getQuarterList();

    getDivision(UserInfo.DivisionId, UserInfo.DistrictId, UserInfo.UpazilaId);

    getDataList(); //invoice list

    setBFirst(false);
  }

  function addData() {
    newInvoice();
    setListEditPanelToggle(false); // false = hide list and show add/edit panel
  }

  // getQuestionList(rowData.SurveyId, rowData.id);
  // getDataSingleFromServer(rowData.id);
  function getQuestionList(SurveyId, DataValueMasterId) {
    console.log("getQuestionList dataTypeId: ", dataTypeId);
    console.log("getQuestionList SurveyId: ", SurveyId);
    console.log("getQuestionList DataValueMasterId: ", DataValueMasterId);

    let params = {
      action: "getQuestionList",
      lan: language(),
      UserId: UserInfo.UserId,
      DataTypeId: dataTypeId,
      SurveyId: SurveyId,
    };

    apiCall.post(serverpage, { params }, apiOption()).then((res) => {
      console.log("getQuestionList: ", res);

      setQuestionsList(res.data.datalist); /**set question list */
      console.log("getQuestionList: ", res.data.datalist);

      // getDataList(); //invoice list
      if (DataValueMasterId > 0) {
        getDataSingleFromServer(DataValueMasterId);
      }
    });
  }

  function getValuechainIdList() {
    let params = {
      action: "QuestionMapCategoryList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      console.log("res: ", res);
      setValuechainList(
        [{ id: "", name: "Select Value Chain" }].concat(res.data.datalist)
      );

      // setCurrValuechainId(null);

      // getPgGroupList(selectValuechainId);
      // getPgGroupList("");
    });
  }

  function getPgGroupList(selectValuechainId) {
    let params = {
      /* action: "PgGroupList", */
      action: "PgGroupListByValueChain",
      lan: language(),
      UserId: UserInfo.UserId,
      DivisionId: UserInfo.DivisionId,
      DistrictId: UserInfo.DistrictId,
      UpazilaId: UserInfo.UpazilaId,
      ValuechainId: selectValuechainId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      console.log("res.data.datalist: ", res.data.datalist);

      setPgGroupList(
        [{ id: "", name: "পিজি গ্রুপ নির্বাচন করুন" }].concat(res.data.datalist)
      );
    });
  }

  function getFarmerList(PGId) {
    let params = {
      action: "FarmerList",
      lan: language(),
      UserId: UserInfo.UserId,
      DivisionId: UserInfo.DivisionId,
      DistrictId: UserInfo.DistrictId,
      UpazilaId: UserInfo.UpazilaId,
      PGId: PGId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      console.log("res.data.datalist: ", res.data.datalist);

      setFarmerList(
        [{ id: "", name: "ফার্মার নির্বাচন করুন" }].concat(res.data.datalist)
      );
    });
  }

  function getSurveyList() {
    let params = {
      action: "SurveyList",
      lan: language(),
      UserId: UserInfo.UserId,
      DataTypeId: dataTypeId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setSurveyList(
        [{ id: "", name: "Select Survey" }].concat(res.data.datalist)
      );
    });
  }

  function getQuarterList() {
    let params = {
      action: "QuarterList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setQuarterList(
        [{ id: "", name: "ত্রৈমাসিক নির্বাচন করুন" }].concat(res.data.datalist)
      );
    });
  }

  function getYearList() {
    let params = {
      action: "YearList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      // console.log('res: ', res);
      setYearList(
        [{ id: "", name: "বছর নির্বাচন করুন" }].concat(res.data.datalist)
      );

      setFilterYearList(
        [{ id: "", name: "বছর নির্বাচন করুন" }].concat(res.data.datalist)
      );
    });
  }

  function getDesignation() {
    let params = {
      action: "DesignationList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setDesignationList(
        [{ id: "", name: "Select Designation" }].concat(res.data.datalist)
      );

      // setCurrDesignationId(selectDesignationId);
    });
  }

  function getGrassList() {
    let params = {
      action: "GrassList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      // console.log('res: ', res);
      setGrassList(
        [{ id: "", name: "নির্বাচন করুন" }].concat(res.data.datalist)
      );
    });
  }

  function getLandTypeList() {
    let params = {
      action: "LandTypeList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      // console.log('res: ', res);
      setLandTypeList(
        [{ id: "", name: "নির্বাচন করুন" }].concat(res.data.datalist)
      );
    });
  }

  function getDivision(selectDivisionId, SelectDistrictId, selectUpazilaId) {
    let params = {
      action: "DivisionFilterList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setDivisionList([{ id: "", name: "All" }].concat(res.data.datalist));

      //setCurrDivisionId(selectDivisionId);

      getDistrict(selectDivisionId, SelectDistrictId, selectUpazilaId);

      /* getProductGeneric(
        selectDivisionId,
        SelectProductGenericId
      ); */
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

  function getUpazila(
    selectDivisionId,
    SelectDistrictId,
    selectUpazilaId,
    selectUnionId
  ) {
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

  /**Get data for table list */
  function getDataList() {
    let params = {
      action: "getDataList",
      lan: language(),
      UserId: UserInfo.UserId,
      /*  DivisionId: UserInfo.DivisionId,
      DistrictId: UserInfo.DistrictId,
      UpazilaId: UserInfo.UpazilaId, */
      DivisionId: currDivisionId,
      DistrictId: currDistrictId,
      UpazilaId: currUpazilaId,
      DataTypeId: dataTypeId,
      YearId: currFilterYearId,
      QuarterId: currFilterQuarterId,
    };
    // console.log('LoginUserInfo params: ', params);

    ExecuteQuery(serverpage, params);
  }

  const masterColumnList = [
    { field: "rownumber", label: "সিরিয়াল", align: "center", width: "4%" },
    // { field: 'SL', label: 'SL',width:'10%',align:'center',visible:true,sort:false,filter:false },
    {
      field: "QuarterName",
      label: "তথ্য সংগ্রহ বছর-ত্রৈমাসিক",
      width: "8%",
      align: "left",
      visible: false,
      sort: true,
      filter: true,
    },
    {
      field: "FarmerName",
      label: "ফার্মার",
      // width: "13%",
      align: "left",
      visible: dataTypeId == 2 ? true : false,
      sort: true,
      filter: true,
    },
    {
      field: "SurveyTitle",
      label: "সার্ভে নাম",
      // width: "13%",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
    },
    {
      field: "DataCollectionDate",
      label: "তথ্য সংগ্রহের তারিখ",
      width: "7%",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
    },
    {
      field: "PGName",
      label: "পিজি গ্রুপ",
      align: "left",
      width: "11%",
      visible: true,
      sort: true,
      filter: true,
    },
    {
      field: "ValueChainName",
      label: "ভেলু চেইন",
      align: "left",
      width: "6%",
      visible: true,
      sort: true,
      filter: true,
    },
    {
      field: "UpazilaName",
      label: "উপজেলা",
      width: "10%",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
    },
    {
      field: "DataCollectorName",
      label: "তথ্য সংগ্রহকারীর নাম",
      width: "10%",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
    },
    {
      field: "UserName",
      label: "ডাটা এন্ট্রি",
      width: "8%",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
    },
    {
      field: "CurrentStatus",
      label: "স্টেটাস",
      width: "8%",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
    },

    {
      field: "custom",
      label: "অ্যাকশন",
      width: "11%",
      align: "center",
      visible: true,
      // sort: false,
      // filter: false,
    },
  ];

  /** Action from table row buttons*/
  function actioncontrolmaster(rowData) {
    // console.log("UserInfo", UserInfo);
    // console.log("StatusChangeAllow", UserInfo.StatusChangeAllow);
    let StatusChangeAllow = UserInfo.StatusChangeAllow;
    // let sub = StatusChangeAllow.includes("Submit");
    // console.log('sub: ', sub);

    return (
      <>
        {/* StatusId */}
 
        {(rowData.AcceptReturnComments ||
           rowData.ApproveReturnComments) && 
           (<InsertCommentTwoTone
          className={"table-comment-icon"}
          onClick={() => {
            viewCommentData(rowData);
          }}
        />
      )}
        
        {rowData.StatusId === 1 &&
          UserInfo.UserId == rowData.UserId &&
          StatusChangeAllow.includes("Submit") && (
            <button
              class={"btnSubmit"}
              onClick={() => {
                changeReportStatus(rowData.id, 2, "Next");
              }}
            >
              Submit
            </button>
          )}

        {rowData.StatusId === 2 && StatusChangeAllow.includes("Accept") && (
          <>
            <button
              class={"btnAccept"}
              onClick={() => {
                changeReportStatus(rowData.id, 3, "Next");
              }}
            >
              Accept
            </button>

            <button
              class={"btnReturn"}
              onClick={() => {
                showRetCommentsModal(rowData.id, 1, "Return");
                // changeReportStatus(rowData.id, 1, "Return");
              }}
            >
              Return
            </button>
          </>
        )}

        {rowData.StatusId === 3 && StatusChangeAllow.includes("Approve") && (
          <>
            <button
              class={"btnApprove"}
              onClick={() => {
                changeReportStatus(rowData.id, 5, "Next");
              }}
            >
              Approve
            </button>

            <button
              class={"btnReturn"}
              onClick={() => {
                showRetCommentsModal(rowData.id, 2, "Return");

                // changeReportStatus(rowData.id, 2, "Return");
              }}
            >
              Return
            </button>
          </>
        )}

        {/* {rowData.BPosted === 0 && ( */}
        {/* {rowData.StatusId === 1 && UserInfo.UserId == rowData.UserId && ( */}
        {((UserInfo.Settings.AllowEditApprovedData == "1") || (rowData.StatusId === 1 && UserInfo.UserId == rowData.UserId)) && (

          <Edit
            className={"table-edit-icon"}
            onClick={() => {
              editData(rowData);
            }}
          />
        )}

        {/* {rowData.BPosted === 0 && ( */}
        {rowData.StatusId === 1 && UserInfo.UserId == rowData.UserId && (
          <DeleteOutline
            className={"table-delete-icon"}
            onClick={() => {
              deleteData(rowData);
            }}
          />
        )}

        {/* {(rowData.StatusId != 1 || UserInfo.UserId != rowData.UserId) && ( */}
        {(rowData.StatusId != 1 || UserInfo.UserId != rowData.UserId) && (UserInfo.Settings.AllowEditApprovedData == "0") && (

          <ViewList
            className={"table-view-icon"}
            onClick={() => {
              viewData(rowData);
            }}
          />
        )}
      </>
    );
  }

  const editData = (rowData) => {
    console.log("rowData: ", rowData);
    getQuestionList(rowData.SurveyId, rowData.id);
    // getDataSingleFromServer(rowData.id);
  };

  const viewData = (rowData) => {
    console.log("rowData: ", rowData);
    getQuestionList(rowData.SurveyId, rowData.id);
    // getDataSingleFromServer(rowData.id);
  };


  const viewCommentData = (rowData) => {
    // console.log("viewCommentData rowData: ", rowData);
    //getQuestionList(rowData.SurveyId, rowData.id);
    // getDataSingleFromServer(rowData.id);
    var msg="";
    if(rowData.AcceptReturnComments){
      msg="Comments from LEO: "+rowData.AcceptReturnComments;
    }

    if(rowData.ApproveReturnComments){
      if(msg){
        msg=msg+"\n";
      }
      msg=msg+"Comments from ULO: "+rowData.ApproveReturnComments;
    }

    swal({
      title: "Comments",
      // icon: "info",
      text: msg,
      className: "comment-swal",
      buttons: {
        // confirm: {
        //   text: "Yes",
        //   value: true,
        //   visible: true,
        //   className: "",
        //   closeModal: true,
        // },
        cancel: {
          text: "Ok",
          value: null,
          visible: true,
          className: "",
          closeModal: true,
        },
      },
      dangerMode: false,
    }).then((allowAction) => {
      // if (allowAction) {
      //   changeReportStatusAPICall(params);
      //   closeRetCommentsModal("");
      // } else {
      // }
    });

  };


  const getDataSingleFromServer = (id) => {
    let params = {
      action: "getDataSingle",
      lan: language(),
      UserId: UserInfo.UserId,
      id: id,
    };

    ExecuteQuerySingle(serverpage, params);

    setListEditPanelToggle(false); // false = hide list and show add/edit panel
  };

  useEffect(() => {
    // console.log("dataListSingle: ", dataListSingle);

    if (dataListSingle.master) {
      console.log("dataListSingle master: ", dataListSingle.master[0]);

      //DataTypeId
      let qvListFromMaster = dataListSingle.master[0].Categories;
      console.log("qvList: ", qvList);

      let qvListTmp = { ...qvList };
      if (qvListFromMaster) {
        let qvListDBArr = qvListFromMaster.split(",");
        qvListDBArr.forEach((element) => {
          qvListTmp[element] = "";
        });
      }
      setQuestionsVisibleList(qvListTmp);
      console.log("qvListTmp: ", qvListTmp);

      // getFarmerList(dataListSingle.master[0].PGId);
      getPgGroupList(dataListSingle.master[0].ValuechainId);
      getFarmerList(dataListSingle.master[0].PGId);

      setCurrentInvoice(dataListSingle.master[0]);
    }

    if (dataListSingle.items) {
      setManyDataList(dataListSingle.items);
      console.log("dataListSingle items: ", dataListSingle.items);
      // console.log('dataListSingle: ', dataListSingle.items[0]);
    }

    if (dataListSingle.itemsdetails) {
      setGrassTypeTableRow(dataListSingle.itemsdetails);
      console.log("dataListSingle itemsdetails: ", dataListSingle.itemsdetails);
      // console.log('dataListSingle: ', dataListSingle.items[0]);
    }
  }, [dataListSingle]);

  const backToList = () => {
    setListEditPanelToggle(true); // true = show list and hide add/edit panel
    getDataList(); //invoice list
    setGrassTypeTableRow([]);
  };

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

    apiCall.post(serverpage, { params }, apiOption()).then((res) => {
      // console.log('res: ', res);
      props.openNoticeModal({
        isOpen: true,
        msg: res.data.message,
        msgtype: res.data.success,
      });
      getDataList();
    });
  }

  const handleChangeMaster = (e) => {
    // console.log("e: ", e);

    const { name, value } = e.target;
    // console.log("name, value: ", name, value);
    let data = { ...currentInvoice };
    // data["Questions"][name] = value;
    data[name] = value;
    setCurrentInvoice(data);
    console.log("data currentInvoice: ", data);
    // const [currentInvoice, setCurrentInvoice] = useState([]); //this is for master information. It will send to sever for save

    setErrorObjectMaster({ ...errorObjectMaster, [name]: null });
  };
  const divStyle = {
    color: "blue",
  };
  function handleChangeCheckMaster(e) {
    // console.log('e.target.checked: ', e.target.checked);
    const { name, value } = e.target;

    let data = { ...currentInvoice };
    // data[name] = e.target.checked;
    // console.log('e.target.checked: ', e.target.checked);

    // data[name] = e.target.checked;
    data[name] = e.target.checked;
    // data["Questions"][name] = e.target.checked;

    setCurrentInvoice(data);
    console.log("data: ", data);
  }

  const changeVisibilityCheck = (e) => {
    const { name, value } = e.target;
    let chkVal = e.target.checked;
    console.log("changeVisibilityCheck name: ", name);
    console.log("changeVisibilityCheck chkVal: ", chkVal);
    let data = { ...currentInvoice };

    let qList = { ...questionsVisibleList };

    let CategoriesList = [];
    if (data["Categories"]) {
      CategoriesList = data["Categories"].split(",");
    }
    // console.log('CategoriesList: ', CategoriesList);

    if (chkVal) {
      qList[name] = "";

      CategoriesList.push(name);
    } else {
      qList[name] = "displaynone";

      let list = [];
      CategoriesList.forEach((element) => {
        if (element != name) {
          list.push(element);
        }
      });
      CategoriesList = list;
    }

    data["Categories"] = CategoriesList.toString();
    setCurrentInvoice(data);
    console.log("data: ", data);

    // const { name, value } = e.target;
    // console.log("name, value: ", name, value);
    // let data = { ...currentInvoice };
    // data["Questions"][name] = value;
    // data[name] = value;
    // setCurrentInvoice(data);
    // console.log("data currentInvoice: ", data);
    // const [currentInvoice, setCurrentInvoice] = useState([]); //this is for master information. It will send to sever for save

    // setCurrentInvoice({
    //   id: "",
    //   DivisionId: UserInfo.DivisionId,
    //   DistrictId: UserInfo.DistrictId,
    //   UpazilaId: UserInfo.UpazilaId,
    //   YearId: currentYear,
    //   QuarterId: currentQuarterId,
    //   DataTypeId: dataTypeId,
    //   PGId: "",
    //   FarmerId: "",
    //   Categories: "",
    //   Remarks: "",
    //   DataCollectorName: "",
    //   DataCollectionDate: currentDate,
    //   UserId: UserInfo.UserId,
    //   BPosted: 0,
    // });
    // if(name == "DAIRY"){
    //   if(chkVal){
    //     qList["DAIRY"] = "";
    //   }else{
    //     qList["DAIRY"] = "displaynone";
    //   }
    // }
    // else if(name == "CHICKEN"){
    //   if(chkVal){
    //     qList["CHICKEN"] = "";
    //   }else{
    //     qList["CHICKEN"] = "displaynone";
    //   }
    // }
    // else if(name == "DUCK"){
    //   if(chkVal){
    //     qList["DUCK"] = "";
    //   }else{
    //     qList["DUCK"] = "displaynone";
    //   }
    // }

    // let qSingle = qList[0];
    // qSingle.QuestionName = "This is updated name";
    // console.log('qSingle: ', qSingle);
    // console.log('qSingle: ', qSingle.QuestionName);
    // qList[2] = false;
    console.log("qList after: ", qList);

    setQuestionsVisibleList(qList);

    // let qList = { ...questionsList };
    // let qSingle = qList[0];
    // qSingle.QuestionName = "This is updated name";
    // console.log('qSingle: ', qSingle);
    // console.log('qSingle: ', qSingle.QuestionName);
    // qList[0] = qSingle;
    // console.log('qList after: ', qList);

    // setQuestionsList(qList);

    // const [questionsVisibleList, setQuestionsVisibleList] = useState({2:1,32:1,24:1,10:1});
  };

  const handleChangeChoosenMaster = (name, value) => {
    console.log("name: ", name);
    console.log("value: ", value);
    let data = { ...currentInvoice };
    data[name] = value;

    setErrorObjectMaster({ ...errorObjectMaster, [name]: null });

    if (name === "ValuechainId") {
      data["PGId"] = "";
      data["FarmerId"] = "";

      getPgGroupList(value);
    }

    if (name == "PGId" && dataTypeId === 2) {
      /**when change PG from combo and data collection for farmer then fillup Farmar List */
      data["FarmerId"] = "";
      getFarmerList(value);
    }

    if (name == "FarmerId" && dataTypeId === 2) {
      /**when change Farmer then auto select Value chain Checkbox */

      console.log("farmerList: ", farmerList);
      let fInfo = farmerList.filter((row) => {
        if (row.id == value) {
          return row;
        }
      });
      console.log("fInfo: ", fInfo[0].ValuechainId);
      if (fInfo[0].ValuechainId) {
        let name = fInfo[0].ValuechainId;
        let chkVal = true;

        let qList = { ...qvList };
        let CategoriesList = [];

        if (chkVal) {
          qList[name] = "";

          CategoriesList.push(name);
        }

        data["Categories"] = CategoriesList.toString();
        console.log("data: ", data);
        console.log("qList after: ", qList);

        setQuestionsVisibleList(qList);
      }
    }

    setCurrentInvoice(data);
  };

  const [chosenValuesYearId, setChosenValuesYear] = useState({
    YearId: { id: currentYear, name: currFilterYearId },
  });

  const handleChangeChoosenMasterYear = (name, valueobj, value) => {
    let chosenValuesDataYear = { ...chosenValuesYearId };
    chosenValuesDataYear[name] = valueobj;
    setChosenValuesYear(chosenValuesDataYear);
    setcurrFilterYearId(value);
    getDataList();
  };

  const handleChangeChoosenMasterQuarter = (name, value) => {
    let data = { ...currentFilter };
    data[name] = value;

    setCurrentFilter(data);
    setcurrFilterQuarterId(value);
  };

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
  }, [
    currDivisionId,
    currDistrictId,
    currUpazilaId,
    currFilterYearId,
    currFilterQuarterId,
  ]);

  const handleChangeMany = (e, cType = "") => {
    // console.log("cType: ", cType);
    // console.log("e: ", e);

    const { name, value } = e.target;
    // console.log("name, value: ", name, value);
    let data = { ...manyDataList };
    // data["Questions"][name] = value;
    if (cType === "CheckText" && value === "") {
      data[name] = true;
    } else {
      data[name] = value;
    }

    setManyDataList(data);
    // console.log("data manyDataList: ", data);

    setErrorObjectMany({ ...errorObjectMany, [name]: null });
  };

  function handleChangeCheckMany(e) {
    // console.log('e.target.checked: ', e.target.checked);
    const { name, value } = e.target;
    // console.log("name: ", name);
    // console.log("value: ", value);

    let data = { ...manyDataList };
    // data[name] = e.target.checked;
    // console.log('e.target.checked: ', e.target.checked);

    // data[name] = e.target.checked;
    data[name] = e.target.checked;
    // data["Questions"][name] = e.target.checked;

    setManyDataList(data);
    // console.log("data manyDataList: ", data);
  }

  function handleChangeRadioMany(e, qName, questionParentId) {
    // console.log('e.target.checked: ', e.target.checked);
    // const { name, value } = e.target;
    // console.log('name: ', qName);
    // console.log('value: ', value);

    let data = { ...manyDataList };

    // console.log('questionsList: ', questionsList);

    // data[name] = e.target.checked;
    // console.log('e.target.checked: ', e.target.checked);

    /**First false all option under this parent */
    questionsList.map((question) => {
      if (question.QuestionParentId === questionParentId) {
        data[question.QuestionCode] = false;
      }
    });

    // data[name] = e.target.checked;
    data[qName] = e.target.checked; //set true only this option under this parent.

    setManyDataList(data);
    // console.log("data manyDataList: ", data);
  }

  const handleChangeChoosenMany = (name, value) => {
    let data = { ...manyDataList };
    data[name] = value;

    setManyDataList(data);
    // console.log("data manyDataList: ", data);

    setErrorObjectMany({ ...errorObjectMany, [name]: null });
  };

  const validateFormMaster = () => {
    let validateFields = [
      "SurveyId",
      "YearId",
      "QuarterId",
      "ValuechainId",
      "PGId",
      "DataCollectorName",
      "DataCollectionDate",
      "DesignationId",
      "PhoneNumber",
    ];
    let errorData = {};
    let isValid = true;
    validateFields.map((field) => {
      if (!currentInvoice[field]) {
        errorData[field] = "validation-style";
        isValid = false;
      }
    });
    setErrorObjectMaster(errorData);
    return isValid;
  };

  const validateFormMany = () => {
    let validateFields = [];
    questionsList.map((question) => {
      if (question.IsMandatory) {
        validateFields.push(question.QuestionCode);
      }
    });

    // console.log("validateFields: ", validateFields);

    let errorData = {};
    let isValid = true;
    validateFields.map((field) => {
      if (!manyDataList[field]) {
        errorData[field] = "validation-style";
        isValid = false;
      }
    });
    setErrorObjectMany(errorData);
    // console.log("errorData: ", errorData);
    return isValid;
  };

  const validateFormManyValueRange = () => {
    // let errorData = {};
    let isValid = 1;

    // let validateFields = [];
    // let validateFieldsForRange = [];
    questionsList.map((question) => {
      if (
        isValid == 1 &&
        question.QuestionType == "Number" &&
        (question.RangeStart != null || question.RangeEnd != null)
      ) {
        // validateFieldsForRange.push(question.QuestionCode);
        if (manyDataList[question.QuestionCode]) {
          if (question.RangeStart != null) {
            if (manyDataList[question.QuestionCode] < question.RangeStart) {
              //errorData[question.QuestionCode] = "validation-style";
              isValid =
                question.QuestionName +
                " value range " +
                question.RangeStart +
                " to " +
                question.RangeEnd;
            }
          }

          if (question.RangeEnd != null) {
            if (manyDataList[question.QuestionCode] > question.RangeEnd) {
              // errorData[question.QuestionCode] = "validation-style";
              isValid =
                question.QuestionName +
                " value range " +
                question.RangeStart +
                " to " +
                question.RangeEnd;
            }
          }

          if (question.QuestionParentId > 0) {
            questionsList.map((obj) => {
              // console.log('obj: ', obj);
              // console.log('obj: ', obj.QuestionId);
              if (question.QuestionParentId == obj.QuestionId) {
                isValid = obj.QuestionName + " " + isValid;
              }
              // if (!manyDataList[field]) {
              //   errorData[field] = "validation-style";
              //   isValid = false;
              // }
            });
          }
        }
      }
    });

    // console.log("validateFields: ", validateFields);

    // validateFields.map((field) => {
    //   if (!manyDataList[field]) {
    //     errorData[field] = "validation-style";
    //     isValid = false;
    //   }
    // });
    //setErrorObjectMany(errorData);
    // console.log("errorData: ", errorData);
    return isValid;
  };

  // const postInvoice = () => {
  //   swal({
  //     title: "Are you sure?",
  //     text: "Do you really want to post the stock?",
  //     icon: "warning",
  //     buttons: {
  //       confirm: {
  //         text: "Yes",
  //         value: true,
  //         visible: true,
  //         className: "",
  //         closeModal: true,
  //       },
  //       cancel: {
  //         text: "No",
  //         value: null,
  //         visible: true,
  //         className: "",
  //         closeModal: true,
  //       },
  //     },
  //     dangerMode: true,
  //   }).then((allowAction) => {
  //     if (allowAction) {
  //       let cInvoiceMaster = { ...currentInvoice };
  //       cInvoiceMaster["BPosted"] = 1;

  //       let params = {
  //         action: "dataAddEdit",
  //         lan: language(),
  //         UserId: UserInfo.UserId,
  //         InvoiceMaster: cInvoiceMaster,
  //       };

  //       addEditAPICall(params);
  //     } else {
  //     }
  //   });
  // };

  function showPGDetails(p) {
    setShowPGModal(true);
  }
  function closePGModal(p) {
    setShowPGModal(false);
  }

  function showFarmerDetails(p) {
    setShowFarmerModal(true);
  }
  function closeFarmerModal(p) {
    setShowFarmerModal(false);
  }

  function showRetCommentsModal(id, statusid, nextprev) {
    // rowData.id, 1, "Return"

    let cData = { ...returnCommentsObj };
    cData["id"] = id;
    cData["statusid"] = statusid;
    cData["nextprev"] = nextprev;
    cData["comments"] = "";
    setReturnCommentsObj(cData);

    setShowReturnCommentsModal(true);
  }

  function commentsAndReturnSave() {
    // console.log("returnCommentsObj: ", returnCommentsObj);

    if (returnCommentsObj.comments != "") {
      changeReportStatus(
        returnCommentsObj.id,
        returnCommentsObj.statusid,
        returnCommentsObj.nextprev
      );
    } else {
      props.openNoticeModal({
        isOpen: true,
        msg: "Please enter return comments.",
        msgtype: 0,
      });
    }
  }

  function closeRetCommentsModal(p) {
    setShowReturnCommentsModal(false);
  }

  function saveData(p) {
    let params = {
      action: "dataAddEdit",
      lan: language(),
      UserId: UserInfo.UserId,
      InvoiceMaster: currentInvoice,
      InvoiceItems: manyDataList,
      InvoiceItemsDetails: grassTypeTableRow,
    };
    console.log("params: ", params);

    addEditAPICall(params);
  }

  function addEditAPICall(params) {
    let validMaster = validateFormMaster();
    let validMany = validateFormMany();
    let validManyValueRange = validateFormManyValueRange();
    if (validMaster && validMany) {
      if (validManyValueRange == 1) {
        apiCall.post(serverpage, { params }, apiOption()).then((res) => {
          console.log("res: ", res);

          props.openNoticeModal({
            isOpen: true,
            msg: res.data.message,
            msgtype: res.data.success,
          });
          // console.log('res.success: ', res.success);

          if (res.data.success) {
            console.log("currentInvoice: ", currentInvoice);
            if (currentInvoice.id === "") {
              //New
              getDataSingleFromServer(res.data.id);
            } else {
              //Edit
              getDataSingleFromServer(currentInvoice.id);
            }
          }
        });
      } else {
        props.openNoticeModal({
          isOpen: true,
          msg: validManyValueRange,
          msgtype: 0,
        });
      }
    } else {
      props.openNoticeModal({
        isOpen: true,
        msg: "Please enter required fields.",
        msgtype: 0,
      });
    }
  }

  function changeReportStatus(Id, StatusId, StatusNextPrev) {
    let params = {
      action: "changeReportStatus",
      lan: language(),
      UserId: UserInfo.UserId,
      Id: Id,
      StatusId: StatusId,
      StatusNextPrev: StatusNextPrev,
      ReturnComments: returnCommentsObj.comments,
    };

    let msg = "";

    if (StatusNextPrev == "Next") {
      if (StatusId == 2) {
        msg = "You want to submit!";
      } else if (StatusId == 3) {
        msg = "You want to accept!";
      } else if (StatusId == 5) {
        msg = "You want to approve!";
      }
    } else {
      msg = "You want to return!";
    }

    swal({
      title: "Are you sure?",
      text: msg,
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
        changeReportStatusAPICall(params);
        closeRetCommentsModal("");
      } else {
      }
    });
  }

  function changeReportStatusAPICall(params) {
    apiCall.post(serverpage, { params }, apiOption()).then((res) => {
      // console.log('res: ', res);

      if (res.data.success) {
        props.openNoticeModal({
          isOpen: true,
          msg: res.data.message,
          msgtype: res.data.success,
        });
        // console.log(11111111);
        getDataList(); //invoice list
      } else {
        // console.log(222222);
        props.openNoticeModal({
          isOpen: true,
          msg: res.data.message,
          msgtype: res.data.success,
        });
      }
    });
    // } else {
    //   props.openNoticeModal({
    //     isOpen: true,
    //     msg: "Please enter required fields.",
    //     msgtype: 0,
    //   });
    // }
  }

  function submitAllReports() {
    changeReportStatusAll(2, "Next");
  }
  function acceptAllReports() {
    changeReportStatusAll(3, "Next");
  }
  function approveAllReports() {
    changeReportStatusAll(5, "Next");
  }

  function changeReportStatusAll(StatusId, StatusNextPrev) {
    let params = {
      action: "changeReportStatusAll",
      lan: language(),
      UserId: UserInfo.UserId,
      // Id: Id,
      StatusId: StatusId,
      StatusNextPrev: StatusNextPrev,
      ReturnComments: StatusId,
      DivisionId: currDivisionId,
      DistrictId: currDistrictId,
      UpazilaId: currUpazilaId,
      DataTypeId: dataTypeId,
      YearId: currFilterYearId,
      QuarterId: currFilterQuarterId,
    };

    let msg = "";

    if (StatusNextPrev == "Next") {
      if (StatusId == 2) {
        msg = "You want to submit your all pending reports!";
      } else if (StatusId == 3) {
        msg = "You want to accept all pending reports!";
      } else if (StatusId == 5) {
        msg = "You want to approve all pending reports!";
      }
    } else {
      msg = "You want to return all reports!";
    }

    swal({
      title: "Are you sure?",
      text: msg,
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
        changeReportStatusAllAPICall(params);
      }
    });
  }

  function changeReportStatusAllAPICall(params) {
    apiCall.post(serverpage, { params }, apiOption()).then((res) => {
      // console.log('res: ', res);

      if (res.data.success) {
        props.openNoticeModal({
          isOpen: true,
          msg: res.data.message,
          msgtype: res.data.success,
        });
        // console.log(11111111);
        getDataList(); //invoice list
      } else {
        // console.log(222222);
        props.openNoticeModal({
          isOpen: true,
          msg: res.data.message,
          msgtype: res.data.success,
        });
      }
    });
    // } else {
    //   props.openNoticeModal({
    //     isOpen: true,
    //     msg: "Please enter required fields.",
    //     msgtype: 0,
    //   });
    // }
  }

  return (
    <>
      <div class="bodyContainer">
        <div class="topHeader">
          {dataTypeId === 1 && (
            <h4>
              Home ❯ Data Collection ❯ গ্রুপের তথ্য সংগ্রহ (PG data collection)
            </h4>
          )}

          {dataTypeId === 2 && (
            <h4>
              Home ❯ Data Collection ❯ খামারীর তথ্য (Farmers Data Collection)
            </h4>
          )}

          {dataTypeId === 3 && (
            <h4>
              Home ❯ Data Collection ❯ এলজিডি তথ্য (Community Data Collection)
            </h4>
          )}

          {!listEditPanelToggle ? (
            <>
              <Button
                label={"ফেরত যান (Back To List)"}
                class={"btnClose"}
                onClick={backToList}
              />
            </>
          ) : (
            <></>
          )}
        </div>

        {showPGModal && (
          <PGInfoModal
            currentInvoice={currentInvoice}
            modalCallback={closePGModal}
          />
        )}
        {showFarmerModal && (
          <FarmerInfoModal
            currentInvoice={currentInvoice}
            modalCallback={closeFarmerModal}
          />
        )}

        {showReturnCommentsModal && (
          <>
            {/* <!-- GROUP MODAL START --> */}
            <div id="groupModal" class="modal">
              {/* <!-- Modal content --> */}
              <div class="modal-content-sm">
                <div class="modalHeader">
                  <h4>Enter Comments</h4>
                </div>

                <div class="pgmodalBody-sm pt-10">
                  <label>Comments:</label>
                  <input
                    type="text"
                    id={"ReturnComments"}
                    name={"ReturnComments"}
                    value={returnCommentsObj.comments || ""}
                    onChange={(e) => changeComments(e)}
                  />
                </div>

                <div class="modalItem-sm modalItem">
                  <Button
                    label={"Close"}
                    class={"btnClose"}
                    onClick={closeRetCommentsModal}
                  />
                  <Button
                    label={"Return"}
                    class={"btnSave"}
                    onClick={commentsAndReturnSave}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {listEditPanelToggle && (
          <>
            {/* <!-- TABLE SEARCH AND GROUP ADD --> */}
            <div class="searchAdd">
              {/* <input type="text" placeholder="Search Product Group"/> */}
              <div class="formControl-filter-data">
                <label>তথ্য সংগ্রহ বছর (Year):</label>
                <Autocomplete
                  autoHighlight
                  // freeSolo
                  className="chosen_dropdown"
                  id="YearId"
                  name="YearId"
                  autoComplete
                  //class={errorObjectMaster.YearId}
                  options={filterYearList ? filterYearList : []}
                  getOptionLabel={(option) => option.name}
                  value={chosenValuesYearId["YearId"]}
                  /*  onChange={(event, valueobj) =>
                      handleChangeChoosenMasterYear(
                        "YearId",
                        valueobj ? valueobj.id : ""
                      )
                      } */
                  onChange={(event, valueobj) =>
                    handleChangeChoosenMasterYear(
                      "YearId",
                      valueobj,
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

              <div class="formControl-filter-data ">
                <label>তথ্য সংগ্রহ ত্রৈমাসিক (Quarter):</label>
                <Autocomplete
                  autoHighlight
                  // freeSolo
                  className="chosen_dropdown"
                  id="QuarterId"
                  name="QuarterId"
                  autoComplete
                  //class={errorObjectMaster.QuarterId}
                  options={quarterList ? quarterList : []}
                  getOptionLabel={(option) => option.name}
                  // value={selectedSupplier}
                  /*value={
                  quarterList
                    ? quarterList[
                      quarterList.findIndex(
                      (list) => list.id == currentInvoice.QuarterId
                      )
                    ]
                    : null
                  }*/

                  value={
                    quarterList
                      ? quarterList[
                          quarterList.findIndex(
                            (list) => list.id == currentFilter.QuarterId
                          )
                        ]
                      : null
                  }
                  //value={chosenValuesQuarterId['QuarterId']}

                  //onChange={(event, valueobj) => handleChangeChoosenMasterQuarter('QuarterId', valueobj, valueobj?valueobj.id:"")}
                  onChange={(event, valueobj) =>
                    handleChangeChoosenMasterQuarter(
                      "QuarterId",
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

              <div class="formControl-filter-data-label">
                <label>Division: </label>
                <select
                  className="dropdown_filter"
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
                <label>District: </label>
                <select
                  className="dropdown_filter"
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
                <label>Upazila: </label>
                <select
                  id="UpazilaId"
                  name="UpazilaId"
                  className="dropdown_filter"
                  value={currUpazilaId}
                  onChange={(e) => handleChange(e)}
                >
                  {upazilaList &&
                    upazilaList.map((item, index) => {
                      return <option value={item.id}>{item.name}</option>;
                    })}
                </select>
              </div>

              {/* console.log("StatusChangeAllow", UserInfo.StatusChangeAllow);
    let StatusChangeAllow = UserInfo.StatusChangeAllow;
    // let sub = StatusChangeAllow.includes("Submit");
    // console.log('sub: ', sub);
    {rowData.StatusId === 1 && StatusChangeAllow.includes("Submit") && ( */}

              {UserInfo.StatusChangeAllow.includes("Submit") && (
                <Button
                  label={"Submit All"}
                  class={"btnPrint"}
                  onClick={submitAllReports}
                />
              )}
              {UserInfo.StatusChangeAllow.includes("Accept") && (
                <Button
                  label={"Accept All"}
                  class={"btnPrint"}
                  onClick={acceptAllReports}
                />
              )}
              {UserInfo.StatusChangeAllow.includes("Approve") && (
                <Button
                  label={"Approve All"}
                  class={"btnClose"}
                  onClick={approveAllReports}
                />
              )}

              {UserInfo.StatusChangeAllow.includes("Submit") && (
                <Button
                  label={"Enter Data"}
                  class={"btnAdd"}
                  onClick={addData}
                />
              )}

              <Button
                label={"Export"}
                class={"btnPrint"}
                onClick={PrintPDFExcelExportFunction}
              />
            </div>

            {/* <!-- ####---Master invoice list---####s --> */}
            <div class="subContainer">
              <div className="App">
                <CustomTable
                  columns={masterColumnList}
                  rows={dataList ? dataList : {}}
                  actioncontrol={actioncontrolmaster}
                  ispagination={false}
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
              <div class="subContainer inputArea">
                <div class="text-center">
                  <h2>{entryFormTitle}</h2>
                  {/* <h2>গ্রুপের তথ্য সংগ্রহ ফরম (PG data collection form)</h2> */}
                </div>

                <div
                  class="input-areaPartition grid-container"
                  id="areaPartion-x"
                >
                  <div class="marginBottom text-center">
                    <h4>{entryFormSubTitle}</h4>
                    {/* <h4>
                      ত্রৈমাসিক তথ্য সংগ্রহ এবং সংরক্ষণ (Quarterly Data
                      Collection and Storage)
                    </h4> */}
                  </div>

                  <div class="formControl">
                    <label>সার্ভে নাম (Survey Title):</label>
                    <Autocomplete
                      autoHighlight
                      // freeSolo
                      className="chosen_dropdown"
                      id="SurveyId"
                      name="SurveyId"
                      autoComplete
                      disabled={true}
                      class={errorObjectMaster.SurveyId}
                      options={surveyList ? surveyList : []}
                      getOptionLabel={(option) => option.name}
                      // value={selectedSupplier}
                      value={
                        surveyList
                          ? surveyList[
                              surveyList.findIndex(
                                (list) => list.id == currentInvoice.SurveyId
                              )
                            ]
                          : null
                      }
                      onChange={(event, valueobj) =>
                        handleChangeChoosenMaster(
                          "SurveyId",
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

                  <div class="formControl">
                    <label>তথ্য সংগ্রহ বছর (Year):</label>
                    <Autocomplete
                      autoHighlight
                      // freeSolo
                      className="chosen_dropdown"
                      id="YearId"
                      name="YearId"
                      autoComplete
                      class={errorObjectMaster.YearId}
                      options={yearList ? yearList : []}
                      getOptionLabel={(option) => option.name}
                      // value={selectedSupplier}
                      value={
                        yearList
                          ? yearList[
                              yearList.findIndex(
                                (list) => list.id == currentInvoice.YearId
                              )
                            ]
                          : null
                      }
                      onChange={(event, valueobj) =>
                        handleChangeChoosenMaster(
                          "YearId",
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

                  <div class="formControl">
                    <label>তথ্য সংগ্রহ ত্রৈমাসিক (Quarter):</label>
                    <Autocomplete
                      autoHighlight
                      // freeSolo
                      className="chosen_dropdown"
                      id="QuarterId"
                      name="QuarterId"
                      autoComplete
                      class={errorObjectMaster.QuarterId}
                      options={quarterList ? quarterList : []}
                      getOptionLabel={(option) => option.name}
                      // value={selectedSupplier}
                      value={
                        quarterList
                          ? quarterList[
                              quarterList.findIndex(
                                (list) => list.id == currentInvoice.QuarterId
                              )
                            ]
                          : null
                      }
                      onChange={(event, valueobj) =>
                        handleChangeChoosenMaster(
                          "QuarterId",
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
                  {/* 
                  <div class="formControl">
                    <label>ভেলু চেইন️ (Value Chain):</label>
                    <select
                      id="ValuechainId"
                      name="ValuechainId"
                      class={errorObjectMaster.ValuechainId}
                      value={currValuechainId}
                      onChange={(e) => handleChangeMaster(e)}
                    >
                      {valuechainList &&
                        valuechainList.map((item, index) => {
                          return <option value={item.id}>{item.name}</option>;
                        })}
                    </select>
                  </div> */}

                  <div class="formControl">
                    <label>ভেলু চেইন️ (Value Chain):</label>
                    <Autocomplete
                      autoHighlight
                      // freeSolo
                      className="chosen_dropdown"
                      id="ValuechainId"
                      name="ValuechainId"
                      autoComplete
                      class={errorObjectMaster.ValuechainId}
                      options={valuechainList ? valuechainList : []}
                      getOptionLabel={(option) => option.name}
                      // value={selectedSupplier}
                      value={
                        valuechainList
                          ? valuechainList[
                              valuechainList.findIndex(
                                (list) => list.id == currentInvoice.ValuechainId
                              )
                            ]
                          : null
                      }
                      onChange={(event, valueobj) =>
                        handleChangeChoosenMaster(
                          "ValuechainId",
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

                  <div class="formControl">
                    <label>পিজি গ্রুপ (PG Group):</label>
                    <div className="autocompleteContainer">
                      <Autocomplete
                        autoHighlight
                        // freeSolo
                        className="chosen_dropdown specificAutocomplete"
                        id="PGId"
                        name="PGId"
                        autoComplete
                        class={errorObjectMaster.PGId}
                        options={pgGroupList ? pgGroupList : []}
                        getOptionLabel={(option) => option.name}
                        // value={selectedSupplier}
                        value={
                          pgGroupList
                            ? pgGroupList[
                                pgGroupList.findIndex(
                                  (list) => list.id == currentInvoice.PGId
                                )
                              ]
                            : null
                        }
                        onChange={(event, valueobj) =>
                          handleChangeChoosenMaster(
                            "PGId",
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
                      <Button
                        label={"Details"}
                        class={"btnDetails"}
                        onClick={showPGDetails}
                      />
                    </div>
                  </div>
                  {/* 
                  <div className="formControl">
                        <label>ফার্মার (Farmer):</label>
                        <div className="autocompleteContainer">
                          <Autocomplete
                            autoHighlight
                            className="chosen_dropdown specificAutocomplete"
                            id="FarmerId"
                            name="FarmerId"
                            autoComplete
                            options={farmerList ? farmerList : []}
                            getOptionLabel={(option) => option.name}
                            value={
                              farmerList
                                ? farmerList[
                                    farmerList.findIndex(
                                      (list) =>
                                        list.id == currentInvoice.FarmerId
                                    )
                                  ]
                                : null
                            }
                            onChange={(event, valueobj) =>
                              handleChangeChoosenMaster(
                                "FarmerId",
                                valueobj ? valueobj.id : ""
                              )
                            }
                            renderOption={(option) => (
                              <Typography className="chosen_dropdown_font">
                                {option.name}
                              </Typography>
                            )}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="standard"
                                fullWidth
                              />
                            )}
                          />

                          <Button
                            label={"Details"}
                            class={"btnDetails"}
                            onClick={showFarmerDetails}
                          />
                        </div>
                      </div> */}

                  {dataTypeId == 2 && (
                    <>
                      {/*  <div class="formControl">
                    <label>ফার্মার (Farmer):</label>
                    <Autocomplete
                      autoHighlight
                      // freeSolo
                      className="chosen_dropdown"
                      id="FarmerId"
                      name="FarmerId"
                      autoComplete
                      // class={errorObjectMaster.FarmerId}
                      options={farmerList ? farmerList : []}
                      getOptionLabel={(option) => option.name}
                      // value={selectedSupplier}
                      value={
                        farmerList
                          ? farmerList[
                              farmerList.findIndex(
                                (list) => list.id == currentInvoice.FarmerId
                              )
                            ]
                          : null
                      }
                      onChange={(event, valueobj) =>
                        handleChangeChoosenMaster(
                          "FarmerId",
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
                    <Button
                      label={"Details"}
                      class={"btnDetails"}
                      onClick={showFarmerDetails}
                    />
                  </div> */}

                      <div className="formControl">
                        <label>ফার্মার (Farmer):</label>
                        <div className="autocompleteContainer">
                          <Autocomplete
                            autoHighlight
                            className="chosen_dropdown specificAutocomplete"
                            id="FarmerId"
                            name="FarmerId"
                            autoComplete
                            options={farmerList ? farmerList : []}
                            getOptionLabel={(option) => option.name}
                            value={
                              farmerList
                                ? farmerList[
                                    farmerList.findIndex(
                                      (list) =>
                                        list.id == currentInvoice.FarmerId
                                    )
                                  ]
                                : null
                            }
                            onChange={(event, valueobj) =>
                              handleChangeChoosenMaster(
                                "FarmerId",
                                valueobj ? valueobj.id : ""
                              )
                            }
                            renderOption={(option) => (
                              <Typography className="chosen_dropdown_font">
                                {option.name}
                              </Typography>
                            )}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="standard"
                                fullWidth
                              />
                            )}
                          />

                          <Button
                            label={"Details"}
                            class={"btnDetails"}
                            onClick={showFarmerDetails}
                          />
                        </div>
                      </div>

                      <div class="formControl">
                        <label>Type of Farmer</label>
                      </div>

                      <div class="formControl">
                        <label></label>
                        <div class="checkbox-group-type">
                          <div class="checkbox-label">
                            <input
                              type="checkbox"
                              id="DAIRY"
                              name="DAIRY"
                              checked={
                                questionsVisibleList["DAIRY"] != "displaynone"
                              }
                              onChange={(e) => changeVisibilityCheck(e)}
                            />
                            <label>1 Dairy</label>
                          </div>

                          <div class="checkbox-label">
                            <input
                              type="checkbox"
                              id="BUFFALO"
                              name="BUFFALO"
                              checked={
                                questionsVisibleList["BUFFALO"] != "displaynone"
                              }
                              onChange={(e) => changeVisibilityCheck(e)}
                            />
                            <label>2 Buffalo</label>
                          </div>

                          <div class="checkbox-label">
                            <input
                              type="checkbox"
                              id="BEEFFATTENING"
                              name="BEEFFATTENING"
                              checked={
                                questionsVisibleList["BEEFFATTENING"] !=
                                "displaynone"
                              }
                              onChange={(e) => changeVisibilityCheck(e)}
                            />
                            <label>3 Beef Fattening</label>
                          </div>

                          <div class="checkbox-label">
                            <input
                              type="checkbox"
                              id="GOAT"
                              name="GOAT"
                              checked={
                                questionsVisibleList["GOAT"] != "displaynone"
                              }
                              onChange={(e) => changeVisibilityCheck(e)}
                            />
                            <label>4 Goat</label>
                          </div>

                          <div class="checkbox-label">
                            <input
                              type="checkbox"
                              id="SHEEP"
                              name="SHEEP"
                              checked={
                                questionsVisibleList["SHEEP"] != "displaynone"
                              }
                              onChange={(e) => changeVisibilityCheck(e)}
                            />
                            <label>5 Sheep</label>
                          </div>
                          <div class="checkbox-label">
                            <input
                              type="checkbox"
                              id="SCAVENGINGCHICKENLOCAL"
                              name="SCAVENGINGCHICKENLOCAL"
                              checked={
                                questionsVisibleList[
                                  "SCAVENGINGCHICKENLOCAL"
                                ] != "displaynone"
                              }
                              onChange={(e) => changeVisibilityCheck(e)}
                            />
                            <label>6 Scavenging Chicken</label>
                          </div>

                          <div class="checkbox-label">
                            <input
                              type="checkbox"
                              id="DUCK"
                              name="DUCK"
                              checked={
                                questionsVisibleList["DUCK"] != "displaynone"
                              }
                              onChange={(e) => changeVisibilityCheck(e)}
                            />
                            <label>7 Duck</label>
                          </div>

                          {/* <div class="checkbox-label">
                            <input
                              type="checkbox"
                              id="SONALI"
                              name="SONALI"
                              checked={
                                questionsVisibleList["SONALI"] != "displaynone"
                              }
                              onChange={(e) => changeVisibilityCheck(e)}
                            />
                            <label>7 Sonali</label>
                          </div> */}

                          {/* <div class="checkbox-label">
                            <input
                              type="checkbox"
                              id="COMMERCIALBROILER"
                              name="COMMERCIALBROILER"
                              checked={
                                questionsVisibleList["COMMERCIALBROILER"] !=
                                "displaynone"
                              }
                              onChange={(e) => changeVisibilityCheck(e)}
                            />
                            <label>8 Commercial Broiler</label>
                          </div> */}

                          {/* 
                          <div class="checkbox-label">
                            <input
                              type="checkbox"
                              id="TURKEY"
                              name="TURKEY"
                              checked={
                                questionsVisibleList["TURKEY"] != "displaynone"
                              }
                              onChange={(e) => changeVisibilityCheck(e)}
                            />
                            <label>10 Turkey</label>
                          </div> */}

                          {/* <div class="checkbox-label">
                            <input
                              type="checkbox"
                              id="GUINEAFOWL"
                              name="GUINEAFOWL"
                              checked={
                                questionsVisibleList["GUINEAFOWL"] !=
                                "displaynone"
                              }
                              onChange={(e) => changeVisibilityCheck(e)}
                            />
                            <label>11 Guinea Fowl</label>
                          </div> */}

                          <div class="checkbox-label">
                            <input
                              type="checkbox"
                              id="QUAIL"
                              name="QUAIL"
                              checked={
                                questionsVisibleList["QUAIL"] != "displaynone"
                              }
                              onChange={(e) => changeVisibilityCheck(e)}
                            />
                            <label>8 Quail</label>
                          </div>

                          <div class="checkbox-label">
                            <input
                              type="checkbox"
                              id="PIGEON"
                              name="PIGEON"
                              checked={
                                questionsVisibleList["PIGEON"] != "displaynone"
                              }
                              onChange={(e) => changeVisibilityCheck(e)}
                            />
                            <label>9 Pigeon</label>
                          </div>
                          {/* 
                          <div class="checkbox-label">
                            <input
                              type="checkbox"
                              id="LAYER"
                              name="LAYER"
                              checked={
                                questionsVisibleList["LAYER"] != "displaynone"
                              }
                              onChange={(e) => changeVisibilityCheck(e)}
                            />
                            <label>14 Layer</label>
                          </div> */}
                        </div>
                      </div>
                    </>
                  )}

                  {questionsList.map((question) => {
                    // console.log("question: ", question.QuestionType);
                    // console.log("question: ", question.QuestionCode);
                    // (manyDataList.hasOwnProperty(question.QuestionCode)?manyDataList[question.QuestionCode]:"")
                    // console.log('question.QuestionCode: ',    (manyDataList.hasOwnProperty(question.QuestionCode)?manyDataList[question.QuestionCode]:"999"));
                    // const sortIcon = () => {
                    //   if (column.field === sort.orderBy) {
                    //     if (sort.order === "asc") {
                    //       return "⬆️";
                    //     }
                    //     return "⬇️";
                    //   } else {
                    //     return "️↕️";
                    //   }
                    // };

                    if (question.QuestionType === "Label") {
                      return (
                        <>
                          <div
                            class={
                              "formControl bordertop fontbold " +
                              questionsVisibleList[question.Category] +
                              ""
                            }
                          >
                            <label>
                              {/* তথ্য সংগ্রহকারীর নামdddddddddd: (Name of data collector)*: */}
                              {question.QuestionName}
                            </label>
                          </div>
                        </>
                      );
                    } else if (
                      question.QuestionType === "MultiOption" ||
                      question.QuestionType === "MultiRadio"
                    ) {
                      return (
                        <>
                          <div
                            class={
                              "formControl " +
                              questionsVisibleList[question.Category] +
                              ""
                            }
                          >
                            <label>
                              {/* তথ্য সংগ্রহকারীর নামdddddddddd: (Name of data collector)*: */}
                              {question.QuestionName + ":"}
                            </label>
                          </div>
                        </>
                      );
                    } else if (question.QuestionType === "Radio") {
                      return (
                        <>
                          <div
                            class={
                              "formControl " +
                              questionsVisibleList[question.Category] +
                              ""
                            }
                          >
                            <label>
                              {/* {question.QuestionName} */}
                              {/* MQ4. নিচের কোন অফিস সরঞ্জামাদি LDDP থেকে পেয়েছেন?
                              (Which of the following main office equipment the
                              PG have received from LDDP?): */}
                            </label>
                            <div>
                              <div class="checkbox-label">
                                <input
                                  type="radio"
                                  id={question.QuestionCode}
                                  //when name is same then this is consider radio group
                                  name={question.QuestionParentId}
                                  value={manyDataList[question.QuestionCode]}
                                  checked={
                                    manyDataList[question.QuestionCode] ===
                                      "true" ||
                                    manyDataList[question.QuestionCode] ===
                                      true ||
                                    manyDataList[question.QuestionCode] === "1"
                                  }
                                  onChange={(e) =>
                                    handleChangeRadioMany(
                                      e,
                                      question.QuestionCode,
                                      question.QuestionParentId
                                    )
                                  }
                                />
                                <label>{question.QuestionName}</label>
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    } else if (question.QuestionType === "Number") {
                      return (
                        <>
                          <div
                            class={
                              "formControl " +
                              questionsVisibleList[question.Category] +
                              ""
                            }
                          >
                            <label>
                              {/* তথ্য সংগ্রহকারীর নামdddddddddd: (Name of data collector)*: */}
                              {question.QuestionName +
                                (question.IsMandatory ? "*" : "") +
                                ":"}
                            </label>

                            <input
                              type="number"
                              id={question.QuestionCode}
                              name={question.QuestionCode}
                              class={
                                question.IsMandatory
                                  ? errorObjectMany[question.QuestionCode]
                                  : ""
                              }
                              // value={manyDataList.BQ2}
                              value={manyDataList[question.QuestionCode]}
                              // value={eval("manyDataList."+question.QuestionCode)}
                              onChange={(e) => handleChangeMany(e)}
                            />
                          </div>
                        </>
                      );
                    } else if (question.QuestionType === "YesNo") {
                      return (
                        <>
                          <div
                            class={
                              "formControl " +
                              questionsVisibleList[question.Category] +
                              ""
                            }
                          >
                            <label>
                              {question.QuestionName +
                                (question.IsMandatory ? "*" : "") +
                                ":"}
                              {/* MQ15. পিজির সদস্যদের কি সঞ্চয় পাস বই আছে? (Do the
                              members of this PG have a savings passbook?): */}
                            </label>
                            <div
                              className={
                                question.IsMandatory
                                  ? "radio-group " +
                                    errorObjectMany[question.QuestionCode]
                                  : "radio-group"
                              }
                            >
                              <label className="radio-label">
                                <input
                                  type="radio"
                                  id={question.QuestionCode}
                                  name={question.QuestionCode}
                                  value={true}
                                  // class={question.IsMandatory ? errorObjectMany[question.QuestionCode] : ""}
                                  checked={
                                    manyDataList[question.QuestionCode] ===
                                      "true" ||
                                    manyDataList[question.QuestionCode] === true
                                  }
                                  onChange={(e) => handleChangeMany(e)}
                                />
                                Yes
                              </label>

                              <label className="radio-label">
                                <input
                                  type="radio"
                                  id={question.QuestionCode}
                                  name={question.QuestionCode}
                                  value={false}
                                  // class={question.IsMandatory ? errorObjectMany[question.QuestionCode] : ""}
                                  checked={
                                    manyDataList[question.QuestionCode] ===
                                      "false" ||
                                    manyDataList[question.QuestionCode] ===
                                      false
                                  }
                                  onChange={(e) => handleChangeMany(e)}
                                />
                                No
                              </label>
                            </div>
                          </div>

                          {question.QuestionCode == "GRASS__00000" &&
                            manyDataList[question.QuestionCode] == "true" && (
                              <div className="formControl">
                                <label></label>
                                <div className="newTableDiv">
                                  <table className="tg">
                                    <thead>
                                      <tr>
                                        <td className="tg-sl" rowSpan="2">
                                          Serial No
                                        </td>
                                        <td className="tg-zv4m" rowSpan="2">
                                          Name of grass
                                        </td>
                                        <td className="tg-zv4m" rowSpan="2">
                                          Type of land (1 = Homestead; 2 =
                                          Cultivable Land; 3 = Others)
                                        </td>
                                        <td className="tg-nlfa" colSpan="4">
                                          Area of land cultivated, production
                                          sale for fodder (green grass)
                                        </td>
                                      </tr>
                                      <tr>
                                        <td className="tg-22sb">
                                          Cultivation in decimal
                                        </td>
                                        <td className="tg-dhoh">
                                          Production in last year (kg)
                                        </td>
                                        <td className="tg-22sb">
                                          Consumption in last year (kg)
                                        </td>
                                        <td className="tg-dhoh">
                                          Sales in last year (kg)
                                        </td>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {grassTypeTableRow.map((grassRow, i) => {
                                        return (
                                          <>
                                            {grassRow.RowType != "delete" && (
                                              <tr>
                                                <td className="tg-sl">
                                                  {i + 1}
                                                </td>
                                                <td>
                                                  <select
                                                    onChange={(e) =>
                                                      changeCustomTableCellExtend(
                                                        e,
                                                        "GrassId",
                                                        grassRow.DataValueItemDetailsId
                                                      )
                                                    }
                                                    className="fullWidthSelect"
                                                  >
                                                    {grassList.map((gObj) => {
                                                      return (
                                                        <>
                                                          {grassRow.GrassId ==
                                                            gObj.id && (
                                                            <option
                                                              selected
                                                              value={gObj.id}
                                                            >
                                                              {gObj.name}
                                                            </option>
                                                          )}

                                                          {grassRow.GrassId !=
                                                            gObj.id && (
                                                            <option
                                                              value={gObj.id}
                                                            >
                                                              {gObj.name}
                                                            </option>
                                                          )}
                                                        </>
                                                      );
                                                    })}
                                                  </select>
                                                </td>
                                                <td>
                                                  <select
                                                    onChange={(e) =>
                                                      changeCustomTableCellExtend(
                                                        e,
                                                        "LandTypeId",
                                                        grassRow.DataValueItemDetailsId
                                                      )
                                                    }
                                                    className="fullWidthSelect"
                                                  >
                                                    {landTypeList.map(
                                                      (gObj) => {
                                                        return (
                                                          <>
                                                            {grassRow.LandTypeId ==
                                                              gObj.id && (
                                                              <option
                                                                selected
                                                                value={gObj.id}
                                                              >
                                                                {gObj.name}
                                                              </option>
                                                            )}

                                                            {grassRow.LandTypeId !=
                                                              gObj.id && (
                                                              <option
                                                                value={gObj.id}
                                                              >
                                                                {gObj.name}
                                                              </option>
                                                            )}
                                                          </>
                                                        );
                                                      }
                                                    )}
                                                  </select>
                                                </td>
                                                <td className="tg-dhohs">
                                                  <input
                                                    type="number"
                                                    className="numberInput"
                                                    value={grassRow.Cultivation}
                                                    onChange={(e) =>
                                                      changeCustomTableCellExtend(
                                                        e,
                                                        "Cultivation",
                                                        grassRow.DataValueItemDetailsId
                                                      )
                                                    }
                                                  />
                                                </td>
                                                <td className="tg-dhohs">
                                                  <input
                                                    type="number"
                                                    className="numberInput"
                                                    value={grassRow.Production}
                                                    onChange={(e) =>
                                                      changeCustomTableCellExtend(
                                                        e,
                                                        "Production",
                                                        grassRow.DataValueItemDetailsId
                                                      )
                                                    }
                                                  />
                                                </td>
                                                <td className="tg-dhohs">
                                                  <input
                                                    type="number"
                                                    className="numberInput"
                                                    value={grassRow.Consumption}
                                                    onChange={(e) =>
                                                      changeCustomTableCellExtend(
                                                        e,
                                                        "Consumption",
                                                        grassRow.DataValueItemDetailsId
                                                      )
                                                    }
                                                  />
                                                </td>
                                                <td className="tg-dhohs">
                                                  <input
                                                    type="number"
                                                    className="numberInput"
                                                    value={grassRow.Sales}
                                                    onChange={(e) =>
                                                      changeCustomTableCellExtend(
                                                        e,
                                                        "Sales",
                                                        grassRow.DataValueItemDetailsId
                                                      )
                                                    }
                                                  />
                                                </td>
                                                <td>
                                                  <i
                                                    className="fa fa-trash-alt"
                                                    onClick={(e) =>
                                                      deleteGrassTypeRow(
                                                        e,
                                                        grassRow.DataValueItemDetailsId
                                                      )
                                                    }
                                                  ></i>
                                                </td>
                                              </tr>
                                            )}
                                          </>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </div>
                                <label></label>
                                <button
                                  className="middleButton"
                                  onClick={(e) => addGrassTypeRow(e)}
                                >
                                  <i className="fa fa-plus" />
                                </button>
                              </div>
                            )}
                        </>
                      );
                    } else if (question.QuestionType === "Check") {
                      return (
                        <>
                          <div
                            class={
                              "formControl " +
                              questionsVisibleList[question.Category] +
                              ""
                            }
                          >
                            <label>
                              {/* {question.QuestionName} */}
                              {/* MQ4. নিচের কোন অফিস সরঞ্জামাদি LDDP থেকে পেয়েছেন?
                              (Which of the following main office equipment the
                              PG have received from LDDP?): */}
                            </label>
                            <div>
                              <div class="checkbox-label">
                                <input
                                  type="checkbox"
                                  id={question.QuestionCode}
                                  name={question.QuestionCode}
                                  // value="কম্পিউটার/ল্যাপটপ/প্রিন্টার"
                                  value={manyDataList[question.QuestionCode]}
                                  // checked={true}
                                  checked={
                                    manyDataList[question.QuestionCode] ===
                                      "true" ||
                                    manyDataList[question.QuestionCode] ===
                                      true ||
                                    manyDataList[question.QuestionCode] === "1"
                                  }
                                  onChange={(e) => handleChangeCheckMany(e)}
                                />
                                <label>{question.QuestionName}</label>
                                {/* <label>কম্পিউটার/ল্যাপটপ/প্রিন্টার</label> */}
                              </div>

                              {/* <div class="checkbox-label">
                                <input
                                  type="checkbox"
                                  id="MQ4_TableChair"
                                  name="MQ4_TableChair"
                                  value="টেবিল চেয়ার"
                                  onChange={(e) => handleChangeCheckMaster(e)}
                                />
                                <label>টেবিল চেয়ার</label>
                              </div>

                              <div class="checkbox-label">
                                <input
                                  type="checkbox"
                                  id="MQ4_Almira"
                                  name="MQ4_Almira"
                                  value="আলমারি/ফাইল কেবিনেট"
                                  onChange={(e) => handleChangeCheckMaster(e)}
                                />
                                <label>আলমারি/ফাইল কেবিনেট</label>
                              </div>

                              <div class="checkbox-label">
                                <input
                                  type="checkbox"
                                  id="MQ4_Other"
                                  name="MQ4_Other"
                                  value="অন্যান্য (উল্লেখ করুন)"
                                  onChange={(e) => handleChangeCheckMaster(e)}
                                />
                                <label>অন্যান্য (উল্লেখ করুন)</label>
                              </div> */}
                            </div>
                          </div>
                        </>
                      );
                    } else if (question.QuestionType === "CheckText") {
                      return (
                        <>
                          <div
                            class={
                              "formControl " +
                              questionsVisibleList[question.Category] +
                              ""
                            }
                          >
                            <label>
                              {/* {question.QuestionName} */}
                              {/* MQ4. নিচের কোন অফিস সরঞ্জামাদি LDDP থেকে পেয়েছেন?
                              (Which of the following main office equipment the
                              PG have received from LDDP?): */}
                            </label>
                            <div>
                              <div class="checkbox-label">
                                <input
                                  type="checkbox"
                                  id={question.QuestionCode}
                                  name={question.QuestionCode}
                                  // value="কম্পিউটার/ল্যাপটপ/প্রিন্টার"
                                  // value={question.QuestionName}
                                  //   value={manyDataList[question.QuestionCode]}
                                  //   // checked={true}
                                  //   checked={manyDataList[question.QuestionCode] === "true"
                                  //   || manyDataList[question.QuestionCode] === true
                                  // }
                                  // value={manyDataList[question.QuestionCode]}

                                  checked={
                                    manyDataList[question.QuestionCode] !==
                                      false &&
                                    manyDataList[question.QuestionCode] !==
                                      undefined
                                  }
                                  // checked={manyDataList[question.QuestionCode] === "true" || manyDataList[question.QuestionCode] === true}
                                  onChange={(e) => handleChangeCheckMany(e)}
                                />
                                <label>{question.QuestionName}</label>
                                {/* <label>কম্পিউটার/ল্যাপটপ/প্রিন্টার</label> */}

                                {manyDataList[question.QuestionCode] && (
                                  <input
                                    type="text"
                                    id={question.QuestionCode}
                                    name={question.QuestionCode}
                                    // id="BQ5"
                                    // name="BQ5"
                                    // value={currentInvoice.BQ5}
                                    value={
                                      manyDataList[question.QuestionCode] ===
                                      true
                                        ? ""
                                        : manyDataList[question.QuestionCode]
                                    }
                                    onChange={(e) =>
                                      handleChangeMany(e, "CheckText")
                                    }
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    } else if (question.QuestionType === "Date") {
                      return (
                        <>
                          <div
                            class={
                              "formControl " +
                              questionsVisibleList[question.Category] +
                              ""
                            }
                          >
                            <label>
                              {/* BQ5. পিজি গঠনের তারিখ (Date of the PG formation): */}
                              {question.QuestionName +
                                (question.IsMandatory ? "*" : "") +
                                ":"}
                            </label>
                            <input
                              type="date"
                              id={question.QuestionCode}
                              name={question.QuestionCode}
                              // id="BQ5"
                              // name="BQ5"
                              // value={currentInvoice.BQ5}
                              class={
                                question.IsMandatory
                                  ? errorObjectMany[question.QuestionCode]
                                  : ""
                              }
                              value={
                                manyDataList.hasOwnProperty(
                                  question.QuestionCode
                                )
                                  ? manyDataList[question.QuestionCode]
                                  : ""
                              }
                              onChange={(e) => handleChangeMany(e)}
                            />
                          </div>
                        </>
                      );
                    } else if (question.QuestionType === "DropDown") {
                      return (
                        <>
                          <div
                            class={
                              "formControl chosen_dropdown " +
                              questionsVisibleList[question.Category] +
                              ""
                            }
                          >
                            <label>
                              {question.QuestionName +
                                (question.IsMandatory ? "*" : "") +
                                ":"}
                            </label>
                            <Autocomplete
                              autoHighlight
                              // freeSolo
                              className="chosen_dropdown"
                              id={question.QuestionCode}
                              name={question.QuestionCode}
                              autoComplete
                              // class={errorObjectMaster.PGId}
                              class={
                                question.IsMandatory
                                  ? errorObjectMany[question.QuestionCode]
                                  : ""
                              }
                              // options={pgGroupList ? pgGroupList : []}
                              options={
                                question.SettingsList
                                  ? question.SettingsList
                                  : []
                              }
                              getOptionLabel={(option) => option.name}
                              // value={selectedSupplier}
                              value={
                                question.SettingsList
                                  ? question.SettingsList[
                                      question.SettingsList.findIndex(
                                        (list) =>
                                          list.id ==
                                          (manyDataList.hasOwnProperty(
                                            question.QuestionCode
                                          )
                                            ? manyDataList[
                                                question.QuestionCode
                                              ]
                                            : "")
                                      )
                                    ]
                                  : null
                              }
                              // value={manyDataList.hasOwnProperty(question.QuestionCode)?manyDataList[question.QuestionCode]:""}

                              onChange={(event, valueobj) =>
                                handleChangeChoosenMany(
                                  question.QuestionCode,
                                  valueobj ? valueobj.id : ""
                                )
                              }
                              renderOption={(option) => (
                                <Typography className="chosen_dropdown_font">
                                  {option.name}
                                </Typography>
                              )}
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  variant="standard"
                                  fullWidth
                                />
                              )}
                            />
                          </div>
                        </>
                        // )}
                      );
                    } else {
                      return (
                        <>
                          <div
                            class={
                              "formControl " +
                              questionsVisibleList[question.Category] +
                              ""
                            }
                          >
                            <label>
                              {/* তথ্য সংগ্রহকারীর নাম: (Name of data collector)*: */}

                              {question.QuestionName +
                                (question.IsMandatory ? "*" : "") +
                                ":"}
                            </label>

                            <input
                              type="text"
                              id={question.QuestionCode}
                              name={question.QuestionCode}
                              class={
                                question.IsMandatory
                                  ? errorObjectMany[question.QuestionCode]
                                  : ""
                              }
                              // value={currentInvoice.DataCollectorName}
                              value={
                                manyDataList.hasOwnProperty(
                                  question.QuestionCode
                                )
                                  ? manyDataList[question.QuestionCode]
                                  : ""
                              }
                              onChange={(e) => handleChangeMany(e)}
                            />
                          </div>

                          {/* {column.visible && (
                      <th
                        key={column.field}
                        style={{ textAlign: column.align, width: column.width }}
                      >
                        <span>{column.label}</span>

                        {column.sort && (
                          <button
                            class="btn-table-sort"
                            onClick={() => handleSort(column.field)}
                          >
                            {sortIcon()}
                          </button>
                        )}
                      </th>
                    )} */}
                        </>
                      );
                    }
                  })}

                  {/* </tr> */}

                  {/* {
                    "========================================================================="
                  } */}

                  {/* <div class="formControl">
                    <label>BQ1. দলের নাম (Group name):</label>
                    <input
                      type="text"
                      id="BQ1"
                      name="BQ1"
                      value={currentInvoice.BQ1}
                      onChange={(e) => handleChangeMaster(e)}
                    />
                  </div>

                  <div class="formControl">
                    <label>BQ2. দলের প্রকারঃ (Value Chain):</label>
                    <input
                      type="text"
                      id="BQ2"
                      name="BQ2"
                      value={currentInvoice.BQ2}
                      onChange={(e) => handleChangeMaster(e)}
                    />
                  </div>

                  <div class="formControl">
                    <label>BQ3. দলের আই,ডিঃ ( Group identity code):</label>
                    <input
                      type="text"
                      id="BQ3"
                      name="BQ3"
                      value={currentInvoice.BQ3}
                      onChange={(e) => handleChangeMaster(e)}
                    />
                  </div>

                  <div class="formControl">
                    <label>
                      BQ4. পিজি এর সদস্য সংখ্যা (Number of PG members)
                    </label>
                  </div>

                  <div class="formControl">
                    <label>পুরুষ / Male:</label>
                    <input
                      type="number"
                      id="BQ4Male"
                      name="BQ4Male"
                      value={currentInvoice.BQ4Male}
                      onChange={(e) => handleChangeMaster(e)}
                    />
                  </div>

                  <div class="formControl">
                    <label>নারী/Female:</label>
                    <input
                      type="number"
                      id="BQ4FeMale"
                      name="BQ4FeMale"
                      value={currentInvoice.BQ4FeMale}
                      onChange={(e) => handleChangeMaster(e)}
                    />
                  </div>

                  <div class="formControl">
                    <label>ট্রান্সজেন্ডার /Transgender:</label>
                    <input
                      type="number"
                      id="BQ4Transgender"
                      name="BQ4Transgender"
                      value={currentInvoice.BQ4Transgender}
                      onChange={(e) => handleChangeMaster(e)}
                    />
                  </div>

                  <div class="formControl">
                    <label>
                      BQ5. পিজি গঠনের তারিখ (Date of the PG formation):
                    </label>
                    <input
                      type="date"
                      id="BQ5"
                      name="BQ5"
                      value={currentInvoice.BQ5}
                      onChange={(e) => handleChangeMaster(e)}
                    />
                  </div>

                  <div class="formControl">
                    <label>BQ6. গ্রাম/ওয়ার্ডঃ (Village/Ward):</label>
                    <input
                      type="text"
                      id="BQ6"
                      name="BQ6"
                      value={currentInvoice.BQ6}
                      onChange={(e) => handleChangeMaster(e)}
                    />
                  </div>

                  <div class="formControl">
                    <label>BQ7. ইউনিয়ন/পৌরসভাঃ (Union/ Municipality):</label>
                    <input
                      type="text"
                      id="BQ7"
                      name="BQ7"
                      value={currentInvoice.BQ7}
                      onChange={(e) => handleChangeMaster(e)}
                    />
                  </div>

                  <div class="formControl">
                    <label>
                      MQ1. পিজি কি নিবন্ধিত? (Is the PG registered):
                    </label>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          id="MQ1"
                          name="MQ1"
                          value="1"
                          checked={currentInvoice.MQ1 === "1"}
                          onChange={(e) => handleChangeMaster(e)}
                        />
                        Yes
                      </label>

                      <label className="radio-label">
                        <input
                          type="radio"
                          id="MQ1"
                          name="MQ1"
                          value="0"
                          checked={currentInvoice.MQ1 === "0"}
                          onChange={(e) => handleChangeMaster(e)}
                        />
                        No
                      </label>
                    </div>
                  </div>

                  <div class="formControl">
                    <label>
                      MQ2. এই পিজির কি দৃশ্যমান জায়গায় সাইনবোর্ড আছে? (Does
                      this have a signboard in a visible place?):
                    </label>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          id="MQ2"
                          name="MQ2"
                          value="1"
                          checked={currentInvoice.MQ2 === "1"}
                          onChange={(e) => handleChangeMaster(e)}
                        />
                        Yes
                      </label>

                      <label className="radio-label">
                        <input
                          type="radio"
                          id="MQ2"
                          name="MQ2"
                          value="0"
                          checked={currentInvoice.MQ2 === "0"}
                          onChange={(e) => handleChangeMaster(e)}
                        />
                        No
                      </label>
                    </div>
                  </div>

                  <div class="formControl">
                    <label>
                      MQ3. পিজি এর কি স্থায়ী অফিস আছে? (Does this PG have a
                      permanent office?):
                    </label>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          id="MQ3"
                          name="MQ3"
                          value="1"
                          checked={currentInvoice.MQ3 === "1"}
                          onChange={(e) => handleChangeMaster(e)}
                        />
                        Yes
                      </label>

                      <label className="radio-label">
                        <input
                          type="radio"
                          id="MQ3"
                          name="MQ3"
                          value="0"
                          checked={currentInvoice.MQ3 === "0"}
                          onChange={(e) => handleChangeMaster(e)}
                        />
                        No
                      </label>
                    </div>
                  </div>

                  <div class="formControl">
                    <label>
                      {" "}
                      MQ4. নিচের কোন অফিস সরঞ্জামাদি LDDP থেকে পেয়েছেন? (Which
                      of the following main office equipment the PG have
                      received from LDDP?):
                    </label>
                    <div>
                      <div class="checkbox-label">
                        <input
                          type="checkbox"
                          id="MQ4_Computer"
                          name="MQ4_Computer"
                          value="কম্পিউটার/ল্যাপটপ/প্রিন্টার"
                          onChange={(e) => handleChangeCheckMaster(e)}
                        />
                        <label>কম্পিউটার/ল্যাপটপ/প্রিন্টার</label>
                      </div>

                      <div class="checkbox-label">
                        <input
                          type="checkbox"
                          id="MQ4_TableChair"
                          name="MQ4_TableChair"
                          value="টেবিল চেয়ার"
                          onChange={(e) => handleChangeCheckMaster(e)}
                        />
                        <label>টেবিল চেয়ার</label>
                      </div>

                      <div class="checkbox-label">
                        <input
                          type="checkbox"
                          id="MQ4_Almira"
                          name="MQ4_Almira"
                          value="আলমারি/ফাইল কেবিনেট"
                          onChange={(e) => handleChangeCheckMaster(e)}
                        />
                        <label>আলমারি/ফাইল কেবিনেট</label>
                      </div>

                      <div class="checkbox-label">
                        <input
                          type="checkbox"
                          id="MQ4_Other"
                          name="MQ4_Other"
                          value="অন্যান্য (উল্লেখ করুন)"
                          onChange={(e) => handleChangeCheckMaster(e)}
                        />
                        <label>অন্যান্য (উল্লেখ করুন)</label>
                      </div>
                    </div>
                  </div>

                  <div class="formControl">
                    <label>
                      MQ6. পিজি এর কি নির্বাহী কমিটি আছে? (Does this PG have an
                      executive committee?):
                    </label>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          id="MQ6"
                          name="MQ6"
                          value="1"
                          checked={currentInvoice.MQ6 === "1"}
                          onChange={(e) => handleChangeMaster(e)}
                        />
                        Yes
                      </label>

                      <label className="radio-label">
                        <input
                          type="radio"
                          id="MQ6"
                          name="MQ6"
                          value="0"
                          checked={currentInvoice.MQ6 === "0"}
                          onChange={(e) => handleChangeMaster(e)}
                        />
                        No
                      </label>
                    </div>
                  </div>

                  <div class="formControl">
                    <label>
                      MQ9. পিজি মিটিং কি নিয়মিত হয়? (Does PG meeting held on a
                      regular basis?):
                    </label>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          id="MQ9"
                          name="MQ9"
                          value="1"
                          checked={currentInvoice.MQ9 === "1"}
                          onChange={(e) => handleChangeMaster(e)}
                        />
                        Yes
                      </label>

                      <label className="radio-label">
                        <input
                          type="radio"
                          id="MQ9"
                          name="MQ9"
                          value="0"
                          checked={currentInvoice.MQ9 === "0"}
                          onChange={(e) => handleChangeMaster(e)}
                        />
                        No
                      </label>
                    </div>
                  </div>

                  <div class="formControl">
                    <label>
                      MQ10. সর্বশেষ মিটিং এ কতজন সদস্য উপস্থিত ছিল? (How many
                      members attended the last meeting?):
                    </label>
                    <input
                      type="number"
                      id="MQ10"
                      name="MQ10"
                      value={currentInvoice.MQ10}
                      onChange={(e) => handleChangeMaster(e)}
                    />
                  </div>

                  <div class="formControl">
                    <label>
                      {" "}
                      MQ15. পিজির সদস্যদের কি সঞ্চয় পাস বই আছে? (Do the members
                      of this PG have a savings passbook?):
                    </label>
                    <div className="radio-group">
                      <label className="radio-label">
                        <input
                          type="radio"
                          id="MQ15"
                          name="MQ15"
                          value="1"
                          checked={currentInvoice.MQ15 === "1"}
                          onChange={(e) => handleChangeMaster(e)}
                        />
                        Yes
                      </label>

                      <label className="radio-label">
                        <input
                          type="radio"
                          id="MQ15qqq"
                          name="MQ15"
                          value="0"
                          checked={currentInvoice.MQ15 === "0"}
                          onChange={(e) => handleChangeMaster(e)}
                        />
                        No
                      </label>
                    </div>
                  </div>

                  <div class="formControl">
                    <label>
                      {" "}
                      MQ16. মাসিক সঞ্চয়ের হার কত টাকা? (What is the rate of
                      monthly savings in taka?):
                    </label>

                    <input
                      type="number"
                      id="MQ16"
                      name="MQ16"
                      value={currentInvoice.MQ16}
                      onChange={(e) => handleChangeMaster(e)}
                    />
                  </div> */}

                  <div class="formControl bordertop">
                    <label>Date of Interview*:</label>

                    <input
                      type="date"
                      id="DataCollectionDate"
                      name="DataCollectionDate"
                      class={errorObjectMaster.DataCollectionDate}
                      value={currentInvoice.DataCollectionDate}
                      onChange={(e) => handleChangeMaster(e)}
                    />
                  </div>
                  <div class="formControl">
                    <label>Name of Enumerator*:</label>

                    <input
                      type="text"
                      id="DataCollectorName"
                      name="DataCollectorName"
                      class={errorObjectMaster.DataCollectorName}
                      value={currentInvoice.DataCollectorName}
                      onChange={(e) => handleChangeMaster(e)}
                    />
                  </div>

                  <div class="formControl">
                    <label>Enumerator Designation:*</label>
                    <Autocomplete
                      autoHighlight
                      // freeSolo
                      className="chosen_dropdown"
                      id="DesignationId"
                      name="DesignationId"
                      autoComplete
                      options={DesignationList ? DesignationList : []}
                      getOptionLabel={(option) => option.name}
                      // value={chosenValuesYearId["DesignationId"]}
                      // onChange={(event, valueobj) =>
                      //   handleChangeChoosenMasterYear(
                      //     "DesignationId",
                      //     valueobj,
                      //     valueobj ? valueobj.id : ""
                      //   )
                      // }
                      value={
                        DesignationList
                          ? DesignationList[
                              DesignationList.findIndex(
                                (list) =>
                                  list.id == currentInvoice.DesignationId
                              )
                            ]
                          : null
                      }
                      onChange={(event, valueobj) =>
                        handleChangeChoosenMaster(
                          "DesignationId",
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

                  <div class="formControl">
                    <label>Cell No. of Enumerator*:</label>

                    <input
                      type="text"
                      id="PhoneNumber"
                      name="PhoneNumber"
                      class={errorObjectMaster.PhoneNumber}
                      value={currentInvoice.PhoneNumber}
                      onChange={(e) => handleChangeMaster(e)}
                    />
                  </div>

                  <div class="formControl ">
                    <label>Enumerator Comment:</label>

                    <textarea
                      type="text"
                      id="Remarks"
                      name="Remarks"
                      value={currentInvoice.Remarks}
                      onChange={(e) => handleChangeMaster(e)}
                      rows={4}
                    />
                  </div>

                  <div class="btnAddForm">
                    <Button
                      label={"সংরক্ষণ করুন (Save)"}
                      class={"btnAddCustom"}
                      onClick={saveData}
                      // disabled={currentInvoice.StatusId > 1}
                      disabled={UserInfo.Settings.AllowEditApprovedData == "1"?false:(currentInvoice.StatusId > 1)}

                    />

                    <Button
                      label={"ফেরত যান (Back To List)"}
                      class={"btnBackCustom"}
                      onClick={backToList}
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default DataCollectionEntry;
