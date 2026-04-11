import { useEffect, useState, useRef } from "react";

const slides = [
  "Explore Luxury Hotels & Comfortable Stays Across the Globe",
  "AI-Powered Smart Search to Find Your Perfect Stay Instantly",
  "Real-Time Availability, Dynamic Pricing & Instant Booking",
  "Discover Top Destinations, Hidden Gems & Verified Listings",
  "Trusted Reviews from Real Travelers for Better Decisions",
  "Secure Payments with Instant Confirmation & Zero Hassle",
  "Personalized Recommendations Based on Your Travel Style",
  "Book Anywhere, Anytime with Seamless User Experience",
];

export default function SmartCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef(null);

  // ✅ FIXED interval (no stacking issue)
 useEffect(() => {
  clearInterval(intervalRef.current);

  if (!paused) {
    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
  }

  return () => clearInterval(intervalRef.current);
}, [paused]);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="relative mt-6 md:mt-10 overflow-hidden rounded-2xl md:rounded-3xl 
      border border-yellow-400/20 
      bg-gradient-to-br from-[#020617] via-[#020617] to-black 
      shadow-[0_10px_40px_rgba(0,0,0,0.6)] md:shadow-[0_20px_80px_rgba(0,0,0,0.6)] 
      backdrop-blur-xl"
    >
      {/* 🌟 Glow (lighter on mobile) */}
      <div className="absolute inset-0 opacity-20 md:opacity-30 bg-[radial-gradient(circle_at_20%_20%,#facc15,transparent_40%)]" />
      <div className="absolute inset-0 opacity-10 md:opacity-20 bg-[radial-gradient(circle_at_80%_80%,#facc15,transparent_40%)] animate-pulse" />

      {/* 🎞 Slides */}
      <div className="relative h-[100px] sm:h-[120px] md:h-[150px] flex items-center justify-center">
        {slides.map((text, i) => (
          <div
            key={i}
            className={`absolute transition-all duration-500 md:duration-700 
            ease-[cubic-bezier(0.22,1,0.36,1)]
            ${
              i === index
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 translate-y-4 md:translate-y-6"
            }`}
          >
            <div className="text-center px-4 sm:px-6 max-w-[90%] md:max-w-2xl mx-auto">
              <h2 className="text-sm sm:text-base md:text-2xl font-semibold 
              text-yellow-400 tracking-wide leading-snug md:leading-relaxed">
                {text}
              </h2>

              {/* underline */}
              <div className="mt-2 md:mt-3 h-[2px] w-12 md:w-20 mx-auto 
              bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full" />
            </div>
          </div>
        ))}
      </div>

      {/* ⬅️ Left Arrow (hidden on very small screens) */}
      <button
        onClick={() => setIndex((index - 1 + slides.length) % slides.length)}
        className="hidden sm:flex absolute left-2 md:left-4 top-1/2 -translate-y-1/2 
        bg-black/40 hover:bg-yellow-400/20 border border-white/10
        backdrop-blur-lg p-2 md:p-3 rounded-full transition-all duration-300 
        hover:scale-110 active:scale-95"
      >
        <span className="text-yellow-400 text-lg md:text-xl">❮</span>
      </button>

      {/* ➡️ Right Arrow */}
      <button
        onClick={() => setIndex((index + 1) % slides.length)}
        className="hidden sm:flex absolute right-2 md:right-4 top-1/2 -translate-y-1/2 
        bg-black/40 hover:bg-yellow-400/20 border border-white/10
        backdrop-blur-lg p-2 md:p-3 rounded-full transition-all duration-300 
        hover:scale-110 active:scale-95"
      >
        <span className="text-yellow-400 text-lg md:text-xl">❯</span>
      </button>

      {/* 🔘 Dots (thumb friendly) */}
      <div className="flex justify-center gap-2 md:gap-3 pb-4 md:pb-5">
        {slides.map((_, i) => (
          <div
            key={i}
            onClick={() => setIndex(i)}
            className={`cursor-pointer transition-all duration-300 
            ${
              i === index
                ? "w-6 md:w-10 h-2 bg-gradient-to-r from-yellow-300 to-yellow-500 shadow-lg"
                : "w-2 h-2 bg-gray-500 hover:bg-gray-300"
            } rounded-full`}
          />
        ))}
      </div>

      {/* 📱 Swipe Hint (mobile only) */}
      <div className="sm:hidden text-center text-[10px] text-gray-400 pb-2">
        Swipe to explore →
      </div>
    </div>
  );
}