import React, { forwardRef, useRef, useEffect, useState } from "react";
import Cookies from "js-cookie";

import { Button } from "../../../components/CustomControl/Button";
import {
  apiCall,
  apiOption,
  LoginUserInfo,
  language,
} from "../../../actions/api";

import { Typography, TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";

const HouseholdLivestockSurveyDataEntryAddEditModal = (props) => {
  // console.log('props modal: ', props);
  const serverpage = "householdlivestocksurveydataentry"; // this is .php server page
  const [currentRow, setCurrentRow] = useState(props.currentRow);
  const [errorObject, setErrorObject] = useState({});
  const [isServerLoading, setIsServerLoading] = useState(false);

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

  const [gender, setGender] = useState([{ GenderId: "", GenderName: "Select Gender" }].concat(UserInfo.MetaData.GenderList));
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
  const [unionList, setUnionList] = useState([{ UnionId: "", UnionName: "Select Union" }].concat(UserInfo.MetaData.UnionList));
 
  const [currDivisionId, setCurrDivisionId] = useState(null);
  const [currDistrictId, setCurrDistrictId] = useState(null);
  const [currUpazilaId, setCurrUpazilaId] = useState(null);
  const [currUnionId, setCurrUnionId] = useState(null);
  const [RoleList, setRoleList] = useState(null);

  const [department, setDepartment] = useState(null);
  const [currDepartment, setCurrDepartment] = useState(null);
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1);

  const [DesignationList, setDesignationList] = useState([{ DesignationId: "", DesignationName: "Select Designation" }].concat(UserInfo.MetaData.DesignationList));

  let dataSaveInLocal = JSON.parse(localStorage.getItem("householdlivestocksurveydataentry")) || [];


  const relationWith = {
    1: "Himself/Herself",
    2: "Others",
  };

  React.useEffect(() => {
 

    setCurrUnionId(currentRow.UnionId);
    setCurrGender(currentRow.Gender);

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
    if (currentRow.IsPGMember !== undefined && currentRow.IsPGMember !== null) {
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
      setCurrAreYouRegisteredYourFirmWithDlsRadioFlag(currentRow.IsDisability);
    } else {
      setCurrAreYouRegisteredYourFirmWithDlsRadioFlag(0);
    }
  }, []);

  

  const handleChange = (e) => {
    const { name, value } = e.target;
    let data = { ...currentRow };
    data[name] = value;


    setCurrentRow(data);

    setErrorObject({ ...errorObject, [name]: null });

    //for dependancy
   if (name === "UnionId") {
      setCurrUnionId(value);
   
    }

   /*  if (name === "ValuechainId") {
      setCurrValuechainId(value);
      getPGIdList(
        currentRow.DivisionId,
        currentRow.DistrictId,
        currentRow.UpazilaId,
        currentRow.UnionId,
        value,
        ""
      );
    } */

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

    if (name == "PhoneNumber") {
      const onlyNums = value.replace(/[^0-9]/g, "");
      const limitedValue = onlyNums.slice(0, 11);
      data["PhoneNumber"] = limitedValue;
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
      "UnionId",
      "FarmerName",
      "Gender",
      "DataCollectionDate",
      "DataCollectorName",
      "Phone",
      "PhoneNumber",
      "Latitute",
      "Longitute",
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
    setIsServerLoading(true);
  
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
         setIsServerLoading(false);
        return;
      }
    }

    if (validateForm()) {
     

      Cookies.set("Cookie_UnionId", currentRow.UnionId);
      Cookies.set("Cookie_DataCollectorName", currentRow.DataCollectorName);
      Cookies.set("Cookie_DesignationId", currentRow.DesignationId);
      Cookies.set("Cookie_PhoneNumber", currentRow.PhoneNumber);
     

     if (currentRow.id === "") {
          currentRow.id = Math.floor(Date.now() / 1000);
          currentRow.HouseHoldId = Math.floor(Date.now() / 1000);
          
          dataSaveInLocal.push(currentRow);

          localStorage.setItem(
            "householdlivestocksurveydataentry",
            JSON.stringify(dataSaveInLocal)
         );		

         props.masterProps.openNoticeModal({
          isOpen: true,
          msg: "New Data Added Successfully",
          msgtype: 1,
        });

      }else {
        let dataUpdated = false;
    
       
        for (let i = 0; i < dataSaveInLocal.length; i++) {
            if (dataSaveInLocal[i].id === currentRow.id) {
                dataSaveInLocal[i] = currentRow;
                dataUpdated = true;
                break;
            }
        }
    
       
        if (dataUpdated) {
            localStorage.setItem(
                "householdlivestocksurveydataentry",
                JSON.stringify(dataSaveInLocal)
            );	

            props.masterProps.openNoticeModal({
              isOpen: true,
              msg: "Data Updated Successfully",
              msgtype: 1,
            });


        } else {
            console.log("No matching id found to update.");
        }
    }

      
     		  


     

      setUploadCompleted(0);
      props.modalCallback("addedit");
      setIsServerLoading(false);
        
     
      /* let params = {
        action: "dataAddEdit",
        lan: language(),
        UserId: UserInfo.UserId,
        rowData: currentRow,
      };

      apiCall.post(serverpage, { params }, apiOption()).then((res) => {
     
        Cookies.set("Cookie_UnionId", currentRow.UnionId);
        Cookies.set("Cookie_DataCollectorName", currentRow.DataCollectorName);
        Cookies.set("Cookie_DesignationId", currentRow.DesignationId);
        Cookies.set("Cookie_PhoneNumber", currentRow.PhoneNumber);

        props.masterProps.openNoticeModal({
          isOpen: true,
          msg: res.data.message,
          msgtype: res.data.success,
        });

        if (res.data.success === 1) {
          setUploadCompleted(0);
          props.modalCallback("addedit");
        }
        setIsServerLoading(false);
      }); */




    } else {
      setIsServerLoading(false);
      props.masterProps.openNoticeModal({
        isOpen: true,
        msg: "Please enter required fields.",
        msgtype: 0,
      });
    }
  }

  function modalClose() {
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
            <h2>Household Livestock Survey 2024 Data Entry</h2>
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
            <input
                  id="DivisionName"
                  name="DivisionName"
                  type="text"
                  disabled={true}
                  value={UserInfo.DivisionName}

                  />

            {/* <select
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
            </select> */}

             
          </div>
          <div class="formControl-mobile">
            <label>District (জেলা) *</label>

            <input
              id="DistrictName"
              name="DistrictName"
              type="text"
              disabled={true}
              value={UserInfo.DistrictName}

              />
              
            {/* <select
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
            </select> */}
          </div>

          <div class="formControl-mobile">
            <label>Upazila (উপজেলা) *</label>
             <input
                id="UpazilaName"
                name="UpazilaName"
                type="text"
                disabled={true}
                value={UserInfo.UpazilaName}

                />
           {/*  <select
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
            </select> */}
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
                  return <option value={item.UnionId}>{item.UnionName}</option>;
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
            <label>Father’s Name (পিতার নাম) </label>
            <input
              type="text"
              id="FatherName"
              name="FatherName"
              placeholder=""
              value={currentRow.FatherName}
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div class="formControl-mobile hidden">
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

          <div class="formControl-mobile hidden">
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
            <label>Mobile number (মোবাইল নং) *</label>
            <input
              type="text"
              id="Phone"
              name="Phone"
              placeholder=""
              class={errorObject.Phone}
              value={currentRow.Phone}
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div class="formControl-mobile">
            <label>Gender (জেন্ডার) *</label>
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
                  return <option value={item.GenderId}>{item.GenderName}</option>;
                })}
            </select>
          </div>

          <div class="formControl-mobile hidden">
            <label>Is there any disability (প্রতিবন্ধি কিনা)</label>
            <div className="checkbox-label">
              <label className="radio-label">
                <input
                  type="radio"
                  id="IsDisability"
                  name="IsDisability"
                  value={1}
                  checked={currentRow.IsDisability === 1}
                  onChange={() => handleChangeMany(1, "IsDisability")}
                />
                Yes
              </label>

              <label className="radio-label">
                <input
                  type="radio"
                  id="AreYouRegisteredYourFirmWithDlsRadioFlag_false"
                  name="IsDisability"
                  value={0}
                  checked={currentRow.IsDisability === 0}
                  onChange={() => handleChangeMany(0, "IsDisability")}
                />
                No
              </label>
            </div>
          </div>

          <div class="formControl-mobile">
            <label>NID (জাতীয় পরিচয় পত্র/ ভোটার আইডি কার্ড নম্বর)</label>
            <input
              type="text"
              id="NID"
              name="NID"
              //disabled={currentRow.id?true:false}

              placeholder=""
              value={currentRow.NID}
              onChange={(e) => handleChange(e)}
              onBlur={handleBlur}
            />
          </div>

          <div class="formControl-mobile">
            <label>
              Are you the member of a PG under LDDP (আপনি কি LDDP প্রকল্পের
              আওতাধীন কোনো পিজি'র সদস্য) ?
            </label>
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

          <div class="formControl-mobile">
            <label>Number of family members (পরিবারের মোট সদস্য সংখ্যা)</label>
            <input
              type="number"
              id="FamilyMember"
              name="FamilyMember"
              //disabled={currentRow.id?true:false}

              placeholder="0"
              value={currentRow.FamilyMember}
              onChange={(e) => handleChange(e)}
              onBlur={handleBlur}
            />
          </div>

          <div className="formControl-mobile">
            <label>Latitude (অক্ষাংশ) *</label>
            <input
              type="text"
              id="Latitute"
              name="Latitute"
              disabled="true"
              placeholder=""
              class={errorObject.Latitute}
              value={currentRow.Latitute}
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div className="formControl-mobile">
            <label>Longitude (দ্রাঘিমাংশ) *</label>
            <div className="autocompleteContainer">
              <input
                type="text"
                id="Longitute"
                disabled="true"
                name="Longitute"
                placeholder=""
                class={errorObject.Longitute}
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
                    <td className="tg-Nonpg-22sb bgncoa8">Native (দেশি)</td>
                    <td className="tg-Nonpg-22sb bgncoa8">
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
                    <td className="tg-Nonpg-22sb bgncoa8">Cross (শংকর)</td>
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
                    <td className="tg-Nonpg-sl  bgncoa8" colSpan="2">
                      এখন দুধ দিচ্ছে এমন গাভীর সংখ্যা
                    </td>

                    <td className="tg-Nonpg-22sb bgncoa8">
                      <input
                        id="MilkCow"
                        name="MilkCow"
                        type="number"
                        className="numberInput"
                        placeholder="0"
                        value={currentRow.MilkCow}
                        onChange={(e) => handleChange(e)}
                      />
                    </td>
                  </tr>

                  <tr>
                    <td className="tg-Nonpg-sl NonpgEven bgncoa8" rowSpan="2">
                      Bull/Castrated Bull (ষাঁড়/বলদ সংখ্যা)
                    </td>
                    <td className="tg-Nonpg-22sb bgncoa8">Native (দেশি)</td>
                    <td className="tg-Nonpg-22sb bgncoa8">
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
                    <td className="tg-Nonpg-22sb bgncoa8">Cross (শংকর)</td>
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
                    <td className="tg-Nonpg-22sb bgncoa8">Native (দেশি)</td>
                    <td className="tg-Nonpg-22sb bgncoa8">
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
                    <td className="tg-Nonpg-22sb bgncoa8">Cross (শংকর)</td>
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
                    <td className="tg-Nonpg-22sb bgncoa8">Native (দেশি)</td>
                    <td className="tg-Nonpg-22sb bgncoa8">
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
                    <td className="tg-Nonpg-22sb bgncoa8">Cross (শংকর)</td>
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
                      Household/Farm Total (Cows) Milk Production per day
                      (Liter)(দৈনিক দুধের পরিমাণ (লিটার))
                    </td>
                    <td className="tg-Nonpg-22sb bgncoa8">Native (দেশি)</td>
                    <td className="tg-Nonpg-22sb bgncoa8">
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
                    <td className="tg-Nonpg-22sb bgncoa8">Cross (শংকর)</td>
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
                <tbody></tbody>
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
                    <td className="tg-Nonpg-22sb bgncoa2">Male (ষাঁড়)</td>
                    <td className="tg-Nonpg-22sb bgncoa2 maxwidthinp">
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
                    <td className="tg-Nonpg-22sb bgncoa2">Female (স্ত্রী)</td>
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
                    <td className="tg-Nonpg-22sb bgncoa2">Male (এঁড়ে বাছুর)</td>
                    <td className="tg-Nonpg-22sb bgncoa2">
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
                    <td className="tg-Nonpg-22sb bgncoa2">Female (বকনা)</td>
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
                      Household/Farm Total (Buffalo) Milk Production per day
                      (Liter) (দৈনিক দুধের পরিমাণ (লিটার))
                    </td>

                    <td className="tg-Nonpg-22sb bgncoa2 fixed-width-td">
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
                <tbody></tbody>
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
                    <td className="tg-Nonpg-22sb bgncoa1">Male (পাঁঠা/খাসি)</td>
                    <td className="tg-Nonpg-22sb bgncoa1">
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
                    <td className="tg-Nonpg-22sb bgncoa1">Female (ছাগী)</td>
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
                      Calf (ছাগল বাচ্চার সংখ্যা)
                    </td>
                    <td className="tg-Nonpg-22sb bgncoa1">Male (পুং)</td>
                    <td className="tg-Nonpg-22sb bgncoa1">
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
                    <td className="tg-Nonpg-22sb bgncoa1">Female (স্ত্রী)</td>
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
                    <td className="tg-Nonpg-22sb bgncoa1">Male (পাঁঠা/খাসি)</td>
                    <td className="tg-Nonpg-22sb bgncoa1">
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
                    <td className="tg-Nonpg-22sb bgncoa1">Female(ভেড়ি)</td>
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
                      Calf (ভেড়া বাচ্চার সংখ্যা)
                    </td>
                    <td className="tg-Nonpg-22sb bgncoa1">Male (পুং)</td>
                    <td className="tg-Nonpg-22sb bgncoa1">
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
                    <td className="tg-Nonpg-22sb bgncoa1">Female (স্ত্রী)</td>
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
                      Household/Farm Total (Goat) Milk Production per day
                      (Liter) (দৈনিক দুধের পরিমাণ (লিটার))
                    </td>

                    <td className="tg-Nonpg-22sb bgncoa1 fixed-width-td">
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
                <tbody></tbody>
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
                    <td className="tg-Nonpg-sl NonpgOdd bgnco" rowSpan="5">
                      Chicken (মুরগির সংখ্যা)
                    </td>
                    <td className="tg-Nonpg-22sb bgnco">Native (দেশি)</td>
                    <td className="tg-Nonpg-22sb bgnco">
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
                    <td className="tg-Nonpg-22sb bgnco">Layer (লেয়ার)</td>
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
                    <td className="tg-Nonpg-22sb bgnco">Broiler (ব্রয়লার)</td>
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
                    <td className="tg-Nonpg-22sb bgnco">Sonali (সোনালী)</td>
                    <td className="tg-Nonpg-22sb bgnco">
                      <input
                        id="ChickenSonali"
                        name="ChickenSonali"
                        type="number"
                        className="numberInput"
                        placeholder="0"
                        value={currentRow.ChickenSonali}
                        onChange={(e) => handleChange(e)}
                      />
                    </td>
                  </tr>

                  <tr>
                    <td className="tg-Nonpg-22sb bgnco">
                      Other Poultry (Fayoumi/ Cockerel/ Turkey)( ফাউমি / ককরেল/
                      টারকি)
                    </td>
                    <td className="tg-Nonpg-22sb bgnco">
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
                    <td className="tg-Nonpg-sl NonpgEven bgnco" colSpan="2">
                      Household/Farm Total (Chicken) Daily Egg Production (দৈনিক
                      ডিম উৎপাদন)
                    </td>

                    <td className="tg-Nonpg-22sb bgnco fixed-width-td">
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
                <tbody></tbody>
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
                    <td className="tg-Nonpg-s1">
                      Number of Ducks/Swan (হাঁসের/রাজহাঁসের সংখ্যা)
                    </td>
                    <td className="tg-Nonpg-s1">
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
                      Household/Farm Total (Duck) Daily Egg Production (দৈনিক
                      ডিম উৎপাদন)
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
                <tbody></tbody>
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
                    <td className="tg-Nonpg-ab">
                      Number of Pigeon (কবুতরের সংখ্যা)
                    </td>
                    <td className="tg-Nonpg-ab fixed-width-td">
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
                <tbody></tbody>
              </table>
            </div>
          </div>
          {/* End Pigeon   */}

          {/* Start Quail Number Table */}
          <div className="formControl-mobile">
            <label></label>
            <div className="newTableDivNonpg">
              <table className="tg-Nonpg border7">
                <thead>
                  <tr>
                    <td className="tg-Nonpg-st">
                      Number of Quail (কোয়েলের সংখ্যা)
                    </td>
                    <td className="tg-Nonpg-st fixed-width-td">
                      <input
                        id="QuailNumber"
                        name="QuailNumber"
                        type="number"
                        className="numberInput"
                        placeholder="0"
                        value={currentRow.QuailNumber}
                        onChange={(e) => handleChange(e)}
                      />
                    </td>
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
            </div>
          </div>
          {/* End Quail Number    */}

          {/* Start Other Animal Number Table */}
          <div className="formControl-mobile">
            <label></label>
            <div className="newTableDivNonpg">
              <table className="tg-Nonpg border12">
                <thead>
                  <tr>
                    <td className="tg-Nonpg-an">
                      Number of other animals (Pig/Horse) (অন্যান্য প্রাণীর
                      সংখ্যা (শুকর/ঘোড়া))
                    </td>
                    <td className="tg-Nonpg-an fixed-width-td">
                      <input
                        id="OtherAnimalNumber"
                        name="OtherAnimalNumber"
                        type="number"
                        className="numberInput"
                        placeholder="0"
                        value={currentRow.OtherAnimalNumber}
                        onChange={(e) => handleChange(e)}
                      />
                    </td>
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
            </div>
          </div>
          {/* End Other Animal Number    */}

          {/* Start family members Table */}
          {/* <div className="formControl-mobile">
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
                          </div> */}
          {/* End family members    */}

          {/* Start land  Table */}
          <div className="formControl-mobile">
            <label></label>
            <div className="newTableDivNonpg">
              <table className="tg-Nonpg border8">
                <thead>
                  <tr>
                    <td className="tg-Nonpg-99sb">
                      Total cultivable land in decimal (মোট চাষ যোগ্য জমির
                      পরিমাণ (শতাংশ))
                    </td>
                    <td className="tg-Nonpg-99sb">
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
                    <td className="tg-Nonpg-99sb">
                      Own land for Fodder cultivation (নিজস্ব ঘাস চাষের জমি
                      (শতাংশ))
                    </td>
                    <td className="tg-Nonpg-99sb">
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
                    <td className="tg-Nonpg-99sb">
                      Leased land for fodder cultivation (লিজ নেয়া ঘাস চাষের জমি
                      (শতাংশ))
                    </td>
                    <td className="tg-Nonpg-99sb fixed-width-td">
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
                <tbody></tbody>
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
                    <td className="tg-Nonpg-99sbx">Date of Interview *</td>
                    <td className="tg-Nonpg-99sbx">
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
                    <td className="tg-Nonpg-99sbx">Name of Enumerator *</td>
                    <td className="tg-Nonpg-99sbx">
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
                    <td className="tg-Nonpg-99sbx">Enumerator Designation</td>
                    <td className="tg-Nonpg-99sbx">
                      <Autocomplete
                        autoHighlight
                        className="chosen_dropdown"
                        id="DesignationId"
                        name="DesignationId"
                        autoComplete
                        options={DesignationList ? DesignationList : []}
                        getOptionLabel={(option) => option.DesignationName}
                        value={
                          DesignationList
                            ? DesignationList[
                                DesignationList.findIndex(
                                  (list) => list.DesignationId == currentRow.DesignationId
                                )
                              ]
                            : null
                        }
                        onChange={(event, valueobj) =>
                          handleChangeChoosenMaster(
                            "DesignationId",
                            valueobj ? valueobj.DesignationId : ""
                          )
                        }
                        renderOption={(option) => (
                          <Typography className="chosen_dropdown_font">
                            {option.DesignationName}
                          </Typography>
                        )}
                        renderInput={(params) => (
                          <TextField {...params} variant="standard" fullWidth />
                        )}
                      />
                    </td>
                  </tr>

                  <tr>
                    <td className="tg-Nonpg-99sbx">Cell No. of Enumerator *</td>
                    <td className="tg-Nonpg-99sbx">
                      <input
                        id="PhoneNumber"
                        name="PhoneNumber"
                        type="text"
                        class={errorObject.PhoneNumber}
                        value={currentRow.PhoneNumber}
                        onChange={(e) => handleChange(e)}
                      />
                    </td>
                  </tr>

                  <tr>
                    <td className="tg-Nonpg-99sbx">Enumerator Comment</td>
                    <td className="tg-Nonpg-99sbx ">
                      <textarea
                        id="Remarks"
                        name="Remarks"
                        type="text"
                        value={currentRow.Remarks}
                        onChange={(e) => handleChange(e)}
                        rows={3}
                        style={{ width: "100%" }}
                      />
                    </td>
                  </tr>
                </thead>
                <tbody></tbody>
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
                disabled = {isServerLoading}
                onClick={addEditAPICall}
              />
            )}
            {!props.currentRow.id && (
              <Button
                label={"Save"}
                class={"btnSave"}
                disabled = {isServerLoading}
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

export default HouseholdLivestockSurveyDataEntryAddEditModal;
