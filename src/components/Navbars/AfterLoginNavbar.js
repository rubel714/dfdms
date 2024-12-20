import React, { useContext } from "react";
import Cookies from 'js-cookie';

import { apiCall, apiOption, LoginUserInfo, language } from "../../actions/api";

function AfterLoginNavbar(props) {
  const [userInfo, setUserInfo] = React.useState(LoginUserInfo());
  const baseUrl = process.env.REACT_APP_FRONT_URL;

  function menuShowPermision(pMenuKey) {
    let isShow = 0;

    // console.log(LoginUserInfo().UserAllowdMenuList);
    let menuList = LoginUserInfo().UserAllowdMenuList;
    // console.log("menuList: ", menuList);

    menuList.forEach((menu, i) => {
      // console.log('menu: ', menu.MenuKey);
      if (menu.MenuKey === pMenuKey) {
        isShow = 1;
        return;
      }
    });

    return isShow;
  }

  return (
    <>
      {/* <!-- NAV BAR --> */}
      <nav class="navbar">
        {/* <!-- LOGO --> */}
        <div class="logo">
          <img alt="..." src={require("assets/img/main_logo.png")}></img>
        </div>

        {/* <!-- MENUE LIST  BAR --> */}
        <div class="menuBar">
          <div class="menuListBar">
            <ul>
              <li class="dropdownMenu">
                {" "}
                <a
                  class="parentMenu"
                  href="javascript:void(0)"
                  onClick={() => props.history.push("/")}
                >
                  Home
                </a>
              </li>

              {menuShowPermision("dashboard") === 1 && (
                <li class="dropdownMenu">
                  {" "}
                  <a
                    class="parentMenu"
                    href="javascript:void(0)"
                    onClick={() => props.history.push("dashboard")}
                  >
                    Dashboard
                  </a>
                </li>
              )}

              {menuShowPermision("householddashboard") === 1 && (
                <li class="dropdownMenu">
                  {" "}
                  <a
                    class="parentMenu"
                    href="javascript:void(0)"
                    onClick={() => props.history.push("householddashboard")}
                  >
                    Household Dashborad
                  </a>
                </li>
              )}

              {menuShowPermision("reports") === 1 && (
                <li class="dropdownMenu">
                  {" "}
                  Reports
                  <ul class="dropdownList">
                    {menuShowPermision("membersbypg") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() => props.history.push("membersbypg")}
                        >
                          PG Members
                        </a>
                      </li>
                    )}
                    {menuShowPermision("genderwisepgmembers") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() =>
                            props.history.push("genderwisepgmembers")
                          }
                        >
                          Gender Status
                        </a>
                      </li>
                    )}
                    {menuShowPermision("valuechainwisepgdistribution") ===
                      1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() =>
                            props.history.push("valuechainwisepgdistribution")
                          }
                        >
                          PG Distribution
                        </a>
                      </li>
                    )}
                    {menuShowPermision("valuechainwisepgmemberdistribution") ===
                      1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() =>
                            props.history.push(
                              "valuechainwisepgmemberdistribution"
                            )
                          }
                        >
                          Farmer Distribution
                        </a>
                      </li>
                    )}
                    {menuShowPermision("pgandpgmembersinformation") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() =>
                            props.history.push("pgandpgmembersinformation")
                          }
                        >
                          Administrative Distribution of PGs & Farmers
                        </a>
                      </li>
                    )}

                    {menuShowPermision("totalhouseholdinformation") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() => props.history.push("totalhouseholdinformation")}
                        >
                          Total Household Information
                        </a>
                      </li>
                    )}

                    {menuShowPermision("totalhouseholdanimalinformation") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() => props.history.push("totalhouseholdanimalinformation")}
                        >
                          Total Household Animal Information
                        </a>
                      </li>
                    )}

                    {menuShowPermision("householdlocation") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() => props.history.push("householdlocation")}
                        >
                        Household Location Report
                        </a>
                      </li>
                    )}

                    {menuShowPermision("dfdmsdatarange") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() => props.history.push("dfdmsdatarange")}
                        >
                        DFDMS Data Range
                        </a>
                      </li>
                    )}

                  </ul>
                </li>
              )}

              {menuShowPermision("datacollection") === 1 && (
                <li class="dropdownMenu">
                  {" "}
                  Data Collection
                  <ul class="dropdownList">
                    {menuShowPermision("farmersdatacollectionentry") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() =>
                            props.history.push("farmersdatacollectionentry")
                          }
                        >
                          Farmer Data Entry
                        </a>
                      </li>
                    )}

                    {menuShowPermision("pgdatacollectionentry") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() =>
                            props.history.push("pgdatacollectionentry")
                          }
                        >
                          PG Data Entry
                        </a>
                      </li>
                    )}

                    {menuShowPermision("lgddatacollectionentry") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() =>
                            props.history.push("lgddatacollectionentry")
                          }
                        >
                          Community Data Entry
                        </a>
                      </li>
                    )}

                    {menuShowPermision("farmerdataentrynonpg") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() =>
                            props.history.push("farmerdataentrynonpg")
                          }
                        >
                          Household Livestock Survey 2024 View
                        </a>
                      </li>
                    )}

                    {menuShowPermision("householdlivestocksurveydataentry") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() =>
                            props.history.push("householdlivestocksurveydataentry")
                          }
                        >
                          Household Livestock Survey 2024 Data Entry
                        </a>
                      </li>
                    )}
                    {menuShowPermision("householdlivestocksurveyforuser") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() =>
                            props.history.push("householdlivestocksurveyforuser")
                          }
                        >
                          Household Livestock Survey 2024 View for User
                        </a>
                      </li>
                    )}

                    {/* 
                  {menuShowPermision("pgdatacollection") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() => props.history.push("pgdatacollection")}
                        >
                          PG Data Collection
                        </a>
                      </li>
                    )}

                  {menuShowPermision("farmersdatacollection") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() => props.history.push("farmersdatacollection")}
                        >
                          Farmers Data Collection
                        </a>
                      </li>
                    )}
                    
                  {menuShowPermision("datafromlgd") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() => props.history.push("datafromlgd")}
                        >
                          LGD Data Collection
                        </a>
                      </li>
                    )} */}
                  </ul>
                </li>
              )}

              {menuShowPermision("admin") === 1 && (
                <li class="dropdownMenu">
                  {" "}
                  Admin
                  <ul class="dropdownList">
                    {/* {menuShowPermision("datatype") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() => props.history.push("datatype")}
                        >
                          Data Form Type
                        </a>
                      </li>
                    )} */}

                    {menuShowPermision("questionsentry") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() => props.history.push("questionsentry")}
                        >
                          Question Entry
                        </a>
                      </li>
                    )}

                    {menuShowPermision("datatypequestionsmap") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() =>
                            props.history.push("datatypequestionsmap")
                          }
                        >
                          Question Links
                        </a>
                      </li>
                    )}

<li class="bordertopmenu"> </li>
                    {menuShowPermision("pgentryform") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() => props.history.push("pgentryform")}
                        >
                          PG Profile
                        </a>
                      </li>
                    )}

                    {menuShowPermision("regularbeneficiaryentry") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() =>
                            props.history.push("regularbeneficiaryentry")
                          }
                        >
                          Farmer Profile
                        </a>
                      </li>
                    )}

<li class="bordertopmenu"> </li>

                    {menuShowPermision("userrole") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() => props.history.push("userrole")}
                        >
                          User Role
                        </a>
                      </li>
                    )}

                    {menuShowPermision("userentry") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() => props.history.push("userentry")}
                        >
                          User Entry
                        </a>
                      </li>
                    )}

                    {menuShowPermision("roletomenupermissionentry") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() =>
                            props.history.push("roletomenupermissionentry")
                          }
                        >
                          Permission
                        </a>
                      </li>
                    )}

<li class="bordertopmenu"> </li>

                    {menuShowPermision("surveytitleentry") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() => props.history.push("surveytitleentry")}
                        >
                          Survey Title
                        </a>
                      </li>
                    )}

                    {menuShowPermision("upazilaentry") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() => props.history.push("upazilaentry")}
                        >
                          Upazila Entry
                        </a>
                      </li>
                    )}

                    {menuShowPermision("unionentry") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() => props.history.push("unionentry")}
                        >
                          Union Entry
                        </a>
                      </li>
                    )}
                  
                  <li class="bordertopmenu"> </li>

                    {menuShowPermision("trainingtitle") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() => props.history.push("trainingtitle")}
                        >
                          Training Title
                        </a>
                      </li>
                    )}
                    {menuShowPermision("venue") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() => props.history.push("venue")}
                        >
                          Venue
                        </a>
                      </li>
                    )}

                    {menuShowPermision("trainingadd") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() => props.history.push("trainingadd")}
                        >
                          Training
                        </a>
                      </li>
                    )}

                  

