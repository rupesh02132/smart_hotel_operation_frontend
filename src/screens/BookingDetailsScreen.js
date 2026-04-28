import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { motion, AnimatePresence } from "framer-motion";
import BookingStatusTimeline from "../components/BookingStatusTimeline";
import RoomStatusBadge from "../components/RoomStatusBadge";
import InvoicePDF from "../components/InvoicePDF";

import {
  FaPhone,
  FaMapMarkedAlt,
  FaFilePdf,
  FaRedo,
  FaTimesCircle,
  FaCheckCircle,
  FaClock,
  FaCalendarAlt,
  FaUsers,
  FaBed,
  FaMoneyBillWave,
  FaCreditCard,
  FaUser,
  FaEnvelope,
  FaHotel,
  FaArrowLeft,
  FaShare,
  FaPrint,
  FaWhatsapp,
  FaLink,
  FaEnvelopeOpenText,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { getBookingsBy_Id } from "../state/booking/Action";
import { createPayment } from "../state/Payment/Action";
import { api } from "../Admin/config/apiConfig";
import { toast } from "react-toastify";

const BookingDetailsScreen = () => {
  const { bookingId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showShareModal, setShowShareModal] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const { booking, loading, error } = useSelector(
    (state) => state.bookings
  );

  useEffect(() => {
    if (bookingId) {
      dispatch(getBookingsBy_Id(bookingId));
    }
  }, [dispatch, bookingId]);

  const nights = useMemo(() => {
    if (!booking?.checkIn || !booking?.checkOut) return 0;
    const diff = new Date(booking.checkOut) - new Date(booking.checkIn);
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }, [booking]);

  const stayStatus = useMemo(() => {
    if (!booking?.checkIn || !booking?.checkOut) return "-";
    const now = new Date();
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);

    if (now < checkIn) return { text: "Upcoming Stay", color: "text-blue-400", icon: "🔜" };
    if (now > checkOut) return { text: "Completed Stay", color: "text-green-400", icon: "✅" };
    return { text: "Currently Staying", color: "text-amber-400", icon: "🏠" };
  }, [booking]);

  const isPaid = booking?.paymentStatus === "paid";
  const imageSrc = booking?.room?.images?.[0] || "/no-image.png";

  const retryPaymentHandler = async () => {
    if (!booking?._id) return;
    toast.info("Redirecting to payment...");
    dispatch(createPayment(booking._id));
  };

  const cancelBookingHandler = async () => {
    if (!booking?._id) return;
    
    if (!window.confirm("Are you sure you want to cancel this booking? Refund may apply based on cancellation policy.")) return;
    
    setIsCancelling(true);
    try {
      await api.post(`/api/bookings/cancel/${booking._id}`);
      dispatch(getBookingsBy_Id(booking._id));
      toast.success("Booking cancelled successfully!");
    } catch (err) {
      console.error("Cancel failed:", err);
      toast.error(err.response?.data?.message || "Failed to cancel booking");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleShare = async (platform) => {
    const shareData = {
      title: `Booking ${booking?._id?.toUpperCase()}`,
      text: `Check out my booking at ${booking?.room?.listing?.title}`,
      url: window.location.href,
    };

    try {
      if (platform === 'copy') {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      } else if (platform === 'whatsapp') {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareData.text + ' ' + shareData.url)}`, '_blank');
      } else if (platform === 'email') {
        window.location.href = `mailto:?subject=${shareData.title}&body=${shareData.text} ${shareData.url}`;
      }
      setShowShareModal(false);
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0a0f1f] to-[#020617] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0a0f1f] to-[#020617] flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-6 text-center max-w-md">
          <FaTimesCircle className="text-red-500 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Error Loading Booking</h3>
          <p className="text-gray-400">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!booking) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0a0f1f] to-[#020617]">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-4"
          >
            <FaArrowLeft className="text-sm" />
            <span className="text-sm">Back</span>
          </button>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Booking Details
              </h1>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">
                Booking ID: {booking._id?.toUpperCase()}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowShareModal(true)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
              >
                <FaShare className="text-gray-300" />
              </button>
              <button
                onClick={() => window.print()}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
              >
                <FaPrint className="text-gray-300" />
              </button>
            </div>
          </div>
        </div>

        {/* Share Modal */}
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
                className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold mb-4">Share Booking</h3>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => handleShare('whatsapp')}
                    className="p-3 rounded-xl bg-green-600/20 border border-green-600/50 hover:bg-green-600 transition"
                  >
                    <FaWhatsapp className="text-2xl mx-auto" />
                    <p className="text-xs mt-1">WhatsApp</p>
                  </button>
                  <button
                    onClick={() => handleShare('email')}
                    className="p-3 rounded-xl bg-blue-600/20 border border-blue-600/50 hover:bg-blue-600 transition"
                  >
                    <FaEnvelopeOpenText className="text-2xl mx-auto" />
                    <p className="text-xs mt-1">Email</p>
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className="p-3 rounded-xl bg-gray-600/20 border border-gray-600/50 hover:bg-gray-600 transition"
                  >
                    <FaLink className="text-2xl mx-auto" />
                    <p className="text-xs mt-1">Copy Link</p>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* MAIN CONTENT */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 overflow-hidden"
            >
              <div className="relative h-64 sm:h-80">
                <img
                  src={imageSrc}
                  alt={booking.room?.roomType}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                
                <div className="absolute top-4 right-4">
                  <div className={`px-3 py-1.5 rounded-full text-xs font-medium backdrop-blur border flex items-center gap-1.5 ${
                    isPaid
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                      : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                  }`}>
                    {isPaid ? <FaCheckCircle className="text-xs" /> : <FaClock className="text-xs" />}
                    {isPaid ? "Confirmed" : "Payment Pending"}
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    {booking.room?.listing?.title}
                  </h2>
                  <p className="text-sm text-gray-300 flex items-center gap-1 mt-1">
                    <FaMapMarkerAlt className="text-xs" />
                    {booking.room?.listing?.city}, {booking.room?.listing?.country}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Status Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-5 sm:p-6"
            >
              <BookingStatusTimeline status={booking.status} />
            </motion.div>

            {/* Stay Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-5 sm:p-6"
            >
              <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
                <FaHotel className="text-amber-400" />
                Stay Summary
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <InfoItem icon={<FaCalendarAlt />} label="Check-in" value={formatDate(booking.checkIn)} />
                  <InfoItem icon={<FaCalendarAlt />} label="Check-out" value={formatDate(booking.checkOut)} />
                  <InfoItem icon={<FaClock />} label="Nights" value={`${nights} nights`} />
                </div>
                <div className="space-y-3">
                  <InfoItem icon={<FaUsers />} label="Guests" value={booking.guests} />
                  <InfoItem icon={<FaBed />} label="Room Number" value={booking.room?.roomNumber} />
                  <InfoItem icon={<FaHotel />} label="Room Type" value={booking.room?.roomType} />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Stay Status</span>
                  <span className={`${stayStatus.color} font-semibold flex items-center gap-1`}>
                    <span>{stayStatus.icon}</span>
                    {stayStatus.text}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-400 text-sm">Room Status</span>
                  <RoomStatusBadge status={booking.room?.status} />
                </div>
              </div>
            </motion.div>

            {/* Payment Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-5 sm:p-6"
            >
              <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
                <FaMoneyBillWave className="text-green-400" />
                Payment Details
              </h3>
              <div className="space-y-3">
                <InfoItem icon={<FaCreditCard />} label="Payment Method" value={booking.paymentMethod || "Credit Card"} />
                <InfoItem icon={<FaMoneyBillWave />} label="Total Amount" value={`₹${booking.totalPrice?.toLocaleString()}`} highlight />
                <div className="flex justify-between items-center pt-2 border-t border-white/10">
                  <span className="text-gray-400 text-sm flex items-center gap-2">
                    Payment Status
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isPaid
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-amber-500/20 text-amber-300"
                  }`}>
                    {isPaid ? "Paid" : "Pending"}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Guest Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-5 sm:p-6"
            >
              <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
                <FaUser className="text-blue-400" />
                Guest Details
              </h3>
              <div className="space-y-3">
                <InfoItem icon={<FaUser />} label="Full Name" value={`${booking.user?.firstname} ${booking.user?.lastname}`} />
                <InfoItem icon={<FaEnvelope />} label="Email Address" value={booking.user?.email} />
              </div>
            </motion.div>
          </div>

          {/* SIDEBAR - Quick Actions */}
          <div className="lg:sticky lg:top-8 h-fit space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="rounded-2xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 p-5 sm:p-6"
            >
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <FaClock className="text-amber-400" />
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                {booking.paymentStatus === "failed" && (
                  <ActionButton
                    icon={<FaRedo />}
                    text="Retry Payment"
                    onClick={retryPaymentHandler}
                    color="amber"
                  />
                )}

                {booking.status !== "cancelled" && booking.status !== "completed" && (
                  <ActionButton
                    icon={<FaTimesCircle />}
                    text={isCancelling ? "Cancelling..." : "Cancel Booking"}
                    onClick={cancelBookingHandler}
                    color="red"
                    disabled={isCancelling}
                  />
                )}

                {isPaid && (
                  <PDFDownloadLink
                    document={<InvoicePDF booking={booking} />}
                    fileName={`invoice-${booking._id}.pdf`}
                  >
                    {({ loading }) => (
                      <ActionButton
                        icon={<FaFilePdf />}
                        text={loading ? "Preparing..." : "Download Invoice"}
                        color="blue"
                        disabled={loading}
                      />
                    )}
                  </PDFDownloadLink>
                )}

                <ActionButton
                  icon={<FaPhone />}
                  text="Contact Hotel"
                  onClick={() => window.location.href = `tel:${booking.room?.listing?.phone || "+1234567890"}`}
                  color="gray"
                />

                <ActionButton
                  icon={<FaMapMarkedAlt />}
                  text="View on Map"
                  onClick={() => navigate(`/map`, { state: { listing: booking.room?.listing } })}
                  color="gray"
                />
              </div>
            </motion.div>

            {/* Important Info Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-5"
            >
              <h4 className="text-amber-400 font-semibold text-sm mb-2">Important Information</h4>
              <ul className="text-xs text-gray-400 space-y-2">
                <li>• Check-in time: 2:00 PM</li>
                <li>• Check-out time: 12:00 PM</li>
                <li>• Early check-in subject to availability</li>
                <li>• Late check-out may incur additional charges</li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsScreen;

/* ================= COMPONENTS ================= */

const InfoItem = ({ icon, label, value, highlight }) => (
  <div className="flex justify-between items-center text-sm">
    <span className="text-gray-400 flex items-center gap-2">
      {icon}
      {label}
    </span>
    <span className={highlight ? "font-semibold text-white" : "text-gray-200"}>
      {value}
    </span>
  </div>
);

const ActionButton = ({ icon, text, onClick, color = "blue", disabled = false }) => {
  const colors = {
    blue: "from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500",
    amber: "from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500",
    red: "from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500",
    gray: "from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl transition-all duration-300 ${
        disabled
          ? "bg-gray-600/30 text-gray-500 cursor-not-allowed"
          : `bg-gradient-to-r ${colors[color]} text-white hover:scale-105`
      }`}
    >
      {icon}
      <span className="text-sm font-medium">{text}</span>
    </button>
  );
};

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";