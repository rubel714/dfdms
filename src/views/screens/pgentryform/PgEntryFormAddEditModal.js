import React, { forwardRef, useRef, useEffect, useState } from "react";
import { Button } from "../../../components/CustomControl/Button";
import { InfoOutlined } from "@material-ui/icons";
import {
  apiCall,
  apiOption,
  LoginUserInfo,
  language,
} from "../../../actions/api";

const PgEntryFormAddEditModal = (props) => {
  const serverpage = "pgentryform"; // this is .php server page
  const [currentRow, setCurrentRow] = useState(props.currentRow);
  const [errorObject, setErrorObject] = useState({});
  const UserInfo = LoginUserInfo();

  const [divisionList, setDivisionList] = useState(null);
  const [districtList, setDistrictList] = useState(null);
  const [upazilaList, setUpazilaList] = useState(null);
  const [unionList, setUnionList] = useState(null);

  const [currDivisionId, setCurrDivisionId] = useState(null);
  const [currDistrictId, setCurrDistrictId] = useState(null);
  const [currUpazilaId, setCurrUpazilaId] = useState(null);
  const [currUnionId, setCurrUnionId] = useState(null);

  const [questionMapCategory, setQuestionMapCategory] = useState(null);
  const [currQuestionMapCategory, setCurrIsQuestionMapCategory] =
    useState(null);

  const [gender, setGender] = useState(null);
  const [currGender, setCurrGender] = useState(null);
  const [currIsLeadByWomen, setCurrIsLeadByWomen] = useState(0); // or false
  const [currIsActive, setCurrIsActive] = useState(0); // or false
  const [bank, setBank] = useState(null);
  const [currBank, setCurrBank] = useState(null);

  React.useEffect(() => {
    getDivision(
      props.currentRow.DivisionId,
      props.currentRow.DistrictId,
      props.currentRow.UpazilaId,
      props.currentRow.UnionId
    );

    getQuestionMapCategoryList(props.currentRow.ValuechainId);

    getGenderList(props.currentRow.GenderId);
    getBankList(props.currentRow.BankId);

    // Set the initial value of IsLeadByWomen
    if (
      currentRow.IsLeadByWomen !== undefined &&
      currentRow.IsLeadByWomen !== null
    ) {
      setCurrIsLeadByWomen(currentRow.IsLeadByWomen);
    } else {
      // Default to some value (true or false) if IsLeadByWomen is not set in currentRow
      setCurrIsLeadByWomen(0); // or setCurrIsLeadByWomen(false);
    }
    // Set the initial value of IsActive
    if (currentRow.IsActive !== undefined && currentRow.IsActive !== null) {
      setCurrIsActive(currentRow.IsActive);
    } else {
      setCurrIsActive(0);
    }

    //getStrengthList();
    //getManufacturerList();
  }, []);

  function getQuestionMapCategoryList(selectQuestionMapCategory) {
    let params = {
      action: "QuestionMapCategoryList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setQuestionMapCategory(
        [{ id: "", name: "Select Value Chain" }].concat(res.data.datalist)
      );

      setCurrIsQuestionMapCategory(selectQuestionMapCategory);
    });
  }

  function getGenderList(selectGender) {
    let params = {
      action: "GenderList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setGender([{ id: "", name: "Select Gender" }].concat(res.data.datalist));

      setCurrGender(selectGender);
    });
  }

  function getBankList(selectBank) {
    let params = {
      action: "BankList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setBank([{ id: "", name: "Select Bank" }].concat(res.data.datalist));

      setCurrBank(selectBank);
    });
  }

  function getDivision(
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
      setDivisionList(
        [{ id: "", name: "Select Division" }].concat(res.data.datalist)
      );

      /*       setErrorObject({ ...errorObject, ["DistrictId"]: null });
      setErrorObject({ ...errorObject, ["UpazilaId"]: null }); */

      setCurrDivisionId(selectDivisionId);

      getDistrict(
        selectDivisionId,
        SelectDistrictId,
        selectUpazilaId,
        selectUnionId
      );

      /* getProductGeneric(
        selectDivisionId,
        SelectProductGenericId
      ); */
    });
  }

  function getDistrict(
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
      setDistrictList(
        [{ id: "", name: "Select District" }].concat(res.data.datalist)
      );
      setErrorObject({ ...errorObject, ["DistrictId"]: null });

      setCurrDistrictId(SelectDistrictId);
      getUpazila(
        selectDivisionId,
        SelectDistrictId,
        selectUpazilaId,
        selectUnionId
      );
    });
  }

  function getUpazila(
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
      setUpazilaList(
        [{ id: "", name: "Select Upazila" }].concat(res.data.datalist)
      );
      setErrorObject({ ...errorObject, ["UpazilaId"]: null });

      setCurrUpazilaId(selectUpazilaId);
      getUnion(
        selectDivisionId,
        SelectDistrictId,
        selectUpazilaId,
        selectUnionId
      );
    });
  }

  function getUnion(
    selectDivisionId,
    SelectDistrictId,
    selectUpazilaId,
    selectUnionId
  ) {
    let params = {
      action: "UnionList",
      lan: language(),
      UserId: UserInfo.UserId,
      DivisionId: selectDivisionId,
      DistrictId: SelectDistrictId,
      UpazilaId: selectUpazilaId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setUnionList(
        [{ id: "", name: "Select Union" }].concat(res.data.datalist)
      );
      setErrorObject({ ...errorObject, ["UnionId"]: null });

      setCurrUnionId(selectUnionId);
    });
  }

  /*  const handleChange = (e) => {
    const { name, value } = e.target;
    let data = { ...currentRow };
    data[name] = value;
    setCurrentRow(data);
    // console.log('aaa data: ', data);

    setErrorObject({ ...errorObject, [name]: null });

  }; */

  const handleChange = (e) => {
    const { name, value } = e.target;
    let data = { ...currentRow };
    data[name] = value;

    setCurrentRow(data);

    setErrorObject({ ...errorObject, [name]: null });

    //for dependancy
    if (name === "DivisionId") {
      setCurrDivisionId(value);

      setCurrDistrictId("");
      setCurrUpazilaId("");
      getDistrict(value, "", "", "");
      getUpazila(value, "", "", "");
      getUnion(value, "", "", "");
    } else if (name === "DistrictId") {
      setCurrDistrictId(value);
      getUpazila(currentRow.DivisionId, value, "", "");
    } else if (name === "UpazilaId") {
      setCurrUpazilaId(value);
      getUnion(currentRow.DivisionId, currentRow.DistrictId, value, "");
    } else if (name === "UnionId") {
      setCurrUnionId(value);
    }

    if (name === "ValuechainId") {
      setCurrIsQuestionMapCategory(value);
    }

    if (name === "GenderId") {
      setCurrGender(value);
    }
    if (name === "BankId") {
      setCurrBank(value);
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
    // let validateFields = ["PGName", "DiscountAmount", "DiscountPercentage"]
    let validateFields = [
      "PGName",
      "DivisionId",
      "DistrictId",
      "UpazilaId",
      "UnionId",
      "Address",
      "PgGroupCode",
      "PgBankAccountNumber",
      "ValuechainId",
      "BankId",
      "DateofPgInformation",
    ];
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

  function addEditAPICall() {
    if (validateForm()) {
      // Check if DistrictId is ""
      if (currDistrictId === "") {
        // Display an error or show a message indicating that District is required
        setErrorObject({ ...errorObject, ["DistrictId"]: "validation-style" });
        return; // Return early without proceeding with the update
      }

      // Check if UpazilaId is ""
      if (currUpazilaId === "") {
        // Display an error or show a message indicating that Upazila is required
        setErrorObject({ ...errorObject, ["UpazilaId"]: "validation-style" });
        return; // Return early without proceeding with the update
      }
      // Check if UnionId is ""
      if (currUnionId === "") {
        // Display an error or show a message indicating that Union is required
        setErrorObject({ ...errorObject, ["UnionId"]: "validation-style" });
        return; // Return early without proceeding with the update
      }

      let params = {
        action: "dataAddEdit",
        lan: language(),
        UserId: UserInfo.UserId,
        rowData: currentRow,
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
  }

  function modalClose() {
    console.log("props modal: ", props);
    props.modalCallback("close");
  }

  const handleChangeMany = (newValue, propertyName) => {
    // Use a copy of the current row
    let data = { ...currentRow };

    // Update the specified property with the new value
    data[propertyName] = newValue;

    // Update the state with the modified data
    setCurrentRow(data);

    // Handle other logic as needed
  };


  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }

  function showPosition(position) {
    setCurrentRow({
      ...currentRow,
      Latitute: position.coords.latitude,
      Longitute: position.coords.longitude,
    });
  }


  return (
    <>
      {/* <!-- GROUP MODAL START --> */}
      <div class="subContainer inputArea">
        {/* <!-- Modal content --> */}
        <div class="modal-contentX">
          {/* <div class="text-center">
            <h4>Add/Edit PG</h4>
          </div> */}

          <div class="formControl-mobile">
            <label>Division (বিভাগ) *</label>
            <select
              id="DivisionId"
              name="DivisionId"
              disabled={true}
              class={errorObject.DivisionId}
              value={currDivisionId}
              onChange={(e) => handleChange(e)}
            >
              {divisionList &&
                divisionList.map((item, index) => {
                  return <option value={item.id}>{item.name}</option>;
                })}
            </select>
          </div>
          <div class="formControl-mobile">
            <label>District (জেলা) *</label>
            <select
              id="DistrictId"
              name="DistrictId"
              disabled={true}
              class={errorObject.DistrictId}
              value={currDistrictId}
              onChange={(e) => handleChange(e)}
            >
              {districtList &&
                districtList.map((item, index) => {
                  return <option value={item.id}>{item.name}</option>;
                })}
            </select>
          </div>
          <div class="formControl-mobile">
            <label>Upazila (উপজেলা) *</label>
            <select
              id="UpazilaId"
              name="UpazilaId"
              disabled={true}
              class={errorObject.UpazilaId}
              value={currUpazilaId}
              onChange={(e) => handleChange(e)}
            >
              {upazilaList &&
                upazilaList.map((item, index) => {
                  return <option value={item.id}>{item.name}</option>;
                })}
            </select>
          </div>
          <div class="formControl-mobile">
            <label>Union (ইউনিয়ন) *</label>
            <select
              id="UnionId"
              name="UnionId"
              class={errorObject.UnionId}
              value={currUnionId}
              onChange={(e) => handleChange(e)}
            >
              {unionList &&
                unionList.map((item, index) => {
                  return <option value={item.id}>{item.name}</option>;
                })}
            </select>
          </div>

          <div class="formControl-mobile">
            <label>PG Name (পিজি নাম)*</label>
            <input
              type="text"
              id="PGName"
              name="PGName"
              class={errorObject.PGName}
              placeholder="Enter PG Name"
              value={currentRow.PGName}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div class="formControl-mobile">
            <label>Group Code (গ্রুপ কোড) *</label>
            <input
              type="text"
              id="PgGroupCode"
              name="PgGroupCode"
              class={errorObject.PgGroupCode}
              placeholder="Enter Group Code"
              value={currentRow.PgGroupCode}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div class="formControl-mobile">
            <label>PG Bank Account Number (পিজি ব্যাঙ্ক অ্যাকাউন্ট নম্বর)*</label>
            <input
              type="text"
              id="PgBankAccountNumber"
              name="PgBankAccountNumber"
              class={errorObject.PgBankAccountNumber}
              placeholder="Enter Account Number"
              value={currentRow.PgBankAccountNumber}
              onChange={(e) => handleChange(e)}
            />

            {/* <label>Bank Name *</label>
                <input
                  type="text"
                  id="BankName"
                  name="BankName"
                  class={errorObject.BankName}
                  placeholder="Enter Bank Name"
                  value={currentRow.BankName}
                  onChange={(e) => handleChange(e)}
                /> */}
          </div>
          <div class="formControl-mobile">
            <label>Bank (ব্যাঙ্ক) *</label>
            <select
              id="BankId"
              name="BankId"
              class={errorObject.BankId}
              value={currBank}
              onChange={(e) => handleChange(e)}
            >
              {bank &&
                bank.map((item, index) => {
                  return <option value={item.id}>{item.name}</option>;
                })}
            </select>
          </div>

          <div class="formControl-mobile">
            <label>Value Chain (ভ্যালু চেইন)*</label>
            <select
              id="ValuechainId"
              name="ValuechainId"
              class={errorObject.ValuechainId}
              value={currQuestionMapCategory}
              onChange={(e) => handleChange(e)}
            >
              {questionMapCategory &&
                questionMapCategory.map((item, index) => {
                  return <option value={item.id}>{item.name}</option>;
                })}
            </select>
          </div>
          <div class="formControl-mobile">
            <label>Group Members Gender (গ্রুপ সদস্যদের লিঙ্গ)</label>
            <select
              id="GenderId"
              name="GenderId"
              class={errorObject.GenderId}
              value={currGender}
              onChange={(e) => handleChange(e)}
            >
              {gender &&
                gender.map((item, index) => {
                  return <option value={item.id}>{item.name}</option>;
                })}
            </select>
          </div>

          <div class="formControl-mobile">
            {/* <label>
              Is the Group Led by Women (এই গ্রুপের নেতৃত্বে কি নারী ?)
              <span
                className="tooltip-icon"
                data-tooltip="If there are 3 female members in the group, select 'Yes'
                (গ্রুপে 3 জন মহিলা সদস্য থাকলে, 'হ্যাঁ' নির্বাচন করুন)"
              >
                <InfoOutlined className="info-icon" />
              </span>
            </label> */}

<label>
  Is the Group Led by Women (এই গ্রুপের নেতৃত্বে কি নারী ?)
  <span className="tooltip-icon">
    <InfoOutlined className="info-icon" />
    <div className="tooltip-content">
      If there are 3 female members in the group, select 'Yes' <br />
      (গ্রুপে 3 জন মহিলা সদস্য থাকলে, 'হ্যাঁ' নির্বাচন করুন)
    </div>
  </span>
</label>

            <div className="checkbox-label">
              <label className="radio-label">
                <input
                  type="radio"
                  id="IsLeadByWomen"
                  name="IsLeadByWomen"
                  value={1}
                  checked={currentRow.IsLeadByWomen === 1}
                  onChange={() => handleChangeMany(1, "IsLeadByWomen")}
                />
                Yes (হ্যাঁ) 
              </label>

              <label className="radio-label">
                <input
                  type="radio"
                  id="IsLeadByWomen_false"
                  name="IsLeadByWomen"
                  value={0}
                  checked={currentRow.IsLeadByWomen === 0}
                  onChange={() => handleChangeMany(0, "IsLeadByWomen")}
                />
                No (না)
              </label>
            </div>
          </div>
          <div class="formControl-mobile">
            <label>Status (অবস্থা)</label>
            <div className="checkbox-label">
              <label className="radio-label">
                <input
                  type="radio"
                  id="IsActive"
                  name="IsActive"
                  value={1}
                  checked={currentRow.IsActive === 1}
                  onChange={() => handleChangeMany(1, "IsActive")}
                />
                Active (সক্রিয়)
              </label>

              <label className="radio-label">
                <input
                  type="radio"
                  id="IsActive_false"
                  name="IsActive"
                  value={0}
                  checked={currentRow.IsActive === 0}
                  onChange={() => handleChangeMany(0, "IsActive")}
                />
                Inactive (নিষ্ক্রিয়)
              </label>
            </div>
          </div>

          <div class="formControl-mobile">
            <label>Address (ঠিকানা) *</label>
            <textarea
              id="Address"
              name="Address"
              class={errorObject.Address}
              value={currentRow.Address}
              onChange={(e) => handleChange(e)}
            ></textarea>
          </div>


          <div className="formControl-mobile">

            <label>Latitute (অক্ষাংশ)</label>
            <input
              type="text"
              id="Latitute"
              name="Latitute"
              disabled="true"
              placeholder="Enter Latitute"
              value={currentRow.Latitute}
              onChange={(e) => handleChange(e)}
            />

          </div>

          <div className="formControl-mobile">
            <label>Longitute (দ্রাঘিমাংশ)</label>
            <div className="autocompleteContainer">
              <input
                type="text"
                id="Longitute"
                disabled="true"
                name="Longitute"
                placeholder="Enter Longitute"
                value={currentRow.Longitute}
                onChange={(e) => handleChange(e)}
              />

              <Button
                label={"Location"}
                class={"btnDetailsLatLong"}
                onClick={getLocation}
              />
            </div>

          </div>

          <div class="formControl-mobile">
            <label>Date of PG Formation (পিজি গঠনের তারিখ)* </label>
            <input
              type="date"
              id="DateofPgInformation"
              name="DateofPgInformation"
              class={errorObject.DateofPgInformation}
              placeholder="Select Date of PG Formation"
              value={currentRow.DateofPgInformation}
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div class="modalItem-mobile">
            <Button label={"Close"} class={"btnClose"} onClick={modalClose} />
            {props.currentRow.id && (
              <Button
                label={"Update"}
                // disabled={props.currentRow.StatusId > 1}
                disabled={UserInfo.Settings.AllowEditApprovedData == "1"?false:(props.currentRow.StatusId > 1)}

                class={"btnUpdate"}
                onClick={addEditAPICall}
              />
            )}
            {!props.currentRow.id && (
              <Button
                label={"Save"}
                class={"btnSave"}
                onClick={addEditAPICall}
              />
            )}
          </div>
        </div>
      </div>
      {/* <!-- GROUP MODAL END --> */}
    </>
  );
};

export default PgEntryFormAddEditModal;
