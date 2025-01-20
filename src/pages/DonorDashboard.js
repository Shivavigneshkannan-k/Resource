import React from "react";
import { useNavigate } from "react-router";

const DonorDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-500 text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Donor Dashboard</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        <section className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Welcome to the Donor Dashboard!
          </h2>
          <p className="mt-2 text-gray-600">
            Thank you for your generosity. Your donations are making a
            difference in the lives of those in need.
          </p>
        </section>

        {/* Quick Actions */}
        <section className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Quick Actions
          </h3>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate("/donation/form")}
              className="bg-green-500 text-white font-medium py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Donate Now
            </button>
            <button
              onClick={() => navigate("/requests")}
              className="bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View Requests
            </button>
          </div>
        </section>

        {/* Recent Donations */}
        <section className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Donations
          </h3>
          <ul className="divide-y divide-gray-200">
            <li className="py-4">
              <p className="text-gray-800">
                <span className="font-semibold">Food Donation:</span> Delivered
                to XYZ NGO on <span className="italic">Jan 15, 2025</span>.
              </p>
            </li>
            <li className="py-4">
              <p className="text-gray-800">
                <span className="font-semibold">Clothes Donation:</span>{" "}
                Distributed to ABC Shelter on{" "}
                <span className="italic">Jan 10, 2025</span>.
              </p>
            </li>
            <li className="py-4">
              <p className="text-gray-800">
                <span className="font-semibold">Books Donation:</span> Received
                by DEF Library on <span className="italic">Jan 5, 2025</span>.
              </p>
            </li>
          </ul>
        </section>

        {/* Motivation Section */}
        <section className="bg-blue-100 shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800">
            Every Donation Counts
          </h3>
          <p className="mt-2 text-gray-600">
            "The simplest acts of kindness are by far more powerful than a
            thousand heads bowing in prayer." – Mahatma Gandhi
          </p>
          <p className="mt-4 text-gray-600">
            Be the reason someone smiles today. Start donating now!
          </p>
        </section>
      </main>
    </div>
  );
};

export default DonorDashboard;
