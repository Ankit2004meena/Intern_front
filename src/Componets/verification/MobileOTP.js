import React, { useState, useEffect, useCallback } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, CircularProgress } from '@mui/material';
import { auth } from '../../firebase/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import PhoneInput from "react-phone-input-2";
import OTPInput from "otp-input-react";
import { CgSpinner } from "react-icons/cg";
import { trackUserLogin } from '../../utils/trackUserLogin';

const MobileOTP = ({ open, onClose, onVerify, language }) => {
  const [loading, setloading] = useState(false);
  const [loading1, setloading1] = useState(false);
  const [userId, setUserId] = useState(''); 
  const [ph, setPh] = useState("");
  const [ShowOTP, setShowOTP] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [otp, setOtp] = useState("");

  const memoizedOnVerify = useCallback(onVerify, []);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedLanguage = localStorage.getItem('language');
    
    if (storedUserId && storedLanguage) {
      console.log('User ID:', storedUserId);
      console.log('Language:', storedLanguage);
      memoizedOnVerify(storedLanguage);
    }
  }, [memoizedOnVerify]);

  useEffect(() => {
    if (ShowOTP) {
      setupRecaptcha();
    }
  }, [ShowOTP]);

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth,'recaptcha-container', {
        size: 'invisible',
        callback: (response) => {
          console.log('reCAPTCHA solved');
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired');
          resetRecaptcha();
        },
      });
    }
  };

  const resetRecaptcha = () => {
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
      console.log('reCAPTCHA cleared');
    }
  };

  const onSignup = () => {
    setloading(true);
    setupRecaptcha();

    const appVerifier = window.recaptchaVerifier;
    const phone = "+" + ph;

    signInWithPhoneNumber(auth, phone, appVerifier)
      .then((confirmationResult) => {
        setConfirmationResult(confirmationResult);
        console.log("SMS sent");
        setShowOTP(true);
        setloading(false);
      })
      .catch((error) => {
        console.error("Error during sign-in", error);
        setloading(false);
        resetRecaptcha(); // Reset recaptcha if there is an error
      });
  };

  const verifyCode = async () => {
    setloading1(true);
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
          await trackUserLogin(userId);
          localStorage.setItem('userId', userId);
          localStorage.setItem('language', language);
          memoizedOnVerify(language);
          setShowOTP(false);
          setPh('');
          resetRecaptcha();
          window.location.reload(); // Refresh to reset CAPTCHA
        }
      }
    } catch (error) {
      console.error("Error verifying code", error);
      alert("Error verifying code. Please try again.");
    } finally {
      setloading1(false);
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
        <div>{}</div>
        <div className="mt-8 w-50 flex justify-center">
          <button
            onClick={onSignup}
            className="bg-blue-500 h-9 text-white font-bold py-2 px-4 w-50 m-5 rounded hover:bg-blue-600 flex justify-center items-center"
          >
            {loading && (
              <CgSpinner size={20} className="mr-2 animate-spin" />
            )}
            <span>Send code via SMS</span>
          </button>
        </div>
      </div>
      {ShowOTP && (
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
              {loading1 && (
                <CgSpinner size={20} className="mr-2 animate-spin" />
              )}
              <span>Verify</span>
            </button>
          </div>
        </>
      )}
      <div id="recaptcha-container"></div>
    </Dialog>
  );
}

export default MobileOTP;
