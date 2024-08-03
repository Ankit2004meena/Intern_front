// src/components/LoginHistory.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LoginHistory = ({ userId }) => {
  const [loginHistory, setLoginHistory] = useState([]);

  useEffect(() => {
    const fetchLoginHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/login-history/user/${userId}/history`);
        setLoginHistory(response.data);
      } catch (error) {
        console.error('Error fetching login history:', error);
      }
    };

    fetchLoginHistory();
  }, [userId]);

  return (
    <div>
      <h2>Login History</h2>
      {loginHistory.length === 0 ? (
        <p>No login history available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>IP Address</th>
              <th>User Agent</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {loginHistory.map((login) => (
              <tr key={login._id}>
                <td>{login.ip}</td>
                <td>{login.userAgent}</td>
                <td>{new Date(login.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LoginHistory;
