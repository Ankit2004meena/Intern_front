// src/api/auth.js
import axios from 'axios';
import { getUserAgentInfo } from '../utils/userAgent';

export const login = async (userData) => {
  const userAgentInfo = getUserAgentInfo();
  const response = await axios.post('https://intern-backend-kneh.onrender.com/api/', {
    ...userData,
    ...userAgentInfo
  });
  return response.data;
};
