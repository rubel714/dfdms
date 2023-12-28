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

  /*   const [ward, setWard] = useState(null);
  const [currWard, setCurrWard] = useState(null); */

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
    /* getWardList(props.currentRow.Ward);
    getPGIdList(props.currentRow.PGId); */
    // getValuechainIdList(props.currentRow.ValuechainId);

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
        selectValuechainId,
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

      /*  getWardList(
        selectDivisionId,
        SelectDistrictId,
        selectUpazilaId,
        selectUnionId,
        selectPGId
      ); */

      /* getPGIdList(
        selectDivisionId,
        SelectDistrictId,
        selectUpazilaId,
        selectUnionId,
        selectValuechainId,
        selectPGId
      ); */

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
        [{ id: "", name: "Select City Corporation/ Municipality" }].concat(
          res.data.datalist
        )
      );

      setCurrCityCorporation(selectCityCorporation);
    });
  }

  /*   function getWardList(selectDivisionId,
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
  } */

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
    /* if (name === "Ward") {
      setCurrWard(value);
    } */
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
    /*   if (name === "QuestionParentId") {
      setCurrParentQuestion(value);
    } */

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

    /* console.log("Test file upload ", selectedFile);
    uploadImage(selectedFile); */
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

  /*   React.useEffect(() => {
    if (props.currentRow.NidFrontPhoto) {
      setPreviewImage(require("../../../assets/farmerimage/" + props.currentRow.NidFrontPhoto));
    }
  }, [props.currentRow.NidFrontPhoto]); */

  /*   const handleFileChange = (e) => {
    setUploadCompleted(1);
    e.preventDefault(); // Prevent default form submission behavior
    const file = e.target.files[0];
    if (file) {
      uploadImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
    
  }; */

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

  /*  const uploadImage = (file) => {
    console.log('file: ', file);
    
    if (!file) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    let timestamp = Math.floor(new Date().getTime() / 1000); // Generate timestamp in seconds

     formData.append("file", file); 
     formData.append("timestamp", timestamp);  // Include timestamp as a parameter
     formData.append(
      "filename",
      `./src/assets/farmerimage/${timestamp}_${file.name}`
    ); 

    apiCall.post("upload-image", formData, apiOption()).then((res) => {
      //console.log(res);
       setCurrentRow((prevData) => ({
        ...prevData,
        NidFrontPhoto: `${timestamp}_${file.name}`,
      })); 

      //setUploadCompleted(0);

    }).catch((error) => {
      console.error("API call error:", error);
     
    });

  }; */

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
          {/* <div class="modalHeaderWithButton">
            <h4>Add/Edit Farmer Profile</h4>
            <Button
              label={"Back to List"}
              class={"btnClose"}
              onClick={modalClose}
            />
          </div> */}

          <div class="contactmodalBodyOnePage pt-10">
            <label>Is Regular Beneficiary?</label>
            <select
              id="IsRegular"
              name="IsRegular"
              disabled="true"
              class={errorObject.IsRegular}
              value={currisRegularBeneficiary}
              onChange={(e) => handleChange(e)}
            >
              {isRegularBeneficiaryList &&
                isRegularBeneficiaryList.map((item, index) => {
                  return <option value={item.id}>{item.name}</option>;
                })}
            </select>

            <label>Beneficiary NID* </label>
            <input
              type="text"
              id="NID"
              name="NID"
              //disabled={currentRow.id?true:false}
              class={errorObject.NID}
              placeholder="Enter Beneficiary NID"
              value={currentRow.NID}
              onChange={(e) => handleChange(e)}
              onBlur={handleBlur}
            />
          </div>

          <div className="contactmodalBodyOnePage pt-10">
            <label>NID Front Photo</label>
            <input
              type="file"
              id="NidFrontPhoto"
              name="NidFrontPhoto"
              accept="image/*"
              //onChange={handleFileChange}
              onChange={(e) => handleFileChange(e, "NidFrontPhoto")}
            />

            {previewImages.NidFrontPhoto && (
              <div className="image-preview-nid">
                <img
                  //src={`${baseUrl}/dfdms/src/assets/farmerimage/${currentRow.NidFrontPhoto}`}
                  src={
                    currentRow.NidFrontPhoto
                      ? `${baseUrl}src/assets/farmerimage/${currentRow.NidFrontPhoto}`
                      : previewImage
                  }
                  alt="NID Front Preview"
                  className="preview-image"
                />
              </div>
            )}
          </div>

          <div className="contactmodalBodyOnePage pt-10">
            <label>NID Back Photo</label>
            <input
              type="file"
              id="NidBackPhoto"
              name="NidBackPhoto"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "NidBackPhoto")}
            />

            {previewImages.NidBackPhoto && (
              <div className="image-preview-nid">
                <img
                  //src={`${baseUrl}/dfdms/src/assets/farmerimage/${currentRow.NidBackPhoto}`}
                  src={
                    currentRow.NidBackPhoto
                      ? `${baseUrl}src/assets/farmerimage/${currentRow.NidBackPhoto}`
                      : previewImage
                  }
                  alt="NID Back Preview"
                  className="preview-image"
                />
              </div>
            )}
          </div>

          <div class="contactmodalBodyOnePage pt-10">
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

          <div class="contactmodalBodyOnePage pt-10 ">
            <label>Beneficiary Photo</label>
            <input
              type="file"
              id="BeneficiaryPhoto"
              name="BeneficiaryPhoto"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "BeneficiaryPhoto")}
            />
            {previewImages.BeneficiaryPhoto && (
              <div className="image-preview">
                <img
                  //src={`${baseUrl}/dfdms/src/assets/farmerimage/${currentRow.BeneficiaryPhoto}`}
                  src={
                    currentRow.BeneficiaryPhoto
                      ? `${baseUrl}src/assets/farmerimage/${currentRow.BeneficiaryPhoto}`
                      : previewImage
                  }
                  alt="Beneficiary Preview"
                  className="preview-image"
                />
              </div>
            )}
          </div>

          <div class="contactmodalBodyOnePage pt-10 ">
            <label>Father's Name </label>
            <input
              type="text"
              id="FatherName"
              name="FatherName"
              placeholder="Enter Father Name"
              value={currentRow.FatherName}
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

          <div class="contactmodalBodyOnePage pt-10 ">
            <label>Mother's Name </label>
            <input
              type="text"
              id="MotherName"
              name="MotherName"
              placeholder="Enter Mother's Name"
              value={currentRow.MotherName}
              onChange={(e) => handleChange(e)}
            />

            <label>Date of Birth* </label>
            <input
              type="date"
              id="dob"
              name="dob"
              class={errorObject.dob}
              placeholder="Select Date of birth"
              value={currentRow.dob}
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div class="contactmodalBodyOnePage pt-10 ">
            <label>Gender*</label>
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

            <label>Farmer's Age* </label>
            <input
              type="text"
              id="FarmersAge"
              name="FarmersAge"
              disabled="true"
              class={errorObject.FarmersAge}
              placeholder="Enter Farmer's Age"
              value={currentRow.FarmersAge}
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div class="contactmodalBodyOnePage pt-10 ">
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

            <label>Farmer's Relationship with Head of HH</label>
            {/*  <div className="checkbox-label">
              <label className="radio-label">
                <input
                  type="radio"
                  id="RelationWithHeadOfHH"
                  name="RelationWithHeadOfHH"
                  value={1}
                  checked={currentRow.RelationWithHeadOfHH === 1}
                  onChange={() => handleChangeMany(1, "RelationWithHeadOfHH")}
                />
                Himself/Herself
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
            </div> */}

            <div className="checkbox-label">
              {Object.entries(relationWith).map(([value, label]) => (
                <label className="radio-label" key={value}>
                  <input
                    type="radio"
                    id={`RelationWithHeadOfHH_${value}`}
                    name="RelationWithHeadOfHH"
                    value={value}
                    checked={
                      (currentRow.RelationWithHeadOfHH === 0 &&
                        Number(value) === 1) ||
                      currentRow.RelationWithHeadOfHH === Number(value)
                    }
                    onChange={() =>
                      handleChangeMany(Number(value), "RelationWithHeadOfHH")
                    }
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          {currentRow.RelationWithHeadOfHH === 2 && (
            <>
              <div class="modalItem modalItemCondition">
                <label>If others, specify* </label>
                <input
                  type="text"
                  id="ifOtherSpecify"
                  name="ifOtherSpecify"
                  placeholder="Enter if Others, Specify"
                  class={errorObject.ifOtherSpecify}
                  value={currentRow.ifOtherSpecify}
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </>
          )}

          <div class="contactmodalBodyOnePage pt-10 ">
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

            {currentRow.PGRegistered === 1 && (
              <>
                <label>Agency/Department</label>
                <select
                  id="DepartmentId"
                  name="DepartmentId"
                  class={errorObject.DepartmentId}
                  value={currDepartment}
                  onChange={(e) => handleChange(e)}
                >
                  {department &&
                    department.map((item, index) => {
                      return <option value={item.id}>{item.name}</option>;
                    })}
                </select>

                <label>Date of Registration </label>
                <input
                  type="date"
                  id="DateOfRegistration"
                  name="DateOfRegistration"
                  class={errorObject.DateOfRegistration}
                  placeholder="Select Date of Registration"
                  value={currentRow.DateOfRegistration}
                  onChange={(e) => handleChange(e)}
                />

                <label>Registration No *</label>
                <input
                  type="text"
                  id="RegistrationNo"
                  name="RegistrationNo"
                  placeholder="Enter Registration No"
                  class={errorObject.RegistrationNo}
                  value={currentRow.RegistrationNo}
                  onChange={(e) => handleChange(e)}
                />
              </>
            )}
          </div>

          <div class="contactmodalBodyOnePage pt-10 ">
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
              Do your PG make any productive partnership with any other company?
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

            {currentRow.PGPartnershipWithOtherCompany === 1 && (
              <>
                <label>Name of The Company your PG Partner with* </label>
                <input
                  type="text"
                  id="NameOfTheCompanyYourPgPartnerWith"
                  name="NameOfTheCompanyYourPgPartnerWith"
                  placeholder="Enter Name of The Company Your Pg Partner With"
                  class={errorObject.NameOfTheCompanyYourPgPartnerWith}
                  value={currentRow.NameOfTheCompanyYourPgPartnerWith}
                  onChange={(e) => handleChange(e)}
                />
              </>
            )}
          </div>

          <div class="contactmodalBodyOnePage pt-10">
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

            <label>Primary Occupation</label>
            <select
              id="OccupationId"
              name="OccupationId"
              class={errorObject.OccupationId}
              value={currFamilyOccupation}
              onChange={(e) => handleChange(e)}
            >
              {familyOccupation &&
                familyOccupation.map((item, index) => {
                  return <option value={item.id}>{item.name}</option>;
                })}
            </select>
          </div>

          <div class="contactmodalBodyOnePage pt-10">
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

          <div class="contactmodalBodyOnePage pt-10">
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

          <div className="contactmodalBodyOnePage pt-10">
            <label>Value Chain*</label>
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

            <label>Name of Producer Group*</label>
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
          </div>

          <div class="contactmodalBodyOnePage pt-10">
            {/* <label>Name of Producer Group</label>
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
            </select> */}

            <label>Ward</label>
            <input
              type="text"
              id="Ward"
              name="Ward"
              placeholder="Enter Village Name"
              value={currentRow.Ward}
              onChange={(e) => handleChange(e)}
            />

            <label>Village</label>
            <input
              type="text"
              id="VillageName"
              name="VillageName"
              placeholder="Enter Village Name"
              value={currentRow.VillageName}
              onChange={(e) => handleChange(e)}
            />

            {/*  <select
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
            </select> */}
          </div>

          <div class="contactmodalBodyOnePage pt-10 ">
            <label>City Corporation/ Municipality</label>
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

            <label>Address* </label>
            <input
              type="text"
              id="Address"
              name="Address"
              class={errorObject.Address}
              placeholder="Enter Address"
              value={currentRow.Address}
              onChange={(e) => handleChange(e)}
            />

            {/* <label>Village</label>
            <input
              type="text"
              id="VillageName"
              name="VillageName"
              placeholder="Enter Village Name"
              value={currentRow.VillageName}
              onChange={(e) => handleChange(e)}
            /> */}
          </div>

          <div className="contactmodalBodyOnePage pt-10">
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

            {/* <label>Address* </label>
            <input
              type="text"
              id="Address"
              name="Address"
              class={errorObject.Address}
              placeholder="Enter Address"
              value={currentRow.Address}
              onChange={(e) => handleChange(e)}
            /> */}
          </div>

          <div className="contactmodalBodyOnePage pt-10">
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
                label={"Location"}
                class={"btnDetailsLatLong"}
                onClick={getLocation}
              />
            </div>

            {/* <label>Are You Head of The Group?</label>
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
            </div> */}
          </div>

          <div class="contactmodalBodyOnePage pt-10 ">
            <label>When Did you start to operate your farm? </label>
            <input
              type="date"
              id="WhenDidYouStartToOperateYourFirm"
              name="WhenDidYouStartToOperateYourFirm"
              class={errorObject.WhenDidYouStartToOperateYourFirm}
              placeholder="Select Date of birth"
              value={currentRow.WhenDidYouStartToOperateYourFirm}
              onChange={(e) => handleChange(e)}
              max={currentDate.toISOString().split("T")[0]}
            />
          </div>

          <div class="contactmodalBodyOnePage pt-10 ">
            <label>Number of Months of your operation </label>
            <input
              type="text"
              id="NumberOfMonthsOfYourOperation"
              name="NumberOfMonthsOfYourOperation"
              disabled="true"
              class={errorObject.NumberOfMonthsOfYourOperation}
              placeholder=""
              value={currentRow.NumberOfMonthsOfYourOperation}
              onChange={(e) => handleChange(e)}
            />

            <label>Are you registered your farm with DLS? </label>
            <div className="checkbox-label">
              <label className="radio-label">
                <input
                  type="radio"
                  id="AreYouRegisteredYourFirmWithDlsRadioFlag"
                  name="AreYouRegisteredYourFirmWithDlsRadioFlag"
                  value={1}
                  checked={
                    currentRow.AreYouRegisteredYourFirmWithDlsRadioFlag === 1
                  }
                  onChange={() =>
                    handleChangeMany(
                      1,
                      "AreYouRegisteredYourFirmWithDlsRadioFlag"
                    )
                  }
                />
                Yes
              </label>

              <label className="radio-label">
                <input
                  type="radio"
                  id="AreYouRegisteredYourFirmWithDlsRadioFlag_false"
                  name="AreYouRegisteredYourFirmWithDlsRadioFlag"
                  value={0}
                  checked={
                    currentRow.AreYouRegisteredYourFirmWithDlsRadioFlag === 0
                  }
                  onChange={() =>
                    handleChangeMany(
                      0,
                      "AreYouRegisteredYourFirmWithDlsRadioFlag"
                    )
                  }
                />
                No
              </label>
            </div>
          </div>

          <div class="contactmodalBodyOnePage pt-10 ">
            <label>Registration Date </label>
            <input
              type="date"
              id="registrationDate"
              name="registrationDate"
              disabled={
                currentRow.AreYouRegisteredYourFirmWithDlsRadioFlag === 0
              }
              class={errorObject.registrationDate}
              placeholder="Select Registration Date"
              value={currentRow.registrationDate}
              onChange={(e) => handleChange(e)}
            />

            <label>Registration No. </label>
            <input
              type="text"
              id="IfRegisteredYesRegistrationNo"
              name="IfRegisteredYesRegistrationNo"
              disabled={
                currentRow.AreYouRegisteredYourFirmWithDlsRadioFlag === 0
              }
              class={errorObject.IfRegisteredYesRegistrationNo}
              placeholder="Enter Registration No."
              value={currentRow.IfRegisteredYesRegistrationNo}
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div className="contactmodalBodyOnePage pt-10">
            <label>Farm's Photo</label>
            <input
              type="file"
              id="FarmsPhoto"
              name="FarmsPhoto"
              accept="image/*"
              //onChange={handleFileChange}
              onChange={(e) => handleFileChange(e, "FarmsPhoto")}
            />

            {previewImages.FarmsPhoto && (
              <div className="image-preview">
                <img
                  //src={`${baseUrl}/dfdms/src/assets/farmerimage/${currentRow.FarmsPhoto}`}
                  src={
                    currentRow.FarmsPhoto
                      ? `${baseUrl}src/assets/farmerimage/${currentRow.FarmsPhoto}`
                      : previewImage
                  }
                  alt="Farm's Photo"
                  className="preview-image"
                />
              </div>
            )}
          </div>

          {/*  <div className="contactmodalBodyOnePage pt-10">
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
          </div> */}

          {/* <div class="contactmodalBodyOnePage pt-10">
            <label>Type of Farmers:</label>
          </div>

          <div class="contactmodalBodyOnePageLeargeBox pt-10">
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
          </div> */}

          {/*  <div class="contactmodalBodyOnePage modalItem">
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
