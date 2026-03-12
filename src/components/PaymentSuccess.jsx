import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const doctorId = searchParams.get("doctorId");
    const patientId = searchParams.get("patientId");

    // After successful payment, redirect to chat
    if (doctorId && patientId) {
      navigate(`/patient/${doctorId}/${patientId}`);
    }
  }, [navigate, searchParams]);

  return <h2>Payment successful! Redirecting to chat...</h2>;
}
