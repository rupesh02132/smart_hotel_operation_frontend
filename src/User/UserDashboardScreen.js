import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { getMyBookings } from "../state/booking/Action";
import Loader from "../components/Loader";
import Message from "../components/Message";
import MyBookings from "./MyBookings";
import { Link } from "react-router-dom";
import { 
  AutoAwesome, 
  ChevronRight, 
  TravelExplore, 
  ConfirmationNumber, 
  AccountCircle,
  AccountBalanceWallet,
  CalendarMonth,
  Stars
} from "@mui/icons-material";

const UserDashboardScreen = () => {
  const dispatch = useDispatch();

  /* ============================
      REDUX STATE (LOGIC UNCHANGED)
  ============================ */
  const { user } = useSelector((state) => state.auth);
  const { booking, loading, error } = useSelector((state) => state.bookings);

  const userId = user?.user?._id;
  const firstName = user?.user?.firstname || "Guest";

  useEffect(() => {
    dispatch(getMyBookings());
  }, [dispatch]);

  /* ============================
      FILTER LOGIC (LOGIC UNCHANGED)
  ============================ */
  const userBookings = useMemo(() => {
    if (!Array.isArray(booking)) return [];
    return booking.filter((b) => {
      const id = typeof b.user === "string" ? b.user : b.user?._id;
      return id?.toString() === userId?.toString();
    });
  }, [booking, userId]);

  const now = new Date();
  const upcoming = userBookings.filter(b => new Date(b.checkIn) > now && b.status !== "cancelled");
  const completed = userBookings.filter(b => new Date(b.checkOut) < now || b.status === "completed");
  const totalSpent = userBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 pb-20 font-sans selection:bg-indigo-500/30 overflow-x-hidden">
      
      {/* 2026 AMBIENT MESH LAYER */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[0%] right-[-5%] w-[40%] h-[40%] bg-blue-500/10 blur-[100px] rounded-full" />
        <div className="absolute top-[30%] left-[40%] w-[30%] h-[30%] bg-purple-600/5 blur-[80px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 pt-10 sm:pt-20">
        
        {/* ================= HEADER ================= */}
        <header className="mb-12 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Stars className="text-amber-400" sx={{ fontSize: 16 }} />
              <span className="text-amber-400 font-mono text-[10px] tracking-[0.4em] uppercase font-bold">Priority Status</span>
            </div>
            <h1 className="text-4xl sm:text-7xl font-black tracking-tighter leading-none italic bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500">
              Welcome back, {firstName}
            </h1>
            <p className="text-slate-500 mt-6 text-sm sm:text-xl max-w-2xl font-medium tracking-tight">
              Awaiting your next journey. Manage your smart ecosystem and historical stays below.
            </p>
          </motion.div>
        </header>

        {/* ================= STATS BENTO (Snap Scroll Mobile) ================= */}
        <div className="flex overflow-x-auto pb-8 gap-4 no-scrollbar snap-x snap-mandatory sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible">
          <StatCard icon={<ConfirmationNumber />} title="Stays" value={userBookings.length} gradient="from-indigo-500/20" />
          <StatCard icon={<CalendarMonth />} title="Upcoming" value={upcoming.length} gradient="from-blue-500/20" />
          <StatCard icon={<AutoAwesome />} title="Completed" value={completed.length} gradient="from-purple-500/20" />
          <StatCard icon={<AccountBalanceWallet />} title="Total Value" value={`₹${totalSpent.toLocaleString()}`} gradient="from-emerald-500/20" />
        </div>

        {/* ================= QUICK COMMANDS (Vertical Mobile Stack) ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16 sm:mb-24">
          <CommandTile icon={<TravelExplore />} label="Explore" sub="Discover 2026 Destinations" link="/" />
          <CommandTile icon={<ConfirmationNumber />} label="Reservations" sub="Active Stay Management" link="/my-bookings" />
          <CommandTile icon={<AccountCircle />} label="Identity" sub="Bio & Digital Preferences" link="/userProfile" />
        </div>

        {/* ================= RECENT STAYS (Glass Elevation) ================= */}
        <motion.section
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-[2.5rem] bg-[#0f172a]/30 backdrop-blur-3xl border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          <div className="p-8 sm:p-12 flex items-center justify-between border-b border-white/5">
            <div>
              <h2 className="text-xl sm:text-3xl font-black tracking-tight">Historical Data</h2>
              <p className="text-slate-500 text-xs mt-1">Showing latest synchronization results</p>
            </div>
            <Link to="/my-bookings" className="group h-10 w-10 sm:w-auto sm:px-6 rounded-full bg-white text-black flex items-center justify-center gap-2 text-xs font-bold transition-all hover:bg-indigo-500 hover:text-white">
              <span className="hidden sm:inline italic uppercase tracking-tighter">View Archive</span>
              <ChevronRight sx={{ fontSize: 16 }} />
            </Link>
          </div>

          <div className="p-4 sm:p-12 overflow-x-auto custom-scrollbar">
            {loading ? <div className="p-20 flex justify-center"><Loader /></div> : 
             error ? <Message variant="danger">{error}</Message> :
             userBookings.length === 0 ? <div className="p-20 text-center text-slate-600 font-bold uppercase tracking-widest italic opacity-30">Null_Result_Set</div> :
             <MyBookings bookings={userBookings.slice(0, 5)} />
            }
          </div>
        </motion.section>

      </div>
    </div>
  );
};

/* ================= COMPONENT: STAT CARD ================= */
const StatCard = ({ icon, title, value, gradient }) => (
  <motion.div
    whileHover={{ y: -8, scale: 1.02 }}
    className={`snap-center min-w-[280px] sm:min-w-0 flex-1 rounded-[2.5rem] p-8 border border-white/[0.08] bg-gradient-to-br ${gradient} to-transparent backdrop-blur-2xl relative overflow-hidden group shadow-xl`}
  >
    <div className="absolute -right-4 -top-4 p-8 opacity-5 group-hover:opacity-20 transition-all scale-150 rotate-12">
      {icon}
    </div>
    <div className="text-indigo-400 mb-6 group-hover:animate-pulse">{icon}</div>
    <p className="text-4xl font-black text-white tracking-tighter mb-1">{value}</p>
    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 italic">{title}</p>
  </motion.div>
);

/* ================= COMPONENT: COMMAND TILE ================= */
const CommandTile = ({ icon, label, sub, link }) => (
  <Link to={link}>
    <motion.div
      whileTap={{ scale: 0.96 }}
      className="group flex items-center justify-between p-7 rounded-[2rem] bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.06] hover:border-indigo-500/40 transition-all"
    >
      <div className="flex items-center gap-5">
        <div className="p-4 rounded-2xl bg-[#030712] text-indigo-400 border border-white/5 shadow-inner group-hover:shadow-indigo-500/20 transition-all">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-bold text-white leading-none">{label}</h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-2">{sub}</p>
        </div>
      </div>
      <ChevronRight className="text-slate-700 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
    </motion.div>
  </Link>
);

export default UserDashboardScreen;