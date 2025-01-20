import React from "react";
import { useNavigate } from "react-router";

const NGODashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-green-600 text-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">NGO Dashboard</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Section */}
        <section className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Welcome to the NGO Dashboard!
          </h2>
          <p className="mt-2 text-gray-600">
            Thank you for your commitment to helping those in need. Manage
            donations and notifications efficiently to make a greater impact.
          </p>
        </section>

        {/* Quick Actions */}
        <section className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Quick Actions
          </h3>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate("/donations")}
              className="bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              View Available Donations
            </button>
            <button
              onClick={() => navigate("/notifications")}
              className="bg-green-500 text-white font-medium py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              Notifications
            </button>
          </div>
        </section>

        {/* Recent Activities */}
        <section className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Activities
          </h3>
          <ul className="divide-y divide-gray-200">
            <li className="py-4">
              <p className="text-gray-800">
                <span className="font-semibold">Food Donation:</span> Picked up
                from donor John Doe on{" "}
                <span className="italic">Jan 18, 2025</span>.
              </p>
            </li>
            <li className="py-4">
              <p className="text-gray-800">
                <span className="font-semibold">Clothes Donation:</span>{" "}
                Delivered to ABC Shelter on{" "}
                <span className="italic">Jan 12, 2025</span>.
              </p>
            </li>
            <li className="py-4">
              <p className="text-gray-800">
                <span className="font-semibold">Books Donation:</span> Allocated
                to XYZ Library on <span className="italic">Jan 8, 2025</span>.
              </p>
            </li>
          </ul>
        </section>

        {/* Motivation Section */}
        <section className="bg-green-100 shadow-md rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800">
            Together, We Make a Difference
          </h3>
          <p className="mt-2 text-gray-600">
            "Alone we can do so little; together we can do so much." – Helen
            Keller
          </p>
          <p className="mt-4 text-gray-600">
            Continue to transform lives through your dedication and service.
          </p>
        </section>
      </main>
    </div>
  );
};

export default NGODashboard;
