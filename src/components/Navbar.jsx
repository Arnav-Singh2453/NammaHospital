
import React, { useState } from 'react';
import { HeartPulse, FlaskConical, MapPin, Star, Menu, X, Bot, UserRoundCog } from 'lucide-react';
import { Link } from 'react-router';

const Navbar = () => {
     const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
      const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  return (
    <>
    <header className="backdrop-blur-2xl shadow-sm sticky top-0 z-50">
          <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            {/* Logo */}
            <span onClick={() => setCurrentPage('home')} className="flex-shrink-0 flex items-center space-x-2 cursor-pointer">
              <HeartPulse className="h-8 w-8 text-emerald-600" />
              <span className="text-2xl font-bold text-emerald-600">Namma Hospital</span>
            </span>
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <span onClick={() => setCurrentPage('home')} className="text-gray-600 hover:text-emerald-600 font-medium transition duration-300 cursor-pointer">Home</span>
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
    </>
  )
}

export default Navbar
