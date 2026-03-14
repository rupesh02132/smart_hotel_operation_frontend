import React from "react";

const steps = ["Booked", "CheckedIn", "CheckedOut", "Cleaning", "Completed"];

const BookingTimeline = ({ status }) => {
  const currentIndex = steps.indexOf(status);

  return (
    <div className="flex justify-between items-center my-6">
      {steps.map((step, index) => (
        <div key={step} className="flex flex-col items-center w-full">
          {/* Line */}
          {index !== 0 && (
            <div
              className={`h-1 w-full ${
                index <= currentIndex ? "bg-green-500" : "bg-gray-300"
              }`}
            />
          )}

          {/* Circle */}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
              index <= currentIndex ? "bg-green-600" : "bg-gray-400"
            }`}
          >
            {index + 1}
          </div>

          {/* Label */}
          <span className="text-xs mt-1">{step}</span>
        </div>
      ))}
    </div>
  );
};

export default BookingTimeline;
