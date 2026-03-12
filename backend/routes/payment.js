import express from "express";
import fetch from "node-fetch";
import Session from "../models/Session.js";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();

/**
 * ✅ Create Cashfree Order
 */
router.post("/create-order", async (req, res) => {
  const { doctorId, patientId, amount } = req.body;

  try {
    // 1. If session already paid, no need to create new order
    let sessionDoc = await Session.findOne({ doctorId, patientId });
    if (sessionDoc && sessionDoc.paid) {
      return res.json({
        alreadyPaid: true,
        redirectUrl: `/patient/${doctorId}/${patientId}`,
      });
    }

    // 2. Generate unique orderId
    const orderId = `doc_${doctorId}_pat_${patientId}_${Date.now()}`;

    // 3. Create order with Cashfree
    const response = await fetch("https://sandbox.cashfree.com/pg/links", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
       "x-client-id": process.env.CASHFREE_CLIENT_ID,
    "x-client-secret":process.env.CASHFREE_CLIENT_SECRET,
    "x-api-version": process.env.CASHFREE_API_VERSION,
        
      },
      body: JSON.stringify({
        link_id: orderId,
                link_amount: amount,
                link_currency: "INR",
                link_purpose: "Doctor Consultation",
        customer_details: {
          customer_id: patientId ,
            customer_name: "Arnav Singh",
          customer_email: "rinadevi2453@gmail.com", // replace with real email
          customer_phone: "8932028349",             // replace with real phone
        },
        order_meta: {
          return_url: `http://localhost:5173/payment-success?doctorId=${doctorId}&patientId=${patientId}&orderId=${orderId}`,
        },
      }),
    });

    const data = await response.json();
    console.log("Cashfree response:", data);
      const paymentLink = data.link_url;
    const linkId = data.link_id;

    // 4. Build Cashfree hosted payment link using payment_session_id
if (!sessionDoc) {
      sessionDoc = new Session({
        doctorId,
        patientId,
          paid: false,
        orderId,
        linkId,
        paymentLink,
      
      });
    } else {
      sessionDoc.orderId = orderId;
      sessionDoc.linkId = linkId;
      sessionDoc.paymentLink = paymentLink;
    }

    await sessionDoc.save();
    res.json({ paymentLink, linkId });
   


    // 5. Save session in DB

    // 6. Return hosted page link to frontend
  
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).send("Error creating Cashfree order");
  }
});
router.get("/check-link/:linkId", async (req, res) => {
  const { linkId } = req.params;

  try {
    const session = await Session.findOne({ linkId });
    if (!session) return res.status(404).json({ error: "Session not found" });

    // Cashfree API to get link details
    const resp = await fetch(`https://sandbox.cashfree.com/pg/links/${linkId}`, {
      headers: {
        "x-client-id":  process.env.CASHFREE_CLIENT_ID,
    "x-client-secret": process.env.CASHFREE_CLIENT_SECRET,
    "x-api-version": process.env.CASHFREE_API_VERSION,
      },
    });

    const data = await resp.json();
    if (data.link_status === "PAID") {
      session.paid = true;
      await session.save();
    }

    res.json({ paid: session.paid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to check link status" });
  }
});
/**
 * ✅ Cashfree Webhook
 */


/**
 * ✅ Check if session is paid
 */
router.get("/session/:doctorId/:patientId", async (req, res) => {
  try {
    const { doctorId, patientId } = req.params;
    const session = await Session.findOne({ doctorId, patientId });
    if (!session) {
      return res.json({ paid: false, paymentLink: null });
    }
    res.json({ 
      paid: session.paid,
      paymentLink: session.paymentLink || null
    });
  } catch (err) {
    console.error("Session check error:", err);
    res.status(500).json({ error: "Failed to fetch session" });
  }
});


export default router;
