import React, { forwardRef, useRef, useEffect } from "react";
import swal from "sweetalert";
import { DeleteOutline, Edit, ViewList,InsertCommentTwoTone } from "@material-ui/icons";
import { Button } from "../../../components/CustomControl/Button";

import CustomTable from "components/CustomTable/CustomTable";
import {
  apiCall,
  apiOption,
  LoginUserInfo,
  language,
} from "../../../actions/api";
import ExecuteQueryHook from "../../../components/hooks/ExecuteQueryHook";

import { Typography, TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

import PgEntryFormAddEditModal from "./PgEntryFormAddEditModal";

const PgEntryForm = (props) => {
  const serverpage = "pgentryform"; // this is .php server page

  const { useState } = React;
  const [listEditPanelToggle, setListEditPanelToggle] = useState(true);
  const [bFirst, setBFirst] = useState(true);
  const [currentRow, setCurrentRow] = useState([]);
  const [showModal, setShowModal] = useState(false); //true=show modal, false=hide modal

  const { isLoading, data: dataList, error, ExecuteQuery } = ExecuteQueryHook(); //Fetch data
  const UserInfo = LoginUserInfo();

  const [currentFilter, setCurrentFilter] = useState([]);
  const [divisionList, setDivisionList] = useState(null);
  const [districtList, setDistrictList] = useState(null);
  const [upazilaList, setUpazilaList] = useState(null);

  const [currDivisionId, setCurrDivisionId] = useState(UserInfo.DivisionId);
  const [currDistrictId, setCurrDistrictId] = useState(UserInfo.DistrictId);
  const [currUpazilaId, setCurrUpazilaId] = useState(UserInfo.UpazilaId);

  const [farmerStatusList, setFarmerStatusList] = useState([]);
  const [currFarmerStatusId, setCurrFarmerStatusId] = useState('Active');

  const [showReturnCommentsModal, setShowReturnCommentsModal] = useState(false); //true=show modal, false=hide modal
  const [returnCommentsObj, setReturnCommentsObj] = useState({
    id: 0,
    statusid: 0,
    nextprev: "",
    comments: "",
  }); //true=show modal, false=hide modal

  /* =====Start of Excel Export Code==== */
  const EXCEL_EXPORT_URL = process.env.REACT_APP_API_URL;

  const PrintPDFExcelExportFunction = (reportType) => {
    let finalUrl = EXCEL_EXPORT_URL + "report/print_pdf_excel_server.php";

    window.open(
      finalUrl +
        "?action=PGDataExport" +
        "&reportType=excel" +
        "&FarmerStatusId=" +
        currFarmerStatusId +
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
      field: "PgGroupCode",
      label: "Group Code",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "7%",
    },
    {
      field: "PGName",
      label: "PG Name",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
    },

    {
      field: "PgBankAccountNumber",
      label: "Bank Account",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "5%",
    },

    {
      field: "BankName",
      label: "Bank Name",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "6%",
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
      field: "DivisionName",
      label: "Division",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "5%",
    },
    {
      field: "DistrictName",
      label: "District",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "7%",
    },
    {
      field: "UpazilaName",
      label: "Upazila",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "7%",
    },
    {
      field: "UnionName",
      label: "Union",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "5%",
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
      label: "Action",
      width: "11%",
      align: "center",
      visible: true,
      sort: false,
      filter: false,
    },
  ];

  if (bFirst) {
    /**First time call for datalist */
    getfarmerStatusList();
    getDivision(UserInfo.DivisionId, UserInfo.DistrictId, UserInfo.UpazilaId);

    //getDataList();
    setBFirst(false);
  }

  function getfarmerStatusList() {
    let params = {
      action: "ActiveStatusList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {

      const activeItem = res.data.datalist.find((item) => item.id === "Active");

      // Set the selected value to "Active" or fallback to the first item's id
      setCurrFarmerStatusId(activeItem ? activeItem.id : res.data.datalist[0]["id"]);
  
      //setCurrFarmerStatusId(res.data.datalist[0]["id"]);

      setFarmerStatusList(res.data.datalist);
      
      /* getDataList(res.data.datalist[0]["id"]); */
    });
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
      FarmerStatusId: currFarmerStatusId,
    };
    // console.log('LoginUserInfo params: ', params);

    ExecuteQuery(serverpage, params);
  }

  /** Action from table row buttons*/
  function actioncontrol(rowData) {
    // console.log("UserInfo", UserInfo);
    // console.log("StatusChangeAllow", UserInfo.StatusChangeAllow);
    let StatusChangeAllow = UserInfo.StatusChangeAllow;
    // let sub = StatusChangeAllow.includes("Submit");
    // console.log('sub: ', sub);

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
        />  */}

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

        {(rowData.StatusId != 1 || UserInfo.UserId != rowData.UserId) && (UserInfo.Settings.AllowEditApprovedData == "0") && (
          <ViewList
            className={"table-view-icon"}
            onClick={() => {
              editData(rowData);
            }}
          />
        )}
      </>
    );
  }


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

  const addData = () => {
    // console.log("rowData: ", rowData);
    // console.log("dataList: ", dataList);

    setCurrentRow({
      id: "",
      PGName: "",
      DivisionId: UserInfo.DivisionId,
      DistrictId: UserInfo.DistrictId,
      UpazilaId: UserInfo.UpazilaId,
      Address: "",
      UnionId: "",
      PgGroupCode: "",
      PgBankAccountNumber: "",
      BankName: "",
      ValuechainId: "",
      IsLeadByWomen: 0,
      GenderId: "",
      IsActive: 1,
      BankId: "",
      DateofPgInformation: "",
      Latitute: "",
      Longitute: "",
    });
    /* openModal(); */
    setListEditPanelToggle(false);
  };

  const editData = (rowData) => {
    // console.log("rowData: ", rowData);
    // console.log("dataList: ", dataList);

    setCurrentRow(rowData);
   /*  openModal(); */
   setListEditPanelToggle(false);
  };

  function openModal() {
    setShowModal(true); //true=modal show, false=modal hide
  }

  function modalCallback(response) {
    //response = close, addedit
    // console.log('response: ', response);
    /* getDataList(); */
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
  }, [currDivisionId, currDistrictId, currUpazilaId, currFarmerStatusId]);

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
      // DataTypeId: dataTypeId,
      // YearId: currFilterYearId,
      // QuarterId: currFilterQuarterId,
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
    console.log("returnCommentsObj: ", returnCommentsObj);

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


  const backToList = () => {
    setListEditPanelToggle(true); // true = show list and hide add/edit panel
  };


  const handleChangeChoosenMany = (name, value) => {

    if (name === 'ActiveStatusId'){
      setCurrFarmerStatusId(value);

    }

  };

  
  return (
    <>
      <div class="bodyContainer">
        {/* <!-- ######-----TOP HEADER-----####### --> */}
        <div class="topHeader">
          <h4>Home ❯ Admin ❯ PG Profile</h4>

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
        <div class="searchAddFourFilter">
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

          <div class="formControl-filter-data-label">
                  <label>Status:</label>

                  {/* <div class="plusGroup"> */}
                  <div class="">
                    <Autocomplete
                      autoHighlight
                      // freeSolo
                      disableClearable
                      className="chosen_dropdown"
                      id="ActiveStatusId"
                      name="ActiveStatusId"
                      autoComplete
                      options={farmerStatusList ? farmerStatusList : []}
                      getOptionLabel={(option) => option.name}
                      defaultValue={{ id: "Active", name: "Active" }}
                      onChange={(event, valueobj) =>
                        handleChangeChoosenMany(
                          "ActiveStatusId",
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
                </div>

          <div class="filter-button">
            {/* <Button label={"ADD"} class={"btnAdd"} onClick={addData} /> */}
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
              <Button label={"Enter Data"} class={"btnAdd"} onClick={addData} />
            )}

            <Button
              label={"Export"}
              class={"btnPrint"}
              onClick={PrintPDFExcelExportFunction}
            />
          </div>
        </div>

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

                    <PgEntryFormAddEditModal
                    masterProps={props}
                    currentRow={currentRow}
                    modalCallback={modalCallback}
                    />
              )}
              </>
            )}
            

      </div>


      {/* <!-- BODY CONTAINER END --> */}

      {/* {showModal && (
        <PgEntryFormAddEditModal
          masterProps={props}
          currentRow={currentRow}
          modalCallback={modalCallback}
        />
      )} */}
    </>
  );
};

export default PgEntryForm;
