import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Loader from "../components/Loader";
import Message from "../components/Message";
import SimilarRoomsSlider from "../components/SimilarRoomsSlider";
import { getRoomById } from "../state/room/Action";
import { createBooking } from "../state/booking/Action";
import { createPayment } from "../state/Payment/Action";
import {getListingReviews} from "../state/review/Action";

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
} from "react-icons/fa";
import {getListingById} from "../state/listing/Action";

const BookingScreen = () => {
  const { roomId } = useParams();
  const dispatch = useDispatch();
  console.log("Room ID:", roomId);

  /* ============================
     ✅ ROOM DETAILS REDUX SAFE
  ============================ */
  const roomDetails = useSelector(
    (state) => state.room || {}
  );

  const { room, loading, error } = roomDetails;

  const {listing} = useSelector((state) => state.listings || {});

 const listingId = room?.listing;

  /* ============================
     ✅ AUTH SAFE
  ============================ */
  const auth = useSelector((state) => state.auth || {});
  const jwt = auth.jwt;
  console.log("Auth State:", auth);

  /* ============================
     FORM STATE
  ============================ */
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(1);

  /* ============================
     FETCH ROOM DETAILS
  ============================ */
 useEffect(() => {
  if (listingId) {
    dispatch(getListingById(listingId));
    dispatch(getListingReviews(listingId));
  }

  if (roomId) {
    dispatch(getRoomById(roomId));
  }
}, [dispatch, roomId, listingId]);

  /* ============================
     PRICE DISPLAY ONLY (UI)
     Backend Calculates Final Total
  ============================ */
  const pricePerNight =
    room?.dynamicPrice > 0
      ? room.dynamicPrice
      : room?.basePrice;

  /* Nights Preview */
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    return Math.ceil(
      (checkOut - checkIn) / (1000 * 60 * 60 * 24)
    );
  }, [checkIn, checkOut]);

  /* ============================
     BOOKING HANDLER
     ✅ Only Send Dates + Guests
     Backend Calculates Total
  ============================ */
 const bookingHandler = async (e) => {
  e.preventDefault();

  if (!checkIn || !checkOut) {
    return alert("Please select dates first");
  }

  try {
    const result = await dispatch(
      createBooking({
        listing: room?.listing,
        room: roomId,
        guests,
        // ✅ FIX: correct field names
        checkInDate: checkIn.toISOString(),
        checkOutDate: checkOut.toISOString(),
      })
    );

    // ✅ safer extraction (handles different Redux setups)
    const bookingId =
      result?.payload?._id ||
      result?._id ||
      result?.payload?.booking?._id;

    if (!bookingId) {
      alert("Booking failed");
      return;
    }

    // ✅ call payment only if booking success
    dispatch(createPayment(bookingId));

  } catch (err) {
    console.error(err);
    alert(err.message || "Booking Failed");
  }
};

  /* ============================
     UI STATES
  ============================ */
  if (loading) return <Loader />;
  if (error) return <Message variant="danger">{error}</Message>;
  if (!room) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050B18] to-black text-white px-6 py-14">

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14">

        {/* =====================================
            LEFT SIDE → ROOM DETAILS
        ===================================== */}
        <div className="space-y-7">

          {/* ✅ IMAGE CAROUSEL */}
          <Carousel className="rounded-3xl overflow-hidden shadow-xl">
            {room.images?.map((img, i) => (
              <Carousel.Item key={i}>
                <img
                  src={img}
                  alt=""
                  className="h-[360px] w-full object-cover"
                />
              </Carousel.Item>
            ))}
          </Carousel>

          {/* TITLE */}
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              {room.roomType} Room
            </h1>

            <p className="text-gray-400 mt-2">
              Room Number:{" "}
              <span className="text-white font-semibold">
                {room.roomNumber}
              </span>
            </p>
          </div>

          {/* META */}
          <div className="flex flex-wrap gap-6 text-sm text-gray-300">
            <p className="flex items-center gap-2">
              <FaUsers className="text-blue-400" />
              Max Guests: {room.guests}
            </p>
            <p className="flex items-center gap-2">
              <FaChild className="text-blue-400" />
              Max Children: {room.children}
            </p>

            <p className="flex items-center gap-2">
              <FaBed className="text-blue-400" />
              Beds: {room.beds}
            </p>

            <p className="flex items-center gap-2">
              <FaHotel className="text-blue-400" />
              Floor: {room.floor}
            </p>

            <p className="flex items-center gap-2">
              <FaCheckCircle className="text-green-400" />
              Status: {room.status}
            </p>
          </div>

          {/* AMENITIES */}
          <div>
            <h2 className="text-xl font-bold mb-3">
              Amenities Included
            </h2>

            <div className="grid grid-cols-2 gap-3">
              {room.amenities?.map((a, i) => (
                <div
                  key={i}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-gray-200"
                >
                  ✅ {a}
                </div>
              ))}
            </div>
          </div>

          {/* PRICE */}
          <div className="text-3xl font-extrabold text-green-400">
            ₹{pricePerNight}
            <span className="text-sm text-gray-400">
              {" "}
              / night
            </span>
          </div>
        </div>

        {/* =====================================
            RIGHT SIDE → BOOKING FORM
        ===================================== */}
        <div className="rounded-3xl bg-white/5 border border-white/10 p-10 shadow-2xl">

          <h2 className="text-3xl font-bold mb-8">
            Confirm Your Booking
          </h2>

          {!jwt && (
            <Message variant="danger">
              Please login first to book this room.
            </Message>
          )}

          <form onSubmit={bookingHandler} className="space-y-6">

            {/* CHECK-IN */}
            <div>
              <label className="block mb-2 text-gray-300 font-semibold">
                Check-In Date
              </label>
              <DatePicker
                selected={checkIn}
                onChange={setCheckIn}
                minDate={new Date()}
                placeholderText="Select check-in"
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-blue-400/30 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* CHECK-OUT */}
            <div>
              <label className="block mb-2 text-gray-300 font-semibold">
                Check-Out Date
              </label>
              <DatePicker
                selected={checkOut}
                onChange={setCheckOut}
                minDate={checkIn}
                placeholderText="Select check-out"
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-blue-400/30 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* GUESTS */}
            <div>
              <label className="block mb-2 text-gray-300 font-semibold">
                Guests
              </label>

              <select
                value={guests}
                onChange={(e) => setGuests(+e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-blue-400/30"
              >
                {[...Array(room.guests)].map((_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1} Guest(s)
                  </option>
                ))}
              </select>
            </div>

            {/* PRICE PREVIEW */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-5">
              <p className="text-gray-300 text-sm">
                Nights:{" "}
                <span className="text-white font-bold">
                  {nights || 0}
                </span>
              </p>

              <p className="text-green-400 text-xl font-extrabold mt-2">
                Estimated Total: ₹
                {nights > 0 ? nights * pricePerNight : 0}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Final price calculated securely on backend.
              </p>
            </div>

            {/* BUTTON */}
            <button
              disabled={!jwt || nights === 0}
              className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-blue-500 to-indigo-700 hover:scale-[1.02] transition disabled:opacity-40"
            >
              Pay & Confirm Booking
            </button>
          </form>
        </div>
      </div>
      {/* ==============================
   ⭐ REVIEW SECTION
================================ */}
<div className="max-w-7xl mx-auto mt-20 space-y-10">

  <div className="bg-white/5  rounded-3xl p-6 shadow-xl">

    <h2 className="text-3xl font-extrabold mb-1">
      Guest Reviews
    </h2>

    {/* ⭐ REVIEW FORM */}
    <CollapsibleReviewSection listingId={room?.listing} />

    {/* ⭐ REVIEW LIST */}
   
  </div>

  {/* ==============================
     ⭐ SIMILAR ROOMS
  ================================= */}
  <SimilarRoomsSlider rooms={listing?.rooms} />

</div>
    </div>
  );
};

export default BookingScreen;
