import { motion } from "framer-motion";
import {
  FaCalendarCheck,
  FaBed,
  FaDoorOpen,
  FaCheckCircle,
  FaSpinner,
  FaClock,
  FaHotel,
} from "react-icons/fa";

const steps = [
  { 
    key: "booked", 
    label: "Booked", 
    icon: <FaCalendarCheck />,
    description: "Booking confirmed",
    color: "from-blue-500 to-cyan-500"
  },
  { 
    key: "checked-in", 
    label: "Checked In", 
    icon: <FaBed />,
    description: "Currently staying",
    color: "from-purple-500 to-pink-500"
  },
  { 
    key: "checked-out", 
    label: "Checked Out", 
    icon: <FaDoorOpen />,
    description: "Stay completed",
    color: "from-green-500 to-emerald-500"
  },
];

const BookingStatusTimeline = ({ status }) => {
  const currentIndex = steps.findIndex((s) => s.key === status);
  const isCompleted = currentIndex === steps.length - 1;
  const isStarted = currentIndex >= 0;

  // Get status message based on current step
  const getStatusMessage = () => {
    switch (status) {
      case "booked":
        return { text: "Your booking is confirmed! Get ready for your stay.", icon: <FaCheckCircle /> };
      case "checked-in":
        return { text: "You're currently staying. Enjoy your time!", icon: <FaHotel /> };
      case "checked-out":
        return { text: "Thank you for staying with us. Hope to see you again!", icon: <FaCheckCircle /> };
      default:
        return { text: "Booking status updated", icon: <FaClock /> };
    }
  };

  const statusMessage = getStatusMessage();

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm uppercase tracking-wider text-gray-400 font-semibold">
          Stay Progress
        </h4>
        {isStarted && !isCompleted && (
          <div className="flex items-center gap-1 text-xs text-amber-400">
            <FaSpinner className="animate-spin" />
            <span>In Progress</span>
          </div>
        )}
        {isCompleted && (
          <div className="flex items-center gap-1 text-xs text-green-400">
            <FaCheckCircle />
            <span>Completed</span>
          </div>
        )}
      </div>

      {/* Desktop Timeline */}
      <div className="hidden sm:block relative">
        {/* Connecting Line Background */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/10 rounded-full" />
        
        {/* Connecting Line Progress */}
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"
          style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        />

        <div className="relative flex items-center justify-between">
          {steps.map((step, i) => {
            const isActive = i <= currentIndex;
            const isCurrent = i === currentIndex;
            const isPast = i < currentIndex;

            return (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}
                className="flex flex-col items-center text-center relative z-10"
              >
                {/* Step Circle */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className={`relative w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                    isActive
                      ? `bg-gradient-to-r ${step.color} text-white shadow-lg shadow-${step.color.split(' ')[1]}/30`
                      : "bg-white/10 text-gray-500"
                  } ${isCurrent ? "ring-4 ring-white/20" : ""}`}
                >
                  {isPast && isActive && !isCurrent ? (
                    <FaCheckCircle className="text-white text-lg" />
                  ) : (
                    <span className="text-xl">{step.icon}</span>
                  )}
                  
                  {/* Pulse Animation for Current Step */}
                  {isCurrent && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/20 to-blue-500/20"
                    />
                  )}
                </motion.div>

                {/* Step Label */}
                <p className={`text-xs font-semibold mb-0.5 ${
                  isActive ? "text-white" : "text-gray-500"
                }`}>
                  {step.label}
                </p>
                
                {/* Step Description */}
                <p className={`text-[10px] ${
                  isActive ? "text-gray-400" : "text-gray-600"
                }`}>
                  {step.description}
                </p>

                {/* Connecting Dots for Mobile */}
                {i < steps.length - 1 && (
                  <div className="sm:hidden absolute top-6 left-[60%] w-full h-0.5 bg-white/10 -z-10" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Mobile Timeline - Vertical Layout */}
      <div className="sm:hidden space-y-4">
        {steps.map((step, i) => {
          const isActive = i <= currentIndex;
          const isCurrent = i === currentIndex;
          const isPast = i < currentIndex;

          return (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative flex items-start gap-3 p-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? `bg-gradient-to-r ${step.color}/10 border ${step.color.split(' ')[1]}/30`
                  : "bg-white/5 border border-white/10"
              }`}
            >
              {/* Timeline Line */}
              {i < steps.length - 1 && (
                <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-white/10" />
              )}
              
              {/* Step Icon */}
              <div className={`relative w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                isActive
                  ? `bg-gradient-to-r ${step.color} text-white`
                  : "bg-white/10 text-gray-500"
              } ${isCurrent ? "ring-2 ring-white/30" : ""}`}>
                {isPast && isActive && !isCurrent ? (
                  <FaCheckCircle className="text-white text-base" />
                ) : (
                  <span className="text-base">{step.icon}</span>
                )}
              </div>

              {/* Step Info */}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`text-sm font-semibold ${
                      isActive ? "text-white" : "text-gray-400"
                    }`}>
                      {step.label}
                    </p>
                    <p className={`text-xs mt-0.5 ${
                      isActive ? "text-gray-400" : "text-gray-500"
                    }`}>
                      {step.description}
                    </p>
                  </div>
                  {isCurrent && (
                    <div className="flex items-center gap-1">
                      <FaSpinner className="animate-spin text-amber-400 text-xs" />
                      <span className="text-[10px] text-amber-400">Current</span>
                    </div>
                  )}
                  {isPast && !isCurrent && (
                    <FaCheckCircle className="text-green-500 text-sm" />
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Status Message Card */}
      {isStarted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`mt-6 p-3 rounded-xl flex items-center gap-2 ${
            status === "checked-in"
              ? "bg-amber-500/10 border border-amber-500/30"
              : status === "checked-out"
              ? "bg-green-500/10 border border-green-500/30"
              : "bg-blue-500/10 border border-blue-500/30"
          }`}
        >
          <div className="text-lg">{statusMessage.icon}</div>
          <p className="text-xs text-gray-300 flex-1">{statusMessage.text}</p>
        </motion.div>
      )}

      {/* Progress Stats */}
      <div className="mt-4 pt-3 border-t border-white/10">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Progress</span>
          <span>{Math.round(((currentIndex + 1) / steps.length) * 100)}% Complete</span>
        </div>
        <div className="mt-1 w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.5 }}
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default BookingStatusTimeline;