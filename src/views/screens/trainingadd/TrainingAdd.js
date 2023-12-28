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
import FarmerAddModal from "./FarmerAddModal";
/* import FarmerInfoModal from "./FarmerInfoModal"; */
/* import PGInfoModal from "./PGInfoModal"; */

const DataCollectionEntry = (props) => {
  // console.log("props.DataTypeId: ", props.DataTypeId);
  const serverpage = "trainingadd"; // this is .php server page

  const { useState } = React;

  const [listEditPanelToggle, setListEditPanelToggle] = useState(true); //when true then show list, when false then show add/edit

  const [bFirst, setBFirst] = useState(true);
  const [currentRow, setCurrentRow] = useState([]);

  const { isLoading, data: dataList, error, ExecuteQuery } = ExecuteQueryHook(); //Fetch data
  const {
    isLoadig2,
    data: dataListMany,
    error2,
    ExecuteQuery: ExecuteQueryMany,
  } = ExecuteQueryHook();
  const UserInfo = LoginUserInfo();

  const [currentFilter, setCurrentFilter] = useState([]);
  const [divisionList, setDivisionList] = useState(null);
  const [districtList, setDistrictList] = useState(null);
  const [upazilaList, setUpazilaList] = useState(null);

  const [currDivisionId, setCurrDivisionId] = useState(UserInfo.DivisionId);
  const [currDistrictId, setCurrDistrictId] = useState(UserInfo.DistrictId);
  const [currUpazilaId, setCurrUpazilaId] = useState(UserInfo.UpazilaId);

  const [showModal, setShowModal] = useState(false); //true=show modal, false=hide modal

  /* =====Start of Excel Export Code==== */
  const EXCEL_EXPORT_URL = process.env.REACT_APP_API_URL;

  const PrintPDFExcelExportFunction = (reportType) => {
    let finalUrl = EXCEL_EXPORT_URL + "report/print_pdf_excel_server.php";

    window.open(
      finalUrl +
        "?action=TrainingDataExport" +
        "&reportType=excel" +
        "&DivisionId=" +
        currDivisionId +
        "&DistrictId=" +
        currDistrictId +
        "&UpazilaId=" +
        currUpazilaId +
        "&TimeStamp=" +
        Date.now()
    );
  };
  /* =====End of Excel Export Code==== */

  const columnList = [
    { field: "rownumber", label: "SL", align: "center", width: "3%" },
    // { field: 'SL', label: 'SL',width:'10%',align:'center',visible:true,sort:false,filter:false },
    {
      field: "id",
      label: "id",
      width: "10%",
      align: "center",
      visible: false,
      sort: false,
      filter: false,
    },
    {
      field: "TrainingId",
      label: "TrainingId",
      width: "10%",
      align: "center",
      visible: false,
      sort: false,
      filter: false,
    },
    {
      field: "TrainingDate",
      label: "Training Date",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "7%",
    },
    {
      field: "TrainingTitle",
      label: "Training Title",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
    },

    {
      field: "TrainingDescription",
      label: "Training Description",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "11%",
    },

    {
      field: "Venue",
      label: "Venue",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "12%",
    },

    {
      field: "DivisionName",
      label: "Division",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "9%",
    },
    {
      field: "DistrictName",
      label: "District",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "9%",
    },
    {
      field: "UpazilaName",
      label: "Upazila",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "9%",
    },
    {
      field: "PGName",
      label: "PG",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "15%",
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

    getDivision(UserInfo.DivisionId, UserInfo.DistrictId, UserInfo.UpazilaId);

    //getDataList();
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
      DivisionId: "",
      DistrictId: "",
      UpazilaId: "",
      PGId: "",
      TrainingDate: "",
      TrainingTitle: "",
      TrainingDescription: "",
      Venue: "",
    });

    setCurrentRow_form({
      TrainingId: "",
      id: "",
      DivisionId: "",
      DistrictId: "",
      UpazilaId: "",
      PGId: "",
      TrainingDate: "",
      TrainingTitle: "",
      TrainingDescription: "",
      Venue: "",
    });
    /* openModal(); */

    setListEditPanelToggle(false); // false = hide list and show add/edit panel
  };

  const editData = (rowData) => {
    console.log("rowData: ", rowData);
    // console.log("dataList: ", dataList);

    setCurrentRow(rowData);
    setCurrentRow_form(rowData);
    /* openModal(); */
    setTrainingIdStatus(true);
    setListEditPanelToggle(false); // false = hide list and show add/edit panel
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
     /*  setDivisionList([{ id: "", name: "All" }].concat(res.data.datalist)); */
     setDivisionList(
      res.data.datalist
    );

      //setCurrDivisionId(selectDivisionId);

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

  {
    /* ============ENTRY FORM===================
============ENTRY FORM=======================
============ENTRY FORM=======================
============================================= */
  }

  const [currentRow_form, setCurrentRow_form] = useState({});
  const [errorObject_form, setErrorObject_form] = useState({});

  const [divisionList_form, setDivisionList_form] = useState(null);
  const [districtList_form, setDistrictList_form] = useState(null);
  const [upazilaList_form, setUpazilaList_form] = useState(null);
  const [pgList_form, setPGList_form] = useState(null);

  const [currDivisionId_form, setCurrDivisionId_form] = useState(null);
  const [currDistrictId_form, setCurrDistrictId_form] = useState(null);
  const [currUpazilaId_form, setCurrUpazilaId_form] = useState(null);
  const [currPGId_form, setCurrPGId_form] = useState(null);

  useEffect(() => {
    getDivision_form(
      currentRow_form.DivisionId,
      currentRow_form.DistrictId,
      currentRow_form.UpazilaId,
      currentRow_form.PGId
    );
  }, [currentRow_form]);

  function getDivision_form(
    selectDivisionId,
    SelectDistrictId,
    selectUpazilaId,
    selectUnionId
  ) {
    let params = {
      action: "DivisionList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      /* setDivisionList_form(
        [{ id: "", name: "Select Division" }].concat(res.data.datalist)
      );
 */

      setDivisionList_form(
        res.data.datalist
      );
      setCurrDivisionId_form(selectDivisionId);

      getDistrict_form(
        selectDivisionId,
        SelectDistrictId,
        selectUpazilaId,
        selectUnionId
      );
    });
  }

  function getDistrict_form(
    selectDivisionId,
    SelectDistrictId,
    selectUpazilaId,
    selectUnionId
  ) {
    let params = {
      action: "DistrictList",
      lan: language(),
      UserId: UserInfo.UserId,
      DivisionId: selectDivisionId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setDistrictList_form(
        [{ id: "", name: "Select District" }].concat(res.data.datalist)
      );
      setErrorObject_form({ ...errorObject_form, ["DistrictId"]: null });

      setCurrDistrictId_form(SelectDistrictId);
      getUpazila_form(
        selectDivisionId,
        SelectDistrictId,
        selectUpazilaId,
        selectUnionId
      );
    });
  }

  function getUpazila_form(
    selectDivisionId,
    SelectDistrictId,
    selectUpazilaId,
    selectUnionId
  ) {
    let params = {
      action: "UpazilaList",
      lan: language(),
      UserId: UserInfo.UserId,
      DivisionId: selectDivisionId,
      DistrictId: SelectDistrictId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setUpazilaList_form(
        [{ id: "", name: "Select Upazila" }].concat(res.data.datalist)
      );
      setErrorObject_form({ ...errorObject_form, ["UpazilaId"]: null });

      setCurrUpazilaId_form(selectUpazilaId);
      getUnion_form(
        selectDivisionId,
        SelectDistrictId,
        selectUpazilaId,
        selectUnionId
      );
    });
  }

  function getUnion_form(
    selectDivisionId,
    SelectDistrictId,
    selectUpazilaId,
    selectUnionId
  ) {
    let params = {
      action: "PgGroupList",
      lan: language(),
      UserId: UserInfo.UserId,
      DivisionId: selectDivisionId,
      DistrictId: SelectDistrictId,
      UpazilaId: selectUpazilaId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setPGList_form([{ id: "", name: "Select PG" }].concat(res.data.datalist));
      setErrorObject_form({ ...errorObject_form, ["PGId"]: null });

      setCurrPGId_form(selectUnionId);
    });
  }

  const handleChange_form = (e) => {
    const { name, value } = e.target;
    let data = { ...currentRow_form };
    data[name] = value;
    setCurrentRow_form(data);
    setErrorObject_form({ ...errorObject_form, [name]: null });
  };

  const handleChange_form_dipendency = (e) => {
    const { name, value } = e.target;
    let data = { ...currentRow_form };
    data[name] = value;
    setCurrentRow_form(data);
    setErrorObject_form({ ...errorObject_form, [name]: null });

    // for dependency
    if (name === "DivisionId") {
      setCurrDivisionId_form(value);

      setCurrDistrictId_form("");
      setCurrUpazilaId_form("");
      getDistrict_form(value, "", "", "");
      getUpazila_form(value, "", "", "");
      getUnion_form(value, "", "", "");
    } else if (name === "DistrictId") {
      setCurrDistrictId_form(value);
      getUpazila_form(currentRow_form.DivisionId, value, "", "");
    } else if (name === "UpazilaId") {
      setCurrUpazilaId_form(value);
      getUnion_form(
        currentRow_form.DivisionId,
        currentRow_form.DistrictId,
        value,
        ""
      );
    } else if (name === "PGId") {
      setCurrPGId_form(value);
    }
  };

  function handleChangeCheck(e) {
    const { name } = e.target;

    let data = { ...currentRow_form };
    data[name] = e.target.checked;
    setCurrentRow_form(data);
  }

  const validateForm = () => {
    let validateFields = [
      "TrainingDate",
      "DivisionId",
      "DistrictId",
      "UpazilaId",
      "PGId",
      "TrainingTitle",
      "TrainingDescription",
      "Venue",
    ];
    let errorData = {};
    let isValid = true;
    validateFields.map((field) => {
      if (!currentRow_form[field]) {
        errorData[field] = "validation-style";
        isValid = false;
      }
    });
    setErrorObject_form(errorData);
    return isValid;
  };

  const [apiCallSuccess, setApiCallSuccess] = useState(false);

  const [trainingIdStatus, setTrainingIdStatus] = useState(false);

  function addEditAPICall() {
    if (validateForm()) {
      // Check if DistrictId is ""
      if (currDistrictId_form === "") {
        setErrorObject_form({
          ...errorObject_form,
          ["DistrictId"]: "validation-style",
        });
        return;
      }

      // Check if UpazilaId is ""
      if (currUpazilaId_form === "") {
        setErrorObject_form({
          ...errorObject_form,
          ["UpazilaId"]: "validation-style",
        });
        return;
      }
      // Check if UnionId is ""
      if (currPGId_form === "") {
        setErrorObject_form({
          ...errorObject_form,
          ["PGId"]: "validation-style",
        });
        return;
      }

      let params = {
        action: "dataAddEdit",
        lan: language(),
        UserId: UserInfo.UserId,
        rowData: currentRow_form,
      };

      apiCall
        .post(serverpage, { params }, apiOption())
        .then((res) => {
          props.openNoticeModal({
            isOpen: true,
            msg: res.data.message,
            msgtype: res.data.success,
          });

          if (res.data.success === 1) {
            console.log("res------------- ", res.data.LastTrainingId);
            setTrainingIdStatus(true); // Enable the button on success

            setCurrentRow_form({
              TrainingId: res.data.LastTrainingId,
              id: res.data.LastTrainingId,
              DivisionId: currentRow_form
                ? currentRow_form.DivisionId
                : res.data.LastInsertid[0].DivisionId,
              DistrictId: currentRow_form
                ? currentRow_form.DistrictId
                : res.data.LastInsertid[0].DistrictId,
              UpazilaId: currentRow_form
                ? currentRow_form.UpazilaId
                : res.data.LastInsertid[0].UpazilaId,
              PGId: currentRow_form
                ? currentRow_form.PGId
                : res.data.LastInsertid[0].PGId,
              TrainingDate: currentRow_form
                ? currentRow_form.TrainingDate
                : res.data.LastInsertid[0].TrainingDate,
              TrainingTitle: currentRow_form
                ? currentRow_form.TrainingTitle
                : res.data.LastInsertid[0].TrainingTitle,
              TrainingDescription: currentRow_form
                ? currentRow_form.TrainingDescription
                : res.data.LastInsertid[0].TrainingDescription,
              Venue: currentRow_form
                ? currentRow_form.Venue
                : res.data.LastInsertid[0].Venue,
            });

            // Set the API call success state to true
            setApiCallSuccess(true);
          }
        })
        .catch((error) => {
          // Handle API call error
          setApiCallSuccess(false);
          setTrainingIdStatus(false); // Disable the button on error
        });
    }
  }

  useEffect(() => {
    console.log("currentRow_form in useEffect: ", currentRow_form);
    console.log("currentRow_form.id in useEffect: ", currentRow_form.id);
  }, [currentRow_form, trainingIdStatus]);

  function modalClose() {
    props.modalCallback("close");
  }

  const handleChangeMany_form_form = (newValue, propertyName) => {
    let data = { ...currentRow_form };
    data[propertyName] = newValue;
    setCurrentRow_form(data);
  };

  const backToList = () => {
    setErrorObject_form({});
    setListEditPanelToggle(true); // true = show list and hide add/edit panel
    getDataList(); //invoice list
  };

  {
    /* =============================================
============END ENTRY FORM=======================
============END ENTRY FORM=======================
============================================= */
  }

  {
    /* ============Start Farmer Pick===================
============Start Farmer Pick=======================
============Start Farmer Pick=======================
==================================================== */
  }

  const addFarmerPick = () => {
    // console.log("rowData: ", rowData);
    // console.log("dataList: ", dataList);

    /* setCurrentRow({
    id: "",
    MapType: "",
    DataTypeId: currDataTypeId,
    SurveyId: currSurveyId,
  }); */

    /* setCurrentRow_form({
    TrainingId: "",
  }); */

    openModal();
  };

  function openModal() {
    setShowModal(true);
  }

  function modalCallback(response) {
    if (response !== "close") {
      getDataListMany();
    }
    setShowModal(false); //true=modal show, false=modal hide
  }

  const columnListMany = [
    { field: "rownumber", label: "SL", align: "center", width: "3%" },
    {
      field: "id",
      label: "id",
      width: "10%",
      align: "center",
      visible: false,
      sort: false,
      filter: false,
    },
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
      visible: false,
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
      width: "7%",
      align: "center",
      visible: true,
      sort: false,
      filter: false,
    },
  ];

  function getDataListMany() {
    let params = {
      action: "getDataListMany",
      lan: language(),
      UserId: UserInfo.UserId,
      TrainingId: currentRow_form.id,
    };

    ExecuteQueryMany(serverpage, params);
  }

  useEffect(() => {
    getDataListMany();
  }, [currentRow_form.id]);

  function actioncontrolMany(rowData) {
    return (
      <>
        <DeleteOutline
          className={"table-delete-icon"}
          onClick={() => {
            deleteDataMany(rowData);
          }}
        />
      </>
    );
  }

  const deleteDataMany = (rowData) => {
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
        deleteManyApi(rowData);
      }
    });
  };

  function deleteManyApi(rowData) {
    let params = {
      action: "deleteDataMany",
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
      getDataListMany();
    });
  }

  {
    /* ============End Farmer Pick===================
============End Farmer Pick=======================
============End Farmer Pick=======================
==================================================== */
  }

  return (
    <>
      <div class="bodyContainer">
        {/* <!-- ######-----TOP HEADER-----####### --> */}
        <div class="topHeader">
          <h4>Home ❯ Admin ❯ Training</h4>
        </div>

        {/* <!-- TABLE SEARCH AND GROUP ADD --> */}

        {listEditPanelToggle && (
          <>
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
                <Button label={"ADD"} class={"btnAdd"} onClick={addData} />
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
          </>
        )}

        {!listEditPanelToggle && (
          <>
            {/* {!currentInvoice.BPosted && ( */}
            {1 == 1 && (
              <div class="subContainer inputArea">
                <div class="text-center">
                  {/*  <h2>{entryFormTitle}</h2> */}
                  {/* <h2>গ্রুপের তথ্য সংগ্রহ ফরম (PG data collection form)</h2> */}
                </div>

                <div
                  class="input-areaPartition grid-container"
                  id="areaPartion-x"
                >
                  <div class="alignRightText">
                    <Button
                      label={"Save"}
                      class={"btnSave"}
                      onClick={addEditAPICall}
                    />

                    <Button
                      label={"Back To List"}
                      class={"btnClose"}
                      onClick={backToList}
                    />
                  </div>

                  <div className="contactmodalBodyOnePage pt-10">
                    <label>Training Date* </label>
                    <input
                      type="date"
                      id="TrainingDate"
                      name="TrainingDate"
                      class={errorObject_form.TrainingDate}
                      placeholder="Select Training Date"
                      value={currentRow_form.TrainingDate}
                      onChange={(e) => handleChange_form(e)}
                    />

                    <label>Division *</label>
                    <select
                      id="DivisionId"
                      name="DivisionId"
                      className={errorObject_form.DivisionId}
                      value={currDivisionId_form}
                      onChange={(e) => handleChange_form_dipendency(e)}
                    >
                      {divisionList_form &&
                        divisionList_form.map((item, index) => {
                          return <option value={item.id}>{item.name}</option>;
                        })}
                    </select>
                  </div>

                  <div class="contactmodalBodyOnePage pt-10">
                    <label>District *</label>
                    <select
                      id="DistrictId"
                      name="DistrictId"
                      className={errorObject_form.DistrictId}
                      value={currDistrictId_form}
                      onChange={(e) => handleChange_form_dipendency(e)}
                    >
                      {districtList_form &&
                        districtList_form.map((item, index) => {
                          return <option value={item.id}>{item.name}</option>;
                        })}
                    </select>

                    <label>Upazila *</label>
                    <select
                      id="UpazilaId"
                      name="UpazilaId"
                      className={errorObject_form.UpazilaId}
                      value={currUpazilaId_form}
                      onChange={(e) => handleChange_form_dipendency(e)}
                    >
                      {upazilaList_form &&
                        upazilaList_form.map((item, index) => {
                          return <option value={item.id}>{item.name}</option>;
                        })}
                    </select>
                  </div>

                  <div class="contactmodalBodyOnePage pt-10">
                    <label>PG *</label>
                    <select
                      id="PGId"
                      name="PGId"
                      className={errorObject_form.PGId}
                      value={currPGId_form}
                      onChange={(e) => handleChange_form_dipendency(e)}
                    >
                      {pgList_form &&
                        pgList_form.map((item, index) => {
                          return <option value={item.id}>{item.name}</option>;
                        })}
                    </select>

                    <label>Training Title *</label>
                    <input
                      type="text"
                      id="TrainingTitle"
                      name="TrainingTitle"
                      class={errorObject_form.TrainingTitle}
                      placeholder="Enter Training Title"
                      value={currentRow_form.TrainingTitle}
                      onChange={(e) => handleChange_form(e)}
                    />
                  </div>

                  <div class="contactmodalBodyOnePage pt-10">
                    <label>Training Description *</label>
                    <input
                      type="text"
                      id="TrainingDescription"
                      name="TrainingDescription"
                      class={errorObject_form.TrainingDescription}
                      placeholder="Enter Training Description"
                      value={currentRow_form.TrainingDescription}
                      onChange={(e) => handleChange_form(e)}
                    />

                    <label>Venue *</label>
                    <input
                      type="text"
                      id="Venue"
                      name="Venue"
                      class={errorObject_form.Venue}
                      placeholder="Enter Venue"
                      value={currentRow_form.Venue}
                      onChange={(e) => handleChange_form(e)}
                    />
                  </div>

                  <div class="alignRightText">
                    <Button
                      label={"Select Farmer"}
                      class={"btnSelect"}
                      onClick={addFarmerPick}
                      //disabled={!currentRow_form.id || !trainingIdStatus}
                      disabled={!currentRow_form.id || !trainingIdStatus}
                    />
                  </div>

                  <div class="subContainer">
                    <div className="App">
                      <CustomTable
                        columns={columnListMany}
                        rows={dataListMany ? dataListMany : {}}
                        actioncontrol={actioncontrolMany}
                        ispagination={false}
                        isLoading={isLoading}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {showModal && (
        <FarmerAddModal
          masterProps={props}
          currentRow={currentRow_form}
          modalCallback={modalCallback}
        />
      )}
    </>
  );
};

export default DataCollectionEntry;
