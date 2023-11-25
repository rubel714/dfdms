import React, { forwardRef, useRef,useEffect,useState } from "react";
import {Button}  from "../../../components/CustomControl/Button";
import {apiCall, apiOption, LoginUserInfo, language}  from "../../../actions/api";


const PGInfoModal = (props) => { 
  console.log('props modal: ', props);
  const serverpage = "datacollection";// this is .php server page
  const [currentRow, setCurrentRow] = useState(props.currentInvoice);
  const [pgInfo, setPGInfo] = useState([]);
  // const [errorObject, setErrorObject] = useState({});
  const UserInfo = LoginUserInfo();

useEffect(()=>{
  getData();

},[currentRow]);


  function getData(){
    console.log('currentRow: ', currentRow);

    if (currentRow.PGId) {

      let params = {
        action: "getPGInfo",
        lan: language(),
        UserId: UserInfo.UserId,
        rowData: currentRow,
      };

      apiCall.post(serverpage, { params }, apiOption()).then((res) => {
        console.log('res: ', res.data.datalist[0]);
       
        setPGInfo(res.data.datalist[0]);


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
            <h4>PG Information</h4>
          </div>

          <div class="modalItem">
            
            
            {/* <label>PG Name</label>
            <label>{pgInfo.PGName}</label> */}

          <table>
            <tbody>
              <tr>
                <td>PG Name:</td>
                <td>{pgInfo.PGName}</td>
                <td>Address:</td>
                <td>{pgInfo.Address}</td>
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

export default PGInfoModal;
