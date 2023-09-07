import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "assets/css/main.css";
import "assets/css/modal.css";
import "assets/css/header.css";

import "assets/js/include.js";
import "assets/js/modal.js";

// pages for this kit
import Index from "views/Index.js";
import LoginPage from "views/screens/LoginPage.js";
import CheckPermission from "views/screens/CheckPermission.js";

import UserRole from "views/screens/userrole/index.js";
import DataType from "views/screens/datatype/index.js";
import PGDataCollection from "views/screens/pgdatacollection/index.js";
import PGDataCollectionEntry from "views/screens/pgdatacollectionentry/index.js";
import FarmersDataCollection from "views/screens/farmersdatacollection/index.js";

import UserContextProvider from "./context/user-info-context";

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

let userInfo = null;

userInfo = {
  FacilityId: 0,
  FacilityName: "NA",
  LangId: "en_GB",
};

ReactDOM.render(
  <UserContextProvider userInfo={userInfo}>
    <BrowserRouter basename={process.env.REACT_APP_BASE_NAME}>
      <Suspense>
        <Switch>
          <Route path="/home" render={(props) => <Index {...props} />} />
          <Route path="/login" render={(props) => <LoginPage {...props} />} />
          <Route
            path="/check-permission"
            render={(props) => <CheckPermission {...props} />}
          />
          <Route path="/userrole" render={(props) => <UserRole {...props} />} />

          <Route path="/datatype" render={(props) => <DataType {...props} />} />
          <Route
            path="/pgdatacollection"
            render={(props) => <PGDataCollection {...props} />}
          />
          <Route
            path="/pgdatacollectionentry"
            render={(props) => <PGDataCollectionEntry {...props} />}
          />

          <Route
            path="/farmersdatacollection"
            render={(props) => <FarmersDataCollection {...props} />}
          />

          <Route path="/" render={(props) => <Index {...props} />} />
        </Switch>
      </Suspense>
    </BrowserRouter>
  </UserContextProvider>,
  document.getElementById("root")
);
