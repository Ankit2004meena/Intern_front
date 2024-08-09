import axios from 'axios';
import React, { useEffect, useState } from 'react'


function DeatilApplication() {
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

console.log(data)
  return (
    <div>
   {
    data.map((data)=>(
      <section class="text-gray-600 body-font overflow-hidden">
      <div class="container px-5 py-24 mx-auto flex content-center  ">
      <img alt="ecommerce" class="lg:w-1/4 w-full lg:h-auto h-50 object-cover rounded-es-2xl " src={data.user.photo}/>
          <div class=" lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
              <h2 class="text-sm  text-zinc-1500 tracking-widest -ml-1 m-8 font-bold">Company name</h2>
            <h1 class="text-gray-700  title-font mb-1 p-1 -mt-8 ">{data.company}</h1>
          <h2 className="font-bold text-zinc-1500">Cover Letter</h2>
            <p class="text-gray-700 leading-relaxed font-bold -mt-0 ">{data.coverLetter}</p>
            <div class="flex mt-6  pb-5 border-b-2 border-gray-100 mb-5">
         
                <h1 class="mr-3 font-bold">Application Date</h1>
             <h1 className=''>{new Date(data?.createAt).toLocaleDateString()}</h1>
           
            </div>
            <h4 className=' mt-9'>Applied By</h4>
     <p className='font-bold -mt-1'>{data.user.name}</p>
    
          </div>
      
        </div>
    </section>
    ))
   }
    </div>
  )
}

export default DeatilApplication
