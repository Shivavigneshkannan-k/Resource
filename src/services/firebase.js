import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyARYek9zSrOc_Z32qlXYbsP9e34PFFMaOI",
  authDomain: "resourceapp-cef70.firebaseapp.com",
  projectId: "resourceapp-cef70",
  storageBucket: "resourceapp-cef70.firebasestorage.app",
  messagingSenderId: "65290793491",
  appId: "1:65290793491:web:f1c686c39d48b03a83c5e6",
  measurementId: "G-5R2XKN06ZW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firestore, Auth, and Storage
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
