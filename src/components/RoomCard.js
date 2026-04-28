import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FaBed, 
  FaUsers, 
  FaBath, 
  FaCheckCircle,
  FaChild, 
  FaWifi, 
  FaCoffee, 
  FaTv, 
  FaWind,
  FaShieldAlt,
  FaStar,
  FaMapMarkerAlt,
  FaArrowRight,
  FaBan,
  FaClock
} from "react-icons/fa";

const RoomCard = ({ room }) => {
  console.log("Rendering RoomCard for room:", room);

  const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;
  const imageSrc =
    room.images && room.images.length > 0
      ? room.images[0].startsWith("http")
        ? room.images[0]
        : `${SOCKET_URL}${room.images[0]}`
      : "/no-image.png";

  // Check if room is available for booking
  const isBookable = room.status === "Vacant" || room.status === "Ready";
  
  // Check if room is temporarily unavailable
  const isUnavailable = room.status === "Occupied" || 
                        room.status === "Cleaning" || 
                        room.status === "Maintenance" || 
                        room.status === "Blocked";

  const statusColors = {
    Vacant: "from-green-500 to-emerald-600",
    Ready: "from-emerald-500 to-green-600",
    Occupied: "from-red-500 to-red-700",
    Cleaning: "from-yellow-500 to-orange-600",
    Maintenance: "from-orange-600 to-red-600",
    Blocked: "from-gray-600 to-gray-700",
  };

  const statusMessages = {
    Vacant: "Available Now",
    Ready: "Available Now",
    Occupied: "Currently Occupied",
    Cleaning: "Being Prepared",
    Maintenance: "Under Maintenance",
    Blocked: "Temporarily Blocked",
  };

  const getRandomRating = () => {
    return (4 + Math.random()).toFixed(1);
  };

  const rating = getRandomRating();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full"
    >
      {isBookable ? (
        <Link
          to={`/booking/${room._id}`}
          className="block group h-full"
        >
          <RoomContent
            room={room}
            imageSrc={imageSrc}
            isBookable={isBookable}
            isUnavailable={isUnavailable}
            statusColors={statusColors}
            statusMessages={statusMessages}
            rating={rating}
          />
        </Link>
      ) : (
        <div className="block group h-full cursor-not-allowed opacity-80 hover:opacity-100 transition-opacity">
          <RoomContent
            room={room}
            imageSrc={imageSrc}
            isBookable={isBookable}
            isUnavailable={isUnavailable}
            statusColors={statusColors}
            statusMessages={statusMessages}
            rating={rating}
          />
        </div>
      )}
    </motion.div>
  );
};

