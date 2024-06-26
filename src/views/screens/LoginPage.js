import React, { useState, useContext } from "react";
import { Button } from "../../components/CustomControl/Button";
import BeforeLoginNavbar from "../../components/Navbars/BeforeLoginNavbar.js";
import DarkFooter from "../../components/Footers/DarkFooter.js";

// services & auth
import * as Service from "../../services/Service.js";

//Import Preloader
import LoadingSpinnerOpaque from "../../services/LoadingSpinnerOpaque";
import swal from "sweetalert";

// const regex =
//   /^[a-z0-9][a-z0-9-_\.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9])\.[a-z0-9]{2,10}(?:\.[a-z]{2,10})?$/;

function LoginPage(props) {
  // const userCtx = useContext(UserContext);
  let token = sessionStorage.getItem("token");

  if (token) {
    //if already login then redirect to home page
    props.history.push("/home");
  }

  const [state, setState] = React.useState({
    service: Service,
    email: "",
    password: "",
  });

  const [isLoading, setLoading] = useState(false);
  const [bFirst, setBFirst] = useState(true);
  const [isServerLoading, setIsServerLoading] = useState(false);

  React.useEffect(() => {
    document.body.classList.add("login-page");
    document.body.classList.add("sidebar-collapse");
    document.documentElement.classList.remove("nav-open");
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    return function cleanup() {
      document.body.classList.remove("login-page");
      document.body.classList.remove("sidebar-collapse");
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let data = { ...state };
    data[name] = value;
    // console.log("data: ", data);

    setState(data);
  };



  const LoginPage = (data) => {
    if (state.email.length > 0 && state.password.length > 0) {


      setLoading(true);
      setIsServerLoading(true);

      const body = {
        email: state.email,
        password: state.password,
      };

      state.service.default
        .postApi("source/login.php", body)
        .then((res) => {
            setIsServerLoading(false);
          if (res.success == 1) {
            sessionStorage.setItem("token", res.token);
            sessionStorage.setItem("User_info", JSON.stringify(res.user_data));

            const auth_token = sessionStorage.getItem("token")
              ? sessionStorage.getItem("token")
              : null;

            let options = {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${auth_token}`,
              },
            };

            setLoading(false);
          
            window.location.href = res.user_data.DefaultRedirect;
            // window.location.href = process.env.REACT_APP_BASE_NAME + `/check-permission`;
          } else if (res.success == 0) {
            setLoading(false);
            swal("Error!", `${res.message}`, "error");
          }
        })
        .catch((err) => {
          setLoading(false);
          swal("Error!", `${err}`, "error");
        });
      //}
    } else {
      swal("Oops Error!", "Please fill all required fields", "error");
    }
  };
 

  if (bFirst) {
    /**First time call for datalist */
    setBFirst(false);
  }

  const [passwordShown, setPasswordShown] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  return (
    <>
      {isLoading && <LoadingSpinnerOpaque />}

      <BeforeLoginNavbar {...props} />

      <div class="LoginBody">
        <div class="loginContainer">
          <div class="loginHeader">
            <h3>User Login</h3>
          </div>
          {/* <div class="userLogin">

            <label>User Name</label>
            <input
              type="text"
              id="email"
              name="email"
              onChange={(e) => handleChange(e)}
            />
            <label>Password</label>
            <input
              //type="password"
              type={passwordShown ? "text" : "password"}
              id="password"
              name="password"
              onChange={(e) => handleChange(e)}
            />

            <i
              onClick={togglePasswordVisiblity}
              //className="fa fa-eye"
              className={`fa ${passwordShown ? 'fa-eye-slash' : 'fa-eye'}`}
              aria-hidden="true"
              style={{ cursor: 'pointer' }}
            ></i>
          </div> */}


            <div className="userLogin">
              <label>Login User Name</label>
                <input 
                  type="text" 
                  id="email" 
                  name="email"
                  onChange={(e) => handleChange(e)} 
                />
                
              <label>Password</label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type={passwordShown ? 'text' : 'password'}
                  id="password"
                  name="password"
                  onChange={(e) => handleChange(e)}
                  
                />
                
                <i
                  onClick={togglePasswordVisibility}
                  className={`fa ${passwordShown ? 'fa-eye-slash' : 'fa-eye'}`}
                  aria-hidden="true"
                  
                ></i>
              </div>

            </div>

              <div class={"btnLoginDiv"} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Button disabled = {isServerLoading} label={"Login"} class={"btnLogin"} onClick={LoginPage} style={{ marginTop: '0px', marginBottom: '5px' }} />
               </div>

            
          

         {/* <span>
            * If you forget your password, contact your with Administrator
          </span> */}
        </div>
      </div>

      <DarkFooter {...props} />
 
    </>
  );
}

export default LoginPage;
