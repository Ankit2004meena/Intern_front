import React, { useState } from "react";
import logo from "../../Assets/logo.png";
import { Link } from "react-router-dom";
import "./navbar.css";
import Sidebar from "./Sidebar";
import OTPInput from "otp-input-react";
import { CgSpinner } from "react-icons/cg";
import {
  signInWithPhoneNumber,
  signInWithPopup,
  signOut,
  RecaptchaVerifier,
} from "firebase/auth";
import { auth, provider } from "../../firebase/firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../../Feature/Userslice";
import { useNavigate } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import emailjs from '@emailjs/browser';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useTranslation } from 'react-i18next' ;
import { trackUserLogin, getDeviceDetails } from '../../utils/trackUserLogin';

function Navbar() {
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const [isDivVisibleForintern, setDivVisibleForintern] = useState(false);
  const [isDivVisibleForJob, setDivVisibleFroJob] = useState(false);
  const [isDivVisibleForlogin, setDivVisibleFrologin] = useState(false);
  const [isDivVisibleForProfile, setDivVisibleProfile] = useState(false);
  const [isStudent, setStudent] = useState(true);
  //currently setting to true
  const [isFrench, setisFrench] = useState(true);
  const [loading, setloading] = useState(false);
  const [loading1,setloading1]=useState(false);
  const [ph, setPh] = useState("");
  const [ShowOTP, setShowOTP] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState('');
  const [eotp, seteotp] = useState('');
  const [generatedeOtp, setGeneratedeotp] = useState('');
  const [iseOtpSent, setIseOtpSent] = useState(false);
  const { t } = useTranslation();
  const [userId, setUserId] = useState(''); 
  const [pass,setPass]=useState('');
  //direct google authentication
  // const currentUser = auth.currentUser;
  // const userId = currentUser.uid; // Get the UID of the current user
  const loginFunction = () => {
    signInWithPopup(auth, provider)
      .then((res) => {
        const currentUser = auth.currentUser; // Get the current user after sign-in
        if (currentUser) {
          const userId = currentUser.uid; // Get the UID of the current user
          setUserId(userId);
          console.log('UserID:', userId);
          console.log('Device Details:', getDeviceDetails());
          // Track user login with the current user's ID and device details
          trackUserLogin(userId, getDeviceDetails());

          setDivVisibleFrologin(false); // Update visibility state
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };



  //using mobile authentication
  const setupRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          console.log("reCAPTCHA solved");
        },
        "expired-callback": () => {
          // Response expired. Ask user to solve reCAPTCHA again.
          console.log("reCAPTCHA expired");
        },
      }
    );
  };
  const onSignup = () => {
    setloading(true);
    setShowOTP(true);
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;
    const phone = "+" + ph;
    console.log(phone);
    signInWithPhoneNumber(auth, phone, appVerifier)
      .then((confirmationResult) => {
        // SMS sent. Prompt user to type the code from the message.
        setConfirmationResult(confirmationResult);
        console.log("SMS sent");
        setloading(false);
        alert("Sent OTP to You😃");
      })
      .catch((error) => {
        // Error; SMS not sent
        console.error("Error during sign-in", error);
      });
  };
  const verifyCode = () => {
    setloading1(true);
    if (confirmationResult) {
      confirmationResult
        .confirm(otp)
        .then((result) => {
          // User signed in successfully.
          const user = result.user;
          console.log("User signed in", user);
          setloading1(false);
          setDivVisibleFrologin(false)
          alert("Login 🤗 Success")
          setShowOTP(false);
          setPh('');
        })
        .catch((error) => {
          // User couldn't sign in (bad verification code?)
          console.error("Error verifying code", error);
        });
    }
  };

  
//using email authentication
  const sendOTPEmail = async (email, eotp) => {
    const serviceID = 'service_gkc14qf';
    const templateID = 'template_aihm098';
    
  
    const templateParams = {
      email,
      eotp,
    };
  
    try {
      await emailjs.send(serviceID, templateID, templateParams, {
        publicKey: 'mBkuO9TzFBjPP3IG8',
      })
    } catch (error) {
      console.error('Failed to send OTP email:', error);
    }
  };
  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  };
  const handleSendOtp = async () => {
    const eotp = generateOtp();
    setGeneratedeotp(eotp);
    await sendOTPEmail(email, eotp);
    setIseOtpSent(true);
  };
  const handleVerifyOtp = async () => {
    if (eotp === generatedeOtp) {
      try {
        await signInWithEmailAndPassword(auth, email,pass);
        const currentUser = auth.currentUser; // Get the current user after sign-in
        if (currentUser) {
          const userId = currentUser.uid; // Get the UID of the current user
          setUserId(userId);
          console.log('UserID:', userId);
          console.log('Device Details:', getDeviceDetails());
          // Track user login with the current user's ID and device details
          trackUserLogin(userId, getDeviceDetails());

          setDivVisibleFrologin(false); // Update visibility state
        }
      } catch (error) {
        if (error.code === 'auth/user-not-found') {
          await createUserWithEmailAndPassword(auth, email,pass);
          const currentUser = auth.currentUser; // Get the current user after sign-in
          if (currentUser) {
            const userId = currentUser.uid; // Get the UID of the current user
            setUserId(userId);
            console.log('UserID:', userId);
            console.log('Device Details:', getDeviceDetails());
            // Track user login with the current user's ID and device details
            trackUserLogin(userId, getDeviceDetails());
  
            setDivVisibleFrologin(false); // Update visibility state
          }
        }
      }
      alert('OTP verified successfully!');
      setDivVisibleFrologin(false);
      setIseOtpSent(false);
      setEmail('');
      setPass('');
    } else {
      alert('Invalid OTP. Please try again.');
    }
  };

