import React, { useState, useEffect } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../services/firebase";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notificationsRef = collection(db, "notifications");
        const querySnapshot = await getDocs(query(notificationsRef));
        const notificationList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotifications(notificationList);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen p-4">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Notifications
        </h2>
        {notifications.length === 0 ? (
          <p className="text-gray-600 text-center">No notifications available.</p>
        ) : (
          <ul className="space-y-4">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className="border rounded-md p-4 shadow-sm bg-gray-50"
              >
                <p className="text-gray-700 font-medium">{notification.message}</p>
                <p className="text-sm text-gray-500">
                  Date:{" "}
                  {new Date(notification.timestamp.seconds * 1000).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
