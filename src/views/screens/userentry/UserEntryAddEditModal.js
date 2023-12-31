import React, { forwardRef, useRef, useEffect, useState } from "react";
import { Button } from "../../../components/CustomControl/Button";
import {
  apiCall,
  apiOption,
  LoginUserInfo,
  language,
} from "../../../actions/api";

const UserEntryAddEditModal = (props) => {
  console.log("props modal: ", props);
  const serverpage = "userentry"; // this is .php server page
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

  const [DesignationList, setDesignationList] = useState(null);
  const [RoleList, setRoleList] = useState(null);
  const [currDesignationId, setCurrDesignationId] = useState(null);

  const baseUrl = process.env.REACT_APP_FRONT_URL;

  console.log("baseUrl",process.env.REACT_APP_FRONT_URL);

  const [previewImage, setPreviewImage] = useState(
    `${baseUrl}src/assets/img/user/placeholder.png`
  );

  const [previewImages, setPreviewImages] = useState({
    PhotoUrl: `${baseUrl}src/assets/img/user/placeholder.png`,
  });
  


 /*  console.log("RoleIds-----", props.currentRow.RoleIds); */

  React.useEffect(() => {
    getDivision(
      props.currentRow.DivisionId,
      props.currentRow.DistrictId,
      props.currentRow.UpazilaId,
      props.currentRow.UnionId
    );

    getDesignation(props.currentRow.DesignationId);
    getRoleList(props.currentRow.RoleIds);
    //getManufacturerList();
  }, []);

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

  function getDesignation(selectDesignationId) {
    let params = {
      action: "DesignationList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setDesignationList(
        [{ id: "", name: "Select Designation" }].concat(res.data.datalist)
      );

      setCurrDesignationId(selectDesignationId);
    });
  }

  function getRoleList(selectRoleId) {
    let params = {
      action: "gRoleList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setRoleList(res.data.datalist);

      //setCurrDesignationId(selectRoleId);
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
    } else if (name === "DesignationId") {
      setCurrDesignationId(value);
    }

    if (name == "Phone") {
      const onlyNums = value.replace(/[^0-9]/g, '');
      const limitedValue = onlyNums.slice(0, 11);
      data["Phone"] = limitedValue;
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
    console.log("--------", currentRow);

    // let validateFields = ["UserName", "DiscountAmount", "DiscountPercentage"]
    let validateFields = [];
    if (currentRow["id"]) {
      validateFields = ["UserName", "LoginName", "Email", "DesignationId", "DateofJoining"];
    } else {
      validateFields = [
        "UserName",
        "LoginName",
        "Password",
        "Email",
        "DesignationId",
        "DateofJoining",
      ];
    }

    let errorData = {};
    let isValid = true;
    validateFields.map((field) => {
      if (!currentRow[field]) {
        errorData[field] = "validation-style";
        isValid = false;
      }

      let InEdit = "";
      if (currentRow["id"]) {
        InEdit = currentRow["id"];
      } else {
        InEdit = "";
      }

      if (InEdit) {
        errorData["Password"] = "";
      }

      //-----start confirm change password-----
      let cpassword = "";
      let cconfirmChangePassword = "";

      if (currentRow["Password"]) {
        cpassword = currentRow["Password"].trim();
      } else {
        cpassword = "";
      }

      if (currentRow["confirmChangePassword"]) {
        cconfirmChangePassword = currentRow["confirmChangePassword"].trim();
      } else {
        cconfirmChangePassword = "";
      }

      if (cpassword !== "") {
        if (cconfirmChangePassword == "") {
          props.masterProps.openNoticeModal({
            isOpen: true,
            msg: "Enter Confirm Password",
            msgtype: 0,
          });

          //errorData["confirmChangePassword"] = "Enter Confirm Password";
          isValid = false;
        } else if (cpassword != cconfirmChangePassword) {
          props.masterProps.openNoticeModal({
            isOpen: true,
            msg: "Password did not match",
            msgtype: 0,
          });

          //errorData["confirmChangePassword"] = "Password did not match";
          isValid = false;
        } else {
          errorData["confirmChangePassword"] = "";
        }
      }

      //-----end confirm change password-----
    });
    setErrorObject(errorData);
    return isValid;
  };

  function addEditAPICall() {
    if (validateForm()) {
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

  const [selectedRoles, setSelectedRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);

 /*  React.useEffect(() => {
    if (
      props.currentRow.RoleIds &&
      typeof props.currentRow.RoleIds === "string"
    ) {
      const roleIds = props.currentRow.RoleIds.split(",").map((id) =>
        id.trim()
      );
      currentRow["multiselectPGroup"] = roleIds;
      setSelectedRoles(roleIds);
    }
  }, [props.currentRow.RoleIds]); */

  React.useEffect(() => {
    if (
      props.currentRow.RoleIds &&
      typeof props.currentRow.RoleIds === "string"
    ) {
      const roleIds = props.currentRow.RoleIds.split(",").map((id) =>
        id.trim()
      );
      currentRow["multiselectPGroup"] = roleIds;
      setSelectedRole(roleIds[0]); // Set the first role as selected
    }
  }, [props.currentRow.RoleIds]);


  const rolesToDisplay = RoleList || [];

  const handleRoleCheckboxChange = (roleId) => {
    const updatedRoles = [...selectedRoles];
    if (updatedRoles.includes(roleId)) {
      // If roleId is already selected, remove it
      updatedRoles.splice(updatedRoles.indexOf(roleId), 1);
    } else {
      // If roleId is not selected, add it
      updatedRoles.push(roleId);
    }
    currentRow["multiselectPGroup"] = updatedRoles;
    setSelectedRoles(updatedRoles);
  };

  const handleRoleRadioChange = (roleId) => {
    currentRow["multiselectPGroup"] = [roleId];
    setSelectedRole(roleId);
  };


  
  const handleFileChange = (e, photoType) => {
  
    e.preventDefault(); // Prevent default form submission behavior
    const file = e.target.files[0];
  
    if (file) {
      uploadImage(file, photoType);
      setPreviewImages((prevImages) => ({
        ...prevImages,
        [photoType]: URL.createObjectURL(file),
      }));
    }
  };


  
const uploadImage = (file, photoType) => {
  if (!file) {
    console.error("No file selected");
    return;
  }

  const formData = new FormData();
  let timestamp = Math.floor(new Date().getTime() / 1000);

  formData.append("baseUrl", baseUrl);
  formData.append("formName", "userProfile");
  formData.append("file", file);
  formData.append("timestamp", timestamp);
  formData.append(
    "filename",
    `./src/assets/img/user/${timestamp}_${file.name}`
  );

  apiCall.post("upload-image", formData, apiOption()).then((res) => {
    setCurrentRow((prevData) => ({
      ...prevData,
      [photoType]: `${timestamp}_${file.name}`,
    }));
  }).catch((error) => {
    console.error("API call error:", error);
  });
};




  return (
    <>
      {/* <!-- GROUP MODAL START --> */}
      <div id="groupModal" class="modal">
        {/* <!-- Modal content --> */}
        <div class="modal-content">
          <div class="modalHeader">
            <h4>Add/Edit User</h4>
          </div>

          <div class="contactmodalBody pt-10">
            <label>Division</label>
            <select
              id="DivisionId"
              name="DivisionId"
              class={errorObject.DivisionId}
              value={currDivisionId}
              onChange={(e) => handleChange(e)}
            >
              {divisionList &&
                divisionList.map((item, index) => {
                  return <option value={item.id}>{item.name}</option>;
                })}
            </select>

            <label>District</label>
            <select
              id="DistrictId"
              name="DistrictId"
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

          <div class="contactmodalBody pt-10">

            <label>Upazila</label>
              <select
                id="UpazilaId"
                name="UpazilaId"
                class={errorObject.UpazilaId}
                value={currUpazilaId}
                onChange={(e) => handleChange(e)}
              >
                {upazilaList &&
                  upazilaList.map((item, index) => {
                    return <option value={item.id}>{item.name}</option>;
                  })}
              </select>

              <label>Union </label>
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

          <div class="contactmodalBody pt-10">
            <label>Name *</label>
            <input
              type="text"
              id="UserName"
              name="UserName"
              class={errorObject.UserName}
              placeholder="Enter User Name"
              value={currentRow.UserName}
              onChange={(e) => handleChange(e)}
            />

            <label>Password *</label>
            <input
              id="Password"
              name="Password"
              type="Password"
              class={errorObject.Password}
              placeholder="Enter Password"
              value={currentRow.Password}
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div class="contactmodalBody pt-10">
            <label>Login User Name *</label>
            <input
              type="text"
              id="LoginName"
              name="LoginName"
              class={errorObject.LoginName}
              placeholder="Enter Login User Name"
              value={currentRow.LoginName}
              onChange={(e) => handleChange(e)}
            />

            <label>Confirm Password</label>
            <input
              id="confirmChangePassword"
              name="confirmChangePassword"
              type="Password"
              class={errorObject.confirmChangePassword}
              placeholder="Enter Confirm Password"
              value={currentRow.confirmChangePassword}
              onChange={(e) => handleChange(e)}
            />

            <label>Designation *</label>
            <select
              id="DesignationId"
              name="DesignationId"
              class={errorObject.DesignationId}
              value={currDesignationId}
              onChange={(e) => handleChange(e)}
            >
              {DesignationList &&
                DesignationList.map((item, index) => {
                  return <option value={item.id}>{item.name}</option>;
                })}
            </select>

            <label>Date of Joining* </label>
              <input
              type="date"
              id="DateofJoining"
              name="DateofJoining"
              class={errorObject.DateofJoining}
              placeholder="Select Date of Joining"
              value={currentRow.DateofJoining}
              onChange={(e) => handleChange(e)}
            />

           
          </div>

          <div class="contactmodalBody pt-10">
            <label>Email *</label>
            <input
              type="text"
              id="Email"
              name="Email"
              class={errorObject.Email}
              value={currentRow.Email}
              onChange={(e) => handleChange(e)}
            ></input>

            <label> IsActive?</label>
            <input
              id="IsActive"
              name="IsActive"
              type="checkbox"
              checked={currentRow.IsActive}
              onChange={handleChangeCheck}
            />

          </div>

          <div class="contactmodalBody pt-10">

          <label>Mobile Number </label>
            <input
              type="text"
              id="Phone"
              name="Phone"
              placeholder="Enter Mobile Number"
              value={currentRow.Phone}
              onChange={(e) => handleChange(e)}
            />
            
            <label>Address</label>
            <textarea 
                  id="Address"
                  name="Address"
                  class={errorObject.Address}
                  value={currentRow.Address}
                  onChange={(e) => handleChange(e)}
                >
              </textarea>

            
          </div>

          <div className="contactmodalBodyImage pt-10">
            <label>Photo</label>
            <input
              type="file"
              id="PhotoUrl"
              name="PhotoUrl"
              accept="image/*"
              //onChange={handleFileChange}
              onChange={(e) => handleFileChange(e, "PhotoUrl")}
            />
            
            {previewImages.PhotoUrl && (
                <div className="image-preview">
                  <img
                    src={currentRow.PhotoUrl?`${baseUrl}src/assets/img/user/${currentRow.PhotoUrl}`:previewImage}
                    alt="Photo"
                    className="preview-image"
                  />
                </div>
              )}

                <div class="contactmodalBodyImage2nd pt-10">
                        <label>Remarks</label>
                          <input
                            type="text"
                            id="Remarks"
                            name="Remarks"
                            placeholder="Enter Remarks"
                            value={currentRow.Remarks}
                            onChange={(e) => handleChange(e)}
                          />
                    </div>
          </div>

          <div class="contactmodalBody pt-10">
            <label>Roles:</label>
          </div>

          <div class="contactmodalBodyLeargeBox pt-10">
            <label></label>
            <div class="checkbox-group-type">

                {rolesToDisplay.map((role) => (
                <div class="radio-container" key={role.id}>
                  <input
                    type="radio"
                    id={`id_${role.id}`}
                    name="multiselectPGroup"
                    value={String(role.id)}
                    className="radioClass"
                    checked={selectedRole === String(role.id)}
                    onChange={() => handleRoleRadioChange(String(role.id))}
                  />
                  <label className="control-label">{role.role}</label>
                </div>
              ))}

              {/* {rolesToDisplay.map((role) => (
                <div class="checkbox-container" key={role.id}>
                  <input
                    type="checkbox"
                    id={`id_${role.id}`}
                    name="multiselectPGroup[]"
                    value={String(role.id)}
                    className="checkBoxClass"
                    checked={selectedRoles.includes(String(role.id))}
                    onChange={() => handleRoleCheckboxChange(String(role.id))}
                  />
                  <label className="control-label">{role.role}</label>
                </div>
              ))} */}
            </div>
          </div>

          <div class="modalItem">
            <Button label={"Close"} class={"btnClose"} onClick={modalClose} />
            {props.currentRow.id && (
              <Button
                label={"Update"}
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

export default UserEntryAddEditModal;
