import React, { forwardRef, useRef,useEffect,useState } from "react";
import {Button}  from "../../../components/CustomControl/Button";
import { InfoOutlined } from "@material-ui/icons";
import {apiCall, apiOption, LoginUserInfo, language}  from "../../../actions/api";


const UnionEntryAddEditModal = (props) => { 

  const serverpage = "upazilaentry";// this is .php server page
  const [currentRow, setCurrentRow] = useState(props.currentRow);
  const [errorObject, setErrorObject] = useState({});
  const UserInfo = LoginUserInfo();

  const [divisionList, setDivisionList] = useState(null);
  const [districtList, setDistrictList] = useState(null);
  const [upazilaList, setUpazilaList] = useState(null);

  const [currDivisionId, setCurrDivisionId] = useState(null);
  const [currDistrictId, setCurrDistrictId] = useState(null);

 

  React.useEffect(() => {
    getDivision(
      props.currentRow.DivisionId,
      props.currentRow.DistrictId
    );


  }, []);

   
  function getDivision(
    selectDivisionId,
    SelectDistrictId
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
        SelectDistrictId
      );



    });
  }


  
  function getDistrict(
    selectDivisionId,
    SelectDistrictId
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
      getDistrict(value, "", "");
   
    } else if (name === "DistrictId") {
      setCurrDistrictId(value);
  
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

    // let validateFields = ["UpazilaName", "DiscountAmount", "DiscountPercentage"]
    let validateFields = [
      "UpazilaName",
      "DivisionId",
      "DistrictId",
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
            <h4>Add/Edit Upazila</h4>
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
              

                <label>Upazila Name *</label>
                <input
                  type="text"
                  id="UpazilaName"
                  name="UpazilaName"
                  class={errorObject.UpazilaName}
                  placeholder="Enter PG Name"
                  value={currentRow.UpazilaName}
                  onChange={(e) => handleChange(e)}
                />

               <label> Is City Corporation?</label>
                <input
                  id="IsCityCorporation"
                  name="IsCityCorporation"
                  type="checkbox"
                  checked={currentRow.IsCityCorporation}
                  onChange={handleChangeCheck}
                />

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

export default UnionEntryAddEditModal;