const RoomContent = ({ room, imageSrc, isBookable, isUnavailable, statusColors, statusMessages, rating }) => {
  const getAmenityIcon = (amenity) => {
    const icons = {
      "WiFi": <FaWifi className="text-blue-400" />,
      "Air Conditioning": <FaWind className="text-cyan-400" />,
      "Mini Bar": <FaCoffee className="text-amber-600" />,
      "Room Service": <FaCoffee className="text-orange-400" />,
      "TV": <FaTv className="text-purple-400" />,
      "Safe Locker": <FaShieldAlt className="text-yellow-400" />,
    };
    return icons[amenity] || <FaCheckCircle className="text-green-400" />;
  };

  return (
    <div className="relative h-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/20">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <motion.img
          src={imageSrc}
          loading="lazy"
          alt={room.roomType}
          className="w-full h-full object-cover"
          whileHover={isBookable ? { scale: 1.1 } : {}}
          transition={{ duration: 0.5 }}
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Disabled Overlay for Unavailable Rooms */}
        {!isBookable && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
            <div className="text-center transform -rotate-12">
              <FaBan className="text-5xl sm:text-6xl text-red-500 mx-auto mb-2 opacity-80" />
              <p className="text-white font-bold text-sm sm:text-base bg-red-500/80 px-3 py-1 rounded-full">
                Not Available
              </p>
            </div>
          </div>
        )}
        
        {/* Price Badge - Only for available rooms */}
        {isBookable && (
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 z-10"
          >
            <div className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-xs sm:text-sm shadow-lg">
              ₹{room.finalPrice || room.basePrice}
              <span className="text-[10px] sm:text-xs font-normal"> /night</span>
            </div>
          </motion.div>
        )}

        {/* Status Badge */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10"
        >
          <div className={`px-2 sm:px-3 py-1 rounded-full bg-gradient-to-r ${statusColors[room.status] || "from-gray-500 to-gray-600"} text-white text-[10px] sm:text-xs font-semibold shadow-lg flex items-center gap-1`}>
            {!isBookable && <FaClock className="text-white text-[8px] sm:text-[10px]" />}
            {statusMessages[room.status] || room.status}
          </div>
        </motion.div>

        {/* Rating Badge - Only for available rooms */}
        {isBookable && (
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10">
            <div className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-black/60 backdrop-blur-lg text-[10px] sm:text-xs">
              <FaStar className="text-yellow-500 text-[8px] sm:text-xs" />
              <span className="text-white font-semibold">{rating}</span>
              <span className="text-gray-400 hidden xs:inline">(24)</span>
            </div>
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        {/* Room Type & Number */}
        <div className="flex justify-between items-start gap-1 sm:gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-lg md:text-xl font-bold text-white group-hover:text-indigo-400 transition-colors truncate">
              {room.roomType} Room
            </h3>
            <p className="text-gray-400 text-[10px] sm:text-xs flex items-center gap-1 mt-0.5">
              <FaMapMarkerAlt className="text-indigo-400 text-[8px] sm:text-xs" />
              <span className="truncate">Room #{room.roomNumber}</span>
            </p>
          </div>
          {isBookable && room.dynamicPrice && room.dynamicPrice !== room.basePrice && (
            <div className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg bg-indigo-500/20 border border-indigo-500/50 flex-shrink-0">
              <span className="text-indigo-400 text-[8px] sm:text-xs font-semibold whitespace-nowrap">Hot Deal</span>
            </div>
          )}
        </div>

        {/* Features Grid - Responsive 2x2 grid */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-lg bg-white/5">
            <FaUsers className="text-indigo-400 text-xs sm:text-sm" />
            <div>
              <p className="text-gray-500 text-[8px] sm:text-[10px]">Guests</p>
              <p className="text-white text-xs sm:text-sm font-semibold">{room.guests}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-lg bg-white/5">
            <FaBed className="text-indigo-400 text-xs sm:text-sm" />
            <div>
              <p className="text-gray-500 text-[8px] sm:text-[10px]">Beds</p>
              <p className="text-white text-xs sm:text-sm font-semibold">{room.beds}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-lg bg-white/5">
            <FaBath className="text-indigo-400 text-xs sm:text-sm" />
            <div>
              <p className="text-gray-500 text-[8px] sm:text-[10px]">Baths</p>
              <p className="text-white text-xs sm:text-sm font-semibold">{room.baths}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-lg bg-white/5">
            <FaChild className="text-indigo-400 text-xs sm:text-sm" />
            <div>
              <p className="text-gray-500 text-[8px] sm:text-[10px]">Children</p>
              <p className="text-white text-xs sm:text-sm font-semibold">{room.children}</p>
            </div>
          </div>
        </div>

        {/* Amenities Preview */}
        {room.amenities && room.amenities.length > 0 && isBookable && (
          <div className="flex flex-wrap gap-1">
            {room.amenities.slice(0, 3).map((a, i) => (
              <div
                key={i}
                className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 rounded-lg bg-white/5 border border-white/10"
                title={a}
              >
                {getAmenityIcon(a)}
                <span className="text-[8px] sm:text-[10px] text-gray-300 hidden sm:inline">{a}</span>
              </div>
            ))}
            {room.amenities.length > 3 && (
              <div className="px-1.5 sm:px-2 py-0.5 rounded-lg bg-white/5 border border-white/10">
                <span className="text-[8px] sm:text-[10px] text-gray-300">+{room.amenities.length - 3}</span>
              </div>
            )}
          </div>
        )}

        {/* Book Button */}
        <motion.button
          whileHover={isBookable ? { scale: 1.02 } : {}}
          whileTap={isBookable ? { scale: 0.98 } : {}}
          disabled={!isBookable}
          className={`relative w-full mt-2 py-2 sm:py-2.5 md:py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 sm:gap-2 transition-all overflow-hidden group ${
            isBookable
              ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:shadow-lg hover:shadow-indigo-500/50 cursor-pointer"
              : "bg-gradient-to-r from-gray-600 to-gray-700 text-gray-400 cursor-not-allowed"
          }`}
        >
          <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
            {isBookable ? (
              <FaCheckCircle className="text-green-300 text-xs sm:text-sm" />
            ) : (
              <FaBan className="text-red-400 text-xs sm:text-sm" />
            )}
            {isBookable ? "Book Now" : "Unavailable"}
            {isBookable && <FaArrowRight className="text-xs sm:text-sm group-hover:translate-x-1 transition-transform" />}
          </span>
          {isBookable && (
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          )}
        </motion.button>

        {/* Features Footer - Only for available rooms */}
        {isBookable && (
          <div className="flex flex-wrap justify-center gap-1.5 sm:gap-3 pt-1 text-[8px] sm:text-[10px] text-gray-500">
            <span className="whitespace-nowrap">✓ Free Cancellation</span>
            <span className="whitespace-nowrap hidden xs:inline">✓ Best Price</span>
            <span className="whitespace-nowrap">✓ Instant Confirmation</span>
          </div>
        )}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-tr from-blue-500/10 to-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
    </div>
  );
};

export default RoomCard;