import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../services/firebase";
import Items from "../components/Items"; // Assuming Items displays donation details
import { auth } from "../services/firebase";

const DonationList = () => {
  const [donations, setDonations] = useState([]);
  const [filter, setFilter] = useState("all");
  const [ngoId, setNgoId] = useState(null);
  const [ngoCoordinates, setNgoCoordinates] = useState(null); // NGO coordinates
  const [ngoLocation, setNgoLocation] = useState(""); // NGO location input

  // Fetch current NGO ID (using auth)
  useEffect(() => {
    const fetchNgoId = async () => {
      const user = auth.currentUser;
      if (user) {
        setNgoId(user.uid); // Assuming user.uid is the NGO ID
      }
    };
    fetchNgoId();
  }, []);

  // Fetch donations from Firestore
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
          donorId: doc.data().donorId,
          coordinates: doc.data().coordinates, // Donor coordinates from Firestore
          ...doc.data(),
        }));
        setDonations(donationList);
      } catch (error) {
        console.error("Error fetching donations:", error);
      }
    };

    fetchDonations();
  }, [filter]);

  // Fetch NGO coordinates from location using OpenCage API
  const fetchCoordinates = async (address) => {
    try {
      const apiKey = "7e9dd312598e4d6cb649535f3218f399"; // Replace with your OpenCage API key
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          address
        )}&key=${apiKey}`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        setNgoCoordinates({ lat, lng }); // Store fetched coordinates
      } else {
        alert("Unable to fetch coordinates for the entered location.");
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      alert("Error fetching coordinates. Please try again.");
    }
  };

  // Calculate distance between two coordinates using the Haversine formula
  const calculateDistance = (coords1, coords2) => {
    const toRadians = (degrees) => (degrees * Math.PI) / 180;

    const R = 6371; // Earth's radius in kilometers
    const dLat = toRadians(coords2.lat - coords1.lat);
    const dLng = toRadians(coords2.lng - coords1.lng);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRadians(coords1.lat)) *
        Math.cos(toRadians(coords2.lat)) *
        Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(2); // Distance in kilometers (rounded to 2 decimal places)
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Donation List
        </h2>

        {/* Input for NGO location */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter NGO Location (to calculate distance):
          </label>
          <input
            type="text"
            value={ngoLocation}
            onChange={(e) => setNgoLocation(e.target.value)}
            placeholder="Enter your NGO location"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <button
            onClick={() => fetchCoordinates(ngoLocation)}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Get Coordinates
          </button>
        </div>

        {/* Filter donations */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by type:
          </label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="all">All</option>
            <option value="food">Food</option>
            <option value="clothes">Clothes</option>
            <option value="books">Books</option>
          </select>
        </div>

        {/* Render donation list */}
        <ul className="space-y-4">
          {donations.length > 0 ? (
            donations.map((donation) => {
              const distance =
                ngoCoordinates && donation.coordinates
                  ? calculateDistance(ngoCoordinates, donation.coordinates) // Calculate distance if both coordinates exist
                  : "30km approx."; // Default distance if coordinates are missing

              return (
                <Items
                  key={donation.id}
                  donation={{ ...donation, distance }} // Pass distance to Items component
                />
              );
            })
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
