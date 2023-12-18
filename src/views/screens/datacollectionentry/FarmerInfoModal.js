import React, { forwardRef, useRef, useEffect, useState } from "react";
import { Button } from "../../../components/CustomControl/Button";
import {
  apiCall,
  apiOption,
  LoginUserInfo,
  language,
} from "../../../actions/api";

const FarmerInfoModal = (props) => {
  console.log("props modal: ", props);
  const serverpage = "datacollection"; // this is .php server page
  const [currentRow, setCurrentRow] = useState(props.currentInvoice);
  const [farmerInfo, setFarmerInfo] = useState([]);
  // const [errorObject, setErrorObject] = useState({});
  const UserInfo = LoginUserInfo();

  useEffect(() => {
    getData();
  }, [currentRow]);

  function getData() {
    console.log("currentRow: ", currentRow);

    if (currentRow.FarmerId) {
      let params = {
        action: "getFarmerInfo",
        lan: language(),
        UserId: UserInfo.UserId,
        rowData: currentRow,
      };

      apiCall.post(serverpage, { params }, apiOption()).then((res) => {
        console.log("res: ", res.data.datalist[0]);

        setFarmerInfo(res.data.datalist[0]);
      });
    }
  }

  function modalClose() {
    console.log("props modal: ", props);
    props.modalCallback("close");
  }

  return (
    <>
      {/* <!-- GROUP MODAL START --> */}
      <div id="groupModal" class="modal">
        {/* <!-- Modal content --> */}
        <div class="modal-content">
          <div class="modalHeader">
            <h4>Farmer Information</h4>
          </div>

          <div class="pgmodalBody pt-10">
            <label>Is Regular Beneficiary:</label>
            <span>{farmerInfo.RegularStatus}</span>

            <label>Beneficiary NID:</label>
            <span>{farmerInfo.NID}</span>

            <label>Beneficiary Name:</label>
            <span>{farmerInfo.FarmerName}</span>

            <label>Mobile Number:</label>
            <span>{farmerInfo.Phone}</span>

            <label>Father's Name:</label>
            <span>{farmerInfo.FatherName}</span>

            <label>Mother's Name:</label>
            <span>{farmerInfo.MotherName}</span>

            <label>Spouse Name:</label>
            <span>{farmerInfo.SpouseName}</span>

            <label>Gender:</label>
            <span>{farmerInfo.GenderName}</span>

            <label>Farmer's Age:</label>
            <span>{farmerInfo.FarmersAge}</span>

            <label>Disability Status:</label>
            <span>{farmerInfo.isDisabilityStatus}</span>

            <label>Farmers Relationship with Head of HH:</label>
            <span>{farmerInfo.RelationWithHeadOfHH}</span>

            <label>Farmer's Head of HH Sex:</label>
            <span>{farmerInfo.HeadOfHHSex}</span>

            <label>Do your PG/PO Registered?:</label>
            <span>{farmerInfo.PGRegistered}</span>

            <label>Type Of Member:</label>
            <span>{farmerInfo.TypeOfMember}</span>

            <label>
              Do your PG make any productive partnership with any other
              company?:
            </label>
            <span>{farmerInfo.PGPartnershipWithOtherCompany}</span>

            <label>PG Farmer Code:</label>
            <span>{farmerInfo.PGFarmerCode}</span>

            <label>Primary Occupation:</label>
            <span>{farmerInfo.FamilyOccupation}</span>

            <label>Division:</label>
            <span>{farmerInfo.DivisionName}</span>

            <label>District:</label>
            <span>{farmerInfo.DistrictName}</span>

            <label>Upazila:</label>
            <span>{farmerInfo.UpazilaName}</span>

            <label>Union:</label>
            <span>{farmerInfo.UnionName}</span>

            <label>Name of Producer Group:</label>
            <span>{farmerInfo.PGName}</span>

            <label>Ward:</label>
            <span>{farmerInfo.WardName}</span>

            <label>City Corporation/ Municipality:</label>
            <span>{farmerInfo.CityCorporationName}</span>

            <label>Village:</label>
            <span>{farmerInfo.VillageName}</span>

            <label>Address:</label>
            <span>{farmerInfo.Address}</span>

            <label>Latitute:</label>
            <span>{farmerInfo.Latitute}</span>

            <label>Longitute:</label>
            <span>{farmerInfo.Longitute}</span>

            <label>Are You Head of The Group?:</label>
            <span>{farmerInfo.HeadOfTheGroup}</span>
          </div>

          {/* <div class="modalItem">
            
            

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
         
         
         
          </div> */}

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
