import { FaStar, FaHotel } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ListingCard = ({ listing }) => {
  const navigate = useNavigate();

  /* ✅ CLOUDINARY IMAGE */
  const imageSrc =
    listing.images?.length > 0
      ? listing.images[0]
      : "/no-image.png";

  return (
    <div
      onClick={() => navigate(`/hotel/${listing._id}/rooms`)}
      className="cursor-pointer group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
    >
      {/* ================= IMAGE ================= */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={imageSrc}
          loading="lazy"
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />

        {/* CATEGORY BADGE */}
        <div className="absolute top-3 left-3 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full shadow">
          {listing.category}
        </div>

        {/* HOVER VIEW ROOMS */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
          <span className="flex items-center gap-2 bg-white text-black font-bold px-5 py-2 rounded-full shadow-xl">
            <FaHotel />
            View Rooms
          </span>
        </div>
      </div>

      {/* ================= DETAILS ================= */}
      <div className="p-4 space-y-2">
        {/* LOCATION + RATING */}
        <div className="flex justify-between items-center text-sm text-gray-500">
          <p className="truncate font-medium">
            {listing.city}, {listing.country}
          </p>

          {listing.ratingAvg > 0 && (
            <div className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-2 py-[3px] rounded-full text-xs font-semibold">
              <FaStar />
              {listing.ratingAvg.toFixed(1)}
            </div>
          )}
        </div>

        {/* HOTEL TITLE */}
        <h3 className="text-lg font-extrabold text-gray-800 truncate">
          {listing.title}
        </h3>

        {/* DESCRIPTION SHORT */}
        <p className="text-sm text-gray-500 line-clamp-2">
          {listing.description?.slice(0, 70)}...
        </p>

        {/* AMENITIES */}
 
      </div>
    </div>
  );
};

export default ListingCard;
