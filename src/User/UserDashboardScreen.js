import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { getMyBookings } from "../state/booking/Action";
import Loader from "../components/Loader";
import Message from "../components/Message";
import MyBookings from "./MyBookings";
import { Link } from "react-router-dom";

import {
  ConfirmationNumber,
  CalendarMonth,
  AccountBalanceWallet,
  TravelExplore,
  AccountCircle,
  Stars,
  ChevronRight,
} from "@mui/icons-material";

const UserDashboardScreen = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((s) => s.auth);
  const { booking, loading, error } = useSelector((s) => s.bookings);
  console.log("booking:", booking);

  const userId = user?.user?._id;
  const firstName = user?.user?.firstname || "Guest";

  useEffect(() => {
    dispatch(getMyBookings());
  }, [dispatch]);

  const userBookings = useMemo(() => {
    if (!Array.isArray(booking)) return [];
    return booking.filter((b) => {
      const id = typeof b.user === "string" ? b.user : b.user?._id;
      return id?.toString() === userId?.toString();
    });
  }, [booking, userId]);

  const upcoming = userBookings.filter(
    (b) => new Date(b.checkIn) > new Date()
  );

  const completed = userBookings.filter(
    (b) => new Date(b.checkOut) < new Date()
  );

  const totalSpent = userBookings.reduce(
    (sum, b) => sum + (b.totalPrice || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] to-[#111827] text-white">
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-5 md:px-8 py-6 sm:py-10">

        {/* HEADER */}
        <header className="mb-8 sm:mb-12 md:mb-16">
          <div className="flex items-center gap-2 mb-2">
            <Stars className="text-amber-400" sx={{ fontSize: 14 }} />
            <span className="text-amber-400 text-[9px] tracking-[0.25em] uppercase font-bold">
              Priority Member
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
            Welcome back, {firstName}
          </h1>

          <p className="text-slate-400 mt-2 sm:mt-4 text-xs sm:text-sm md:text-base max-w-xl">
            Manage your bookings, track trips and review travel history.
          </p>
        </header>

        {/* MAIN GRID */}
        <div className="grid gap-4 sm:gap-6 md:gap-8">

          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
            <StatCard icon={<ConfirmationNumber />} title="Stays" value={userBookings.length} />
            <StatCard icon={<CalendarMonth />} title="Upcoming" value={upcoming.length} />
            <StatCard icon={<ConfirmationNumber />} title="Completed" value={completed.length} />
            <StatCard icon={<AccountBalanceWallet />} title="Spent" value={`₹${totalSpent}`} />
          </div>

          {/* COMMANDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            <CommandTile icon={<TravelExplore />} label="Explore" link="/" />
            <CommandTile icon={<ConfirmationNumber />} label="Bookings" link="/mybookings" />
            <CommandTile icon={<AccountCircle />} label="Profile" link="/userProfile" />
          </div>

          {/* BOOKINGS */}
          <section className="rounded-2xl sm:rounded-3xl bg-white/[0.05] backdrop-blur-xl border border-white/10 shadow-lg overflow-hidden">
            <div className="grid grid-cols-2 items-center p-3 sm:p-5 md:p-8 border-b border-white/10">
              <div>
                <h2 className="text-sm sm:text-lg md:text-2xl font-bold">
                  Recent Bookings
                </h2>
                <p className="text-slate-500 text-[10px] sm:text-xs">
                  Latest activity
                </p>
              </div>

              <div className="flex justify-end">
                <Link
                  to="/my-bookings"
                  className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white text-black text-[10px] sm:text-xs font-bold hover:bg-indigo-500 hover:text-white transition"
                >
                  View All
                </Link>
              </div>
            </div>

            <div className="p-3 sm:p-5 md:p-8 overflow-x-auto">
              {loading ? (
                <div className="py-10 flex justify-center">
                  <Loader />
                </div>
              ) : error ? (
                <Message variant="danger">{error}</Message>
              ) : userBookings.length === 0 ? (
                <p className="text-center text-slate-500 py-10 text-sm">
                  No bookings yet
                </p>
              ) : (
                <MyBookings bookings={userBookings.slice(0, 5)} />
              )}
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default UserDashboardScreen;

/* STAT CARD */
const StatCard = ({ icon, title, value }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="rounded-xl sm:rounded-2xl p-3 sm:p-5 md:p-6 border border-white/10 bg-white/[0.06]"
  >
    <div className="text-indigo-400 mb-1 sm:mb-2">{icon}</div>
    <p className="text-lg sm:text-2xl md:text-3xl font-black">{value}</p>
    <p className="text-[9px] sm:text-xs uppercase tracking-wider text-slate-400 mt-1">
      {title}
    </p>
  </motion.div>
);

/* COMMAND TILE */
const CommandTile = ({ icon, label, link }) => (
  <Link to={link}>
    <motion.div
      whileTap={{ scale: 0.96 }}
      className="grid grid-cols-[auto_1fr_auto] items-center gap-3 sm:gap-4 p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.07] transition"
    >
      <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-black/40 text-indigo-400 border border-white/10">
        {icon}
      </div>

      <span className="font-semibold text-sm sm:text-base">{label}</span>

      <ChevronRight className="text-slate-600 text-sm" />
    </motion.div>
  </Link>
);