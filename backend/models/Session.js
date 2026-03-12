import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({
  doctorId: { type: String, required: true },
  patientId: { type: String, required: true },
  paid: { type: Boolean, default: false },
  orderId: { type: String },  
  linkId: { type: String },     // Cashfree orderId
  paymentId: { type: String },   
  paymentLink: { type : String },  // Cashfree payment reference
  createdAt: { type: Date, default: Date.now }
});

SessionSchema.index({ doctorId: 1, patientId: 1 }, { unique: true });

export default mongoose.model("Session", SessionSchema);