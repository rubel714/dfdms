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


  const [DesignationList, setDesignationList] = useState(null);

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
    getDesignation();

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
      currentRow.IsPGMember !== undefined &&
      currentRow.IsPGMember !== null
    ) {
      setCurrIsHeadOfTheGroup(currentRow.IsPGMember);
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
      currentRow.IsDisability !== undefined &&
      currentRow.IsDisability !== null
    ) {
      setCurrAreYouRegisteredYourFirmWithDlsRadioFlag(
        currentRow.IsDisability
      );
    } else {
      setCurrAreYouRegisteredYourFirmWithDlsRadioFlag(0);
    }
  }, []);


  
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
        [{ id: "", name: "Select Division" }].concat(res.data.datalist)
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
        [{ id: "", name: "Select District" }].concat(res.data.datalist)
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
        [{ id: "", name: "Select Upazila" }].concat(res.data.datalist)
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
        [{ id: "", name: "Select Union" }].concat(res.data.datalist)
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
      setGender([{ id: "", name: "Select Gender" }].concat(res.data.datalist));

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
    console.log('value ffff : ', value);

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


  const handleChangeChoosenMaster = (name, value) => {

    let data = { ...currentRow };
    data[name] = value;

    setCurrentRow(data);
    /* setErrorObject({ ...errorObject, [name]: null }); */

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
          msg: "NID must be either 10 or 13 or 17 Digits",
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
      "DivisionId",
      "DistrictId",
      "UpazilaId",
      "UnionId",
      "FarmerName",
      "NID",
      "DataCollectionDate",
      "DataCollectorName",
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
          msg: "NID must be either 10 or 13 or 17 Digits",
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



  return (
    <>
      {/* <!-- GROUP MODAL START --> */}
      <div class="subContainer inputAreaMobile">
        {/* <!-- Modal content --> */}
        <div class="modal-contentX">

        <div class="text-center">
          <h2>Household Livestock Survey 2024</h2> 
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
            <label>Division (বিভাগ) *</label>
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
            <label>District (জেলা) *</label>
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
            <label>Upazila (উপজেলা) *</label>
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
          
            <label>Ward (ওয়ার্ড)</label>
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
            <label>Village (গ্রাম)</label>
            <input
              type="text"
              id="Village"
              name="Village"
              placeholder=""
              value={currentRow.Village}
              onChange={(e) => handleChange(e)}
            />

           
          </div>


          <div class="formControl-mobile">
            <label>Farmer’s Name (নাম)*</label>
            <input
              type="text"
              id="FarmerName"
              name="FarmerName"
              //disabled={currentRow.id?true:false}
              class={errorObject.FarmerName}
              placeholder=""
              value={currentRow.FarmerName}
              onChange={(e) => handleChange(e)}
            />
            </div>

          <div class="formControl-mobile">
            <label>Father’s Name (পিতা/স্বামী) </label>
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
            <label>Mother’s Name (মাতার নাম) </label>
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
            <label>Husband’s/Wife’s Name (স্বামীর / স্ত্রীর নাম)</label>
            <input
              type="text"
              id="HusbandWifeName"
              name="HusbandWifeName"
              placeholder=""
              value={currentRow.HusbandWifeName}
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div class="formControl-mobile">
            <label>Name of the farm (খামারের নাম)</label>
            <input
              type="text"
              id="NameOfTheFarm"
              name="NameOfTheFarm"
              //disabled={currentRow.id?true:false}
              //class={errorObject.FarmerName}
              placeholder=""
              value={currentRow.NameOfTheFarm}
              onChange={(e) => handleChange(e)}
            />
            </div>
          
          
            <div class="formControl-mobile">
            <label>Mobile number (মোবাইল নং) </label>
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
            <label>Gender (জেন্ডার)</label>
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
          <label>Is there any disability (প্রতিবন্ধি কিনা)</label>
          <div className="checkbox-label">
              <label className="radio-label">
                <input
                  type="radio"
                  id="IsDisability"
                  name="IsDisability"
                  value={1}
                  checked={
                    currentRow.IsDisability === 1
                  }
                  onChange={() =>
                    handleChangeMany(
                      1,
                      "IsDisability"
                    )
                  }
                />
                Yes
              </label>

              <label className="radio-label">
                <input
                  type="radio"
                  id="AreYouRegisteredYourFirmWithDlsRadioFlag_false"
                  name="IsDisability"
                  value={0}
                  checked={
                    currentRow.IsDisability === 0
                  }
                  onChange={() =>
                    handleChangeMany(
                      0,
                      "IsDisability"
                    )
                  }
                />
                No
              </label>
            </div>
          </div>


          <div class="formControl-mobile">
            <label>NID (জাতীয় পরিচয় পত্র/ ভোটার আইডি কার্ড নম্বর) *</label>
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
          <label>Are you the member of a PG under LDDP (আপনি কি LDDP প্রকল্পের আওতাধীন কোনো পিজি'র সদস্য) ?</label>
            <div className="checkbox-label">
              <label className="radio-label">
                <input
                  type="radio"
                  id="IsPGMember"
                  name="IsPGMember"
                  value={1}
                  checked={currentRow.IsPGMember === 1}
                  onChange={() => handleChangeMany(1, "IsPGMember")}
                />
                Yes
              </label>

              <label className="radio-label">
                <input
                  type="radio"
                  id="IsHeadOfTheGroup_false"
                  name="IsPGMember"
                  value={0}
                  checked={currentRow.IsPGMember === 0}
                  onChange={() => handleChangeMany(0, "IsPGMember")}
                />
                No
              </label>
          </div>
          </div>

          <div className="formControl-mobile">
            <label>Latitude (অক্ষাংশ)</label>
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
            <label>Longitude (দ্রাঘিমাংশ)</label>
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
                label={"Geo location"}
                class={"btnDetailsLatLong"}
                onClick={getLocation}
              />
            </div>

           
          </div>



{/* ========= Start Cow Table ===========*/}
          <div className="formControl-mobile">
            <label></label>
            <div className="newTableDivNonpg">
                <table className="tg-Nonpg border1">
                  <thead>

                      {/* <tr>
                        <td className="tg-Nonpg-sl tg-Nonpgtitle" colSpan="3">
                        Number of cattle (গবাদি প্রাণির সংখ্যা)
                        </td>
                      </tr> */}

                      <tr>
                        <td className="tg-Nonpg-sl NonpgOdd bgncoa8" rowSpan="2">
                            Cow (গাভীর সংখ্যা)
                        </td>
                        <td className="tg-Nonpg-22sb bgncoa8" >
                            Native (দেশি)
                        </td>
                        <td className="tg-Nonpg-22sb bgncoa8" >
                            <input
                            id="CowNative"
                            name="CowNative"
                            type="number"
                            className="numberInput"
                            placeholder="0" 
                            value={currentRow.CowNative}
                            onChange={(e) => handleChange(e)}
                            />
                        </td>
                      </tr>
                      <tr>
                        <td className="tg-Nonpg-22sb bgncoa8">
                            Cross (শংকর)
                        </td>
                        <td className="tg-Nonpg-22sb bgncoa8">
                            <input
                            id="CowCross"
                            name="CowCross"
                            type="number"
                            className="numberInput"
                            placeholder="0"
                            value={currentRow.CowCross}
                            onChange={(e) => handleChange(e)}
                            />
                        </td>
                      </tr>


                      <tr>
                        <td className="tg-Nonpg-sl NonpgEven bgncoa8" rowSpan="2">
                            Bull/Castrated Bull (ষাঁড়/বলদ সংখ্যা)
                        </td>
                        <td className="tg-Nonpg-22sb bgncoa8" >
                            Native (দেশি)
                        </td>
                        <td className="tg-Nonpg-22sb bgncoa8" >
                            <input
                            id="CowBullNative"
                            name="CowBullNative"
                            type="number"
                            className="numberInput"
                            placeholder="0"
                            value={currentRow.CowBullNative}
                            onChange={(e) => handleChange(e)}
                            />
                        </td>
                      </tr>
                      <tr>
                        <td className="tg-Nonpg-22sb bgncoa8">
                            Cross (শংকর)
                        </td>
                        <td className="tg-Nonpg-22sb bgncoa8">
                            <input
                            id="CowBullCross"
                            name="CowBullCross"
                            type="number"
                            className="numberInput"
                            placeholder="0"
                            value={currentRow.CowBullCross}
                            onChange={(e) => handleChange(e)}
                            />
                        </td>
                      </tr>




                      <tr>
                        <td className="tg-Nonpg-sl NonpgOdd bgncoa8" rowSpan="2">
                            Calf Male (এঁড়ে বাছুর সংখ্যা)
                        </td>
                        <td className="tg-Nonpg-22sb bgncoa8" >
                            Native (দেশি)
                        </td>
                        <td className="tg-Nonpg-22sb bgncoa8" >
                            <input
                            id="CowCalfMaleNative"
                            name="CowCalfMaleNative"
                            type="number"
                            className="numberInput"
                            placeholder="0"
                            value={currentRow.CowCalfMaleNative}
                            onChange={(e) => handleChange(e)}
                            />
                        </td>
                      </tr>
                      <tr>
                        <td className="tg-Nonpg-22sb bgncoa8">
                            Cross (শংকর)
                        </td>
                        <td className="tg-Nonpg-22sb bgncoa8">
                            <input
                            id="CowCalfMaleCross"
                            name="CowCalfMaleCross"
                            type="number"
                            className="numberInput"
                            placeholder="0"
                            value={currentRow.CowCalfMaleCross}
                            onChange={(e) => handleChange(e)}
                            />
                        </td>
                      </tr>




                      <tr>
                        <td className="tg-Nonpg-sl NonpgEven bgncoa8" rowSpan="2">
                           Calf Female (বকনা বাছুর সংখ্যা)
                        </td>
                        <td className="tg-Nonpg-22sb bgncoa8" >
                            Native (দেশি)
                        </td>
                        <td className="tg-Nonpg-22sb bgncoa8" >
                            <input
                            id="CowCalfFemaleNative"
                            name="CowCalfFemaleNative"
                            type="number"
                            className="numberInput"
                            placeholder="0"
                            value={currentRow.CowCalfFemaleNative}
                            onChange={(e) => handleChange(e)}
                            />
                        </td>
                      </tr>
                      <tr>
                        <td className="tg-Nonpg-22sb bgncoa8">
                            Cross (শংকর)
                        </td>
                        <td className="tg-Nonpg-22sb bgncoa8">
                            <input
                            id="CowCalfFemaleCross"
                            name="CowCalfFemaleCross"
                            type="number"
                            className="numberInput"
                            placeholder="0"
                            value={currentRow.CowCalfFemaleCross}
                            onChange={(e) => handleChange(e)}
                            />
                        </td>
                      </tr>



                      
                      <tr>
                        <td className="tg-Nonpg-sl NonpgOdd bgncoa8" rowSpan="2">
                          Milk Production per day (Liter)/(দৈনিক দুধের পরিমান (লিটার))
                        </td>
                        <td className="tg-Nonpg-22sb bgncoa8" >
                            Native (দেশি)
                        </td>
                        <td className="tg-Nonpg-22sb bgncoa8" >
                            <input
                            id="CowMilkProductionNative"
                            name="CowMilkProductionNative"
                            type="number"
                            className="numberInput"
                            placeholder="0"
                            value={currentRow.CowMilkProductionNative}
                            onChange={(e) => handleChange(e)}
                            />
                        </td>
                      </tr>
                      <tr>
                        <td className="tg-Nonpg-22sb bgncoa8">
                            Cross (শংকর)
                        </td>
                        <td className="tg-Nonpg-22sb bgncoa8 fixed-width-td">
                            <input
                            id="CowMilkProductionCross"
                            name="CowMilkProductionCross"
                            type="number"
                            className="numberInput"
                            placeholder="0"
                            value={currentRow.CowMilkProductionCross}
                            onChange={(e) => handleChange(e)}
                            />
                        </td>
                      </tr>




                  </thead>
                  <tbody>
                  </tbody>
                </table>
            </div>
          </div>

{/* ========= End Cow Table ===========*/}




{/* ========= Start Buffalo Table ===========*/}
<div className="formControl-mobile">
            <label></label>
            <div className="newTableDivNonpg">
                <table className="tg-Nonpg border2">
                  <thead>

                      {/* <tr>
                        <td className="tg-Nonpg-sl tg-Nonpgtitle" colSpan="3">
                        Number of cattle (গবাদি প্রাণির সংখ্যা)
                        </td>
                      </tr> */}

                      <tr>
                        <td className="tg-Nonpg-sl NonpgOdd bgncoa2" rowSpan="2">
                            Adult Buffalo (মহিষের সংখ্যা)
                        </td>
                        <td className="tg-Nonpg-22sb bgncoa2" >
                            Male (ষাঁড়)
                        </td>
                        <td className="tg-Nonpg-22sb bgncoa2 maxwidthinp" >
                            <input
                            id="BuffaloAdultMale"
                            name="BuffaloAdultMale"
                            type="number"
                            className="numberInput"
                            placeholder="0"
                            value={currentRow.BuffaloAdultMale}
                            onChange={(e) => handleChange(e)}
                            />
                        </td>
                      </tr>
                      <tr>
                        <td className="tg-Nonpg-22sb bgncoa2">
                           Female (গাভী)
                        </td>
                        <td className="tg-Nonpg-22sb bgncoa2 maxwidthinp">
                            <input
                            id="BuffaloAdultFemale"
                            name="BuffaloAdultFemale"
                            type="number"
                            className="numberInput"
                            placeholder="0"
                            value={currentRow.BuffaloAdultFemale}
                            onChange={(e) => handleChange(e)}
                            />
                        </td>
                      </tr>


                      <tr>
                        <td className="tg-Nonpg-sl NonpgEven bgncoa2" rowSpan="2">
                           Calf Buffalo (বাছুর মহিষের সংখ্যা)	
                        </td>
                        <td className="tg-Nonpg-22sb bgncoa2" >
                             Male (এঁড়ে)
                        </td>
                        <td className="tg-Nonpg-22sb bgncoa2" >
                            <input
                            id="BuffaloCalfMale"
                            name="BuffaloCalfMale"
                            type="number"
                            className="numberInput"
                            placeholder="0"
                            value={currentRow.BuffaloCalfMale}
                            onChange={(e) => handleChange(e)}
                            />
                        </td>
                      </tr>
                      <tr>
                        <td className="tg-Nonpg-22sb bgncoa2">
                            Female (বকনা)
                        </td>
                        <td className="tg-Nonpg-22sb bgncoa2">
                            <input
                            id="BuffaloCalfFemale"
                            name="BuffaloCalfFemale"
                            type="number"
                            className="numberInput"
                            placeholder="0"
                            value={currentRow.BuffaloCalfFemale}
                            onChange={(e) => handleChange(e)}
                            />
                        </td>
                      </tr>




                      <tr>
                        <td className="tg-Nonpg-sl NonpgOdd bgncoa2" colSpan="2">
                           Milk Production per day (দৈনিক দুধের পরিমান (লিটার))
                        </td>
                      
                        <td className="tg-Nonpg-22sb bgncoa2 fixed-width-td" >
                            <input
                            id="BuffaloMilkProduction"
                            name="BuffaloMilkProduction"
                            type="number"
                            className="numberInput"
                            placeholder="0"
                            value={currentRow.BuffaloMilkProduction}
                            onChange={(e) => handleChange(e)}
                            />
                        </td>
                      </tr>
             





                  </thead>
                  <tbody>
                  </tbody>
                </table>
            </div>
          </div>

{/* ========= End Buffalo Table ===========*/}



{/* ========= Start Goat Table ===========*/}
<div className="formControl-mobile">
            <label></label>
            <div className="newTableDivNonpg">
                <table className="tg-Nonpg border3">
                  <thead>

                      {/* <tr>
                        <td className="tg-Nonpg-sl tg-Nonpgtitle" colSpan="3">
                        Number of cattle (গবাদি প্রাণির সংখ্যা)
                        </td>
                      </tr> */}

                      <tr>
                        <td className="tg-Nonpg-sl NonpgOdd bgncoa1" rowSpan="2">
                           Adult Goat (ছাগল সংখ্যা)
                        </td>
                        <td className="tg-Nonpg-22sb bgncoa1" >
                             Male (পাঁঠা/খাসি) 
                        </td>
                        <td className="tg-Nonpg-22sb bgncoa1" >
                            <input
                            id="GoatAdultMale"
                            name="GoatAdultMale"
                            type="number"
                            className="numberInput"
                            placeholder="0"
                            value={currentRow.GoatAdultMale}
                            onChange={(e) => handleChange(e)}
                            />
                        </td>
                      </tr>
                      <tr>
                        <td className="tg-Nonpg-22sb bgncoa1">
                            Female (ছাগী)
                        </td>
                        <td className="tg-Nonpg-22sb bgncoa1">
                            <input
                            id="GoatAdultFemale"
                            name="GoatAdultFemale"
                            type="number"
                            className="numberInput"
                            placeholder="0"
                            value={currentRow.GoatAdultFemale}
                            onChange={(e) => handleChange(e)}
                            />
                        </td>
                      </tr>


                      <tr>
                        <td className="tg-Nonpg-sl NonpgEven bgncoa1" rowSpan="2">
                            Calf (ছাগল ছানার সংখ্যা) 
                        </td>
                        <td className="tg-Nonpg-22sb bgncoa1" >
                             Male (পুং) 
                        </td>
                        <td className="tg-Nonpg-22sb bgncoa1" >
                            <input
                            id="GoatCalfMale"
                            name="GoatCalfMale"
                            type="number"
                            className="numberInput"
                            placeholder="0"
                            value={currentRow.GoatCalfMale}
                            onChange={(e) => handleChange(e)}
                            />
                        </td>
                      </tr>
                      <tr>
                        <td className="tg-Nonpg-22sb bgncoa1">
                           Female (স্ত্রী)
                        </td>
                        <td className="tg-Nonpg-22sb bgncoa1">
                            <input
                            id="GoatCalfFemale"
                            name="GoatCalfFemale"
                            type="number"
                            className="numberInput"
                            placeholder="0"
                            value={currentRow.GoatCalfFemale}
                            onChange={(e) => handleChange(e)}
                            />
                        </td>
                      </tr>



                      <tr>
                        <td className="tg-Nonpg-sl NonpgOdd bgncoa1" rowSpan="2">
                            Adult Sheep (ভেড়ার সংখ্যা) 
                        </td>
                        <td className="tg-Nonpg-22sb bgncoa1" >
                             Male (পাঁঠা/খাসি) 
                        </td>
                        <td className="tg-Nonpg-22sb bgncoa1" >
                            <input
                            id="SheepAdultMale"
                            name="SheepAdultMale"
                            type="number"
                            className="numberInput"
                            placeholder="0"
                            value={currentRow.SheepAdultMale}
                            onChange={(e) => handleChange(e)}
                            />
                        </td>
                      </tr>
                      <tr>
                        <td className="tg-Nonpg-22sb bgncoa1">
                             Female(ভেড়ি)
                        </td>
                        <td className="tg-Nonpg-22sb bgncoa1">
                            <input
                            id="SheepAdultFemale"
                            name="SheepAdultFemale"
                            type="number"
                            className="numberInput"
                            placeholder="0"
                            value={currentRow.SheepAdultFemale}
                            onChange={(e) => handleChange(e)}
                            />
                        </td>
                      </tr>


                      
                      <tr>
                        <td className="tg-Nonpg-sl NonpgEven bgncoa1" rowSpan="2">
                            Calf (ভেড়া ছানার সংখ্যা)
                        </td>
                        <td className="tg-Nonpg-22sb bgncoa1" >
                             Male (পুং) 
                        </td>
                        <td className="tg-Nonpg-22sb bgncoa1" >
                            <input
                            id="SheepCalfMale"
                            name="SheepCalfMale"
                            type="number"
                            className="numberInput"
                            placeholder="0"
                            value={currentRow.SheepCalfMale}
                            onChange={(e) => handleChange(e)}
                            />
                        </td>
                      </tr>
                      <tr>
                        <td className="tg-Nonpg-22sb bgncoa1">
                           Female (স্ত্রী)
                        </td>
                        <td className="tg-Nonpg-22sb bgncoa1">
                            <input
                            id="SheepCalfFemale"
                            name="SheepCalfFemale"
                            type="number"
                            className="numberInput"
                            placeholder="0"
                            value={currentRow.SheepCalfFemale}
                            onChange={(e) => handleChange(e)}
                            />
                        </td>
                      </tr>



                      <tr>
                        <td className="tg-Nonpg-sl NonpgOdd bgncoa1" colSpan="2">
                            Milk Production per day (Liter)/(দৈনিক দুধের পরিমান (লিটার))
                        </td>
                      
                        <td className="tg-Nonpg-22sb bgncoa1 fixed-width-td" >
                            <input
                            id="GoatSheepMilkProduction"
                            name="GoatSheepMilkProduction"
                            type="number"
                            className="numberInput"
                            placeholder="0"
                            value={currentRow.GoatSheepMilkProduction}
                            onChange={(e) => handleChange(e)}
                            />
                        </td>
                      </tr>
             





                  </thead>
                  <tbody>
                  </tbody>
                </table>
            </div>
          </div>

{/* ========= End Goat Table ===========*/}




           {/* Start Chicken Table */}
           
           <div className="formControl-mobile">
              <label></label>
              <div className="newTableDivNonpg">
                  <table className="tg-Nonpg border4">
                    <thead>

                       
                        <tr>
                          <td className="tg-Nonpg-sl NonpgOdd bgnco" rowSpan="4">
                              Chicken (মুরগির সংখ্যা) 
                          </td>
                          <td className="tg-Nonpg-22sb bgnco" >
                             Native (দেশি)
                          </td>
                          <td className="tg-Nonpg-22sb bgnco" >
                              <input
                              id="ChickenNative"
                              name="ChickenNative"
                              type="number"
                              className="numberInput"
                              placeholder="0"
                              value={currentRow.ChickenNative}
                              onChange={(e) => handleChange(e)}
                              />
                          </td>
                        </tr>
                        <tr>
                          <td className="tg-Nonpg-22sb bgnco">
                              Layer (লেয়ার)
                          </td>
                          <td className="tg-Nonpg-22sb bgnco">
                              <input
                              id="ChickenLayer"
                              name="ChickenLayer"
                              type="number"
                              className="numberInput"
                              placeholder="0"
                              value={currentRow.ChickenLayer}
                              onChange={(e) => handleChange(e)}
                              />
                          </td>
                        </tr>

                        <tr>
                          
                          <td className="tg-Nonpg-22sb bgnco" >
                          Sonali/Fayoumi/ Cockerel (সোনালী / ফাউমি / ককরেল)
                          </td>
                          <td className="tg-Nonpg-22sb bgnco" >
                              <input
                              id="ChickenSonaliFayoumiCockerelOthers"
                              name="ChickenSonaliFayoumiCockerelOthers"
                              type="number"
                              className="numberInput"
                              placeholder="0"
                              value={currentRow.ChickenSonaliFayoumiCockerelOthers}
                              onChange={(e) => handleChange(e)}
                              />
                          </td>
                        </tr>

                        <tr>
                          <td className="tg-Nonpg-22sb bgnco">
                          Broiler (ব্রয়লার)
                          </td>
                          <td className="tg-Nonpg-22sb bgnco">
                              <input
                              id="ChickenBroiler"
                              name="ChickenBroiler"
                              type="number"
                              className="numberInput"
                              placeholder="0"
                              value={currentRow.ChickenBroiler}
                              onChange={(e) => handleChange(e)}
                              />
                          </td>
                        </tr>

                        <tr>
                        <td className="tg-Nonpg-sl NonpgEven bgnco" colSpan="2">
                        Daily Egg production (দৈনিক ডিম উৎপাদন)
                        </td>
                      
                        <td className="tg-Nonpg-22sb bgnco fixed-width-td" >
                            <input
                            id="ChickenEgg"
                            name="ChickenEgg"
                            type="number"
                            className="numberInput"
                            placeholder="0"
                            value={currentRow.ChickenEgg}
                            onChange={(e) => handleChange(e)}
                            />
                        </td>
                      </tr>


                    </thead>
                    <tbody>
                    </tbody>
                  </table>
              </div>
            </div>

           {/* End Chicken Table */}


          {/* Start Ducks/Swan Table */}
          <div className="formControl-mobile">
                      <label></label>
                      <div className="newTableDivNonpg">
                          <table className="tg-Nonpg border5">
                            <thead>

                                <tr>
                                  <td className="tg-Nonpg-s1" >
                                      Number of Ducks/Swan (হাঁসের/রাজহাঁসের সংখ্যা)
                                  </td>
                                  <td className="tg-Nonpg-s1" >
                                      <input
                                      id="DucksNumber"
                                      name="DucksNumber"
                                      type="number"
                                      className="numberInput"
                                      placeholder="0"
                                      value={currentRow.DucksNumber}
                                      onChange={(e) => handleChange(e)}
                                      />
                                  </td>
                                </tr>
                                <tr>
                                  <td className="tg-Nonpg-s1">
                                       Daily Egg production (দৈনিক হাঁসের ডিম উৎপাদন)
                                  </td>
                                  <td className="tg-Nonpg-s1 fixed-width-td">
                                      <input
                                      id="DucksEgg"
                                      name="DucksEgg"
                                      type="number"
                                      className="numberInput"
                                      placeholder="0"
                                      value={currentRow.DucksEgg}
                                      onChange={(e) => handleChange(e)}
                                      />
                                  </td>
                                </tr>

                            </thead>
                            <tbody>
                            </tbody>
                          </table>
                      </div>
                    </div>
                    {/* End Ducks/Swan  */}


                      {/* Start Pigeon  Table */}
                      <div className="formControl-mobile">
                            <label></label>
                            <div className="newTableDivNonpg">
                                <table className="tg-Nonpg border6">
                                  <thead>

                                      <tr>
                                        <td className="tg-Nonpg-ab" >
                                            Number of Pigeon (কবুতরের সংখ্যা)
                                        </td>
                                        <td className="tg-Nonpg-ab fixed-width-td" >
                                            <input
                                            id="PigeonNumber"
                                            name="PigeonNumber"
                                            type="number"
                                            className="numberInput"
                                            placeholder="0"
                                            value={currentRow.PigeonNumber}
                                            onChange={(e) => handleChange(e)}
                                            />
                                        </td>
                                      </tr>
                                      

                                  </thead>
                                  <tbody>
                                  </tbody>
                                </table>
                            </div>
                          </div>
                          {/* End Pigeon   */}



                      {/* Start family members Table */}
                      <div className="formControl-mobile">
                            <label></label>
                            <div className="newTableDivNonpg">
                                <table className="tg-Nonpg border7">
                                  <thead>

                                      <tr>
                                        <td className="tg-Nonpg-st" >
                                        Number of family members (পরিবারের মোট সদস্য সংখ্যা)
                                        </td>
                                        <td className="tg-Nonpg-st fixed-width-td" >
                                            <input
                                            id="FamilyMember"
                                            name="FamilyMember"
                                            type="number"
                                            className="numberInput"
                                            placeholder="0"
                                            value={currentRow.FamilyMember}
                                            onChange={(e) => handleChange(e)}
                                            />
                                        </td>
                                      </tr>
                                      

                                  </thead>
                                  <tbody>
                                  </tbody>
                                </table>
                            </div>
                          </div>
                          {/* End family members    */}




                      {/* Start land  Table */}
                      <div className="formControl-mobile">
                            <label></label>
                            <div className="newTableDivNonpg">
                                <table className="tg-Nonpg border8">
                                  <thead>

                                      <tr>
                                        <td className="tg-Nonpg-99sb" >
                                        Total cultivable land in decimal (মোট চাষ যোগ্য জমির পরিমান (শতাংশ))
                                        </td>
                                        <td className="tg-Nonpg-99sb" >
                                            <input
                                            id="LandTotal"
                                            name="LandTotal"
                                            type="number"
                                            className="numberInput"
                                            placeholder="0"
                                            value={currentRow.LandTotal}
                                            onChange={(e) => handleChange(e)}
                                            />
                                        </td>
                                      </tr>


                                      <tr>
                                        <td className="tg-Nonpg-99sb" >
                                        Own land for Fodder cultivation (নিজস্ব ঘাস চাষের জমি (শতাংশ))
                                        </td>
                                        <td className="tg-Nonpg-99sb" >
                                            <input
                                            id="LandOwn"
                                            name="LandOwn"
                                            type="number"
                                            className="numberInput"
                                            placeholder="0"
                                            value={currentRow.LandOwn}
                                            onChange={(e) => handleChange(e)}
                                            />
                                        </td>
                                      </tr>

                                      <tr>
                                        <td className="tg-Nonpg-99sb" >
                                        Leased land for fodder cultivation (লিজ নেয়া ঘাস চাষের জমি (শতাংশ))
                                        </td>
                                        <td className="tg-Nonpg-99sb fixed-width-td" >
                                            <input
                                            id="LandLeased"
                                            name="LandLeased"
                                            type="number"
                                            className="numberInput"
                                            placeholder="0"
                                            value={currentRow.LandLeased}
                                            onChange={(e) => handleChange(e)}
                                            />
                                        </td>
                                      </tr>
                                      
                                      

                                  </thead>
                                  <tbody>
                                  </tbody>
                                </table>
                            </div>
                          </div>
                          {/* End land  members    */}



                      {/* Start Enumerator  Table */}
                      <div className="formControl-mobile">
                            <label></label>
                            <div className="newTableDivNonpg">
                                <table className="tg-Nonpg border9">
                                  <thead>

                                      <tr>
                                        <td className="tg-Nonpg-99sbx" >
                                            Date of Interview *
                                        </td>
                                        <td className="tg-Nonpg-99sbx" >
                                            <input
                                            id="DataCollectionDate"
                                            name="DataCollectionDate"
                                            type="date"
                                            className="numberInput"
                                            class={errorObject.DataCollectionDate}
                                            /* placeholder="0" */
                                            value={currentRow.DataCollectionDate}
                                            onChange={(e) => handleChange(e)}
                                            />
                                        </td>
                                      </tr>


                                      <tr>
                                        <td className="tg-Nonpg-99sbx" >
                                          Name of Enumerator *
                                        </td>
                                        <td className="tg-Nonpg-99sbx" >
                                            <input
                                             id="DataCollectorName"
                                             name="DataCollectorName"
                                            type="text"
                                           /*  className="numberInput" */
                                            class={errorObject.DataCollectorName}
                                            value={currentRow.DataCollectorName}
                                            onChange={(e) => handleChange(e)}
                                            />
                                        </td>
                                      </tr>

                                      {/* <tr>
                                        <td className="tg-Nonpg-99sbx" >
                                          Enumerator Designation
                                        </td>
                                        <td className="tg-Nonpg-99sbx " >
                                            <input
                                            type="number"
                                            className="numberInput"
                                            value={currentRow.DesignationId}
                                            onChange={(e) => handleChange(e)}
                                            />
                                        </td>
                                      </tr> */}


                                        <tr>
                                          <td className="tg-Nonpg-99sbx">
                                            Enumerator Designation
                                          </td>
                                          <td className="tg-Nonpg-99sbx">
                                            <Autocomplete
                                              autoHighlight
                                              className="chosen_dropdown"
                                              id="DesignationId"
                                              name="DesignationId"
                                              autoComplete
                                              options={DesignationList ? DesignationList : []}
                                              getOptionLabel={(option) => option.name}
                                              value={
                                                DesignationList
                                                  ? DesignationList[
                                                      DesignationList.findIndex(
                                                        (list) => list.id == currentRow.DesignationId
                                                      )
                                                    ]
                                                  : null
                                              }
                                              onChange={(event, valueobj) =>
                                                handleChangeChoosenMaster("DesignationId", valueobj ? valueobj.id : "")
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
                                          </td>
                                        </tr>


                                      <tr>
                                        <td className="tg-Nonpg-99sbx" >
                                        Cell No. of Enumerator
                                        </td>
                                        <td className="tg-Nonpg-99sbx" >
                                            <input
                                            id="PhoneNumber"
                                            name="PhoneNumber"
                                            type="text"
                                            value={currentRow.PhoneNumber}
                                            onChange={(e) => handleChange(e)}
                                            />
                                        </td>
                                      </tr>

                                      <tr>
                                        <td className="tg-Nonpg-99sbx" >
                                          Enumerator Comment
                                        </td>
                                        <td className="tg-Nonpg-99sbx " >
                                            <textarea
                                             id="Remarks"
                                             name="Remarks"
                                            type="text"
                                            value={currentRow.Remarks}
                                            onChange={(e) => handleChange(e)}
                                            rows={3}
                                            style={{ width: '100%' }}
                                            />
                                        </td>
                                      </tr>
                                      
                                      

                                  </thead>
                                  <tbody>
                                  </tbody>
                                </table>
                            </div>
                          </div>
                          {/* End Enumerator members    */}






        
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
