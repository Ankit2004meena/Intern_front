import React, { useEffect, useState } from 'react';
import "./inter.css";
import compLogo from "../../Assets/netflix.png";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import the useTranslation hook

function Intern() {
  const { t } = useTranslation(); // Initialize the translation hook
  const [serachCategory, setSearchCategory] = useState("");
  const [searchLoaction, setSearchLocation] = useState("");
  const [filterInternship, setFilterInternship] = useState([]);
  const [isDivVisible, setDivVisible] = useState(false);
  const [InternData, setInternData] = useState([]);

  const showDiv = () => {
    setDivVisible(true);
  };

  const hidediv = () => {
    setDivVisible(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://intern-backend-kneh.onrender.com/api/internship`);
        setInternData(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleCategoryChange = (e) => {
    const categeoryValue = e.target.value;
    setSearchCategory(categeoryValue);
    setFilterInternship([categeoryValue, searchLoaction]);
  };

  const handleCategoryLocationChange = (e) => {
    const loactionValue = e.target.value;
    setSearchLocation(loactionValue);
    setFilterInternship([serachCategory, loactionValue]);
  };

  const filterInterships = (category, location) => {
    if (InternData && InternData.length > 0) {
      const filterData = InternData.filter(
        (internship) =>
          internship.category.toLowerCase().includes(category.toLowerCase()) &&
          internship.location.toLowerCase().includes(location.toLowerCase())
      );
      setFilterInternship(filterData);
    }
  };

  useEffect(() => {
    filterInterships(serachCategory, searchLoaction);
  }, [searchLoaction, serachCategory]);

  console.log(filterInternship);
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
    <>
      <div className='flex internship-filter' style={sectionStyle} >
        <div className="first-int mb-14"  >
          <div className="filter-section w-1/6" style={sectionStyle2}>
            <p id='filter-ico' className=' text-center' >
              <i onClick={showDiv} className="bi bi-funnel  text-blue-400"></i> {t('intern.filter')}
            </p>
            <div className=' flex flex-col '>
              <label htmlFor="pro">{t('intern.profile')}</label>
              <input type="text" id='pro' value={serachCategory} style={sectionStyle} onChange={handleCategoryChange} className='profile border-2 mr-3 w-full' placeholder={t('intern.profilePlaceholder')} />
              <label htmlFor="loc">{t('intern.location')}</label>
              <input type="text" id='loc' value={searchLoaction} style={sectionStyle} onChange={handleCategoryLocationChange} className='location border-2 mr-2 w-full' placeholder={t('intern.locationPlaceholder')} />
            </div>
            <div className="preferences mt-2 flex flex-col">
              <div className="flex mt-3 ml-3 mr-3">
                <input type="checkbox" name="wfh" id="whf" className='mr-2 ml-3' />
                <label htmlFor="wfh">{t('intern.workFromHome')}</label>
              </div>
              <div className="flex-col mt-3 ml-3 mr-3">
                <input type="checkbox" name="pt" id="whf" className='mr-2 ml-3' />
                <label htmlFor="pt">{t('intern.partTime')}</label>
              <p>{t('intern.desiredStipend')}</p>
              </div>
              <input type="range" name="" id="" />
              <p className='mt-2 ml-3 mr-3'>0  2K  &nbsp;  4k  &nbsp;  6K &nbsp;  8k   &nbsp; 10K</p>
            </div>
            <p className=' mt-5 text-blue-400'>{t('intern.viewMoreFilters')} <i className="bi bi-chevron-down"></i></p>
            <span className='justify-end flex text-blue-400 mr-3'>{t('intern.clearAll')}</span>
          </div>
          <div className="search-2" style={sectionStyle2}>
            <div className="search-container" >
              <input type="text" placeholder={t('intern.searchPlaceholder')} style={sectionStyle}/  >
              <div className="search-icon">
                <i className="bi bi-search"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="all-internships">
          <div className="show show2 flex justify-center">
            <p className='filterico text-center' onClick={showDiv}>
              {t('intern.filter')} <i className="bi bi-funnel  text-blue-400"></i>
            </p>
          </div>
          <p className='head font-bold text-lg text-center'>
            {filterInternship.length} {t('intern.totalInternships')}
          </p>

          {filterInternship.map((data, index) => (
            <div className='shadow-lg rounded-lg bg-white m-7 ' id='display' key={index} style={sectionStyle2}>
              <div className="m-4">
                <p className='mb-4 mt-3' id='boxer'>
                  <i className='bi bi-arrow-up-right text-blue-500'></i> {t('intern.activelyHiring')}
                </p>
                <div className="flex justify-end">
                  <img src={compLogo} className='w-14' alt="" />
                </div>
                <div className="all-ele">
                  <div className='text-lg text-black m-2 mt-7 font-bold'>{data.title}</div>
                  <div className="info">
                    <p className='text-sm text-slate-300 font-bold'>{data.company}</p>
                    <p className='mt-2'>{data.location}</p>
                  </div>
                  <div className="flex text-sm justify-between">
                    <p className='mt-3'>
                      <i className="bi bi-play-circle-fill"></i> {t('intern.startDate')} <br /> {data.StartDate}
                    </p>
                    <p className='mt-3'>
                      <i className="bi bi-calendar-check-fill"></i> {t('intern.duration')} <br />
                      {data.Duration}
                    </p>
                    <p className='mt-3'>
                      <i className="bi bi-cash"></i> {t('intern.stipend')} <br /> {data.stipend}
                    </p>
                  </div>
                </div>
                <span className='bg-slate-200 style={sectionStyle} text-slate-400 w-20 rounded-sm text-center'>{t('intern.internship')}</span>
                <br />
                <span><i className="bi bi-stopwatch text-green-300"></i>{data.deadline}</span>
                <div className="flex justify-end" id='hr'>
                  <Link to={`/detailInternship?q=${data._id}`} className='mt-10'>
                    <button id='viewButtons' className='bg-transparent text-blue-500'>{t('intern.viewInDetails')}</button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        {isDivVisible && (
          <>
            <div className="first2-int mb-14">
              <div className="filter-section w-1/6">
                <button id='close-btn' onClick={hidediv}><i className=" text-3xl bi bi-x"></i></button>
                <p className='text-center'><i className="bi bi-funnel  text-blue-400"></i> {t('intern.filter')}</p>
                <div className='fill flex flex-col ml-2'>
                  <label htmlFor="pro">{t('intern.profile')}</label>
                  <input type="text" id='pro' value={serachCategory} onChange={handleCategoryChange} className='profile border-2 mr-3 w-full' placeholder={t('intern.profilePlaceholder')} />
                  <label htmlFor="loc">{t('intern.location')}</label>
                  <input type="text" id='loc' value={searchLoaction} onChange={handleCategoryLocationChange} className='location border-2 mt-10  -ml-8 w-full' placeholder={t('intern.locationPlaceholder')} />
                </div>
                <div className="preferences mt-8 flex flex-col">
                  <div className="flex mt-3 ml-3 mr-3">
                    <input type="checkbox" name="wfh" id="whf" className='mr-2 ml-3' />
                    <label htmlFor="wfh">{t('intern.workFromHome')}</label>
                  </div>
                  <div className="flex mt-3 ml-3 mr-3">
                    <input type="checkbox" name="pt" id="whf" className='mr-2 ml-3' />
                    <label htmlFor="pt">{t('intern.partTime')}</label>
                  </div>
                  <p>{t('intern.annualSalary')}</p>
                  <input type="range" name="" id="" />
                  <p className='mt-2 ml-3 mr-3'>0  2K  &nbsp;  4k  &nbsp;  6K &nbsp;  8k   &nbsp; 10K</p>
                </div>
                <p className=' mt-5 text-blue-400'>{t('intern.viewMoreFilters')} <i className="bi bi-chevron-down"></i></p>
                <span className='justify-end flex text-blue-400 mr-3'>{t('intern.clearAll')}</span>
              </div>
              <div className="search-2">
                <div className="search-container">
                  <label htmlFor="ex ">{t('intern.experience')}</label>
                  <input type="text" id='ex' placeholder={t('intern.experiencePlaceholder')} />
                  <div className="search-icon">
                    <i className="bi bi-search"></i>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Intern;
