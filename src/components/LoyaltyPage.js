import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  EmojiEvents,
  Star,
  Hotel,
  Flight,
  Restaurant,
  Spa,
  CardGiftcard,
  ArrowForward,
  ChevronRight,
  TrendingUp,
  Diamond,
  WorkspacePremium,
  MilitaryTech,
  AutoAwesome,
  Celebration,
  Loyalty as LoyaltyIcon,
} from "@mui/icons-material";

const LoyaltyPage = () => {
  const userPoints = 1250;
  const nextTierPoints = 5000;
  const progress = (userPoints / nextTierPoints) * 100;

  const tiers = [
    {
      name: "Silver",
      icon: <Star sx={{ fontSize: 40 }} />,
      points: 0,
      color: "from-gray-400 to-gray-500",
      bgColor: "from-gray-500/20 to-gray-600/20",
      benefits: [
        "5% bonus points on every booking",
        "Priority email support",
        "Exclusive member rates",
        "Early access to sales",
      ],
      achieved: true,
    },
    {
      name: "Gold",
      icon: <WorkspacePremium sx={{ fontSize: 40 }} />,
      points: 2500,
      color: "from-amber-400 to-yellow-500",
      bgColor: "from-amber-500/20 to-yellow-500/20",
      benefits: [
        "10% bonus points on every booking",
        "Priority phone support",
        "Room upgrade when available",
        "Late checkout (2 PM)",
        "Welcome amenity",
      ],
      achieved: userPoints >= 2500,
    },
    {
      name: "Platinum",
      icon: <Diamond sx={{ fontSize: 40 }} />,
      points: 10000,
      color: "from-blue-400 to-cyan-500",
      bgColor: "from-blue-500/20 to-cyan-500/20",
      benefits: [
        "15% bonus points on every booking",
        "24/7 dedicated concierge",
        "Guaranteed room upgrade",
        "4 PM late checkout",
        "Free breakfast",
        "Airport transfer discount",
      ],
      achieved: userPoints >= 10000,
    },
    {
      name: "Diamond",
      icon: <MilitaryTech sx={{ fontSize: 40 }} />,
      points: 25000,
      color: "from-purple-400 to-pink-500",
      bgColor: "from-purple-500/20 to-pink-500/20",
      benefits: [
        "20% bonus points on every booking",
        "Personal travel assistant",
        "Suite upgrade guaranteed",
        "6 PM late checkout",
        "Free breakfast + dinner",
        "Free airport transfer",
        "Birthday special gift",
      ],
      achieved: userPoints >= 25000,
    },
  ];

  const recentActivities = [
    { action: "Hotel Booking", points: 250, date: "2024-01-15", hotel: "Grand Plaza Hotel" },
    { action: "Room Upgrade", points: 100, date: "2024-01-10", hotel: "Grand Plaza Hotel" },
    { action: "Restaurant Dining", points: 50, date: "2024-01-08", hotel: "The Sky Lounge" },
    { action: "Spa Service", points: 75, date: "2024-01-05", hotel: "Serenity Spa" },
  ];

  const waysToEarn = [
    { icon: <Hotel />, title: "Hotel Bookings", points: "10 points per ₹100", color: "blue" },
    { icon: <Restaurant />, title: "Dining", points: "5 points per ₹100", color: "green" },
    { icon: <Spa />, title: "Spa Services", points: "8 points per ₹100", color: "purple" },
    { icon: <Flight />, title: "Flight Bookings", points: "15 points per ₹100", color: "orange" },
  ];

  const currentTier = tiers.find(t => t.achieved) || tiers[0];
  const nextTier = tiers.find(t => !t.achieved) || tiers[tiers.length - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0a0f1f] to-[#020617]">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-10 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 sm:mb-12"
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500">
              <LoyaltyIcon sx={{ fontSize: 12, color: "white" }} />
            </div>
            <span className="text-amber-400 text-[10px] tracking-[0.25em] uppercase font-bold">
              Loyalty Program
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
            <span className="bg-gradient-to-r from-white via-amber-100 to-yellow-200 bg-clip-text text-transparent">
              SmartHotel
            </span>
            <br />
            <span className="bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Rewards
            </span>
          </h1>
          <p className="text-slate-400 mt-3 sm:mt-4 text-xs sm:text-sm md:text-base max-w-2xl">
            Earn points, unlock exclusive benefits, and enjoy luxury experiences with every stay.
          </p>
        </motion.div>

        {/* Points Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-8"
        >
          <div className="rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500">
                  <EmojiEvents sx={{ fontSize: 40, color: "white" }} />
                </div>
                <div>
                  <p className="text-sm text-amber-400 font-semibold">Your Points Balance</p>
                  <p className="text-4xl sm:text-5xl font-black text-white">{userPoints.toLocaleString()}</p>
                  <p className="text-xs text-slate-400 mt-1">Loyalty Points</p>
                </div>
              </div>
              <div className="flex-1 max-w-md w-full">
                <div className="flex justify-between text-xs text-slate-400 mb-2">
                  <span>Progress to {nextTier.name}</span>
                  <span>{userPoints.toLocaleString()} / {nextTier.points.toLocaleString()} points</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(progress, 100)}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  {nextTier.points - userPoints} more points to reach {nextTier.name}
                </p>
              </div>
              <Link
                to="/book"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-semibold text-sm hover:shadow-lg transition-all flex items-center gap-2 whitespace-nowrap"
              >
                Earn More Points
                <ArrowForward sx={{ fontSize: 16 }} />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Current Tier Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <AutoAwesome sx={{ fontSize: 24, className: "text-amber-400" }} />
            Your Current Benefits
          </h2>
          <div className={`rounded-2xl bg-gradient-to-br ${currentTier.bgColor} border border-white/10 p-6 sm:p-8`}>
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-3 rounded-2xl bg-gradient-to-r ${currentTier.color}`}>
                {currentTier.icon}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">{currentTier.name} Member</h3>
                <p className="text-slate-400 text-sm">Unlock exclusive perks and privileges</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentTier.benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-center gap-2 text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tier Progression */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <TrendingUp sx={{ fontSize: 24, className: "text-amber-400" }} />
              Tier Progression
            </h2>
            <Link
              to="/benefits"
              className="text-amber-400 text-sm hover:text-amber-300 flex items-center gap-1"
            >
              Compare Tiers <ChevronRight sx={{ fontSize: 16 }} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tiers.map((tier, idx) => (
              <div
                key={idx}
                className={`relative rounded-xl p-4 transition-all ${
                  tier.achieved
                    ? `bg-gradient-to-br ${tier.bgColor} border border-${tier.color.split(' ')[1]}/50`
                    : "bg-white/5 border border-white/10"
                } ${idx === tiers.findIndex(t => t.name === currentTier.name) ? "ring-2 ring-amber-400" : ""}`}
              >
                {tier.achieved && (
                  <div className="absolute -top-2 -right-2">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  </div>
                )}
                <div className={`p-2 rounded-xl bg-gradient-to-r ${tier.color} w-fit mb-3`}>
                  {tier.icon}
                </div>
                <h3 className="text-lg font-bold text-white">{tier.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{tier.points.toLocaleString()}+ points</p>
                <div className="mt-3 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${tier.color}`}
                    style={{
                      width: tier.achieved ? "100%" : userPoints >= tier.points ? "100%" : "0%",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Ways to Earn Points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Celebration sx={{ fontSize: 24, className: "text-amber-400" }} />
            Ways to Earn Points
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {waysToEarn.map((way, idx) => (
              <div
                key={idx}
                className={`rounded-xl bg-gradient-to-br from-${way.color}-500/10 to-${way.color}-600/5 border border-white/10 p-5 hover:scale-105 transition-transform cursor-pointer`}
              >
                <div className={`p-2 rounded-lg bg-${way.color}-500/20 w-fit mb-3`}>
                  {way.icon}
                </div>
                <h3 className="text-white font-semibold mb-1">{way.title}</h3>
                <p className="text-xs text-slate-400">{way.points}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <CardGiftcard sx={{ fontSize: 24, className: "text-amber-400" }} />
              Recent Activity
            </h2>
            <Link
              to="/transactions"
              className="text-amber-400 text-sm hover:text-amber-300 flex items-center gap-1"
            >
              View All <ChevronRight sx={{ fontSize: 16 }} />
            </Link>
          </div>
          
          <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
            <div className="divide-y divide-white/10">
              {recentActivities.map((activity, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 hover:bg-white/5 transition">
                  <div>
                    <p className="text-white font-semibold text-sm">{activity.action}</p>
                    <p className="text-xs text-slate-400">{activity.hotel}</p>
                    <p className="text-xs text-slate-500">{activity.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-amber-400 font-bold">+{activity.points} pts</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-amber-400 font-semibold mb-2">How do I earn points?</h3>
                <p className="text-slate-400 text-sm">Earn points through hotel bookings, dining, spa services, and flight bookings. Every ₹100 spent earns you points based on the service type.</p>
              </div>
              <div>
                <h3 className="text-amber-400 font-semibold mb-2">How to redeem points?</h3>
                <p className="text-slate-400 text-sm">Points can be redeemed for free nights, room upgrades, dining vouchers, and exclusive experiences at any SmartHotel property.</p>
              </div>
              <div>
                <h3 className="text-amber-400 font-semibold mb-2">Do points expire?</h3>
                <p className="text-slate-400 text-sm">Points are valid for 24 months from the date of earning. Active members can extend validity through regular stays.</p>
              </div>
              <div>
                <h3 className="text-amber-400 font-semibold mb-2">How to upgrade tier?</h3>
                <p className="text-slate-400 text-sm">Accumulate points through eligible activities. Once you reach the required point threshold, you'll automatically upgrade to the next tier.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoyaltyPage;