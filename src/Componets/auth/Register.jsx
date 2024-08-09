import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, useMediaQuery, useTheme } from '@mui/material';
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { auth, provider } from '../../firebase/firebase';
import CryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const Navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const [dialogOpen, setDialogOpen] = useState(true); // Dialog open state

  // For responsive design
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  };

  const handleSendOtp = async () => {
    const otp = generateOtp();
    setGeneratedOtp(otp);
    // Assume sendOTPEmail function is implemented here
    setIsOtpSent(true);
  };

  const generateAvatarUrl = () => {
    const emailHash = CryptoJS.MD5(email.trim().toLowerCase()).toString();
    return `https://www.gravatar.com/avatar/${emailHash}?d=identicon`;
  };

  const handleRegister = async () => {
    if (otp === generatedOtp) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const currentUser = userCredential.user;
        if (currentUser) {
          const userId = currentUser.uid;
          const avatarUrl = generateAvatarUrl(); // Generate avatar URL using the email state
          setPhotoUrl(avatarUrl);
          await updateProfile(currentUser, { photoURL: avatarUrl });
          alert('Registration successful!');
          setDialogOpen(false); // Close the dialog
        }
      } catch (error) {
        console.error('Registration error:', error);
        if (error.code === 'auth/email-already-in-use') {
          alert('User already registered. Please log in.');
          Navigate('/');
        }
      }
    } else {
      alert('Invalid OTP. Please try again.');
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (user) {
        const userId = user.uid;
        const avatarUrl = user.photoURL || generateAvatarUrl();
        setPhotoUrl(avatarUrl);
        await updateProfile(user, { photo: avatarUrl });
        alert('Google Sign-Up successful!');
        setDialogOpen(false); // Close the dialog
        Navigate('/');
      }
    } catch (error) {
      console.error('Google Sign-Up error:', error);
    }
  };

  return (
    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
      <DialogTitle>Register</DialogTitle>
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
          margin="dense"
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
        <Button onClick={() => setDialogOpen(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={handleRegister} color="primary" variant="contained">
          Register
        </Button>
        {!isMobile && (
          <Button onClick={handleGoogleSignUp} color="secondary" variant="contained">
            Sign Up with Google
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default Register;
