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

            
            {/* <label>PG Name</label>
            <label>{pgInfo.PGName}</label> */}

        <div class="pgmodalBody pt-10">

            <label>Division:</label>
            <span>{pgInfo.DivisionName}</span>
            
            <label>District:</label>
            <span>{pgInfo.DistrictName}</span>

            <label>Upazila:</label>
            <span>{pgInfo.UpazilaName}</span>

            <label>Union:</label>
            <span>{pgInfo.UnionName}</span>
            
            <label>PG Name:</label>
             <span> {pgInfo.PGName}</span>

            <label>Group Code:</label>
             <span> {pgInfo.PgGroupCode}</span>


            <label>PG Bank Account Number:</label>
             <span> {pgInfo.PgBankAccountNumber}</span>


            <label>Bank Name:</label>
             <span> {pgInfo.BankName}</span>

            <label>Value Chain:</label>
            <span> {pgInfo.ValueChainName}</span>

            <label>Group Members Gender:</label>
            <span> {pgInfo.GenderName}</span>

            <label>Is the Group Led by Women:</label>
            <span> {pgInfo.IsLeadByWomenStatus}</span>

            <label>Status:</label>
            <span> {pgInfo.ActiveStatus}</span>


            <label>Address:</label>
            <span>{pgInfo.Address}</span>
            

            
        </div>
        



         {/*  <table>
            <tbody>
              <tr>
                <td>PG Name:</td>
                <td>{pgInfo.PGName}</td>
                <td>Address:</td>
                <td>{pgInfo.Address}</td>
              </tr>
            </tbody>
          </table> */}
         
         
         

          

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
