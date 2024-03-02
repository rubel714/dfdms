import React, { forwardRef, useRef, useEffect } from "react";
import swal from "sweetalert";
import { DeleteOutline, Edit, Launch } from "@material-ui/icons";
import { Button } from "../../components/CustomControl/Button";
import AfterLoginNavbar from "components/Navbars/AfterLoginNavbar";
import CustomTable from "components/CustomTable/CustomTable";
import { apiCall, apiOption, LoginUserInfo, language } from "../../actions/api";
import DarkFooter from "components/Footers/DarkFooter.js";
import ExecuteQueryHook from "../../components/hooks/ExecuteQueryHook";
import {
  Card,
  CardHeader,
  CardContent,
  Grid,
  FormControl,
  Select,
  MenuItem,
} from "@material-ui/core";

// Highcharts component
import Highcharts from "highcharts/highstock";
import exporting from "highcharts/modules/exporting.js";
import HighchartsReact from "highcharts-react-official";

/* import PgEntryFormAddEditModal from "./PgEntryFormAddEditModal";
 */

const HouseholdDashboard = (props) => {
  const serverpage = "householddashboard"; // this is .php server page

  const { useState } = React;
  const [bFirst, setBFirst] = useState(true);
  const [currentRow, setCurrentRow] = useState([]);
  const [showModal, setShowModal] = useState(false); //true=show modal, false=hide modal

  const { isLoading, data: dataList, error, ExecuteQuery } = ExecuteQueryHook(); //Fetch data

  const UserInfo = LoginUserInfo();

  const [currentFilter, setCurrentFilter] = useState([]);
  const [divisionList, setDivisionList] = useState(null);
  const [districtList, setDistrictList] = useState(null);
  const [upazilaList, setUpazilaList] = useState(null);

  const [currDivisionId, setCurrDivisionId] = useState(UserInfo.DivisionId);
  const [currDistrictId, setCurrDistrictId] = useState(UserInfo.DistrictId);
  const [currUpazilaId, setCurrUpazilaId] = useState(UserInfo.UpazilaId);


  if (bFirst) {
    /**First time call for datalist */
   
    getDataList();


    /* getDivision(UserInfo.DivisionId, UserInfo.DistrictId, UserInfo.UpazilaId);
     */
    //getDataList();
    setBFirst(false);
  }

  /**Get data for table list */
  function getDataList() {
    let params = {
      action: "getDataList",
      lan: language(),
      UserId: UserInfo.UserId,
      DivisionId: currDivisionId,
      DistrictId: currDistrictId,
      UpazilaId: currUpazilaId,
    };
    // console.log('LoginUserInfo params: ', params);

    ExecuteQuery(serverpage, params);
  }

  
  const goToTotalPGMember = () => {
    window.open(process.env.REACT_APP_BASE_NAME + `/pgandpgmembersinformation`);
  };

  const goToGenderWisePGMember = () => {
    window.open(process.env.REACT_APP_BASE_NAME + `/genderwisepgmembers`);
  };

  const goToValuechainwisepgdistribution = () => {
    window.open(
      process.env.REACT_APP_BASE_NAME + `/valuechainwisepgdistribution`
    );
  };
  const goToValuechainwisepgmemberdistribution = () => {
    window.open(
      process.env.REACT_APP_BASE_NAME + `/valuechainwisepgmemberdistribution`
    );
  };


  return (
    <>
      <AfterLoginNavbar {...props} />

      <div class="bodyContainer">
        {/* <!-- ######-----TOP HEADER-----####### --> */}
        <div class="topHeader">
          <h4>Home ❯ Household Dashboard</h4>
        </div>

        {/* <!-- TABLE SEARCH AND GROUP ADD --> */}
        <label></label>

        <Card className="sw_card ">
          <CardContent>
            <div className="stat-cell stat-cell-color-e">
              <div className="row margin0auto">
                <div className=" ">
                  <span className="text-xlg ">
                    Digital Field Data Monitoring System (DFDMS)
                  </span>
                </div>
              </div>

              <div className="row margin0auto">
                <div className="mt-10">
                  <span>Date: {dataList.CurrentDate?dataList.CurrentDate:''}</span>
                </div>

                <div className="">
                  {/* <span className="text-xlm pull-right">
                        &nbsp;  {CurrentFacilityName}
                      </span>

                      <span className="marginTop5 pull-right">
                        {UseFor == 'WIMS' ? '' : t(DispensingLanguage[lan][menukey]["Upazila Family Planning Store"])}
                      </span> */}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>


 {/* PG Data */}
 <div className="row onedashboardCard">
  
 <div className="">
           
         </div>

         <div className="">
           <Card className="sw_card">
             <CardContent>
               <div className="row">
                 <div className="">
                   <div className="stat-cell stat-cell-color-aa ">
                     <i className="fa fa-cubes bg-icon"></i>
                     <span className="text-xlg" id="total-patients">
                       {dataList.TotalHouseHold}
                     </span>

                     <br></br>
                     <span id="totalcase" className="text-bg mt-10">
                       Total Household Livestock Survey 2024
                     </span>
                   </div>
                 </div>
               </div>
             </CardContent>
           </Card>
         </div>

        
       </div>
       {/* PG Data */}


        {/* PG Data */}
        <div className="row dashboardCard">
         
          <div className="">
            <Card className="sw_card">
              <CardContent>
                <div className="row">
                  <div className="">
                    <div className="stat-cell stat-cell-color-a ">
                      <i className="fa fa-cubes bg-icon"></i>
                      <span className="text-xlg" id="total-patients">
                        {dataList.TotalFamilyMember}
                      </span>

                      <br></br>
                      <span id="totalcase" className="text-bg mt-10">
                        Total Number of family members
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="margin-left10">
            <Card className="sw_card">
              <CardContent>
                <div className="row">
                  <div className="">
                    <div className="stat-cell stat-cell-color-b ">
                      <i className="fa fa-users bg-icon"></i>

                      <span className="text-xlg" id="total-patients">
                        {dataList.TotalCowNative}
                      </span>

                      <br></br>
                      <span id="totalcase" className="text-bg mt-10">
                        Total Cow (Native)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* PG Data */}




         {/* PG Data */}
         <div className="row dashboardCard">
          <div className="">
            <Card className="sw_card">
              <CardContent>
                <div className="row">
                  <div className="">
                    <div className="stat-cell stat-cell-color-a ">
                      <i className="fa fa-cubes bg-icon"></i>
                      <span className="text-xlg" id="total-patients">
                        {dataList.CowCross}
                      </span>

                      <br></br>
                      <span id="totalcase" className="text-bg mt-10">
                        Total Cow (Cross)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="margin-left10">
            <Card className="sw_card">
              <CardContent>
                <div className="row">
                  <div className="">
                    <div className="stat-cell stat-cell-color-b ">
                      <i className="fa fa-users bg-icon"></i>

                      <span className="text-xlg" id="total-patients">
                        {dataList.MilkCow}
                      </span>

                      <br></br>
                      <span id="totalcase" className="text-bg mt-10">
                         এখন দুধ দিচ্ছে এমন গাভীর সংখ্যা
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* PG Data */}



        
         {/* PG Data */}
         <div className="row dashboardCard">
          <div className="">
            <Card className="sw_card">
              <CardContent>
                <div className="row">
                  <div className="">
                    <div className="stat-cell stat-cell-color-a ">
                      <i className="fa fa-cubes bg-icon"></i>
                      <span className="text-xlg" id="total-patients">
                        {dataList.CowBullNative}
                      </span>

                      <br></br>
                      <span id="totalcase" className="text-bg mt-10">
                        Total Bull/Castrated Bull (Native)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="margin-left10">
            <Card className="sw_card">
              <CardContent>
                <div className="row">
                  <div className="">
                    <div className="stat-cell stat-cell-color-b ">
                      <i className="fa fa-users bg-icon"></i>

                      <span className="text-xlg" id="total-patients">
                        {dataList.CowBullCross}
                      </span>

                      <br></br>
                      <span id="totalcase" className="text-bg mt-10">
                         Total Bull/Castrated Bull (Cross)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* PG Data */}


        
         {/* PG Data */}
         <div className="row dashboardCard">
          <div className="">
            <Card className="sw_card">
              <CardContent>
                <div className="row">
                  <div className="">
                    <div className="stat-cell stat-cell-color-a ">
                      <i className="fa fa-cubes bg-icon"></i>
                      <span className="text-xlg" id="total-patients">
                        {dataList.CowCalfMaleNative}
                      </span>

                      <br></br>
                      <span id="totalcase" className="text-bg mt-10">
                        Total Calf Male (Native)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="margin-left10">
            <Card className="sw_card">
              <CardContent>
                <div className="row">
                  <div className="">
                    <div className="stat-cell stat-cell-color-b ">
                      <i className="fa fa-users bg-icon"></i>

                      <span className="text-xlg" id="total-patients">
                        {dataList.CowCalfMaleCross}
                      </span>

                      <br></br>
                      <span id="totalcase" className="text-bg mt-10">
                          Total Calf Male (Cross)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* PG Data */}

        
         {/* PG Data */}
         <div className="row dashboardCard">
          <div className="">
            <Card className="sw_card">
              <CardContent>
                <div className="row">
                  <div className="">
                    <div className="stat-cell stat-cell-color-a ">
                      <i className="fa fa-cubes bg-icon"></i>
                      <span className="text-xlg" id="total-patients">
                        {dataList.CowCalfFemaleNative}
                      </span>

                      <br></br>
                      <span id="totalcase" className="text-bg mt-10">
                        Total Calf Female (Native)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="margin-left10">
            <Card className="sw_card">
              <CardContent>
                <div className="row">
                  <div className="">
                    <div className="stat-cell stat-cell-color-b ">
                      <i className="fa fa-users bg-icon"></i>

                      <span className="text-xlg" id="total-patients">
                        {dataList.CowCalfFemaleCross}
                      </span>

                      <br></br>
                      <span id="totalcase" className="text-bg mt-10">
                          Total Calf Female (Cross)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* PG Data */}


        
         {/* PG Data */}
         <div className="row dashboardCard">
          <div className="">
            <Card className="sw_card">
              <CardContent>
                <div className="row">
                  <div className="">
                    <div className="stat-cell stat-cell-color-a ">
                      <i className="fa fa-cubes bg-icon"></i>
                      <span className="text-xlg" id="total-patients">
                        {dataList.CowMilkProductionNative}
                      </span>

                      <br></br>
                      <span id="totalcase" className="text-bg mt-10">
                          Household/Farm Total (Cows) Milk Production per day (Liter) (Native)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="margin-left10">
            <Card className="sw_card">
              <CardContent>
                <div className="row">
                  <div className="">
                    <div className="stat-cell stat-cell-color-b ">
                      <i className="fa fa-users bg-icon"></i>

                      <span className="text-xlg" id="total-patients">
                        {dataList.CowMilkProductionCross}
                      </span>

                      <br></br>
                      <span id="totalcase" className="text-bg mt-10">
                          Household/Farm Total (Cows) Milk Production per day (Liter) (Cross)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* PG Data */}



        
         {/* PG Data */}
         <div className="row dashboardCard">
          <div className="">
            <Card className="sw_card">
              <CardContent>
                <div className="row">
                  <div className="">
                    <div className="stat-cell stat-cell-color-a ">
                      <i className="fa fa-cubes bg-icon"></i>
                      <span className="text-xlg" id="total-patients">
                        {dataList.BuffaloAdultMale}
                      </span>

                      <br></br>
                      <span id="totalcase" className="text-bg mt-10">
                          Total Adult Buffalo (Male)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="margin-left10">
            <Card className="sw_card">
              <CardContent>
                <div className="row">
                  <div className="">
                    <div className="stat-cell stat-cell-color-b ">
                      <i className="fa fa-users bg-icon"></i>

                      <span className="text-xlg" id="total-patients">
                        {dataList.BuffaloAdultFemale}
                      </span>

                      <br></br>
                      <span id="totalcase" className="text-bg mt-10">
                          Total Adult Buffalo (Female)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* PG Data */}



        
         {/* PG Data */}
         <div className="row dashboardCard">
          <div className="">
            <Card className="sw_card">
              <CardContent>
                <div className="row">
                  <div className="">
                    <div className="stat-cell stat-cell-color-a ">
                      <i className="fa fa-cubes bg-icon"></i>
                      <span className="text-xlg" id="total-patients">
                        {dataList.BuffaloCalfMale}
                      </span>

                      <br></br>
                      <span id="totalcase" className="text-bg mt-10">
                          Total Calf Buffalo (Male)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="margin-left10">
            <Card className="sw_card">
              <CardContent>
                <div className="row">
                  <div className="">
                    <div className="stat-cell stat-cell-color-b ">
                      <i className="fa fa-users bg-icon"></i>

                      <span className="text-xlg" id="total-patients">
                        {dataList.BuffaloCalfFemale}
                      </span>

                      <br></br>
                      <span id="totalcase" className="text-bg mt-10">
                          Total Calf Buffalo (Female)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* PG Data */}


        
         {/* PG Data */}
         <div className="row dashboardCard">
          <div className="">
            <Card className="sw_card">
              <CardContent>
                <div className="row">
                  <div className="">
                    <div className="stat-cell stat-cell-color-a ">
                      <i className="fa fa-cubes bg-icon"></i>
                      <span className="text-xlg" id="total-patients">
                        {dataList.BuffaloMilkProduction}
                      </span>

                      <br></br>
                      <span id="totalcase" className="text-bg mt-10">
                      Household/Farm Total (Buffalo) Milk Production per day (Liter)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="margin-left10">
            <Card className="sw_card">
              <CardContent>
                <div className="row">
                  <div className="">
                    <div className="stat-cell stat-cell-color-b ">
                      <i className="fa fa-users bg-icon"></i>

                      <span className="text-xlg" id="total-patients">
                        {dataList.GoatAdultMale}
                      </span>

                      <br></br>
                      <span id="totalcase" className="text-bg mt-10">
                          Total Adult Goat (Male)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* PG Data */}



        
         {/* PG Data */}
         <div className="row dashboardCard">
          <div className="">
            <Card className="sw_card">
              <CardContent>
                <div className="row">
                  <div className="">
                    <div className="stat-cell stat-cell-color-a ">
                      <i className="fa fa-cubes bg-icon"></i>
                      <span className="text-xlg" id="total-patients">
                        {dataList.GoatAdultFemale}
                      </span>

                      <br></br>
                      <span id="totalcase" className="text-bg mt-10">
                        Total Adult Goat (Female)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="margin-left10">
            <Card className="sw_card">
              <CardContent>
                <div className="row">
                  <div className="">
                    <div className="stat-cell stat-cell-color-b ">
                      <i className="fa fa-users bg-icon"></i>

                      <span className="text-xlg" id="total-patients">
                        {dataList.GoatCalfMale}
                      </span>

                      <br></br>
                      <span id="totalcase" className="text-bg mt-10">
                          Total Calf Goat (Male)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* PG Data */}



        
         {/* PG Data */}
         <div className="row dashboardCard">
          <div className="">
            <Card className="sw_card">
              <CardContent>
                <div className="row">
                  <div className="">
                    <div className="stat-cell stat-cell-color-a ">
                      <i className="fa fa-cubes bg-icon"></i>
                      <span className="text-xlg" id="total-patients">
                        {dataList.GoatCalfFemale}
                      </span>

                      <br></br>
                      <span id="totalcase" className="text-bg mt-10">
                        Total Calf Goat (Female)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="margin-left10">
            <Card className="sw_card">
              <CardContent>
                <div className="row">
                  <div className="">
                    <div className="stat-cell stat-cell-color-b ">
                      <i className="fa fa-users bg-icon"></i>

                      <span className="text-xlg" id="total-patients">
                        {dataList.SheepAdultMale}
                      </span>

                      <br></br>
                      <span id="totalcase" className="text-bg mt-10">
                          Total Adult Sheep (Male)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* PG Data */}




        
         {/* PG Data */}
         <div className="row dashboardCard">
          <div className="">
            <Card className="sw_card">
              <CardContent>
                <div className="row">
                  <div className="">
                    <div className="stat-cell stat-cell-color-a ">
                      <i className="fa fa-cubes bg-icon"></i>
                      <span className="text-xlg" id="total-patients">
                        {dataList.SheepAdultFemale}
                      </span>

                      <br></br>
                      <span id="totalcase" className="text-bg mt-10">
                        Total Adult Sheep (Female)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="margin-left10">
            <Card className="sw_card">
              <CardContent>
                <div className="row">
                  <div className="">
                    <div className="stat-cell stat-cell-color-b ">
                      <i className="fa fa-users bg-icon"></i>

                      <span className="text-xlg" id="total-patients">
                        {dataList.SheepCalfMale}
                      </span>

                      <br></br>
                      <span id="totalcase" className="text-bg mt-10">
                          Total Calf Sheep (Male)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* PG Data */}

        
         {/* PG Data */}
         <div className="row dashboardCard">
          <div className="">
            <Card className="sw_card">
              <CardContent>
                <div className="row">
                  <div className="">
                    <div className="stat-cell stat-cell-color-a ">
                      <i className="fa fa-cubes bg-icon"></i>
                      <span className="text-xlg" id="total-patients">
                        {dataList.SheepCalfFemale}
                      </span>

                      <br></br>
                      <span id="totalcase" className="text-bg mt-10">
                        Total Calf Sheep (Female)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="margin-left10">
            <Card className="sw_card">
              <CardContent>
                <div className="row">
                  <div className="">
                    <div className="stat-cell stat-cell-color-b ">
                      <i className="fa fa-users bg-icon"></i>

                      <span className="text-xlg" id="total-patients">
                        {dataList.GoatSheepMilkProduction}
                      </span>

                      <br></br>
                      <span id="totalcase" className="text-bg mt-10">
                      Household/Farm Total (Goat) Milk Production per day (Liter)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* PG Data */}

        
         {/* PG Data */}
         <div className="row dashboardCard">
          <div className="">
            <Card className="sw_card">
              <CardContent>
                <div className="row">
                  <div className="">
                    <div className="stat-cell stat-cell-color-a ">
                      <i className="fa fa-cubes bg-icon"></i>
                      <span className="text-xlg" id="total-patients">
                        {dataList.ChickenNative}
                      </span>

                      <br></br>
                      <span id="totalcase" className="text-bg mt-10">
                        Total Chicken (Native)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="margin-left10">
            <Card className="sw_card">
              <CardContent>
                <div className="row">
                  <div className="">
                    <div className="stat-cell stat-cell-color-b ">
                      <i className="fa fa-users bg-icon"></i>

                      <span className="text-xlg" id="total-patients">
                        {dataList.ChickenLayer}
                      </span>

                      <br></br>
                      <span id="totalcase" className="text-bg mt-10">
                      Total Chicken (Layer)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* PG Data */}

        
         {/* PG Data */}
         <div className="row dashboardCard">
          <div className="">
            <Card className="sw_card">
              <CardContent>
                <div className="row">
                  <div className="">
                    <div className="stat-cell stat-cell-color-a ">
                      <i className="fa fa-cubes bg-icon"></i>
                      <span className="text-xlg" id="total-patients">
                        {dataList.ChickenBroiler}
                      </span>

                      <br></br>
                      <span id="totalcase" className="text-bg mt-10">
                        Total Chicken (Broiler)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="margin-left10">
            <Card className="sw_card">
              <CardContent>
                <div className="row">
                  <div className="">
                    <div className="stat-cell stat-cell-color-b ">
                      <i className="fa fa-users bg-icon"></i>

                      <span className="text-xlg" id="total-patients">
                        {dataList.ChickenSonali}
                      </span>

                      <br></br>
                      <span id="totalcase" className="text-bg mt-10">
                      Total Chicken (Sonali)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* PG Data */}




        
         {/* PG Data */}
         <div className="row dashboardCard">
          <div className="">
            <Card className="sw_card">
              <CardContent>
                <div className="row">
                  <div className="">
                    <div className="stat-cell stat-cell-color-a ">
                      <i className="fa fa-cubes bg-icon"></i>
                      <span className="text-xlg" id="total-patients">
                        {dataList.ChickenSonaliFayoumiCockerelOthers}
                      </span>

                      <br></br>
                      <span id="totalcase" className="text-bg mt-10">
                        Total Chicken (Other Poultry (Fayoumi/ Cockerel/ Turkey))
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="margin-left10">
            <Card className="sw_card">
              <CardContent>
                <div className="row">
                  <div className="">
                    <div className="stat-cell stat-cell-color-b ">
                      <i className="fa fa-users bg-icon"></i>

                      <span className="text-xlg" id="total-patients">
                        {dataList.ChickenEgg}
                      </span>

                      <br></br>
                      <span id="totalcase" className="text-bg mt-10">
                      Household/Farm Total (Chicken) Daily Egg Production
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* PG Data */}


        
        
         {/* PG Data */}
         <div className="row dashboardCard">
          <div className="">
            <Card className="sw_card">
              <CardContent>
                <div className="row">
                  <div className="">
                    <div className="stat-cell stat-cell-color-a ">
                      <i className="fa fa-cubes bg-icon"></i>
                      <span className="text-xlg" id="total-patients">
                        {dataList.DucksNumber}
                      </span>

                      <br></br>
                      <span id="totalcase" className="text-bg mt-10">
                        Total Number of Ducks/Swan
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="margin-left10">
            <Card className="sw_card">
              <CardContent>
                <div className="row">
                  <div className="">
                    <div className="stat-cell stat-cell-color-b ">
                      <i className="fa fa-users bg-icon"></i>

                      <span className="text-xlg" id="total-patients">
                        {dataList.DucksEgg}
                      </span>

                      <br></br>
                      <span id="totalcase" className="text-bg mt-10">
                      Household/Farm Total (Duck) Daily Egg Production
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* PG Data */}





        
         {/* PG Data */}
         <div className="row dashboardCard">
          <div className="">
            <Card className="sw_card">
              <CardContent>
                <div className="row">
                  <div className="">
                    <div className="stat-cell stat-cell-color-a ">
                      <i className="fa fa-cubes bg-icon"></i>
                      <span className="text-xlg" id="total-patients">
                        {dataList.PigeonNumber}
                      </span>

                      <br></br>
                      <span id="totalcase" className="text-bg mt-10">
                        Total Number of Pigeon
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="margin-left10">
            <Card className="sw_card">
              <CardContent>
                <div className="row">
                  <div className="">
                    <div className="stat-cell stat-cell-color-b ">
                      <i className="fa fa-users bg-icon"></i>

                      <span className="text-xlg" id="total-patients">
                        {dataList.QuailNumber}
                      </span>

                      <br></br>
                      <span id="totalcase" className="text-bg mt-10">
                      Total Number of Quail
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* PG Data */}




        
         {/* PG Data */}
         <div className="row dashboardCard">
          <div className="">
            <Card className="sw_card">
              <CardContent>
                <div className="row">
                  <div className="">
                    <div className="stat-cell stat-cell-color-a ">
                      <i className="fa fa-cubes bg-icon"></i>
                      <span className="text-xlg" id="total-patients">
                        {dataList.OtherAnimalNumber}
                      </span>

                      <br></br>
                      <span id="totalcase" className="text-bg mt-10">
                        Total Number of other animals (Pig/Horse)
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="margin-left10">
            <Card className="sw_card">
              <CardContent>
                <div className="row">
                  <div className="">
                    <div className="stat-cell stat-cell-color-b ">
                      <i className="fa fa-users bg-icon"></i>

                      <span className="text-xlg" id="total-patients">
                        {dataList.LandTotal}
                      </span>

                      <br></br>
                      <span id="totalcase" className="text-bg mt-10">
                      Total cultivable land in decimal
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* PG Data */}


        
         {/* PG Data */}
         <div className="row dashboardCard">
          <div className="">
            <Card className="sw_card">
              <CardContent>
                <div className="row">
                  <div className="">
                    <div className="stat-cell stat-cell-color-a ">
                      <i className="fa fa-cubes bg-icon"></i>
                      <span className="text-xlg" id="total-patients">
                        {dataList.LandOwn}
                      </span>

                      <br></br>
                      <span id="totalcase" className="text-bg mt-10">
                        Total Own land for Fodder cultivation
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="margin-left10">
            <Card className="sw_card">
              <CardContent>
                <div className="row">
                  <div className="">
                    <div className="stat-cell stat-cell-color-b ">
                      <i className="fa fa-users bg-icon"></i>

                      <span className="text-xlg" id="total-patients">
                        {dataList.LandLeased}
                      </span>

                      <br></br>
                      <span id="totalcase" className="text-bg mt-10">
                      Total Leased land for fodder cultivation
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* PG Data */}






        <DarkFooter {...props} />

      </div>
    </>
  );
};

export default HouseholdDashboard;
