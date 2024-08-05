// src/components/EmailOTP.js
import React, { useState ,useEffect} from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import emailjs from 'emailjs-com';
import { auth } from '../../firebase/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword,updateProfile} from 'firebase/auth';
import { trackUserLogin, getDeviceDetails } from '../../utils/trackUserLogin';
const EmailOTP = ({ open, onClose, onVerify, language }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [userId, setUserId] = useState(''); 
  const [photoUrl, setPhotoUrl] = useState('');
  const [ps,setps]=useState('')
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
  useEffect(() => {
    const updateProfilePhoto = async () => {
      if (photoUrl) {
        const currentUser = auth.currentUser;
        if (currentUser) {
          try {
            await updateProfile(currentUser, { photoURL: photoUrl });
            console.log('Profile photo updated successfully.');
          } catch (error) {
            console.error('Error updating profile photo:', error);
          }
        }
      }
    };

    updateProfilePhoto();
  }, [photoUrl]);
  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  };

  const handleSendOtp = async () => {
    const eotp = generateOtp();
    setGeneratedOtp(eotp);
    await sendOTPEmail(email, eotp);
    setIsOtpSent(true);
  };

  const handleVerifyOtp =  async() => {
    if (otp === generatedOtp) {
      try {
    
        await signInWithEmailAndPassword(auth, email,ps);
      } catch (error) {
        if (error.code === 'auth/user-not-found') {
          await createUserWithEmailAndPassword(auth, email,ps);
        }
      }
     // Get the current user ID
     const currentUser = auth.currentUser;
     if (currentUser) {
       const userId = currentUser.uid; // Get the UID of the current user
       setUserId(userId);
       console.log('UserID:', userId);
       console.log('Device Details:', getDeviceDetails());
       
       // Track user login with the current user's ID and device details
       //    // Extract the first character of the email
         
           try {
            const firstChar = email.charAt(0).toUpperCase();
         
            //    // Generate the image URL based on the first character
            const imageUrl = `https://via.placeholder.com/150/000000/FFFFFF?text=${firstChar}`;
                console.log(imageUrl);
            setPhotoUrl(imageUrl); // Update the state to force UI re-render
            console.log('Profile updated successfully');
          } catch (error) {
            console.error('Error updating profile:', error);
          }
    trackUserLogin(userId,getDeviceDetails);
       alert('OTP verified successfully!');
       setps('');
       setEmail('');
       onVerify(language);
       onClose();
     } 
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
      
        <TextField
          autoFocus
          margin="dense"
          label="Password"
          type="password"
          fullWidth
          value={ps}
          onChange={(e) => setps(e.target.value)}
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
