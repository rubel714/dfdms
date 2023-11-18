import React, { forwardRef, useRef,useEffect,useState } from "react";
import {Button}  from "../../../components/CustomControl/Button";
import {apiCall, apiOption, LoginUserInfo, language}  from "../../../actions/api";


const LabelEditModal = (props) => { 
  // console.log('props modal: ', props);
  const serverpage = "datatypequestionsmap";// this is .php server page
  const [currentRow, setCurrentRow] = useState(props.currentRow);
  const [errorObject, setErrorObject] = useState({});
  const UserInfo = LoginUserInfo();

  const [questionMapCategory, setQuestionMapCategory] = useState(null);
  const [currQuestionMapCategory, setCurrIsQuestionMapCategory] = useState(null);

  React.useEffect(() => {
    getQuestionMapCategoryList(
      props.currentRow.Category
    );

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
        [{ id: "", name: "Select Category" }].concat(res.data.datalist)
      );

      setCurrIsQuestionMapCategory(selectQuestionMapCategory);

    });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    let data = { ...currentRow };
    data[name] = value;
    setCurrentRow(data);
    // console.log('aaa data: ', data);

    setErrorObject({ ...errorObject, [name]: null });

    if (name === "Category") {
      setCurrIsQuestionMapCategory(value);

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

    // let validateFields = ["DataTypeName", "DiscountAmount", "DiscountPercentage"]

   /*  {currentRow.MapType === "Label" && (
          <Edit
            className={"table-edit-icon"}
            onClick={() => {
              editData(rowData);
            }}
          />
        )}  */

        let validateFields = [];
        if (currentRow.MapType === "Label"){
          validateFields = ["LabelName", "Category"];
        }else{
          validateFields = ["Category"];
        }

  
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
            <h4>Add/Edit Categroy and Label</h4>
          </div>

          <div class="modalItem">
             
          </div>


          <div class="contactmodalBody pt-10">
          <label>Category</label>
                <select
                  id="Category"
                  name="Category"
                  class={errorObject.Category}
                  value={currQuestionMapCategory}
                  onChange={(e) => handleChange(e)}
                >
                  {questionMapCategory &&
                    questionMapCategory.map((item, index) => {
                      return <option value={item.id}>{item.name}</option>;
                    })}
                </select>


              <label>Label</label>
              <input
                type="text"
                id="LabelName"
                name="LabelName"
                disabled={currentRow.MapType === "Label" ? false : true}
                class={errorObject.LabelName}
                placeholder="Enter Label Name"
                value={currentRow.LabelName}
                onChange={(e) => handleChange(e)}
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

export default LabelEditModal;
