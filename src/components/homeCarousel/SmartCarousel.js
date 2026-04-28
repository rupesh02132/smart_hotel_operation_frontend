import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaPlay, 
  FaPause,
  FaStar,
  FaGem,
  FaRocket,
  FaMapMarkedAlt,
  FaUsers,
  FaShieldAlt,
  FaRobot,
  FaGlobe
} from "react-icons/fa";

const slides = [
  { text: "Explore Luxury Hotels & Comfortable Stays Across the Globe", icon: <FaGlobe />, color: "from-blue-500 to-cyan-500" },
  { text: "AI-Powered Smart Search to Find Your Perfect Stay Instantly", icon: <FaRobot />, color: "from-purple-500 to-pink-500" },
  { text: "Real-Time Availability, Dynamic Pricing & Instant Booking", icon: <FaRocket />, color: "from-orange-500 to-red-500" },
  { text: "Discover Top Destinations, Hidden Gems & Verified Listings", icon: <FaMapMarkedAlt />, color: "from-green-500 to-emerald-500" },
  { text: "Trusted Reviews from Real Travelers for Better Decisions", icon: <FaUsers />, color: "from-yellow-500 to-orange-500" },
  { text: "Secure Payments with Instant Confirmation & Zero Hassle", icon: <FaShieldAlt />, color: "from-indigo-500 to-purple-500" },
  { text: "Personalized Recommendations Based on Your Travel Style", icon: <FaStar />, color: "from-pink-500 to-rose-500" },
  { text: "Book Anywhere, Anytime with Seamless User Experience", icon: <FaGem />, color: "from-teal-500 to-cyan-500" },
];

const SLIDES_LENGTH = slides.length;

