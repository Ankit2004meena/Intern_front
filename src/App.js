// import './App.css';
// import Footer from './Componets/Footerr/Footer';
// import Home from './Componets/Home/Home';
// import Navbar from './Componets/Navbar/Navbar';
// import { Routes,Route } from 'react-router-dom';
// import Register from './Componets/auth/Register';
// import Intern from "./Componets/Internships/Intern"
// import JobAvl from "./Componets/Job/JobAvl"
// import JobDetail from './Componets/Job/JobDetail';
// import InternDeatil from "./Componets/Internships/InternDeatil"
// import { useDispatch, useSelector } from 'react-redux';
// import { login,logout,selectUser } from "./Feature/Userslice"
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
// import UserapplicationDetail from "./Applications/DeatilApplicationUser"
// import './Componets/Language/i18n';
// import { useTranslation } from 'react-i18next'

// function App() {
//   const { t } = useTranslation();
//   const user=useSelector(selectUser);
//   const dispatch=useDispatch();
//   useEffect(() => {
//     auth.onAuthStateChanged((authUser)=>{
//       if(authUser){
//         dispatch(login({
//           uid:authUser.uid,
//           photo:authUser.photoURL,
//           name:authUser.displayName,
//           email:authUser.email,
//           phoneNumber:authUser.phoneNumber
//         }))
//       }
//         else{
//           dispatch(logout())
//         }
//     })
//     },[dispatch] );
//   return (
//     <div className="App">
// <Navbar/>



// <h1>{t('welcome')}</h1>
// <Routes>
//   <Route path='/' element={<Home/>}/>
// <Route path='/register' element={<Register/>}/>
// <Route path='/Internship' element={<Intern/>}/>
// <Route path='/Jobs' element={<JobAvl/>}/>
// <Route path='/profile' element={<Profile/>}/>
// <Route path='/detailjob' element={<JobDetail/>}/>
// <Route path='/detailInternship' element={<InternDeatil/>}/>
// <Route path='/detailApplication' element={<DeatilApplication/>}/>
// <Route path='/adminLogin' element={<AdminLogin/>}/>
// <Route path='/adminepanel' element={<Adminpanel/>}/>
// <Route path='/postInternship' element={<Postinternships/>}/>
// <Route path='/postJob' element={<PostJOb/>}/>
// <Route path='/applications' element={<ViewAllApplication/>}/>
// <Route path='/UserapplicationDetail' element={< UserapplicationDetail/>}/>
// <Route path='/userapplication' element={<UserApplicatiom/>}/>
// </Routes>
// <Footer/>
//     </div>
//   );
// }

// export default App;
import './App.css';
import Footer from './Componets/Footerr/Footer';
import Home from './Componets/Home/Home';
import Navbar from './Componets/Navbar/Navbar';
import { Routes, Route } from 'react-router-dom';
import Register from './Componets/auth/Register';
import Intern from "./Componets/Internships/Intern";
import JobAvl from "./Componets/Job/JobAvl";
import JobDetail from './Componets/Job/JobDetail';
import InternDeatil from "./Componets/Internships/InternDeatil";
import { useDispatch, useSelector } from 'react-redux';
import { login, logout, selectUser } from "./Feature/Userslice";
import { useEffect } from 'react';
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
function App() {
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch(login({
          uid: authUser.uid,
          photo: authUser.photoURL,
          name: authUser.displayName,
          email: authUser.email,
          phoneNumber: authUser.phoneNumber
        }));
      } else {
        dispatch(logout());
      }
    });
  }, [dispatch]);

  const handleLanguageChange = (language) => {
    // Update any additional application state or settings when language changes
    console.log(`Language changed to: ${language}`);
  };

  return (
    <div className="App">
      <Navbar />
      <header>
        <LanguageSelector onLanguageChange={handleLanguageChange} />
      </header>

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/Internship' element={<Intern />} />
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
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
