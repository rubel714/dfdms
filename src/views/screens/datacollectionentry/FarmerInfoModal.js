import React, { forwardRef, useRef,useEffect,useState } from "react";
import {Button}  from "../../../components/CustomControl/Button";
import {apiCall, apiOption, LoginUserInfo, language}  from "../../../actions/api";


const FarmerInfoModal = (props) => { 
  console.log('props modal: ', props);
  const serverpage = "datacollection";// this is .php server page
  const [currentRow, setCurrentRow] = useState(props.currentInvoice);
  const [farmerInfo, setFarmerInfo] = useState([]);
  // const [errorObject, setErrorObject] = useState({});
  const UserInfo = LoginUserInfo();

useEffect(()=>{
  getData();

},[currentRow]);


  function getData(){
    console.log('currentRow: ', currentRow);

    if (currentRow.FarmerId) {

      let params = {
        action: "getFarmerInfo",
        lan: language(),
        UserId: UserInfo.UserId,
        rowData: currentRow,
      };

      apiCall.post(serverpage, { params }, apiOption()).then((res) => {
        console.log('res: ', res.data.datalist[0]);
       
        setFarmerInfo(res.data.datalist[0]);


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
            <h4>Farmar Information</h4>
          </div>

          <div class="modalItem">
            
            
            {/* <label>Farmer</label>
            <label>{farmerInfo.FarmerName}</label> */}

          <table>
            <tbody>
              <tr>
                <td>Farmer:</td>
                <td>{farmerInfo.FarmerName}</td>
                <td>NID:</td>
                <td>{farmerInfo.NID}</td>
              </tr>
            </tbody>
          </table>
         
         
         
          </div>

          

          <div class="modalItem">

            <Button label={"Close"} class={"btnClose"} onClick={modalClose} />
            
          </div>
        </div>
      </div>
      {/* <!-- GROUP MODAL END --> */}



    </>
  );
};

export default FarmerInfoModal;
