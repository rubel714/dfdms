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

const FarmerDataEntryNonPGAddEditModal = (props) => {
  // console.log('props modal: ', props);
  const serverpage = "farmerdataentrynonpg"; // this is .php server page
  const [currentRow, setCurrentRow] = useState(props.currentRow);
  const [errorObject, setErrorObject] = useState({});
  const UserInfo = LoginUserInfo();
  const baseUrl = process.env.REACT_APP_FRONT_URL;

  const [isRegularBeneficiaryList, setIsRegularBeneficiaryList] =
    useState(null);
  const [currisRegularBeneficiary, setCurrIsRegularBeneficiary] = useState(1);

  const [parentQuestionList, setParentQuestionList] = useState(null);
  const [currParentQuestion, setCurrParentQuestion] = useState(null);

  const [previewImage, setPreviewImage] = useState(
    `${baseUrl}src/assets/farmerimage/placeholder.png`
  );

  const [previewImages, setPreviewImages] = useState({
    //NidFrontPhoto: `${baseUrl}/dfdms/src/assets/farmerimage/placeholder.png`,
    NidFrontPhoto: `${baseUrl}src/assets/farmerimage/placeholder.png`,
    NidBackPhoto: `${baseUrl}src/assets/farmerimage/placeholder.png`,
    BeneficiaryPhoto: `${baseUrl}src/assets/farmerimage/placeholder.png`,
    FarmsPhoto: `${baseUrl}src/assets/farmerimage/placeholder.png`,
  });

  const [uploadCompleted, setUploadCompleted] = useState(0);

  const [gender, setGender] = useState(null);
  const [currGender, setCurrGender] = useState(null);

  const [disabilityStatus, setDisabilityStatus] = useState([
    { id: "2", name: "No" },
  ]);
  const [currDisabilityStatus, setCurrDisabilityStatus] = useState(2);
  const [currRelationWithHeadOfHH, setCurrRelationWithHeadOfHH] = useState(1); // or false
  const [currPGRegistered, setCurrPGRegistered] = useState(0); // or false
  const [currIsHeadOfTheGroup, setCurrIsHeadOfTheGroup] = useState(0); // or false
  const [
    currPGPartnershipWithOtherCompany,
    setCurrPGPartnershipWithOtherCompany,
  ] = useState(0); // or false
  const [
    currAreYouRegisteredYourFirmWithDlsRadioFlag,
    setCurrAreYouRegisteredYourFirmWithDlsRadioFlag,
  ] = useState(0); // or false

  const [headOfHHSex, setHeadOfHHSex] = useState(null);
  const [currHeadOfHHSex, setCurrHeadOfHHSex] = useState(null);

  const [typeOfMember, setTypeOfMember] = useState(null);
  const [currTypeOfMember, setCurrTypeOfMember] = useState(null);

  const [familyOccupation, setFamilyOccupation] = useState(null);
  const [currFamilyOccupation, setCurrFamilyOccupation] = useState(null);

  const [cityCorporation, setCityCorporation] = useState(null);
  const [currCityCorporation, setCurrCityCorporation] = useState(null);

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

  const [department, setDepartment] = useState(null);
  const [currDepartment, setCurrDepartment] = useState(null);
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1);

  const relationWith = {
    1: "Himself/Herself",
    2: "Others",
  };

  React.useEffect(() => {
    getDivision(
      props.currentRow.DivisionId,
      props.currentRow.DistrictId,
      props.currentRow.UpazilaId,
      props.currentRow.UnionId,
      props.currentRow.ValuechainId,
      props.currentRow.PGId
    );

    getRoleList(props.currentRow.TypeOfFarmerId);
    getIsRegularBeneficiaryList(props.currentRow.IsRegular);
    /*   getParentQuestion(
      !props.currentRow.id ? "" : props.currentRow.QuestionParentId
    ); */

    getGenderList(props.currentRow.Gender);
    getDepartmentList(props.currentRow.DepartmentId);
    getDisabilityStatusList(props.currentRow.DisabilityStatus);
    getHeadOfHHSexList(props.currentRow.HeadOfHHSex);
    getTypeOfMemberList(props.currentRow.TypeOfMember);
    getFamilyOccupationList(props.currentRow.OccupationId);
    getCityCorporationList(props.currentRow.CityCorporation);

    // Set the initial value of RelationWithHeadOfHH
    if (
      currentRow.RelationWithHeadOfHH !== undefined &&
      currentRow.RelationWithHeadOfHH !== null
    ) {
      setCurrRelationWithHeadOfHH(currentRow.RelationWithHeadOfHH);
    } else {
      setCurrRelationWithHeadOfHH(1);
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

    if (
      currentRow.AreYouRegisteredYourFirmWithDlsRadioFlag !== undefined &&
      currentRow.AreYouRegisteredYourFirmWithDlsRadioFlag !== null
    ) {
      setCurrAreYouRegisteredYourFirmWithDlsRadioFlag(
        currentRow.AreYouRegisteredYourFirmWithDlsRadioFlag
      );
    } else {
      setCurrAreYouRegisteredYourFirmWithDlsRadioFlag(0);
    }
  }, []);

  function getDivision(
    selectDivisionId,
    SelectDistrictId,
    selectUpazilaId,
    selectUnionId,
    selectValuechainId,
    selectPGId
  ) {
    let params = {
      action: "DivisionList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setDivisionList(
        [{ id: "", name: "বিভাগ নির্বাচন করুন" }].concat(res.data.datalist)
      );

      setCurrDivisionId(selectDivisionId);

      getDistrict(
        selectDivisionId,
        SelectDistrictId,
        selectUpazilaId,
        selectUnionId,
        selectValuechainId,
        selectPGId
      );

    });
  }

  function getDistrict(
    selectDivisionId,
    SelectDistrictId,
    selectUpazilaId,
    selectUnionId,
    selectValuechainId,
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
        [{ id: "", name: "জেলা নির্বাচন করুন" }].concat(res.data.datalist)
      );
      setErrorObject({ ...errorObject, ["DistrictId"]: null });

      setCurrDistrictId(SelectDistrictId);
      getUpazila(
        selectDivisionId,
        SelectDistrictId,
        selectUpazilaId,
        selectUnionId,
        selectValuechainId,
        selectPGId
      );
    });
  }

  function getUpazila(
    selectDivisionId,
    SelectDistrictId,
    selectUpazilaId,
    selectUnionId,
    selectValuechainId,
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
        [{ id: "", name: "উপজেলা নির্বাচন করুন" }].concat(res.data.datalist)
      );
      setErrorObject({ ...errorObject, ["UpazilaId"]: null });

      setCurrUpazilaId(selectUpazilaId);
      getUnion(
        selectDivisionId,
        SelectDistrictId,
        selectUpazilaId,
        selectUnionId,
        selectValuechainId,
        selectPGId
      );
    });
  }

  function getUnion(
    selectDivisionId,
    SelectDistrictId,
    selectUpazilaId,
    selectUnionId,
    selectValuechainId,
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
        [{ id: "", name: "ইউনিয়ন নির্বাচন করুন" }].concat(res.data.datalist)
      );
      setErrorObject({ ...errorObject, ["UnionId"]: null });

      setCurrUnionId(selectUnionId);

      getValuechainIdList(
        selectDivisionId,
        SelectDistrictId,
        selectUpazilaId,
        selectUnionId,
        selectValuechainId,
        selectPGId
      );

      getPGIdList(
        selectDivisionId,
        SelectDistrictId,
        selectUpazilaId,
        selectUnionId,
        selectValuechainId,
        selectPGId
      );
    });
  }

  function getValuechainIdList(
    selectDivisionId,
    SelectDistrictId,
    selectUpazilaId,
    selectUnionId,
    selectValuechainId,
    selectPGId
  ) {
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

      getPGIdList(
        selectDivisionId,
        SelectDistrictId,
        selectUpazilaId,
        selectUnionId,
        selectValuechainId,
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
      setGender([{ id: "", name: "জেন্ডার নির্বাচন করুন" }].concat(res.data.datalist));

      setCurrGender(selectGender);
    });
  }

  function getDepartmentList(selectDepartment) {
    let params = {
      action: "AgencyDepartmntList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setDepartment(
        [{ id: "", name: "Select Agency/Department" }].concat(res.data.datalist)
      );

      setCurrDepartment(selectDepartment);
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
        /* [{ id: "", name: "Select Disability Status" }].concat(res.data.datalist) */
        res.data.datalist
      );

      setCurrDisabilityStatus(selectDisabilityStatus || 2);
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
        [{ id: "", name: "সিটি কর্পোরেশন/পৌরসভা নির্বাচন করুন" }].concat(
          res.data.datalist
        )
      );

      setCurrCityCorporation(selectCityCorporation);
    });
  }

  function getPGIdList(
    selectDivisionId,
    SelectDistrictId,
    selectUpazilaId,
    selectUnionId,
    selectValuechainId,
    selectPGId
  ) {
    let params = {
      action: "PgGroupListByUnion",
      lan: language(),
      UserId: UserInfo.UserId,
      DivisionId: selectDivisionId,
      DistrictId: SelectDistrictId,
      UpazilaId: selectUpazilaId,
      UnionId: selectUnionId,
      ValuechainId: selectValuechainId,
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
      setIsRegularBeneficiaryList(res.data.datalist);

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

      setCurrParentQuestion(selectParentQuestion);
    });
  }


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
      /* getWardList(value, "", "", "", ""); */
      getPGIdList(value, "", "", "", "", "");
    } else if (name === "DistrictId") {
      setCurrDistrictId(value);
      getUpazila(currentRow.DivisionId, value, "", "", "", "");
    } else if (name === "UpazilaId") {
      setCurrUpazilaId(value);
      getUnion(currentRow.DivisionId, currentRow.DistrictId, value, "", "", "");
    } else if (name === "UnionId") {
      setCurrUnionId(value);
      /* getWardList(currentRow.DivisionId, currentRow.DistrictId, currentRow.UpazilaId, value, ""); */
      getPGIdList(
        currentRow.DivisionId,
        currentRow.DistrictId,
        currentRow.UpazilaId,
        value,
        currentRow.ValuechainId,
        ""
      );
    }

    if (name === "ValuechainId") {
      setCurrValuechainId(value);
      getPGIdList(
        currentRow.DivisionId,
        currentRow.DistrictId,
        currentRow.UpazilaId,
        currentRow.UnionId,
        value,
        ""
      );
    }

    if (name === "Gender") {
      setCurrGender(value);
    }

    if (name === "DepartmentId") {
      setCurrDepartment(value);
    }

    if (name === "CityCorporation") {
      setCurrCityCorporation(value);
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
    if (name === "OccupationId") {
      setCurrFamilyOccupation(value);
    }

    if (name === "IsRegular") {
      setCurrIsRegularBeneficiary(value);
    }

    if (name == "Phone") {
      const onlyNums = value.replace(/[^0-9]/g, "");
      const limitedValue = onlyNums.slice(0, 11);
      data["Phone"] = limitedValue;
    }

    if (name === "dob") {
      const dob = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();

      if (
        today.getMonth() < dob.getMonth() ||
        (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
      ) {
        data["FarmersAge"] = (age - 1).toString();
      } else {
        data["FarmersAge"] = age.toString();
      }
    }

    if (name === "NID") {
      const onlyNums = value.replace(/[^0-9]/g, "");
      const limitedValue = onlyNums.slice(0, 17);
      data["NID"] = limitedValue;
    }

    if (name === "WhenDidYouStartToOperateYourFirm") {
      const WhenDidYouStartToOperateYourFirm = new Date(value);
      const today = new Date();

      // Calculate the difference in months
      const monthDifference =
        (today.getFullYear() - WhenDidYouStartToOperateYourFirm.getFullYear()) *
          12 +
        today.getMonth() -
        WhenDidYouStartToOperateYourFirm.getMonth();

      data["NumberOfMonthsOfYourOperation"] = monthDifference.toString();
    }
  };

  function handleBlur() {
    let data = { ...currentRow };
    const inputValue = data["NID"];

    if (
      inputValue.length !== 10 &&
      inputValue.length !== 13 &&
      inputValue.length !== 17
    ) {
      if (inputValue.length > 0) {
        props.masterProps.openNoticeModal({
          isOpen: true,
          msg: "Beneficiary NID must be either 10 or 13 or 17 Digits",
          msgtype: 0,
        });
      }

      // Reset NID to an empty string
      data["NID"] = "";
    }
  }

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
    let validateFields = [
      "NID",
      "FarmerName",
      "PGFarmerCode",
      "TypeOfMember",
      "DivisionId",
      "DistrictId",
      "UpazilaId",
      "UnionId",
      "Address",
      "Gender",
      "dob",
      "FarmersAge",
      "ValuechainId",
      "PGId",
    ];
    if (currentRow.RelationWithHeadOfHH === 2) {
      validateFields.push("ifOtherSpecify");
    }
    if (currentRow.PGRegistered === 1) {
      validateFields.push("RegistrationNo");
    }
    if (currentRow.PGPartnershipWithOtherCompany === 1) {
      validateFields.push("NameOfTheCompanyYourPgPartnerWith");
    }

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
    if (currentRow.NID.length > 0) {
      if (
        currentRow.NID.length !== 10 &&
        currentRow.NID.length !== 13 &&
        currentRow.NID.length !== 17
      ) {
        props.masterProps.openNoticeModal({
          isOpen: true,
          msg: "Beneficiary NID must be either 10 or 13 or 17 Digits",
          msgtype: 0,
        });

        return;
      }
    }

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
          setUploadCompleted(0);
          props.modalCallback("addedit");
        }
      });
    }
  }

  function modalClose() {
    console.log("props modal: ", props);
    props.modalCallback("close");
  }


  const handleFileChange = (e, photoType) => {
    setUploadCompleted(1);

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

    formData.append("formName", "farmerProfile");
    formData.append("file", file);
    formData.append("timestamp", timestamp);
    formData.append(
      "filename",
      `./src/assets/farmerimage/${timestamp}_${file.name}`
    );

    apiCall
      .post("upload-image", formData, apiOption())
      .then((res) => {
        setCurrentRow((prevData) => ({
          ...prevData,
          [photoType]: `${timestamp}_${file.name}`,
        }));
      })
      .catch((error) => {
        console.error("API call error:", error);
      });
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

  console.log(
    "AreYouRegisteredYourFirmWithDlsRadioFlag:",
    currentRow.AreYouRegisteredYourFirmWithDlsRadioFlag
  );

  return (
    <>
      {/* <!-- GROUP MODAL START --> */}
      <div class="subContainer inputArea">
        {/* <!-- Modal content --> */}
        <div class="modal-contentX">

        <div class="text-center">
          <h2>পরিবার/খামার মালিকের তথ্যাদি</h2> 
        </div>

          {/* <div class="modalHeaderWithButton">
            <h4>Add/Edit Farmer Profile</h4>
            <Button
              label={"Back to List"}
              class={"btnClose"}
              onClick={modalClose}
            />
          </div> */}

          <div class="formControl-mobile">
            <label>নামঃ*</label>
            <input
              type="text"
              id="FarmerOwnerName"
              name="FarmerOwnerName"
              //disabled={currentRow.id?true:false}
              class={errorObject.FarmerOwnerName}
              placeholder=""
              value={currentRow.FarmerOwnerName}
              onChange={(e) => handleChange(e)}
            />
            </div>

          <div class="formControl-mobile">
            <label>পিতা/স্বামীঃ </label>
            <input
              type="text"
              id="FatherName"
              name="FatherName"
              placeholder=""
              value={currentRow.FatherName}
              onChange={(e) => handleChange(e)}
            />

           
          </div>

          <div class="formControl-mobile">
            <label>মাতার নামঃ </label>
            <input
              type="text"
              id="MotherName"
              name="MotherName"
              placeholder=""
              value={currentRow.MotherName}
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div class="formControl-mobile">
            <label>খামারের নামঃ</label>
            <input
              type="text"
              id="FarmerName"
              name="FarmerName"
              //disabled={currentRow.id?true:false}
              //class={errorObject.FarmerName}
              placeholder=""
              value={currentRow.FarmerName}
              onChange={(e) => handleChange(e)}
            />
            </div>
          
          
            <div class="formControl-mobile">
            <label>মোবাইলঃ </label>
            <input
              type="text"
              id="Phone"
              name="Phone"
              placeholder=""
              value={currentRow.Phone}
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div class="formControl-mobile">
            <label>জেন্ডারঃ</label>
            <select
              id="Gender"
              name="Gender"
              className="chosen_dropdown"
              class={errorObject.Gender}
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
            <label>প্রতিবন্ধী কিনা ?</label>
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

          
          </div>


          <div class="formControl-mobile">
            <label>এনআইডিঃ </label>
            <input
              type="text"
              id="NID"
              name="NID"
              //disabled={currentRow.id?true:false}
              class={errorObject.NID}
              placeholder=""
              value={currentRow.NID}
              onChange={(e) => handleChange(e)}
              onBlur={handleBlur}
            />
          </div>

          

         
         

          <div class="formControl-mobile">
            <label>বিভাগঃ *</label>
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
            </div>
            <div class="formControl-mobile">
            <label>জেলাঃ *</label>
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

          <div class="formControl-mobile">
            <label>উপজেলাঃ *</label>
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
            </div>
            <div class="formControl-mobile">
            <label>ইউনিয়নঃ *</label>
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
          
            <label>ওয়ার্ডঃ</label>
            <input
              type="text"
              id="Ward"
              name="Ward"
              placeholder=""
              value={currentRow.Ward}
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div class="formControl-mobile">
            <label>গ্রামঃ</label>
            <input
              type="text"
              id="VillageName"
              name="VillageName"
              placeholder=""
              value={currentRow.VillageName}
              onChange={(e) => handleChange(e)}
            />

           
          </div>

          <div class="formControl-mobile">
            <label>সিটি কর্পোরেশন/পৌরসভা</label>
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

         
          </div>

          <div className="formControl-mobile">
            <label>অক্ষাংশঃ</label>
            <input
              type="text"
              id="Latitute"
              name="Latitute"
              disabled="true"
              placeholder=""
              value={currentRow.Latitute}
              onChange={(e) => handleChange(e)}
            />

            

           
          </div>

          <div className="formControl-mobile">
            <label>দ্রাঘিমাংশঃ</label>
            <div className="autocompleteContainer">
              <input
                type="text"
                id="Longitute"
                disabled="true"
                name="Longitute"
                placeholder=""
                value={currentRow.Longitute}
                onChange={(e) => handleChange(e)}
              />

              <Button
                label={"জিও লোকেশান"}
                class={"btnDetailsLatLong"}
                onClick={getLocation}
              />
            </div>

           
          </div>




          <div className="formControl-mobile">
            <label></label>
            <div className="newTableDivNonpg">
                <table className="tg-Nonpg">
                  <thead>

                      <tr>
                        <td className="tg-Nonpg-sl tg-Nonpgtitle" colSpan="3">
                            গবাদি প্রাণির সংখ্যা
                        </td>
                       
                      </tr>
                      <tr>
                        <td className="tg-Nonpg-sl NonpgOdd" rowSpan="2">
                            গাভী
                        </td>
                        <td className="tg-Nonpg-22sb" >
                            দেশি
                        </td>
                        <td className="tg-Nonpg-22sb" >
                            <input
                            type="number"
                            className="numberInput"
                            value={currentRow.Production}
                            /* onChange={(e) =>
                            changeCustomTableCellExtend(
                            e,
                            "Production",
                            currentRow.DataValueItemDetailsId
                            )
                            } */
                            />
                        </td>
                      </tr>
                      <tr>
                        <td className="tg-Nonpg-22sb">
                            শংকর
                        </td>
                        <td className="tg-Nonpg-22sb">
                            <input
                            type="number"
                            className="numberInput"
                            value={currentRow.Production}
                            /* onChange={(e) =>
                            changeCustomTableCellExtend(
                            e,
                            "Production",
                            currentRow.DataValueItemDetailsId
                            )
                            } */
                            />
                        </td>
                      </tr>


                      <tr>
                        <td className="tg-Nonpg-sl NonpgEven" rowSpan="2">
                         ষাঁড়/বলদ
                        </td>
                        <td className="tg-Nonpg-22sb" >
                            দেশি
                        </td>
                        <td className="tg-Nonpg-22sb" >
                            <input
                            type="number"
                            className="numberInput"
                            value={currentRow.Production}
                            /* onChange={(e) =>
                            changeCustomTableCellExtend(
                            e,
                            "Production",
                            currentRow.DataValueItemDetailsId
                            )
                            } */
                            />
                        </td>
                      </tr>
                      <tr>
                        <td className="tg-Nonpg-22sb">
                            শংকর
                        </td>
                        <td className="tg-Nonpg-22sb">
                            <input
                            type="number"
                            className="numberInput"
                            value={currentRow.Production}
                            /* onChange={(e) =>
                            changeCustomTableCellExtend(
                            e,
                            "Production",
                            currentRow.DataValueItemDetailsId
                            )
                            } */
                            />
                        </td>
                      </tr>




                      <tr>
                        <td className="tg-Nonpg-sl NonpgOdd" rowSpan="2">
                            বাছুর পুং/স্ত্রী
                        </td>
                        <td className="tg-Nonpg-22sb" >
                            দেশি
                        </td>
                        <td className="tg-Nonpg-22sb" >
                            <input
                            type="number"
                            className="numberInput"
                            value={currentRow.Production}
                            /* onChange={(e) =>
                            changeCustomTableCellExtend(
                            e,
                            "Production",
                            currentRow.DataValueItemDetailsId
                            )
                            } */
                            />
                        </td>
                      </tr>
                      <tr>
                        <td className="tg-Nonpg-22sb">
                            শংকর
                        </td>
                        <td className="tg-Nonpg-22sb">
                            <input
                            type="number"
                            className="numberInput"
                            value={currentRow.Production}
                            /* onChange={(e) =>
                            changeCustomTableCellExtend(
                            e,
                            "Production",
                            currentRow.DataValueItemDetailsId
                            )
                            } */
                            />
                        </td>
                      </tr>

                  </thead>
                  <tbody>
                  </tbody>
                </table>
            </div>
          </div>

          {/* Start ছাগল সংখ্যা */}
          <div className="formControl-mobile">
            <label></label>
            <div className="newTableDivNonpg">
                <table className="tg-Nonpg">
                  <thead>

                      <tr>
                        <td className="tg-Nonpg-sl tg-Nonpgtitle" colSpan="3">
                            ছাগল সংখ্যা
                        </td>
                       
                      </tr>
                      <tr>
                        <td className="tg-Nonpg-33sb" >
                            ব্ল্যাক বেঙ্গল
                        </td>
                        <td className="tg-Nonpg-33sb" >
                            <input
                            type="number"
                            className="numberInput"
                            value={currentRow.Production}
                            /* onChange={(e) =>
                            changeCustomTableCellExtend(
                            e,
                            "Production",
                            currentRow.DataValueItemDetailsId
                            )
                            } */
                            />
                        </td>
                      </tr>
                      <tr>
                        <td className="tg-Nonpg-33sb">
                            যমুনাপাড়ি/অন্যান্য
                        </td>
                        <td className="tg-Nonpg-33sb">
                            <input
                            type="number"
                            className="numberInput"
                            value={currentRow.Production}
                            /* onChange={(e) =>
                            changeCustomTableCellExtend(
                            e,
                            "Production",
                            currentRow.DataValueItemDetailsId
                            )
                            } */
                            />
                        </td>
                      </tr>

                  </thead>
                  <tbody>
                  </tbody>
                </table>
            </div>
          </div>
           {/* End ছাগল সংখ্যা */}

           {/* Start ভেড়া সংখ্যা (বাচ্চা সহ) */}
          <div className="formControl-mobile">
            <label></label>
            <div className="newTableDivNonpg">
                <table className="tg-Nonpg">
                  <thead>

                      <tr>
                        <td className="tg-Nonpg-sl tg-Nonpgtitle" colSpan="3">
                          ভেড়া সংখ্যা/মহিষ সংখ্যা (বাচ্চা সহ) 
                        </td>
                       
                      </tr>
                      <tr>
                        <td className="tg-Nonpg-22sb" >
                           ভেড়া সংখ্যা (বাচ্চা সহ)
                        </td>
                        <td className="tg-Nonpg-22sb" >
                            <input
                            type="number"
                            className="numberInput"
                            value={currentRow.Production}
                            /* onChange={(e) =>
                            changeCustomTableCellExtend(
                            e,
                            "Production",
                            currentRow.DataValueItemDetailsId
                            )
                            } */
                            />
                        </td>
                      </tr>
                      <tr>
                        <td className="tg-Nonpg-22sb">
                             মহিষ সংখ্যা (বাচ্চা সহ)
                        </td>
                        <td className="tg-Nonpg-22sb">
                            <input
                            type="number"
                            className="numberInput"
                            value={currentRow.Production}
                            /* onChange={(e) =>
                            changeCustomTableCellExtend(
                            e,
                            "Production",
                            currentRow.DataValueItemDetailsId
                            )
                            } */
                            />
                        </td>
                      </tr>

                  </thead>
                  <tbody>
                  </tbody>
                </table>
            </div>
          </div>
           {/* End ভেড়া সংখ্যা (বাচ্চা সহ) */}

           {/* Start দুধ উৎপাদন (লিঃ/দিন) */}
           
            <div className="formControl-mobile">
              <label></label>
              <div className="newTableDivNonpg">
                  <table className="tg-Nonpg">
                    <thead>

                        <tr>
                          <td className="tg-Nonpg-sl tg-Nonpgtitle" colSpan="3">
                              দুধ উৎপাদন (লিঃ/দিন)
                          </td>
                        
                        </tr>
                        <tr>
                          <td className="tg-Nonpg-sl NonpgOdd" rowSpan="2">
                            গাভী
                          </td>
                          <td className="tg-Nonpg-22sb" >
                            দেশি
                          </td>
                          <td className="tg-Nonpg-22sb" >
                              <input
                              type="number"
                              className="numberInput"
                              value={currentRow.Production}
                              /* onChange={(e) =>
                              changeCustomTableCellExtend(
                              e,
                              "Production",
                              currentRow.DataValueItemDetailsId
                              )
                              } */
                              />
                          </td>
                        </tr>
                        <tr>
                          <td className="tg-Nonpg-22sb">
                              শংকর
                          </td>
                          <td className="tg-Nonpg-22sb">
                              <input
                              type="number"
                              className="numberInput"
                              value={currentRow.Production}
                              /* onChange={(e) =>
                              changeCustomTableCellExtend(
                              e,
                              "Production",
                              currentRow.DataValueItemDetailsId
                              )
                              } */
                              />
                          </td>
                        </tr>

                        <tr>
                          <td className="tg-Nonpg-sl NonpgEven" rowSpan="2">
                            মহিষ/ছাগল 
                          </td>
                          <td className="tg-Nonpg-22sb" >
                            মহিষ 
                          </td>
                          <td className="tg-Nonpg-22sb" >
                              <input
                              type="number"
                              className="numberInput"
                              value={currentRow.Production}
                              /* onChange={(e) =>
                              changeCustomTableCellExtend(
                              e,
                              "Production",
                              currentRow.DataValueItemDetailsId
                              )
                              } */
                              />
                          </td>
                        </tr>
                        <tr>
                          <td className="tg-Nonpg-22sb">
                              ছাগল 
                          </td>
                          <td className="tg-Nonpg-22sb">
                              <input
                              type="number"
                              className="numberInput"
                              value={currentRow.Production}
                              /* onChange={(e) =>
                              changeCustomTableCellExtend(
                              e,
                              "Production",
                              currentRow.DataValueItemDetailsId
                              )
                              } */
                              />
                          </td>
                        </tr>

                    </thead>
                    <tbody>
                    </tbody>
                  </table>
              </div>
            </div>

           {/* End দুধ উৎপাদন (লিঃ/দিন) */}


          {/* Start মুরগি */}
          <div className="formControl-mobile">
            <label></label>
            <div className="newTableDivNonpg">
                <table className="tg-Nonpg">
                  <thead>

                      <tr>
                        <td className="tg-Nonpg-sl tg-Nonpgtitle" colSpan="3">
                            মুরগি
                        </td>
                       
                      </tr>
                      <tr>
                        <td className="tg-Nonpg-22sb" >
                            দেশি
                        </td>
                        <td className="tg-Nonpg-22sb" >
                            <input
                            type="number"
                            className="numberInput"
                            value={currentRow.Production}
                            /* onChange={(e) =>
                            changeCustomTableCellExtend(
                            e,
                            "Production",
                            currentRow.DataValueItemDetailsId
                            )
                            } */
                            />
                        </td>
                      </tr>
                      <tr>
                        <td className="tg-Nonpg-22sb">
                            লেয়ার
                        </td>
                        <td className="tg-Nonpg-22sb">
                            <input
                            type="number"
                            className="numberInput"
                            value={currentRow.Production}
                            /* onChange={(e) =>
                            changeCustomTableCellExtend(
                            e,
                            "Production",
                            currentRow.DataValueItemDetailsId
                            )
                            } */
                            />
                        </td>
                      </tr>
                      <tr>
                        <td className="tg-Nonpg-22sb">
                           সোনালী/ককরেল
                        </td>
                        <td className="tg-Nonpg-22sb">
                            <input
                            type="number"
                            className="numberInput"
                            value={currentRow.Production}
                            /* onChange={(e) =>
                            changeCustomTableCellExtend(
                            e,
                            "Production",
                            currentRow.DataValueItemDetailsId
                            )
                            } */
                            />
                        </td>
                      </tr>
                      <tr>
                        <td className="tg-Nonpg-22sb">
                            ব্রয়লার
                        </td>
                        <td className="tg-Nonpg-22sb">
                            <input
                            type="number"
                            className="numberInput"
                            value={currentRow.Production}
                            /* onChange={(e) =>
                            changeCustomTableCellExtend(
                            e,
                            "Production",
                            currentRow.DataValueItemDetailsId
                            )
                            } */
                            />
                        </td>
                      </tr>
                      <tr>
                        <td className="tg-Nonpg-22sb">
                           ডিম উৎপাদন (দৈনিক)
                        </td>
                        <td className="tg-Nonpg-22sb">
                            <input
                            type="number"
                            className="numberInput"
                            value={currentRow.Production}
                            /* onChange={(e) =>
                            changeCustomTableCellExtend(
                            e,
                            "Production",
                            currentRow.DataValueItemDetailsId
                            )
                            } */
                            />
                        </td>
                      </tr>

                  </thead>
                  <tbody>
                  </tbody>
                </table>
            </div>
          </div>
           {/* End মুরগি */}


             {/* Start হাঁস/রাজঁহাস */}
            <div className="formControl-mobile">
              <label></label>
              <div className="newTableDivNonpg">
                  <table className="tg-Nonpg">
                    <thead>

                        <tr>
                          <td className="tg-Nonpg-sl tg-Nonpgtitle" colSpan="3">
                            হাঁস/রাজঁহাস
                          </td>
                        
                        </tr>
                        <tr>
                          <td className="tg-Nonpg-22sb" >
                            সংখ্যা
                          </td>
                          <td className="tg-Nonpg-22sb" >
                              <input
                              type="number"
                              className="numberInput"
                              value={currentRow.Production}
                              /* onChange={(e) =>
                              changeCustomTableCellExtend(
                              e,
                              "Production",
                              currentRow.DataValueItemDetailsId
                              )
                              } */
                              />
                          </td>
                        </tr>
                        <tr>
                          <td className="tg-Nonpg-22sb">
                              ডিম উৎপাদন (দৈনিক)
                          </td>
                          <td className="tg-Nonpg-22sb">
                              <input
                              type="number"
                              className="numberInput"
                              value={currentRow.Production}
                              /* onChange={(e) =>
                              changeCustomTableCellExtend(
                              e,
                              "Production",
                              currentRow.DataValueItemDetailsId
                              )
                              } */
                              />
                          </td>
                        </tr>
                        

                    </thead>
                    <tbody>
                    </tbody>
                  </table>
              </div>
            </div>
            {/* End হাঁস/রাজঁহাস */}


               {/* Start কবুতর, কোয়েল, টার্কি/তিতির/অন্যান্য */}
               <div className="formControl-mobile">
              <label></label>
              <div className="newTableDivNonpg">
                  <table className="tg-Nonpg">
                    <thead>

                        <tr>
                          <td className="tg-Nonpg-sl tg-Nonpgtitle" colSpan="3">
                            কবুতর, কোয়েল, টার্কি/তিতির/অন্যান্য
                          </td>
                        
                        </tr>
                        <tr>
                          <td className="tg-Nonpg-44sb" >
                            কবুতর
                          </td>
                          <td className="tg-Nonpg-44sb" >
                              <input
                              type="number"
                              className="numberInput"
                              value={currentRow.Production}
                              /* onChange={(e) =>
                              changeCustomTableCellExtend(
                              e,
                              "Production",
                              currentRow.DataValueItemDetailsId
                              )
                              } */
                              />
                          </td>
                        </tr>
                        <tr>
                          <td className="tg-Nonpg-44sb">
                             কোয়েল
                          </td>
                          <td className="tg-Nonpg-44sb">
                              <input
                              type="number"
                              className="numberInput"
                              value={currentRow.Production}
                              /* onChange={(e) =>
                              changeCustomTableCellExtend(
                              e,
                              "Production",
                              currentRow.DataValueItemDetailsId
                              )
                              } */
                              />
                          </td>
                        </tr>

                        <tr>
                          <td className="tg-Nonpg-44sb" >
                            টার্কি/তিতির/অন্যান্য
                          </td>
                          <td className="tg-Nonpg-44sb" >
                              <input
                              type="number"
                              className="numberInput"
                              value={currentRow.Production}
                              /* onChange={(e) =>
                              changeCustomTableCellExtend(
                              e,
                              "Production",
                              currentRow.DataValueItemDetailsId
                              )
                              } */
                              />
                          </td>
                        </tr>
                        

                    </thead>
                    <tbody>
                    </tbody>
                  </table>
              </div>
            </div>
            {/* End কবুতর, কোয়েল, টার্কি/তিতির/অন্যান্য */}

            
             {/* Start ঘাস চাষের বিবরণ (জমির পরিমাণ শতক) */}
             <div className="formControl-mobile">
              <label></label>
              <div className="newTableDivNonpg">
                  <table className="tg-Nonpg">
                    <thead>

                        <tr>
                          <td className="tg-Nonpg-sl tg-Nonpgtitle" colSpan="3">
                               ঘাস চাষের বিবরণ (জমির পরিমাণ শতক)
                          </td>
                        
                        </tr>
                        <tr>
                          <td className="tg-Nonpg-33sb" >
                            জমির পরিমান
                          </td>
                          <td className="tg-Nonpg-33sb" >
                              <input
                              type="number"
                              className="numberInput"
                              value={currentRow.Production}
                              /* onChange={(e) =>
                              changeCustomTableCellExtend(
                              e,
                              "Production",
                              currentRow.DataValueItemDetailsId
                              )
                              } */
                              />
                          </td>
                        </tr>
                        <tr>
                          <td className="tg-Nonpg-33sb">
                              উৎপাদন কেজি/বার্ষিক
                          </td>
                          <td className="tg-Nonpg-33sb">
                              <input
                              type="number"
                              className="numberInput"
                              value={currentRow.Production}
                              /* onChange={(e) =>
                              changeCustomTableCellExtend(
                              e,
                              "Production",
                              currentRow.DataValueItemDetailsId
                              )
                              } */
                              />
                          </td>
                        </tr>
                        

                    </thead>
                    <tbody>
                    </tbody>
                  </table>
              </div>
            </div>
            {/* End ঘাস চাষের বিবরণ (জমির পরিমাণ শতক) */}

             {/* Start ঘাস চাষের বিবরণ (জমির পরিমাণ শতক) */}
             <div className="formControl-mobile">
              <label></label>
              <div className="newTableDivNonpg">
                  <table className="tg-Nonpg">
                    <thead>

                        <tr>
                          <td className="tg-Nonpg-sl tg-Nonpgtitle" colSpan="3">
                               পরিবারের সদস্য সংখ্যা 
                          </td>
                        
                        </tr>
                        <tr>
                          <td className="tg-Nonpg-22sb" >
                              পরিবারের সদস্য সংখ্যা 
                          </td>
                          <td className="tg-Nonpg-22sb" >
                              <input
                              type="number"
                              className="numberInput"
                              value={currentRow.Production}
                              /* onChange={(e) =>
                              changeCustomTableCellExtend(
                              e,
                              "Production",
                              currentRow.DataValueItemDetailsId
                              )
                              } */
                              />
                          </td>
                        </tr>
                      
                        

                    </thead>
                    <tbody>
                    </tbody>
                  </table>
              </div>
            </div>
            {/* End পরিবারের সদস্য সংখ্যা  */}

        
          <div class="modalItem-mobile ">
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

export default FarmerDataEntryNonPGAddEditModal;
