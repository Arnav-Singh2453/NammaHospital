import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useParams,useNavigate } from "react-router-dom";
import FileUploadButton from "./FileUploadButton";
const ChatIcon = () => (
  <svg className="w-6 h-6 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
  </svg>
);
export default function PatientChat() {
  const navigate = useNavigate()
const { doctorId, patientId } = useParams();
 const [messages, setMessages] = useState([]);
 const [text, setText] = useState("");
   const chatEndRef = useRef(null);
   const socketRef = useRef(null);
   const [ended, setEnded] = useState(false);
   const [file, setFile] = useState(null);
     useEffect(() => {
    // Room name = doctorId_patientId
    socketRef.current = io("http://localhost:5000");
    socketRef.current.emit("join-room", {doctorId,patientId});

      fetch(`http://localhost:5000/chat/${doctorId}/${patientId}`)
    .then((res) => res.json())
    .then((data) => setMessages(data.messages));
    // Line 22: Listen for messages from server
    socketRef.current.on("chat-history", (messages) => {
  setMessages(messages);
});
   const handleMessage = (msg) => setMessages(prev => [...prev, msg]);
  socketRef.current.on("receive-message", handleMessage);

  socketRef.current.on("chat-ended", (msg) => {
    setEnded(true);
    setMessages((prev) => [...prev, msg]);
  });
    return () => {
         socketRef.current.off("receive-message", handleMessage);
        socketRef.current.off("chat-history");

      socketRef.current.off("chat-ended");
    };
  }, [doctorId, patientId]);
useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

const sendMessage = () => {
  if (text.trim() === "") return;

  const msg = {
    sender: "Patient",
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

  const res = await fetch("http://localhost:5000/upload", {
    method: "POST",
    body: formData
  });
  const data = await res.json();

  const msg = {
    sender: "Patient",
    fileUrl: data.fileUrl,
    fileName: data.fileName,
    fileType: data.fileType,
    timeStamp: new Date()
  };

  socketRef.current.emit("send-message", { doctorId, patientId, message: msg });

  setFile(null); // reset file
};
const endChat = async () => {
  try {
    const res = await fetch(`http://localhost:5000/patients/${patientId}/uname`);
    const data = await res.json();
    if (data.uname) {
      navigate(`/patient/${data.uname}`);
    } else {
      console.error("uname not found for user:", patientId);
    }
  } catch (err) {
    console.error("Failed to fetch uname:", err);
  }
};



   const isPatient = (sender) => sender === "Patient";
  return (
    <>
     <div className="flex flex-col h-screen bg-gray-100 font-sans">
      <header className="bg-emerald-600  text-white p-4 shadow-lg flex items-center justify-between">
        <div className="flex items-center">
          <ChatIcon />
          <h2 className="text-xl font-bold">Chat with Doctor {doctorId}</h2>
        </div>
      </header>

      <div className="flex-1 p-4 bg-[url('/cbg.jpg')] bg-no-repeat bg-cover bg-center overflow-y-auto space-y-4">
        {messages.map((m, i) => (
          <div 
            key={i} 
            className={`flex ${isPatient(m.sender) ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`p-3 rounded-lg max-w-xs sm:max-w-md ${
                isPatient(m.sender) 
                ? 'bg-emerald-600 text-white rounded-br-none' 
                : 'bg-white text-gray-800 rounded-bl-none shadow'
              }`}
            >
              <p className="font-semibold">{m.sender}</p>
              
               {m.text && <p>{m.text}</p>}
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
           <button
      onClick={endChat}
      className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded shadow hover:bg-emerald-700"
    >
      Go to Patient dash
    </button>
          </>
        ) : (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
              <FileUploadButton onFileSelect={(selectedFile) => setFile(selectedFile)} />
          {file && (
            <button onClick={handleFileUpload} className="bg-blue-500 text-white px-3 py-1 rounded">
              Send {file.name}
            </button>
          )}
             
            <button
              onClick={sendMessage}
              className="bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
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
    {/*
    <div>
      <h2>Chat with Doctor {doctorId}</h2>
      <div
        style={{
          border: "1px solid black",
          height: "300px",
          overflowY: "scroll",
          padding: "5px",
        }}
        >
        {messages.map((m, i) => (
          <div key={i}>
            <b>{m.sender}: </b>
            {m.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <input
        value={text}
        disabled={ended}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type message..."
        />
      <button disabled={ended} onClick={sendMessage}>Send</button>
    </div>
    */}
        </>
  );  

}