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

import DataType from "views/screens/datatype/index.js";
import TrainingTitle from "views/screens/trainingtitle/index.js";
import Venue from "views/screens/venue/index.js";
import UserRole from "views/screens/userrole/index.js";
import RoleToMenuPermissionEntry from "views/screens/roletomenupermissionentry/index.js";

import PGDataCollectionEntry from "views/screens/datacollectionentry/index.js";
import FarmersDataCollectionEntry from "views/screens/datacollectionentry/indexfarmer.js";
import LGDDataCollectionEntry from "views/screens/datacollectionentry/indexlgd.js";
import HouseholdLivestockSurveyDataEntry from "views/screens/farmerdataentrynonpg/index.js";
import FarmerDataEntryNonPG from "views/screens/householdlivestocksurveydataentry/index.js";

import PGDataCollection from "views/screens/pgdatacollection/index.js";
import FarmersDataCollection from "views/screens/farmersdatacollection/index.js";
import DataFromLGD from "views/screens/datafromlgd/index.js";
import PgEntryForm from "views/screens/pgentryform/index.js";
import QuestionsEntry from "views/screens/questionsentry/index.js";
import RegularBeneficiaryEntry from "views/screens/regularbeneficiaryentry/index.js";
import UserEntry from "views/screens/userentry/index.js";
import DatatypeQuestionsMap from "views/screens/datatypequestionsmap/index.js";
import MembersByPg from "views/screens/membersbypg/index.js";
import GenderWisePGMembers from "views/screens/genderwisepgmembers/index.js";
import ValueChainWisePGDistribution from "views/screens/valuechainwisepgdistribution/index.js";
import ValueChainWisePGMemberDistribution from "views/screens/valuechainwisepgmemberdistribution/index.js";
import PGandPGmembersInformation from "views/screens/pgandpgmembersinformation/index.js";
import DashboardPage from "views/screens/DashboardPage";
import SurveyTitleEntry from "views/screens/surveytitleentry/index.js";
import UnionEntry from "views/screens/unionentry/index.js";
import TrainingAdd from "views/screens/trainingadd/index.js";

import AuditLot from "views/screens/auditlog/index.js";
import ErrorLog from "views/screens/errorlog/index.js";

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

          <Route path="/datatype" render={(props) => <DataType {...props} />} />
          <Route path="/trainingtitle" render={(props) => <TrainingTitle {...props} />} />
          <Route path="/venue" render={(props) => <Venue {...props} />} />
          <Route path="/userrole" render={(props) => <UserRole {...props} />} />
          <Route
            path="/roletomenupermissionentry"
            render={(props) => <RoleToMenuPermissionEntry {...props} />}
          />

          <Route
            path="/userentry"
            render={(props) => <UserEntry {...props} />}
          />
          <Route
            path="/datatypequestionsmap"
            render={(props) => <DatatypeQuestionsMap {...props} />}
          />

          <Route
            path="/pgdatacollection"
            render={(props) => <PGDataCollection {...props} />}
          />
          <Route
            path="/pgdatacollectionentry"
            render={(props) => <PGDataCollectionEntry {...props} />}
          />
          <Route
            path="/farmersdatacollectionentry"
            render={(props) => <FarmersDataCollectionEntry {...props} />}
          />
          <Route
            path="/lgddatacollectionentry"
            render={(props) => <LGDDataCollectionEntry {...props} />}
          />
          <Route
            path="/farmerdataentrynonpg"
            render={(props) => <FarmerDataEntryNonPG {...props} />}
          />
          <Route
            path="/householdlivestocksurveydataentry"
            render={(props) => <HouseholdLivestockSurveyDataEntry {...props} />}
          />

          <Route
            path="/farmersdatacollection"
            render={(props) => <FarmersDataCollection {...props} />}
          />
          <Route
            path="/datafromlgd"
            render={(props) => <DataFromLGD {...props} />}
          />
          <Route
            path="/pgentryform"
            render={(props) => <PgEntryForm {...props} />}
          />
          <Route
            path="/questionsentry"
            render={(props) => <QuestionsEntry {...props} />}
          />
          <Route
            path="/regularbeneficiaryentry"
            render={(props) => <RegularBeneficiaryEntry {...props} />}
          />
          <Route
            path="/membersbypg"
            render={(props) => <MembersByPg {...props} />}
          />
          <Route
            path="/genderwisepgmembers"
            render={(props) => <GenderWisePGMembers {...props} />}
          />
          <Route
            path="/valuechainwisepgdistribution"
            render={(props) => <ValueChainWisePGDistribution {...props} />}
          />
          <Route
            path="/valuechainwisepgmemberdistribution"
            render={(props) => (
              <ValueChainWisePGMemberDistribution {...props} />
            )}
          />
          <Route
            path="/pgandpgmembersinformation"
            render={(props) => <PGandPGmembersInformation {...props} />}
          />

          <Route
            path="/dashboard"
            render={(props) => <DashboardPage {...props} />}
          />

          <Route
            path="/surveytitleentry"
            render={(props) => <SurveyTitleEntry {...props} />}
          />
          <Route
            path="/unionentry"
            render={(props) => <UnionEntry {...props} />}
          />
          <Route
            path="/trainingadd"
            render={(props) => <TrainingAdd {...props} />}
          />
          <Route path="/auditlog" render={(props) => <AuditLot {...props} />} />

          <Route path="/errorlog" render={(props) => <ErrorLog {...props} />} />

          <Route path="/" render={(props) => <Index {...props} />} />
        </Switch>
      </Suspense>
    </BrowserRouter>
  </UserContextProvider>,
  document.getElementById("root")
);
