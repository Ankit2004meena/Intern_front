// PhoneAuth.js
import React, { useState } from 'react';
import { auth } from '../../firebase/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const PhoneAuth = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    setLoading(true);
    const recaptchaVerifier = new RecaptchaVerifier(auth,'recaptcha-container', {
      size: 'invisible',
      callback: (response) => {
        // reCAPTCHA solved
        console.log("solved");
      },
      'expired-callback': () => {
        // Response expired
      }
    });

    try {
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      setConfirmationResult(confirmationResult);
      setLoading(false);
    } catch (error) {
      console.error('Error during signInWithPhoneNumber:', error);
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (confirmationResult) {
      try {
        await confirmationResult.confirm(verificationCode);
        alert('Phone number verified!');
      } catch (error) {
        console.error('Error while verifying code:', error);
      }
    }
  };

  return (
    <div>
      <div id="recaptcha-container"></div>
      <input
        type="text"
        placeholder="Enter phone number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <button onClick={handleSendCode} disabled={loading}>
        Send Verification Code
      </button>

      <input
        type="text"
        placeholder="Enter verification code"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
      />
      <button onClick={handleVerifyCode} disabled={loading}>
        Verify Code
      </button>
    </div>
  );
};

export default PhoneAuth;
