import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import BookingStatusTimeline from "../components/BookingStatusTimeline";
import RoomStatusBadge from "../components/RoomStatusBadge";
import InvoicePDF from "../components/InvoicePDF";
import GenerateQR from "../Admin/component/GenerateQR";
import Map from "../components/Map";
import {
  FaPhone,
  FaMapMarkedAlt,
  FaFilePdf,
  FaRedo,
  FaTimesCircle,
} from "react-icons/fa";

import { getBookingsBy_Id } from "../state/booking/Action";
import { createPayment } from "../state/Payment/Action";
import { api } from "../Admin/config/apiConfig";

const BookingDetailsScreen = () => {
  const { bookingId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* =========================
     REDUX STATE
  ========================= */
  const { booking, loading, error } = useSelector(
    (state) => state.bookings
  );

  /* =========================
     FETCH BOOKING
  ========================= */
  useEffect(() => {
    if (bookingId) {
      dispatch(getBookingsBy_Id(bookingId));
    }
  }, [dispatch, bookingId]);

  /* =========================
     DERIVED DATA (HOOKS MUST BE TOP)
  ========================= */

  const nights = useMemo(() => {
    if (!booking?.checkIn || !booking?.checkOut) return 0;

    const diff =
      new Date(booking.checkOut) -
      new Date(booking.checkIn);

    return Math.max(
      1,
      Math.ceil(diff / (1000 * 60 * 60 * 24))
    );
  }, [booking]);

  const stayStatus = useMemo(() => {
    if (!booking?.checkIn || !booking?.checkOut)
      return "-";

    const now = new Date();
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);

    if (now < checkIn) return "Upcoming Stay";
    if (now > checkOut) return "Completed Stay";
    return "Currently Staying";
  }, [booking]);

  const isPaid = booking?.paymentStatus === "paid";

  const imageSrc =
    booking?.room?.images?.[0] || "/no-image.png";

  /* =========================
     ACTION HANDLERS
  ========================= */

  const retryPaymentHandler = () => {
    if (!booking?._id) return;
    dispatch(createPayment(booking._id));
  };

  const cancelBookingHandler = async () => {
    if (!booking?._id) return;

    if (!window.confirm("Cancel booking? Refund may apply."))
      return;

    try {
      await api.post(
        `/api/bookings/cancel/${booking._id}`
      );
      dispatch(getBookingsBy_Id(booking._id));
    } catch (err) {
      console.error("Cancel failed:", err);
    }
  };

  /* =========================
     EARLY RETURNS (AFTER HOOKS)
  ========================= */

  if (loading) {
    return <p className="text-gray-400 p-10">Loading...</p>;
  }

  if (error) {
    return <p className="text-red-400 p-10">{error}</p>;
  }

  if (!booking) return null;

  /* =========================
     MAIN JSX
  ========================= */

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1220] via-[#020617] to-black text-white px-4 pb-28 pt-10">

      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl font-bold">
          Booking Details
        </h1>
        <p className="text-gray-400 mt-1">
          Everything you need for your stay
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* MAIN CARD */}
        <div className="lg:col-span-2 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden">

          {/* IMAGE */}
          <div className="relative h-72">
            <img
              src={imageSrc}
              alt={booking.room?.roomType}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

            <div className="absolute top-4 right-4">
              <StatusBadge isPaid={isPaid} />
            </div>

            <div className="absolute bottom-4 left-4">
              <h2 className="text-xl font-semibold">
                {booking.room?.listing?.title}
              </h2>
              <p className="text-sm text-gray-300">
                {booking.room?.listing?.city},{" "}
                {booking.room?.listing?.country}
              </p>
            </div>
          </div>

          <div className="p-6 space-y-10">

            <BookingStatusTimeline status={booking.status} />

            <Section title="Stay Summary">
              <Info label="Booking ID" value={booking._id} />
              <Info label="Stay Status" value={stayStatus} highlight />
              <Info label="Check-in" value={formatDate(booking.checkIn)} />
              <Info label="Check-out" value={formatDate(booking.checkOut)} />
              <Info label="Nights" value={`${nights} nights`} />
              <Info label="Guests" value={booking.guests} />
              <Info label="Room Number" value={booking.room?.roomNumber} />
              <Info label="Room Type" value={booking.room?.roomType} />
              <Info
                label="Room Status"
                value={<RoomStatusBadge status={booking.room?.status} />}
              />
            </Section>

            <Section title="Payment">
              <Info label="Payment Method" value={booking.paymentMethod || "-"} />
              <Info label="Total Paid" value={`₹${booking.totalPrice}`} highlight />
              <Info label="Payment Status" value={booking.paymentStatus} />
            </Section>

            <Section title="Guest Details">
              <Info
                label="Name"
                value={`${booking.user?.firstname} ${booking.user?.lastname}`}
              />
              <Info label="Email" value={booking.user?.email} />
            </Section>

          </div>
        </div>

        {/* SIDE PANEL */}
        <div className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 h-fit">
          <h3 className="font-semibold mb-4">
            Quick Actions
          </h3>

          {/* QR */}
          {booking.status === "Booked" &&
           
            booking.room?.status !== "Occupied" && (
              <GenerateQR bookingId={booking._id} />
          )}

          {booking.paymentStatus === "failed" && (
            <Action text="Retry Payment" icon={<FaRedo />} onClick={retryPaymentHandler} />
          )}

          {booking.status !== "cancelled" && (
            <Action text="Cancel Booking" icon={<FaTimesCircle />} onClick={cancelBookingHandler} />
          )}

          {booking.paymentStatus === "paid" && (
            <PDFDownloadLink
              document={<InvoicePDF booking={booking} />}
              fileName={`invoice-${booking._id}.pdf`}
            >
              {({ loading }) => (
                <Action
                  icon={<FaFilePdf />}
                  text={loading ? "Preparing Invoice..." : "Download Invoice"}
                />
              )}
            </PDFDownloadLink>
          )}

          <Action text="Contact Hotel" icon={<FaPhone />} />
         <Action text="View Location" icon={<FaMapMarkedAlt />} onClick={() => {navigate(`/map`)}}>
           <Map listings={booking.room?.listing} />
         </Action>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsScreen;

/* ================= COMPONENTS ================= */

const StatusBadge = ({ isPaid }) => (
  <span
    className={`px-4 py-1 rounded-full text-xs font-medium backdrop-blur border ${
      isPaid
        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
        : "bg-amber-500/20 text-amber-300 border-amber-500/30"
    }`}
  >
    {isPaid ? "Confirmed" : "Payment Pending"}
  </span>
);

const Section = ({ title, children }) => (
  <div>
    <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-4">
      {title}
    </h4>
    <div className="space-y-3">{children}</div>
  </div>
);

const Info = ({ label, value, highlight }) => (
  <div className="flex justify-between text-sm">
    <span className="text-gray-400">{label}</span>
    <span className={highlight ? "font-semibold text-white" : "text-gray-200"}>
      {value}
    </span>
  </div>
);

const Action = ({ text, icon, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full flex items-center gap-3 py-3 px-4 mb-3 rounded-xl transition ${
      disabled
        ? "bg-white/5 text-gray-500 cursor-not-allowed"
        : "bg-white/10 hover:bg-white/20"
    }`}
  >
    {icon}
    <span>{text}</span>
  </button>
);

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "-";