<li class="bordertopmenu"> </li>

                    {menuShowPermision("auditlog") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() => props.history.push("auditlog")}
                        >
                          Audit Log
                        </a>
                      </li>
                    )}

                    {menuShowPermision("errorlog") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() => props.history.push("errorlog")}
                        >
                          Error Log
                        </a>
                      </li>
                    )}

                    {menuShowPermision("settings") === 1 && (
                      <li>
                        <a
                          href="javascript:void(0)"
                          onClick={() => props.history.push("settings")}
                        >
                          Settings
                        </a>
                      </li>
                    )}
                  </ul>
                </li>
              )}
            </ul>
          </div>

          {/* <!-- ICON BAR --> */}
          <div class="menuIconBar">
            <a href="./farmersdatacollectionentry" title="Farmer Data Entry">
              <img
                src={require("assets/ico/farmersdatacollectionentry.png")}
                alt="Receive"
              />
            </a>

            <a href="./pgdatacollectionentry" title="PG Data Entry">
              <img
                src={require("assets/ico/pgdatacollectionentry.png")}
                alt="Customer"
              />
            </a>

            <a href="./lgddatacollectionentry" title="Community Data Entry">
              <img
                src={require("assets/ico/lgddatacollectionentry.png")}
                alt="Sales"
              />
            </a>

            {/*  <a href="./receive.html">
              <img src={require("assets/ico/return.png")} alt="Return" />
            </a>
            <a href="./receive.html">
              <img src={require("assets/ico/stock.png")} alt="Stock" />
            </a>
            <a href="./receive.html">
              <img src={require("assets/ico/payment.png")} alt="Payment" />
            </a>
            <a href="./receive.html">
              <img src={require("assets/ico/expense.png")} alt="Expense" />
            </a> */}
          </div>
        </div>

        {/* <!-- USER PANEL --> */}
        <div class="userPanel">
          <div>
            <label>{userInfo.ClientName}</label>
          </div>
          <div>
            <label>{userInfo.BranchName}</label>
          </div>

          <div class="user">
            {/* <img src="./img/user.jpg" alt=""/> */}
            <ul>
              <li class="dropdownMenu">
                {" "}
                {userInfo.UserName} &nabla;
                <ul class="dropdownList">
                  {/* <li>
                    <a href="#">User Profile</a>
                  </li>
                  <li>
                    <a href="#">Change Password</a>
                  </li> */}
                  {/* <li><a href="./index.html">Log Out</a></li> */}
                  <li>
                    <a
                      href="javascript:void(0)"
                      onClick={(e) => {
                        e.preventDefault();

                        // Remove cookies
                        Cookies.remove('Cookie_UnionId');
                        Cookies.remove('Cookie_DataCollectorName');
                        Cookies.remove('Cookie_DesignationId');
                        Cookies.remove('Cookie_PhoneNumber');
                        
                        sessionStorage.clear();
                        setTimeout(() => {
                          props.history.push("/login");
                        }, 1000);
                      }}
                    >
                      {"Logout"}
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
            <img
              /* src={require("assets/img/user/" + userInfo.PhotoUrl)} */
              src={baseUrl + "src/assets/img/user/" + userInfo.PhotoUrl}
              alt="User"
            />
          </div>
        </div>
      </nav>

      {/* {collapseOpen ? (
        <div
          id="bodyClick"
          onClick={() => {
            document.documentElement.classList.toggle("nav-open");
            setCollapseOpen(false);
          }}
        />
      ) : null} */}

      {/*============================*/}

      {/* <div id="sticky-header" className={"header-menu " + navbarColor}>
        <div className="container-fluid">
          <div className="row">

            <div className="col-lg-8">
              <div className="tp-mega-full">
                <div className="tp-menu align-self-center">
                  <nav className="desktop_menu">
                    <ul>

                      {menu.map((row, i) => {
                        return (
                          <li>
                            <a href="javascript:void(0)" onClick={() => props.history.push(row.url)} >
                              {DispensingLanguage[lan][menukey][row.title]}
                              {row.submenu.length > 0 ? (
                                <span class="tp-angle pull-right">
                                  <i class="fa fa-angle-down"></i>
                                </span>
                              ) : (
                                <></>
                              )}
                            </a>

                            {row.submenu.length > 0 ? (
                              <ul className={"submenu " + row.position}>
                                {row.submenu.map((row1, i1) => {
                                  return (
                                    <li>
                                      <a href="javascript:void(0)" onClick={() => props.history.push(row1.url) } >
                                        {DispensingLanguage[lan][menukey][row1.title]}
                                        {row1.submenu.length > 0 ? (<span class="tp-angle pull-right"><i class="fa fa-angle-right"></i></span>) : (<></>)}
                                      </a>

                                      {row1.submenu.length > 0 ? (
                                        <ul className={"submenu " + row1.position}>
                                          {row1.submenu.map((row2, i2) => {
                                            return (
                                              <li>
                                                <a href="javascript:void(0)" onClick={() => props.history.push(row2.url) } >
                                                  {DispensingLanguage[lan][menukey][row2.title]}
                                                </a>
                                              </li>
                                            );
                                          })}
                                        </ul>
                                      ) : (
                                        <></>
                                      )}
                                    </li>
                                  );
                                })}
                              </ul>
                            ) : (
                              <></>
                            )}
                          </li>
                        );
                      })}
                      

                      <li>
                        <a href="#">{ DispensingLanguage[lan][menukey]['Profile'] }
                          <span class="tp-angle pull-right">
                            <i class="fa fa-angle-down"></i>
                          </span>
                        </a>
                        <ul className="submenu left_position">

                          <li>
                              <Link href="javascript:void(0)" onClick={(e) => {
                              e.preventDefault();
                              props.history.push("/my-profile");
                              }}>{DispensingLanguage[lan][menukey]["My Profile"]}</Link>
                          </li>

                          <li>
                            <a
                              href="javascript:void(0)"
                              onClick={(e) => {
                                e.preventDefault();
                                sessionStorage.clear();
                                setTimeout(() => {props.history.push("/login");}, 1000);
                              }}
                            >
                                {DispensingLanguage[lan][menukey]['Logout']}
                            </a>
                          </li>
                        </ul>
                      </li>

                    </ul>




                  </nav>


                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div class="logo">
                <div className="logoFormate">
                    <div className="logo_item">
                      <a href="#">eDISP</a> 
                        <span class="sw_sub_title">
                        {" "}
                        {localStorage.getItem("FacilityName")}
                      </span>
                    </div>

                    <div className="imge_section">
                        <ImageList sx={{ width: 45, height: 50}} cols={1} rowHeight="auto" gap={2}>
                          {itemData.map((item) => (
                            <ImageListItem key={item.img}>
                              <img
                                src={`${item.img}?w=50&h=55&fit=crop&auto=format`}
                                alt={item.title}
                                loading="logo"
                              />
                            </ImageListItem>
                          ))}
                        </ImageList>
                    </div> 
                </div>
              </div>
              <button
                onClick={() => onMobileMenuOpen()}
                className="mobile_menu_bars_icon"
                type="button"
              >
                <i class="fas fa-bars"></i>
              </button>
            </div>

          </div>
        </div>
      </div> */}
    </>
  );
}

export default AfterLoginNavbar;
