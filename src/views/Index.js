import React, { useState } from "react";

// Auth token & services
import * as Service from "../services/Service.js";

// core components
import BeforeLoginNavbar from "components/Navbars/BeforeLoginNavbar.js";
import AfterLoginNavbar from "components/Navbars/AfterLoginNavbar.js";
import IndexHeader from "components/Headers/IndexHeader.js";
import DarkFooter from "components/Footers/DarkFooter.js";
import HomePage from "./screens/HomePage";
import packageJson from "../../package.json";
import swal from "sweetalert";

function Index(props) {
  React.useEffect(() => {
    document.body.classList.add("index-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    return function cleanup() {
      document.body.classList.remove("index-page");
      document.body.classList.remove("sidebar-collapse");
    };
  });


  

const clearCacheData = () => {
  caches.keys().then((names) => {
      names.forEach((name) => {
          caches.delete(name);
      });
  });
   
  setTimeout(function(){
    window.location.reload();
 }, 1000);


};


if(localStorage.getItem("sw_Version")==null){
 
  swal({
    title: "",
    text:   'A new version of the application is available, Version-'+packageJson.version,
    icon: "warning",
    button: 'Refresh',
    showCancelButton: false,
    showConfirmButton: false
    }).then((willDelete) => {
    if (willDelete) { 
      localStorage.setItem(
        "sw_Version",
        packageJson.version
      );
      window.location.href = `${process.env.REACT_APP_BASE_NAME}`;
      clearCacheData(); 
      
    }
  });



 }else if(localStorage.getItem("sw_Version")<packageJson.version){

  

  swal({
    title: "",
    text:  'A new version of the application is available, press Refresh to update from ['+localStorage.getItem("sw_Version")+'] to ['+packageJson.version+']',
    icon: "warning",
    button: 'Refresh',
    showCancelButton: false,
    showConfirmButton: false
    }).then((willDelete) => {
    if (willDelete) { 
      localStorage.setItem(
        "sw_Version",
        packageJson.version
      );
      window.location.href = `${process.env.REACT_APP_BASE_NAME}`;
      clearCacheData(); 
    }
  });

 }


  return (
    <>
    {/* <div className="backgroundImg" style={{
            backgroundImage: "url(" + require("assets/img/background_img.jpg") + ")",
          }}> */}

   
        {Service.default.authToken() != null ? (
          <AfterLoginNavbar {...props} />
        ) : (
          <BeforeLoginNavbar {...props} />
        )}
        <div className="wrapper" >
          <IndexHeader {...props} />
          <div className="main">
            <HomePage {...props}  />
          </div>
          <DarkFooter  {...props}  />
        </div>
     {/*  </div> */}
    </>
  );
}

export default Index;
