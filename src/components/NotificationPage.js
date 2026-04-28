import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
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
  FaEnvelope,
  FaStar,
  FaTicketAlt,
  FaUsers,
  FaFilter,
} from "react-icons/fa";

const NotificationPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [filter, setFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const { notifications, loading } = useSelector(
    (s) => s.notification
  );

  useEffect(() => {
    dispatch(getMyNotifications());
  }, [dispatch]);

  const markRead = (id) => dispatch(markNotificationRead(id));
  const removeNotification = (id) => dispatch(deleteNotification(id));

  const openNotification = (n) => {
    if (!n.read) {
      markRead(n._id);
    }
    if (n.link) navigate(n.link);
  };

  const getIcon = (type) => {
    const icons = {
      booking: <FaCalendarCheck />,
      payment: <FaMoneyBill />,
      hotel: <FaHotel />,
      promotion: <FaStar />,
      ticket: <FaTicketAlt />,
      social: <FaUsers />,
    };
    return icons[type] || <FaBell />;
  };

  const getIconColor = (type) => {
    const colors = {
      booking: "from-blue-500 to-cyan-500",
      payment: "from-green-500 to-emerald-500",
      hotel: "from-purple-500 to-pink-500",
      promotion: "from-amber-500 to-orange-500",
      ticket: "from-red-500 to-rose-500",
      social: "from-indigo-500 to-purple-500",
    };
    return colors[type] || "from-gray-500 to-gray-600";
  };

  const formatTime = (date) => {
    const diff = (Date.now() - new Date(date)) / 1000;
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    });
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter === "read") return n.read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filterOptions = [
    { key: "all", label: "All", icon: <FaBell /> },
    { key: "unread", label: "Unread", icon: <FaEnvelope /> },
    { key: "read", label: "Read", icon: <FaCheckCircle /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0a0f1f] to-[#020617]">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-75"></div>
                <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-xl shadow-lg">
                  <FaBell size={24} className="text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Notifications
                </h1>
                <p className="text-gray-400 text-sm mt-0.5">
                  Stay updated with your latest activities
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 mb-6"
        >
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl p-3 text-center border border-white/10">
            <p className="text-2xl font-bold text-white">{notifications.length}</p>
            <p className="text-xs text-gray-400">Total</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-3 text-center border border-white/10">
            <p className="text-2xl font-bold text-blue-400">{unreadCount}</p>
            <p className="text-xs text-gray-400">Unread</p>
          </div>
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-3 text-center border border-white/10">
            <p className="text-2xl font-bold text-green-400">{notifications.length - unreadCount}</p>
            <p className="text-xs text-gray-400">Read</p>
          </div>
        </motion.div>

        {/* Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {filterOptions.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => setFilter(opt.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1 ${
                    filter === opt.key
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                      : "bg-white/10 text-gray-400 hover:bg-white/20"
                  }`}
                >
                  {opt.icon}
                  <span className="hidden sm:inline">{opt.label}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
            >
              <FaFilter className="text-gray-400 text-sm" />
            </button>
          </div>
        </motion.div>

        {/* Notifications List */}
        <AnimatePresence mode="wait">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton
                  key={i}
                  variant="rectangular"
                  height={100}
                  sx={{ bgcolor: "rgba(255,255,255,0.05)", borderRadius: "16px" }}
                />
              ))}
            </div>
          ) : filteredNotifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-16"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 mb-4">
                <FaBell className="text-3xl text-gray-500" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No notifications</h3>
              <p className="text-gray-400 text-sm">
                {filter !== "all" 
                  ? `No ${filter} notifications found` 
                  : "You're all caught up!"}
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              <AnimatePresence>
                {filteredNotifications.map((n, index) => (
                  <motion.div
                    key={n._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => openNotification(n)}
                    className={`relative group cursor-pointer rounded-2xl transition-all duration-300 ${
                      n.read
                        ? "bg-white/5 border border-white/10"
                        : "bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30"
                    }`}
                  >
                    {/* Unread Indicator */}
                    {!n.read && (
                      <div className="absolute -left-0 top-1/2 transform -translate-y-1/2 w-1 h-12 bg-gradient-to-b from-indigo-400 to-purple-500 rounded-r-full" />
                    )}

                    <div className="flex gap-4 p-4">
                      {/* Icon Circle */}
                      <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-r ${getIconColor(n.type)} flex items-center justify-center shadow-lg`}>
                        <div className="text-white text-xl">
                          {getIcon(n.type)}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className={`font-semibold text-sm sm:text-base ${
                            n.read ? "text-gray-300" : "text-white"
                          }`}>
                            {n.title}
                          </h3>
                          <span className="text-[10px] text-gray-500 whitespace-nowrap">
                            {formatTime(n.createdAt)}
                          </span>
                        </div>
                        
                        <p className="text-xs sm:text-sm text-gray-400 mt-1 line-clamp-2">
                          {n.message}
                        </p>
                        
                        {n.type && (
                          <div className="mt-2">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r ${getIconColor(n.type)}/20 text-${getIconColor(n.type).split(' ')[1]} capitalize`}>
                              {n.type}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {!n.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markRead(n._id);
                            }}
                            className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white transition"
                            title="Mark as read"
                          >
                            <FaCheckCircle size={12} />
                          </button>
                        )}
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(n._id);
                          }}
                          className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white transition"
                          title="Delete"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    </div>

                    {/* Hover Border Effect */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl border-2 border-indigo-500/50 pointer-events-none"
                      initial={{ opacity: 0, scale: 0.98 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        {notifications.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-6 text-center"
          >
            <p className="text-[10px] text-gray-600">
              Notifications are stored for 30 days
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;