const backgroundImage = t('Navbar.background-image1');
const backgroundImage2=t('Navbar.background-image2');
const sectionStyle = {
  backgroundImage: backgroundImage,
  backgroundSize: 'cover', // You can adjust this depending on your needs
  backgroundPosition: 'center',
};
const sectionStyle2 = {
  backgroundImage: backgroundImage2,
  
};
  const showLogin = () => {
    setDivVisibleFrologin(true);
  };
  const closeLogin = () => {
    setDivVisibleFrologin(false);
  };
  const setTrueForStudent = () => {
    setStudent(false);
  };
  const setFalseForStudent = () => {
    setStudent(true);
  };
  //  for showing profile dropdown
  const showtheProfile = () => {
    setDivVisibleProfile(true);
    document.getElementById("ico3").className = "bi bi-caret-up-fill";
  };
  const hidetheProfile = () => {
    document.getElementById("ico3").className = "bi bi-caret-down-fill";
    setDivVisibleProfile(false);
  };

  const showInternShips = () => {
    document.getElementById("ico").className = "bi bi-caret-up-fill";
    setDivVisibleForintern(true);
  };
  const hideInternShips = () => {
    document.getElementById("ico").className = "bi bi-caret-down-fill";
    setDivVisibleForintern(false);
  };
  const showJobs = () => {
    document.getElementById("ico2").className = "bi bi-caret-up-fill";
    setDivVisibleFroJob(true);
  };
  const hideJobs = () => {
    document.getElementById("ico2").className = "bi bi-caret-down-fill";
    setDivVisibleFroJob(false);
  };

  const logoutFunction = () => {
    signOut(auth);
    navigate("/");
  };
 

  return (
    <div>
      <div id="recaptcha-container"></div>

      <nav className="nav1" style={sectionStyle2}>
        <ul>
          <div className="img">
            <Link to={"/"}>
              <img src={logo} alt="" srcset="" />
            </Link>
          </div>
          <div className="elem">
            <Link to={"/Internship"}>
              {" "}
              <p id="int" className="" onMouseEnter={showInternShips}>
              {t('Navbar.internships')}{" "}
                <i
                  onMouseLeave={hideInternShips}
                  id="ico"
                  class="bi bi-caret-down-fill"
                ></i>
              </p>
            </Link>
            <Link to={"/Jobs"}>
              {" "}
              <p onMouseEnter={showJobs}>
                {t('Navbar.jobs')}{" "}
                <i
                  class="bi bi-caret-down-fill"
                  id="ico2"
                  onMouseLeave={hideJobs}
                ></i>
              </p>
            </Link>
          </div>
          <div className="search" >
            <i class="bi bi-search"></i>
            <input type="text" placeholder={t('Navbar.searchPlaceholder')} style={sectionStyle2}/>
          </div>
          {user ? (
            <>
              <div className="Profile">
                <Link to={"/profile"}>
                  <img
                    src={user.photo}
                    alt=""
                    onMouseEnter={showtheProfile}
                    className="rounded-full w-12"
                    id="picpro"
                  />
                  <i
                    className="bi bi-caret-up-fill"
                    id="ico3"
                    onMouseLeave={hidetheProfile}
                  ></i>
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="auth">
                <button className="btn1" onClick={showLogin}>
                  {"  "}{t('Navbar.login')}{"  "}
                </button>

                <button className="btn2">
                  <Link to="/register"> {t('Navbar.signup')}</Link>
                </button>
              </div>
            </>
          )}
          {user ? (
            <><div className="auth1">
              <button className="bt-log" id="bt" >
              <Link to="/loginHistory">{t('Navbar.LoginHistory')}</Link>
              </button>
              <button className="bt-log" id="bto" onClick={logoutFunction}>
                 {t('Navbar.logout')} <i class="bi bi-box-arrow-right"></i>
              </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex mt-7 hire">{t('Navbar.hire_talent')}</div>

              <div className="admin">
                <Link to={"/adminLogin"}>
                  <button> {t('Navbar.admin')}</button>{" "}
                </Link>
              </div>
            </>
          )}
        </ul>
      </nav>
      {isDivVisibleForintern && (
        <div className="profile-dropdown-2" style={sectionStyle}>
          <div className="left-section">
            <p>{t('Navbar.profileDropdown.topLocations')}</p>
            <p>{t('Navbar.profileDropdown.profile')}</p>
            <p>{t('Navbar.profileDropdown.topCategory')}</p>
            <p>{t('Navbar.profileDropdown.exploreMoreInternships')}</p>
          </div>
          <div className="line flex bg-slate-400"></div>
          <div className="right-section">
            <p>{t('Navbar.profileDropdown.internAtIndia')}</p>
            <p>{t('Navbar.profileDropdown.internAtIndia')}</p>
            <p>{t('Navbar.profileDropdown.internAtIndia')}</p>
            <p>{t('Navbar.profileDropdown.internAtIndia')}</p>
            <p>{t('Navbar.profileDropdown.internAtIndia')}</p>
          </div>
        </div>
      )}
      {isDivVisibleForJob && (
        <div className="profile-dropdown-1" style={sectionStyle}>
          <div className="left-section">
            <p>{t('Navbar.profileDropdown.topLocations')}</p>
            <p>{t('Navbar.profileDropdown.profile')}</p>
            <p>{t('Navbar.profileDropdown.topCategory')}</p>
            <p>{t('Navbar.profileDropdown.exploreMoreInternships')}</p>
          </div>
          <div className="line flex bg-slate-400"></div>
          <div className="right-section">
            <p>{t('Navbar.profileDropdown.internAtIndia')}</p>
            <p>{t('Navbar.profileDropdown.internAtIndia')}</p>
            <p>{t('Navbar.profileDropdown.internAtIndia')}</p>
            <p>{t('Navbar.profileDropdown.internAtIndia')}</p>
            <p>{t('Navbar.profileDropdown.internAtIndia')}</p>
          </div>
        </div>
      )}
      <div >
     
      </div>
      <div className="login">
        {isDivVisibleForlogin && (
          <>
            <button id="cross" onClick={closeLogin}>
              <i class="bi bi-x"></i>
            </button>
            <h5 id="state" className="mb-4 justify-center text-center">
              <span
                id="Sign-in"
                style={{ cursor: "pointer" }}
                className={`auth-tab ${isStudent ? "active" : ""}`}
                onClick={setFalseForStudent}
              >
                Student
              </span>
              &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
              <span
                id="join-in"
                style={{ cursor: "pointer" }}
                className={`auth-tab ${isStudent ? "active" : ""}`}
                onClick={setTrueForStudent}
              >
                Employee andT&P
              </span>
            </h5>

            {isStudent ? (
              <>
                <div className="flex-col bg-white  rounded-lg justify-center overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
                  {isFrench && (
                    <>
                      <div className="flex flex-col items-center w-full">
                        <label className="font-bold text-xl text-gray-800 text-center mb-4">
                          Verify your phone number
                        </label>

                        <PhoneInput
                          country={"in"}
                          value={ph}
                          onChange={setPh}
                          containerStyle={{
                            width: "65%",
                            marginLeft: "10%",
                            overflow: "hidden visible",
                          }}
                          inputStyle={{
                            width: "80%",
                            border: "2px solid gray",
                          }}
                        />
                        <div>{}</div>
                        <div className="mt-8 w-50 flex justify-center">
                          
                          <button
                            onClick={onSignup}
                            className="bg-blue-500 h-9 text-white font-bold py-2 px-4 w-50 rounded hover:bg-blue-600 flex justify-center items-center"
                          >
                            {loading && (
                              <>
                                <CgSpinner
                                  size={20}
                                  className="mr-2 animate-spin"
                                />
                              </>
                            )}
                            <span>Send code via SMS</span>
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                  {ShowOTP && (
                    <>
                      <div className="flex flex-col items-center w-full my-5">
                        <label
                          htmlfor="otp"
                          className="font-bold text-xl text-gray-800 text-center mb-4"
                        >
                          Verify your phone number
                        </label>
                        <OTPInput value={otp} 
                        onChange={setOtp} 
                        autoFocus 
                        OTPLength={6} 
                        otpType="number" 
                        disabled={false} 
                        inputStyles={{
                          width: '3rem',
                          height: '3rem',
                          margin: '0 0.5rem',
                          fontSize: '1.5rem',
                          borderRadius: '4px',
                          border: '2px solid black',
                          backgroundColor: 'lightgray',
                          color: 'black',
                          textAlign: 'center'
                      }}
                        secure />
                      </div>
                      <div className="mt-8 w-50 flex justify-center">
                          
                          <button
                            onClick={verifyCode}
                            className="bg-blue-500 h-9 text-white font-bold py-2 px-4 w-50 rounded hover:bg-blue-600 flex justify-center items-center"
                          >
                            {loading1 && (
                              <>
                                <CgSpinner
                                  size={20}
                                  className="mr-2 animate-spin"
                                />
                              </>
                            )}
                            <span>Verify</span>
                          </button>
                        </div>
                    </>
                  )}
                </div>
                {/* commenting google part */}
                <div className="py-2">


                    <div className="flex bg-white rounded-lg justify-center overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
<div className="w-full p-8 lg:w-1/2">
<p onClick={loginFunction} className='flex
 items-center h-9 justify-center mt-4 px-0  text-white bg-slate-100 rounded-lg hover:bg-gray-100' >
    <div className="px-4 py-4">
    <svg class="h-6 w-6" viewBox="0 0 40 40">
                         <path d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z" fill="#FFC107"/>
                         <path d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z" fill="#FF3D00"/>
                         <path d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z" fill="#4CAF50"/>
                         <path d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z" fill="#1976D2"/>
                     </svg>
    </div>
    <h4 className='text-gray-700'>Login With Google 
    </h4>
 </p>
 <div className="mt-4 flex items-center justify-between">
<span className='border-b- w-1/5 lg:w-1/4'></span>
<p className='text-gray-500 text sm font-bold mb-2'> or</p>
<span className='border-b- w-1/5 lg:w-1/4'></span>

 </div>
 <div class="mt-4">
                      <label class="block text-gray-700 text-sm font-bold mb-2">
                        Email{" "}
                      </label>
                      <input
                        class=" text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                        type="email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        placeholder="Hire-me@gmail.com"
                      />
                    </div>
                    <div class="mt-4">
                      <div class="flex justify-between">
                        <label class="block text-gray-700 text-sm font-bold mb-2">
                          Password
                        </label>
                      </div>
                      <input
                        class=" text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                        placeholder="Must be atleast 6 characters"
                        type="password"
                        value={pass}
                        onChange={(e)=>setPass(e.target.value)}
                      />
                    </div>
                    {/* <div className="mt-8">
                      <button className="btn3  bg-blue-500 h-9 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600 ">
                        {t('login')}
                      </button>
                    </div> */}
                <button className="btn3  my-2 bg-blue-500 h-9 text-white font-bold py-2  w-full rounded hover:bg-blue-600"
                  onClick={handleSendOtp}
                  disabled={iseOtpSent}
                >
                  {iseOtpSent ? "OTP Sent" : "Send OTP"}
                </button>
                {iseOtpSent && (
                  <>
                    <input
                      type="text"
                      value={eotp}
                      onChange={(e) => seteotp(e.target.value)}
                      placeholder="Enter OTP"
                    />
                    <button className="btn3 my-2 bg-blue-500 h-9 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600"
                      onClick={handleVerifyOtp}
                    >
                      Verify OTP
                    </button>
                    </>
            )}
             <div className="mt-4 flex items-center justify-between">
<p className='text-sm'>new to internarea? Register(<span className='text-blue-500 cursor-pointer' onClick={closeLogin}>Student</span>/<span className='text-blue-500 cursor-pointer' onClick={closeLogin}>company</span>) </p>
             </div>
</div>
                    </div>
                </div>
                
              </>
            ) : (
              <>
                <div className="flex bg-white rounded-lg justify-center overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
                  <div className="w-full p-8 lg:w-1/2">
                    <div class="mt-4">
                      <label class="block text-gray-700 text-sm font-bold mb-2">
                        Email{" "}
                      </label>
                      <input
                        class=" text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                        type="email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        placeholder="Hire-me@gmail.com"
                      />
                    </div>
                    <div class="mt-4">
                      <div class="flex justify-between">
                        <label class="block text-gray-700 text-sm font-bold mb-2">
                          Password
                        </label>
                      </div>
                      <input
                        class=" text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                        placeholder="Must be atleast 6 characters"
                        type="password"
                        value={pass}
                        onChange={(e)=>setPass(e.target.value)}
                      />
                    </div>
                    {/* <div className="mt-8">
                      <button className="btn3  bg-blue-500 h-9 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600 ">
                        {t('login')}
                      </button>
                    </div> */}
                <button className="btn3  bg-blue-500 h-9 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600"
                  onClick={handleSendOtp}
                  disabled={iseOtpSent}
                >
                  {iseOtpSent ? "OTP Sent" : "Send OTP"}
                </button>
                {iseOtpSent && (
                  <>
                    <input
                      type="text"
                      value={eotp}
                      onChange={(e) => seteotp(e.target.value)}
                      placeholder="Enter OTP"
                    />
                    <button className="btn3  bg-blue-500 h-9 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600"
                      onClick={handleVerifyOtp}
                    >
                      Verify OTP
                    </button>
                    </>
            )}
                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-sm">
                        new to internarea? Register(
                        <span
                          className="text-blue-500 cursor-pointer"
                          onClick={closeLogin}
                        >
                          Student
                        </span>
                        /
                        <span
                          className="text-blue-500 cursor-pointer"
                          onClick={closeLogin}
                        >
                          company
                        </span>
                        ){" "}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
        {isDivVisibleForProfile && (
          <div className="profile-dropdown h-5 rounded-sm shadow-sm">
            <p className="font-bold">{user?.name}</p>
            <p className="font-medium">{user?.email}</p>
            {/* <span class="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-blue-600">View Applciations</span> */}
          </div>
        )}
      </div>
      <Sidebar />
    </div>
  );
}
export default Navbar;
