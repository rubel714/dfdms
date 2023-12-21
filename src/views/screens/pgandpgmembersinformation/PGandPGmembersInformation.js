import React, { forwardRef, useRef, useEffect } from "react";
import swal from "sweetalert";
import { DeleteOutline, Edit } from "@material-ui/icons";
import { Button } from "../../../components/CustomControl/Button";

import CustomTable from "components/CustomTable/CustomTable";
import SpinnerInTable from "components/Spinner/SpinnerInTable";
import {
  apiCall,
  apiOption,
  LoginUserInfo,
  language,
} from "../../../actions/api";
import ExecuteQueryHook from "../../../components/hooks/ExecuteQueryHook";

/* import PgEntryFormAddEditModal from "./PgEntryFormAddEditModal";
 */

const PGandPGmembersInformation = (props) => {
  const serverpage = "pgandpgmembersinformation"; // this is .php server page

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

  /* =====Start of Excel Export Code==== */
  const EXCEL_EXPORT_URL = process.env.REACT_APP_API_URL;

  const PrintPDFExcelExportFunction = (reportType) => {
    let finalUrl =
      EXCEL_EXPORT_URL + "report/pg_and_pg_members_information_exce.php";

    let DivisionName =
      divisionList[
        divisionList.findIndex(
          (divisionList_List) => divisionList_List.id == currDivisionId
        )
      ].name;
    let DistrictName =
      districtList[
        districtList.findIndex(
          (districtList_List) => districtList_List.id == currDistrictId
        )
      ].name;
    let UpazilaName =
      upazilaList[
        upazilaList.findIndex(
          (upazilaList_List) => upazilaList_List.id == currUpazilaId
        )
      ].name;

    window.open(
      finalUrl +
        "?action=MembersbyPGataExport" +
        "&reportType=excel" +
        "&DivisionId=" +
        currDivisionId +
        "&DistrictId=" +
        currDistrictId +
        "&UpazilaId=" +
        currUpazilaId +
        "&DivisionName=" +
        DivisionName +
        "&DistrictName=" +
        DistrictName +
        "&UpazilaName=" +
        UpazilaName +
        "&TimeStamp=" +
        Date.now()
    );
  };
  /* =====End of Excel Export Code==== */

  /* 
  const columnList = [
    { field: "rownumber", label: "SL", visible:false, align: "center", width: "3%" },
    // { field: 'SL', label: 'SL',width:'10%',align:'center',visible:true,sort:false,filter:false },
   
    {
      field: "Division",
      label: "Division 11111",
      align: "left",
      visible: true,
      sort: true,
      filter: true,
      width: "10%",
    },
    {
      field: "Dairy",
      label: "Dairy",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: "7%",
    },
    {
      field: "Buffalo",
      label: "Buffalo",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: "7%",
    },
 
    {
      field: "BeefFattening",
      label: "Beef Fattening",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: "7%"
    },

    {
      field: "Goat",
      label: "Goat",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: "7%"
    },
    {
      field: "Sheep",
      label: "Sheep",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: "7%"
    },
    {
      field: "ScavengingChickens",
      label: "Scavenging Chickens",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: "7%"
    },
    {
      field: "Duck",
      label: "Duck",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: "7%"
    },
    {
      field: "Quail",
      label: "Quail",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: "7%"
    },
    {
      field: "Pigeon",
      label: "Pigeon",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: "7%"
    },
    {
      field: "GrandTotal",
      label: "Grand Total",
      align: "right",
      visible: true,
      sort: true,
      filter: true,
      width: "7%"
    },
 
   
  ]; */

  if (bFirst) {
    /**First time call for datalist */

    getDivision(UserInfo.DivisionId, UserInfo.DistrictId, UserInfo.UpazilaId);

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

  function getDivision(selectDivisionId, SelectDistrictId, selectUpazilaId) {
    let params = {
      action: "DivisionFilterList",
      lan: language(),
      UserId: UserInfo.UserId,
    };

    apiCall.post("combo_generic", { params }, apiOption()).then((res) => {
      setDivisionList([{ id: "", name: "All" }].concat(res.data.datalist));

      // setCurrDivisionId(selectDivisionId);

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

  useEffect(() => {
    getDataList();
  }, [currDivisionId, currDistrictId, currUpazilaId]);

  return (
    <>
      <div class="bodyContainer">
        {/* <!-- ######-----TOP HEADER-----####### --> */}
        <div class="topHeader">
          <h4>
            Home ❯ Reports ❯ Administrative Distribution of PGs & Farmers
          </h4>
        </div>
        {/* <!-- TABLE SEARCH AND GROUP ADD --> */}
        <div class="searchAdd2">
          <div class="formControl-filter-data-label">
            <label for="DivisionId">Division: </label>
            <select
              class="dropdown_filter"
              id="DivisionId"
              name="DivisionId"
              value={currDivisionId}
              onChange={(e) => handleChange(e)}
            >
              {divisionList &&
                divisionList.map((item, index) => {
                  return <option value={item.id}>{item.name}</option>;
                })}
            </select>
          </div>

          <div class="formControl-filter-data-label">
            <label for="DistrictId">District: </label>
            <select
              class="dropdown_filter"
              id="DistrictId"
              name="DistrictId"
              value={currDistrictId}
              onChange={(e) => handleChange(e)}
            >
              {districtList &&
                districtList.map((item, index) => {
                  return <option value={item.id}>{item.name}</option>;
                })}
            </select>
          </div>

          <div class="formControl-filter-data-label">
            <label for="UpazilaId">Upazila: </label>
            <select
              id="UpazilaId"
              name="UpazilaId"
              class="dropdown_filter"
              value={currUpazilaId}
              onChange={(e) => handleChange(e)}
            >
              {upazilaList &&
                upazilaList.map((item, index) => {
                  return <option value={item.id}>{item.name}</option>;
                })}
            </select>
          </div>

          <div class="filter-button">
            <Button
              label={"Export"}
              class={"btnPrint"}
              onClick={PrintPDFExcelExportFunction}
            />
          </div>
        </div>

        {/* <!-- ####---THIS CLASS IS USE FOR TABLE GRID PRODUCT INFORMATION---####s --> */}
        <div class="subContainer">
          <div className="App">
            <div class="subContainer">
              <table class="tableGlobal">
                <thead>
                  <tr>
                    <th rowspan="2">Division</th>
                    <th rowspan="2">District</th>
                    <th rowspan="2">Upazila</th>
                    <th className="text-center" colspan="2">
                      Dairy
                    </th>
                    <th className="text-center" colspan="2">
                      Buffalo
                    </th>
                    <th className="text-center" colspan="2">
                      Beef Fattening
                    </th>
                    <th className="text-center" colspan="2">
                      Goat
                    </th>
                    <th className="text-center" colspan="2">
                      Sheep
                    </th>
                    <th className="text-center" colspan="2">
                      Scavenging Chickens
                    </th>
                    <th className="text-center" colspan="2">
                      Duck
                    </th>
                    <th className="text-center" colspan="2">
                      Quail
                    </th>
                    <th className="text-center" colspan="2">
                      Pigeon
                    </th>
                    <th rowspan="2">Total PG</th>
                    <th rowspan="2">Total PG Members</th>
                  </tr>
                  <tr>
                    <th>PG</th>
                    <th>PG Members</th>
                    <th>PG</th>
                    <th>PG Members</th>
                    <th>PG</th>
                    <th>PG Members</th>
                    <th>PG</th>
                    <th>PG Members</th>
                    <th>PG</th>
                    <th>PG Members</th>
                    <th>PG</th>
                    <th>PG Members</th>
                    <th>PG</th>
                    <th>PG Members</th>
                    <th>PG</th>
                    <th>PG Members</th>
                    <th>PG</th>
                    <th>PG Members</th>
                  </tr>
                </thead>

                <tbody>
                  {isLoading && <SpinnerInTable colsLength={23} />}
                  {!isLoading &&
                    dataList.map((row, index) => (
                      <tr key={index}>
                        <td className="tg-zv4m">{row.DivisionName}</td>
                        <td className="tg-zv4m">{row.DistrictName}</td>
                        <td className="tg-zv4m">{row.UpazilaName}</td>
                        <td className="alignRightText tdWidthc">
                          {row.DairyPG}
                        </td>
                        <td className="alignRightText">{row.DairyFarmer}</td>
                        <td className="alignRightText tdWidthc">
                          {row.BuffaloPG}
                        </td>
                        <td className="alignRightText">{row.BuffaloFarmer}</td>
                        <td className="alignRightText tdWidthc">
                          {row.BeefFatteningPG}
                        </td>
                        <td className="alignRightText">
                          {row.BeefFatteningFarmer}
                        </td>
                        <td className="alignRightText tdWidthc">
                          {row.GoatPG}
                        </td>
                        <td className="alignRightText">{row.GoatFarmer}</td>
                        <td className="alignRightText tdWidthc">
                          {row.SheepPG}
                        </td>
                        <td className="alignRightText">{row.SheepFarmer}</td>
                        <td className="alignRightText tdWidthc">
                          {row.ScavengingChickensPG}
                        </td>
                        <td className="alignRightText">
                          {row.ScavengingChickensFarmer}
                        </td>
                        <td className="alignRightText tdWidthc">
                          {row.DuckPG}
                        </td>
                        <td className="alignRightText">{row.DuckFarmer}</td>
                        <td className="alignRightText tdWidthc">
                          {row.QuailPG}
                        </td>
                        <td className="alignRightText">{row.QuailFarmer}</td>
                        <td className="alignRightText tdWidthc">
                          {row.PigeonPG}
                        </td>
                        <td className="alignRightText">{row.PigeonFarmer}</td>
                        <td className="alignRightText">{row.RowTotalPG}</td>
                        <td className="alignRightText">{row.RowTotalFarmer}</td>
                      </tr>
                    ))}
                </tbody>

                {/* <tbody>
                  <tr>
                    <td>Barishal</td>
                    <td>Barishal</td>
                    <td>Agailjhara</td>
                    <td>7</td>
                    <td>218</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>1</td>
                    <td>31</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td> </td>
                    <td> </td>
                    <td>Babugonj</td>
                    <td>5</td>
                    <td>200</td>
                    <td> </td>
                    <td> </td>
                    <td>1</td>
                    <td>29</td>
                    <td>1</td>
                    <td>30</td>
                    <td> </td>
                    <td> </td>
                    <td>1</td>
                    <td>38</td>
                    <td> </td>
                    <td> </td>
                    <td> </td>
                    <td> </td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody> */}
              </table>
            </div>
            {/* <CustomTable
              columns={columnList}
              rows={dataList?dataList:{}}
               actioncontrol={actioncontrol}
            /> */}
          </div>
        </div>
      </div>
      {/* <!-- BODY CONTAINER END --> */}
    </>
  );
};

export default PGandPGmembersInformation;
