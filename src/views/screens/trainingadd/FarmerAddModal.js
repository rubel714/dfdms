import React, { forwardRef, useRef, useEffect, useState } from "react";
import { Button } from "../../../components/CustomControl/Button";

import CustomTable from "components/CustomTable/CustomTable";
import {
  apiCall,
  apiOption,
  LoginUserInfo,
  language,
} from "../../../actions/api";
import ExecuteQueryHook from "../../../components/hooks/ExecuteQueryHook";
import isEqual from "lodash/isEqual";

const FarmerAddModal = (props) => {
  const { useState } = React;
  const [bFirstm, setBFirstm] = useState(true);
  console.log("currentRow-modal ------ ", props.currentRow);
  // console.log('props modal: ', props);
  const serverpage = "trainingadd"; // this is .php server page
  const [currentRow, setCurrentRow] = useState(props.currentRow);
  const [errorObject, setErrorObject] = useState({});

  const { isLoading, data: dataList, error, ExecuteQuery } = ExecuteQueryHook(); //Fetch data
  const UserInfo = LoginUserInfo();

  const [currentFilter, setCurrentFilter] = useState([]);
  const [divisionList, setDivisionList] = useState(null);
  const [districtList, setDistrictList] = useState(null);
  const [upazilaList, setUpazilaList] = useState(null);

  const [currDivisionId, setCurrDivisionId] = useState(props.currentRow.DivisionId);
  const [currDistrictId, setCurrDistrictId] = useState(props.currentRow.DistrictId);
  const [currUpazilaId, setCurrUpazilaId] = useState(props.currentRow.UpazilaId);

  const columnList = [
    { field: "rownumber", label: "SL", align: "center", width: "3%" },
    {
      field: "id",
      label: "id",
      width: "5",
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
      width: "100",
    },

    {
      field: "NID",
      label: "Beneficiary NID",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "100",
    },
    {
      field: "Phone",
      label: "Mobile Number",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "100",
    },
    {
      field: "FatherName",
      label: "Father's Name",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "100",
    },
    {
      field: "MotherName",
      label: "Mother's Name",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "100",
    },
    {
      field: "SpouseName",
      label: "Spouse Name",
      align: "left",
      visible: false,
      sort: true,
      filter: true,
      width: "100",
    },
    {
      field: "GenderName",
      label: "Gender",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "100",
    },
    {
      field: "FarmersAge",
      label: "Farmer's Age",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "100",
    },
    {
      field: "ValueChainName",
      label: "Value Chain",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "100",
    },
    {
      field: "PGName",
      label: "Name of Producer Group",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "100",
    },
    {
      field: "IsRegularBeneficiary",
      label: "Is Regular Beneficiary?",
      align: "center",
      visible: false,
      sort: true,
      filter: true,
      width: "50",
    },
  ];

  function getDivision(selectDivisionId, SelectDistrictId, selectUpazilaId) {
    let params = {
      action: "DivisionFilterList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      /* setDivisionList([{ id: "", name: "All" }].concat(res.data.datalist)); */
      
      setDivisionList(
        res.data.datalist
      );

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
    let data = { ...currentRow };
    data[name] = value;
    setCurrentRow(data);
    // console.log('aaa data: ', data);

    setErrorObject({ ...errorObject, [name]: null });

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

  function handleChangeCheck(e) {
    // console.log('e.target.checked: ', e.target.checked);
    const { name, value } = e.target;

    let data = { ...currentRow };
    data[name] = e.target.checked;
    setCurrentRow(data);
    //  console.log('aaa data: ', data);
  }

  const validateForm = () => {
    // let validateFields = ["MapType", "DiscountAmount", "DiscountPercentage"]
    let validateFields = ["MapType"];
    let errorData = {};
    let isValid = true;
    validateFields.map((field) => {
      if (!currentRow[field]) {
        errorData[field] = "validation-style";
        isValid = false;
      }
    });
    setErrorObject(errorData);
    return isValid;
  };

  function addAPICall() {
    let params = {
      action: "farmerAdd",
      lan: language(),
      UserId: UserInfo.UserId,
      DivisionId: props.currentRow.DivisionId,
      DistrictId: props.currentRow.DistrictId,
      UpazilaId: props.currentRow.UpazilaId,
      PGId: props.currentRow.PGId,
      TrainingId: props.currentRow.id,
      rowData: selectedRows,
    };

    apiCall.post(serverpage, { params }, apiOption()).then((res) => {
      // console.log('res: ', res);

      props.masterProps.openNoticeModal({
        isOpen: true,
        msg: res.data.message,
        msgtype: res.data.success,
      });

      // console.log('props modal: ', props);
      if (res.data.success === 1) {
        props.modalCallback("addedit");
      }
    });
  }

  function modalClose() {
    console.log("props modal: ", props);
    props.modalCallback("close");
  }

  if (bFirstm) {
    /**First time call for datalist */

    getDivision(
      props.currentRow.DivisionId,
      props.currentRow.DistrictId,
      props.currentRow.UpazilaId
    );

    /* getFarmerDataListModal(); */
    setBFirstm(false);
  }

  /**Get data for table list */
  function getFarmerDataListModal() {
    let params = {
      action: "getFarmerDataList",
      lan: language(),
      UserId: UserInfo.UserId,
      DivisionId: currDivisionId,
      DistrictId: currDistrictId,
      UpazilaId: currUpazilaId,
      /*  PGId: props.currentRow.PGId, */
    };
    // console.log('LoginUserInfo params: ', params);

    ExecuteQuery(serverpage, params);
  }

  const [selectedRows, setSelectedRows] = useState([]);
  const [unselectedRows, setUnselectedRows] = useState([]);

  const selectable = true;

  // Define the isSelected function
  const isSelected = (row) =>
    selectedRows.some((selectedRow) => isEqual(selectedRow, row));

  const handleRowClick = (row) => {
    // Check if row selection is allowed (based on the selectable prop)
    if (selectable) {
      if (isSelected(row)) {
        // Deselect the row if it's already selected
        setSelectedRows((prevSelectedRows) =>
          prevSelectedRows.filter((selectedRow) => !isEqual(selectedRow, row))
        );
        setUnselectedRows((prevUnselectedRows) => [...prevUnselectedRows, row]);
      } else {
        // Select the row if it's not selected
        setUnselectedRows((prevUnselectedRows) =>
          prevUnselectedRows.filter(
            (unselectedRow) => !isEqual(unselectedRow, row)
          )
        );
        setSelectedRows((prevSelectedRows) => [...prevSelectedRows, row]);
      }
    }
  };

  useEffect(() => {
    getFarmerDataListModal();
  }, [currDivisionId, currDistrictId, currUpazilaId]);

  return (
    <>
      {/* <!-- GROUP MODAL START --> */}
      <div id="groupModal" class="modal">
        {/* <!-- Modal content --> */}
        <div class="modal-content">
          <div class="modalHeader">
            <h4>Select Farmer</h4>
          </div>

          <div class="searchAdd5">
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
              {/* <Button label={"ADD"} class={"btnAdd"} onClick={addData} />
              <Button label={"Export"} class={"btnPrint"} onClick={PrintPDFExcelExportFunction} /> */}
            </div>
          </div>

          <div class="modalItemFixed">
            <CustomTable
              selectable={selectable}
              columns={columnList}
              rows={dataList ? dataList : {}}
              // actioncontrol={actioncontrol}
              handleRowClick={handleRowClick}
              selectedRows={selectedRows}
              isLoading={isLoading}
              ispagination={false}
            />
          </div>

          <div class="modalItem">
            <Button label={"Close"} class={"btnClose"} onClick={modalClose} />
            {/*  {!props.currentRow.id && (<Button label={"Save"} class={"btnSave"} onClick={addAPICall} />)} */}
            <Button label={"Save"} class={"btnSave"} onClick={addAPICall} />
          </div>
        </div>
      </div>
      {/* <!-- GROUP MODAL END --> */}
    </>
  );
};

export default FarmerAddModal;
