import React, { forwardRef, useRef, useContext, useEffect } from "react";
import swal from "sweetalert";
import { DeleteOutline, Edit, ViewList } from "@material-ui/icons";

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

const DataCollectionEntry = (props) => {
  // console.log("props.DataTypeId: ", props.DataTypeId);
  const serverpage = "datacollection"; // this is .php server page

  const { useState } = React;
  const [bFirst, setBFirst] = useState(true);

  const [entryFormTitle, setEntryFormTitle] = useState("");
  const [entryFormSubTitle, setEntryFormSubTitle] = useState("");

  const [listEditPanelToggle, setListEditPanelToggle] = useState(true); //when true then show list, when false then show add/edit
  const [pgGroupList, setPgGroupList] = useState(null);
  const [quarterList, setQuarterList] = useState(null);
  const [yearList, setYearList] = useState(null);

  const [currentInvoice, setCurrentInvoice] = useState([]); //this is for master information. It will send to sever for save
  const [manyDataList, setManyDataList] = useState([]); //This is for many table. It will send to sever for save

  const [currentDate, setCurrentDate] = useState(moment().format("YYYY-MM-DD"));
  const [currentYear, setCurrentYear] = useState(moment().format("YYYY"));

  let curMonthId = parseInt(moment().format("MM"));
  let defaultMonthId = 1;
  if(curMonthId <= 3){
    defaultMonthId = 1;
  }else if(curMonthId <= 6){
    defaultMonthId = 2;
  }else if(curMonthId <= 9){
    defaultMonthId = 3;
  }else{
    defaultMonthId = 4;
  }
  // console.log('curMonthId: ', parseInt(curMonthId));

  const [currentQuarterId, setcurrentQuarterId] = useState(defaultMonthId);
  const [dataTypeId, setDataTypeId] = useState(props.DataTypeId);

  const [errorObjectMaster, setErrorObjectMaster] = useState({});
  const [errorObjectMany, setErrorObjectMany] = useState({});

  const [questionsList, setQuestionsList] = useState([]);

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

  const UserInfo = LoginUserInfo();

  /* =====Start of Excel Export Code==== */
  // const EXCEL_EXPORT_URL = process.env.REACT_APP_API_URL;

  // const PrintPDFExcelExportFunction = (reportType) => {
  //   let finalUrl = EXCEL_EXPORT_URL + "report/print_pdf_excel_server.php";

  //   window.open(
  //     finalUrl +
  //       "?action=StrengthExport" +
  //       "&reportType=" +
  //       reportType +
  //       "&TimeStamp=" +
  //       Date.now()
  //   );
  // };
  /* =====End of Excel Export Code==== */

  const newInvoice = () => {
    console.log("dataTypeId: ", dataTypeId);

    setCurrentInvoice({
      id: "",
      DivisionId: UserInfo.DivisionId,
      DistrictId: UserInfo.DistrictId,
      UpazilaId: UserInfo.UpazilaId,
      YearId: currentYear,
      QuarterId: currentQuarterId,
      DataTypeId: dataTypeId,
      PGId: "",
      FarmerId: "",
      Remarks: "",
      DataCollectorName: "",
      DataCollectionDate: currentDate,
      UserId: UserInfo.UserId,
      BPosted: 0,
    });

    setManyDataList([]);
  };

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
        "গ্ৰুপের তথ্য সংগ্রহ ফরম (Large Group Discussion Data)"
      );
      setEntryFormSubTitle(
        "ত্রৈমাসিক তথ্য সংগ্রহ এবং সংরক্ষণ (Quarterly Data Collection and Storage)"
      );
    }

    /**First time call for datalist */
    newInvoice();

    getQuestionList();

    getPgGroupList();
    getYearList();
    getQuarterList();

    // getDataList(); //invoice list

    setBFirst(false);
  }

  function addData() {
    newInvoice();
    setListEditPanelToggle(false); // false = hide list and show add/edit panel
  }

  function getQuestionList() {
    console.log("getQuestionList dataTypeId: ", dataTypeId);

    let params = {
      action: "getQuestionList",
      lan: language(),
      UserId: UserInfo.UserId,
      DataTypeId: dataTypeId,
    };

    apiCall.post(serverpage, { params }, apiOption()).then((res) => {
      console.log("getQuestionList: ", res);

      setQuestionsList(res.data.datalist); /**set question list */

      getDataList(); //invoice list
    });
  }

  function getPgGroupList() {
    let params = {
      action: "PgGroupList",
      lan: language(),
      UserId: UserInfo.UserId,
      DivisionId: UserInfo.DivisionId,
      DistrictId: UserInfo.DistrictId,
      UpazilaId: UserInfo.UpazilaId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      console.log("res.data.datalist: ", res.data.datalist);

      setPgGroupList(
        [{ id: "", name: "পিজি গ্রুপ নির্বাচন করুন" }].concat(res.data.datalist)
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
      setYearList(
        [{ id: "", name: "বছর নির্বাচন করুন" }].concat(res.data.datalist)
      );
    });
  }

  /**Get data for table list */
  function getDataList() {
    let params = {
      action: "getDataList",
      lan: language(),
      UserId: UserInfo.UserId,
      DivisionId: UserInfo.DivisionId,
      DistrictId: UserInfo.DistrictId,
      UpazilaId: UserInfo.UpazilaId,
      DataTypeId: dataTypeId,
    };
    // console.log('LoginUserInfo params: ', params);

    ExecuteQuery(serverpage, params);
  }

  const masterColumnList = [
    { field: "rownumber", label: "সিরিয়াল", align: "center", width: "5%" },
    // { field: 'SL', label: 'SL',width:'10%',align:'center',visible:true,sort:false,filter:false },
    {
      field: "QuarterName",
      label: "তথ্য সংগ্রহ বছর-ত্রৈমাসিক",
      width: "13%",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
    },
    {
      field: "DataCollectionDate",
      label: "তথ্য সংগ্রহের তারিখ",
      width: "10%",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
    },
    {
      field: "PGName",
      label: "পিজি গ্রুপ",
      align: "left",
      // width: "30%",
      visible: true,
      sort: true,
      filter: true,
    },
    {
      field: "UpazilaName",
      label: "উপজেলা",
      width: "15%",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
    },
    {
      field: "DataCollectorName",
      label: "তথ্য সংগ্রহকারীর নাম",
      width: "15%",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
    },

    {
      field: "custom",
      label: "অ্যাকশন",
      width: "5%",
      align: "center",
      visible: true,
      // sort: false,
      // filter: false,
    },
  ];

  /** Action from table row buttons*/
  function actioncontrolmaster(rowData) {
    return (
      <>
        {rowData.BPosted === 0 && (
          <Edit
            className={"table-edit-icon"}
            onClick={() => {
              editData(rowData);
            }}
          />
        )}

        {rowData.BPosted === 0 && (
          <DeleteOutline
            className={"table-delete-icon"}
            onClick={() => {
              deleteData(rowData);
            }}
          />
        )}

        {rowData.BPosted === 1 && (
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
    getDataSingleFromServer(rowData.id);
  };

  const viewData = (rowData) => {
    getDataSingleFromServer(rowData.id);
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

      // let master = dataListSingle.master[0];
      // console.log("master: ", master);
      // console.log("master MQ4: ", master.MQ4);
      // if (master.MQ4 === null) {
      //   console.log(11111);
      // } else {
      //   console.log(2222);

      //   let MQ4List = master.MQ4.split(",");
      //   MQ4List.forEach((element) => {
      //     console.log("element: ", element);
      //   });
      // }

      setCurrentInvoice(dataListSingle.master[0]);
    }

    if (dataListSingle.items) {
      setManyDataList(dataListSingle.items);
      console.log("dataListSingle items: ", dataListSingle.items);
      // console.log('dataListSingle: ', dataListSingle.items[0]);
    }
  }, [dataListSingle]);

  const backToList = () => {
    setListEditPanelToggle(true); // true = show list and hide add/edit panel
    getDataList(); //invoice list
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

  const handleChangeChoosenMaster = (name, value) => {
    let data = { ...currentInvoice };
    data[name] = value;

    setCurrentInvoice(data);

    setErrorObjectMaster({ ...errorObjectMaster, [name]: null });
  };

  const handleChangeMany = (e, cType = "") => {
    console.log("cType: ", cType);
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
    console.log("data manyDataList: ", data);

    setErrorObjectMany({ ...errorObjectMany, [name]: null });
  };

  function handleChangeCheckMany(e) {
    // console.log('e.target.checked: ', e.target.checked);
    const { name, value } = e.target;
    console.log('name: ', name);
    console.log('value: ', value);

    let data = { ...manyDataList };
    // data[name] = e.target.checked;
    // console.log('e.target.checked: ', e.target.checked);

    // data[name] = e.target.checked;
    data[name] = e.target.checked;
    // data["Questions"][name] = e.target.checked;

    setManyDataList(data);
    console.log("data manyDataList: ", data);
  }


  function handleChangeRadioMany(e,qName,questionParentId) {
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
    console.log("data manyDataList: ", data);
  }

  const handleChangeChoosenMany = (name, value) => {
    let data = { ...manyDataList };
    data[name] = value;

    setManyDataList(data);
    console.log("data manyDataList: ", data);

    setErrorObjectMany({ ...errorObjectMany, [name]: null });
  };

  const validateFormMaster = () => {
    let validateFields = [
      "YearId",
      "QuarterId",
      "PGId",
      "DataCollectorName",
      "DataCollectionDate",
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

    console.log("validateFields: ", validateFields);

    let errorData = {};
    let isValid = true;
    validateFields.map((field) => {
      if (!manyDataList[field]) {
        errorData[field] = "validation-style";
        isValid = false;
      }
    });
    setErrorObjectMany(errorData);
    console.log("errorData: ", errorData);
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

  function saveData(p) {
    let params = {
      action: "dataAddEdit",
      lan: language(),
      UserId: UserInfo.UserId,
      InvoiceMaster: currentInvoice,
      InvoiceItems: manyDataList,
    };
    console.log("params: ", params);

    addEditAPICall(params);
  }

  function addEditAPICall(params) {
    let validMaster = validateFormMaster();
    let validMany = validateFormMany();
    if (validMaster && validMany) {
      apiCall.post(serverpage, { params }, apiOption()).then((res) => {
        // console.log('res: ', res);

        props.openNoticeModal({
          isOpen: true,
          msg: res.data.message,
          msgtype: res.data.success,
        });

        // console.log('currentInvoice: ', currentInvoice);
        if (currentInvoice.id === "") {
          //New
          getDataSingleFromServer(res.data.id);
        } else {
          //Edit
          getDataSingleFromServer(currentInvoice.id);
        }
      });
    } else {
      props.openNoticeModal({
        isOpen: true,
        msg: "Please enter required fields.",
        msgtype: 0,
      });
    }
  }

  return (
    <>
      <div class="bodyContainer">
        <div class="topHeader">
          {dataTypeId === 1 && (
            <h3>
              Home ❯ Data Collection ❯ গ্রুপের তথ্য সংগ্রহ (PG data collection)
            </h3>
          )}

          {dataTypeId === 2 && (
            <h3>
              Home ❯ Data Collection ❯ খামারীর তথ্য (Farmers Data Collection)
            </h3>
          )}

          {dataTypeId === 3 && (
            <h3>Home ❯ Data Collection ❯ এলজিডি তথ্য (LGD Data Collection)</h3>
          )}
        </div>

        {listEditPanelToggle && (
          <>
            {/* <!-- TABLE SEARCH AND GROUP ADD --> */}
            <div class="searchAdd">
              {/* <input type="text" placeholder="Search Product Group"/> */}
              <label></label>

              {/* <Button label={"ADD"} class={"btnAdd"} onClick={addData} /> */}
              <Button label={"Enter Data"} class={"btnAdd"} onClick={addData} />
            </div>

            {/* <!-- ####---Master invoice list---####s --> */}
            <div class="subContainer">
              <div className="App">
                <CustomTable
                  columns={masterColumnList}
                  rows={dataList ? dataList : {}}
                  actioncontrol={actioncontrolmaster}
                  ispagination={false}
                />
              </div>
            </div>
          </>
        )}

        {!listEditPanelToggle && (
          <>
            {!currentInvoice.BPosted && (
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

                  <div class="formControl">
                    <label>পিজি গ্রুপ (PG Group):</label>
                    <Autocomplete
                      autoHighlight
                      // freeSolo
                      className="chosen_dropdown"
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
                  </div>

                  {/* 
Rubel */}

                  {/* questionsList */}

                  {/* menuList.forEach((menu, i) => {
      if (menu.MenuKey === pMenuKey) {
        isShow = 1;
        return;
      }
    }); */}

                  {/* <tr> */}
                  {/* {Object.keys(questionsList).length} */}

                  {questionsList.map((question) => {
                    // console.log("question: ", question.QuestionType);
                    // console.log("question: ", question.QuestionCode);

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
                          <div class="formControl">
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
                          <div class="formControl">
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

                          <div class="formControl">
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
                                    manyDataList[question.QuestionCode] === true
                                    ||
                                    manyDataList[question.QuestionCode] === "1"
                                  }
                                  onChange={(e) => handleChangeRadioMany(e,question.QuestionCode,question.QuestionParentId)}
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
                          <div class="formControl">
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
                          <div class="formControl">
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
                        </>
                      );
                    } else if (question.QuestionType === "Check") {
                      return (
                        <>
                          <div class="formControl">
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
                          <div class="formControl">
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
                          <div class="formControl">
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
                              value={manyDataList.hasOwnProperty(question.QuestionCode)?manyDataList[question.QuestionCode]:""}
                              onChange={(e) => handleChangeMany(e)}
                            />
                          </div>
                        </>
                      );
                    } else {
                      return (
                        <>
                          <div class="formControl">
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
                              value={manyDataList.hasOwnProperty(question.QuestionCode)?manyDataList[question.QuestionCode]:""}
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

                  <div class="formControl">
                    <label> মন্তব্য (Remarks):</label>

                    <textarea
                      type="text"
                      id="Remarks"
                      name="Remarks"
                      value={currentInvoice.Remarks}
                      onChange={(e) => handleChangeMaster(e)}
                      rows={4}
                    />
                  </div>

                  <div class="formControl">
                    <label>
                      তথ্য সংগ্রহকারীর নাম: (Name of data collector)*:
                    </label>

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
                    <label>
                      তথ্য সংগ্রহের তারিখঃ (Date of data collection)*:
                    </label>

                    <input
                      type="date"
                      id="DataCollectionDate"
                      name="DataCollectionDate"
                      class={errorObjectMaster.DataCollectionDate}
                      value={currentInvoice.DataCollectionDate}
                      onChange={(e) => handleChangeMaster(e)}
                    />
                  </div>

                  <div class="btnAddForm">
                    <Button
                      label={"সংরক্ষণ করুন (Save)"}
                      class={"btnAddCustom"}
                      onClick={saveData}
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
