import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyBookings } from "../state/booking/Action";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaCalendarAlt,
  FaUsers,
  FaCreditCard,
  FaRupeeSign,
  FaMapMarkerAlt,
  FaBed,
  FaHotel,
  FaClock,
  FaEye,
  FaFilter,
  FaSearch,
  FaArrowRight,
} from "react-icons/fa";

/* =======================
   HELPERS
======================= */

const nightsBetween = (checkIn, checkOut) =>
  checkIn && checkOut
    ? Math.max(
        1,
        Math.ceil((new Date(checkOut) - new Date(checkIn)) / 86400000)
      )
    : 0;

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/* Status Timeline Component */
const StatusTimeline = ({ status }) => {
  const steps = [
    { key: "Booked", label: "Booked", icon: "📅" },
    { key: "checked-in", label: "Checked In", icon: "🏨" },
    { key: "checked-out", label: "Checked Out", icon: "✅" },
  ];
  const current = steps.findIndex(s => s.key === status);
  
  const getStatusColor = () => {
    if (status === "checked-out") return "text-green-400";
    if (status === "checked-in") return "text-amber-400";
    return "text-blue-400";
  };

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-2">
        <span className={`text-xs font-semibold ${getStatusColor()}`}>
          {status === "checked-out" ? "Completed" : status === "checked-in" ? "In Progress" : "Upcoming"}
        </span>
        <span className="text-xs text-gray-500">
          Step {current + 1} of {steps.length}
        </span>
      </div>
      <div className="flex items-center gap-1">
        {steps.map((s, i) => (
          <div key={s.key} className="flex-1">
            <div className="flex items-center">
              <div
                className={`w-full h-1.5 rounded-full transition-all duration-300 ${
                  i <= current ? "bg-gradient-to-r from-indigo-500 to-purple-500" : "bg-gray-700"
                }`}
              />
            </div>
            <div className="flex justify-center mt-1">
              <span className={`text-[10px] ${i <= current ? "text-indigo-400" : "text-gray-600"}`}>
                {s.icon}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* =======================
   MAIN SCREEN
======================= */

const MyBookingsScreen = () => {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { loading, error } = useSelector((state) => state.bookings);

  const booking = useSelector((store) =>
    Array.isArray(store.bookings.booking)
      ? store.bookings.booking
      : []
  );

  const userId = useSelector(
    (s) => s.auth?.user?.user?._id || ""
  );

  useEffect(() => {
    dispatch(getMyBookings());
  }, [dispatch]);

  const userBookings = booking.filter((b) => {
    const id = typeof b.user === "string" ? b.user : b.user?._id;
    return id?.toString() === userId?.toString();
  });

  // Apply filters
  const filteredBookings = userBookings.filter((b) => {
    if (filter === "upcoming") {
      return new Date(b.checkIn) > new Date();
    }
    if (filter === "ongoing") {
      const now = new Date();
      return new Date(b.checkIn) <= now && new Date(b.checkOut) >= now;
    }
    if (filter === "completed") {
      return new Date(b.checkOut) < new Date();
    }
    if (filter === "cancelled") {
      return b.status === "cancelled";
    }
    return true;
  }).filter((b) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      b.room?.listing?.title?.toLowerCase().includes(searchLower) ||
      b.room?.roomNumber?.toString().includes(searchTerm) ||
      b._id?.toLowerCase().includes(searchLower)
    );
  });

  const stats = {
    total: userBookings.length,
    upcoming: userBookings.filter(b => new Date(b.checkIn) > new Date()).length,
    ongoing: userBookings.filter(b => {
      const now = new Date();
      return new Date(b.checkIn) <= now && new Date(b.checkOut) >= now;
    }).length,
    completed: userBookings.filter(b => new Date(b.checkOut) < new Date()).length,
  };

  const filterOptions = [
    { key: "all", label: "All Bookings", icon: "📋" },
    { key: "upcoming", label: "Upcoming", icon: "🔜" },
    { key: "ongoing", label: "Ongoing", icon: "🏠" },
    { key: "completed", label: "Completed", icon: "✅" },
    { key: "cancelled", label: "Cancelled", icon: "❌" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0a0f1f] to-[#020617]">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 sm:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/50 mb-4">
            <FaHotel className="text-indigo-400 text-sm" />
            <span className="text-indigo-400 text-xs font-semibold">My Travels</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
            My Bookings
          </h1>
          <p className="mt-3 text-gray-400 text-sm sm:text-base">
            Track your stays, manage check-ins, and view booking history
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8"
        >
          <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl p-3 sm:p-4 text-center border border-white/10">
            <p className="text-2xl sm:text-3xl font-bold text-white">{stats.total}</p>
            <p className="text-xs text-gray-400">Total Bookings</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-3 sm:p-4 text-center border border-white/10">
            <p className="text-2xl sm:text-3xl font-bold text-blue-400">{stats.upcoming}</p>
            <p className="text-xs text-gray-400">Upcoming</p>
          </div>
          <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl p-3 sm:p-4 text-center border border-white/10">
            <p className="text-2xl sm:text-3xl font-bold text-amber-400">{stats.ongoing}</p>
            <p className="text-xs text-gray-400">Ongoing</p>
          </div>
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-3 sm:p-4 text-center border border-white/10">
            <p className="text-2xl sm:text-3xl font-bold text-green-400">{stats.completed}</p>
            <p className="text-xs text-gray-400">Completed</p>
          </div>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search by hotel, room number, or booking ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 outline-none text-sm"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition flex items-center gap-2 text-sm"
            >
              <FaFilter />
              Filters
            </button>
          </div>

          {/* Filter Chips */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 overflow-hidden"
              >
                <div className="flex flex-wrap gap-2">
                  {filterOptions.map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setFilter(opt.key)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                        filter === opt.key
                          ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                          : "bg-white/10 text-gray-400 hover:bg-white/20"
                      }`}
                    >
                      <span className="mr-1">{opt.icon}</span>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Bookings Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader />
          </div>
        ) : error ? (
          <div className="max-w-md mx-auto">
            <Message variant="danger">{error}</Message>
          </div>
        ) : filteredBookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 mb-4">
              <FaHotel className="text-3xl text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No bookings found</h3>
            <p className="text-gray-400 text-sm">
              {searchTerm || filter !== "all" 
                ? "Try adjusting your search or filters"
                : "You haven't made any bookings yet"}
            </p>
            {(searchTerm || filter !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilter("all");
                }}
                className="mt-4 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition text-sm"
              >
                Clear filters
              </button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
            <AnimatePresence>
              {filteredBookings.map((b, index) => {
                const room = b.room;
                const listing = room?.listing;
                const isPaid = b.paymentStatus === "paid";
                const isCancelled = b.status === "cancelled";
                const image = room?.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400";
                const nights = nightsBetween(b.checkIn, b.checkOut);

                return (
                  <motion.div
                    key={b._id}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -8 }}
                    className={`relative rounded-2xl overflow-hidden ${
                      isCancelled ? "opacity-75" : ""
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl" />
                    
                    <div className="relative h-full bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                      {/* IMAGE */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={image}
                          alt={room?.roomType}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                        {/* Status Badge */}
                        <div className="absolute top-3 right-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${
                              isCancelled
                                ? "bg-red-500/20 text-red-300 border border-red-500/30"
                                : isPaid
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            }`}
                          >
                            {isCancelled ? "Cancelled" : isPaid ? "Confirmed" : "Pending"}
                          </span>
                        </div>

                        {/* Hotel Info */}
                        <div className="absolute bottom-3 left-3 right-3">
                          <h3 className="text-lg font-bold text-white truncate">
                            {listing?.title || "Luxury Hotel"}
                          </h3>
                          <div className="flex items-center gap-1 text-xs text-gray-300 mt-0.5">
                            <FaMapMarkerAlt className="text-indigo-400 text-[10px]" />
                            <span className="truncate">{listing?.city}, {listing?.country}</span>
                          </div>
                        </div>
                      </div>

                      {/* CONTENT */}
                      <div className="p-4 space-y-3">
                        {/* Dates */}
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-indigo-400 text-xs" />
                            <span className="text-gray-300">
                              {formatDate(b.checkIn)}
                            </span>
                          </div>
                          <FaArrowRight className="text-gray-600 text-xs" />
                          <div className="flex items-center gap-2">
                            <span className="text-gray-300">
                              {formatDate(b.checkOut)}
                            </span>
                          </div>
                        </div>

                        {/* Nights and Guests */}
                        <div className="flex justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <FaClock className="text-purple-400 text-xs" />
                            <span className="text-gray-300">{nights} nights</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaUsers className="text-purple-400 text-xs" />
                            <span className="text-gray-300">{b.guests} guests</span>
                          </div>
                        </div>

                        {/* Room Info */}
                        <div className="flex items-center gap-2 text-sm">
                          <FaBed className="text-amber-400 text-xs" />
                          <span className="text-gray-300">
                            Room {room?.roomNumber} • {room?.roomType} • Floor {room?.floor}
                          </span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between pt-2 border-t border-white/10">
                          <div className="flex items-center gap-2">
                            <FaRupeeSign className="text-emerald-400 text-sm" />
                            <span className="text-white font-bold">
                              ₹{b.totalPrice?.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaCreditCard className="text-pink-400 text-xs" />
                            <span className="text-xs text-gray-400">{b.paymentMethod || "Card"}</span>
                          </div>
                        </div>

                        {/* Status Timeline */}
                        {!isCancelled && <StatusTimeline status={b.status} />}

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                          <Link
                            to={`/bookings/${b._id}`}
                            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-indigo-600/20 text-indigo-400 text-xs font-semibold hover:bg-indigo-600 hover:text-white transition-all"
                          >
                            <FaEye className="text-xs" />
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsScreen;