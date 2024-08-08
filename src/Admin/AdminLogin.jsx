import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import "./admin.css";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const loginAdmin = async () => {
    if (username === "" || password === "") {
      alert(t('adminLogin.fillTheBlanks'));
    } else {
      const bodyjson = {
        username: username,
        password: password
      };
      axios.post("https://intern-backend-kneh.onrender.com/api/admin/adminLogin", bodyjson)
        .then((res) => {
          console.log(res, "data is sent");
          alert(t('adminLogin.success'));
          navigate("/adminepanel");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  const backgroundImage = t('Home.background-image1');
  const backgroundImage2=t('Home.background-image2');
    const sectionStyle = {
      backgroundImage: backgroundImage,
      backgroundSize: 'cover', // You can adjust this depending on your needs
      backgroundPosition: 'center',
    };
    const sectionStyle2 = {
      backgroundImage: backgroundImage2,
      
    };
  return (
    <div className="flex justify-center items-center  bg-gray-100 p-2 " style={sectionStyle}>
      <section className="text-gray-600 body-font relative">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-12">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">
              {t('adminLogin.contactUs')}
            </h1>
          </div>
          <div className="lg:w-1/2 md:w-2/3 mx-auto p-2" style={sectionStyle2} >
            <div className="flex flex-wrap -m-2">
              <div className="p-2 w-full">
                <div className="relative">
                  <label htmlFor="name" className="leading-7 text-sm text-gray-600">
                    {t('adminLogin.name')}
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    id="name"
                    name="name"
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-full">
                <div className="relative">
                  <label htmlFor="pass" className="leading-7 text-sm text-gray-600">
                    {t('adminLogin.password')}
                  </label>
                  <input
                    type="password"
                    id="pass"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-full flex justify-center">
                <button onClick={loginAdmin} className="bt3">
                  {t('adminLogin.login')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminLogin;
