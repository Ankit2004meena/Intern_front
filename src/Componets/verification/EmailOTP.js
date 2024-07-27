// src/components/EmailOTP.js
import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import emailjs from 'emailjs-com';
import { auth } from '../../firebase/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const EmailOTP = ({ open, onClose, onVerify, language }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  const sendOTPEmail = async (email, eotp) => {
    const serviceID = 'service_gkc14qf';
    const templateID = 'template_aihm098';
    const publicKey = 'mBkuO9TzFBjPP3IG8';

    const templateParams = {
      email,
      eotp,
    };

    try {
      await emailjs.send(serviceID, templateID, templateParams, publicKey);
    } catch (error) {
      console.error('Failed to send OTP email:', error);
    }
  };

  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  };

  const handleSendOtp = async () => {
    const eotp = generateOtp();
    setGeneratedOtp(eotp);
    await sendOTPEmail(email, eotp);
    setIsOtpSent(true);
  };

  const handleVerifyOtp = async () => {
    if (otp === generatedOtp) {
    //   try {
    //     await signInWithEmailAndPassword(auth, email, 'dummyPassword');
    //   } catch (error) {
    //     if (error.code === 'auth/user-not-found') {
    //       await createUserWithEmailAndPassword(auth, email, 'dummyPassword');
    //     }
    //   }
      alert('OTP verified successfully!');
      onVerify(language);
      onClose();
    } else {
      alert('Invalid OTP. Please try again.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Verify Your Email</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Email Address"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button onClick={handleSendOtp} color="primary" variant="contained">
          Send OTP
        </Button>
        {isOtpSent && (
          <TextField
            margin="dense"
            label="Enter OTP"
            type="text"
            fullWidth
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleVerifyOtp} color="primary" variant="contained">
          Verify
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmailOTP;
