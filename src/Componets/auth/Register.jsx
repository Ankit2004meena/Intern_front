// // PhoneAuth.js
// import React, { useState } from 'react';
// import { auth } from '../../firebase/firebase';
// import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

// const PhoneAuth = () => {
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [verificationCode, setVerificationCode] = useState('');
//   const [confirmationResult, setConfirmationResult] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleSendCode = async () => {
//     setLoading(true);
//     const recaptchaVerifier = new RecaptchaVerifier(auth,'recaptcha-container', {
//       size: 'invisible',
//       callback: (response) => {
//         // reCAPTCHA solved
//         console.log("solved");
//       },
//       'expired-callback': () => {
//         // Response expired
//       }
//     });

//     try {
//       const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
//       setConfirmationResult(confirmationResult);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error during signInWithPhoneNumber:', error);
//       setLoading(false);
//     }
//   };

//   const handleVerifyCode = async () => {
//     if (confirmationResult) {
//       try {
//         await confirmationResult.confirm(verificationCode);
//         alert('Phone number verified!');
//       } catch (error) {
//         console.error('Error while verifying code:', error);
//       }
//     }
//   };

//   return (
//     <div>
//       <div id="recaptcha-container"></div>
//       <input
//         type="text"
//         placeholder="Enter phone number"
//         value={phoneNumber}
//         onChange={(e) => setPhoneNumber(e.target.value)}
//       />
//       <button onClick={handleSendCode} disabled={loading}>
//         Send Verification Code
//       </button>

//       <input
//         type="text"
//         placeholder="Enter verification code"
//         value={verificationCode}
//         onChange={(e) => setVerificationCode(e.target.value)}
//       />
//       <button onClick={handleVerifyCode} disabled={loading}>
//         Verify Code
//       </button>
//     </div>
//   );
// };

// export default PhoneAuth;
// src/components/OTPAuth.js
import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebase';
const OTPAuth = () => {
  const [email, setEmail] = useState('');
  const [eotp, seteotp] = useState('');
  const [generatedeOtp, setGeneratedeotp] = useState('');
  const [iseOtpSent, setIseOtpSent] = useState(false);
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
        await signInWithEmailAndPassword(auth, email, 'dummyPassword');
      } catch (error) {
        if (error.code === 'auth/user-not-found') {
          await createUserWithEmailAndPassword(auth, email, 'dummyPassword');
        }
      }
      alert('OTP verified successfully!');
    } else {
      alert('Invalid OTP. Please try again.');
    }
  };

  return (
    <div>
      {!iseOtpSent ? (
        <div>
          <h2>Send OTP</h2>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleSendOtp}>Send OTP</button>
        </div>
      ) : (
        <div>
          <h2>Verify OTP</h2>
          <input
            type="text"
            placeholder="Enter OTP"
            value={eotp}
            onChange={(e) => seteotp(e.target.value)}
          />
          <button onClick={handleVerifyOtp}>Verify OTP</button>
        </div>
      )}
    </div>
  );
};

export default OTPAuth;
