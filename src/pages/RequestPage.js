import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firebase";

const ViewRequestPage = ({ donationId }) => {
  const [donation, setDonation] = useState(null);
  const [loading, setLoading] = useState(true);

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
            <p className="font-medium text-gray-700 mb-2">
              Donation Type: {donation.type}
            </p>
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
              <p className="text-gray-600 mb-4">
                No request has been sent for this donation.
              </p>
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
              <p className="text-gray-600 mb-4">
                No response from the donor yet.
              </p>
            )}

            {/* Display the status of the request */}
            <div className="mt-4">
              <h3 className="font-medium text-gray-700">Request Status:</h3>
              <p
                className={`text-sm ${
                  donation.requestedByNGO && !donation.responseMessage
                    ? "text-yellow-500"
                    : donation.responseMessage
                    ? "text-green-500"
                    : "text-gray-500"
                }`}>
                {donation.requestedByNGO && !donation.responseMessage
                  ? "Waiting for donor's response..."
                  : donation.responseMessage
                  ? "Donation request accepted."
                  : "Donation request not yet sent."}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-600">
            Donation details not found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewRequestPage;
