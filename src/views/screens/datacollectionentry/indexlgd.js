import React from "react";
// import { makeStyles } from "@material-ui/core/styles";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import AfterLoginNavbar from "components/Navbars/AfterLoginNavbar";
import Notification from "../../../services/Notification"; 
import {checkLogin, checkUserPermission} from "../../../services/CheckUserAccess";
import DarkFooter from "../../../components/Footers/DarkFooter.js";
import PGDataCollectionEntry from "./PGDataCollectionEntry";
import "../../../assets/css/pgdatacollection.css";

// receive.css
const Index = (props) => {
  const { path } = useRouteMatch();
  const menukey = "pgdatacollection"; // this is in t_menu table

  const [RedirectLogin, setRedirectLogin] = React.useState(true);
  const [hasUserPermission, setHasUserPermission] = React.useState(false);

  if(RedirectLogin){
    setHasUserPermission(checkUserPermission(menukey));// To check user has permission in this page
    checkLogin();
    setRedirectLogin(false);
  }

  // React.useEffect(() => {
  // }, []);

  const [msgObj, setMsgObj] = React.useState({
    isOpen: false,
  });

  const openNoticeModal = (obj) => {
    setMsgObj(obj);
  };

  const closeNoticeModal = (event, reason) => { 
      if (reason === 'clickaway') {
        return;
      } 
    setMsgObj({ isOpen: false });
  };

  return (
    hasUserPermission && (
    <div>
      <AfterLoginNavbar {...props} />

      <div >

        <Switch>
          <Route
            path={`${path}/`}
            render={(props) => (
              <PGDataCollectionEntry {...props} openNoticeModal={openNoticeModal} DataTypeId={3} />
            )}
          ></Route>
        </Switch>
        <Notification
          closeNoticeModal={closeNoticeModal}
          msgObj={msgObj}
          {...props}
        ></Notification>

      </div>
      <DarkFooter  {...props}  />

    </div>)
  );
};

export default Index;