import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import ListingCard from "../components/ListingCard";
import Message from "../components/Message";

import { findListing } from "../state/listing/Action";

import {
  FaMicrophone,
  FaSmile,
  FaRobot,
} from "react-icons/fa";

import { Rating } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

/* ======================
   CONFIG
====================== */

const TRENDING_CITIES = ["Dubai", "Paris", "New York", "London", "Goa", "Bali"];

const SORT_OPTIONS = [
  { label: "Newest", value: "" },
  { label: "Top Rated", value: "rating" },
];

const FEATURED_COUNT = 6;

const luxuryField = {
  "& .MuiOutlinedInput-root": {
    background: "rgba(255,255,255,0.08)",
    borderRadius: "14px",
    color: "#fff",
    backdropFilter: "blur(10px)",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(234,179,8,0.4)",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#facc15",
  },
  "& .MuiInputLabel-root": {
    color: "#facc15",
  },
};

const detectMood = (city, rating) => {
  if (rating >= 4.5) return "Luxury Mode";
  if (city) return "Explore Mode";
  return "Browsing";
};

/* ======================
   COMPONENT
====================== */

const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { listings } = useSelector((store) => store);

  /* ======================
     FILTER STATES
  ====================== */

  const [currentPage, setCurrentPage] = useState(1);

  const [searchCity, setSearchCity] = useState("");
  const [country, setCountry] = useState("");
  const [title, setTitle] = useState("");

  const [debouncedCity, setDebouncedCity] = useState("");

  const [rating, setRating] = useState(0);

  const [sortBy, setSortBy] = useState("");

  const [checkInDate, setCheckInDate] = useState(null);

  const [mood, setMood] = useState("Browsing");

  const listingsPerPage = 12;

  const listingData = listings.listing?.listings || [];
  const totalCount = listings.listing?.totalCount || 0;

  const { loading, error } = listings;

  /* ======================
     DEBOUNCE CITY SEARCH
  ====================== */

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCity(searchCity);
      setCurrentPage(1);
    }, 600);

    return () => clearTimeout(timer);
  }, [searchCity]);

  /* ======================
     FETCH LISTINGS
  ====================== */

  useEffect(() => {
    dispatch(
      findListing({
        city: debouncedCity || undefined,
        country: country || undefined,
        title: title || undefined,

        rating: rating || undefined,
        sortBy: sortBy || undefined,

        checkIn: checkInDate
          ? checkInDate.format("YYYY-MM-DD")
          : undefined,

        skip: (currentPage - 1) * listingsPerPage,
        limit: listingsPerPage,
      })
    );

    setMood(detectMood(searchCity, rating));
  }, [
    dispatch,
    currentPage,
    debouncedCity,
    country,
    title,
    rating,
    sortBy,
    checkInDate,
  ]);

  /* ======================
     FEATURED HOTELS
  ====================== */

  const featuredHotels = useMemo(
    () => listingData.slice(0, FEATURED_COUNT),
    [listingData]
  );

  /* ======================
     VOICE SEARCH
  ====================== */

  const startVoiceSearch = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return alert("Voice not supported");

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setSearchCity(text);
    };
  };

  /* ======================
     RESET FILTERS
  ====================== */

  const resetFilters = () => {
    setSearchCity("");
    setCountry("");
    setTitle("");
    setRating(0);
    setSortBy("");
    setCheckInDate(null);
    setCurrentPage(1);
  };

  /* ======================
     UI
  ====================== */

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="space-y-10 px-4 pb-20">

        {/* MOOD BAR */}
        <div className="bg-gradient-to-r from-purple-900 to-black rounded-xl px-6 py-3 flex items-center gap-3 shadow">
          <FaSmile className="text-yellow-400" />
          <span className="text-white font-semibold">
            Guest Mode: {mood}
          </span>
        </div>

        {/* SEARCH BAR */}
        <div className="bg-gradient-to-r from-[#0f172a] via-[#020617] to-black p-6 rounded-3xl border border-yellow-600/30 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

            {/* CITY */}
            <Autocomplete
              freeSolo
              options={TRENDING_CITIES}
              value={searchCity}
              onInputChange={(e, v) => setSearchCity(v)}
              renderInput={(params) => (
                <TextField {...params} label="City" sx={luxuryField} />
              )}
            />

            {/* COUNTRY */}
            <TextField
              label="Country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              sx={luxuryField}
            />

            {/* HOTEL NAME */}
            <TextField
              label="Hotel Name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={luxuryField}
            />

            {/* RATING */}
            {/* <div>
              <p className="text-xs text-yellow-300 mb-1">Min Rating</p>
              <Rating
                value={rating}
                onChange={(e, v) => setRating(v)}
              />
            </div> */}

            {/* VOICE */}
            <button
              onClick={startVoiceSearch}
              className="rounded-xl bg-yellow-500 text-black font-bold flex items-center justify-center gap-2"
            >
              <FaMicrophone /> Voice
            </button>

            {/* RESET */}
            <button
              onClick={resetFilters}
              className="rounded-xl bg-white/10 text-white font-bold"
            >
              Reset
            </button>
          </div>
        </div>

        {/* FEATURED */}
        <h2 className="text-2xl font-bold text-white">
          Featured Hotels
        </h2>

        <div className="flex gap-4 overflow-x-auto pb-3">
          {featuredHotels.map((hotel) => (
            <div
              key={hotel._id}
              onClick={() => navigate(`/hotel/${hotel._id}/rooms`)}
              className="cursor-pointer min-w-[260px] bg-white/10 rounded-xl p-2 hover:scale-105 transition"
            >
              <ListingCard listing={hotel} />
            </div>
          ))}
        </div>

        {/* ALL HOTELS */}
        <h2 className="text-2xl font-bold text-white">
          All Hotels
        </h2>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} variant="rectangular" height={260} />
            ))}
          </div>
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {listingData.map((hotel) => (
              <div
                key={hotel._id}
                onClick={() => navigate(`/hotel/${hotel._id}/rooms`)}
                className="cursor-pointer bg-white/10 rounded-xl p-2 hover:scale-105 transition"
              >
                <ListingCard listing={hotel} />
              </div>
            ))}
          </div>
        )}

        {/* PAGINATION */}
        <div className="flex justify-center gap-4 mt-10">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-6 py-2 bg-white/10 rounded-lg disabled:opacity-40"
          >
            Prev
          </button>

          <span className="text-white font-bold">
            Page {currentPage}
          </span>

          <button
            disabled={currentPage * listingsPerPage >= totalCount}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-6 py-2 bg-white/10 rounded-lg disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default HomeScreen;
