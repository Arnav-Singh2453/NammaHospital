import { useState } from 'react'
import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router'
import Navbar from './Navbar'


const Doclogin = (props) => {
    const navigate = useNavigate()
    const [form, setform] = useState({uid: 0})
     const handleChange=(e)=>{
        console.log(e.target.value)
        setform({uid : Number(e.target.value)})
     }
   const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:5000/doclogin", form);
    const { uid, name } = res.data;          // destructure object
    
    navigate(`/docdash/${uid}`);
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
    alert(err.response?.data?.error || "Something went wrong"); // optional UX improvement
  }
};

  return (
    <>
   <Navbar />
   <div className="flex flex-col items-center inset-0 bg-emerald-600 opacity-80 justify-center h-[90vh] py-12">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full relative">
        <h3 className="text-3xl font-bold text-gray-900 text-center mb-6">Doctor Login</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="uid" className="block text-sm font-medium text-gray-700">Doctor ID</label>
            <input type="number" onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-500 focus:ring-opacity-50"
              placeholder="Enter your doctor ID" />
          </div>

          
          
          <button
            type="submit" value="Submit" 
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-full transition duration-300"
            
          >Login
           
          </button>
        </form>
      </div>
    </div>
    {/*
    <div>
    <form onSubmit={handleSubmit}>
      <input type="number" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-500 focus:ring-opacity-50"
              placeholder="Enter your doctor ID" />
      
      <input type="submit" value="Submit"  />

    </form>
    </div>
      */}
    </>
  )
}

export default Doclogin
