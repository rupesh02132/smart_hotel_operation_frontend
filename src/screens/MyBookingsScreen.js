import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyBookings } from "../state/booking/Action";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { motion } from "framer-motion";
import {
  FaCalendarAlt,
  FaUsers,
  FaCreditCard,
  FaRupeeSign,
  FaMapMarkerAlt,
  FaQrcode,
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

/* Status Timeline */
const StatusTimeline = ({ status }) => {
  const steps = ["Booked", "checked-in", "checked-out"];
  const current = steps.indexOf(status);

  return (
    <div className="flex items-center gap-2 mt-2">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              i <= current ? "bg-emerald-400" : "bg-gray-600"
            }`}
          />
          {i < steps.length - 1 && (
            <div className="w-6 h-[2px] bg-gray-700" />
          )}
        </div>
      ))}
    </div>
  );
};

/* =======================
   MAIN SCREEN
======================= */

const MyBookingsScreen = () => {
  const dispatch = useDispatch();

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
    const id =
      typeof b.user === "string"
        ? b.user
        : b.user?._id;
    return id?.toString() === userId?.toString();
  });

  return (
    <div className="min-h-screen px-4 py-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0f172a] via-[#020617] to-black text-white">

      {/* HEADER */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
          My Bookings
        </h2>
        <p className="mt-3 text-gray-400">
          Track your stays, rooms and check-in status
        </p>
      </div>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : userBookings.length === 0 ? (
        <div className="text-center text-gray-400 mt-20">
          You have no bookings yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {userBookings.map((b, index) => {
            const room = b.room;
            const listing = room?.listing;
            const isPaid = b.paymentStatus === "paid";

            const image =
              room?.images?.[0] || "/no-image.png";

            return (
              <motion.div
                key={b._id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.07 }}
                whileHover={{ y: -8, scale: 1.03 }}
                className="relative rounded-3xl p-[1.5px] bg-gradient-to-br from-indigo-500/40 via-purple-500/40 to-pink-500/40 shadow-[0_0_40px_rgba(168,85,247,0.35)]"
              >
                <div className="h-full rounded-3xl bg-black/60 backdrop-blur-xl border border-white/10 overflow-hidden">

                  {/* IMAGE */}
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={image}
                      alt={room?.roomType}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                    {/* STATUS BADGE */}
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${
                          isPaid
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {isPaid ? "Confirmed" : "Pending"}
                      </span>
                    </div>

                    {/* TITLE */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-lg font-semibold text-white">
                        {listing?.title || "Hotel"}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-gray-300 mt-1">
                        <FaMapMarkerAlt className="text-indigo-400" />
                        {listing?.city}, {listing?.country}
                      </div>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="p-5 space-y-3 text-sm text-gray-300">

                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="text-indigo-400" />
                      <span>
                        {new Date(b.checkIn).toLocaleDateString()} –{" "}
                        {new Date(b.checkOut).toLocaleDateString()}
                      </span>
                      <span className="text-xs text-gray-400">
                        ({nightsBetween(b.checkIn, b.checkOut)} nights)
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FaUsers className="text-purple-400" />
                      <span>{b.guests} Guests</span>
                    </div>

                    <div className="flex items-center gap-2">
                      🏨
                      <span>
                        Room {room?.roomNumber} · Floor {room?.floor}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FaCreditCard className="text-pink-400" />
                      <span>{b.paymentMethod || "-"}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <FaRupeeSign className="text-emerald-400" />
                      <span className="font-semibold text-white">
                        ₹{b.totalPrice}
                      </span>
                    </div>

                    {/* STATUS TIMELINE */}
                    <StatusTimeline status={b.status} />

                    {/* ACTION ROW */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">

                      {isPaid ? (
                        <span className="text-emerald-300">
                          Booking ID: {b._id.slice(0, 8)}
                        </span>
                      ) : (
                        <span className="text-red-400">
                          Payment Pending
                        </span>
                      )}

                      {isPaid && b.status === "Booked" && (
                        <button
                          onClick={() =>
                            (window.location.href = `/qr-checkin/${b._id}`)
                          }
                          className="flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 transition"
                        >
                          <FaQrcode />
                          QR Check-in
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookingsScreen;