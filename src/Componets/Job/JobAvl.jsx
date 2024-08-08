import React, { useEffect, useState } from 'react';
import "./job.css";
import compLogo from "../../Assets/netflix.png";
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function JobAvl() {
  const { t } = useTranslation();
  const [serachCategory, setSearchCategory] = useState("");
  const [searchLoaction, setSearchLocation] = useState("");
  const [jobData, setJobData] = useState([]);
  const [filterJob, setFilterJob] = useState([]);
  const [isDivVisible, setDivVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://intern-backend-kneh.onrender.com/api/job`);
        setJobData(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const showDiv = () => {
    setDivVisible(true);
  };

  const hidediv = () => {
    setDivVisible(false);
  };

  const handleCategoryChange = (e) => {
    const categeoryValue = e.target.value;
    setSearchCategory(categeoryValue);
    setFilterJob([categeoryValue, searchLoaction]);
  };

  const handleCategoryLocationChange = (e) => {
    const loactionValue = e.target.value;
    setSearchLocation(loactionValue);
    setFilterJob([serachCategory, loactionValue]);
  };

  const filterJobs = (category, location) => {
    const filterData = jobData.filter(
      (Job) =>
        Job.category.toLowerCase().includes(category.toLowerCase()) &&
        Job.location.toLowerCase().includes(location.toLowerCase())
    );
    setFilterJob(filterData);
  };

  useEffect(() => {
    filterJobs(serachCategory, searchLoaction);
  }, [searchLoaction, serachCategory]);
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
      <div className='flex internship-filter'  style={sectionStyle}>
        <div className="first-int mb-14">
          <div className="filter-section w-1/6" style={sectionStyle2}>
            <p className='text-center'><i className="bi bi-funnel text-blue-400"></i> {t('job.filter')}</p>
            <div className='fill flex flex-col ml-2'>
              <label htmlFor="pro">{t('job.profile')}</label>
              <input type="text" id='pro' value={serachCategory} onChange={handleCategoryChange} className='profile border-2 mr-3 w-full' placeholder={t('job.profilePlaceholder')} />
              <label htmlFor="loc">{t('job.location')}</label>
              <input type="text" id='loc' value={searchLoaction} onChange={handleCategoryLocationChange} className='location border-2  w-full' placeholder={t('job.locationPlaceholder')} />
            </div>
            <div className="preferences mt-2 flex flex-col">
              <div className="flex mt-3 ml-3 mr-3">
                <input type="checkbox" name="wfh" id="whf" className='mr-2 ml-3' />
                <label htmlFor="wfh">{t('job.workFromHome')}</label>
              </div>
              <div className="flex mt-3 ml-3 mr-3">
                <input type="checkbox" name="pt" id="whf" className='mr-2 ml-3' />
                <label htmlFor="pt">{t('job.partTime')}</label>
              </div>
              <p>{t('job.salary')}</p>
              <input type="range" name="" id="" />
              <p className='mt-2 ml-3 mr-3'>{t('job.salaryRange')}</p>
            </div>
            <p className='mt-5 text-blue-400'>{t('job.viewMoreFilters')} <i className="bi bi-chevron-down"></i></p>
            <span className='justify-end flex text-blue-400 mr-3'>{t('job.clearAll')}</span>
          </div>
          <div className="search-2" style={sectionStyle2}>
            <div className="search-container">
              <label htmlFor="ex ">{t('job.experience')}</label>
              <input type="text" id='ex' placeholder={t('job.experiencePlaceholder')}  style={sectionStyle} />
              <div className="search-icon">
                <i className="bi bi-search"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="all-internships">
          <div className="show show2 flex justify-center">
            <p id='filter-ico' className='filterico text-center' onClick={showDiv}>
              {t('job.filter')} <i className="bi bi-funnel text-blue-400"></i>
            </p>
          </div>
          <p className='head font-bold text-lg text-center '>{t('job.totalJobs', { count: filterJob.length })}</p>

          {filterJob.map((data, index) => (
            <div className='shadow-lg rounded-lg bg-white m-7 ' id='display' key={index} style={sectionStyle2}>
              <div className="m-4">
                <p className='mb-4 mt-3' id='boxer'><i className='bi bi-arrow-up-right text-blue-500'></i> {t('job.activelyHiring')}</p>
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
                    <p className='mt-3'><i className="bi bi-play-circle-fill"></i> {t('job.startDate')} <br /> {data.StartDate}</p>
                    <p className='mt-3'><i className="bi bi-calendar-check-fill"></i> {t('job.experienceLabel')} <br /> {data.Experience}</p>
                    <p className='mt-3'><i className="bi bi-cash"></i> {t('job.salaryLabel')} <br /> {data.CTC}</p>
                  </div>
                </div>
                <span className='bg-slate-200 text-slate-400 w-20 rounded-sm text-center'>{t('job.job')}</span>
                <br />
                <span><i className="bi bi-stopwatch text-green-300"></i>{data.ApplyBy}</span>
                <div className="flex justify-end" id='hr'>
                  <Link className='mt-10' to={`/detailjob?q=${data._id}`}>
                    <button id='viewButtons' className='bg-transparent text-blue-500'>{t('job.viewDetails')}</button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isDivVisible && (
        <>
          <div className="first2-int mb-14">
            <div className="filter-section w-1/6">
              <button id='close-btn' onClick={hidediv}><i className="text-3xl bi bi-x"></i></button>
              <p className='text-center'><i className="bi bi-funnel text-blue-400"></i> {t('job.filter')}</p>
              <div className='fill flex flex-col ml-2'>
                <label htmlFor="pro">{t('job.profile')}</label>
                <input type="text" id='pro' value={serachCategory} onChange={handleCategoryChange} className='profile border-2 mr-3 w-full' placeholder={t('job.profilePlaceholder')} />
                <label htmlFor="loc">{t('job.location')}</label>
                <input type="text" id='loc' value={searchLoaction} onChange={handleCategoryLocationChange} className='location border-2 mt-10 -ml-8 w-full' placeholder={t('job.locationPlaceholder')} />
              </div>
              <div className="preferences mt-8 flex flex-col">
                <div className="flex mt-3 ml-3 mr-3">
                  <input type="checkbox" name="wfh" id="whf" className='mr-2 ml-3' />
                  <label htmlFor="wfh">{t('job.workFromHome')}</label>
                </div>
                <div className="flex mt-3 ml-3 mr-3">
                  <input type="checkbox" name="pt" id="whf" className='mr-2 ml-3' />
                  <label htmlFor="pt">{t('job.partTime')}</label>
                </div>
                <p>{t('job.salary')}</p>
                <input type="range" name="" id="" />
                <p className='mt-2 ml-3 mr-3'>{t('job.salaryRange')}</p>
              </div>
              <p className='mt-5 text-blue-400'>{t('job.viewMoreFilters')} <i className="bi bi-chevron-down"></i></p>
              <span className='justify-end flex text-blue-400 mr-3'>{t('job.clearAll')}</span>
            </div>
            <div className="search-2">
              <div className="search-container">
                <label htmlFor="ex ">{t('job.experience')}</label>
                <input type="text" id='ex' placeholder={t('job.experiencePlaceholder')} />
                <div className="search-icon">
                  <i className="bi bi-search"></i>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default JobAvl;
