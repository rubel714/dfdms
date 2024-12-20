import React, { forwardRef, useRef,useEffect,useState } from "react";
import {Button}  from "../../../components/CustomControl/Button";
import {apiCall, apiOption, LoginUserInfo, language}  from "../../../actions/api";


const PgEntryFormAddEditModal = (props) => { 
  // console.log('props modal: ', props);
  const serverpage = "questionsentry";// this is .php server page
  const [currentRow, setCurrentRow] = useState(props.currentRow);
  const [errorObject, setErrorObject] = useState({});
  const UserInfo = LoginUserInfo();

  const [questionTypeList, setQuestionTypeList] = useState(null);
  const [currQuestionType, setCurrQuestionType] = useState(null);

  const [parentQuestionList, setParentQuestionList] = useState(null);
  const [currParentQuestion, setCurrParentQuestion] = useState(null);

  React.useEffect(() => {
    getQuestionType(
      props.currentRow.QuestionType
    );
    getParentQuestion(!props.currentRow.id?"":props.currentRow.QuestionParentId);

    //getStrengthList();
    //getManufacturerList();
  }, []);

  function getQuestionType(
    selectQuestionType
  ) {
    let params = {
      action: "QuestionTypeList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setQuestionTypeList(
        [{ id: "", name: "Select Question Type" }].concat(res.data.datalist)
      );

      setCurrQuestionType(selectQuestionType);




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


      //getParentQuestion(!props.currentRow.id?"":props.currentRow.QuestionId);

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
    if (name === "QuestionType") {
      data["RangeStart"] = "";
      data["RangeEnd"] = "";

      setCurrQuestionType(value);
      
      if((value === 'Label') || (value === 'MultiOption') || (value === 'MultiRadio') ){
        data['IsMandatory'] = false; 

      }
      


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

    // let validateFields = ["QuestionName", "DiscountAmount", "DiscountPercentage"]
    let validateFields = [
      "QuestionCode",
      "QuestionName",
      "QuestionType",
 
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
            <h4>Add/Edit Question</h4>
          </div>





          <div class="contactmodalBody pt-10">

               <label>Code *</label>
                <input
                  type="text"
                  id="QuestionCode"
                  name="QuestionCode"
                  disabled={currentRow.id?true:false}
                  class={errorObject.QuestionCode}
                  placeholder="Enter Code"
                  value={currentRow.QuestionCode}
                  onChange={(e) => handleChange(e)}
                />


               <label>Question Type *</label>
                <select
                  id="QuestionType"
                  name="QuestionType"
                  class={errorObject.QuestionType}
                  value={currQuestionType}
                  onChange={(e) => handleChange(e)}
                >
                  {questionTypeList &&
                    questionTypeList.map((item, index) => {
                      return <option value={item.id}>{item.name}</option>;
                    })}
                </select>

                </div>


          <div class="contactmodalBodyLearge pt-10">
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
          </div>


          <div class="contactmodalBodyLearge pt-10">
              <label>Question *</label>
                    <textarea 
                      id="QuestionName"
                      name="QuestionName"
                      class={errorObject.QuestionName}
                      value={currentRow.QuestionName}
                      onChange={(e) => handleChange(e)}
                    >
              </textarea>
          </div>
              {/* 
                <div class="contactmodalBody ">
                              
                            <label>Question *</label>
                              <input
                                type="text"
                                id="QuestionName"
                                name="QuestionName"
                                class={errorObject.QuestionName}
                                placeholder="Enter Question"
                                value={currentRow.QuestionName}
                                onChange={(e) => handleChange(e)}
                              />

              </div> */}


              <div class="contactmodalBody pt-10 ">
                    <label>Settings </label>
                    <input
                      type="text"
                      id="Settings"
                      name="Settings"
                      placeholder="Enter Settings"
                      value={currentRow.Settings}
                      onChange={(e) => handleChange(e)}
                    />



                  <label> Is Mandatory?</label>
                  <input
                    id="IsMandatory"
                    name="IsMandatory"
                    type="checkbox"
                    disabled={currQuestionType === 'Label' || currQuestionType === 'MultiOption' || currQuestionType === 'MultiRadio' || currentRow.currQuestionType === 'Label' || currentRow.currQuestionType === 'MultiOption' || currentRow.currQuestionType === 'MultiRadio'?true:false}
                    checked={currentRow.IsMandatory}
                    onChange={handleChangeCheck}
                  />

          </div>


          {/* Conditionally render the div */}
            {currentRow.QuestionType === "Number" && (
              <div className="contactmodalBody pt-10 valueRangeStartEnd">
                <label>Value Range Start</label>
                <input
                  type="number"
                  id="RangeStart"
                  name="RangeStart"
                  placeholder="Enter Value Range Start"
                  //value={currentRow.RangeStart || ""}
                  value={currentRow.RangeStart !== null && currentRow.RangeStart !== undefined ? currentRow.RangeStart : ""}
                  onChange={(e) => handleChange(e)}
                />

                <label>Value Range End</label>
                <input
                  type="number"
                  id="RangeEnd"
                  name="RangeEnd"
                  placeholder="Enter Value Range End"
                  value={currentRow.RangeEnd || ""}
                  onChange={(e) => handleChange(e)}
                />
              </div>
            )}

            {/*  <div class="contactmodalBody modalItem">
                <label> Is Mandatory?</label>
                  <input
                    id="IsMandatory"
                    name="IsMandatory"
                    type="checkbox"
                    checked={currentRow.IsMandatory}
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
