import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Home from '../Componets/Home/Home';

function DeatilApplication() {
  const Navigate=useNavigate();
  const [data,setData] =useState([])
  let search=window.location.search;
  const params=new URLSearchParams(search);
const id=params.get("a")
useEffect(()=>{
   const fetchData= async()=>{
  const response=await axios.get(`https://intern-backend-kneh.onrender.com/api/application/${id}`)

  setData([response.data])
   }
   fetchData()
},[id])
const handleAcceptAndReject= async(id,action)=>{
  try {
    const response=await axios.put(`https://intern-backend-kneh.onrender.com/api/application/${id}`,{action})
    const UpdateApplication=data.map(app=>(app._id===id?response.data.data:app))
    setData(UpdateApplication)
    if(action=="accepted"){
    alert("application accepted")
  Navigate('/applications')      
  }    else{
      alert("application rejected")
      Navigate('/applications') 
    }
  } catch (error) {
    console.log(error)
  }

}
console.log(data)
  return (
    <div>
   {
    data.map((data)=>(
      <section class=" body-font overflow-hidden  ">
      <div class="container px-5 py-24 mx-auto">
        <div class="lg:w-4/5 mx-auto flex flex-wrap">
          <img alt="ecommerce" class="lg:w-1/2 w-full lg:h-auto h-64 object-cover  rounded" src={data.user.photo}/>
          <div class=" lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
              <h2 class="text-sm title-font text-zinc-1500 tracking-widest -ml-1 m-8 font-bold">Company name</h2>
            <h1 class="text-gray-700  title-font mb-1 p-1 -mt-8 ">{data.company}</h1>
          <h2 className="font-bold text-zinc-1500">Cover Letter</h2>
            <p class="text-gray-700 leading-relaxed font-bold -mt-0 ">{data.coverLetter}</p>
            <div class="flex mt-6  pb-5 border-b-2 border-gray-100 mb-5">
         
                <h1 class="mr-3 font-bold">Application Date</h1>
             <h1 className=''>{new Date(data?.createAt).toLocaleDateString()}</h1>
           
            </div>
            <h4 className=' mt-9'>Applied By</h4>
     <p className='font-bold -mt-1'>{data.user.name}</p>
     <div className="flex mt-24 justify-around">
            <button className='bg-blue-700 text-green-400 w-24 font-bold' onClick={()=>handleAcceptAndReject(data._id,"accepted")}>Accept</button>
            <button className='bg-blue-700 text-red-600 w-24 font-bold' onClick={()=>handleAcceptAndReject(data._id,"rejected")}>Reject</button>
          </div>
          </div>
      
        </div>
      </div>
    </section>
    ))
   }
    </div>
  )
}

export default DeatilApplication
