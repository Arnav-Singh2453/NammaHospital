import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

export default function PatientPay() {
  const socketRef = useRef(null);
  const navigate = useNavigate();
const { doctorId, patientId } = useParams();
 const [messages, setMessages] = useState([]);
 const [text, setText] = useState("");
   const [paid, setPaid] = useState(false);
   const [paymentLink, setPaymentLink] = useState("");
   const chatEndRef = useRef(null);
   
   const [ended, setEnded] = useState(false);

const initSocket = () => {
    socketRef.current = io("http://localhost:5000");
    socketRef.current.emit("join-room", { doctorId, patientId });

    fetch(`http://localhost:5000/chat/${doctorId}/${patientId}`)
      .then((res) => res.json())
      .then((data) => setMessages(data.messages));
       socketRef.current.on("chat-history", (messages) => {
  setMessages(messages);
});
    socketRef.current.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    
    socketRef.current.on("chat-ended", (msg) => {
      setEnded(true);
      setMessages((prev) => [...prev, msg]);
    });
  };

     useEffect(() => {
        if (!doctorId || !patientId) {
    console.error("Missing doctorId or patientId:", doctorId, patientId);
    return;
  }
let pollInterval;
  async function initChat() {
      try {
        // Check if the patient has paid for this doctor
        const res = await fetch(`http://localhost:5000/api/payment/session/${doctorId}/${patientId}`);
        const data = await res.json();

        if (!data.paid) {
          // Redirect to payment page
          console.log(patientId)
          const payRes = await fetch("http://localhost:5000/api/payment/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ doctorId, patientId, amount: 1 }),
          });
         const { paymentLink, linkId } = await payRes.json();
          console.log("Payment link:", paymentLink);


          setPaymentLink(paymentLink);
          const paymentWindow = window.open(paymentLink, "_blank");
pollInterval = setInterval(async () => {
  const statusRes = await fetch(`http://localhost:5000/api/payment/check-link/${linkId}`);
  const statusData = await statusRes.json();
  if (statusData.paid) {
    clearInterval(pollInterval);
    paymentWindow?.close();
    setPaid(true);
    initSocket();
 setTimeout(() => {
        const msg = {
          sender: "Patient",
          text: "Patient has completed chat",
          timestamp: new Date(),
        };
        socketRef.current.emit("send-message", {
          doctorId,
          patientId,
          message: msg,
        });
        setMessages((prev) => [...prev, msg]);
        navigate(`/patient/${doctorId}/${patientId}`);
    }, 500); 



     
  
  }
}, 2000);
        } else {
          // Patient has paid, allow chat
          setPaid(true);
            initSocket();
    // Room name = doctorId_patientId
     setTimeout(() => {
      const msg = {
        sender: "Patient",
        text: "Patient has completed chat",
        timestamp: new Date(),
      };
      socketRef.current.emit("send-message", {
        doctorId,
        patientId,
        message: msg,
      });
      setMessages((prev) => [...prev, msg]);
      navigate(`/patient/${doctorId}/${patientId}`);
  }, 500);
   

  }}catch(err){
        console.error("Payment or chat error:", err);
      }
    }
      initChat();
    return () => {
       clearInterval(pollInterval);
       socketRef.current?.off("chat-history");
  socketRef.current?.off("receive-message");
  socketRef.current?.off("chat-ended");
  socketRef.current?.disconnect();
    };
  }, [doctorId, patientId]);
useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  if (!paid)
    return <div>Loading payment...</div>;

  return <div ref={chatEndRef}></div>;
}