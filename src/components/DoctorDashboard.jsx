import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
const UserIcon = () => (
  <svg className="w-8 h-8 text-indigo-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path>
  </svg>
);

const ChatBubbleIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.339-2.678A9.09 9.09 0 012 10c0-3.866 3.582-7 8-7s8 3.134 8 7z" clipRule="evenodd"></path>
  </svg>
);


export default function DoctorDashboard() {
 const [chats, setChats] = useState([]);
   const [loading, setLoading] = useState(true);
 const params = useParams()
 const doctorId = params.doctorId
 
useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/doctor/${doctorId}/chats`
        );
        setChats(res.data); // Line 13: store in state
      } catch (err) {
        console.error("Error fetching chats", err);
      }finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, [doctorId]);
  return (
    <>
    <Navbar/>
    <div className="bg-gray-100 min-h-screen p-8 sm:p-12 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <header className="flex items-center space-x-4 mb-6 pb-4 border-b-2 border-gray-200">
          <UserIcon />
          <h1 className="text-3xl font-extrabold text-emerald-600 tracking-tight">Doctor Dashboard</h1>
        </header>
        
        <h3 className="text-xl font-bold text-gray-700 mb-4">Active Chats</h3>

        {loading ? (
          <p className="text-center text-gray-500">Loading chats...</p>
        ) : chats.length === 0 ? (
          <div className="text-center text-gray-600 py-12">
            <h4 className="text-lg font-semibold">No patients yet</h4>
            <p className="text-sm mt-2">Check back later for new chat requests.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {chats.map((chat, index) => (
              <Link 
                key={index} 
                to={`/chat/doctor/${doctorId}/${chat.patientId}`}
                className="block bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-lg font-bold text-gray-900">Patient ID: {chat.patientId}</h4>
                  <div className="flex items-center space-x-2 text-gray-500">
                    <ChatBubbleIcon />
                    <span className="text-sm">{chat.lastSender}</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  <span className="font-semibold">Last Message:</span> {chat.lastMessage}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
    {/*
      <div>
      <h2>Doctor Dashboard</h2>
      <h3>Active Chats</h3>
      
      {chats.length === 0 ? (
        <p>No patients yet</p>
      ) : (
        <ul>
        {chats.map((chat, index) => (
          <li key={index}>
          <Link to={`/chat/doctor/${doctorId}/${chat.patientId}`}>
          Patient {chat.patientId} — Last: {chat.lastMessage} (
            {chat.lastSender})
            </Link>
            </li>
          ))}
          </ul>
        )}
        </div>
        */}
        </>
  );

}