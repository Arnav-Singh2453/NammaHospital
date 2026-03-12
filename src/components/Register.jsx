import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { Routes,Route,Link,useNavigate} from "react-router-dom";
import { HeartPulse, FlaskConical, MapPin, Star, Menu, X, Bot, UserRoundCog } from 'lucide-react';
import Login from './Login';

const Register = () => {
 const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const navigate= useNavigate()
   const [currentPage, setCurrentPage] = useState('home');
    const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
    const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);


 const [loading, setLoading] = useState(false);
  const [exist, setexist] = useState(false)
  const [form, setform] = useState({
      uname: "",
  password:"",
  name: "",
  age: 0,
  cond: "",
  weight: "",
  height:0
  });



  const handleChange=(e)=>{
    setform({...form,[e.target.name]: e.target.value})
  }

  const handleClick=(e)=>{

  }



  const handleSubmit = async(e)=>{
    e.preventDefault();
    try{
      const res = await axios.post("https://nammahospital.onrender.com/register",form)
      console.log(res.data.message)
    }catch(err){
          if (err.response && err.response.data) {
                console.log(err.response.data.error);
                setexist(true)
            } else {
                console.log("Something went wrong");
            }
    }


  }
  return (
    <>
<div className="bg-gray-50">
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

 <div className="flex absolute mt-[2%] inset-0 bg-emerald-600 opacity-80 flex-col items-center justify-center  py-12">
      <div className="bg-white mt-[2%] rounded-xl shadow-2xl p-8 max-w-md w-full relative">
        <h3 className="text-3xl font-bold text-gray-900 text-center mb-6">Patient Registration</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="uname" className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              id="uname"
              name="uname"
              onChange={handleChange}
              value={form.uname}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-500 focus:ring-opacity-50"
              placeholder="Create a username"
              required
              />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={handleChange}
              value={form.password}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-500 focus:ring-opacity-50"
              placeholder="••••••••"
              required
              />
          </div>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              onChange={handleChange}
              value={form.name}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-500 focus:ring-opacity-50"
              placeholder="Enter your full name"
              required
              />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                onChange={handleChange}
                value={form.age}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-500 focus:ring-opacity-50"
                placeholder="Age"
                required
                />
            </div>
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700">Weight (kg)</label>
              <input
                type="number"
                id="weight"
                name="weight"
                onChange={handleChange}
                value={form.weight}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-500 focus:ring-opacity-50"
                placeholder="Weight"
                required
                />
            </div>
          </div>
          <div>
            <label htmlFor="height" className="block text-sm font-medium text-gray-700">Height (cm)</label>
            <input
              type="number"
              id="height"
              name="height"
              onChange={handleChange}
              value={form.height}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-500 focus:ring-opacity-50"
              placeholder="Height"
              required
              />
          </div>
          <div>
            <label htmlFor="cond" className="block text-sm font-medium text-gray-700">Medical Condition</label>
            <textarea
              id="cond"
              name="cond"
              onChange={handleChange}
              value={form.cond}
              rows="2"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-500 focus:ring-opacity-50"
              placeholder="Enter any medical conditions (optional)"
              />
          </div>

          
          
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-full transition duration-300"
            disabled={loading}
            >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <div className="text-sm text-center mt-4">
          Already have an account? <Link to="/login" className="text-emerald-600 hover:text-emerald-800 cursor-pointer font-medium">Login here</Link>
        </div>
      </div>
    </div>

    {/* 
      <div className='bg-blue-500 flex flex-col'>
      <form className='bg-blue-500 flex flex-col w-[30vw] ' onSubmit={handleSubmit}>
      
      <input type="text" name='uname' className='bg-amber-300 mb-2.5' id=""  onChange={HandleChange}/>
      <input type="password" name="password" id="" className='bg-amber-800 mb-2.5'  onChange={HandleChange}/>
      <input type="text" name='name'     className='bg-amber-800 mb-2.5' onChange={HandleChange} />
      <input type="text" name='age'     className='bg-amber-800 mb-2.5'  onChange={HandleChange}/>
      <input type="text" name='cond'   className='bg-amber-800 mb-2.5'  onChange={HandleChange}/>
      <input type="text"  name='weight'     className='bg-amber-800 mb-2.5' onChange={HandleChange}/>
      <input type="text " name='height'     className='bg-amber-800 mb-2.5'  onChange={HandleChange}/>
      <input type="submit" value="Submit" />
      {exist?(<div>user already exist</div>,<Link to="/login">Login</Link>):null}
      
      </form>
      <Routes>
      <Route path='/login' element={<Login/>}></Route>
      </Routes>
      </div>
      */}
      </>
    )
}

export default Register
