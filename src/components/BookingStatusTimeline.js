import { motion } from "framer-motion";
import {
  FaCalendarCheck,
  FaBed,
  FaDoorOpen,
} from "react-icons/fa";

const steps = [
  { key: "booked", label: "Booked", icon: <FaCalendarCheck /> },
  { key: "checked-in", label: "Checked-In", icon: <FaBed /> },
  { key: "checked-out", label: "Checked-Out", icon: <FaDoorOpen /> },
];

const BookingStatusTimeline = ({ status }) => {
  const currentIndex = steps.findIndex((s) => s.key === status);

  return (
    <div>
      <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-4">
        Stay Progress
      </h4>

      <div className="flex items-center justify-between">
        {steps.map((step, i) => {
          const active = i <= currentIndex;

          return (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className="flex flex-col items-center text-center"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 ${
                  active
                    ? "bg-emerald-500 text-black"
                    : "bg-white/10 text-gray-400"
                }`}
              >
                {step.icon}
              </div>
              <p className="text-xs">{step.label}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default BookingStatusTimeline;
