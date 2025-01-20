import React, { createContext, useState, useEffect } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false); // Set loading to false once auth state is resolved
    });

    return unsubscribe; // Cleanup subscription on unmount
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error during sign out:", error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {/* Only render children after loading is complete */}
      {!loading && children}
    </AuthContext.Provider>
  );
};
