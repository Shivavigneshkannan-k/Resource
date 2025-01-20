import React, { useState } from "react";
import { auth, db } from "../services/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router";

const RegisterNGO = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ngoName, setNgoName] = useState("");
  const [contact, setContact] = useState("");
  const [userType] = useState("ngo"); // Set userType to "ngo" by default
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    // Validate contact number
    const contactRegex = /^[0-9]{10}$/;
    if (!contactRegex.test(contact)) {
      setError("Please enter a valid 10-digit contact number.");
      setIsLoading(false);
      return;
    }

    try {
      // Register the user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save user details in Firestore
      await setDoc(doc(db, "users", user.uid), {
        ngoName: userType === "ngo", // Only save ngoName for NGOs
        email,
        contact,
        userType, // Save the user type (donor or NGO)
      });

      // Reset form fields
      setEmail("");
      setPassword("");
      setNgoName("");
      setContact("");
      setSuccess("User registered successfully!");
      navigate('/')
    } catch (err) {
      // Handle Firebase errors
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered.");
      } else if (err.code === "auth/weak-password") {
        setError("Password should be at least 6 characters long.");
      } else {
        setError("Failed to register. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          Register as NGO
        </h2>
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Removed the userType dropdown since it's always "ngo" */}
          {userType === "ngo" && (
            <div>
              <label className="block text-sm font-medium text-gray-700">NGO Name</label>
              <input
                id="ngoName"
                type="text"
                value={ngoName}
                onChange={(e) => setNgoName(e.target.value)}
                required={userType === "ngo"}
                placeholder="Enter the name of your NGO"
                className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact</label>
            <input
              id="contact"
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              required
              placeholder="Enter your contact number"
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter a password"
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 text-white py-2 rounded-md font-medium hover:bg-blue-600 transition"
          >
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
        {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
        {success && <p className="text-green-500 text-sm mt-4 text-center">{success}</p>}
      </div>
    </div>
  );
};

export default RegisterNGO;
