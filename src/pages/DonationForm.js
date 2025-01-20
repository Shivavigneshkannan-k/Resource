import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db, storage } from "../services/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const DonationForm = () => {
  const [formData, setFormData] = useState({
    type: "",
    description: "",
    location: "",
    coordinates: null,
    image: null,
  });
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);
  const auth = getAuth();

  const ngoCoordinates = { lat: 12.9716, lng: 77.5946 }; // Replace with your NGO's coordinates

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const fetchCoordinates = async (address) => {
    setIsFetchingLocation(true);
    try {
      const apiKey = "7e9dd312598e4d6cb649535f3218f399"; // Replace with your OpenCage API key
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          address
        )}&key=${"7e9dd312598e4d6cb649535f3218f399"}`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        setFormData((prev) => ({ ...prev, coordinates: { lat, lng } }));
        setIsFetchingLocation(false);
      } else {
        alert("Unable to fetch coordinates. Please check the location entered.");
        setIsFetchingLocation(false);
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      alert("Error fetching coordinates. Please try again.");
      setIsFetchingLocation(false);
    }
  };

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
    return R * c; // Distance in kilometers
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("You must be logged in to donate.");
        return;
      }

      if (!formData.coordinates) {
        alert("Please wait for the location coordinates to be fetched.");
        return;
      }

      const distance = calculateDistance(formData.coordinates, ngoCoordinates);

      let imageUrl = null;
      // Handle image upload if there's an image
      if (formData.image) {
        const imageRef = ref(storage, `donations/${formData.image.name}`);
        const uploadResult = await uploadBytes(imageRef, formData.image);
        imageUrl = await getDownloadURL(uploadResult.ref);
      }

      // Add donation data to Firestore
      await addDoc(collection(db, "donations"), {
        ...formData,
        imageUrl,
        donorId: user.uid,
        donorEmail: user.email,
        timestamp: new Date(),
        uid: user.uid,
        distance, // Store the calculated distance
      });
      alert("Donation submitted successfully!");
    } catch (error) {
      console.error("Error submitting donation:", error);
      alert("Error submitting donation. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-8 space-y-6">
      <h2 className="text-2xl font-semibold text-center text-gray-800">Donation Form</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700">Type of Donation:</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        >
          <option value="">Select a type</option>
          <option value="food">Food</option>
          <option value="clothes">Clothes</option>
          <option value="books">Books</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Location:</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={(e) => {
            handleInputChange(e);
            fetchCoordinates(e.target.value); // Fetch coordinates on input change
          }}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      {isFetchingLocation && (
        <p className="text-sm text-blue-500">Fetching coordinates for the entered location...</p>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Upload Image:</label>
        <input
          type="file"
          onChange={handleImageChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600"
        disabled={isFetchingLocation} // Disable the button while fetching location
      >
        Submit
      </button>
    </form>
  );
};

export default DonationForm;
