import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBell,
  FaCheckCircle,
  FaTrash,
  FaHotel,
  FaCalendarCheck,
  FaMoneyBill,
} from "react-icons/fa";

const NotificationPage = () => {
  const navigate = useNavigate();

  /* Mock Notifications (Replace with Redux later) */
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "booking",
      title: "Booking Confirmed",
      message: "Your Deluxe Room at Taj Hotel is confirmed.",
      time: "2 mins ago",
      read: false,
      link: "/booking/123",
    },
    {
      id: 2,
      type: "payment",
      title: "Payment Successful",
      message: "Payment of ₹4500 received.",
      time: "10 mins ago",
      read: false,
    },
    {
      id: 3,
      type: "hotel",
      title: "New Hotel Added",
      message: "A new hotel in Chennai is available.",
      time: "1 hour ago",
      read: true,
      link: "/listings",
    },
  ]);

  /* Mark Read */
  const markRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
  };

  /* Delete Notification */
  const deleteNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((n) => n.id !== id)
    );
  };

  /* Open Notification */
  const openNotification = (n) => {
    markRead(n.id);
    if (n.link) navigate(n.link);
  };

  /* Icon by type */
  const getIcon = (type) => {
    switch (type) {
      case "booking":
        return <FaCalendarCheck />;
      case "payment":
        return <FaMoneyBill />;
      case "hotel":
        return <FaHotel />;
      default:
        return <FaBell />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4 sm:p-6">

      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <FaBell className="text-green-600 text-2xl" />
        <h1 className="text-2xl font-bold text-gray-800">
          Notifications
        </h1>
      </div>

      {/* NOTIFICATION LIST */}
      <div className="space-y-3">

        {notifications.length === 0 && (
          <p className="text-center text-gray-500">
            No notifications
          </p>
        )}

        {notifications.map((n) => (
          <div
            key={n.id}
            className={`flex items-start justify-between gap-3 p-4 rounded-xl shadow-sm cursor-pointer transition ${
              n.read
                ? "bg-white"
                : "bg-green-50 border border-green-200"
            }`}
            onClick={() => openNotification(n)}
          >

            {/* LEFT ICON */}
            <div className="text-green-600 text-xl mt-1">
              {getIcon(n.type)}
            </div>

            {/* CONTENT */}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">
                {n.title}
              </h3>

              <p className="text-sm text-gray-600">
                {n.message}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                {n.time}
              </p>
            </div>

            {/* ACTIONS */}
            <div className="flex flex-col gap-2">

              {!n.read && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    markRead(n.id);
                  }}
                  className="text-green-600 hover:text-green-700"
                >
                  <FaCheckCircle />
                </button>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNotification(n.id);
                }}
                className="text-red-500 hover:text-red-600"
              >
                <FaTrash />
              </button>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPage;