// src/utils/trackUserLogin.js
import axios from 'axios';

export const getDeviceDetails = () => {
  const userAgent = navigator.userAgent;
  let browser = 'Unknown';
  if (userAgent.includes('Edg')) {
    browser = 'Edge';
  } else if (userAgent.includes('Chrome')) {
    browser = 'Chrome';
  } else if (userAgent.includes('Firefox')) {
    browser = 'Firefox';
  } else if (userAgent.includes('Safari')) {
    browser = 'Safari';
  } else if (userAgent.includes('MSIE') || userAgent.includes('Trident')) {
    browser = 'Internet Explorer';
  }

  const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
  const deviceType = isMobile ? 'Mobile' : 'Desktop';

  return { browser, deviceType, os: navigator.platform };
};

export const trackUserLogin = async (userId) => {
  const deviceDetails = getDeviceDetails();
  const { data } = await axios.get('https://api.ipify.org?format=json');
  const ip = data.ip;
  const loginData = {
    userId,
    ip,
    browser: deviceDetails.browser,
    os: deviceDetails.os,
    deviceType: deviceDetails.deviceType,
    timestamp: new Date(),
  };
  await axios.post('https://intern-backend-kneh.onrender.com/api/login-history', loginData);
};
