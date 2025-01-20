import React, { useState } from "react";
import { useNavigate } from "react-router";
import { auth, db } from "../services/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../services/AuthContext"; 


const Login = () => {
  const { isAuthenticated,login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // New loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");  // Reset error state on new submit
    setLoading(true);  // Set loading to true when login starts
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      // console.log("Logged in user:", user); // Log the logged//-in user to check if the login is successful

      // Fetch user details from Firestore to determine user type
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        login();

        const userType = userDoc.data().userType;
        
        // console.log("User type from Firestore:", userType); // Log the userType from Firestore
        
        // Navigate to the appropriate dashboard based on userType
        if (userType === "donor") {
          navigate("/donor/dashboard");
        } else if (userType === "ngo") {
          navigate("/ngo/dashboard");
        } else {
          setError("Invalid user type.");
        }
      } else {
        setError("No user document found.");
      }
    } catch (err) {
      console.error("Error during login:", err);  // Log the error to the console for debugging
      if (err.code === 'auth/user-not-found') {
        setError("No user found with this email.");
      } else if (err.code === 'auth/wrong-password') {
        setError("Incorrect password.");
      } else {
        setError("Login failed: " + err.message);  // Provide more detailed error message
      }
    } finally {
      setLoading(false);  // Set loading to false once the login process is complete
    }
  };

  const handleDonorSignUp = () => {
    navigate("/register-donor");
  };

  const handleNGOSignUp = () => {
    navigate("/register-ngo");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center text-gray-800">
          Login
        </h1>
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md font-medium hover:bg-blue-600 transition"
            disabled={loading} // Disable the button when loading
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Sign-Up Section */}
        <div className="mt-6 text-center">
          <h3 className="text-sm text-gray-600">Don't have an account?</h3>
          <div className="flex justify-center space-x-4 mt-4">
            <button
              onClick={handleDonorSignUp}
              className="bg-green-500 text-white px-4 py-2 rounded-md font-medium hover:bg-green-600 transition"
            >
              Sign Up as Donor
            </button>
            <button
              onClick={handleNGOSignUp}
              className="bg-yellow-500 text-white px-4 py-2 rounded-md font-medium hover:bg-yellow-600 transition"
            >
              Sign Up as NGO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
