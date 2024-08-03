// src/components/MobileOTP.js
import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, CircularProgress } from '@mui/material';
import { auth } from '../../firebase/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import PhoneInput from "react-phone-input-2";
import OTPInput from "otp-input-react";
import { CgSpinner } from "react-icons/cg";
import { trackUserLogin, getDeviceDetails } from '../../utils/trackUserLogin';
const MobileOTP = ({ open, onClose, onVerify, language }) => {
  // const [isFrench, setisFrench] = useState(true);
  const [loading, setloading] = useState(false);
  const [loading1,setloading1]=useState(false);
  const [userId, setUserId] = useState(''); 
  const [ph, setPh] = useState("");
  const [ShowOTP, setShowOTP] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [otp, setOtp] = useState("");
  useEffect(() => {
    if (ShowOTP) {
      setupRecaptcha();
    }
  }, [ShowOTP]);

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
  const verifyCode = async () => {
    setLoading1(true); // Ensure this is a valid state updater
    try {
      if (confirmationResult) {
        const result = await confirmationResult.confirm(otp);
        // User signed in successfully.
        const user = result.user;
        console.log("User signed in", user);
        alert("Login 🤗 Success");
  
        const currentUser = auth.currentUser;
        if (currentUser) {
          const userId = currentUser.uid; // Get the UID of the current user
          setUserId(userId);
  
          // Track user login with the current user's ID and device details
          await trackUserLogin(userId);
  
          // Additional operations after successful login
          onVerify(language);
          setShowOTP(false);
          setPh('');
        }
      }
    } catch (error) {
      console.error("Error verifying code", error);
      alert("Error verifying code. Please try again.");
    } finally {
      setLoading1(false); // Ensure loading state is reset in both success and error scenarios
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      
      <div className="flex flex-col items-center w-full">
                        <label className="font-bold text-xl text-gray-800 text-center m-4">
                          Verify your phone number
                        </label>

                        <PhoneInput
                          country={"in"}
                          value={ph}
                          onChange={setPh}
                          containerStyle={{
                            width: "80%",
                            marginLeft: "10%",
                            overflow: "hidden visible",
                            margin:"15px"
                          }}
                          inputStyle={{
                            width: "100%",
                            border: "2px solid gray",
                          }}
                        />
                        <div>{}</div>
                        <div className="mt-8 w-50 flex justify-center">
                          
                          <button
                            onClick={onSignup}
                            className="bg-blue-500 h-9 text-white font-bold py-2 px-4 w-50 m-5 rounded hover:bg-blue-600 flex justify-center items-center"
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
                             onClick={() => {
                              verifyCode();
                             
                            }}
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
    </Dialog>
  )
}
export default MobileOTP;
