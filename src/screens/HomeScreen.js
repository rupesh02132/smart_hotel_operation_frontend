import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SmartCarousel from "../components/homeCarousel/SmartCarousel";
import ListingCard from "../components/ListingCard";
import Message from "../components/Message";
import { findListing } from "../state/listing/Action";
import { 
  FaMicrophone, 
  FaSearch, 
  FaFilter, 
  FaStar, 
  FaMapMarkerAlt,
  FaHotel,
  FaArrowRight,
  FaArrowLeft,
  FaSpinner,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
  FaSortAmountDown
} from "react-icons/fa";
import Skeleton from "@mui/material/Skeleton";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import "bootstrap/dist/css/bootstrap.min.css";

const TRENDING_CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Goa", "Jaipur", "Manali", "Udaipur",
  "Hyderabad", "Chennai", "Kolkata", "Rishikesh", "Shimla", "Agra",
  "Jaisalmer", "Leh", "Darjeeling", "Pondicherry", "Coorg", "Andaman",
  "Lakshadweep", "Munnar", "Ooty", "Kumarakom", "Mysore", "Noida"
];

const FEATURED_COUNT = 10;

const SORT_OPTIONS = [
  { value: "", label: "Recommended" },
  { value: "ratingDesc", label: "Highest Rated" },
  { value: "newest", label: "Newest First" }
];

const RATING_OPTIONS = [
  { value: 0, label: "All Ratings" },
  { value: 4.5, label: "4.5+ (Luxury)" },
  { value: 4.0, label: "4.0+ (Excellent)" },
  { value: 3.5, label: "3.5+ (Good)" },
  { value: 3.0, label: "3.0+ (Average)" }
];

const luxuryField = {
  "& .MuiOutlinedInput-root": {
    background: "rgba(255,255,255,0.07)",
    borderRadius: "14px",
    color: "#fff",
    "& fieldset": { borderColor: "rgba(255,255,255,0.15)" },
    "&:hover fieldset": { borderColor: "rgba(59,130,246,0.5)" },
  },
  "& .MuiInputLabel-root": { color: "#facc15" },
  "& .MuiInputBase-input": { color: "#fff" },
};

const detectMood = (city, rating) => {
  if (rating >= 4.5) return { text: "Luxury Mode", icon: "👑", color: "from-yellow-500 to-orange-500" };
  if (city) return { text: "Explore Mode", icon: "🗺️", color: "from-blue-500 to-cyan-500" };
  return { text: "Browsing", icon: "🔍", color: "from-purple-500 to-pink-500" };
};

