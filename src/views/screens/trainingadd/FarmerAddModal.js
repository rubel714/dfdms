import React, { forwardRef, useRef,useEffect,useState } from "react";
import {Button}  from "../../../components/CustomControl/Button";

import CustomTable from "components/CustomTable/CustomTable";
import { apiCall, apiOption , LoginUserInfo, language} from "../../../actions/api";
import ExecuteQueryHook from "../../../components/hooks/ExecuteQueryHook";
import isEqual from 'lodash/isEqual';


const FarmerAddModal = (props) => { 

  const { useState } = React;
  const [bFirstm, setBFirstm] = useState(true);
console.log("currentRow-modal ------ ",props.currentRow);
  // console.log('props modal: ', props);
  const serverpage = "trainingadd";// this is .php server page
  const [currentRow, setCurrentRow] = useState(props.currentRow);
  const [errorObject, setErrorObject] = useState({});

  const {isLoading, data: dataList, error, ExecuteQuery} = ExecuteQueryHook(); //Fetch data
  const UserInfo = LoginUserInfo();
  

  const columnList = [
    { field: "rownumber", label: "SL", align: "center", width: "3%" },
    { field: 'id', label: 'id',width:'10%',align:'center',visible:false,sort:false,filter:false },
    {
      field: "FarmerName",
      label: "Beneficiary Name",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
    },

    {
      field: "NID",
      label: "Beneficiary NID",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "10%",
    },
    {
      field: "Phone",
      label: "Mobile Number",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "10%",
    },
    {
      field: "FatherName",
      label: "Father's Name",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "12%",
    },
    {
      field: "MotherName",
      label: "Mother's Name",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "10%",
    },
    {
      field: "SpouseName",
      label: "Spouse Name",
      align: "left",
      visible: false,
      sort: true,
      filter: true,
      width: "10%",
    },
    {
      field: "GenderName",
      label: "Gender",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "7%",
    },
    {
      field: "FarmersAge",
      label: "Farmer's Age",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "7%",
    },
    {
      field: "ValueChainName",
      label: "Value Chain",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "7%",
    },
    {
      field: "PGName",
      label: "Name of Producer Group",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "12%",
    },
    {
      field: "IsRegularBeneficiary",
      label: "Is Regular Beneficiary?",
      align: "center",
      visible: false,
      sort: true,
      filter: true,
      width: "4%",
    }
  ];



  const handleChange = (e) => {
    const { name, value } = e.target;
    let data = { ...currentRow };
    data[name] = value;
    setCurrentRow(data);
    // console.log('aaa data: ', data);

    setErrorObject({ ...errorObject, [name]: null });

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

    // let validateFields = ["MapType", "DiscountAmount", "DiscountPercentage"]
    let validateFields = ["MapType"]
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


  function addAPICall(){
      let params = {
        action: "farmerAdd",
        lan: language(),
        UserId: UserInfo.UserId,
        DivisionId: props.currentRow.DivisionId,
        DistrictId: props.currentRow.DistrictId,
        UpazilaId: props.currentRow.UpazilaId,
        PGId: props.currentRow.PGId,
        TrainingId: props.currentRow.id,
        rowData: selectedRows,
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

  function modalClose(){
    console.log('props modal: ', props);
    props.modalCallback("close");
  }


  if (bFirstm) {
    /**First time call for datalist */
    getFarmerDataListModal();
    setBFirstm(false);
  }


  /**Get data for table list */
  function getFarmerDataListModal(){

   
    let params = {
      action: "getFarmerDataList",
      lan: language(),
      UserId: UserInfo.UserId,
      DivisionId: props.currentRow.DivisionId,
      DistrictId: props.currentRow.DistrictId,
      UpazilaId: props.currentRow.UpazilaId,
      PGId: props.currentRow.PGId,
    };
    // console.log('LoginUserInfo params: ', params);

    ExecuteQuery(serverpage, params);
  }


  const [selectedRows, setSelectedRows] = useState([]);
  const [unselectedRows, setUnselectedRows] = useState([]);


  const selectable = true;



  // Define the isSelected function
  const isSelected = (row) =>
    selectedRows.some((selectedRow) => isEqual(selectedRow, row));

  const handleRowClick = (row) => {
    // Check if row selection is allowed (based on the selectable prop)
    if (selectable) {
      if (isSelected(row)) {
        // Deselect the row if it's already selected
        setSelectedRows((prevSelectedRows) =>
          prevSelectedRows.filter((selectedRow) => !isEqual(selectedRow, row))
        );
        setUnselectedRows((prevUnselectedRows) => [...prevUnselectedRows, row]);
      } else {
        // Select the row if it's not selected
        setUnselectedRows((prevUnselectedRows) =>
          prevUnselectedRows.filter((unselectedRow) => !isEqual(unselectedRow, row))
        );
        setSelectedRows((prevSelectedRows) => [...prevSelectedRows, row]);
      }
    }
  };


  return (
    <>

      {/* <!-- GROUP MODAL START --> */}
      <div id="groupModal" class="modal">
        {/* <!-- Modal content --> */}
        <div class="modal-content">
          <div class="modalHeader">
            <h4>Select Question</h4>
          </div>


          <CustomTable
                selectable={selectable}
                columns={columnList}
                rows={dataList ? dataList : {}}
                // actioncontrol={actioncontrol}
                handleRowClick={handleRowClick}
                selectedRows={selectedRows}
                isLoading={isLoading}
                ispagination={false}
                
              />


          <div class="modalItem">
          
             
           
          </div>

          

          <div class="modalItem">
            <Button label={"Close"} class={"btnClose"} onClick={modalClose} />
             {/*  {!props.currentRow.id && (<Button label={"Save"} class={"btnSave"} onClick={addAPICall} />)} */}
            <Button label={"Save"} class={"btnSave"} onClick={addAPICall} />
            
          </div>
        </div>
      </div>
      {/* <!-- GROUP MODAL END --> */}



    </>
  );
};

export default FarmerAddModal;
