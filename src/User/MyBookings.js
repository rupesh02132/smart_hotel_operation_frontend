import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaHotel,
  FaCalendarAlt,
  FaEye,
  FaCheckCircle,
  FaClock,
  FaMapMarkerAlt,
  FaBed,
  FaReceipt
} from "react-icons/fa";

const MyBookings = ({ bookings = [], showViewAll = false }) => {
  // If showViewAll is false, only show first 3 bookings
  const displayBookings = showViewAll ? bookings : bookings.slice(0, 3);
  const hasMoreBookings = bookings.length > 3 && !showViewAll;
  if (bookings.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8 sm:py-12"
      >
        <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 mb-3">
          <FaReceipt className="text-2xl sm:text-3xl text-slate-600" />
        </div>
        <h3 className="text-sm sm:text-base font-semibold text-white mb-1">
          No Bookings Found
        </h3>
        <p className="text-slate-500 text-xs max-w-md mx-auto">
          You haven't made any bookings yet.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="w-full">
      {/* Desktop Table View (hidden on mobile) */}
      <div className="hidden lg:block">
        <div className="rounded-xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-2xl border border-white/10 shadow-xl overflow-hidden">
          {/* TABLE HEADER - Compact */}
          <div className="grid grid-cols-12 px-4 py-3 bg-white/5 border-b border-white/10">
            <div className="col-span-5">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold flex items-center gap-1.5">
                <FaHotel className="text-[10px]" />
                Room Details
              </p>
            </div>
            <div className="col-span-3">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold flex items-center gap-1.5">
                <FaCalendarAlt className="text-[10px]" />
                Dates
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Amount</p>
            </div>
            <div className="col-span-2">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold text-right">Action</p>
            </div>
          </div>

          {/* TABLE BODY */}
          <div className="divide-y divide-white/5">
            {displayBookings.map((booking, index) => {
              const room = booking.room;
              const listing = room?.listing;
              const isPaid = booking.paymentStatus === "paid";
              const imageSrc = room?.images?.[0] || "/no-image.png";

              return (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                  className="grid grid-cols-12 px-4 py-3 items-center transition-all duration-300"
                >
                  {/* ROOM + HOTEL */}
                  <div className="col-span-5 flex items-center gap-3">
                    <img
                      src={imageSrc}
                      alt={room?.roomType}
                      className="w-10 h-10 rounded-lg object-cover shadow-md"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white leading-tight truncate">
                        {listing?.title || "Luxury Hotel"}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div className="flex items-center gap-1">
                          <FaBed className="text-gray-500 text-[8px]" />
                          <span className="text-[10px] text-gray-400">Rm {room?.roomNumber}</span>
                        </div>
                        <span className="text-gray-600 text-[8px]">•</span>
                        <span className="text-[10px] text-gray-400">{room?.roomType}</span>
                      </div>
                    </div>
                  </div>

                  {/* DATES - Compact */}
                  <div className="col-span-3">
                    <p className="text-xs text-gray-200">
                      {formatDate(booking.checkIn)}
                    </p>
                    <p className="text-xs text-gray-500">
                      → {formatDate(booking.checkOut)}
                    </p>
                  </div>

                  {/* AMOUNT - Compact */}
                  <div className="col-span-2">
                    <p className="text-sm font-bold text-white">
                      ₹{booking.totalPrice?.toLocaleString()}
                    </p>
                    <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-medium mt-0.5 ${
                      isPaid ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'
                    }`}>
                      {isPaid ? <FaCheckCircle className="text-[8px]" /> : <FaClock className="text-[8px]" />}
                      {isPaid ? "Paid" : "Pending"}
                    </div>
                  </div>

                  {/* ACTION */}
                  <div className="col-span-2 text-right">
                    <Link
                      to={`/bookings/${booking._id}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-all group"
                    >
                      View
                      <FaEye className="text-[10px] group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Card View (visible on mobile) */}
      <div className="lg:hidden space-y-3">
        {displayBookings.map((booking, index) => {
          const room = booking.room;
          const listing = room?.listing;
          const isPaid = booking.paymentStatus === "paid";
          const imageSrc = room?.images?.[0] || "/no-image.png";

          return (
            <motion.div
              key={booking._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden"
            >
              <div className="flex p-3 gap-3">
                {/* Image */}
                <img
                  src={imageSrc}
                  alt={room?.roomType}
                  className="w-16 h-16 rounded-lg object-cover"
                />

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-semibold text-white truncate">
                        {listing?.title || "Luxury Hotel"}
                      </h3>
                      <div className="flex items-center gap-1 mt-0.5">
                        <FaMapMarkerAlt className="text-gray-500 text-[8px]" />
                        <p className="text-[9px] text-gray-400 truncate">
                          {listing?.city}
                        </p>
                      </div>
                    </div>
                    <div className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[8px] font-medium ${
                      isPaid ? 'bg-emerald-500/15 text-emerald-300' : 'bg-amber-500/15 text-amber-300'
                    }`}>
                      {isPaid ? <FaCheckCircle className="text-[7px]" /> : <FaClock className="text-[7px]" />}
                      {isPaid ? "Paid" : "Pending"}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-2">
                    <div>
                      <p className="text-[8px] text-gray-500">Room</p>
                      <p className="text-xs text-white font-medium">
                        {room?.roomType} #{room?.roomNumber}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] text-gray-500">Total</p>
                      <p className="text-sm font-bold text-white">
                        ₹{booking.totalPrice?.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/10">
                    <div className="flex items-center gap-1">
                      <FaCalendarAlt className="text-gray-500 text-[8px]" />
                      <span className="text-[9px] text-gray-400">
                        {formatDate(booking.checkIn)}
                      </span>
                    </div>
                    <Link
                      to={`/bookings/${booking._id}`}
                      className="text-indigo-400 text-[10px] font-medium hover:text-indigo-300"
                    >
                      View →
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* View All Button */}
      {hasMoreBookings && (
        <div className="text-center mt-4">
          <Link
            to="/mybookings"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-all border border-white/10"
          >
            View All ({bookings.length} bookings)
            <FaEye className="text-[10px]" />
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyBookings;

/* ================= UTIL ================= */
const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
      })
    : "-";