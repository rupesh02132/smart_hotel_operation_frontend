import { FaStar, FaMapMarkerAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ListingCard = ({ listing }) => {
  const navigate = useNavigate();

  const imageSrc =
    listing.images?.length > 0
      ? listing.images[0]
      : "/no-image.png";

  return (
    <div
      onClick={() => navigate(`/hotel/${listing._id}/rooms`)}
      className="
      group
      bg-white
      rounded-2xl
      overflow-hidden
      shadow-sm
      hover:shadow-lg
      active:scale-[0.98]
      transition-all duration-300
      flex flex-col
      h-full
      "
    >
      {/* IMAGE */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">

        <img
          src={imageSrc}
          alt={listing.title}
          className="
          w-full h-full object-cover
          group-hover:scale-105
          transition duration-700
          "
        />

        {/* readability gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* category */}
        <div className="
          absolute top-2 left-2
          bg-white/95
          text-gray-800
          text-[10px] sm:text-xs
          font-semibold
          px-2.5 py-[3px]
          rounded-full
          shadow
        ">
          {listing.category}
        </div>

        {/* rating */}
        {listing.ratingAvg > 0 && (
          <div className="
            absolute bottom-2 left-2
            flex items-center gap-1
            bg-yellow-400
            text-black
            text-[10px] sm:text-xs
            font-bold
            px-2.5 py-[3px]
            rounded-full
            shadow
          ">
            <FaStar className="text-[9px]" />
            {listing.ratingAvg.toFixed(1)}
          </div>
        )}

      </div>

      {/* DETAILS */}
      <div className="p-3 sm:p-4 flex flex-col gap-2 flex-1 cursor-pointer">

        {/* location */}
        <p className="
          flex items-center gap-1.5
          text-[11px] sm:text-sm
          text-gray-500
          font-medium
          truncate
        ">
          <FaMapMarkerAlt className="text-gray-400 text-[11px] shrink-0" />
          <span className="truncate">
            {listing.city}, {listing.country}
          </span>
        </p>

        {/* title */}
        <h3 className="
          text-sm sm:text-base
          font-bold
          text-gray-800
          leading-snug
          line-clamp-2
        ">
          {listing.title}
        </h3>

        {/* description */}
        <p className="
          text-[11px] sm:text-sm
          text-gray-500
          leading-relaxed
          line-clamp-2
        ">
          {listing.description}
        </p>

        {/* CTA */}
        <div className="
          mt-auto
          pt-2
          flex items-center justify-between
        ">
          <span className="
            text-xs sm:text-sm
            font-semibold
            text-indigo-600
            group-hover:underline
          ">
            View Rooms →
          </span>

          <div className="
            w-7 h-7 sm:w-8 sm:h-8
            flex items-center justify-center
            rounded-full
            bg-gray-100
            group-hover:bg-indigo-600
            group-hover:text-white
            transition
          ">
            →
          </div>
        </div>

      </div>
    </div>
  );
};

export default ListingCard;