import React, { useState } from 'react'
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth, provider } from "../../firebase/firebase"
import { useNavigate } from 'react-router-dom'
import emailjs from 'emailjs-com' // Ensure you have this installed and imported correctly
import { trackUserLogin, getDeviceDetails } from '../../utils/trackUserLogin'
import './register.css'

function Register() {
  const [isStudent, setStudent] = useState(true)
  const [isDivVisible, setDivVisible] = useState(false)
  const [fname, setFname] = useState("")
  const [lname, setLname] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [userId, setUserId] = useState('')
  const [eotp, seteotp] = useState('');
  const [generatedeOtp, setGeneratedeOtp] = useState('')
  const [isOtpSent, setIseOtpSent] = useState(false)
  
  const navigate = useNavigate()
  const handleSingin = () => {
    signInWithPopup(auth, provider).then((res) => {
      console.log(res)
      const currentUser = auth.currentUser // Get the current user after sign-in
      if (currentUser) {
        const userId = currentUser.uid // Get the UID of the current user
        setUserId(userId)
        console.log('UserID:', userId)
        console.log('Device Details:', getDeviceDetails())
        // Track user login with the current user's ID and device details
        trackUserLogin(userId, getDeviceDetails())
        setDivVisible(false) // Update visibility state
      }
      navigate("/")
    }).catch((err) => {
      console.log(err)
    })
  }

  const sendOTPEmail = async (email, eotp) => {
    const serviceID = 'service_gkc14qf';
    const templateID = 'template_aihm098';
    const publicKey = 'mBkuO9TzFBjPP3IG8';

    const templateParams = {
      email,
      eotp,
    };

    try {
      await emailjs.send(serviceID, templateID, templateParams, publicKey);
    } catch (error) {
      console.error('Failed to send OTP email:', error);
    }
  };

  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString() // 6-digit OTP
  }

  const handleSendOtp = async () => {
    const eotp = generateOtp()
    setGeneratedeOtp(eotp)
    await sendOTPEmail(email, eotp)
    setIseOtpSent(true)
  }

  const handleVerifyOtp = async () => {
    if (eotp === generatedeOtp) {
      try {
        await signInWithEmailAndPassword(auth, email, password)
        const currentUser = auth.currentUser // Get the current user after sign-in
        if (currentUser) {
          const userId = currentUser.uid // Get the UID of the current user
          setUserId(userId)
          console.log('UserID:', userId)
          console.log('Device Details:', getDeviceDetails())
          // Track user login with the current user's ID and device details
          trackUserLogin(userId, getDeviceDetails())
          setDivVisible(false) // Update visibility state
        }
      } catch (error) {
        if (error.code === 'auth/user-not-found') {
          await createUserWithEmailAndPassword(auth, email, password)
          const currentUser = auth.currentUser // Get the current user after sign-in
          if (currentUser) {
            const userId = currentUser.uid // Get the UID of the current user
            setUserId(userId)
            console.log('UserID:', userId)
            console.log('Device Details:', getDeviceDetails())
            // Track user login with the current user's ID and device details
            trackUserLogin(userId, getDeviceDetails())
            setDivVisible(false) // Update visibility state
          }
        }
      }
      alert('OTP verified successfully!')
      setDivVisible(false)
      setIseOtpSent(false)
      setEmail('')
      setPassword('')
    } else {
      alert('Invalid OTP. Please try again.')
    }
  }

  const setTrueForStudent = () => {
    setStudent(false)
  }

  const setFalseForStudent = () => {
    setStudent(true)
  }

  const showLogin = () => {
    setDivVisible(true)
  }

  const closeLogin = () => {
    setDivVisible(false)
  }
  return (
    <div>
      <div className="form">
        <h1>Sing-up and Apply For Free</h1>
        <p className='para3'>1,50,000+ companies hiring on Internshala</p>
      <div className="regi">
        <div className="py-6">
          <div className="flex bg-white rounded-lg justify-center shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
<div className="w-full p-8 lg:w-1/2">
<a onClick={handleSingin} class="flex items-center h-9 justify-center mt-4 text-white rounded-lg shadow-md hover:bg-gray-100">
                   <div class="px-4 py-3 cursor-pointer">
                       <svg class="h-6 w-6" viewBox="0 0 40 40">
                           <path d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z" fill="#FFC107"/>
                           <path d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z" fill="#FF3D00"/>
                           <path d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z" fill="#4CAF50"/>
                           <path d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z" fill="#1976D2"/>
                       </svg>
                   </div>
                   <h1 class="cursor-pointer px-4 py-3 w-5/6 text-center text-xl text-gray-600 font-bold">Sign in with Google</h1>
      
               </a>
               <div className="mt-4 flex items-center justify-between">
<span className='border-b w-1/5 lg:w1/4'></span>
<a href="/" className='text-xs text-center text-gray-500 uppercase'>or</a>
<span className='border-b w-1/5 lg:w1/4'></span>
               </div>

              <div className="mt-4">
                <label htmlFor="email" className='border-b text-gray-700 text-sm font-bold mb-2'>Email</label>
                <input
                        class=" text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                        type="email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                        placeholder="Hire-me@gmail.com"
                      />
              </div> 
              <div className="mt-4">
                <label htmlFor="password" className='border-b text-gray-700 text-sm font-bold mb-2'>Password</label>
                <input
                        class=" text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
                        placeholder="Must be atleast 6 characters"
                        type="password"
                        value={password}
                        onChange={(e)=>setPassword(e.target.value)}
                      />
              </div> 
              <button className="btn3  my-2 bg-blue-500 h-9 text-white font-bold py-2  w-full rounded hover:bg-blue-600"
                  onClick={handleSendOtp}
                  
                >
                  {setIseOtpSent ? "OTP Sent" : "Send OTP"}
                </button>
                {setIseOtpSent && (
                  <>
                    <input
                      type="text"
                      value={eotp}
                      onChange={(e) => seteotp(e.target.value)}
                      placeholder="Enter OTP"
                    />
                    <button className="btn3 my-2 bg-blue-500 h-9 text-white font-bold py-2 px-4 w-full rounded hover:bg-blue-600"
                      onClick={handleVerifyOtp}
                    >
                      Verify OTP
                    </button>
                    </>
            )}
             <div className="mt-4 flex items-center justify-between">
<p className='text-sm'>new to internarea? Register(<span className='text-blue-500 cursor-pointer' onClick={closeLogin}>Student</span>/<span className='text-blue-500 cursor-pointer' onClick={closeLogin}>company</span>) </p>
             </div>
</div>
                    </div>
                </div>
         
</div>
    
        </div>
      </div>
      
     
  
  )
}

export default Register