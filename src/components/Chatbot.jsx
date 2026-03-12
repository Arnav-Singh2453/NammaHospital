import { useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { useParams , useNavigate} from "react-router-dom";
const RobotIcon = () => (
  <svg className="w-6 h-6 text-indigo-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
  </svg>
);

const DoctorIcon = () => (
  <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17.5 13.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zm-3.14-5.23c.47.47.88 1.04 1.22 1.67L12 15.5l-2.58-4.5a3.97 3.97 0 00-1.84-2.22 5 5 0 00-3.52 1.48L1 11.23V20h17v-8.77l-2.64-2.65zM15 11a1 1 0 100-2 1 1 0 000 2z" />
  </svg>
);

// Custom message modal to replace alert()
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

function Chatbot() {
  const navigate = useNavigate()
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
    const [message, setMessage] = useState({ text: null, type: null });
      const [listening, setListening] = useState(false);
        const [language, setLanguage] = useState("en-US"); 

  const params = useParams()
  const id = params.patientId;
  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = language; // change to "hi-IN" for Hindi, "kn-IN" for Kannada
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    setListening(true);

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
       console.log("Recognized text:", spokenText); // check in console
    setSymptoms(spokenText); // update textarea // auto-fill the textarea
      setListening(false);
    };

    recognition.onerror = () => setListening(false);
  };
 const translateText = async (text, targetLang) => {
  if (targetLang === "en-US" || /^[A-Za-z\s.]+$/.test(text)) {
  return text; // Skip translation
}
  try {
    const langMap = {
      "en-US": "English",
      "hi-IN": "Hindi",
      "kn-IN": "Kannada",
    };

    // Send only the word/term
    const res = await axios.post("https://nammahospital.onrender.com/translate", {
      text,          // e.g., "Cardiologist"
      target: langMap[targetLang],
    });

    // remove romanization if any
    return (res.data.translatedText || text).replace(/\s*\(.*?\)\s*/g, "");
  } catch (err) {
    console.error("Translation failed:", err.message);
    return text;
  }
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!navigator.geolocation) {
      setLoading(false);
      alert("Geolocation not supported!");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        
        const { latitude, longitude } = position.coords;

        // Send symptoms + location together
        const res = await axios.post("https://nammahospital.onrender.com/chat", {
          symptoms,
          lat: latitude,
          lon: longitude,
        });
        const { specialization, recommendedDoctors } = res.data;
          const translatedSpec = await translateText(
          `Based on your symptoms, we suggest you see a ${specialization}.`,
          language
        );

      const cleanSpec = translatedSpec.replace(/\s*\(.*?\)\s*/g, "");
setResult(cleanSpec);
    const translatedDoctors = await Promise.all(
  recommendedDoctors.map(async (doc) => ({
    ...doc,
    name: (await translateText(doc.name, language)).replace(/\s*\(.*?\)\s*/g, ""),
    specialization: (await translateText(doc.specialization, language)).replace(/\s*\(.*?\)\s*/g, ""),
    phone: doc.phone,
    distance: doc.distance,
    rating: doc.rating,
    link:doc.link
  }))
);

setDoctors(translatedDoctors);

        // 4️⃣ Update doctors state
        
        
        
      } catch (err) {
        console.error(err);
        setResult("Error: " + err.message);
      }finally{
        setLoading(false);
      }
    });
  };
 
    const handleClick = (uid) => {
   
    setMessage({ text: `Connecting to doctor with UID: ${uid}...`, type: "success" });
    // Mock navigation
    navigate(`/patientpay/${uid}/${id}`);
  };
  
  
  return (
    <>
    <Navbar/>
    <div className="bg-gray-100 min-h-screen p-8 sm:p-12 font-sans">
        <div className="mb-4">
          <label className="mr-2 font-semibold">Select Language:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="en-US">English</option>
            <option value="hi-IN">Hindi</option>
            <option value="kn-IN">Kannada</option>
          </select>
        </div>
      <MessageModal message={message.text} type={message.type} onClose={() => setMessage({ text: null, type: null })} />

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <header className="flex items-center space-x-4 mb-6 pb-4 border-b-2 border-gray-200">
          <RobotIcon />
          <h1 className="text-3xl font-extrabold text-indigo-600 tracking-tight">AI Symptom Checker</h1>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <label htmlFor="symptoms" className="text-sm font-medium text-gray-700 mb-2">
              Describe your symptoms
            </label>
            <textarea
              id="symptoms"
              placeholder="e.g., I have a persistent cough and a sore throat..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              rows={5}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50 transition duration-200"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-full shadow-lg hover:bg-indigo-700 transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={loading || symptoms.trim() === ""}
          >
            {loading ? 'Checking...' : 'Check Symptoms'}
          </button>
           {/* 🎤 Mic Button */}
              <button
                type="button"
                onClick={handleVoiceInput}
                className="px-6 py-3 bg-emerald-600 text-white rounded-full"
              >
                {listening ? "Listening..." : "🎤 Speak"}
              </button>
        </form>

        {(result || loading) && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-700 mb-4 border-b-2 border-gray-200 pb-2">
              Suggested Specialist
            </h2>
            {loading ? (
              <p className="text-center text-gray-500">Analyzing symptoms...</p>
            ) : (
              <p className="text-lg text-gray-800">
                Based on your symptoms, we suggest you see a <b className="text-indigo-600">{result}</b>.
              </p>
            )}
          </div>
        )}

        {doctors.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-700 mb-4 border-b-2 border-gray-200 pb-2">
              Recommended Doctors Near You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doc, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                  <div className="flex items-center space-x-3 mb-2">
                    <DoctorIcon />
                    <h3 className="text-lg font-semibold text-gray-900">{doc.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Specialization:</span> {doc.specialization}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Rating:</span> ⭐ {doc.rating}
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    <span className="font-medium">Distance:</span> {doc.distance ? doc.distance.toFixed(2) + " km" : "N/A"}
                    <a href={`${doc.link}`} target="_blank"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="48" height="48" viewBox="0 0 48 48">
<path fill="#48b564" d="M35.76,26.36h0.01c0,0-3.77,5.53-6.94,9.64c-2.74,3.55-3.54,6.59-3.77,8.06	C24.97,44.6,24.53,45,24,45s-0.97-0.4-1.06-0.94c-0.23-1.47-1.03-4.51-3.77-8.06c-0.42-0.55-0.85-1.12-1.28-1.7L28.24,22l8.33-9.88	C37.49,14.05,38,16.21,38,18.5C38,21.4,37.17,24.09,35.76,26.36z"></path><path fill="#fcc60e" d="M28.24,22L17.89,34.3c-2.82-3.78-5.66-7.94-5.66-7.94h0.01c-0.3-0.48-0.57-0.97-0.8-1.48L19.76,15	c-0.79,0.95-1.26,2.17-1.26,3.5c0,3.04,2.46,5.5,5.5,5.5C25.71,24,27.24,23.22,28.24,22z"></path><path fill="#2c85eb" d="M28.4,4.74l-8.57,10.18L13.27,9.2C15.83,6.02,19.69,4,24,4C25.54,4,27.02,4.26,28.4,4.74z"></path><path fill="#ed5748" d="M19.83,14.92L19.76,15l-8.32,9.88C10.52,22.95,10,20.79,10,18.5c0-3.54,1.23-6.79,3.27-9.3	L19.83,14.92z"></path><path fill="#5695f6" d="M28.24,22c0.79-0.95,1.26-2.17,1.26-3.5c0-3.04-2.46-5.5-5.5-5.5c-1.71,0-3.24,0.78-4.24,2L28.4,4.74	c3.59,1.22,6.53,3.91,8.17,7.38L28.24,22z"></path>
</svg></a>
                  </p>
                  <button
                    onClick={() => handleClick(doc.uid)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-full transition duration-300"
                  >
                    Connect to Doctor
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    {/*
      <div className="p-4">
      <h2>AI Symptom Checker</h2>
      <form onSubmit={handleSubmit}>
      <textarea
      placeholder="Describe your symptoms..."
      value={symptoms}
      onChange={(e) => setSymptoms(e.target.value)}
      rows={4}
      cols={40}
      />
      <br />
      <button type="submit">Check</button>
      </form>
      
      {result && (
        <p>
        Suggested Specialist: <b>{result}</b>
        </p>
        )}
        
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {doctors.map((doc, idx) => (
          <div key={idx} className="border rounded-lg p-4 shadow-md">
          <h3 className="text-lg font-bold">{doc.name}</h3>
          <p>Specialization: {doc.specialization}</p>
          <p>Rating: ⭐ {doc.rating}</p>
          <p>Distance: {doc.distance ? doc.distance.toFixed(2) + " km" : "N/A"}</p>
          <p>📞 {doc.phone}</p>
          <button onClick={()=>handleClick(doc.uid)}>Connect to Doctor</button>
          </div>
          ))}
          
          </div>
          </div>
          */}
          </>
  );
}

export default Chatbot;
