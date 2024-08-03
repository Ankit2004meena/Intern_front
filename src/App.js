// import './App.css';
// import Footer from './Componets/Footerr/Footer';
// import Home from './Componets/Home/Home';
// import Navbar from './Componets/Navbar/Navbar';
// import { Routes, Route } from 'react-router-dom';
// import Register from './Componets/auth/Register';
// import Intern from "./Componets/Internships/Intern";
// import JobAvl from "./Componets/Job/JobAvl";
// import JobDetail from './Componets/Job/JobDetail';
// import InternDeatil from "./Componets/Internships/InternDeatil";
// import { useDispatch, useSelector } from 'react-redux';
// import { login, logout, selectUser } from "./Feature/Userslice";
// import { useEffect } from 'react';
// import { auth } from './firebase/firebase';
// import Profile from './profile/Profile';
// import AdminLogin from './Admin/AdminLogin';
// import Adminpanel from './Admin/Adminpanel';
// import ViewAllApplication from "./Admin/ViewAllApplication";
// import PostJOb from './Admin/PostJob';
// import Postinternships from './Admin/Postinternships';
// import DeatilApplication from './Applications/DeatilApplication';
// import UserApplicatiom from './profile/UserApplicatiom';
// import UserapplicationDetail from "./Applications/DeatilApplicationUser";
// import { useTranslation } from 'react-i18next';
// import LanguageSelector from './Componets/Language/Language'; // Ensure correct path
// import './Componets/Language/i18n'
// function App() {
//   const { t } = useTranslation();
//   const user = useSelector(selectUser);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     auth.onAuthStateChanged((authUser) => {
//       if (authUser) {
//         dispatch(login({
//           uid: authUser.uid,
//           photo: authUser.photoURL,
//           name: authUser.displayName,
//           email: authUser.email,
//           phoneNumber: authUser.phoneNumber
//         }));
//       } else {
//         dispatch(logout());
//       }
//     });
//   }, [dispatch]);

//   const handleLanguageChange = (language) => {
    
//     console.log(`Language changed to: ${language}`);
//   };

//   return (
//     <div className="App">
//       <Navbar />
//       <header>
//         <LanguageSelector onLanguageChange={handleLanguageChange} />
//       </header>

//       <Routes>
//         <Route path='/' element={<Home />} />
//         <Route path='/register' element={<Register />} />
//         <Route path='/Internship' element={<Intern />} />
//         <Route path='/Jobs' element={<JobAvl />} />
//         <Route path='/profile' element={<Profile />} />
//         <Route path='/detailjob' element={<JobDetail />} />
//         <Route path='/detailInternship' element={<InternDeatil />} />
//         <Route path='/detailApplication' element={<DeatilApplication />} />
//         <Route path='/adminLogin' element={<AdminLogin />} />
//         <Route path='/adminepanel' element={<Adminpanel />} />
//         <Route path='/postInternship' element={<Postinternships />} />
//         <Route path='/postJob' element={<PostJOb />} />
//         <Route path='/applications' element={<ViewAllApplication />} />
//         <Route path='/UserapplicationDetail' element={<UserapplicationDetail />} />
//         <Route path='/userapplication' element={<UserApplicatiom />} />
//       </Routes>
//       <Footer />
//     </div>
//   );
// }

// export default App;
import './App.css';
import EmailOTP from './Componets/verification/EmailOTP';
import { trackUserLogin, getDeviceDetails } from './utils/trackUserLogin';
import Footer from './Componets/Footerr/Footer';
import Home from './Componets/Home/Home';
import Navbar from './Componets/Navbar/Navbar';
import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './Componets/auth/Register';
import Intern from "./Componets/Internships/Intern";
import JobAvl from "./Componets/Job/JobAvl";
import JobDetail from './Componets/Job/JobDetail';
import InternDeatil from "./Componets/Internships/InternDeatil";
import { useDispatch, useSelector } from 'react-redux';
import { login, logout, selectUser } from "./Feature/Userslice";
import { useEffect, useState } from 'react';
import { auth } from './firebase/firebase';
import Profile from './profile/Profile';
import AdminLogin from './Admin/AdminLogin';
import Adminpanel from './Admin/Adminpanel';
import ViewAllApplication from "./Admin/ViewAllApplication";
import PostJOb from './Admin/PostJob';
import Postinternships from './Admin/Postinternships';
import DeatilApplication from './Applications/DeatilApplication';
import UserApplicatiom from './profile/UserApplicatiom';
import UserapplicationDetail from "./Applications/DeatilApplicationUser";
import { useTranslation } from 'react-i18next';
import LanguageSelector from './Componets/Language/Language'; // Ensure correct path
import './Componets/Language/i18n'
import LoginHistory from './Componets/LoginHistory/LoginHistory';;

function App() {
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [authState, setAuthState] = useState({ authenticated: false, browserCheck: false });
  const [showOTPDialog, setShowOTPDialog] = useState(false);
  const [userId, setUserId] = useState(''); // Replace with actual user ID fetching logic

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUserId(authUser.uid);
        dispatch(login({
          uid: authUser.uid,
          photo: authUser.photoURL,
          name: authUser.displayName,
          email: authUser.email,
          phoneNumber: authUser.phoneNumber
        }));
      } else {
        setUserId(null);
        dispatch(logout());
      }
    });
  }, [dispatch]);

  useEffect(() => {
    const checkUserDeviceAndAuth = async () => {
{
        const { browser, deviceType } = getDeviceDetails();
        const currentHour = new Date().getHours();
        const isWithinAllowedTime = currentHour >= 12 && currentHour < 13;
       
        if (deviceType === 'Mobile') {

          if (isWithinAllowedTime) {
            await trackUserLogin(userId, getDeviceDetails());
            setShowOTPDialog(true);
            // setAuthState({ authenticated: true });
          } else {
            alert('Mobile access is only allowed between 10 AM and 1 PM.');
            // Optionally, you can redirect or block access
          }
        }
        else {
       
        if (browser === 'Chrome') {
          setShowOTPDialog(true);
        } else {
           await trackUserLogin(userId, getDeviceDetails());
          setAuthState({ authenticated: true });
        }
      }}
    };

    checkUserDeviceAndAuth();
  }, [userId]);

  const handleVerifyOTP = () => {
    setAuthState({ ...authState, authenticated: true });
  };

  

  const handleLanguageChange = (language) => {
    // Update any additional application state or settings when language changes
    console.log(`Language changed to: ${language}`);
  };

  if (authState.authenticated) {
    return (
      <div className="App">
        <Navbar />
        <header>
          <LanguageSelector onLanguageChange={handleLanguageChange} />
        </header>

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/register' element={<Register />} />
          <Route path='/Internship' />
          <Route path='/Jobs' element={<JobAvl />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/detailjob' element={<JobDetail />} />
          <Route path='/detailInternship' element={<InternDeatil />} />
          <Route path='/detailApplication' element={<DeatilApplication />} />
          <Route path='/adminLogin' element={<AdminLogin />} />
          <Route path='/adminepanel' element={<Adminpanel />} />
          <Route path='/postInternship' element={<Postinternships />} />
          <Route path='/postJob' element={<PostJOb />} />
          <Route path='/applications' element={<ViewAllApplication />} />
          <Route path='/UserapplicationDetail' element={<UserapplicationDetail />} />
          <Route path='/userapplication' element={<UserApplicatiom />} />
          <Route path='/loginHistory' element={<LoginHistory userId={userId} />} />
          <Route path='/access-denied' element={<h1>Access Denied</h1>} />
        </Routes>
        <Footer />
      </div>
    );
  }

  return <EmailOTP open={showOTPDialog} onClose={() => setShowOTPDialog(false)} onVerify={handleVerifyOTP} />;
}

export default App;
