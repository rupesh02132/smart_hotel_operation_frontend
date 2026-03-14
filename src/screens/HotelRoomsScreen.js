import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Loader from "../components/Loader";
import Message from "../components/Message";
import RoomCard from "../components/RoomCard";

import { searchRooms } from "../state/room/Action";
import { FaSearch } from "react-icons/fa";

const AMENITIES_LIST = [
  "WiFi",
  "Air Conditioning",
  "Balcony",
  "Mini Bar",
  "Room Service",
  "TV",
  "Safe Locker",
];

const HotelRoomsScreen = () => {
  const { hotelId } = useParams();
  const dispatch = useDispatch();

  const { rooms = [], loading, error } = useSelector(
    (state) => state.room
  );

  /* ================= FILTER STATES ================= */
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [roomNumber, setRoomNumber] = useState("");
  const [roomType, setRoomType] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [amenities, setAmenities] = useState([]);

  /* ================= FETCH ROOMS ================= */
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

  /* ================= AMENITY TOGGLE ================= */
  const toggleAmenity = (item) => {
    if (amenities.includes(item)) {
      setAmenities(amenities.filter((a) => a !== item));
    } else {
      setAmenities([...amenities, item]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#05070f] to-black text-white px-6 py-12">
      <div className="max-w-6xl mx-auto mb-10">
        <h1 className="text-4xl font-extrabold mb-2">🏨 Rooms Available</h1>
        <p className="text-gray-400">
          Search and book the best room inside this hotel
        </p>
      </div>

      {/* FILTER BOX */}
      <div className="max-w-6xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-6 mb-12 shadow-xl">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <div className="relative">
            <FaSearch className="absolute top-4 left-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search room number..."
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-black/40 border border-white/10 outline-none"
            />
          </div>

          <select
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            className="px-4 py-3 rounded-xl bg-black/40 border border-white/10 outline-none"
          >
            <option value="">All Room Types</option>
            <option value="Standard">Standard</option>
            <option value="Deluxe">Deluxe</option>
            <option value="Family">Family</option>
            <option value="Suite">Suite</option>
            <option value="Double">Double</option>
            <option value="Single">Single</option>
            <option value="Presidential">Presidential</option>

          </select>

          <button
            onClick={() => setOnlyAvailable(!onlyAvailable)}
            className={`px-4 py-3 rounded-xl font-bold ${
              onlyAvailable ? "bg-green-600" : "bg-indigo-600"
            }`}
          >
            {onlyAvailable ? "Showing Ready Rooms" : "Only Ready Rooms"}
          </button>

        </div>

        {/* PRICE FILTER */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="px-4 py-3 rounded-xl bg-black/40 border border-white/10"
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="px-4 py-3 rounded-xl bg-black/40 border border-white/10"
          />
        </div>

        {/* AMENITIES */}
        <div className="mt-6">
          <h3 className="mb-3 font-semibold text-lg">Amenities</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {AMENITIES_LIST.map((item) => (
              <label key={item} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={amenities.includes(item)}
                  onChange={() => toggleAmenity(item)}
                />
                {item}
              </label>
            ))}
          </div>
        </div>

        <div className="mt-6 text-right text-sm text-gray-400">
          Total Rooms: <span className="text-white font-bold">{rooms.length}</span>
        </div>
      </div>

      {loading && <Loader />}
      {error && <Message variant="danger">{error}</Message>}

      {!loading && rooms.length === 0 && (
        <p className="text-center text-gray-400 text-lg">
          No rooms found.
        </p>
      )}

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {rooms.map((room) => (
          <RoomCard key={room._id} room={room} />
        ))}
      </div>
    </div>
  );
};

export default HotelRoomsScreen;