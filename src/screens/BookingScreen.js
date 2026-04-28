import React, { useEffect, useMemo, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Loader from "../components/Loader";
import Message from "../components/Message";
import SimilarRoomsSlider from "../components/SimilarRoomsSlider";
import { getRoomById } from "../state/room/Action";
import { createBooking } from "../state/booking/Action";
import { createPayment } from "../state/Payment/Action";
import { getListingReviews } from "../state/review/Action";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CollapsibleReviewSection from "../components/CollapsibleReviewSection";
import Carousel from "react-bootstrap/Carousel";

import {
  FaBed,
  FaUsers,
  FaChild,
  FaHotel,
  FaCheckCircle,
  FaWifi,
  FaCoffee,
  FaParking,
  FaSwimmingPool,
  FaDumbbell,
  FaUtensils,
  FaTv,
  FaSnowflake,
  FaShieldAlt,
  FaUserFriends,
  FaCreditCard,
  FaArrowRight,
  FaHeart,
  FaShare,
  FaWhatsapp,
  FaTwitter,
  FaFacebookF,
  FaLink,
  FaInfoCircle,
  FaRegClock,
  FaRegCalendarCheck,
  FaSpa,
  FaConciergeBell,
  FaSmokingBan,
  FaPaw,
  FaWind,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { getListingById } from "../state/listing/Action";

const customStyles = `
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(1.05); }
  }
  
  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }
  
  @keyframes slideInFromLeft {
    from { transform: translateX(-100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideInFromRight {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes bounceIn {
    0% { transform: scale(0.3); opacity: 0; }
    50% { transform: scale(1.05); }
    70% { transform: scale(0.9); }
    100% { transform: scale(1); opacity: 1; }
  }
  
  @keyframes gradientShift {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  
  .shimmer-effect {
    background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0) 100%);
    background-size: 1000px 100%;
    animation: shimmer 2s infinite;
  }
  
  .glass-card {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
  }
  
  .glass-card:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(59, 130, 246, 0.3);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }
  
  .gradient-border {
    position: relative;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 2px;
    border-radius: 1.5rem;
  }
  
  .gradient-border > div {
    background: rgba(0, 0, 0, 0.8);
    border-radius: 1.5rem;
    padding: 1.5rem;
  }
  
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  @media (max-width: 768px) {
    .gradient-border > div {
      padding: 1rem;
    }
  }
  
  @media (max-width: 640px) {
    .glass-card {
      backdrop-filter: blur(5px);
    }
  }
`;

const BookingScreen = () => {
  const { roomId } = useParams();
  const dispatch = useDispatch();
  const [showShareModal, setShowShareModal] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const bookingFormRef = useRef(null);

  const roomDetails = useSelector((state) => state.room || {});
  const { room, loading, error } = roomDetails;
  const { listing } = useSelector((state) => state.listings || {});
  const listingId = room?.listing;

  const auth = useSelector((state) => state.auth || {});
  const jwt = auth.jwt;

  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [showAmenitiesModal, setShowAmenitiesModal] = useState(false);
  const [selectedAmenity, setSelectedAmenity] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (listingId) {
      dispatch(getListingById(listingId));
      dispatch(getListingReviews(listingId));
    }
    if (roomId) {
      dispatch(getRoomById(roomId));
    }
  }, [dispatch, roomId, listingId]);

  const pricePerNight = room?.dynamicPrice > 0 ? room.dynamicPrice : room?.basePrice;

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  }, [checkIn, checkOut]);

  const totalEstimate = nights * pricePerNight;
  const serviceFee = totalEstimate * 0.1;
  const taxes = totalEstimate * 0.12;
  const grandTotal = totalEstimate + serviceFee + taxes;

  const scrollToBooking = () => {
    bookingFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const bookingHandler = async (e) => {
    e.preventDefault();

    if (!checkIn || !checkOut) {
      toast.error("Please select your travel dates first", {
        position: "top-right",
        autoClose: 3000,
        style: { background: "#1f2937", color: "#fff" }
      });
      return;
    }

    setIsBooking(true);

    try {
      const result = await dispatch(
        createBooking({
          listing: room?.listing,
          room: roomId,
          guests,
          checkInDate: checkIn.toISOString(),
          checkOutDate: checkOut.toISOString(),
        })
      );

      const bookingId = result?.payload?._id || result?._id || result?.payload?.booking?._id;

      if (!bookingId) {
        toast.error("Unable to create booking. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
        setIsBooking(false);
        return;
      }

      toast.success("Booking confirmed! Redirecting to secure payment...", {
        position: "top-right",
        autoClose: 2000,
        icon: "🎉"
      });

      setTimeout(() => {
        dispatch(createPayment(bookingId));
      }, 1000);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Booking failed. Please check your details.", {
        position: "top-right",
        autoClose: 4000,
      });
      setIsBooking(false);
    }
  };

  const getAmenityIcon = (amenity) => {
    const iconMap = {
      WiFi: <FaWifi className="text-blue-400 text-lg sm:text-xl" />,
      "Coffee Machine": <FaCoffee className="text-amber-600 text-lg sm:text-xl" />,
      Parking: <FaParking className="text-gray-400 text-lg sm:text-xl" />,
      "Swimming Pool": <FaSwimmingPool className="text-cyan-400 text-lg sm:text-xl" />,
      Gym: <FaDumbbell className="text-red-400 text-lg sm:text-xl" />,
      Restaurant: <FaUtensils className="text-orange-400 text-lg sm:text-xl" />,
      TV: <FaTv className="text-purple-400 text-lg sm:text-xl" />,
      AC: <FaSnowflake className="text-blue-300 text-lg sm:text-xl" />,
      "Room Service": <FaConciergeBell className="text-green-400 text-lg sm:text-xl" />,
      "Secure Lock": <FaShieldAlt className="text-yellow-400 text-lg sm:text-xl" />,
      "Spa": <FaSpa className="text-pink-400 text-lg sm:text-xl" />,
      "No Smoking": <FaSmokingBan className="text-red-500 text-lg sm:text-xl" />,
      "Pet Friendly": <FaPaw className="text-yellow-500 text-lg sm:text-xl" />,
      "Air Purifier": <FaWind className="text-green-400 text-lg sm:text-xl" />,
    };
    return iconMap[amenity] || <FaCheckCircle className="text-green-400 text-lg sm:text-xl" />;
  };

  const handleShare = async (platform) => {
    const shareData = {
      title: `${room?.roomType} Room at Hotel`,
      text: `Check out this amazing ${room?.roomType} room! Perfect for ${room?.guests} guests.`,
      url: window.location.href,
    };

    try {
      if (platform === 'copy') {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      } else if (platform === 'whatsapp') {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareData.text + ' ' + shareData.url)}`, '_blank');
      } else if (platform === 'twitter') {
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`, '_blank');
      } else if (platform === 'facebook') {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`, '_blank');
      }
      setShowShareModal(false);
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#050B18] via-[#0a1535] to-black flex items-center justify-center px-4">
        <div className="text-center">
          <Loader />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-gray-400 text-sm sm:text-base"
          >
            Preparing your luxury experience...
          </motion.p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#050B18] to-black flex items-center justify-center p-4 sm:p-6">
        <Message variant="danger">{error}</Message>
      </div>
    );

  if (!room) return null;

  return (
    <>
      <style>{customStyles}</style>
      <ToastContainer 
        theme="dark" 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <div className="min-h-screen bg-gradient-to-br from-[#050B18] via-[#0a1535] to-black text-white">
        {/* Mobile Sticky Booking Button */}
        {isMobile && (
          <motion.button
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            onClick={scrollToBooking}
            className="fixed bottom-4 left-4 right-4 z-50 bg-gradient-to-r from-blue-500 to-indigo-700 py-3 rounded-xl font-bold shadow-2xl"
          >
            Book Now - ₹{pricePerNight}/night
          </motion.button>
        )}

        {/* Hero Section */}
        <div className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] overflow-hidden">
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <div className="relative w-full h-full">
              <img
                src={room.images?.[activeImageIndex] || room.images?.[0]}
                alt="Room Hero"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
            </div>
          </motion.div>
          
          {/* Thumbnail Navigation */}
          {room.images?.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
              {room.images.map((_, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                    activeImageIndex === idx ? 'w-6 sm:w-8 bg-yellow-500' : 'w-1.5 sm:w-2 bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 md:p-12 text-center">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            >
              <div className="inline-block px-2 sm:px-3 md:px-4 py-0.5 sm:py-1 rounded-full bg-yellow-500/20 backdrop-blur-lg text-yellow-400 text-xs sm:text-sm mb-2 sm:mb-4">
                🌟 Premium Selection
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-8xl font-bold mb-2 sm:mb-4 bg-gradient-to-r from-white via-yellow-200 to-white bg-clip-text text-transparent">
                {room.roomType}
              </h1>
              <p className="text-sm sm:text-base md:text-2xl text-gray-300 flex flex-wrap items-center justify-center gap-2 sm:gap-4">
                <span>✨ Room: {room.roomNumber}</span>
                <span className="hidden sm:inline">•</span>
                <span> Floor {room.floor}</span>
                <span className="hidden sm:inline">•</span>
                <motion.span
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm ${
                    room.status === 'Available' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}
                >
                  {room.status}
                </motion.span>
              </p>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-14 -mt-10 sm:-mt-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {/* LEFT SIDE - ROOM DETAILS */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              {/* Floating Action Buttons - Mobile Optimized */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-end gap-2 sm:gap-4 sticky top-4 sm:top-24 z-20"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="group p-2 sm:p-3 md:p-4 rounded-full bg-black/40 backdrop-blur-xl border border-white/20"
                >
                  <FaHeart className={`text-lg sm:text-xl md:text-2xl transition-all ${
                    isFavorite ? "text-red-500" : "text-gray-400"
                  }`} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowShareModal(true)}
                  className="group p-2 sm:p-3 md:p-4 rounded-full bg-black/40 backdrop-blur-xl border border-white/20"
                >
                  <FaShare className="text-lg sm:text-xl md:text-2xl text-gray-400" />
                </motion.button>
              </motion.div>

              {/* Share Modal - Mobile Responsive */}
              <AnimatePresence>
                {showShareModal && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4"
                    onClick={() => setShowShareModal(false)}
                  >
                    <motion.div
                      initial={{ scale: 0.9, y: 50 }}
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.9, y: 50 }}
                      className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-md w-full mx-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Share this room</h3>
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        {[
                          { icon: FaWhatsapp, name: 'WhatsApp', color: 'green' },
                          { icon: FaTwitter, name: 'Twitter', color: 'blue' },
                          { icon: FaFacebookF, name: 'Facebook', color: 'blue-800' },
                          { icon: FaLink, name: 'Copy Link', color: 'gray' },
                        ].map(({ icon: Icon, name, color }) => (
                          <motion.button
                            key={name}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleShare(name.toLowerCase().replace(' ', ''))}
                            className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-xl bg-${color}-600/20 border border-${color}-600/50 hover:bg-${color}-600 transition-all text-sm sm:text-base`}
                          >
                            <Icon className="text-xl sm:text-2xl" />
                            <span className="truncate">{name}</span>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Image Gallery - Responsive */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="gradient-border"
              >
                <div>
                  <Carousel 
                    interval={null} 
                    className="gallery-carousel"
                    activeIndex={activeImageIndex}
                    onSelect={setActiveImageIndex}
                    nextIcon={<FaChevronRight className="text-white text-xl sm:text-2xl" />}
                    prevIcon={<FaChevronLeft className="text-white text-xl sm:text-2xl" />}
                  >
                    {room.images?.map((img, i) => (
                      <Carousel.Item key={i}>
                        <img 
                          src={img} 
                          alt={`Room view ${i + 1}`} 
                          className="h-[250px] sm:h-[400px] md:h-[500px] lg:h-[550px] w-full object-cover"
                        />
                        <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4">
                          <div className="inline-block px-2 sm:px-3 py-1 rounded-full bg-black/50 backdrop-blur-lg text-xs sm:text-sm">
                            {i + 1} / {room.images?.length}
                          </div>
                        </div>
                      </Carousel.Item>
                    ))}
                  </Carousel>
                </div>
              </motion.div>

              {/* Room Description - Responsive */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6"
              >
                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 flex items-center gap-2">
                  <FaInfoCircle className="text-blue-400 text-lg sm:text-xl" />
                  About This Room
                </h2>
                <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                  Experience luxury at its finest in our {room.roomType}. 
                  Designed for comfort and elegance, this room features premium amenities,
                  stunning views, and personalized service to make your stay unforgettable.
                  {!showFullDescription && ".."}
                  {showFullDescription && (
                    <span>
                      {" "}Enjoy complimentary high-speed WiFi, a smart TV with streaming services,
                      and a well-stocked minibar. The en-suite bathroom includes a rainfall shower
                      and luxury toiletries. Our dedicated concierge team is available 24/7.
                    </span>
                  )}
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="text-blue-400 hover:text-blue-300 ml-2 font-semibold text-sm"
                  >
                    {showFullDescription ? "Show less" : "Read more"}
                  </button>
                </p>
              </motion.div>

              {/* Room Stats - Responsive Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-8"
              >
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Room Features</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {[
                    { icon: FaUsers, label: 'Max Guests', value: room.guests, color: 'blue' },
                    { icon: FaChild, label: 'Children', value: room.children, color: 'green' },
                    { icon: FaBed, label: 'Beds', value: room.beds, color: 'purple' },
                    { icon: FaHotel, label: 'Floor', value: room.floor, color: 'orange' },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center gap-1 sm:gap-2 p-3 sm:p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                      <item.icon className={`text-2xl sm:text-3xl text-${item.color}-400`} />
                      <p className="text-xs sm:text-sm text-gray-400">{item.label}</p>
                      <p className="font-bold text-base sm:text-lg">{item.value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Amenities - Responsive Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6"
              >
                <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Amenities & Services</h2>
                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  {room.amenities?.map((a, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      onClick={() => {
                        setSelectedAmenity(a);
                        setShowAmenitiesModal(true);
                      }}
                      className="group flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
                    >
                      {getAmenityIcon(a)}
                      <span className="text-xs sm:text-sm group-hover:text-blue-400 transition-colors truncate">
                        {a}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Amenities Modal - Responsive */}
              <AnimatePresence>
                {showAmenitiesModal && selectedAmenity && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-4"
                    onClick={() => setShowAmenitiesModal(false)}
                  >
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-md w-full mx-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                        {getAmenityIcon(selectedAmenity)}
                        <h3 className="text-xl sm:text-2xl font-bold">{selectedAmenity}</h3>
                      </div>
                      <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                        {selectedAmenity === "WiFi" && "Enjoy high-speed internet connectivity throughout your stay, perfect for work or streaming."}
                        {selectedAmenity === "Swimming Pool" && "Access to our temperature-controlled indoor pool with panoramic city views."}
                        {selectedAmenity === "Gym" && "State-of-the-art fitness center open 24/7 with personal trainer available."}
                        {selectedAmenity === "Spa" && "Rejuvenate with our exclusive spa treatments and massage services."}
                        {!["WiFi", "Swimming Pool", "Gym", "Spa"].includes(selectedAmenity) && 
                          "Experience premium quality and comfort with this amenity included in your stay."}
                      </p>
                      <button
                        onClick={() => setShowAmenitiesModal(false)}
                        className="mt-6 w-full py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-700 hover:from-blue-600 hover:to-indigo-800 transition-all font-semibold text-sm sm:text-base"
                      >
                        Got it
                      </button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Review Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card rounded-2xl sm:rounded-3xl  overflow-hidden"
              >
                <CollapsibleReviewSection listingId={room?.listing} />
              </motion.div>

              {/* Similar Rooms */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <SimilarRoomsSlider rooms={listing?.rooms} />
              </motion.div>
            </div>

            {/* RIGHT SIDE - BOOKING FORM - Responsive */}
            <div className="lg:sticky lg:top-8 h-fit">
              <motion.div
                ref={bookingFormRef}
                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                className="relative"
              >
                <div className="gradient-border">
                  <div className="relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-2xl" />
                    <div className="absolute bottom-0 left-0 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-tr from-yellow-500/20 to-pink-500/20 rounded-full blur-2xl" />
                    
                    <div className="relative z-10 p-4 sm:p-6">
                      <div className="mb-6 text-center">
                        <div className="flex items-baseline justify-center gap-2 mb-3 sm:mb-4">
                          <motion.span
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-yellow-500 bg-clip-text text-transparent"
                          >
                            ₹{pricePerNight}
                          </motion.span>
                          <span className="text-gray-400 text-sm sm:text-base">/ night</span>
                        </div>
                        
                      </div>

                      {!jwt && (
                        <motion.div
                          initial={{ scale: 0.95, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="mb-6"
                        >
                          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 sm:p-4">
                            <p className="text-yellow-500 text-xs sm:text-sm text-center">
                              🔐 Please login to book this amazing room
                            </p>
                          </div>
                        </motion.div>
                      )}

                      <form onSubmit={bookingHandler} className="space-y-4 sm:space-y-5">
                        {/* Check-In Date */}
                        <div>
                          <label className="block mb-2 text-gray-300 font-semibold flex items-center gap-2 text-sm sm:text-base">
                            <FaRegCalendarCheck className="text-blue-400" />
                            Check-In Date
                          </label>
                          <DatePicker
                            selected={checkIn}
                            onChange={setCheckIn}
                            minDate={new Date()}
                            placeholderText="Select arrival date"
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-black/40 border-2 border-blue-400/30 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm sm:text-base"
                          />
                        </div>

                        {/* Check-Out Date */}
                        <div>
                          <label className="block mb-2 text-gray-300 font-semibold flex items-center gap-2 text-sm sm:text-base">
                            <FaRegClock className="text-blue-400" />
                            Check-Out Date
                          </label>
                          <DatePicker
                            selected={checkOut}
                            onChange={setCheckOut}
                            minDate={checkIn}
                            placeholderText="Select departure date"
                            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-black/40 border-2 border-blue-400/30 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm sm:text-base"
                          />
                        </div>

                        {/* Guests Selection */}
                        <div>
                          <label className="block mb-2 text-gray-300 font-semibold flex items-center gap-2 text-sm sm:text-base">
                            <FaUserFriends className="text-blue-400" />
                            Guests
                          </label>
                          <div className="relative">
                            <select
                              value={guests}
                              onChange={(e) => setGuests(+e.target.value)}
                              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-black/40 border-2 border-blue-400/30 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer text-sm sm:text-base"
                            >
                              {[...Array(room.guests)].map((_, i) => (
                                <option key={i} value={i + 1} className="bg-gray-900">
                                  {i + 1} {i === 0 ? 'Guest' : 'Guests'}
                                </option>
                              ))}
                            </select>
                            <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                              <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </div>
                          </div>
                        </div>

                        {/* Price Breakdown */}
                        <AnimatePresence>
                          {nights > 0 && (
                            <motion.div
                              initial={{ opacity: 0, height: 0, y: -20 }}
                              animate={{ opacity: 1, height: "auto", y: 0 }}
                              exit={{ opacity: 0, height: 0, y: -20 }}
                              transition={{ duration: 0.3 }}
                              className="space-y-2 sm:space-y-3 p-3 sm:p-5 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10"
                            >
                              <div className="flex justify-between text-xs sm:text-sm">
                                <span className="text-gray-400">Room rate</span>
                                <span>₹{pricePerNight} × {nights} nights</span>
                              </div>
                              <div className="flex justify-between text-xs sm:text-sm">
                                <span className="text-gray-400">Service fee</span>
                                <span>₹{serviceFee}</span>
                              </div>
                              <div className="flex justify-between text-xs sm:text-sm">
                                <span className="text-gray-400">Taxes & charges</span>
                                <span>₹{taxes}</span>
                              </div>
                              <div className="border-t border-white/20 pt-2 sm:pt-3 mt-2 sm:mt-3">
                                <div className="flex justify-between items-center">
                                  <span className="font-bold text-sm sm:text-base">Total (INR)</span>
                                  <motion.span
                                    key={grandTotal}
                                    initial={{ scale: 1.2 }}
                                    animate={{ scale: 1 }}
                                    className="text-xl sm:text-2xl md:text-3xl font-extrabold text-green-400"
                                  >
                                    ₹{grandTotal}
                                  </motion.span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1 sm:mt-2 text-center">
                                  Inclusive of all taxes
                                </p>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Booking Button */}
                        <motion.button
                          type="submit"
                          disabled={!jwt || nights === 0 || isBooking}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="relative w-full py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg overflow-hidden group"
                          style={{
                            background: "linear-gradient(135deg, #3b82f6, #4f46e5, #7c3aed)",
                            backgroundSize: "200% 200%",
                            animation: "gradientShift 3s ease infinite"
                          }}
                        >
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            {isBooking ? (
                              <>
                                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span className="text-sm sm:text-base">Processing...</span>
                              </>
                            ) : (
                              <>
                                <FaCreditCard className="text-sm sm:text-base" />
                                <span className="text-sm sm:text-base">Confirm & Pay</span>
                                <FaArrowRight className="text-sm sm:text-base group-hover:translate-x-1 transition-transform" />
                              </>
                            )}
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </motion.button>

                        {/* Security Features */}
                        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 text-xs text-gray-500 pt-2">
                          <div className="flex items-center gap-1">
                            <FaShieldAlt className="text-green-500 text-xs sm:text-sm" />
                            <span className="text-xs">Secure payment</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FaCheckCircle className="text-green-500 text-xs sm:text-sm" />
                            <span className="text-xs">Free cancellation</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FaRegClock className="text-green-500 text-xs sm:text-sm" />
                            <span className="text-xs">24/7 support</span>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>

                {/* Trust Badges */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-4 text-center text-xs text-gray-500"
                >
                  <p>✅ Best price guarantee • ✅ Instant confirmation</p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .gallery-carousel .carousel-control-prev,
        .gallery-carousel .carousel-control-next {
          background: rgba(0, 0, 0, 0.5);
          width: 35px;
          height: 35px;
          border-radius: 50%;
          top: 50%;
          transform: translateY(-50%);
          transition: all 0.3s ease;
        }
        
        @media (min-width: 640px) {
          .gallery-carousel .carousel-control-prev,
          .gallery-carousel .carousel-control-next {
            width: 45px;
            height: 45px;
          }
        }
        
        @media (min-width: 768px) {
          .gallery-carousel .carousel-control-prev,
          .gallery-carousel .carousel-control-next {
            width: 50px;
            height: 50px;
          }
        }
        
        .gallery-carousel .carousel-control-prev:hover,
        .gallery-carousel .carousel-control-next:hover {
          background: rgba(0, 0, 0, 0.8);
          transform: translateY(-50%) scale(1.1);
        }
        
        .gallery-carousel .carousel-indicators {
          bottom: 10px;
        }
        
        @media (min-width: 640px) {
          .gallery-carousel .carousel-indicators {
            bottom: 20px;
          }
        }
        
        .gallery-carousel .carousel-indicators button {
          width: 20px;
          height: 2px;
          background: white;
          opacity: 0.5;
          transition: all 0.3s ease;
        }
        
        @media (min-width: 640px) {
          .gallery-carousel .carousel-indicators button {
            width: 30px;
            height: 3px;
          }
        }
        
        .gallery-carousel .carousel-indicators button.active {
          opacity: 1;
          width: 30px;
          background: #facc15;
        }
        
        @media (min-width: 640px) {
          .gallery-carousel .carousel-indicators button.active {
            width: 40px;
          }
        }
        
        .react-datepicker {
          background-color: #1f2937;
          border-color: #374151;
          font-family: inherit;
        }
        
        .react-datepicker__header {
          background-color: #111827;
          border-bottom-color: #374151;
        }
        
        .react-datepicker__current-month,
        .react-datepicker__day-name,
        .react-datepicker__day {
          color: white;
          font-size: 12px;
        }
        
        @media (min-width: 640px) {
          .react-datepicker__current-month,
          .react-datepicker__day-name,
          .react-datepicker__day {
            font-size: 14px;
          }
        }
        
        .react-datepicker__day:hover {
          background-color: #3b82f6;
          border-radius: 50%;
        }
        
        .react-datepicker__day--selected {
          background-color: #2563eb;
          border-radius: 50%;
        }
        
        .react-datepicker__day--keyboard-selected {
          background-color: #4f46e5;
          border-radius: 50%;
        }
        
        .react-datepicker__day--disabled {
          color: #4b5563;
        }
        
        .react-datepicker__triangle {
          display: none;
        }
        
        @media (max-width: 640px) {
          .react-datepicker {
            width: 280px;
          }
          
          .react-datepicker__month-container {
            width: 280px;
          }
          
          .react-datepicker__day {
            width: 35px;
            line-height: 35px;
          }
        }
        
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        @media (min-width: 768px) {
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
        }
        
        ::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #3b82f6, #4f46e5);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #2563eb, #4338ca);
        }
      `}</style>
    </>
  );
};

export default BookingScreen;