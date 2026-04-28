import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

import Loader from "../components/Loader";
import Message from "../components/Message";
import RoomCard from "../components/RoomCard";

import { searchRooms } from "../state/room/Action";
import { 
  FaSearch, 
  FaCheckCircle,
  FaFilter, 
  FaBed, 
  FaDollarSign,
  FaWifi,
  FaWind,
  FaHotTub,
  FaCoffee,
  FaTv,
  FaShieldAlt,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaHotel,
  FaTag,
} from "react-icons/fa";

const AMENITIES_LIST = [
  "WiFi",
  "Air Conditioning",
  "Balcony",
  "Mini Bar",
  "Room Service",
  "TV",
  "Safe Locker",
];

const ROOM_TYPES = [
  "All Room Types",
  "Standard",
  "Deluxe",
  "Family",
  "Suite",
  "Double",
  "Single",
  "Presidential"
];

const HotelRoomsScreen = () => {
  const { hotelId } = useParams();
  const dispatch = useDispatch();

  const { rooms = [], loading, error } = useSelector(
    (state) => state.room
  );

  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [roomNumber, setRoomNumber] = useState("");
  const [roomType, setRoomType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [amenities, setAmenities] = useState([]);
  const [showFilters, setShowFilters] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setShowFilters(false);
      } else {
        setShowFilters(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    dispatch(
      searchRooms({
        hotelId,
        onlyAvailable,
        roomNumber,
        roomType,
        minPrice,
        maxPrice,
        amenities,
      })
    );
  }, [
    dispatch,
    hotelId,
    onlyAvailable,
    roomNumber,
    roomType,
    minPrice,
    maxPrice,
    amenities,
  ]);

  const toggleAmenity = (item) => {
    if (amenities.includes(item)) {
      setAmenities(amenities.filter((a) => a !== item));
    } else {
      setAmenities([...amenities, item]);
    }
  };

  const clearAllFilters = () => {
    setOnlyAvailable(false);
    setRoomNumber("");
    setRoomType("");
    setMinPrice("");
    setMaxPrice("");
    setAmenities([]);
  };

  const hasActiveFilters = onlyAvailable || roomNumber || roomType || minPrice || maxPrice || amenities.length > 0;

  const getAmenityIcon = (amenity) => {
    const iconMap = {
      "WiFi": <FaWifi className="text-blue-400" />,
      "Air Conditioning": <FaWind className="text-cyan-400" />,
      "Balcony": <FaHotTub className="text-green-400" />,
      "Mini Bar": <FaCoffee className="text-amber-600" />,
      "Room Service": <FaCoffee className="text-orange-400" />,
      "TV": <FaTv className="text-purple-400" />,
      "Safe Locker": <FaShieldAlt className="text-yellow-400" />,
    };
    return iconMap[amenity] || <FaCheckCircle className="text-green-400" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05070f] via-[#0a0f1f] to-black text-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-900/50 to-purple-900/50 overflow-hidden">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/50 mb-4">
              <FaHotel className="text-indigo-400 text-sm" />
              <span className="text-indigo-400 text-xs sm:text-sm font-semibold">Luxury Stays</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-3 bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
              Discover Your Perfect Room
            </h1>
            <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
              Browse through our curated collection of luxurious rooms and find your perfect match
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Mobile Filter Toggle */}
        {isMobile && (
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setShowFilters(!showFilters)}
            className="w-full mb-4 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center gap-2 font-semibold"
          >
            <FaFilter />
            {showFilters ? "Hide Filters" : "Show Filters"}
            {showFilters ? <FaChevronUp /> : <FaChevronDown />}
          </motion.button>
        )}

        {/* Filters Section */}
        <AnimatePresence mode="wait">
          {(showFilters || !isMobile) && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="mb-8 sm:mb-12"
            >
              <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
                  <div className="flex items-center gap-2">
                    <FaFilter className="text-indigo-400 text-lg sm:text-xl" />
                    <h2 className="text-lg sm:text-xl font-bold">Filter Rooms</h2>
                  </div>
                  {hasActiveFilters && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={clearAllFilters}
                      className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition"
                    >
                      <FaTimes className="text-xs" />
                      Clear all filters
                    </motion.button>
                  )}
                </div>

                {/* Main Filters Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {/* Search by Room Number */}
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                      type="text"
                      placeholder="Search room number..."
                      value={roomNumber}
                      onChange={(e) => setRoomNumber(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 sm:py-3 rounded-xl bg-black/40 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                    />
                  </div>

                  {/* Room Type Select */}
                  <div className="relative">
                    <FaBed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                    <select
                      value={roomType}
                      onChange={(e) => setRoomType(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 sm:py-3 rounded-xl bg-black/40 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all appearance-none cursor-pointer text-sm"
                    >
                      {ROOM_TYPES.map((type) => (
                        <option key={type} value={type === "All Room Types" ? "" : type} className="bg-gray-900">
                          {type}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <FaChevronDown className="text-gray-400 text-xs" />
                    </div>
                  </div>

                  {/* Availability Toggle */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setOnlyAvailable(!onlyAvailable)}
                    className={`relative py-2.5 sm:py-3 rounded-xl font-semibold transition-all overflow-hidden group ${
                      onlyAvailable 
                        ? "bg-gradient-to-r from-green-500 to-emerald-600" 
                        : "bg-gradient-to-r from-gray-600 to-gray-700"
                    }`}
                  >
                    <span className="relative z-10">
                      {onlyAvailable ? "✓ Showing Available Rooms" : "🔍 Show Available Only"}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.button>

                  {/* Stats Badge */}
                  <div className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-500/20 border border-indigo-500/30">
                    <FaTag className="text-indigo-400 text-sm" />
                    <div className="text-center">
                      <p className="text-xs text-gray-400">Total Rooms</p>
                      <p className="text-xl font-bold text-indigo-400">{rooms.length}</p>
                    </div>
                  </div>
                </div>

                {/* Price Range */}
                <div className="mt-4">
                  <label className="block mb-2 text-sm font-semibold text-gray-300 flex items-center gap-2">
                    <FaDollarSign className="text-indigo-400" />
                    Price Range (per night)
                  </label>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">₹</span>
                      <input
                        type="number"
                        placeholder="Min Price"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full pl-7 pr-3 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                      />
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">₹</span>
                      <input
                        type="number"
                        placeholder="Max Price"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full pl-7 pr-3 py-2.5 rounded-xl bg-black/40 border border-white/10 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="mt-4">
                  <h3 className="mb-3 font-semibold text-gray-300 text-sm flex items-center gap-2">
                    <FaHotTub className="text-indigo-400" />
                    Amenities
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
                    {AMENITIES_LIST.map((item) => (
                      <motion.label
                        key={item}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                          amenities.includes(item)
                            ? "bg-indigo-500/20 border border-indigo-500/50"
                            : "bg-white/5 border border-white/10 hover:bg-white/10"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={amenities.includes(item)}
                          onChange={() => toggleAmenity(item)}
                          className="w-3.5 h-3.5 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
                        />
                        {getAmenityIcon(item)}
                        <span className="text-xs">{item}</span>
                      </motion.label>
                    ))}
                  </div>
                </div>

                {/* Active Filters Display */}
                {hasActiveFilters && (
                  <div className="mt-4 pt-3 border-t border-white/10">
                    <div className="flex flex-wrap gap-2">
                      {onlyAvailable && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-green-500/20 text-green-400 text-xs">
                          Available only
                          <button onClick={() => setOnlyAvailable(false)} className="ml-1 hover:text-white">
                            <FaTimes className="text-xs" />
                          </button>
                        </span>
                      )}
                      {roomNumber && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs">
                          Room: {roomNumber}
                          <button onClick={() => setRoomNumber("")} className="ml-1 hover:text-white">
                            <FaTimes className="text-xs" />
                          </button>
                        </span>
                      )}
                      {roomType && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs">
                          Type: {roomType}
                          <button onClick={() => setRoomType("")} className="ml-1 hover:text-white">
                            <FaTimes className="text-xs" />
                          </button>
                        </span>
                      )}
                      {(minPrice || maxPrice) && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs">
                          Price: {minPrice || "0"} - {maxPrice || "∞"}
                          <button onClick={() => { setMinPrice(""); setMaxPrice(""); }} className="ml-1 hover:text-white">
                            <FaTimes className="text-xs" />
                          </button>
                        </span>
                      )}
                      {amenities.map((a) => (
                        <span key={a} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs">
                          {a}
                          <button onClick={() => toggleAmenity(a)} className="ml-1 hover:text-white">
                            <FaTimes className="text-xs" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="max-w-2xl mx-auto">
            <Message variant="danger">{error}</Message>
          </div>
        )}

        {/* No Results */}
        {!loading && rooms.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 mb-4">
              <FaSearch className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No rooms found</h3>
            <p className="text-gray-400">Try adjusting your filters to find available rooms</p>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="mt-4 px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition font-semibold"
              >
                Clear all filters
              </button>
            )}
          </motion.div>
        )}

        {/* Rooms Grid - UPDATED WITH 2 CARDS ON MOBILE */}
        {!loading && rooms.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
          >
            <AnimatePresence>
              {rooms.map((room, index) => (
                <motion.div
                  key={room._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ delay: index * 0.05 }}
                  className="h-full"
                >
                  <RoomCard room={room} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HotelRoomsScreen;