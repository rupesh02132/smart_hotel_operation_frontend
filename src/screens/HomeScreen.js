import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SmartCarousel from "../components/homeCarousel/SmartCarousel";
import ListingCard from "../components/ListingCard";
import Message from "../components/Message";
import { findListing } from "../state/listing/Action";
import { FaMicrophone, FaSmile } from "react-icons/fa";
import Skeleton from "@mui/material/Skeleton";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import "bootstrap/dist/css/bootstrap.min.css";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const TRENDING_CITIES = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Goa",
  "Jaipur",
  "Manali",
  "Udaipur",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Rishikesh",
  "Shimla",
  "Agra",
  "Jaisalmer",
  "Leh",
  "Darjeeling",
  "Pondicherry",
  "Coorg",
  "Andaman",
  "Lakshadweep",
  "Munnar",
  "Ooty",
  "Kumarakom",
  "Mysore",
  "Noida"
];

const FEATURED_COUNT = 10;

const luxuryField = {
  "& .MuiOutlinedInput-root": {
    background: "rgba(255,255,255,0.07)",
    borderRadius: "14px",
    color: "#fff",
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
  const [checkInDate, setCheckInDate] = useState(null);
  const [mood, setMood] = useState("Browsing");

  const listingsPerPage = 12;

  const listingData = listings.listing?.listings || [];
  const totalCount = listings.listing?.totalCount || 0;
  const { loading, error } = listings;

  /* debounce */
  useEffect(() => {
    const t = setTimeout(() => {
      setDebouncedCity(searchCity);
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(t);
  }, [searchCity]);

  /* fetch */
  useEffect(() => {
    dispatch(
      findListing({
        city: debouncedCity || undefined,
        country: country || undefined,
        title: title || undefined,
        rating: rating || undefined,
        sortBy: sortBy || undefined,
        checkIn: checkInDate ? checkInDate.format("YYYY-MM-DD") : undefined,
        skip: (currentPage - 1) * listingsPerPage,
        limit: listingsPerPage,
      }),
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
    searchCity,
  ]);

  /* featured */
  const featuredHotels = useMemo(() => {
    const data = listings.listing?.listings || [];
    return data.slice(0, FEATURED_COUNT);
  }, [listings]);

  /* ⭐ Voice search FIX */
  const startVoiceSearch = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SR) return alert("Voice not supported");

    const rec = new SR();
    rec.lang = "en-US";
    rec.start();

    rec.onresult = (e) => {
      let text = e.results[0][0].transcript;
      text = text.replace(/[.。]/g, "").trim();
      setSearchCity(text);
    };
  };

  const resetFilters = () => {
    setSearchCity("");
    setCountry("");
    setTitle("");
    setRating(0);
    setSortBy("");
    setCheckInDate(null);
    setCurrentPage(1);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="container-fluid px-3 pb-24">
        {/* mood */}
        <div
          className="rounded-4 p-3 mb-3 bg-gradient text-white d-flex align-items-center gap-2 shadow"
          style={{ background: "linear-gradient(90deg,purple,black)" }}
        >
          <FaSmile />
          Guest Mode: {mood}
        </div>

        {/* search */}
        <div
          className="rounded-4 p-3 shadow border border-warning border-opacity-25"
          style={{ background: "linear-gradient(90deg,#020617,#000)" }}
        >
          <div className="row g-2">
            <div className="col-12 col-md-4">
              <Autocomplete
                freeSolo
                options={TRENDING_CITIES}
                value={searchCity}
                onInputChange={(e, v) => setSearchCity(v)}
                renderInput={(p) => (
                  <TextField {...p} label="City" sx={luxuryField} />
                )}
              />
            </div>

            <div className="col-6 col-md-2">
              <TextField
                label="Country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                sx={luxuryField}
                fullWidth
              />
            </div>

            <div className="col-6 col-md-2">
              <TextField
                label="Hotel"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={luxuryField}
                fullWidth
              />
            </div>

            <div className="col-6 col-md-2">
              <button
                onClick={startVoiceSearch}
                className="btn btn-warning w-100 h-100 fw-bold d-flex align-items-center justify-content-center gap-2"
              >
                <FaMicrophone /> Voice
              </button>
            </div>

            <div className="col-6 col-md-2">
              <button
                onClick={resetFilters}
                className="btn btn-outline-light w-100 h-100 fw-bold"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* featured */}
        <h4 className="text-white mt-4 mb-3">Featured Hotels</h4>

        <div className="d-flex gap-3 overflow-auto pb-2">
          {featuredHotels.map((hotel) => (
            <div
              key={hotel._id}
              onClick={() => navigate(`/hotel/${hotel._id}/rooms`)}
              style={{ minWidth: 240 }}
              className="bg-opacity-50 rounded-5 p-2 cursor-pointer"
            >
              <ListingCard listing={hotel} />
            </div>
          ))}
        </div>

        {/* ================= SMART HOTEL PLATFORM INFO ================= */}
        <SmartCarousel />

        {/* all */}
        <h4 className="text-white mt-4 mb-3">All Hotels</h4>

        {loading ? (
          <div className="row g-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div className="col-6 col-md-3" key={i}>
                <Skeleton variant="rectangular" height={250} />
              </div>
            ))}
          </div>
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <div className="row g-3">
            {listingData.map((hotel) => (
              <div
                key={hotel._id}
                onClick={() => navigate(`/hotel/${hotel._id}/rooms`)}
                className="col-6 col-md-3"
              >
                <div className="bg-opacity-50 p-2 rounded-5 h-100">
                  <ListingCard listing={hotel} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* pagination */}
        <div className="d-flex justify-content-center align-items-center gap-3 mt-4 text-white">
          <button
            className="btn btn-outline-light"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Prev
          </button>
          Page {currentPage}
          <button
            className="btn btn-outline-light"
            disabled={currentPage * listingsPerPage >= totalCount}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
        {/* 🔥 ADD THIS SECTION HERE */}
        <div className="mt-10 text-center max-w-3xl mx-auto text-gray-300 px-4">
          <h2 className="text-3xl font-bold text-yellow-400 mb-4">
            Smart Hotel Platform
          </h2>

          <p className="text-base md:text-lg leading-relaxed text-gray-300 max-w-2xl mx-auto text-center tracking-wide">
            Smart Hotel is an intelligent booking platform designed to simplify
            how users discover and reserve accommodations. It leverages
            <span className="text-yellow-400 font-medium">
              {" "}
              AI-driven recommendations
            </span>
            , real-time availability, and a seamless user experience to deliver
            <span className="text-yellow-400 font-medium">
              {" "}
              fast, reliable, and personalized
            </span>{" "}
            hotel booking.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-8 text-sm">
            <div className="p-4 bg-white/5 rounded-xl">
              ⚡ Fast Booking
              <br /> Instant confirmation system
            </div>

            <div className="p-4 bg-white/5 rounded-xl">
              🤖 Smart AI
              <br /> Personalized recommendations
            </div>

            <div className="p-4 bg-white/5 rounded-xl">
              🔒 Secure
              <br /> Safe payments & data protection
            </div>
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
};

export default HomeScreen;
