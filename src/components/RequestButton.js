import React from "react";
import { db } from "../services/firebase";
import { addDoc, collection } from "firebase/firestore";

const RequestButton = ({ donationId, donorId, ngoId }) => {
  const handleRequest = async () => {
    try {
      const requestsRef = collection(db, "requests");

      // Create a new request document
      await addDoc(requestsRef, {
        donationId: donationId,
        donorId: donorId,
        ngoId: ngoId,
        status: "pending", // status can be "pending", "accepted", "rejected"
        timestamp: new Date()
      });

      alert("Request sent successfully!");
    } catch (error) {
      console.error("Error sending request:", error);
      alert("Failed to send request.");
    }
  };

  return (
    <button
      onClick={handleRequest}
      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition">
      Request Donation
    </button>
  );
};

export default RequestButton;