const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { listings } = useSelector((store) => store);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchCity, setSearchCity] = useState("");
  const [country, setCountry] = useState("");
  const [title, setTitle] = useState("");
  const [debouncedCity, setDebouncedCity] = useState("");
  const [rating, setRating] = useState(0);
  const [sortBy, setSortBy] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const listingsPerPage = 20;

  const listingData = listings.listing?.listings || [];
  const totalCount = listings.listing?.totalCount || 0;
  const { loading, error } = listings;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setShowFilters(true);
      } else {
        setShowFilters(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedCity(searchCity);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(t);
  }, [searchCity]);

  useEffect(() => {
    dispatch(
      findListing({
        city: debouncedCity || undefined,
        country: country || undefined,
        title: title || undefined,
        rating: rating || undefined,
        sortBy: sortBy || undefined,
        skip: (currentPage - 1) * listingsPerPage,
        limit: listingsPerPage,
      }),
    );
  }, [
    dispatch, currentPage, debouncedCity, country, title,
    rating, sortBy
  ]);

  const featuredHotels = useMemo(() => {
    const data = listings.listing?.listings || [];
    return data.slice(0, FEATURED_COUNT);
  }, [listings]);

  const startVoiceSearch = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      alert("Voice search not supported in your browser");
      return;
    }
    const rec = new SR();
    rec.lang = "en-US";
    rec.start();
    setIsListening(true);
    
    rec.onresult = (e) => {
      let text = e.results[0][0].transcript;
      text = text.replace(/[.。]/g, "").trim();
      setSearchCity(text);
      setIsListening(false);
    };
    
    rec.onerror = () => {
      setIsListening(false);
      alert("Could not recognize speech. Please try again.");
    };
    
    rec.onend = () => {
      setIsListening(false);
    };
  };

  const resetFilters = () => {
    setSearchCity("");
    setCountry("");
    setTitle("");
    setRating(0);
    setSortBy("");
    setCurrentPage(1);
  };

  const hasActiveFilters = searchCity || country || title || rating > 0 || sortBy;
  const moodData = detectMood(searchCity, rating);
  const totalPages = Math.ceil(totalCount / listingsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#05070f] via-[#0a0f1f] to-black">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-900/50 via-purple-900/50 to-pink-900/50 overflow-hidden">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/50 mb-4">
              <FaStar className="text-yellow-400 text-sm" />
              <span className="text-yellow-400 text-xs sm:text-sm font-semibold">Smart Hotel Platform</span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 bg-gradient-to-r from-white via-yellow-200 to-purple-200 bg-clip-text text-transparent">
              Find Your Perfect Stay
            </h1>
            <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
              Discover luxury accommodations with AI-powered recommendations
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Mood Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-2xl bg-gradient-to-r ${moodData.color} shadow-lg`}
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl">{moodData.icon}</span>
              <span className="text-white font-semibold text-sm sm:text-base">
                Guest Mode: {moodData.text}
              </span>
            </div>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-xs sm:text-sm text-white/80 hover:text-white flex items-center gap-1"
              >
                <FaTimes />
                Clear all
              </button>
            )}
          </div>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl mb-6 sm:mb-8"
        >
          {/* Mobile Filter Toggle */}
          {isMobile && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full mb-3 py-2 rounded-xl bg-indigo-600/20 border border-indigo-500/50 flex items-center justify-center gap-2 text-sm font-semibold"
            >
              <FaFilter />
              {showFilters ? "Hide Filters" : "Show Filters"}
              {showFilters ? <FaChevronUp /> : <FaChevronDown />}
            </button>
          )}

          <AnimatePresence mode="wait">
            {(showFilters || !isMobile) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {/* City Search */}
                  <div>
                    <label className="block mb-2 text-gray-300 text-xs sm:text-sm font-semibold flex items-center gap-1">
                      <FaMapMarkerAlt className="text-indigo-400" />
                      City
                    </label>
                    <Autocomplete
                      freeSolo
                      options={TRENDING_CITIES}
                      value={searchCity}
                      onInputChange={(e, v) => setSearchCity(v)}
                      renderInput={(p) => (
                        <TextField {...p} placeholder="Search city..." sx={luxuryField} size="small" />
                      )}
                    />
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block mb-2 text-gray-300 text-xs sm:text-sm font-semibold flex items-center gap-1">
                      <FaMapMarkerAlt className="text-indigo-400" />
                      Country
                    </label>
                    <TextField
                      placeholder="Country"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      sx={luxuryField}
                      fullWidth
                      size="small"
                    />
                  </div>

                  {/* Hotel Name */}
                  <div>
                    <label className="block mb-2 text-gray-300 text-xs sm:text-sm font-semibold flex items-center gap-1">
                      <FaHotel className="text-indigo-400" />
                      Hotel Name
                    </label>
                    <TextField
                      placeholder="Hotel name..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      sx={luxuryField}
                      fullWidth
                      size="small"
                    />
                  </div>
                </div>

                {/* Additional Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
                  {/* Rating Filter */}
                  <div>
                    <label className="block mb-2 text-gray-300 text-xs sm:text-sm font-semibold flex items-center gap-1">
                      <FaStar className="text-yellow-500" />
                      Minimum Rating
                    </label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(parseFloat(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 focus:border-indigo-500 outline-none text-sm"
                    >
                      {RATING_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value} className="bg-gray-900">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block mb-2 text-gray-300 text-xs sm:text-sm font-semibold flex items-center gap-1">
                      <FaSortAmountDown className="text-indigo-400" />
                      Sort By
                    </label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 focus:border-indigo-500 outline-none text-sm"
                    >
                      {SORT_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value} className="bg-gray-900">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-3 sm:mt-4">
                  <button
                    onClick={startVoiceSearch}
                    disabled={isListening}
                    className={`flex-1 py-2 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                      isListening
                        ? "bg-red-600 animate-pulse"
                        : "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                    }`}
                  >
                    {isListening ? (
                      <>
                        <FaSpinner className="animate-spin" />
                        Listening...
                      </>
                    ) : (
                      <>
                        <FaMicrophone />
                        Voice Search
                      </>
                    )}
                  </button>
                  
                  {hasActiveFilters && (
                    <button
                      onClick={resetFilters}
                      className="px-4 py-2 rounded-xl bg-gray-600/50 hover:bg-gray-600 transition text-sm font-semibold"
                    >
                      <FaTimes />
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Featured Hotels Section */}
        <div className="mb-8 sm:mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              ✨ Featured Hotels
            </h2>
            <div className="text-xs text-gray-500">
              {featuredHotels.length} premium picks
            </div>
          </div>
          
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
            {featuredHotels.map((hotel, index) => (
              <motion.div
                key={hotel._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/hotel/${hotel._id}/rooms`)}
                className="min-w-[260px] sm:min-w-[280px] md:min-w-[300px] cursor-pointer"
              >
                <ListingCard listing={hotel} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Smart Carousel */}
        <SmartCarousel />

        {/* All Hotels Section */}
        <div className="mt-8 sm:mt-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              🏨 All Hotels
            </h2>
            <div className="text-xs sm:text-sm text-gray-500">
              Showing {listingData.length} of {totalCount} hotels
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i}>
                  <Skeleton variant="rectangular" height={200} sx={{ bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '16px' }} />
                  <Skeleton sx={{ bgcolor: 'rgba(255,255,255,0.1)', mt: 1 }} />
                  <Skeleton width="60%" sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="py-10">
              <Message variant="danger">{error}</Message>
            </div>
          )}

          {/* Hotels Grid */}
          {!loading && !error && (
            <>
              {listingData.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-20"
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 mb-4">
                    <FaSearch className="text-3xl text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No hotels found</h3>
                  <p className="text-gray-400">Try adjusting your filters to find more options</p>
                  {hasActiveFilters && (
                    <button
                      onClick={resetFilters}
                      className="mt-4 px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition font-semibold"
                    >
                      Clear all filters
                    </button>
                  )}
                </motion.div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                  <AnimatePresence>
                    {listingData.map((hotel, index) => (
                      <motion.div
                        key={hotel._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => navigate(`/hotel/${hotel._id}/rooms`)}
                        className="cursor-pointer h-full"
                      >
                        <ListingCard listing={hotel} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 sm:gap-3 mt-6 sm:mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                <FaArrowLeft className="inline mr-1 text-xs" />
                Prev
              </motion.button>
              
              <div className="flex gap-1">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-sm font-semibold transition ${
                        currentPage === pageNum
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                          : "bg-white/5 hover:bg-white/10 text-gray-400"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={currentPage * listingsPerPage >= totalCount}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                Next
                <FaArrowRight className="inline ml-1 text-xs" />
              </motion.button>
            </div>
          )}
        </div>

        {/* Platform Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 sm:mt-16 text-center max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-4">
              Smart Hotel Platform
            </h2>
            
            <p className="text-sm sm:text-base md:text-lg leading-relaxed text-gray-300 max-w-2xl mx-auto">
              Smart Hotel is an intelligent booking platform designed to simplify
              how users discover and reserve accommodations. It leverages
              <span className="text-yellow-400 font-medium">
                {" "}AI-driven recommendations
              </span>
              , real-time availability, and a seamless user experience to deliver
              <span className="text-yellow-400 font-medium">
                {" "}fast, reliable, and personalized
              </span>{" "}
              hotel booking.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 sm:mt-8">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-all">
                <div className="text-3xl mb-2">⚡</div>
                <h3 className="font-semibold mb-1">Fast Booking</h3>
                <p className="text-xs text-gray-400">Instant confirmation system</p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-all">
                <div className="text-3xl mb-2">🤖</div>
                <h3 className="font-semibold mb-1">Smart AI</h3>
                <p className="text-xs text-gray-400">Personalized recommendations</p>
              </div>

              <div className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-all">
                <div className="text-3xl mb-2">🔒</div>
                <h3 className="font-semibold mb-1">Secure</h3>
                <p className="text-xs text-gray-400">Safe payments & data protection</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default HomeScreen;