import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { getMyBookings } from "../state/booking/Action";
import Loader from "../components/Loader";
import Message from "../components/Message";
import MyBookings from "./MyBookings";
import React from "react";

import {
  ConfirmationNumber,
  CalendarMonth,
  AccountBalanceWallet,
  TravelExplore,
  AccountCircle,
  Stars,
  ChevronRight,
  Dashboard,
  TrendingUp,
  Hotel,
  EmojiEvents,
  ArrowForward,
  Celebration,
  ExpandMore,
  ExpandLess,
} from "@mui/icons-material";

const UserDashboardScreen = () => {
  const dispatch = useDispatch();
  const [greeting, setGreeting] = useState("");
  const [expandedSections, setExpandedSections] = useState({
    quickActions: true,
    recentBookings: true,
    loyalty: true,
  });

  const { user } = useSelector((s) => s.auth);
  const { booking, loading, error } = useSelector((s) => s.bookings);
  console.log("booking:", booking);

  const userId = user?.user?._id;
  const firstName = user?.user?.firstname || "Guest";

  useEffect(() => {
    dispatch(getMyBookings());
    
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
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

  const stats = [
    { icon: <ConfirmationNumber />, title: "Total Stays", value: userBookings.length, color: "from-blue-500 to-cyan-500", bg: "from-blue-500/20 to-cyan-500/20" },
    { icon: <CalendarMonth />, title: "Upcoming", value: upcoming.length, color: "from-purple-500 to-pink-500", bg: "from-purple-500/20 to-pink-500/20" },
    { icon: <Hotel />, title: "Completed", value: completed.length, color: "from-green-500 to-emerald-500", bg: "from-green-500/20 to-emerald-500/20" },
    { icon: <AccountBalanceWallet />, title: "Total Spent", value: `₹${totalSpent.toLocaleString()}`, color: "from-amber-500 to-orange-500", bg: "from-amber-500/20 to-orange-500/20" },
  ];

  const quickActions = [
    { icon: <TravelExplore />, label: "Explore Hotels", action: () => window.location.href = "/", color: "blue" },
    { icon: <ConfirmationNumber />, label: "My Bookings", action: () => {
      setExpandedSections(prev => ({ ...prev, recentBookings: !prev.recentBookings }));
    }, color: "purple" },
    { icon: <AccountCircle />, label: "Profile Settings", action: () => window.location.href = "/userProfile", color: "green" },
    { icon: <Dashboard />, label: "Dashboard", action: () => window.location.href = "/dashboard", color: "orange" },
  ];

  const recentBookings = userBookings.slice(0, 5);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0a0f1f] to-[#020617]">
      {/* Animated Background Pattern */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10 md:py-12">
        {/* HEADER SECTION */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 sm:mb-12 md:mb-16"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500">
                  <Stars sx={{ fontSize: 12, color: "white" }} />
                </div>
                <span className="text-amber-400 text-[10px] tracking-[0.25em] uppercase font-bold">
                  Priority Member
                </span>
                <div className="h-1 w-1 rounded-full bg-amber-400"></div>
                <span className="text-slate-400 text-[10px] tracking-wide">
                  {greeting}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight">
                <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                  Welcome back,
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {firstName}
                </span>
              </h1>

              <p className="text-slate-400 mt-3 sm:mt-4 text-xs sm:text-sm md:text-base max-w-xl leading-relaxed">
                Manage your bookings, track trips, and explore new destinations with exclusive member benefits.
              </p>
            </div>

            {/* Quick Stats Summary - Mobile */}
            <div className="flex gap-3 sm:hidden">
              <div className="bg-white/5 backdrop-blur rounded-xl px-3 py-2 text-center">
                <p className="text-xl font-bold text-blue-400">{userBookings.length}</p>
                <p className="text-[8px] text-slate-500">Stays</p>
              </div>
              <div className="bg-white/5 backdrop-blur rounded-xl px-3 py-2 text-center">
                <p className="text-xl font-bold text-green-400">{upcoming.length}</p>
                <p className="text-[8px] text-slate-500">Upcoming</p>
              </div>
            </div>
          </div>
        </motion.header>

        {/* MAIN GRID */}
        <div className="grid gap-5 sm:gap-6 md:gap-8">
          {/* STATS CARDS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5"
          >
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className={`relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 border border-white/10 bg-gradient-to-br ${stat.bg} backdrop-blur-sm group`}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                <div className="relative z-10">
                  <div className={`text-transparent bg-clip-text bg-gradient-to-r ${stat.color} mb-2 sm:mb-3`}>
                    {React.cloneElement(stat.icon, { sx: { fontSize: { xs: 24, sm: 28, md: 32 } } })}
                  </div>
                  <p className="text-xl sm:text-2xl md:text-3xl font-black text-white">
                    {stat.value}
                  </p>
                  <p className="text-[10px] sm:text-xs uppercase tracking-wider text-slate-400 mt-1 font-medium">
                    {stat.title}
                  </p>
                </div>
                
                <div className="absolute -bottom-8 -right-8 w-20 h-20 rounded-full bg-white/5 group-hover:scale-150 transition-transform duration-500"></div>
              </motion.div>
            ))}
          </motion.div>

          {/* QUICK ACTIONS - Collapsible */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="rounded-2xl bg-white/[0.05] backdrop-blur-xl border border-white/10 shadow-lg overflow-hidden"
          >
            <button
              onClick={() => toggleSection('quickActions')}
              className="w-full flex justify-between items-center p-4 sm:p-6 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-2">
                <TrendingUp sx={{ fontSize: 20, className: "text-slate-400" }} />
                <h2 className="text-sm sm:text-base font-semibold text-slate-300 uppercase tracking-wider">
                  Quick Actions
                </h2>
              </div>
              <div className="text-slate-400">
                {expandedSections.quickActions ? <ExpandLess /> : <ExpandMore />}
              </div>
            </button>
            
            <AnimatePresence>
              {expandedSections.quickActions && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 sm:p-6 pt-0">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                      {quickActions.map((action, idx) => (
                        <motion.button
                          key={idx}
                          whileHover={{ scale: 1.05, y: -4 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={action.action}
                          className={`group relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-white/10 bg-gradient-to-br from-${action.color}-500/10 to-${action.color}-600/5 backdrop-blur-sm cursor-pointer`}
                        >
                          <div className={`absolute inset-0 bg-gradient-to-r from-${action.color}-500 to-${action.color}-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                          
                          <div className="relative z-10 text-center">
                            <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br from-${action.color}-500/20 to-${action.color}-600/10 mb-2 group-hover:scale-110 transition-transform duration-300`}>
                              {React.cloneElement(action.icon, { sx: { fontSize: { xs: 20, sm: 24 } } })}
                            </div>
                            <p className="text-xs sm:text-sm font-semibold text-white group-hover:text-${action.color}-400 transition-colors">
                              {action.label}
                            </p>
                          </div>
                          
                          <ArrowForward className={`absolute bottom-2 right-2 text-${action.color}-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0`} sx={{ fontSize: 14 }} />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* BOOKINGS SECTION - Collapsible */}
          <section className="rounded-2xl sm:rounded-3xl bg-white/[0.05] backdrop-blur-xl border border-white/10 shadow-lg overflow-hidden">
            <button
              onClick={() => toggleSection('recentBookings')}
              className="w-full flex justify-between items-center p-4 sm:p-6 md:p-8 hover:bg-white/5 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Celebration sx={{ fontSize: 18, className: "text-amber-400" }} />
                  <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-white">
                    Recent Bookings
                  </h2>
                </div>
                <p className="text-slate-500 text-[10px] sm:text-xs text-left">
                  Your latest travel activity
                </p>
              </div>
              <div className="text-slate-400">
                {expandedSections.recentBookings ? <ExpandLess /> : <ExpandMore />}
              </div>
            </button>
            
            <AnimatePresence>
              {expandedSections.recentBookings && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 sm:p-6 md:p-8 pt-0">
                    {loading ? (
                      <div className="py-10 flex justify-center">
                        <Loader />
                      </div>
                    ) : error ? (
                      <Message variant="danger">{error}</Message>
                    ) : userBookings.length === 0 ? (
                      <div className="text-center py-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/5 mb-3">
                          <Hotel sx={{ fontSize: 32, className: "text-slate-600" }} />
                        </div>
                        <p className="text-slate-500 text-sm">No bookings yet</p>
                        <button
                          onClick={() => window.location.href = "/"}
                          className="inline-block mt-3 px-4 py-2 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-semibold hover:bg-indigo-500 hover:text-white transition-all"
                        >
                          Explore Hotels
                        </button>
                      </div>
                    ) : (
                      <MyBookings bookings={recentBookings} showViewAll={true} />
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Loyalty Progress Section - Collapsible */}
          {userBookings.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 overflow-hidden"
            >
              <button
                onClick={() => toggleSection('loyalty')}
                className="w-full flex justify-between items-center p-4 sm:p-5 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/20">
                    <EmojiEvents sx={{ fontSize: 24, className: "text-amber-400" }} />
                  </div>
                  <div className="text-left">
                    <p className="text-xs text-amber-400 font-semibold">Loyalty Status</p>
                    <p className="text-sm sm:text-base font-bold text-white">Gold Member</p>
                  </div>
                </div>
                <div className="text-slate-400">
                  {expandedSections.loyalty ? <ExpandLess /> : <ExpandMore />}
                </div>
              </button>
              
              <AnimatePresence>
                {expandedSections.loyalty && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 sm:p-5 pt-0">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="flex-1 max-w-md w-full">
                          <div className="flex justify-between text-xs text-slate-400 mb-1">
                            <span>Progress to Platinum</span>
                            <span>1,250 / 5,000 points</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: "25%" }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className="bg-gradient-to-r from-amber-400 to-orange-500 h-full rounded-full"
                            ></motion.div>
                          </div>
                        </div>
                        <button
                          onClick={() => window.location.href = "/loyalty"}
                          className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                        >
                          Learn More <ChevronRight sx={{ fontSize: 12 }} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboardScreen;