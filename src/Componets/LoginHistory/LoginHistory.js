import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LoginHistory = ({ userId }) => {
  const [loginHistory, setLoginHistory] = useState([]);

  useEffect(() => {
    const fetchLoginHistory = async () => {
      const response = await axios.get(`https://intern-backend-kneh.onrender.com/api/login-history/${userId}`);
      setLoginHistory(response.data);
    };

    fetchLoginHistory();
  }, [userId]);

  return (
    <div>
      <h2>Login History</h2>
      <ul>
        {loginHistory.map((login, index) => (
          <li key={index}>
            {login.timestamp}: {login.browser} on {login.os} ({login.deviceType}) from IP {login.ip}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LoginHistory;
