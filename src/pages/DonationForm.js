import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../services/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../services/firebase"; // assuming you have initialized Firebase Storage

const DonationForm = () => {
  const [formData, setFormData] = useState({
    type: "",
    description: "",
    location: "",
    image: null,
  });
  const auth = getAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user) {
        alert("You must be logged in to donate.");
        return;
      }
      
      let imageUrl = null;
      
      // Handle image upload if there's an image
      if (formData.image) {
        const imageRef = ref(storage, `donations/${formData.image.name}`);
        const uploadResult = await uploadBytes(imageRef, formData.image);
        imageUrl = await getDownloadURL(uploadResult.ref);
      }

      // Add donation data to Firestore
      console.log("submitted");
      const docRef = await addDoc(collection(db, "donations"), {
        ...formData, // Spread form data (type, description, location, image)
        imageUrl: imageUrl, // Add image URL from Firebase Storage (if there's an image)
        donorId: user.uid, // Add the UID of the logged-in user
        donorEmail: user.email, // Add the email of the logged-in user
        timestamp: new Date(), // Add the current timestamp
      });
      
      alert("Donation submitted successfully!");
    } catch (error) {
      console.error("Error submitting donation:", error);
      alert("Error submitting donation. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-8 space-y-6"
    >
      <h2 className="text-2xl font-semibold text-center text-gray-800">Donation Form</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 ">
          Type of Donation:
        </label>
        <select
          name="type"
          value={formData.type}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 p-2 focus:border-blue-500"
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Location:</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

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
        className="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Submit
      </button>
    </form>
  );
};

export default DonationForm;
