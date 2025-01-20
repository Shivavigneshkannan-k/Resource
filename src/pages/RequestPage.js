import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";

const RequestPage = ({ donationId }) => {
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  // Fetch donation data when the page loads
  useEffect(() => {
    const fetchDonation = async () => {
      try {
        const donationRef = doc(db, "donations", donationId);
        const donationSnapshot = await getDoc(donationRef);

        if (donationSnapshot.exists()) {
          setDonation(donationSnapshot.data());
        } else {
          console.log("Donation not found");
        }
      } catch (error) {
        console.error("Error fetching donation:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonation();
  }, [donationId]);

  const handleAcceptRequest = async () => {
    try {
      setIsAccepting(true);
      const donationRef = doc(db, "donations", donationId);

      // Set the donor's response message to "Accepted"
      await updateDoc(donationRef, {
        responseMessage: "Accepted",
      });

      // Delete all other requests for this donation item
      const requestsRef = collection(db, "donations", donationId, "requests");
      const q = query(requestsRef, where("status", "==", "pending"));

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (docSnap) => {
        await deleteDoc(docSnap.ref); // Delete each request
      });

      // Optionally, you could update the status of all the other requests to "rejected"
      console.log("Request accepted. All other requests deleted.");
    } catch (error) {
      console.error("Error accepting the request:", error);
    } finally {
      setIsAccepting(false);
    }
  };

  const handleRejectRequest = async () => {
    try {
      setIsRejecting(true);
      const donationRef = doc(db, "donations", donationId);

      // Set the donor's response message to "Rejected"
      await updateDoc(donationRef, {
        responseMessage: "Rejected",
      });

      console.log("Request rejected.");
    } catch (error) {
      console.error("Error rejecting the request:", error);
    } finally {
      setIsRejecting(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          View Request
        </h2>

        {donation ? (
          <div>
            <p className="font-medium text-gray-700 mb-2">Donation Type: {donation.type}</p>
            <p className="text-gray-600 mb-2">Location: {donation.location}</p>

            {/* Display the request message sent by the NGO */}
            {donation.requestedByNGO ? (
              <>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Request Message:
                </h3>
                <p className="text-gray-700 mb-4">{donation.requestMessage}</p>
              </>
            ) : (
              <p className="text-gray-600 mb-4">No request has been sent for this donation.</p>
            )}

            {/* Display the donor's response, if available */}
            {donation.responseMessage ? (
              <>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Donor's Response:
                </h3>
                <p className="text-gray-700 mb-4">{donation.responseMessage}</p>
              </>
            ) : (
              <p className="text-gray-600 mb-4">No response from the donor yet.</p>
            )}

            {/* Display the status of the request */}
            <div className="mt-4">
              <h3 className="font-medium text-gray-700">Request Status:</h3>
              <p className={`text-sm ${donation.requestedByNGO && !donation.responseMessage ? 'text-yellow-500' : donation.responseMessage ? 'text-green-500' : 'text-gray-500'}`}>
                {donation.requestedByNGO && !donation.responseMessage
                  ? "Waiting for donor's response..."
                  : donation.responseMessage
                  ? "Donation request accepted."
                  : "Donation request not yet sent."}
              </p>
            </div>

            {/* Action buttons for the donor */}
            {!donation.responseMessage && (
              <div className="mt-4 flex justify-around">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  onClick={handleAcceptRequest}
                  disabled={isAccepting}
                >
                  {isAccepting ? "Accepting..." : "Accept"}
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded"
                  onClick={handleRejectRequest}
                  disabled={isRejecting}
                >
                  {isRejecting ? "Rejecting..." : "Reject"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center text-gray-600">Donation details not found.</div>
        )}
      </div>
    </div>
  );
};

export default RequestPage;
