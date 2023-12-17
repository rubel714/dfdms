import React, { forwardRef, useRef,useEffect,useState } from "react";
import {Button}  from "../../../components/CustomControl/Button";
import {apiCall, apiOption, LoginUserInfo, language}  from "../../../actions/api";


const SurveyTitleEntryAddEditModal = (props) => { 
  // console.log('props modal: ', props);
  const serverpage = "surveytitleentry";// this is .php server page
  const [currentRow, setCurrentRow] = useState(props.currentRow);
  const [errorObject, setErrorObject] = useState({});
  const UserInfo = LoginUserInfo();

  const [questionTypeList, setDataTypeList] = useState(null);
  const [currDataType, setCurrDataType] = useState(null);


  React.useEffect(() => {
    getDataType(
      props.currentRow.DataTypeId
    );


  }, []);

  function getDataType(
    selectDataType
  ) {
    let params = {
      action: "DataTypeList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setDataTypeList(
        [{ id: "", name: "Select Data Type" }].concat(res.data.datalist)
      );

      setCurrDataType(selectDataType);


    });
  }

  
 

  const handleChange = (e) => {
    const { name, value } = e.target;
    let data = { ...currentRow };
    data[name] = value;


    setCurrentRow(data);

    setErrorObject({ ...errorObject, [name]: null });

    //for dependancy
    if (name === "DataTypeId") {
      setCurrDataType(value);

   
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

    // let validateFields = ["SurveyTitle", "DiscountAmount", "DiscountPercentage"]
    let validateFields = [
      "SurveyTitle",
      "DataTypeId",
 
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


  return (
    <>

      {/* <!-- GROUP MODAL START --> */}
      <div id="groupModal" class="modal">
        {/* <!-- Modal content --> */}
        <div class="modal-content">
          <div class="modalHeader">
            <h4>Add/Edit Survey Title</h4>
          </div>

          <div class="contactmodalBody pt-10">

               <label>Data Type *</label>
                <select
                  id="DataTypeId"
                  name="DataTypeId"
                  class={errorObject.DataTypeId}
                  value={currDataType}
                  onChange={(e) => handleChange(e)}
                >
                  {questionTypeList &&
                    questionTypeList.map((item, index) => {
                      return <option value={item.id}>{item.name}</option>;
                    })}
                </select>


                  <label>Survey Title *</label>
                      <input
                        type="text"
                        id="SurveyTitle"
                        name="SurveyTitle"
                        class={errorObject.SurveyTitle}
                        placeholder="Enter Survey Title"
                        value={currentRow.SurveyTitle}
                        onChange={(e) => handleChange(e)}
                      />


                </div>




              <div class="contactmodalBody pt-10 ">
                 
                  <label> Is Mandatory?</label>
                  <input
                    id="CurrentSurvey"
                    name="CurrentSurvey"
                    type="checkbox"
                    disabled={currDataType === 'Label' || currDataType === 'MultiOption' || currDataType === 'MultiRadio' || currentRow.currDataType === 'Label' || currentRow.currDataType === 'MultiOption' || currentRow.currDataType === 'MultiRadio'?true:false}
                    checked={currentRow.CurrentSurvey}
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

export default SurveyTitleEntryAddEditModal;
