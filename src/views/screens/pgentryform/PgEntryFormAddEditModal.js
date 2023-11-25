import React, { forwardRef, useRef,useEffect,useState } from "react";
import {Button}  from "../../../components/CustomControl/Button";
import { InfoOutlined } from "@material-ui/icons";
import {apiCall, apiOption, LoginUserInfo, language}  from "../../../actions/api";


const PgEntryFormAddEditModal = (props) => { 

  const serverpage = "pgentryform";// this is .php server page
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
  const [currQuestionMapCategory, setCurrIsQuestionMapCategory] = useState(null);

  const [gender, setGender] = useState(null);
  const [currGender, setCurrGender] = useState(null);
  const [currIsLeadByWomen, setCurrIsLeadByWomen] = useState(0); // or false
  const [currIsActive, setCurrIsActive] = useState(0); // or false




  React.useEffect(() => {
    getDivision(
      props.currentRow.DivisionId,
      props.currentRow.DistrictId,
      props.currentRow.UpazilaId,
      props.currentRow.UnionId
    );

    getQuestionMapCategoryList(
      props.currentRow.ValuechainId
    );

    getGenderList(
      props.currentRow.GenderId
    );

  // Set the initial value of IsLeadByWomen
  if (currentRow.IsLeadByWomen !== undefined && currentRow.IsLeadByWomen !== null) {
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

   
  function getQuestionMapCategoryList(
    selectQuestionMapCategory
  ) {
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
      "BankName",
      "ValuechainId",
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
            <h4>Add/Edit PG</h4>
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

                <label>PG Name *</label>
                <input
                  type="text"
                  id="PGName"
                  name="PGName"
                  class={errorObject.PGName}
                  placeholder="Enter PG Name"
                  value={currentRow.PGName}
                  onChange={(e) => handleChange(e)}
                />



              <label>Group Code *</label>
                <input
                  type="text"
                  id="PgGroupCode"
                  name="PgGroupCode"
                  class={errorObject.PgGroupCode}
                  placeholder="Enter Group Code"
                  value={currentRow.PgGroupCode}
                  onChange={(e) => handleChange(e)}
                />


              <label>PG Bank Account Number *</label>
                <input
                  type="text"
                  id="PgBankAccountNumber"
                  name="PgBankAccountNumber"
                  class={errorObject.PgBankAccountNumber}
                  placeholder="Enter Account Number"
                  value={currentRow.PgBankAccountNumber}
                  onChange={(e) => handleChange(e)}
                />
           

              <label>Bank Name *</label>
                <input
                  type="text"
                  id="BankName"
                  name="BankName"
                  class={errorObject.BankName}
                  placeholder="Enter Bank Name"
                  value={currentRow.BankName}
                  onChange={(e) => handleChange(e)}
                />
           

            


          </div>


          <div class="contactmodalBody pt-10">
              
                <label>Value Chain *</label>
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



                <label>Group Members Gender</label>
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



          <div class="contactmodalBody pt-10">
          
                    <label>Is the Group Led by Women
                      <span className="tooltip-icon" data-tooltip="If there are 3 female members in the group, select 'Yes'.">
                        <InfoOutlined className="info-icon" />
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
                          Yes
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
                          No
                        </label>
                    </div>



                    <label>Status</label>
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
                          Active
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
                          Inactive
                        </label>
                    </div>

          </div>


          <div class="contactmodalBody pt-10">
              <label>Address *</label>
                    <textarea 
                      id="Address"
                      name="Address"
                      class={errorObject.Address}
                      value={currentRow.Address}
                      onChange={(e) => handleChange(e)}
                    >
              </textarea>
          </div>




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
