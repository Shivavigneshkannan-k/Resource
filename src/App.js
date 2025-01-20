// App.js
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router"; // Correct import for React Router v6+
import { AuthProvider } from "./services/AuthContext"; // Adjust path as needed
import ProtectedRoute from "./components/ProtectedRoutes"; // Adjust path as needed
import Login from "./pages/Login";
import RegisterDonor from "./pages/RegisterDonor";
import DonorDashboard from "./pages/DonorDashboard";
import NGODashboard from "./pages/NGODashboard";
import DonationForm from "./pages/DonationForm";
import DonationList from "./pages/DonationList";
import RequestPage from "./pages/RequestPage";
import NotificationPage from "./pages/NotificationPage";
import RegisterNGO from "./pages/RegisterNGO";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/register-donor",
    element: <RegisterDonor />
  },
  {
    path: "/register-ngo",
    element: <RegisterNGO />
  },
  {
    path: "/donor/dashboard",
    element: (
      <ProtectedRoute>
        <DonorDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: "/ngo/dashboard",
    element: (
      <ProtectedRoute>
        <NGODashboard />
      </ProtectedRoute>
    )
  },
  {
    path: "/donation/form",
    element: (
      <ProtectedRoute>
        <DonationForm />
      </ProtectedRoute>
    )
  },
  {
    path: "/donations",
    element: (
      <ProtectedRoute>
        <DonationList />
      </ProtectedRoute>
    )
  },
  {
    path: "/requests",
    element: (
      <ProtectedRoute>
        <RequestPage />
      </ProtectedRoute>
    )
  },
  {
    path: "/notifications",
    element: (
      <ProtectedRoute>
        <NotificationPage />
      </ProtectedRoute>
    )
  }
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
