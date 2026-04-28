import React from "react";
import {
  FaCalendarCheck,
  FaBed,
  FaDoorOpen,
  FaBroom,
  FaCheckDouble,
} from "react-icons/fa";

const steps = [
  { key: "Booked", label: "Booked", icon: <FaCalendarCheck /> },
  { key: "CheckedIn", label: "Checked In", icon: <FaBed /> },
  { key: "CheckedOut", label: "Checked Out", icon: <FaDoorOpen /> },
  { key: "Cleaning", label: "Cleaning", icon: <FaBroom /> },
  { key: "Completed", label: "Completed", icon: <FaCheckDouble /> },
];

const BookingTimeline = ({ status }) => {
  const currentIndex = steps.findIndex((step) => step.key === status);

  const getStatusMessage = () => {
    switch (status) {
      case "Booked":
        return "Booking confirmed. Awaiting check-in.";
      case "CheckedIn":
        return "Guest has checked in. Enjoy your stay!";
      case "CheckedOut":
        return "Guest checked out. Room will be cleaned.";
      case "Cleaning":
        return "Room is being prepared for next guest.";
      case "Completed":
        return "Stay completed successfully.";
      default:
        return "Status unknown";
    }
  };

  return (
    <div className="w-full py-4">
      {/* Desktop Timeline (horizontal) */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Background line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 rounded-full" />
          
          {/* Progress line */}
          <div
            className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
          />

          <div className="relative flex justify-between">
            {steps.map((step, idx) => {
              const isActive = idx <= currentIndex;
              const isCurrent = idx === currentIndex;
              return (
                <div key={step.key} className="flex flex-col items-center text-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-lg transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg"
                        : "bg-gray-300 dark:bg-gray-600"
                    } ${isCurrent ? "ring-4 ring-green-300 dark:ring-green-800" : ""}`}
                  >
                    {step.icon}
                  </div>
                  <p
                    className={`mt-2 text-xs font-semibold ${
                      isActive ? "text-green-600 dark:text-green-400" : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </p>
                  {isCurrent && (
                    <span className="text-[10px] text-gray-400 mt-1">Current</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Timeline (vertical) */}
      <div className="md:hidden">
        {steps.map((step, idx) => {
          const isActive = idx <= currentIndex;
          const isCurrent = idx === currentIndex;
          return (
            <div key={step.key} className="flex items-start gap-3 mb-4 relative">
              {/* Connector line */}
              {idx < steps.length - 1 && (
                <div
                  className={`absolute left-5 top-10 w-0.5 h-12 ${
                    idx < currentIndex ? "bg-green-500" : "bg-gray-300"
                  }`}
                />
              )}
              {/* Icon circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-lg z-10 ${
                  isActive
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg"
                    : "bg-gray-300 dark:bg-gray-600"
                } ${isCurrent ? "ring-4 ring-green-300" : ""}`}
              >
                {step.icon}
              </div>
              <div className="flex-1">
                <p className={`font-semibold ${isActive ? "text-green-600" : "text-gray-500"}`}>
                  {step.label}
                </p>
                {isCurrent && (
                  <p className="text-xs text-gray-400 mt-0.5">{getStatusMessage()}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Status summary card (optional) */}
      <div className="mt-6 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-center text-sm text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
        <span className="font-medium">Current status: </span>
        <span className="text-green-600 dark:text-green-400 font-semibold">
          {steps[currentIndex]?.label || status}
        </span>
        <p className="text-xs text-gray-500 mt-1">{getStatusMessage()}</p>
      </div>
    </div>
  );
};

export default BookingTimeline;