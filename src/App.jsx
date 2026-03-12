import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './components/Login'
import Landing from './components/landing'
import Patient from './components/Patient'
import Register from './components/Register'
import Chatbot from './components/Chatbot'
import Doclogin from './components/DocLogin'
import AutoLocation from './components/getUserLocation'
import { Route,Routes,Link } from 'react-router'
import DoctorDashboard from './components/DoctorDashboard'
import PatientChat from './components/PatientChat'
import DocChat from './components/DocChat'
import PaymentSuccess from './components/PaymentSuccess'
import PatientPay from './components/PatientPay'



function App() {
  const [ulogg, setulogg] = useState(false)
  const [uname, setuname] = useState("")
  
  return(
    <>
   
      
      <Routes>

        <Route path='/'element={<Landing/>} ></Route>
        <Route path='/register'element={<Register/>} ></Route>
        <Route path='/chatbot/:patientId'element={<Chatbot/>} ></Route>
        <Route path='/login'element={<Login name={uname} setname={setuname}  log={ulogg} setlog={setulogg} />}></Route>
        
        <Route path="/patient/:username"  element={<Patient log={ulogg} />} />
        <Route path='/doclogin'element={<Doclogin />} ></Route>
        <Route path='/docdash/:doctorId'element={<DoctorDashboard/>}></Route>
        <Route path='/patient/:doctorId/:patientId'element={<PatientChat/>}></Route>
        <Route path='/patientpay/:doctorId/:patientId'element={<PatientPay/>}></Route>
        <Route path='/chat/doctor/:doctorId/:patientId'element={<DocChat/>}></Route>
        <Route path="/payment-success" element={<PaymentSuccess />} />
        
      </Routes>
    </>
  )
}

export default App
