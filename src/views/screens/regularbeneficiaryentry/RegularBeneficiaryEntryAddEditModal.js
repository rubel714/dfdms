import React, { forwardRef, useRef,useEffect,useState } from "react";
import {Button}  from "../../../components/CustomControl/Button";
import {apiCall, apiOption, LoginUserInfo, language}  from "../../../actions/api";


const PgEntryFormAddEditModal = (props) => { 
  // console.log('props modal: ', props);
  const serverpage = "regularbeneficiaryentry";// this is .php server page
  const [currentRow, setCurrentRow] = useState(props.currentRow);
  const [errorObject, setErrorObject] = useState({});
  const UserInfo = LoginUserInfo();

  const [isRegularBeneficiaryList, setIsRegularBeneficiaryList] = useState(null);
  const [currisRegularBeneficiary, setCurrIsRegularBeneficiary] = useState(null);

  const [parentQuestionList, setParentQuestionList] = useState(null);
  const [currParentQuestion, setCurrParentQuestion] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);


  const [gender, setGender] = useState(null);
  const [currGender, setCurrGender] = useState(null);

  const [disabilityStatus, setDisabilityStatus] = useState(null);
  const [currDisabilityStatus, setCurrDisabilityStatus] = useState(null);
  const [currRelationWithHeadOfHH, setCurrRelationWithHeadOfHH] = useState(0); // or false

  React.useEffect(() => {
    getIsRegularBeneficiaryList(
      props.currentRow.IsRegular
    );
    getParentQuestion(!props.currentRow.id?"":props.currentRow.QuestionParentId);

    getGenderList(
      props.currentRow.GenderId
    );
    getDisabilityStatusList(
      props.currentRow.DisabilityStatus
    );

      // Set the initial value of RelationWithHeadOfHH
  if (currentRow.RelationWithHeadOfHH !== undefined && currentRow.RelationWithHeadOfHH !== null) {
    setCurrRelationWithHeadOfHH(currentRow.RelationWithHeadOfHH);
  } else {
    setCurrRelationWithHeadOfHH(0);
  }

    //getStrengthList();
    //getManufacturerList();
  }, []);


  function getGenderList(
    selectGender
  ) {
    let params = {
      action: "GenderList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setGender(
        [{ id: "", name: "Select Gender" }].concat(res.data.datalist)
      );

      setCurrGender(selectGender);

    });
  }

  function getDisabilityStatusList(
    selectDisabilityStatus
  ) {
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



  function getIsRegularBeneficiaryList(
    selectIsRegularBeneficiary
  ) {
    let params = {
      action: "IsRegularBeneficiaryList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setIsRegularBeneficiaryList(
        [{ id: "", name: "Select Is Regular Beneficiary" }].concat(res.data.datalist)
      );

      setCurrIsRegularBeneficiary(selectIsRegularBeneficiary);

    });
  }

  function getParentQuestion(
    selectParentQuestion
  ) {
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
    if (name === "IsRegular") {
      setCurrIsRegularBeneficiary(value);

    } 
    if (name === "QuestionParentId") {
      setCurrParentQuestion(value);

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
    let validateFields = [
      "NID",
      "FarmerName",
 
    ]
    let errorData = {}
    let isValid = true
    validateFields.map((field) => {
      if (!currentRow[field]) {
        errorData[field] = "validation-style";
        isValid = false
      }
    })


    setErrorObject(errorData);
    return isValid
  }


  function addEditAPICall(){

    

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
        if(res.data.success === 1){
          props.modalCallback("addedit");
        }


      });

    }

    
  }

  function modalClose(){
    console.log('props modal: ', props);
    props.modalCallback("close");
  }
























  const [previewImage, setPreviewImage] = useState(null);



  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    uploadImage(file);
  };


  const uploadImage = (file) => {
    if (!file) {
      console.error("No file selected");
      return;
    }
  
    const formData = new FormData();
    const timestamp = new Date().getTime(); // Generate timestamp
  
    formData.append("file", file);
    formData.append("filename", `./media/${timestamp}_${file.name}`);
  
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
  };


  const handleChangeMany = (newValue, propertyName) => {
    // Use a copy of the current row
    let data = { ...currentRow };
  
    // Update the specified property with the new value
    data[propertyName] = newValue;
  
    // Update the state with the modified data
    setCurrentRow(data);
  
    // Handle other logic as needed
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


        <label>NID Back Photo</label>
        <input
          type="file"
          id="NidBackPhoto"
          name="NidBackPhoto"
          accept="image/*"
          onChange={handleFileChange}
        />

      </div>
   


   
    
   
   
    




          {/* <div class="contactmodalBody pt-10">

               <label>NID Front Photo</label>
                    <input
                      type="text"
                      id="NidFrontPhoto"
                      name="NidFrontPhoto"
                      //disabled={currentRow.id?true:false}
                      class={errorObject.NidFrontPhoto}
                      placeholder="Choose File"
                      value={currentRow.NidFrontPhoto}
                      onChange={(e) => handleChange(e)}
                    /> 


                  <label>Parent Question</label>
                  <select
                      id="QuestionParentId"
                      name="QuestionParentId"
                      class={errorObject.QuestionParentId}
                      value={currParentQuestion}
                      onChange={(e) => handleChange(e)}
                    >
                      {parentQuestionList &&
                        parentQuestionList.map((item, index) => {
                          return <option value={item.id}>{item.name}</option>;
                        })}
                    </select>
          </div> */}


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

                 <label>Beneficiary Photo</label>
                  <input
                    type="file"
                    id="BeneficiaryPhoto"
                    name="BeneficiaryPhoto"
                    accept="image/*"
                    onChange={handleFileChange}
                  /> 

                   {/*  <textarea 
                      id="FarmerName"
                      name="FarmerName"
                      class={errorObject.FarmerName}
                      value={currentRow.FarmerName}
                      onChange={(e) => handleChange(e)}
                    >
              </textarea> */}
          </div>
              {/* 
                <div class="contactmodalBody ">
                              
                            <label>Question *</label>
                              <input
                                type="text"
                                id="FarmerName"
                                name="FarmerName"
                                class={errorObject.FarmerName}
                                placeholder="Enter Question"
                                value={currentRow.FarmerName}
                                onChange={(e) => handleChange(e)}
                              />

              </div> */}


              <div class="contactmodalBody pt-10 ">
                    <label>Mobile Number </label>
                    <input
                      type="text"
                      id="Phone"
                      name="Phone"
                      placeholder="Enter Mobile Number"
                      value={currentRow.Phone}
                      onChange={(e) => handleChange(e)}
                    />

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
            {props.currentRow.id && (<Button label={"Update"} class={"btnUpdate"} onClick={addEditAPICall} />)}
            {!props.currentRow.id && (<Button label={"Save"} class={"btnSave"} onClick={addEditAPICall} />)}
            
          </div>
        </div>
      </div>
      {/* <!-- GROUP MODAL END --> */}



    </>
  );
};

export default PgEntryFormAddEditModal;
