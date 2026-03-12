import React, { useEffect } from "react";

const getUserLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log("User location:", latitude, longitude);

        // Send to backend along with specialization
        fetch("/api/doctors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lat: latitude,
            lon: longitude,
            specialization: selectedSpecialization // from GPT response
          })
        })
        .then(res => res.json())
        .then(data => {
          // data contains nearby doctors
          console.log(data);
        });
      },
      (error) => {
        console.error("Error getting location:", error);
      }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
};


export default getUserLocation;