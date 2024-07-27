// src/components/MobileOTP.js
import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, CircularProgress } from '@mui/material';
import { auth } from '../../firebase/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const MobileOTP = ({ open, onClose, onVerify, language }) => {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [showOTP, setShowOTP] = useState(false);

  useEffect(() => {
    if (showOTP) {
      setupRecaptcha();
    }
  }, [showOTP]);

  const setupRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
      size: 'invisible',
      callback: (response) => {
        console.log('reCAPTCHA solved');
      },
      'expired-callback': () => {
        console.log('reCAPTCHA expired');
      },
    }, auth);
  };


  const onSignup = () => {
    setLoading(true);
    setShowOTP(true);
    const appVerifier = window.recaptchaVerifier;
    const phone = '+' + mobile;
    console.log(phone);
    signInWithPhoneNumber(auth, phone, appVerifier)
      .then((confirmationResult) => {
        setConfirmationResult(confirmationResult);
        console.log('SMS sent');
        setLoading(false);
        alert('Sent OTP to you 😃');
      })
      .catch((error) => {
        console.error('Error during sign-in', error);
        setLoading(false);
      });
  };

  const verifyCode = () => {
    setLoading1(true);
    if (confirmationResult) {
      confirmationResult.confirm(otp)
        .then((result) => {
          const user = result.user;
          console.log('User signed in', user);
          setLoading1(false);
          alert('Login 🤗 Success');
          onVerify(language);
          onClose();
        })
        .catch((error) => {
          console.error('Error verifying code', error);
          setLoading1(false);
        });
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Verify Your Mobile</DialogTitle>
      <DialogContent>
        {!showOTP ? (
          <>
            <TextField
              autoFocus
              margin="dense"
              label="Mobile Number"
              type="text"
              fullWidth
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
            <div id="recaptcha-container"></div>
           
            {mobile && (
        <Button onClick={onSignup} color="primary" variant="contained" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Send OTP'}
        </Button>
      )}
          </>
        ) : (
          <>
            <TextField
              margin="dense"
              label="Enter OTP"
              type="text"
              fullWidth
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <Button onClick={verifyCode} color="primary" variant="contained" disabled={loading1}>
              {loading1 ? <CircularProgress size={24} /> : 'Verify OTP'}
            </Button>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default MobileOTP;
