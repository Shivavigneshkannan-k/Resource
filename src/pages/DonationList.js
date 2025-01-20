import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../services/firebase";
import Items from "../components/Items";
import { auth } from "../services/firebase"; // Assuming Firebase authentication is set up

const DonationList = () => {
  const [donations, setDonations] = useState([]);
  const [filter, setFilter] = useState("all");
  const [ngoId, setNgoId] = useState(null); // Store the logged-in NGO ID

  useEffect(() => {
    // Get the logged-in NGO ID from Firebase Auth (Assuming you're using Firebase Auth for login)
    const fetchNgoId = async () => {
      const user = auth.currentUser; // Get the current logged-in user
      if (user) {
        setNgoId(user.uid); // Assuming user.uid is the NGO ID
      }
    };
    fetchNgoId();
  }, []);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const donationsRef = collection(db, "donations");
        const q =
          filter === "all"
            ? donationsRef
            : query(donationsRef, where("type", "==", filter));
        const querySnapshot = await getDocs(q);
        const donationList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          donorId: doc.data().donorId, // Get donorId from the Firestore document
          ...doc.data()
        }));
        setDonations(donationList);
      } catch (error) {
        console.error("Error fetching donations:", error);
      }
    };

    fetchDonations();
  }, [filter]);

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Donation List
        </h2>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by type:
          </label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none">
            <option value="all">All</option>
            <option value="food">Food</option>
            <option value="clothes">Clothes</option>
            <option value="books">Books</option>
          </select>
        </div>
        <ul className="space-y-4">
          {donations.length > 0 ? (
            donations.map((donation) => (
              <Items
                key={donation.id}
                id={donation.id}
                location={donation.location}
                type={donation.type}
                description={donation.description}
                donorId={donation.donorId} // Pass donorId to Items
                ngoId={ngoId}               // Pass the logged-in NGO ID to Items
              />
            ))
          ) : (
            <li className="text-center text-gray-600">
              No donations available for the selected filter.
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DonationList;
