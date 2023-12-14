import React, { forwardRef, useRef, useEffect } from "react";
import swal from "sweetalert";
import { DeleteOutline, Edit, Launch } from "@material-ui/icons";
import { Button } from "../../components/CustomControl/Button";
import AfterLoginNavbar from "components/Navbars/AfterLoginNavbar";
import CustomTable from "components/CustomTable/CustomTable";
import { apiCall, apiOption, LoginUserInfo, language } from "../../actions/api";
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

const DashboardPage = (props) => {
  const serverpage = "dashboardpage"; // this is .php server page

  const { useState } = React;
  const [bFirst, setBFirst] = useState(true);
  const [currentRow, setCurrentRow] = useState([]);
  const [showModal, setShowModal] = useState(false); //true=show modal, false=hide modal

  const { isLoading, data: dataList, error, ExecuteQuery } = ExecuteQueryHook(); //Fetch data
  const { isLoading2, data: dataListGenderwisePGMember, error2, ExecuteQuery: ExecuteQueryGenderwisePGMember } = ExecuteQueryHook(); //Fetch data
  const { isLoading3, data: dataListValueChainwisePGDistribution, error3, ExecuteQuery: ExecuteQueryValueChainwisePGDistribution } = ExecuteQueryHook();
  const { isLoading4, data: dataListValueChainwisePGDMemberistributionDataList, error4, ExecuteQuery: ExecuteQueryValueChainwisePGDMemberistributionDataList } = ExecuteQueryHook();
 

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
    getGenderwisePGMemberDataList();
    getValueChainwisePGDistributionDataList();
    getValueChainwisePGDMemberistributionDataList();
   

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


  function getGenderwisePGMemberDataList() {
    let params = {
      action: "getGenderwisePGMemberDataList",
      lan: language(),
      UserId: UserInfo.UserId,
      DivisionId: currDivisionId,
      DistrictId: currDistrictId,
      UpazilaId: currUpazilaId,
    };
    // console.log('LoginUserInfo params: ', params);

    ExecuteQueryGenderwisePGMember(serverpage, params);
  }


  
  function getValueChainwisePGDistributionDataList() {
    let params = {
      action: "getValueChainwisePGDistributionDataList",
      lan: language(),
      UserId: UserInfo.UserId,
      DivisionId: currDivisionId,
      DistrictId: currDistrictId,
      UpazilaId: currUpazilaId,
    };
    // console.log('LoginUserInfo params: ', params);

    ExecuteQueryValueChainwisePGDistribution(serverpage, params);
  } 

  
  function getValueChainwisePGDMemberistributionDataList() {
    let params = {
      action: "getValueChainwisePGDMemberistributionDataList",
      lan: language(),
      UserId: UserInfo.UserId,
      DivisionId: currDivisionId,
      DistrictId: currDistrictId,
      UpazilaId: currUpazilaId,
    };
    // console.log('LoginUserInfo params: ', params);

    ExecuteQueryValueChainwisePGDMemberistributionDataList(serverpage, params);
  } 



  
  // ==========Start Pie Chart==========
  const GenderWisePGMemberData = {
    chart: {
      type: "pie",
    },
    title: {
      text: "Gender wise PG Members",
    },
    yAxis: {
      min: 0,
      max: 100,
      // title: {
      //   text: "",
      // },
    },
    legend: {
      enabled: true,
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      //    valueSuffix: " %",
    },
    plotOptions: {
      pie: {
        showInLegend: true,
        dataLabels: {
          enabled: false,
          crop: true,
          formatter: function () {
            return this.y; // + "%"
          },
        },
      },
    },
    series: [
      {
        name: "Gender",
        data: dataListGenderwisePGMember.map(({ name, y, count, color }) => ({
          name: `${name} - ${y.toFixed(2)}% (${count})`,
          y,
          color,
        })),
      },
    ],
  };
  // ==========End Pie Chart==========


  // ==========Start Value Chain wise PG Distribution bar Chart==========
  const ValueChainwisePGDistributionChartData = {
    chart: {
      type: 'bar'
    },
    title: {
      text: 'Division wise PG Distribution',
      align: 'center'
    },
    xAxis: {
      categories: dataListValueChainwisePGDistribution.categories,
      title: {
        text: null
      },
      gridLineWidth: 1,
      lineWidth: 0
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Total',
        align: 'high'
      },
      labels: {
        overflow: 'justify'
      },
      gridLineWidth: 0
    },
    tooltip: {
      valueSuffix: ' '
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true
        },
        groupPadding: 0.1
      }
    },
    legend: {},
    credits: {
      enabled: false
    },
    series: dataListValueChainwisePGDistribution.seriesData
  };
  
  // ==========End Value Chain wise PG Distribution bar Chart==========



    // ==========Start Value Chain wise PG Member Distribution bar Chart==========
    const ValueChainwisePGMemberDistributionjsonChartData = {
      chart: {
        type: 'bar'
      },
      title: {
        text: 'Division wise PG Member Distribution',
        align: 'center'
      },
      xAxis: {
        categories: dataListValueChainwisePGDMemberistributionDataList.categories,
        title: {
          text: null
        },
        gridLineWidth: 1,
        lineWidth: 0
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Total',
          align: 'high'
        },
        labels: {
          overflow: 'justify'
        },
        gridLineWidth: 0
      },
      tooltip: {
        valueSuffix: ' '
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true
          },
          groupPadding: 0.1
        }
      },
      legend: {},
      credits: {
        enabled: false
      },
      series: dataListValueChainwisePGDMemberistributionDataList.seriesData
    };
    
    // ==========End Value Chain wise PG Member Distribution bar Chart==========
    

 /*  // Start Value Chain wise PG Member Distribution
  const ValueChainwisePGMemberDistributionjsonData = [
    ["Division", "Grand Total"],
    ["Barishal", 16951],
    ["Chattogram", 21695],
    ["Dhaka", 29612],
    ["Khulna", 25932],
    ["Mymensingh", 13460],
    ["Rajshahi", 31626],
    ["Rangpur", 31320],
    ["Sylhet", 9305],
  ];

  const headers2 = ValueChainwisePGMemberDistributionjsonData[0];
  const dataRows2 = ValueChainwisePGMemberDistributionjsonData.slice(1);

  const divisionNames2 = dataRows2.map((row) => row[0]);
  const grandTotalData2 = dataRows2.map((row) => row[1]);

  const seriesData2 = headers2.slice(1, -1).map((category, index) => ({
    name: category,
    data: dataRows2.map((row) => row[index + 1]),
    stack: "total",
    tooltip: {
      pointFormat: `{series.name}: {point.y} ({point.stackTotal})`,
    },
  }));

  const ValueChainwisePGMemberDistributionjsonChartData = {
    chart: {
      type: "bar",
    },
    title: {
      text: "Division wise PG Member Distribution",
    },
    xAxis: {
      categories: divisionNames2,
    },
    yAxis: {
      title: {
        text: "Total",
      },
    },
    credits: {
      enabled: false,
    },
    tooltip: {
      shared: true,
    },
    plotOptions: {
      series: {
        stacking: "normal",
        dataLabels: {
          enabled: true,
          formatter: function () {
            return this.y;
          },
        },
      },
    },
    legend: {
      enabled: false,
    },
    series: [
      ...seriesData2,
      {
        name: "Grand Total",
        data: grandTotalData2,
        stack: "total",
        dataLabels: {
          enabled: true,
          formatter: function () {
            return this.y;
          },
        },
      },
    ],
  };
  // End Value Chain wise PG Distribution */


  /** Action from table row buttons*/
  function actioncontrol(rowData) {
    return (
      <>
        {/* <Edit
          className={"table-edit-icon"}
          onClick={() => {
            editData(rowData);
          }}
        /> */}

        {/* <DeleteOutline
          className={"table-delete-icon"}
          onClick={() => {
            deleteData(rowData);
          }}
        /> */}
      </>
    );
  }

  const addData = () => {
    setCurrentRow({
      id: "",
      PGName: "",
      DivisionId: "",
      DistrictId: "",
      UpazilaId: "",
      Address: "",
      UnionId: "",
      PgGroupCode: "",
      PgBankAccountNumber: "",
      BankName: "",
      ValuechainId: "",
      IsLeadByWomen: 0,
      GenderId: "",
      IsActive: 0,
    });
    openModal();
  };

  const editData = (rowData) => {
    setCurrentRow(rowData);
    openModal();
  };

  function openModal() {
    setShowModal(true); //true=modal show, false=modal hide
  }

  /* function modalCallback(response) {
    //response = close, addedit
    // console.log('response: ', response);
    getDataList();
    setShowModal(false); //true=modal show, false=modal hide
  } */

  function getDivision(selectDivisionId, SelectDistrictId, selectUpazilaId) {
    let params = {
      action: "DivisionFilterList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setDivisionList([{ id: "", name: "All" }].concat(res.data.datalist));

      //setCurrDivisionId(selectDivisionId);

      getDistrict(selectDivisionId, SelectDistrictId, selectUpazilaId);
    });
  }

  function getDistrict(selectDivisionId, SelectDistrictId, selectUpazilaId) {
    let params = {
      action: "DistrictFilterList",
      lan: language(),
      UserId: UserInfo.UserId,
      DivisionId: selectDivisionId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setDistrictList([{ id: "", name: "All" }].concat(res.data.datalist));

      setCurrDistrictId(SelectDistrictId);
      getUpazila(selectDivisionId, SelectDistrictId, selectUpazilaId);
    });
  }

  function getUpazila(selectDivisionId, SelectDistrictId, selectUpazilaId) {
    let params = {
      action: "UpazilaFilterList",
      lan: language(),
      UserId: UserInfo.UserId,
      DivisionId: selectDivisionId,
      DistrictId: SelectDistrictId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setUpazilaList([{ id: "", name: "All" }].concat(res.data.datalist));

      setCurrUpazilaId(selectUpazilaId);
    });
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    let data = { ...currentFilter };
    data[name] = value;

    setCurrentFilter(data);

    //for dependancy
    if (name === "DivisionId") {
      setCurrDivisionId(value);

      setCurrDistrictId("");
      setCurrUpazilaId("");
      getDistrict(value, "", "");
      getUpazila(value, "", "");
    } else if (name === "DistrictId") {
      setCurrDistrictId(value);
      getUpazila(currentFilter.DivisionId, value, "");
    } else if (name === "UpazilaId") {
      setCurrUpazilaId(value);
    }
  };

  /*   useEffect(() => {
    getDataList();
  }, [currDivisionId, currDistrictId, currUpazilaId]); */

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
          <h4>Home ❯ Dashboard</h4>
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
                  <span>Date: {dataList.CurrentDate}</span>
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
        <div className="row dashboardCard">
          <div className="">
            <Card className="sw_card">
              <CardContent>
                <div className="row">
                  <div className="">
                    <div className="stat-cell stat-cell-color-a ">
                      <i className="fa fa-cubes bg-icon"></i>

                      <a
                        href="javascript:void(0);"
                        className="HyColor iconPositionRight"
                        onClick={goToTotalPGMember}
                      >
                        <Launch />
                      </a>

                      <span className="text-xlg" id="total-patients">
                        {dataList.TotalPG}
                      </span>

                      <br></br>
                      <span id="totalcase" className="text-bg mt-10">
                        Total PG
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

                      <a
                        href="javascript:void(0);"
                        className="HyColor iconPositionRight"
                        onClick={goToTotalPGMember}
                      >
                        <Launch />
                      </a>

                      <span className="text-xlg" id="total-patients">
                        {dataList.TotalPGMember}
                      </span>

                      <br></br>
                      <span id="totalcase" className="text-bg mt-10">
                        Total PG Member
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* PG Data */}

        <div className="row dashboardCard">
          <div className="">
            <Card className="sw_card">
              <CardHeader
                // title={t(DispensingLanguage[lan][menukey]["Lots expiring in 6 months"])}
                action={
                  <a
                    href="javascript:void(0);"
                    className="HyColor"
                    onClick={goToGenderWisePGMember}
                  >
                    <Launch />
                  </a>
                }
              />

              <CardContent>
                <div className="row">
                  <div className="">
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={GenderWisePGMemberData}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="margin-left10">
            <Card className="sw_card">
              <CardHeader
                action={
                  <a
                    href="javascript:void(0);"
                    className="HyColor"
                    onClick={goToValuechainwisepgdistribution}
                  >
                    <Launch />
                  </a>
                }
              />

              <CardContent>
                <div className="row">
                  <div className="">
                    <HighchartsReact
                      highcharts={Highcharts}
                      options={ValueChainwisePGDistributionChartData}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* PG Data */}

        <div className="pgMemberDistribution">
          <Card className="sw_card">
            <CardHeader
              action={
                <a
                  href="javascript:void(0);"
                  className="HyColor"
                  onClick={goToValuechainwisepgmemberdistribution}
                >
                  <Launch />
                </a>
              }
            />

            <CardContent>
              <div className="row">
                <div className="">
                  <HighchartsReact
                    highcharts={Highcharts}
                    options={ValueChainwisePGMemberDistributionjsonChartData}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
