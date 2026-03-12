import React, { useState } from 'react';
import { HeartPulse, FlaskConical, MapPin, Star, Menu, X, Bot, UserRoundCog } from 'lucide-react';
import { Link } from 'react-router';

const landing = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);

  // Re-usable service card component
  const ServiceCard = ({ icon, title, description }) => (
    <div className="bg-emerald-50 p-8 rounded-2xl shadow-lg transform hover:scale-105 transition duration-300">
      <div className="mx-auto w-16 h-16 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-600">
        {icon}
      </div>
      <h3 className="mt-6 text-xl font-bold text-gray-900">{title}</h3>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  );

  // Modal components
  const DoctorLoginModal = () => (
    <div className={`fixed inset-0 bg-gray-900 bg-opacity-50 z-[99] ${isDoctorModalOpen ? '' : 'hidden'}`}>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
        <h3 className="text-2xl font-bold text-gray-900 text-center mb-6">Doctor Login</h3>
        <form className="space-y-4">
          <div>
            <label htmlFor="doctor-email" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="doctor-email" name="doctor-email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-500 focus:ring-opacity-50" placeholder="your.email@example.com" />
          </div>
          <div>
            <label htmlFor="doctor-password" className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" id="doctor-password" name="doctor-password" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-500 focus:ring-opacity-50" placeholder="••••••••" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-emerald-600 hover:text-emerald-800 cursor-pointer">Forgot Password?</span>
          </div>
          <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-full transition duration-300">Login</button>
        </form>
        <button onClick={() => setIsDoctorModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none">
          <X size={24} />
        </button>
      </div>
    </div>
  );

  const PatientLoginModal = () => (
    <div className={`fixed inset-0 bg-gray-900 bg-opacity-50 z-[99] ${isPatientModalOpen ? '' : 'hidden'}`}>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
        <h3 className="text-2xl font-bold text-gray-900 text-center mb-6">Patient Login</h3>
        <form className="space-y-4">
          <div>
            <label htmlFor="patient-email" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="patient-email" name="patient-email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-500 focus:ring-opacity-50" placeholder="your.email@example.com" />
          </div>
          <div>
            <label htmlFor="patient-password" className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" id="patient-password" name="patient-password" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-500 focus:ring-opacity-50" placeholder="••••••••" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-emerald-600 hover:text-emerald-800 cursor-pointer">Forgot Password?</span>
            <span className="text-sm text-emerald-600 hover:text-emerald-800 cursor-pointer">Create an Account</span>
          </div>
          <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-full transition duration-300">Login</button>
        </form>
        <button onClick={() => setIsPatientModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none">
          <X size={24} />
        </button>
      </div>
    </div>
  );

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            {/* Hero Section */}
            <section className="bg-hero relative py-16 sm:py-24">
              <div className="absolute inset-0 bg-emerald-700 opacity-80"></div>
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col-reverse lg:flex-row items-center gap-12 relative z-10">
                {/* Content */}
                <div className="lg:w-1/2 text-center lg:text-left text-white">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
                    Your Health, Our Priority.
                  </h1>
                  <p className="mt-4 text-lg sm:text-xl text-gray-100 max-w-xl mx-auto lg:mx-0">
                    Providing compassionate and expert care for a healthier, happier you.
                  </p>
                  <div className="mt-8 flex justify-center lg:justify-start gap-4">
                    <Link to="/login" className="bg-white text-emerald-600 hover:bg-gray-200 font-semibold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition duration-300">
                      Book an Appointment
                    </Link>
                  </div>
                </div>
                {/* Image */}
                <div className="lg:w-1/2">
                  <img className="w-[80%] hover:scale-[1.11] transform transition duration-500 h-auto rounded-xl l" src="/bgimg.png" alt="A professional and friendly doctor smiling" />
                </div>
              </div>
            </section>
            
            {/* Services Section */}
            <section className="py-16 sm:py-24 bg-white">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                        Our Comprehensive Services
                    </h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                        We offer a full range of medical services to meet the diverse needs of our community.
                    </p>
                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-8">
                        {/* Service Card 1: AI Symptom Checker */}
                        <ServiceCard
                            icon={<Bot className="w-8 h-8" />}
                            title="🤖 AI Symptom Checker"
                            description="Enter symptoms like fever, chest pain, headache, etc. and get recommendations instantly."
                        />
                        {/* Service Card 2: Doctor Finder */}
                        <ServiceCard
                            icon={<UserRoundCog className="w-8 h-8" />}
                            title="👨‍⚕️ Doctor Finder"
                            description="AI suggests best specialists based on your symptoms from our doctor database."
                        />
                        {/* Service Card 3: Location Based */}
                        <ServiceCard
                            icon={<MapPin className="w-8 h-8" />}
                            title="📍 Location Based"
                            description="Find doctors near you using GPS and Haversine distance calculation."
                        />
                        {/* Service Card 4: Ratings */}
                        <ServiceCard
                            icon={<Star className="w-8 h-8" />}
                            title="⭐ Ratings"
                            description="Get recommendations for highly rated doctors to ensure best care."
                        />
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section id="about" className="py-16 sm:py-24 bg-emerald-50">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12">
                {/* Image */}
                <div className="lg:w-1/2">
                  <img className="w-[80%] hover:scale-[1.11] transform transition duration-500 h-auto rounded-xl" src="/wcu.png" alt="A modern and clean medical facility interior" />
                </div>
                {/* Content */}
                <div className="lg:w-1/2 text-center lg:text-left">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                    Why Choose Us?
                  </h2>
                  <p className="mt-4 text-lg text-gray-600">
                    At Namma Hospital, we are committed to providing the highest standard of care with a focus on patient well-being and satisfaction.
                  </p>
                  <ul className="mt-8 space-y-4 text-left">
                    <li className="flex items-start">
                      <HeartPulse className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1 mr-2" />
                      <span className="text-gray-700">Experienced and compassionate medical professionals.</span>
                    </li>
                    <li className="flex items-start">
                      <FlaskConical className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1 mr-2" />
                      <span className="text-gray-700">State-of-the-art technology for accurate diagnostics.</span>
                    </li>
                    <li className="flex items-start">
                      <MapPin className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1 mr-2" />
                      <span className="text-gray-700">Personalized treatment plans tailored to your needs.</span>
                    </li>
                    <li className="flex items-start">
                      <Star className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1 mr-2" />
                      <span className="text-gray-700">Convenient online booking and secure patient portals.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-16 sm:py-24 bg-white">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                  Hear From Our Patients
                </h2>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="bg-emerald-50 p-8 rounded-2xl shadow-lg">
                    <p className="italic text-gray-700">"The doctors and staff were incredibly kind and professional. They made me feel comfortable and truly listened to my concerns. Highly recommend!"</p>
                    <p className="mt-4 font-bold text-gray-900">- Sarah J.</p>
                  </div>
                  <div className="bg-emerald-50 p-8 rounded-2xl shadow-lg">
                    <p className="italic text-gray-700">"I've never experienced such a streamlined and friendly process. Booking online was a breeze, and the care I received was top-notch."</p>
                    <p className="mt-4 font-bold text-gray-900">- John P.</p>
                  </div>
                  <div className="bg-emerald-50 p-8 rounded-2xl shadow-lg">
                    <p className="italic text-gray-700">"From the moment I walked in, the atmosphere was calming. The team explained everything clearly and put my mind at ease. I'm so grateful!"</p>
                    <p className="mt-4 font-bold text-gray-900">- Emily R.</p>
                  </div>
                </div>
              </div>
            </section>
          </>
        );
      case 'contact':
        return (
          <section id="contact" className="py-16 sm:py-24 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-emerald-50 p-8 sm:p-12 lg:p-16 rounded-3xl shadow-2xl max-w-3xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center mb-4">
                  Contact Us
                </h2>
                <p className="text-lg text-gray-600 text-center mb-8">
                  Have a question or need to book an appointment? Fill out the form below.
                </p>
                <form className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input type="text" id="name" name="name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-500 focus:ring-opacity-50" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input type="email" id="email" name="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-500 focus:ring-opacity-50" />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                    <textarea id="message" name="message" rows="4" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring focus:ring-emerald-500 focus:ring-opacity-50"></textarea>
                  </div>
                  <div className="text-center">
                    <button type="submit" className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition duration-300">
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="bg-gray-50">
        {/* Header */}
        <header className=" backdrop-blur-lg shadow-[0_3px_20px_2px_rgba(0,0,0,0.3)] sticky top-0 z-50">
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

        <main>
          {renderPage()}
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold">Namma Hospital</h3>
              <p className="mt-2 text-sm text-gray-400">
                Your partner in health and wellness. Providing exceptional care with a personal touch.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold">Quick Links</h3>
              <ul className="mt-2 space-y-2 text-sm">
                <li><span onClick={() => setCurrentPage('home')} className="text-gray-400 hover:text-white transition duration-300 cursor-pointer">Home</span></li>
                <li><span onClick={() => setCurrentPage('contact')} className="text-gray-400 hover:text-white transition duration-300 cursor-pointer">Contact Us</span></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold">Contact Info</h3>
              <address className="mt-2 text-sm text-gray-400 not-italic space-y-2">
                <p>123 Medical Lane, Health City, CA 90210</p>
                <p>Phone: (123) 456-7890</p>
                <p>Email: <a href="mailto:info@nammahospital.com" className="hover:text-white">info@nammahospital.com</a></p>
              </address>
            </div>
            <div>
              <h3 className="text-lg font-bold">Follow Us</h3>
              <div className="mt-2 flex space-x-4">
                <span className="w-6 h-6 text-gray-400 hover:text-white transition duration-300 cursor-pointer">
                  <HeartPulse className="h-6 w-6" />
                </span>
                <span className="w-6 h-6 text-gray-400 hover:text-white transition duration-300 cursor-pointer">
                  <HeartPulse className="h-6 w-6" />
                </span>
                <span className="w-6 h-6 text-gray-400 hover:text-white transition duration-300 cursor-pointer">
                  <HeartPulse className="h-6 w-6" />
                </span>
              </div>
            </div>
          </div>
          <div className="text-center text-sm text-gray-500 mt-8">
            &copy; 2024 Namma Hospital. All Rights Reserved.
          </div>
        </footer>
      </div>

      <DoctorLoginModal />
      <PatientLoginModal />
    </>
  );
};

export default landing
