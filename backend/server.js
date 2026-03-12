import express from "express";
import mongoose from "mongoose";
import cors from "cors"
import bodyParser from "body-parser";

import http from "http";
import { Server } from "socket.io";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

import Chat from "./models/chat.js" 
import paymentRoutes from "./routes/payment.js"
import Session from "./models/Session.js";
import {  GoogleGenAI } from "@google/genai";

import { link } from "fs";
import dotenv from "dotenv";
dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port =  5000;
const server = http.createServer(app);

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use("/api/payment", paymentRoutes);


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));


function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * (Math.PI/180);
  const dLon = (lon2 - lon1) * (Math.PI/180);
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*(Math.PI/180)) * Math.cos(lat2*(Math.PI/180)) * Math.sin(dLon/2)**2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}


const ai = new GoogleGenAI({ 
  
  apiKey: process.env.GENAI_KEY 
});

app.get("/test", async (req, res) => {
  try {
   
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash", 
      contents: "Say: Gemini API is working!",
    });

 
    res.json({ reply: response.text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const io = new Server(server,{
  cors:{
    origin: "*",
      methods: ["GET", "POST"],

  }}
)
app.post("/chat", async (req, res) => {
  try {
    const { symptoms, lat, lon } = req.body;

    const prompt = `
      You are a healthcare assistant.
      Map symptoms to one specialization only:
      Cardiologist, General Physician, Dermatologist, Gynecologist, Pediatrician, Dentist, ENT, Orthopedic, Ophthalmologist, Neurologist, Psychiatrist, Endocrinologist, Pulmonologist, Radiologist, Plastic Surgeon, Urologist, Physiotherapist, Allergist, Gastroenterologist, Hematologist, Immunologist, Oncologist, Pathologist, ENT Specialist
      Respond ONLY with the specialization name.
      Symptoms: ${symptoms}
    `;

  
    const response = await ai.models.generateContent({ 
      model: "gemini-2.5-flash", 
      contents: [
        { role: "user", parts: [{ text: prompt }] } 
      ],
    });


    const specialization = response.text.trim(); 

    let doctors = await Doctor.find({ specialization });

    if (lat && lon) {
      doctors = doctors.map((doc) => ({
        ...doc._doc,
        distance: getDistance(lat, lon, doc.location.lat, doc.location.lon),
      }));

      doctors.sort((a, b) => a.distance - b.distance || b.rating - a.rating);
    }

    res.json({
      specialization,
      recommendedDoctors: doctors.slice(0, 5).map(doc => ({
        uid: doc.uid,
        name: doc.name,
        specialization: doc.specialization,
        rating: doc.rating,
        distance: doc.distance,
        phone: doc.phone,
        link: doc.link,
      })),
    });
  } catch (err) {
    console.error("Gemini/Doctor error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post("/translate", async (req, res) => {
  const { text, target } = req.body;

  try {
    const prompt = `Translate the following text to ${target}: "${text}"`;

    // ----------------------------------------------------------------------
    // FIX 1: Use 'ai.models.generateContent' instead of 'textClient.generate'
    // ----------------------------------------------------------------------
    const result = await ai.models.generateContent({ 
      model: "gemini-2.5-flash", // Using gemini-2.5-flash for a fast translation task
      contents: [
        { role: "user", parts: [{ text: prompt }] }
      ],
    });

   
    res.json({ translatedText: result.text.trim() });
  } catch (err) {
    console.error("Translation error:", err.message);
    res.status(500).json({ error: err.message });
  }
});
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 


app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  res.json({
    fileUrl: `${process.env.BASE_URL}/${req.file.filename}`,
    fileName: req.file.originalname,
    fileType: req.file.mimetype
  });
});
app.get("/", (req, res) => {
  res.send("Namma Hospital backend is running");
});
app.get('/chat/:doctorId/:patientId', async (req, res) => {
  const { doctorId, patientId } = req.params;
  let chat = await Chat.findOne({ doctorId, patientId });
  if (!chat) chat = new Chat({ doctorId, patientId, messages: [] });
  res.json(chat);
});




io.on("connection",(socket)=>{
  console.log("user connected ",socket.id)
  socket.on("join-room",async({doctorId,patientId})=>{
    if (!doctorId || !patientId) {
  console.error("doctorId or patientId is missing", { doctorId, patientId });
  return;
}
    const room = `${doctorId.toString()}_${patientId.toString()}`;
    socket.join(room);
    console.log(`User ${socket.id} joined the ${room}`);


    let chat = await Chat.findOne({doctorId,patientId});
    if(chat){
      socket.emit("chat-history", chat.messages);
    }
  });
  socket.on("send-message",async({doctorId,patientId,message})=>{
    if (!doctorId || !patientId) {
  console.error("doctorId or patientId is missing", { doctorId, patientId });
  return;
}
     const room = `${doctorId}_${patientId}`;
     try {

    let chat = await Chat.findOne({ doctorId, patientId });
    if (!chat) {
      chat = new Chat({ doctorId, patientId, messages: [] });
    }

    chat.messages.push(message); 
    await chat.save();


  io.to(room).emit("receive-message", message);;
  } catch (err) {
    console.error("Error saving message:", err);
  }
  })

socket.on("end-chat", async ({ room }) => {
  const [doctorId, patientId] = room.split("_");

  try {
    // Delete the chat from DB
    const deletedChat = await Chat.findOneAndDelete({ doctorId, patientId });
    await Session.findOneAndUpdate(
      { doctorId, patientId },
      { $set: { paid: false } }
    );
    if (deletedChat) {
      // System message to notify both users (not saved, just broadcasted)
      const systemMsg = {
        sender: "System",
        text: "This chat has been permanently ended by the doctor.",
        timeStamp: new Date(),
      };

      // Notify both sides in real-time
      io.to(room).emit("chat-ended", systemMsg);

      // Optionally also force clients to leave the room
      io.in(room).socketsLeave(room);
    }
  } catch (err) {
    console.error("Error ending chat:", err);
  }
});



  
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
})
server.listen(port, () => console.log(`🚀 Server running on port ${port}`));



  // users schema


  const UserSchema = new mongoose.Schema({
  uname: String,
  password:String,
  name: String,
  age: Number,
  cond: String,
  weight:Number,
  height:Number,
  logged :Boolean


});

const User = mongoose.model('users', UserSchema);

// doctors schema

const DoctorSchema = new mongoose.Schema({
  uid: Number,
  name: String,
  specialization: String,
  location: {
    lat: Number,
    lon: Number
  },
  rating: Number,
  phone: String,
  link:String,
});
const Doctor = mongoose.model('doctors', DoctorSchema);

// for register from register form
app.post('/register',async(req,res)=>{
    const{uname,password,name,age,cond,weight,height} = req.body;

    try {
        const existinguser = await User.findOne({uname})
        if (existinguser) {
            return res.status(400).json({ error: "User with this email already exists" });
        }
        const user = new User({uname,password,name,age,cond,weight,height,logged:false});
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
         res.status(500).json({ error: err.message });
    }
})

//for login 
app.post('/login',async (req,res)=>{

     const{uname,password} = req.body;
     try {
        const fuser = await User.findOne({uname})
        if(fuser){
            
            if(fuser.password == password){
                res.status(201).json({message: "correct"})
            }
            else{
                return res.status(400).json({error: "Wrong Password"})
                
            }
        }
        else{
            return res.status(400).json({error: "User not found"})
        }
     } catch (err) {
        res.status(500).json({ error: err.message });
     }
  

})




// to get doctors

app.get('/api/doctors', async (req, res) => {
  const { lat, lon, specialization } = req.query;
  if(!lat || !lon) return res.status(400).json({ error: "Location required" });

  try {
    let doctors = await Doctor.find(specialization ? { specialization } : {});

    doctors = doctors.map(doc => ({
      ...doc._doc,
      distance: getDistance(lat, lon, doc.location.lat, doc.location.lon)
    }));

    doctors.sort((a,b) => a.distance - b.distance || b.rating - a.rating);

    res.json(doctors);
  } catch(err) {
    res.status(500).json({ error: "Server error" });
  }
});


app.get("/doctor/:doctorId/:chats", async(req,res)=>{
  try {
    const {doctorId} = req.params;
    const chats = await Chat.find({ doctorId, ended: false });
        const result = chats.map((chat) => {
      const lastMessage =
        chat.messages.length > 0
          ? chat.messages[chat.messages.length - 1] // get last msg
          : null;

      return {
        patientId: chat.patientId,
        lastMessage: lastMessage ? lastMessage.text : "",
        lastSender: lastMessage ? lastMessage.sender : "",
        timeStamp: lastMessage ? lastMessage.timeStamp : null,
      };

    });
 res.json(result);
  } catch (err) {
    console.error("Error fetching doctor chats:", err);
    res.status(500).json({ error: "Server error" });
  }
})


app.post('/doclogin', async (req, res) => {
  const { uid } = req.body;
  try {
    const per = await Doctor.findOne({ uid });
    if (per) {
      return res.status(201).json({ uid, name: per.name }); // single object
    } else {
      return res.status(400).json({ error: "UID not found" });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

app.get('/getid',async(req,res)=>{
  const {uname} = req.query
  try {
    const per = await User.findOne({uname})
    
    if(per){
      console.log(per._id)
      return res.status(201).json({id: per._id})
    }
    else{
      return res.status(400).json({error: "error there"})
    }
  } catch (err) {
    return res.status(500).json({error: err.message})
  }
})

app.get("/patients/:uid/uname", async (req, res) => {
  try {
    const user = await User.findById(req.params.uid).select("uname");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ uname: user.uname });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});