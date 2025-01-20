import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router"; // Note: Using 'react-router-dom' instead of 'react-router'
import Login from "./pages/Login";
import RegisterDonor from "./pages/RegisterDonor";
import DonorDashboard from "./pages/DonorDashboard";
import NGODashboard from "./pages/NGODashboard";
import DonationForm from "./pages/DonationForm";
import DonationList from "./pages/DonationList";
import RequestPage from "./pages/RequestPage";
import NotificationPage from "./pages/NotificationPage";
import ProtectedRoutes from "./components/ProtectedRoutes"; // Assuming you have a component for protected routes
import RegisterNGO from "./pages/RegisterNGO";

// Create routes
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
    element: <DonorDashboard />
  },
  {
    path: "/ngo/dashboard",
    element: <NGODashboard />
  },
  {
    path: "/donation/form",
    element: <DonationForm />
  },
  {
    path: "/donations",
    element: <DonationList />
  },
  {
    path: "/requests",
    element: <RequestPage />
  },
  {
    path: "/notifications",
    element: <NotificationPage />
  },
  // Redirect unknown routes to login
  {
    path: "*",
    element: <Login />
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
