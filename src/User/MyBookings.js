import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const MyBookings = ({ bookings = [] }) => {
  return (
    <div className="w-full overflow-x-auto">

      <div className="min-w-[900px] rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-[0_30px_120px_rgba(0,0,0,0.7)]">

        {/* TABLE HEADER */}
        <div className="grid grid-cols-12 px-6 py-4 border-b border-white/10 text-xs uppercase tracking-wider text-gray-400">
          <div className="col-span-4">Room</div>
          <div className="col-span-3">Dates</div>
          <div className="col-span-2">Amount</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-1 text-right">Action</div>
        </div>

        {/* TABLE BODY */}
        <div className="divide-y divide-white/5">

          {bookings.length === 0 && (
            <div className="px-6 py-10 text-center text-gray-400">
              No bookings found.
            </div>
          )}

          {bookings.map((booking, index) => {

            const room = booking.room;
            const listing = room?.listing;

            const isPaid = booking.paymentStatus === "paid";

            const imageSrc =
              room?.images?.[0] || "/no-image.png";

            return (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ scale: 1.01 }}
                className="grid grid-cols-12 px-6 py-5 items-center group hover:bg-white/5 transition-all duration-300"
              >

                {/* ROOM + HOTEL */}
                <div className="col-span-4 flex items-center gap-4">

                  <img
                    src={imageSrc}
                    alt={room?.roomType}
                    className="w-14 h-14 rounded-xl object-cover shadow-md group-hover:scale-105 transition"
                  />

                  <div>
                    <p className="text-sm font-semibold text-white leading-tight">
                      {listing?.title || "Hotel"}
                    </p>
                    <p className="text-xs text-gray-400">
                      Room {room?.roomNumber} • {room?.roomType}
                    </p>
                    <p className="text-xs text-gray-500">
                      {listing?.city}, {listing?.country}
                    </p>
                  </div>
                </div>

                {/* DATES */}
                <div className="col-span-3">
                  <p className="text-sm text-gray-200">
                    {formatDate(booking.checkIn)} →{" "}
                    {formatDate(booking.checkOut)}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {booking.guests} guests
                  </p>
                </div>

                {/* AMOUNT */}
                <div className="col-span-2">
                  <p className="text-sm font-semibold text-white">
                    ₹{booking.totalPrice}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {booking.paymentMethod || "-"}
                  </p>
                </div>

                {/* STATUS */}
                <div className="col-span-2">

                  <div className="flex flex-col gap-2">

                    {/* Payment Status */}
                    <span
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${
                        isPaid
                          ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                          : "bg-amber-500/15 text-amber-300 border-amber-500/30"
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full animate-pulse ${
                          isPaid
                            ? "bg-emerald-400"
                            : "bg-amber-400"
                        }`}
                      />
                      {isPaid ? "Paid" : "Pending"}
                    </span>

                    {/* Booking Status */}
                    <span className="text-xs text-gray-400">
                      {booking.status}
                    </span>

                  </div>
                </div>

                {/* ACTION */}
                <div className="col-span-1 text-right">
                  <Link
                    to={`/bookings/${booking._id}`}
                    className="text-sm font-medium text-indigo-300 hover:text-indigo-200 transition"
                  >
                    View →
                  </Link>
                </div>

              </motion.div>
            );
          })}
        </div>
      </div>
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
        year: "numeric",
      })
    : "-";