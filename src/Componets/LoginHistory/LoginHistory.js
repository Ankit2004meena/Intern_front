import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../Admin/admin.css'
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
        {/* <table>
          <thead>
            <tr>
              <th>IP Address</th>
              <th>Browser</th>
              <th>OS</th>
              <th>Device Type</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {loginHistory.map((login) => (
              <tr key={login._id}>
                <td>{login.ip}</td>
                <td>{login.browser}</td>
                <td>{login.os}</td>
                <td>{login.deviceType}</td>
                <td>{new Date(login.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table> */},
        <>
        <h1 className='text-3xl font-semibold mt-3'>Total Applications</h1>
    <div className="flex justify-center " id='tabel'>
        <div className="applications flex flex-col mt-7">
            <div className="overflow-x-auto sm:-mx-6 lg:mx-8">
                <table className="inline-block min-w-full text-left text-sm font-light">
<thead className='border-b font-medium'>
    <tr className='bg-gray-200'>
        <th scope='col' className='px-5 py-4'>Ip Address</th>
        <th scope='col' className='px-5 py-4'>Browser</th>
        <th scope='col' className='px-5 py-4'>OS</th>
        <th scope='col' className='px-5 py-4'>Device Type</th>
        <th scope='col' className='px-5 py-4'>Timestamp</th>
    </tr>

</thead>
<tbody>
    {
      loginHistory.map((login)=>(
            <>
    
            <tr className='border-b' key={login._id}>
            <td className='whitespace-nowrap px-6 py-4'>{login.ip}</td>
            <td className='whitespace-nowrap px-6 py-4'>{login.browser}</td>
            <td className='whitespace-nowrap px-6 py-4'>{login.os}</td>
            <td className='whitespace-nowrap px-6 py-4'>{login.deviceType}</td>
            <td className='whitespace-nowrap px-6 py-4'>{new Date(login.timestamp).toLocaleString()}</td>
            </tr>
            </>
        ))
    }
</tbody>
                </table>

            </div>

        </div>

    </div>
 </>
      )}
    </div>
  );
};

export default LoginHistory;
