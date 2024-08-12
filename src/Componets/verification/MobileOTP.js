import React, { useState, useEffect, useRef } from 'react';
import { Dialog } from '@mui/material';
import { auth } from '../../firebase/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import PhoneInput from "react-phone-input-2";
import OTPInput from "otp-input-react";
import { CgSpinner } from "react-icons/cg";
import { trackUserLogin } from '../../utils/trackUserLogin';

const MobileOTP = ({ open, onClose, onVerify, language }) => {
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [userId, setUserId] = useState(''); 
  const [ph, setPh] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [otp, setOtp] = useState("");
  
  // useRef to store the onVerify function to prevent unnecessary re-renders
  const onVerifyRef = useRef(onVerify);

  useEffect(() => {
    // Retrieve language and userId from localStorage after refresh
    const storedUserId = localStorage.getItem('userId');
    const storedLanguage = localStorage.getItem('language');
    
    if (storedUserId && storedLanguage) {
      console.log('User ID:', storedUserId);
      console.log('Language:', storedLanguage);
      onVerifyRef.current(storedLanguage);
    }
  }, []);

  useEffect(() => {
    if (showOTP) {
      // Ensure the element is rendered before setting up reCAPTCHA
      setTimeout(() => setupRecaptcha(), 500);
    }
  }, [showOTP]);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            console.log("reCAPTCHA solved");
          },
          "expired-callback": () => {
            console.log("reCAPTCHA expired");
          },
        }
      );
    }
  };

  const onSignup = () => {
    setLoading(true);
    setShowOTP(true);
    setupRecaptcha();

    const appVerifier = window.recaptchaVerifier;
    const phone = "+" + ph;
    
    signInWithPhoneNumber(auth, phone, appVerifier)
      .then((confirmationResult) => {
        setConfirmationResult(confirmationResult);
        console.log("SMS sent");
        setLoading(false);
        alert("Sent OTP to You😃");
        appVerifier.clear();
      })
      .catch((error) => {
        console.error("Error during sign-in", error);
      });
  };

  const verifyCode = async () => {
    setLoading1(true);
    try {
      if (confirmationResult) {
        const result = await confirmationResult.confirm(otp);
        const user = result.user;
        console.log("User signed in", user);
        alert("Login 🤗 Success");

        const currentUser = auth.currentUser;
        if (currentUser) {
          const userId = currentUser.uid;
          setUserId(userId);
          localStorage.setItem('userId', userId);
          localStorage.setItem('language', language);
          await trackUserLogin(userId);
          onVerify(language);
          setShowOTP(false);
          setPh('');
          resetRecaptcha(); // Clear reCAPTCHA after successful verification
          window.location.reload(); // Refresh the page
        }
      }
    } catch (error) {
      console.error("Error verifying code", error);
      // alert("Error verifying code. Please try again.");
    } finally {
      setLoading1(false);
    }
  };

  const resetRecaptcha = () => {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
      console.log("reCAPTCHA cleared");
    }
  };

  return (
    <Dialog open={open} onClose={() => {
        resetRecaptcha();
        onClose();
      }}>
      
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
            margin: "15px"
          }}
          inputStyle={{
            width: "100%",
            border: "2px solid gray",
          }}
        />

        <div className="mt-8 w-50 flex justify-center">
          <button
            onClick={onSignup}
            className="bg-blue-500 h-9 text-white font-bold py-2 px-4 w-50 m-5 rounded hover:bg-blue-600 flex justify-center items-center"
          >
            {loading && <CgSpinner size={20} className="mr-2 animate-spin" />}
            <span>Send code via SMS</span>
          </button>
        </div>

        {showOTP && (
          <>
            <div className="flex flex-col items-center w-full my-5">
              <label
                htmlFor="otp"
                className="font-bold text-xl text-gray-800 text-center mb-4"
              >
                Verify your phone number
              </label>
              <OTPInput
                value={otp}
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
                secure
              />
            </div>
            <div className="mt-8 w-50 flex justify-center">
              <button
                onClick={verifyCode}
                className="bg-blue-500 h-9 text-white font-bold py-2 px-4 w-50 rounded hover:bg-blue-600 flex justify-center items-center"
              >
                {loading1 && <CgSpinner size={20} className="mr-2 animate-spin" />}
                <span>Verify</span>
              </button>
            </div>
          </>
        )}
      </div>
    </Dialog>
  );
};

export default MobileOTP;
