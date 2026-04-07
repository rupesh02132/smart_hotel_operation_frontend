import { Link } from "react-router-dom";
import { FaBed, FaUsers, FaBath, FaCheckCircle ,FaChild} from "react-icons/fa";

const RoomCard = ({ room }) => {
console.log("Rendering RoomCard for room:", room);
  /* ==============================
     IMAGE SOURCE FIX
  ============================== */
  const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;
  const imageSrc =
    room.images && room.images.length > 0
      ? room.images[0].startsWith("http")
        ? room.images[0]
        : `${SOCKET_URL}${room.images[0]}`
      : "/no-image.png";

  /* ==============================
     STATUS LOGIC
  ============================== */
  const isBookable =
    room.status === "Vacant" || room.status === "Ready";

  const statusColors = {
    Vacant: "bg-green-600",
    Ready: "bg-emerald-500",
    Occupied: "bg-red-600",
    Cleaning: "bg-yellow-500",
    Maintenance: "bg-orange-600",
    Blocked: "bg-gray-700",
  };

  return (
    <div className="w-full">

      {/* Disable link if not bookable */}
      {isBookable ? (
        <Link
          to={`/booking/${room._id}`}
          className="block group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
        >
          <RoomContent
            room={room}
            imageSrc={imageSrc}
            isBookable={isBookable}
            statusColors={statusColors}
          />
        </Link>
      ) : (
        <div className="block group bg-white rounded-2xl overflow-hidden shadow-md opacity-80 cursor-not-allowed">
          <RoomContent
            room={room}
            imageSrc={imageSrc}
            isBookable={isBookable}
            statusColors={statusColors}
          />
        </div>
      )}
    </div>
  );
};

/* ==============================
   ROOM CONTENT COMPONENT
============================== */
const RoomContent = ({ room, imageSrc, isBookable, statusColors }) => (
  <>
    {/* ======================
        ROOM IMAGE
    ====================== */}
    <div className="relative aspect-[4/3] overflow-hidden">
      <img
        src={imageSrc}
        loading="lazy"
        alt={room.roomType}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
      />

      {/* PRICE BADGE */}
      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
        ₹{room.finalPrice || room.basePrice}/night
      </div>

      {/* STATUS BADGE */}
      <div
        className={`absolute top-2 left-2 text-white text-xs px-3 py-1 rounded-full ${
          statusColors[room.status] || "bg-gray-500"
        }`}
      >
        {room.status}
      </div>
    </div>

    {/* ======================
        ROOM DETAILS
    ====================== */}
    <div className="p-3 space-y-2">

      {/* TYPE + NUMBER */}
      <div className="flex justify-between items-center text-xs text-gray-600">
        <p className="font-semibold text-indigo-700">
          {room.roomType} Room
        </p>
        <p className="text-gray-500">
          Room #{room.roomNumber}
        </p>
      </div>

      {/* CAPACITY */}
      <div className="flex gap-4 text-xs text-gray-600">
        <span className="flex items-center gap-1">
          <FaUsers className="text-indigo-500" />
          {room.guests} Guests
        </span>

        <span className="flex items-center gap-1">
          <FaBed className="text-indigo-500" />
          {room.beds} Beds
        </span>

        <span className="flex items-center gap-1">
          <FaBath className="text-indigo-500" />
          {room.baths} Baths
        </span>
        <span className="flex items-center gap-1">
          <FaChild className="text-indigo-500" />
          {room.children} children
        </span>
      </div>

      {/* AMENITIES */}
      <div className="flex flex-wrap gap-2 mt-2">
        {room.amenities?.slice(0, 3).map((a, i) => (
          <span
            key={i}
            className="text-[11px] px-3 py-1 rounded-full bg-indigo-50 text-indigo-700"
          >
            {a}
          </span>
        ))}
      </div>

      {/* BOOK BUTTON */}
      <button
        disabled={!isBookable}
        className={`w-full mt-3 py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition ${
          isBookable
            ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:opacity-90"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        <FaCheckCircle />
        {isBookable ? "Book This Room" : "Not Available"}
      </button>
    </div>
  </>
);

export default RoomCard;