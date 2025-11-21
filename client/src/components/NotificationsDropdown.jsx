import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "../services/api"; 

export default function NotificationsDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (open) fetchNotifications();
  }, [open]);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-full bg-indigo-600 text-white"
      >
        🔔
        {notifications.some((n) => !n.read) && (
          <span className="ml-1 bg-red-500 rounded-full w-2 h-2 inline-block" />
        )}
      </button>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-50 overflow-hidden"
        >
          {notifications.length === 0 ? (
            <div className="p-4 text-gray-500 dark:text-gray-300">
              No notifications
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => markAsRead(n._id)}
                className={`p-3 border-b cursor-pointer ${
                  !n.read ? "bg-indigo-50 dark:bg-gray-700" : ""
                }`}
              >
                {n.message}
              </div>
            ))
          )}
        </motion.div>
      )}
    </div>
  );
}