export default function SmartCarousel() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const intervalRef = useRef(null);

  // Auto-slide with pause/resume
  useEffect(() => {
    clearInterval(intervalRef.current);

    if (!paused) {
      intervalRef.current = setInterval(() => {
        setIndex((prev) => (prev + 1) % SLIDES_LENGTH);
      }, 5000);
    }

    return () => clearInterval(intervalRef.current);
  }, [paused]);

  // Handle touch swipe for mobile
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left - next slide
      setIndex((index + 1) % SLIDES_LENGTH);
    }
    if (touchStart - touchEnd < -75) {
      // Swipe right - previous slide
      setIndex((index - 1 + SLIDES_LENGTH) % SLIDES_LENGTH);
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  const nextSlide = () => {
    setIndex((index + 1) % SLIDES_LENGTH);
    setPaused(false);
  };

  const prevSlide = () => {
    setIndex((index - 1 + SLIDES_LENGTH) % SLIDES_LENGTH);
    setPaused(false);
  };

  const togglePause = () => {
    setPaused(!paused);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative mt-6 sm:mt-8 md:mt-12 overflow-hidden"
    >
      {/* Main Carousel Container */}
      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="relative rounded-2xl sm:rounded-3xl overflow-hidden
          bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95
          border border-yellow-400/20
          shadow-[0_20px_60px_rgba(0,0,0,0.4)] hover:shadow-[0_30px_80px_rgba(0,0,0,0.6)]
          transition-all duration-500"
      >
        {/* Animated Background Glow */}
        <div className={`absolute inset-0 opacity-30 bg-gradient-to-r ${slides[index].color} blur-3xl transition-all duration-1000`} />
        
        {/* Gradient Borders */}
        <div className="absolute inset-0 rounded-2xl sm:rounded-3xl border-2 border-transparent bg-gradient-to-r from-yellow-400/20 to-orange-500/20" 
          style={{ mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)', maskComposite: 'exclude' }} 
        />
        
        {/* Content Container */}
        <div className="relative px-4 sm:px-8 md:px-12 py-8 sm:py-12 md:py-16">
          {/* Icon and Slide Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="text-center"
            >
              {/* Animated Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20
                  rounded-full bg-gradient-to-r ${slides[index].color} mb-4 sm:mb-6 md:mb-8 shadow-lg`}
              >
                <div className="text-white text-xl sm:text-2xl md:text-3xl">
                  {slides[index].icon}
                </div>
              </motion.div>

              {/* Slide Text */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-sm sm:text-lg md:text-2xl lg:text-3xl font-bold
                  bg-gradient-to-r from-white via-yellow-100 to-yellow-200 bg-clip-text text-transparent
                  tracking-wide leading-relaxed max-w-3xl mx-auto px-2"
              >
                {slides[index].text}
              </motion.h2>

              {/* Decorative Underline */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "60px" }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-4 sm:mt-6 md:mt-8 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full mx-auto"
              />
            </motion.div>
          </AnimatePresence>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 5, ease: "linear" }}
              key={index}
              className={`h-full bg-gradient-to-r ${slides[index].color}`}
            />
          </div>
        </div>

        {/* Navigation Arrows - Desktop */}
        <button
          onClick={prevSlide}
          className="hidden md:flex absolute left-3 lg:left-6 top-1/2 -translate-y-1/2
            bg-black/50 hover:bg-yellow-500/20 backdrop-blur-lg
            border border-white/10 hover:border-yellow-500/50
            w-10 h-10 lg:w-12 lg:h-12 rounded-full
            items-center justify-center
            transition-all duration-300 hover:scale-110 active:scale-95
            group"
        >
          <FaChevronLeft className="text-yellow-400 text-lg lg:text-xl group-hover:scale-110 transition-transform" />
        </button>

        <button
          onClick={nextSlide}
          className="hidden md:flex absolute right-3 lg:right-6 top-1/2 -translate-y-1/2
            bg-black/50 hover:bg-yellow-500/20 backdrop-blur-lg
            border border-white/10 hover:border-yellow-500/50
            w-10 h-10 lg:w-12 lg:h-12 rounded-full
            items-center justify-center
            transition-all duration-300 hover:scale-110 active:scale-95
            group"
        >
          <FaChevronRight className="text-yellow-400 text-lg lg:text-xl group-hover:scale-110 transition-transform" />
        </button>

        {/* Pause/Play Button */}
        <button
          onClick={togglePause}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6
            bg-black/50 hover:bg-yellow-500/20 backdrop-blur-lg
            border border-white/10 hover:border-yellow-500/50
            w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full
            flex items-center justify-center
            transition-all duration-300 hover:scale-110 active:scale-95
            z-20"
        >
          {paused ? (
            <FaPlay className="text-yellow-400 text-xs sm:text-sm md:text-base" />
          ) : (
            <FaPause className="text-yellow-400 text-xs sm:text-sm md:text-base" />
          )}
        </button>
      </div>

      {/* Dots Navigation */}
      <div className="flex justify-center gap-1.5 sm:gap-2 md:gap-3 mt-4 sm:mt-6 md:mt-8">
        {slides.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => {
              setIndex(i);
              setPaused(false);
            }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className={`cursor-pointer transition-all duration-300 rounded-full
              ${i === index
                ? `w-6 sm:w-8 md:w-12 h-1.5 sm:h-2 bg-gradient-to-r ${slides[i].color} shadow-lg`
                : "w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gray-600 hover:bg-gray-400"
              }`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="text-center mt-3 sm:mt-4 md:mt-6">
        <span className="text-xs sm:text-sm text-gray-500">
          {index + 1} / {SLIDES_LENGTH}
        </span>
      </div>

      {/* Mobile Swipe Hint */}
      <div className="md:hidden text-center text-[10px] sm:text-xs text-gray-500 mt-2 flex items-center justify-center gap-1">
        <span>👆 Swipe left/right</span>
        <span className="mx-1">•</span>
        <span>🎯 Tap to navigate</span>
      </div>

      {/* Keyboard Navigation Hint */}
      <div className="hidden md:block text-center text-xs text-gray-600 mt-4">
        <span>←  →  Use arrow keys to navigate</span>
      </div>
    </motion.div>
  );
}