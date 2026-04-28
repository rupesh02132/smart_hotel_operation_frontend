import { useRef, useState, useEffect } from "react";
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaStar, 
  FaBed, 
  FaUsers,
  FaWifi,
  FaParking,
  FaHeart,
  FaBan,
  FaClock
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const SimilarRoomsSlider = ({ rooms = [] }) => {
  const sliderRef = useRef(null);
  const navigate = useNavigate();
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    
    const checkScroll = () => {
      const container = sliderRef.current;
      if (container) {
        setShowLeftArrow(container.scrollLeft > 20);
        setShowRightArrow(
          container.scrollLeft + container.clientWidth < container.scrollWidth - 20
        );
      }
    };

    const container = sliderRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      checkScroll();
      return () => {
        container.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', handleResize);
      };
    }
    return () => window.removeEventListener('resize', handleResize);
  }, [rooms]);

  const scroll = (dir) => {
    const container = sliderRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * (isMobile ? 0.9 : 0.8);
    const targetScroll = dir === "left" 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
  };

  const toggleFavorite = (e, roomId) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(roomId) 
        ? prev.filter(id => id !== roomId)
        : [...prev, roomId]
    );
  };

  // Check if room is bookable
  const isRoomBookable = (room) => {
    return room?.status === "Vacant" || room?.status === "Ready";
  };

  // Get status message
  const getStatusMessage = (status) => {
    const messages = {
      Vacant: "Available Now",
      Ready: "Ready for Check-in",
      Occupied: "Currently Occupied",
      Cleaning: "Being Prepared",
      Maintenance: "Under Maintenance",
      Blocked: "Temporarily Blocked"
    };
    return messages[status] || status;
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      Vacant: "from-green-500 to-emerald-600",
      Ready: "from-emerald-500 to-green-600",
      Occupied: "from-red-500 to-red-700",
      Cleaning: "from-yellow-500 to-orange-600",
      Maintenance: "from-orange-600 to-red-600",
      Blocked: "from-gray-600 to-gray-700"
    };
    return colors[status] || "from-gray-500 to-gray-600";
  };

  if (!rooms || rooms.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative mt-12 sm:mt-16 md:mt-20 mb-6 sm:mb-8 md:mb-10"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 sm:gap-4 mb-4 sm:mb-6 md:mb-8 px-2">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Similar Rooms
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            {rooms.length} rooms available • Prices may vary
          </p>
        </div>
        
        <div className="hidden sm:flex gap-2">
          <div className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 rounded-full bg-white/5 backdrop-blur-lg border border-white/10 text-xs sm:text-sm">
            🔥 Best Price Guarantee
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <AnimatePresence>
        {showLeftArrow && !isMobile && (
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-blue-600 hover:to-purple-600 text-white p-2 sm:p-3 md:p-4 rounded-full shadow-2xl transition-all duration-300 hidden lg:flex items-center justify-center border border-white/20"
          >
            <FaChevronLeft className="text-sm sm:text-base md:text-lg" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showRightArrow && !isMobile && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-blue-600 hover:to-purple-600 text-white p-2 sm:p-3 md:p-4 rounded-full shadow-2xl transition-all duration-300 hidden lg:flex items-center justify-center border border-white/20"
          >
            <FaChevronRight className="text-sm sm:text-base md:text-lg" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Slider Container */}
      <div
        ref={sliderRef}
        className="flex gap-3 sm:gap-4 md:gap-5 lg:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 scrollbar-hide"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#3b82f6 #1f2937'
        }}
      >
        {rooms.map((room, index) => {
          const image = room?.images?.[0] || "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400";
          const isFavorite = favorites.includes(room._id);
          const isBookable = isRoomBookable(room);
          const statusMessage = getStatusMessage(room?.status);
          const statusColor = getStatusColor(room?.status);

          return (
            <motion.div
              key={room._id}
              initial={{ opacity: 0, scale: 0.9, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              whileHover={isBookable ? { scale: 1.02, y: -5 } : {}}
              onHoverStart={() => isBookable && setHoveredCard(room._id)}
              onHoverEnd={() => setHoveredCard(null)}
              onClick={() => isBookable && navigate(`/booking/${room._id}`)}
              className={`min-w-[240px] xs:min-w-[260px] sm:min-w-[280px] md:min-w-[300px] lg:min-w-[320px] relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-300 snap-start group ${
                isBookable 
                  ? "cursor-pointer hover:shadow-2xl hover:shadow-indigo-500/20" 
                  : "cursor-not-allowed opacity-75"
              }`}
            >
              {/* Image Container */}
              <div className="relative h-40 xs:h-44 sm:h-48 md:h-52 lg:h-56 overflow-hidden">
                <motion.img
                  src={image}
                  alt={room?.roomType || "Room"}
                  loading="lazy"
                  className="w-full h-full object-cover"
                  whileHover={isBookable ? { scale: 1.1 } : {}}
                  transition={{ duration: 0.4 }}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Disabled Overlay for Unavailable Rooms */}
                {!isBookable && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                    <div className="text-center transform -rotate-12">
                      <FaBan className="text-4xl sm:text-5xl text-red-500 mx-auto mb-1 opacity-80" />
                      <p className="text-white font-bold text-xs sm:text-sm bg-red-500/80 px-2 py-1 rounded-full">
                        Not Available
                      </p>
                    </div>
                  </div>
                )}
                
                {/* Favorite Button - Only for bookable rooms */}
                {isBookable && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => toggleFavorite(e, room._id)}
                    className="absolute top-2 right-2 z-10 p-1.5 sm:p-2 rounded-full backdrop-blur-lg transition-all"
                    style={{
                      background: isFavorite ? "rgba(239, 68, 68, 0.9)" : "rgba(0, 0, 0, 0.5)"
                    }}
                  >
                    <FaHeart className={`text-sm sm:text-base ${isFavorite ? "text-white" : "text-gray-300"}`} />
                  </motion.button>
                )}

                {/* Status Badge */}
                <div className="absolute top-2 left-2 z-10">
                  <div className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-gradient-to-r ${statusColor} text-white text-[10px] sm:text-xs font-semibold shadow-lg flex items-center gap-1`}>
                    {!isBookable && <FaClock className="text-white text-[8px] sm:text-[10px]" />}
                    {statusMessage}
                  </div>
                </div>

                {/* Price Badge - Only for bookable rooms */}
                {isBookable && (
                  <div className="absolute bottom-2 right-2 z-10">
                    <div className="px-2 sm:px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-xs sm:text-sm shadow-lg">
                      ₹{room?.basePrice ?? "N/A"}
                      <span className="text-[8px] sm:text-[10px] font-normal"> /night</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Content Container */}
              <div className="p-3 sm:p-4 space-y-2">
                {/* Room Type & Number */}
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className={`text-sm sm:text-base md:text-lg font-bold truncate transition-colors ${
                      isBookable 
                        ? "text-white group-hover:text-yellow-400" 
                        : "text-gray-400"
                    }`}>
                      {room?.roomType || "Luxury Room"}
                    </h3>
                    <p className="text-gray-400 text-xs mt-0.5">
                      Room #{room?.roomNumber}
                    </p>
                  </div>
                  
                  {isBookable && room?.ratingAvg && (
                    <div className="flex items-center gap-0.5 sm:gap-1 bg-yellow-500/20 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg">
                      <FaStar className="text-yellow-500 text-xs sm:text-sm" />
                      <span className="text-yellow-500 font-bold text-xs sm:text-sm">
                        {room.ratingAvg.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="flex flex-wrap gap-2 sm:gap-3 text-gray-400 text-xs sm:text-sm">
                  <div className="flex items-center gap-1">
                    <FaUsers className="text-blue-400 text-xs sm:text-sm" />
                    <span>{room?.guests || 2}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaBed className="text-blue-400 text-xs sm:text-sm" />
                    <span>{room?.beds || 1}</span>
                  </div>
                  {room?.amenities?.includes("WiFi") && (
                    <div className="flex items-center gap-1">
                      <FaWifi className="text-blue-400 text-xs sm:text-sm" />
                    </div>
                  )}
                  {room?.amenities?.includes("Parking") && (
                    <div className="flex items-center gap-1">
                      <FaParking className="text-blue-400 text-xs sm:text-sm" />
                    </div>
                  )}
                </div>

                {/* Booking Section */}
                <motion.div
                  animate={{ opacity: hoveredCard === room._id && isBookable ? 1 : 0.5 }}
                  className="mt-2 pt-2 border-t border-gray-700"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] sm:text-xs text-gray-500">
                      {room?.dynamicPrice > 0 && room.dynamicPrice !== room.basePrice && isBookable
                        ? "⭐ Dynamic pricing"
                        : isBookable ? "Best rate" : "Currently unavailable"}
                    </span>
                    {isBookable ? (
                      <motion.div
                        whileHover={{ x: 3 }}
                        className="text-yellow-400 text-xs sm:text-sm font-semibold flex items-center gap-1"
                      >
                        Book Now →
                      </motion.div>
                    ) : (
                      <div className="text-red-400 text-xs sm:text-sm font-semibold flex items-center gap-1">
                        <FaBan className="text-xs" />
                        Not Available
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>

              {/* Hover Border Effect - Only for bookable rooms */}
              {isBookable && (
                <motion.div
                  className="absolute inset-0 border-2 border-yellow-500/50 rounded-2xl sm:rounded-3xl pointer-events-none"
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* View More Button */}
      {rooms.length > 3 && (
        <div className="flex justify-center mt-4 sm:mt-6 md:mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scroll("right")}
            className="px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <span className="hidden xs:inline">Explore More Rooms</span>
            <span className="xs:hidden">More Rooms</span>
            <FaChevronRight className="text-xs sm:text-sm" />
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default SimilarRoomsSlider;