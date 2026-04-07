import { useRef } from "react";
import { FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const SimilarRoomsSlider = ({ rooms = [] }) => {
  const sliderRef = useRef(null);
  const navigate = useNavigate();

  const scroll = (dir) => {
    const container = sliderRef.current;
    if (!container) return;

    const width = container.clientWidth;

    container.scrollBy({
      left: dir === "left" ? -width : width,
      behavior: "smooth",
    });
  };

  if (!rooms || rooms.length === 0) return null;

  return (
    <div className="relative mt-16">

      {/* ⭐ TITLE */}
      <h2 className="text-3xl font-extrabold mb-6 text-white">
        Similar Rooms
      </h2>

      {/* ⭐ LEFT ARROW */}
      <button
        onClick={() => scroll("left")}
        className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-20
        bg-white/80 hover:bg-white text-black p-3 rounded-full shadow-xl"
      >
        <FaChevronLeft />
      </button>

      {/* ⭐ RIGHT ARROW */}
      <button
        onClick={() => scroll("right")}
        className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 z-20
        bg-white/80 hover:bg-white text-black p-3 rounded-full shadow-xl"
      >
        <FaChevronRight />
      </button>

      {/* ⭐ SLIDER */}
      <div
        ref={sliderRef}
        className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-4 scrollbar-hide"
      >
        {rooms.map((room) => {
          const image =
            room?.images?.[0] ||
            "https://via.placeholder.com/400x300?text=No+Room";

          return (
            <div
              key={room._id}
              onClick={() => navigate(`/booking/${room._id}`)}
              className="min-w-[260px] sm:min-w-[280px] lg:min-w-[320px]
              bg-white/10 backdrop-blur-xl border border-white/20
              rounded-3xl overflow-hidden cursor-pointer
              hover:scale-105 transition-all duration-300 snap-start"
            >
              {/* IMAGE */}
              <div className="h-48 overflow-hidden">
                <img
                  src={image}
                  alt={room?.roomType || "Room"}
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-110 transition"
                />
              </div>

              {/* DETAILS */}
              <div className="p-4 space-y-2">

                <div className="flex justify-between items-center">
                  <p className="font-bold text-white">
                    {room?.roomType || "Room"}
                  </p>

                  {room?.ratingAvg ? (
                    <span className="flex items-center gap-1 text-yellow-400 text-sm">
                      <FaStar />
                      {room.ratingAvg.toFixed(1)}
                    </span>
                  ) : null}
                </div>

                <p className="text-gray-300 text-sm line-clamp-2">
                  {room?.roomNumber || "No description available"}
                </p>

                <p className="text-lg font-extrabold text-yellow-400">
                  ₹{room?.basePrice ?? "N/A"}
                  <span className="text-xs text-gray-400 font-normal">
                    {" "} / night
                  </span>
                </p>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SimilarRoomsSlider;