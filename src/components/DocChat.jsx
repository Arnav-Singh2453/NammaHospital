import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { Link, useParams } from "react-router-dom";
import FileUploadButton from './FileUploadButton';

const ChatIcon = () => (
  <svg className="w-6 h-6 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
  </svg>
);

const EndCallIcon = () => (
  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-8a1 1 0 000 2h2a1 1 0 100-2h-2zm-2-2a1 1 0 100 2h2a1 1 0 100-2h-2z" clipRule="evenodd"></path>
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
export default function DocChat() {
    const socketRef = useRef(null);
    const { doctorId, patientId } = useParams();
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const chatEndRef = useRef(null);
    const [ended, setEnded] = useState(false);
    const [message, setMessage] = useState({ text: null, type: null });
    const [file, setFile] = useState(null);
    useEffect(() => {
        socketRef.current = io("https://nammahospital.onrender.com", {
  transports: ["websocket"]
});
    
    socketRef.current.emit("join-room", {doctorId,patientId});


      fetch(`https://nammahospital.onrender.com/chat/${doctorId}/${patientId}`)
    .then((res) => res.json())
    .then((data) => setMessages(data.messages));
    // Line 22: Listen for messages

    socketRef.current.on("chat-history", (messages) => {
  setMessages(messages);
});
   
  socketRef.current.on("chat-ended", (msg) => {
    setEnded(true);
    setMessages((prev) => [...prev, msg]);
    setMessage({ text: "The chat has been ended for the patient.", type: "error" });
  });
   const handleMessage = (msg) => setMessages(prev => [...prev, msg]);
  socketRef.current.on("receive-message", handleMessage);

    return () => {
       socketRef.current.off("receive-message", handleMessage);
        socketRef.current.off("chat-ended");
      socketRef.current.off("chat-history");

    };
  }, [doctorId, patientId]);
useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

 const sendMessage = () => {
  if (text.trim() === "") return;

  const msg = {
    sender: "Doctor",
    text,
    timeStamp: new Date(),
  };

  socketRef.current.emit("send-message", {
    doctorId,
    patientId,
    message: msg,
  });

  setText(""); // just clear input
};
  const handleFileUpload = async () => {
  if (!file) return;
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("https://nammahospital.onrender.com/upload", {
    method: "POST",
    body: formData
  });
  const data = await res.json();

  const msg = {
    sender: "Doctor",
    fileUrl: data.fileUrl,
    fileName: data.fileName,
    fileType: data.fileType,
    timeStamp: new Date()
  };

  socketRef.current.emit("send-message", { doctorId, patientId, message: msg });

  setFile(null); // reset file
};
const isDoctor = (sender) => sender === "Doctor";

  return (
<>
  <div className="flex flex-col h-screen bg-gray-100 font-sans">
      <MessageModal message={message.text} type={message.type} onClose={() => setMessage({ text: null, type: null })} />
      <header className="bg-emerald-600 text-white p-4 shadow-lg flex items-center justify-between">
        <div className="flex items-center">
          <ChatIcon />
          <h2 className="text-xl font-bold">Chat with Patient {patientId}</h2>
        </div>
        <button
          onClick={() => {
        socketRef.current.emit("end-chat", { room: `${doctorId}_${patientId}` });
      }}
          disabled={ended}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-full flex items-center transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <EndCallIcon />
          End Chat
        </button>




        
      </header>

      <div className="flex-1 p-4 bg-[url('/cbg.jpg')] bg-no-repeat bg-cover bg-center overflow-y-auto space-y-4">
        {messages.map((m, i) => (
          <div 
            key={i} 
            className={`flex ${isDoctor(m.sender) ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`p-3 rounded-lg max-w-xs sm:max-w-md ${
                isDoctor(m.sender) 
                ? 'bg-emerald-500 text-white rounded-br-none' 
                : 'bg-white text-gray-800 rounded-bl-none shadow'
              }`}
            >
              <p className="font-semibold">{m.sender}</p>
              {m.text && <p>{m.text}</p>}

  {/* Render file if exists */}
  {m.fileUrl && (
    <a
      href={m.fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 underline"
    >
      📎 {m.fileName}
    </a>
  )}
              <span className="block text-xs text-right mt-1 opacity-75">
                {new Date(m.timeStamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        {ended ? (
          <>
          <div className="text-center text-red-500 font-semibold">
            This chat has ended.
          </div>
          <Link to={`/docdash/${doctorId}`}  className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded shadow hover:bg-emerald-700">Go to doc dash</Link>
          </>
        ) : (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
           <FileUploadButton onFileSelect={(selectedFile) => setFile(selectedFile)} />
{file && (
  <button onClick={handleFileUpload} className="bg-blue-500 text-white px-3 py-1 rounded">
    Send {file.name}
  </button>
)}
            <button
              onClick={sendMessage}
              className="bg-emerald-600 text-white p-3 rounded-full shadow-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
              disabled={text.trim() === ""}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
    
      </>
    );
  }