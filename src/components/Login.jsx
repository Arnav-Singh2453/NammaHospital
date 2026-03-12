import React, { useMemo } from 'react'
import { useState } from 'react'
import { useForm } from "react-hook-form"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { HeartPulse, FlaskConical, MapPin, Star, Menu, X, Bot, UserRoundCog } from 'lucide-react';
import { Link } from 'react-router';


const Login = ({name, setname, log,setlog}) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const navigate= useNavigate()
   const [currentPage, setCurrentPage] = useState('home');
    const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
    const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);



  const [form, setform] = useState({
    logged: false,
    uname:"",
    password:""
  })
   const handleChange=(e)=>{
    setform({...form,[e.target.name]: e.target.value})
  }

  const handleSubmit=async(e)=>{
    e.preventDefault();
    try{
      const res = await axios.post("http://localhost:5000/login",form)
      console.log(res.data.message)
       setlog(true)
      setname(form.uname)
     
      navigate(`/patient/${form.uname}`)

    }catch(err){
      if (err.response && err.response.data) {
                console.log(err.response.data.error);
                
            } else {
                console.log("Something went wrong");
            }
    }

  }
 if (log) {
  navigate(`/patient/${name}`)
 }else{

 
  return (


<>
<div className="absolute inset-0 bg-emerald-600 opacity-80">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            {/* Logo */}
            <span onClick={() => setCurrentPage('home')} className="flex-shrink-0 flex items-center space-x-2 cursor-pointer">
              <HeartPulse className="h-8 w-8 text-emerald-600" />
              <span className="text-2xl font-bold text-emerald-600">Namma Hospital</span>
            </span>
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-600 hover:text-emerald-600 font-medium transition duration-300 cursor-pointer">Home</Link>
              <span onClick={() => setCurrentPage('contact')} className="text-gray-600 hover:text-emerald-600 font-medium transition duration-300 cursor-pointer">Contact Us</span>
              <div className="relative">
                <button
                  onClick={() => setIsLoginDropdownOpen(!isLoginDropdownOpen)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-6 rounded-full transition duration-300 shadow-lg focus:outline-none"
                >
                  Login/Signup
                </button>
                <div className={`absolute top-full right-0 bg-white mt-2 py-2 w-48 rounded-lg shadow-xl ${isLoginDropdownOpen ? '' : 'hidden'}`}>
                  <Link to="/doclogin" onClick={() => { setIsDoctorModalOpen(true); setIsLoginDropdownOpen(false); }} className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer">Doctor Login</Link>
                  <Link to="/login" onClick={() => { setIsPatientModalOpen(true); setIsLoginDropdownOpen(false); }} className="block px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer">Patient Login</Link>
                </div>
              </div>
            </div>
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600 hover:text-emerald-600 focus:outline-none">
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </nav>
          {/* Mobile Menu (Hidden by default) */}
          <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} bg-white shadow-md`}>
            <div className="px-2 pt-2 pb-3 space-y-1">
              <span onClick={() => { setCurrentPage('home'); setIsMobileMenuOpen(false); }} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 cursor-pointer">Home</span>
              <span onClick={() => { setCurrentPage('contact'); setIsMobileMenuOpen(false); }} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 cursor-pointer">Contact Us</span>
              <span onClick={() => { setIsDoctorModalOpen(true); setIsMobileMenuOpen(false); }} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 cursor-pointer">Doctor Login</span>
              <span onClick={() => { setIsPatientModalOpen(true); setIsMobileMenuOpen(false); }} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100 cursor-pointer">Patient Login</span>
            </div>
          </div>
        </header>
        </div>


    
  <div className="flex flex-col items-center justify-center h-[100vh] py-12">
      <div className="bg-white mt-[12%] backdrop-blur-2xl rounded-xl shadow-2xl p-8 max-w-md w-full relative">
        <h3 className="text-3xl font-bold text-gray-900 text-center mb-6">Patient Login</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="patient-uname" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              id="patient-uname"
              name="uname"
              onChange={handleChange}
              value={form.uname}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-500 focus:ring-opacity-50"
              placeholder="Your username"
            />
          </div>
          <div>
            <label htmlFor="patient-password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="patient-password"
              name="password"
              onChange={handleChange}
              value={form.password}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-500 focus:ring-opacity-50"
              placeholder="••••••••"
            />
          </div>
          
          <div className="flex items-center justify-between">
            
            <Link to="/register" className="text-sm text-emerald-600 hover:text-emerald-800 cursor-pointer">Create an Account</Link>
          </div>
          <button
            type="submit"
            value="Submit" 
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-full transition duration-300"
            
          >Submit
          
          </button>
        </form>
      </div>
    </div>
    {/*  
    <div className='container'>
        <form onSubmit={handleSubmit} >
    <input type="text" name="uname" onChange={handleChange}  className='bg-amber-300' id="" />

    <input type="password" name="password" onChange={handleChange} id="" className='bg-amber-800' />

    <input type="submit" value="Submit" />
    

        </form>
  
    </div>
    */}
</>
  )
  }
}

export default Login
