import React from 'react';
import { Link } from 'react-router-dom';
import { RiSendPlaneFill } from "react-icons/ri";
import { BsMailbox2Flag } from "react-icons/bs";
import { BiBriefcase } from "react-icons/bi"; // Import for the briefcase icon
import { useTranslation } from 'react-i18next'; // Import useTranslation

function Adminpanel() {
  const { t } = useTranslation(); // Initialize translation hook
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
    <div class="hidden w-full overflow-hidden rounded-lg border bg-gray-50 shadow-sm lg:block" style={sectionStyle}>
      <div class="mx-auto flex max-w-screen-lg items-center gap-8 p-8">
        <div class="grid w-2/3 grid-cols-2 gap-8">
          <Link to="/applications" class="group flex gap-4">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500 text-white shadow-lg transition duration-100 group-hover:bg-indigo-600 group-active:bg-indigo-700 md:h-12 md:w-12">
              <BsMailbox2Flag />
            </div>
            <div>
              <div className="mb-1 font-semibold">{t('adminpanel.viewApplications')}</div>
              <p className="text-sm text-gray-500">{t('adminpanel.viewApplicationsDescription')}</p>
            </div>
          </Link>

          <Link to="/postJob" className="group flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-indigo-500 text-white shadow-lg transition duration-100 group-hover:bg-indigo-600 group-active:bg-indigo-700">
              <BiBriefcase />
            </div>
            <div>
              <div className="mb-1 font-semibold">{t('adminpanel.postJob')}</div>
              <p className="text-sm text-gray-500">{t('adminpanel.postJobDescription')}</p>
            </div>
          </Link>

          <Link to="/postInternship" className="group flex gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-indigo-500 text-white shadow-lg transition duration-100 group-hover:bg-indigo-600 group-active:bg-indigo-700">
              <RiSendPlaneFill />
            </div>
            <div>
              <div className="mb-1 font-semibold">{t('adminpanel.postInternship')}</div>
              <p className="text-sm text-gray-500">{t('adminpanel.postInternshipDescription')}</p>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}

export default Adminpanel;
