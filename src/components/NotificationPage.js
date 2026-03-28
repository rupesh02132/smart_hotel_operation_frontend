import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Skeleton from "@mui/material/Skeleton";

import {
  getMyNotifications,
  markNotificationRead,
  deleteNotification,
} from "../state/notification/Action";

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
  const dispatch = useDispatch();

  const { notifications, loading } = useSelector(
    (s) => s.notification
  );

  useEffect(() => {
    dispatch(getMyNotifications());
  }, [dispatch]);

  const markRead = (id) => dispatch(markNotificationRead(id));
  const removeNotification = (id) =>
    dispatch(deleteNotification(id));

  const openNotification = (n) => {
    markRead(n._id);
    if (n.link) navigate(n.link);
  };

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

  const formatTime = (date) => {
    const diff = (Date.now() - new Date(date)) / 1000;
    if (diff < 60) return "Just now";
    if (diff < 3600)
      return Math.floor(diff / 60) + " mins ago";
    if (diff < 86400)
      return Math.floor(diff / 3600) + " hrs ago";
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4 sm:p-8">

      {/* ⭐ HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-green-100 text-green-600 p-3 rounded-xl shadow">
          <FaBell size={22} />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
          Notifications
        </h1>
      </div>

      {/* ⭐ LIST */}
      <div className="max-w-3xl mx-auto space-y-4">

        {loading &&
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={80}
              sx={{ borderRadius: 3 }}
            />
          ))}

        {!loading && notifications.length === 0 && (
          <div className="bg-white rounded-2xl p-10 text-center shadow">
            <FaBell className="mx-auto text-gray-300 text-5xl mb-3" />
            <p className="text-gray-500 font-semibold">
              No notifications yet
            </p>
          </div>
        )}

        {notifications.map((n) => (
          <div
            key={n._id}
            onClick={() => openNotification(n)}
            className={`relative flex gap-4 p-5 rounded-2xl cursor-pointer 
            backdrop-blur bg-white/70 shadow-md hover:shadow-xl 
            transition-all duration-300 border
            ${
              n.read
                ? "border-transparent"
                : "border-green-400"
            }`}
          >
            {/* unread strip */}
            {!n.read && (
              <div className="absolute left-0 top-0 h-full w-1 bg-green-500 rounded-l-2xl" />
            )}

            {/* icon circle */}
            <div className="flex items-center justify-center min-w-[46px] h-[46px] rounded-xl bg-green-100 text-green-600 text-xl shadow-inner">
              {getIcon(n.type)}
            </div>

            {/* content */}
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 text-[15px]">
                {n.title}
              </h3>

              <p className="text-sm text-gray-600 mt-[2px]">
                {n.message}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                {formatTime(n.createdAt)}
              </p>
            </div>

            {/* actions */}
            <div className="flex flex-col gap-3">

              {!n.read && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    markRead(n._id);
                  }}
                  className="text-green-600 hover:scale-110 transition"
                >
                  <FaCheckCircle />
                </button>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeNotification(n._id);
                }}
                className="text-red-500 hover:scale-110 transition"
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