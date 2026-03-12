import React,{useState,useEffect} from 'react'
import { useParams,Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Navbar from './Navbar'

const Patient = ({log}) => {

const RobotIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 14a6 6 0 110-12 6 6 0 010 12zM6 9a2 2 0 100-4 2 2 0 000 4zm4 0a2 2 0 100-4 2 2 0 000 4zm4 0a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
  </svg>
);

const StarIcon = () => (
  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const MapMarkerIcon = () => (
  <svg className="w-5 h-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
  </svg>
);



const params = useParams()
const [id, setid] = useState("")
const navigate = useNavigate()
const [location, setLocation] = useState({ lat: null, lon: null });
 const [patientId, setPatientId] = useState("");
const [doctors, setDoctors] = useState([]);
const [specialization, setSpecialization] = useState("");
 const [message, setMessage] = useState({ text: null, type: null });
  const [loading, setLoading] = useState(false);
const MessageModal = ({ message, type, onClose }) => {
  if (!message) return null;

  const colorClasses = type === 'error'
    ? 'bg-red-100 border-red-400 text-red-700'
    : 'bg-green-100 border-green-400 text-green-700';

  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 p-4 rounded-lg shadow-lg border ${colorClasses}`}>
      <p>{message}</p>
      <button onClick={onClose} className="ml-4 text-sm font-semibold">
        &times;
      </button>
    </div>
  );
};
  

  // Get user location automatically
  useEffect(() => {
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(pos => {
        setLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude });
      });
    } else alert("Geolocation not supported");
  }, []);

  // Fetch doctors whenever location or specialization changes
  useEffect(() => {
    const fetchDoctors = async () => {
    const { lat, lon } = location;
      if(!lat || !lon) return;
      try {
          const yep = await axios.get("https://nammahospital.onrender.com/getid",{params : {
    uname: params.username
  }})
        setid(yep.data.id)
        const res = await axios.get("https://nammahospital.onrender.com/api/doctors", {
          params: { lat, lon, specialization }
        });
        setDoctors(res.data);
      } catch(err) {
        console.log(err);
      }
    };
    fetchDoctors();
  }, [location, specialization]);

 const handleClick = (uid) => {
   
    setMessage({ text: `Connecting to doctor with UID: ${uid}...`, type: "success" });
    // Mock navigation
    navigate(`/patientpay/${uid}/${id}`);
  };

   const handleNav=()=>{
     if (!id) {
    
    return;
  }
  navigate(`/chatbot/${id}`);
  }
  if (log) {
    return (
      <>
      
      <Navbar/>
      <div className="bg-gray-100 min-h-screen p-8 sm:p-12 font-sans">
        <MessageModal message={message.text} type={message.type} onClose={() => setMessage({ text: null, type: null })} />

        <div className="max-w-7xl mx-auto">
          <header className="bg-white rounded-xl shadow-lg p-6 mb-8 text-center sm:text-left">
            <div className='flex justify-evenly items-center'>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-600 tracking-tight">
              Welcome, {params.username}!
            </h1>
          <div className="flex mb-8">
            <button
              onClick={handleNav}
         
              className="bg-indigo-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:bg-indigo-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
              <RobotIcon /> Talk to AI
            </button>
              </div>
          </div>
          </header>


          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-700 mb-4 border-b-2 border-gray-200 pb-2">
              Find a Doctor
            </h2>
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
              <label htmlFor="specialization" className="text-sm font-medium text-gray-700">Choose Specialization:</label>
              <select
                id="specialization"
                value={specialization}
                onChange={e => setSpecialization(e.target.value)}
                className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
              >
                <option value="">All</option>
                <option value="Cardiologist">Cardiologist</option>
                <option value="General Physician">General Physician</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Pediatrician">Pediatrician</option>
                <option value="Dentist">Dentist</option>
                <option value="ENT">ENT</option>
                <option value="Orthopedic">Orthopedic</option>
                <option value="Ophthalmologist">Ophthalmologist</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full text-center text-gray-500">Loading doctors...</div>
            ) : doctors.length === 0 ? (
              <div className="col-span-full text-center text-gray-500">No doctors found for this specialization.</div>
            ) : (
              doctors.map((doc, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{doc.name}</h3>
                  <p className="text-sm font-semibold text-indigo-600 mb-2">{doc.specialization}</p>
                  <div className="flex items-center space-x-2 text-gray-600 mb-2">
                    <StarIcon /><span>Rating: {doc.rating}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 mb-4">
                    <MapMarkerIcon /><span>Distance: {doc.distance.toFixed(2)} km</span>
                    <a href={`${doc.link}`} target="_blank"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
<path fill="#48b564" d="M35.76,26.36h0.01c0,0-3.77,5.53-6.94,9.64c-2.74,3.55-3.54,6.59-3.77,8.06	C24.97,44.6,24.53,45,24,45s-0.97-0.4-1.06-0.94c-0.23-1.47-1.03-4.51-3.77-8.06c-0.42-0.55-0.85-1.12-1.28-1.7L28.24,22l8.33-9.88	C37.49,14.05,38,16.21,38,18.5C38,21.4,37.17,24.09,35.76,26.36z"></path><path fill="#fcc60e" d="M28.24,22L17.89,34.3c-2.82-3.78-5.66-7.94-5.66-7.94h0.01c-0.3-0.48-0.57-0.97-0.8-1.48L19.76,15	c-0.79,0.95-1.26,2.17-1.26,3.5c0,3.04,2.46,5.5,5.5,5.5C25.71,24,27.24,23.22,28.24,22z"></path><path fill="#2c85eb" d="M28.4,4.74l-8.57,10.18L13.27,9.2C15.83,6.02,19.69,4,24,4C25.54,4,27.02,4.26,28.4,4.74z"></path><path fill="#ed5748" d="M19.83,14.92L19.76,15l-8.32,9.88C10.52,22.95,10,20.79,10,18.5c0-3.54,1.23-6.79,3.27-9.3	L19.83,14.92z"></path><path fill="#5695f6" d="M28.24,22c0.79-0.95,1.26-2.17,1.26-3.5c0-3.04-2.46-5.5-5.5-5.5c-1.71,0-3.24,0.78-4.24,2L28.4,4.74	c3.59,1.22,6.53,3.91,8.17,7.38L28.24,22z"></path>
</svg></a>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Phone: {doc.phone}</p>
                  <button
                  
                    onClick={() => handleClick(doc.uid)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-full transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Connect to Doctor
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      </>
    );
  } else {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-8 text-center">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <p className="text-xl text-gray-700 mb-4">Please log in first.</p>
          <Link to="/login" className="text-indigo-600 hover:underline">
           Login First
          </Link>
        </div>
      </div>
    );
  }
  {/*
    if(log){
      return (
        
      <div>
      i am after login {params.username}
      <button onClick={()=>handleNav()}>Talk to ai</button>
      
      
      <div style={{ padding: "20px" }}>
      <h2>Welcome Patient</h2>
      <label>Choose Specialization: </label>
      <select value={specialization} onChange={e => setSpecialization(e.target.value)}>
      <option value="">All</option>
      <option value="Cardiologist">Cardiologist</option>
      <option value="General Physician">General Physician</option>
      <option value="Dermatologist">Dermatologist</option>
      <option value="Gynecologist">Gynecologist</option>
      <option value="Pediatrician">Pediatrician</option>
      <option value="Dentist">Dentist</option>
      <option value="ENT">ENT</option>
      <option value="Orthopedic">Orthopedic</option>
      <option value="Ophthalmologist">Ophthalmologist</option>
      </select>
      
      <div style={{ marginTop: "20px" }}>
      {doctors.length === 0 ? <p>No doctors found</p> : doctors.map((doc, idx) => (
        <div key={idx} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
        <h3>{doc.name} ({doc.specialization})</h3>
        <p>Rating: {doc.rating}</p>
        <p>Distance: {doc.distance.toFixed(2)} km</p>
        <p>Phone: {doc.phone}</p>
        <button  disabled={!id}  onClick={()=>handleClick(doc.uid)}>Connect to Doctor</button>
        </div>
      ))}
      </div>
      </div>
      </div>
    )
  }
  else{
    return (
  <><div>Login First</div><Link to="/login">Login</Link></>
)
}
*/}
}

export default Patient
