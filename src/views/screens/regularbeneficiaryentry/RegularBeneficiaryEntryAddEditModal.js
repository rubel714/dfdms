import React, { forwardRef, useRef, useEffect, useState } from "react";
import { Button } from "../../../components/CustomControl/Button";
import {
  apiCall,
  apiOption,
  LoginUserInfo,
  language,
} from "../../../actions/api";

import { Typography, TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

const RegularBeneficiaryEntryAddEditModal = (props) => {
  // console.log('props modal: ', props);
  const serverpage = "regularbeneficiaryentry"; // this is .php server page
  const [currentRow, setCurrentRow] = useState(props.currentRow);
  const [errorObject, setErrorObject] = useState({});
  const UserInfo = LoginUserInfo();

  const [isRegularBeneficiaryList, setIsRegularBeneficiaryList] =
    useState(null);
  const [currisRegularBeneficiary, setCurrIsRegularBeneficiary] =
    useState(null);

  const [parentQuestionList, setParentQuestionList] = useState(null);
  const [currParentQuestion, setCurrParentQuestion] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(
    require("../../../assets/farmerimage/placeholder.png")
  );

  const [gender, setGender] = useState(null);
  const [currGender, setCurrGender] = useState(null);

  const [disabilityStatus, setDisabilityStatus] = useState(null);
  const [currDisabilityStatus, setCurrDisabilityStatus] = useState(null);
  const [currRelationWithHeadOfHH, setCurrRelationWithHeadOfHH] = useState(0); // or false
  const [currPGRegistered, setCurrPGRegistered] = useState(0); // or false
  const [currIsHeadOfTheGroup, setCurrIsHeadOfTheGroup] = useState(0); // or false
  const [
    currPGPartnershipWithOtherCompany,
    setCurrPGPartnershipWithOtherCompany,
  ] = useState(0); // or false

  const [headOfHHSex, setHeadOfHHSex] = useState(null);
  const [currHeadOfHHSex, setCurrHeadOfHHSex] = useState(null);

  const [typeOfMember, setTypeOfMember] = useState(null);
  const [currTypeOfMember, setCurrTypeOfMember] = useState(null);

  const [familyOccupation, setFamilyOccupation] = useState(null);
  const [currFamilyOccupation, setCurrFamilyOccupation] = useState(null);

  const [cityCorporation, setCityCorporation] = useState(null);
  const [currCityCorporation, setCurrCityCorporation] = useState(null);

  const [ward, setWard] = useState(null);
  const [currWard, setCurrWard] = useState(null);

  const [pgList, setPGId] = useState(null);
  const [currPGId, setCurrPGId] = useState(null);
  const [valuechainList, setValuechainId] = useState(null);
  const [currValuechainId, setCurrValuechainId] = useState(null);

  const [divisionList, setDivisionList] = useState(null);
  const [districtList, setDistrictList] = useState(null);
  const [upazilaList, setUpazilaList] = useState(null);
  const [unionList, setUnionList] = useState(null);

  const [currDivisionId, setCurrDivisionId] = useState(null);
  const [currDistrictId, setCurrDistrictId] = useState(null);
  const [currUpazilaId, setCurrUpazilaId] = useState(null);
  const [currUnionId, setCurrUnionId] = useState(null);
  const [RoleList, setRoleList] = useState(null);

  React.useEffect(() => {
    getDivision(
      props.currentRow.DivisionId,
      props.currentRow.DistrictId,
      props.currentRow.UpazilaId,
      props.currentRow.UnionId,
      props.currentRow.Ward,
      props.currentRow.PGId
    );


    getRoleList(props.currentRow.TypeOfFarmerId);
    getIsRegularBeneficiaryList(props.currentRow.IsRegular);
    /*   getParentQuestion(
      !props.currentRow.id ? "" : props.currentRow.QuestionParentId
    ); */

    getGenderList(props.currentRow.Gender);
    getDisabilityStatusList(props.currentRow.DisabilityStatus);
    getHeadOfHHSexList(props.currentRow.HeadOfHHSex);
    getTypeOfMemberList(props.currentRow.TypeOfMember);
    getFamilyOccupationList(props.currentRow.FamilyOccupation);
    getCityCorporationList(props.currentRow.CityCorporation);
    /* getWardList(props.currentRow.Ward);
    getPGIdList(props.currentRow.PGId); */
    getValuechainIdList(props.currentRow.ValuechainId);

    // Set the initial value of RelationWithHeadOfHH
    if (
      currentRow.RelationWithHeadOfHH !== undefined &&
      currentRow.RelationWithHeadOfHH !== null
    ) {
      setCurrRelationWithHeadOfHH(currentRow.RelationWithHeadOfHH);
    } else {
      setCurrRelationWithHeadOfHH(0);
    }
    // Set the initial value of RelationWithHeadOfHH
    if (
      currentRow.PGRegistered !== undefined &&
      currentRow.PGRegistered !== null
    ) {
      setCurrPGRegistered(currentRow.PGRegistered);
    } else {
      setCurrPGRegistered(0);
    }
    if (
      currentRow.IsHeadOfTheGroup !== undefined &&
      currentRow.IsHeadOfTheGroup !== null
    ) {
      setCurrIsHeadOfTheGroup(currentRow.IsHeadOfTheGroup);
    } else {
      setCurrIsHeadOfTheGroup(0);
    }

    if (
      currentRow.PGPartnershipWithOtherCompany !== undefined &&
      currentRow.PGPartnershipWithOtherCompany !== null
    ) {
      setCurrPGPartnershipWithOtherCompany(
        currentRow.PGPartnershipWithOtherCompany
      );
    } else {
      setCurrPGPartnershipWithOtherCompany(0);
    }

    setSelectedFile(currentRow.NidFrontPhoto);

    /*     if (
      currentRow.NidFrontPhoto !== undefined &&
      currentRow.NidFrontPhoto !== null
    ) {
      setPreviewImage(
        require("../../../assets/farmerimage/"+currentRow.NidFrontPhoto) 
      );
    } else {
      setPreviewImage(require("../../../assets/farmerimage/placeholder.png"));
    } */

    //getStrengthList();
    //getManufacturerList();
  }, []);

  function getDivision(
    selectDivisionId,
    SelectDistrictId,
    selectUpazilaId,
    selectUnionId,
    selectWard,
    selectPGId
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
        selectUnionId,
        selectWard,
        selectPGId
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
    selectUnionId,
    selectWard,
    selectPGId
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
        selectUnionId,
        selectWard,
        selectPGId
      );
    });
  }

  function getUpazila(
    selectDivisionId,
    SelectDistrictId,
    selectUpazilaId,
    selectUnionId,
    selectWard,
    selectPGId
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
        selectUnionId,
        selectWard,
        selectPGId
      );
    });
  }

  function getUnion(
    selectDivisionId,
    SelectDistrictId,
    selectUpazilaId,
    selectUnionId,
    selectWard,
    selectPGId
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

      getWardList(
        selectDivisionId,
        SelectDistrictId,
        selectUpazilaId,
        selectUnionId,
        selectWard,
        selectPGId
      );
	  
      getPGIdList(
        selectDivisionId,
        SelectDistrictId,
        selectUpazilaId,
        selectUnionId,
        selectWard,
        selectPGId
      );

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

  function getDisabilityStatusList(selectDisabilityStatus) {
    let params = {
      action: "DisabilityStatusList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setDisabilityStatus(
        [{ id: "", name: "Select Disability Status" }].concat(res.data.datalist)
      );

      setCurrDisabilityStatus(selectDisabilityStatus);
    });
  }

  function getHeadOfHHSexList(selectHeadOfHHSex) {
    let params = {
      action: "HeadOfHHSexList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setHeadOfHHSex(
        [{ id: "", name: "Select Head of HH Sex" }].concat(res.data.datalist)
      );

      setCurrHeadOfHHSex(selectHeadOfHHSex);
    });
  }

  function getTypeOfMemberList(selectTypeOfMember) {
    let params = {
      action: "TypeOfMemberList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setTypeOfMember(
        [{ id: "", name: "Select Type of Member" }].concat(res.data.datalist)
      );

      setCurrTypeOfMember(selectTypeOfMember);
    });
  }

  function getValuechainIdList(selectValuechainId) {
    let params = {
      action: "QuestionMapCategoryList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setValuechainId(
        [{ id: "", name: "Select Value Chain" }].concat(res.data.datalist)
      );

      setCurrValuechainId(selectValuechainId);
    });
  }

  function getRoleList(selectRoleId) {
    let params = {
      action: "QuestionMapCategoryList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setRoleList(res.data.datalist);

      //setCurrDesignationId(selectRoleId);
    });
  }

  function getFamilyOccupationList(selectFamilyOccupation) {
    let params = {
      action: "FamilyOccupationList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setFamilyOccupation(
        [{ id: "", name: "Select Occupation" }].concat(res.data.datalist)
      );

      setCurrFamilyOccupation(selectFamilyOccupation);
    });
  }

  function getCityCorporationList(selectCityCorporation) {
    let params = {
      action: "CityCorporationList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setCityCorporation(
        [{ id: "", name: "Select City Corporation" }].concat(res.data.datalist)
      );

      setCurrCityCorporation(selectCityCorporation);
    });
  }




  function getWardList(selectDivisionId,
    SelectDistrictId,
    selectUpazilaId,
    selectUnionId,
    selectWard,
    selectPGId) {
    let params = {
      action: "WardList",
      lan: language(),
      UserId: UserInfo.UserId,
      UnionId: selectUnionId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setWard([{ id: "", name: "Select Ward" }].concat(res.data.datalist));

      setCurrWard(selectWard);
    });
  }

  function getPGIdList( selectDivisionId,
    SelectDistrictId,
    selectUpazilaId,
    selectUnionId,
    selectWard,
    selectPGId) {
    let params = {
      action: "PgGroupListByUnion",
      lan: language(),
      UserId: UserInfo.UserId,
      DivisionId: selectDivisionId,
      DistrictId: SelectDistrictId,
      UpazilaId: selectUpazilaId,
      UnionId: selectUnionId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setPGId(
        [{ id: "", name: "Select Producer Group" }].concat(res.data.datalist)
      );

      setCurrPGId(selectPGId);
    });
  }

  function getIsRegularBeneficiaryList(selectIsRegularBeneficiary) {
    let params = {
      action: "IsRegularBeneficiaryList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setIsRegularBeneficiaryList(
        [{ id: "", name: "Select Is Regular Beneficiary" }].concat(
          res.data.datalist
        )
      );

      setCurrIsRegularBeneficiary(selectIsRegularBeneficiary);
    });
  }

  function getParentQuestion(selectParentQuestion) {
    let params = {
      action: "ParentQuestionList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setParentQuestionList(
        [{ id: "", name: "Select Parent Question" }].concat(res.data.datalist)
      );

      //getParentQuestion(!props.currentRow.id?"":props.currentRow.FarmerId);

      //console.log("aaaaaaaaa === ",selectParentQuestion);

      setCurrParentQuestion(selectParentQuestion);
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
      getDistrict(value, "", "", "", "", "");
      getUpazila(value, "", "", "", "", "");
      getUnion(value, "", "", "", "", "");
      getWardList(value, "", "", "", "", "");
      getPGIdList(value, "", "", "", "", "");
    } else if (name === "DistrictId") {
      setCurrDistrictId(value);
      getUpazila(currentRow.DivisionId, value, "", "", "", "");
    } else if (name === "UpazilaId") {
      setCurrUpazilaId(value);
      getUnion(currentRow.DivisionId, currentRow.DistrictId, value, "", "", "");
    } else if (name === "UnionId") {
      setCurrUnionId(value);
      getWardList(currentRow.DivisionId, currentRow.DistrictId, currentRow.UpazilaId, value, "", "");
      getPGIdList(currentRow.DivisionId, currentRow.DistrictId, currentRow.UpazilaId, value, "", "");
    }

    if (name === "Gender") {
      setCurrGender(value);
    }
    if (name === "CityCorporation") {
      setCurrCityCorporation(value);
    }
    if (name === "Ward") {
      setCurrWard(value);
    }
    if (name === "PGId") {
      setCurrPGId(value);
    }
    if (name === "HeadOfHHSex") {
      setCurrHeadOfHHSex(value);
    }
    if (name === "DisabilityStatus") {
      setCurrDisabilityStatus(value);
    }
    if (name === "TypeOfMember") {
      setCurrTypeOfMember(value);
    }
    if (name === "FamilyOccupation") {
      setCurrFamilyOccupation(value);
    }

    if (name === "IsRegular") {
      setCurrIsRegularBeneficiary(value);
    }
    /*   if (name === "QuestionParentId") {
      setCurrParentQuestion(value);
    } */
    if (name === "ValuechainId") {
      setCurrValuechainId(value);
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
    // let validateFields = ["FarmerName", "DiscountAmount", "DiscountPercentage"]
    let validateFields = ["NID", "FarmerName", "PGFarmerCode", "TypeOfMember"];
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    uploadImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  /*  const uploadImage = (file) => {
    if (!file) {
      console.error("No file selected");
      return;
    }
  
    const formData = new FormData();
    const timestamp = new Date().getTime(); // Generate timestamp
  
    formData.append("file", file);
   // formData.append("filename", `./media/${timestamp}_${file.name}`);
   formData.append("filename", `./src/assets/farmerimage/${timestamp}_${file.name}`);

    // Use an API endpoint to handle image upload
    apiCall.post("upload-image", formData, apiOption()).then((res) => {
      // Handle the response if needed
      console.log(res);
    });
  
    // Save the filename with timestamp in your rowData
    setCurrentRow((prevData) => ({
      ...prevData,
      NidFrontPhoto: `${timestamp}_${file.name}`,
    }));
  }; */

  const uploadImage = (file) => {
    if (!file) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    let timestamp = Math.floor(new Date().getTime() / 1000); // Generate timestamp in seconds

    formData.append("file", file);
    formData.append("timestamp", timestamp); // Include timestamp as a parameter
    formData.append(
      "filename",
      `./src/assets/farmerimage/${timestamp}_${file.name}`
    );

    apiCall.post("upload-image", formData, apiOption()).then((res) => {
      console.log(res);
    });

    setCurrentRow((prevData) => ({
      ...prevData,
      NidFrontPhoto: `${timestamp}_${file.name}`,
    }));
  };

  const handleChangeMany = (newValue, propertyName) => {
    let data = { ...currentRow };
    data[propertyName] = newValue;
    setCurrentRow(data);
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

  const [selectedRoles, setSelectedRoles] = useState([]);

  React.useEffect(() => {
    console.log("TypeOfFarmerId===edit: ", props.currentRow.TypeOfFarmerId);
    if (
      props.currentRow.TypeOfFarmerId &&
      typeof props.currentRow.TypeOfFarmerId === "string"
    ) {
      const roleIds = props.currentRow.TypeOfFarmerId.split(",").map((id) =>
        id.trim()
      );
      currentRow["multiselectPGroup"] = roleIds;
      setSelectedRoles(roleIds);
    }
  }, [props.currentRow.TypeOfFarmerId]);

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

  return (
    <>
      {/* <!-- GROUP MODAL START --> */}
      <div id="groupModal" class="modal">
        {/* <!-- Modal content --> */}
        <div class="modal-content">
          <div class="modalHeader">
            <h4>Add/Edit Regular Beneficiary</h4>
          </div>

          <div class="contactmodalBody pt-10">
            <label>Is Regular Beneficiary</label>
            <select
              id="IsRegular"
              name="IsRegular"
              class={errorObject.IsRegular}
              value={currisRegularBeneficiary}
              onChange={(e) => handleChange(e)}
            >
              {isRegularBeneficiaryList &&
                isRegularBeneficiaryList.map((item, index) => {
                  return <option value={item.id}>{item.name}</option>;
                })}
            </select>

            <label>Beneficiary NID</label>
            <input
              type="text"
              id="NID"
              name="NID"
              //disabled={currentRow.id?true:false}
              class={errorObject.NID}
              placeholder="Enter Beneficiary NID"
              value={currentRow.NID}
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div className="contactmodalBody pt-10">
            <label>NID Front Photo</label>
            <input
              type="file"
              id="NidFrontPhoto"
              name="NidFrontPhoto"
              accept="image/*"
              onChange={handleFileChange}
            />

            {previewImage && (
              <div className="image-preview">
                <img
                  //src={`./media/${currentRow.NidFrontPhoto}`}
                  src={
                    previewImage
                      ? previewImage
                      : require("assets/farmerimage/" +
                          currentRow.NidFrontPhoto)
                  }
                  alt="NID Front Preview"
                  className="preview-image"
                />
              </div>
            )}
          </div>

          <div className="contactmodalBody pt-10">
            <label>NID Back Photo</label>
            <input
              type="file"
              id="NidBackPhoto"
              name="NidBackPhoto"
              accept="image/*"
              onChange={handleFileChange}
            />

            {previewImage && (
              <div className="image-preview">
                <img
                  //src={`./media/${currentRow.NidFrontPhoto}`}
                  src={
                    previewImage
                      ? previewImage
                      : require("assets/farmerimage/" +
                          currentRow.NidFrontPhoto)
                  }
                  alt="NID Front Preview"
                  className="preview-image"
                />
              </div>
            )}
          </div>

          <div class="contactmodalBody pt-10">
            <label>Beneficiary Name *</label>
            <input
              type="text"
              id="FarmerName"
              name="FarmerName"
              //disabled={currentRow.id?true:false}
              class={errorObject.FarmerName}
              placeholder="Enter Beneficiary Name"
              value={currentRow.FarmerName}
              onChange={(e) => handleChange(e)}
            />

            <label>Mobile Number </label>
            <input
              type="text"
              id="Phone"
              name="Phone"
              placeholder="Enter Mobile Number"
              value={currentRow.Phone}
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div class="contactmodalBody pt-10 ">
            <label>Beneficiary Photo</label>
            <input
              type="file"
              id="BeneficiaryPhoto"
              name="BeneficiaryPhoto"
              accept="image/*"
              onChange={handleFileChange}
            />
            {previewImage && (
              <div className="image-preview">
                <img
                  //src={`./media/${currentRow.NidFrontPhoto}`}
                  src={
                    previewImage
                      ? previewImage
                      : require("assets/farmerimage/" +
                          currentRow.NidFrontPhoto)
                  }
                  alt="NID Front Preview"
                  className="preview-image"
                />
              </div>
            )}
          </div>

          <div class="contactmodalBody pt-10 ">
            <label>Father's Name </label>
            <input
              type="text"
              id="FatherName"
              name="FatherName"
              placeholder="Enter Father Name"
              value={currentRow.FatherName}
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div class="contactmodalBody pt-10 ">
            <label>Mother's Name </label>
            <input
              type="text"
              id="MotherName"
              name="MotherName"
              placeholder="Enter Mother's Name"
              value={currentRow.MotherName}
              onChange={(e) => handleChange(e)}
            />

            <label>Spouse Name </label>
            <input
              type="text"
              id="SpouseName"
              name="SpouseName"
              placeholder="Enter Spouse Name"
              value={currentRow.SpouseName}
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div class="contactmodalBody pt-10 ">
            <label>Gender</label>
            <select
              id="Gender"
              name="Gender"
              class={errorObject.Gender}
              value={currGender}
              onChange={(e) => handleChange(e)}
            >
              {gender &&
                gender.map((item, index) => {
                  return <option value={item.id}>{item.name}</option>;
                })}
            </select>

            <label>Farmer's Age </label>
            <input
              type="text"
              id="FarmersAge"
              name="FarmersAge"
              placeholder="Enter Farmer's Age"
              value={currentRow.FarmersAge}
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div class="contactmodalBody pt-10 ">
            <label>Disability Status</label>
            <select
              id="DisabilityStatus"
              name="DisabilityStatus"
              class={errorObject.DisabilityStatus}
              value={currDisabilityStatus}
              onChange={(e) => handleChange(e)}
            >
              {disabilityStatus &&
                disabilityStatus.map((item, index) => {
                  return <option value={item.id}>{item.name}</option>;
                })}
            </select>

            <label>Farmers Relationship with Head of HH </label>
            <div className="checkbox-label">
              <label className="radio-label">
                <input
                  type="radio"
                  id="RelationWithHeadOfHH"
                  name="RelationWithHeadOfHH"
                  value={1}
                  checked={currentRow.RelationWithHeadOfHH === 1}
                  onChange={() => handleChangeMany(1, "RelationWithHeadOfHH")}
                />
                HimselfIf/HerselfIf
              </label>

              <label className="radio-label">
                <input
                  type="radio"
                  id="RelationWithHeadOfHH_false"
                  name="RelationWithHeadOfHH"
                  value={0}
                  checked={currentRow.RelationWithHeadOfHH === 0}
                  onChange={() => handleChangeMany(0, "RelationWithHeadOfHH")}
                />
                Others
              </label>
            </div>
          </div>

          <div class="contactmodalBody pt-10 ">
            <label>Farmer's Head of HH Sex</label>
            <select
              id="HeadOfHHSex"
              name="HeadOfHHSex"
              class={errorObject.HeadOfHHSex}
              value={currHeadOfHHSex}
              onChange={(e) => handleChange(e)}
            >
              {headOfHHSex &&
                headOfHHSex.map((item, index) => {
                  return <option value={item.id}>{item.name}</option>;
                })}
            </select>

            <label>Do your PG/PO Registered? </label>
            <div className="checkbox-label">
              <label className="radio-label">
                <input
                  type="radio"
                  id="PGRegistered"
                  name="PGRegistered"
                  value={1}
                  checked={currentRow.PGRegistered === 1}
                  onChange={() => handleChangeMany(1, "PGRegistered")}
                />
                Yes
              </label>

              <label className="radio-label">
                <input
                  type="radio"
                  id="PGRegistered_false"
                  name="PGRegistered"
                  value={0}
                  checked={currentRow.PGRegistered === 0}
                  onChange={() => handleChangeMany(0, "PGRegistered")}
                />
                No
              </label>
            </div>
          </div>

          <div class="contactmodalBody pt-10 ">
            <label>Type Of Member*</label>
            <select
              id="TypeOfMember"
              name="TypeOfMember"
              class={errorObject.TypeOfMember}
              value={currTypeOfMember}
              onChange={(e) => handleChange(e)}
            >
              {typeOfMember &&
                typeOfMember.map((item, index) => {
                  return <option value={item.id}>{item.name}</option>;
                })}
            </select>

            <label>
              Do your PG make any productive partnership with any other company?{" "}
            </label>
            <div className="checkbox-label">
              <label className="radio-label">
                <input
                  type="radio"
                  id="PGPartnershipWithOtherCompany"
                  name="PGPartnershipWithOtherCompany"
                  value={1}
                  checked={currentRow.PGPartnershipWithOtherCompany === 1}
                  onChange={() =>
                    handleChangeMany(1, "PGPartnershipWithOtherCompany")
                  }
                />
                Yes
              </label>

              <label className="radio-label">
                <input
                  type="radio"
                  id="PGPartnershipWithOtherCompany_false"
                  name="PGPartnershipWithOtherCompany"
                  value={0}
                  checked={currentRow.PGPartnershipWithOtherCompany === 0}
                  onChange={() =>
                    handleChangeMany(0, "PGPartnershipWithOtherCompany")
                  }
                />
                No
              </label>
            </div>
          </div>

          <div class="contactmodalBody pt-10">
            <label>PG Farmer Code* </label>
            <input
              type="text"
              id="PGFarmerCode"
              name="PGFarmerCode"
              placeholder="Enter PGF armer Code"
              class={errorObject.PGFarmerCode}
              value={currentRow.PGFarmerCode}
              onChange={(e) => handleChange(e)}
            />

            <label>Primary</label>
            <select
              id="FamilyOccupation"
              name="FamilyOccupation"
              class={errorObject.FamilyOccupation}
              value={currFamilyOccupation}
              onChange={(e) => handleChange(e)}
            >
              {familyOccupation &&
                familyOccupation.map((item, index) => {
                  return <option value={item.id}>{item.name}</option>;
                })}
            </select>
          </div>

          <div class="contactmodalBody pt-10">
            <label>Division *</label>
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

            <label>District *</label>
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
            <label>Upazila *</label>
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

            <label>Union *</label>
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

          <label>Name of Producer Group</label>
            <select
              id="PGId"
              name="PGId"
              class={errorObject.PGId}
              value={currPGId}
              onChange={(e) => handleChange(e)}
            >
              {pgList &&
                pgList.map((item, index) => {
                  return <option value={item.id}>{item.name}</option>;
                })}
            </select>

           

            <label>Ward</label>
            <select
              id="Ward"
              name="Ward"
              class={errorObject.Ward}
              value={currWard}
              onChange={(e) => handleChange(e)}
            >
              {ward &&
                ward.map((item, index) => {
                  return <option value={item.id}>{item.name}</option>;
                })}
            </select>
          </div>

          <div class="contactmodalBody pt-10 ">

          <label>City Corporation</label>
          <select
            id="CityCorporation"
            name="CityCorporation"
            class={errorObject.CityCorporation}
            value={currCityCorporation}
            onChange={(e) => handleChange(e)}
          >
            {cityCorporation &&
              cityCorporation.map((item, index) => {
                return <option value={item.id}>{item.name}</option>;
              })}
          </select>

            <label>Village</label>
            <input
              type="text"
              id="VillageName"
              name="VillageName"
              placeholder="Enter Village Name"
              value={currentRow.VillageName}
              onChange={(e) => handleChange(e)}
            />

          </div>

          <div className="contactmodalBody pt-10">

            <label>Latitute</label>
            <input
              type="text"
              id="Latitute"
              name="Latitute"
              disabled="true"
              placeholder="Enter Latitute"
              value={currentRow.Latitute}
              onChange={(e) => handleChange(e)}
            />

          <label>Address </label>
            <input
              type="text"
              id="Address"
              name="Address"
              placeholder="Enter Address"
              value={currentRow.Address}
              onChange={(e) => handleChange(e)}
            />
         


          </div>

          <div className="contactmodalBody pt-10">
            <label>Longitute</label>
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
                label={"Enter Location"}
                class={"btnDetailsLatLong"}
                onClick={getLocation}
              />
            </div>

            <label>Are You Head of The Group?</label>
            <div className="checkbox-label">
              <label className="radio-label">
                <input
                  type="radio"
                  id="IsHeadOfTheGroup"
                  name="IsHeadOfTheGroup"
                  value={1}
                  checked={currentRow.IsHeadOfTheGroup === 1}
                  onChange={() => handleChangeMany(1, "IsHeadOfTheGroup")}
                />
                Yes
              </label>

              <label className="radio-label">
                <input
                  type="radio"
                  id="IsHeadOfTheGroup_false"
                  name="IsHeadOfTheGroup"
                  value={0}
                  checked={currentRow.IsHeadOfTheGroup === 0}
                  onChange={() => handleChangeMany(0, "IsHeadOfTheGroup")}
                />
                No
              </label>
            </div>
          </div>

          <div className="contactmodalBody pt-10">
            <label>Value Chain</label>
            <select
              id="ValuechainId"
              name="ValuechainId"
              class={errorObject.ValuechainId}
              value={currValuechainId}
              onChange={(e) => handleChange(e)}
            >
              {valuechainList &&
                valuechainList.map((item, index) => {
                  return <option value={item.id}>{item.name}</option>;
                })}
            </select>
          </div>

          <div class="contactmodalBody pt-10">
            <label>Type of Farmers:</label>
          </div>

          <div class="contactmodalBodyLeargeBox pt-10">
            <label></label>
            <div class="checkbox-group-type">
              {rolesToDisplay.map((role) => (
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
                  <label className="control-label">{role.name}</label>
                </div>
              ))}
            </div>
          </div>

          {/*  <div class="contactmodalBody modalItem">
                <label> Is Mandatory?</label>
                  <input
                    id="IsRegular"
                    name="IsRegular"
                    type="checkbox"
                    checked={currentRow.IsRegular}
                    onChange={handleChangeCheck}
                  />
              </div> */}

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

export default RegularBeneficiaryEntryAddEditModal;