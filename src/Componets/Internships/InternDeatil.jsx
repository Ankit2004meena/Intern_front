import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../Feature/Userslice';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';
import axios from 'axios';
import './deatil.css';

function InternDeatil() {
  const user = useSelector(selectUser);
  const [isDivVisible, setDivVisible] = useState(false);
  const [textare, setTextare] = useState("");
  const [company, setCompany] = useState("");
  const [category, setCategory] = useState("");
  const navigate = useNavigate();
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const id = params.get("q");

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`https://intern-backend-kneh.onrender.com/api/internship/${id}`);
      setData(response.data);

      const { company, category } = response.data;
      setCompany(company);
      setCategory(category);
    };
    fetchData();
  }, [id]);

  const show = () => {
    setDivVisible(true);
  };

  const hide = () => {
    setDivVisible(false);
  };

  const submitApplication = async () => {
    const text = document.getElementById("text");
    if (text.value === "") {
      alert("Fill the mandatory fields");
    } else {
      const bodyJson = {
        coverLetter: textare,
        category: category,
        company: company,
        user: user,
        Application: id
      };

      await axios.post("https://intern-backend-kneh.onrender.com/api/application", bodyJson)
        .then(() => {
          alert("Done");
          setDivVisible(false);
          // navigate("/Jobs");
        })
        .catch(() => {
          alert("An error occurred");
        });
    }
  };

  return (
    <div>
      <div className="details-app">
        <>
          <h1 className='font-bold text-3xl'>{data.title}</h1>
          <div className="m-14 shadow-sm rounded-md border">
            <p className='mb-4 mt-3' id='boxer'>
              <i className='bi bi-arrow-up-right text-blue-500'></i> Actively Hiring
            </p>
            <div className="main-info align-baseline mr-96 mt-7">
              <p className='text-xl font-bold mt-4'>{data.title}</p>
              <p className='text-sm text-slate-300 font-bold'>{data.title}</p>
              <p><i className="bi bi-geo-alt-fill"></i> {data.location}</p>
            </div>
            <div className="flex tedxt-sm justify-between">
              <p className='mt-3 text-slate-400'>
                <i className="bi bi-play-circle-fill"></i> Start Date <br /> {data.StartDate}
              </p>
              <p className='mt-3 text-slate-400'>
                <i className="bi bi-calendar-check-fill"></i> Duration <br />
                {data.Duration}
              </p>
              <p className='mt-3 text-slate-400'>
                <i className="bi bi-cash"></i> Stipend <br /> {data.stipend}
              </p>
            </div>
            <div className="flex">
              <p className='bg-green-100 rounded-md ml-4 text-green-300'>
                <i className="bi bi-clock"></i> 12/12/2012
              </p>
            </div>
            <hr />
            <div className="aboutCompany flex justify-start">
              <p className='mt-3 text-xl font-bold text-start'>About {data.company}</p>
              <br />
            </div>
            <div className="flex">
              <p className='text-blue-500'>Instagram page <i className='bi bi-arrow-up-right-square'></i></p>
            </div>
            <p className='mt-4'>{data.aboutCompany}</p>
            <div className="about-Job">
              <p className='mt-3 text-xl font-bold text-start'>About Job</p>
              <p>{data.aboutJob}</p>
            </div>
            <p className='text-blue-500 justify-start'>Learn Business Communication</p>
            <div className="whocan">
              <p className='mt-3 text-xl font-bold text-start'>Who can apply</p>
              <p>{data.Whocanapply}</p>
            </div>
            <p className='mt-3 text-xl font-bold text-start'>Perks</p>
            <p>{data.perks}</p>
            <p className='mt-3 text-xl font-bold text-start'>Additional information</p>
            <p>{data.AdditionalInfo}</p>
            <p className='mt-3 text-xl font-bold text-start'>Number of openings</p>
            <p className='text-start'>{data.numberOfopning}</p>
            <div className='flex justify-center mt-6 bg-blue-500 w-40 text-center text-white font-bold'>
              <button className='flex justify-center align-middle' onClick={show}>Apply</button>
            </div>
          </div>
        </>
      </div>

      <Dialog
        open={isDivVisible}
        onClose={hide}
        // fullScreen
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>Application for {data.company}</DialogTitle>
        <DialogContent dividers style={{ padding: '', minHeight: '130vh' }}>
          <div className="application-page">
            <div className="bg">
              <button className='close2' onClick={hide}>
                <i className="bi bi-x"></i>
              </button>
              <p>Application for {data.company}</p>
              <p className='mt-3 text-sm font-bold text-start mb-3'>{data.aboutCompany}</p>
            </div>
            <div className="moreSteps">
              <p className='font-semibold text-xl'>Your resume</p>
              <small>Your current resume will be submitted along with the application</small>
              <p className='mt-5 font-semibold text-xl'>Cover letter</p>
              <br />
              <p>Why should we hire you for this role?</p>
              <TextField
                name="coverLetter"
                placeholder=''
                id="text"
                value={textare}
                onChange={(e) => setTextare(e.target.value)}
                multiline
                rows={4}
                fullWidth
                variant="outlined"
              />
              <p className='mt-5 font-semibold text-xl'>Your availability</p>
              <p>Confirm your availability</p>
              <div>
                <label>
                  <input
                    type="radio"
                    value="Yes, I am available to join immediately"
                  />
                  Yes, I am available to join immediately
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="radio"
                    value="No, I am currently on notice period"
                  />
                  No, I am currently on notice period
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="radio"
                    value="No, I will have to serve notice period"
                  />
                  No, I will have to serve notice period
                </label>
              </div>
              <div>
                <label>
                  <input
                    type="radio"
                    value="Other"
                  />
                  Other <span className='text-slate-500'>
                  (Please specify your availability)  </span>
                </label>
              </div>
              <p className='mt-5 font-semibold text-xl'>Custom resume <span className='text-slate-500'>(Optional)</span></p>
              <small className='text-slate-500'>Employer can download and view this resume</small>
            </div>
          </div>
        </DialogContent>
        <DialogActions style={{ padding: '16px' }}>
          {user ? (
            <Button onClick={submitApplication} color="primary">
              Submit Application
            </Button>
          ) : (
            <Link to="/register">
              <Button color="primary">
                Submit Application
              </Button>
            </Link>
          )}
          <Button onClick={hide} color="secondary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default InternDeatil;
