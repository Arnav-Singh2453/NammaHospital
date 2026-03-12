import mongoose from "mongoose";
const messageSchema = new mongoose.Schema({
      sender: { type: String, enum: ["Doctor", "Patient", "System"], required: true },
   text: { type: String },      // optional now
  fileUrl: { type: String },   // optional
  fileName: { type: String },  // optional
  fileType: { type: String }, 
    timeStamp: {type:Date,default:Date.now},
})

const chatSchema = new mongoose.Schema({
    doctorId:{type:String,required:true},
    patientId:{type:String,required:true},
    messages:[messageSchema],
    ended: { type: Boolean, default: false }
})

export default mongoose.model("Chat", chatSchema);