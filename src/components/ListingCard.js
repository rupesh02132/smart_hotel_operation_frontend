import { FaStar, FaMapMarkerAlt, FaHeart, FaShare, FaEye } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const ListingCard = ({ listing }) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const imageSrc =
    listing.images?.length > 0
      ? listing.images[0]
      : "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400";

  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing.title,
          text: `Check out ${listing.title} in ${listing.city}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={!isMobile ? { y: -8 } : {}}
      transition={{ duration: 0.3 }}
      onHoverStart={() => !isMobile && setIsHovered(true)}
      onHoverEnd={() => !isMobile && setIsHovered(false)}
      onClick={() => navigate(`/hotel/${listing._id}/rooms`)}
      className="group cursor-pointer h-full"
    >
      <div className="
        relative
        bg-gradient-to-br from-white to-gray-50
        dark:from-gray-900 dark:to-gray-800
        rounded-xl sm:rounded-2xl
        overflow-hidden
        shadow-md hover:shadow-xl
        transition-all duration-300
        flex flex-col
        h-full
        border border-gray-100 dark:border-gray-700
        active:scale-[0.98] sm:active:scale-100
      ">
        {/* Image Container */}
        <div className="relative w-full aspect-[4/3] overflow-hidden">
          <motion.img
            src={imageSrc}
            alt={listing.title}
            className="
              w-full h-full object-cover
              transition-all duration-500
            "
            whileHover={!isMobile ? { scale: 1.1 } : {}}
            transition={{ duration: 0.4 }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300" />

          {/* Category Badge */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="
              absolute top-2 sm:top-3 left-2 sm:left-3
              bg-white/95 backdrop-blur-sm
              dark:bg-gray-900/95
              text-gray-800 dark:text-gray-200
              text-[10px] xs:text-xs sm:text-sm
              font-semibold
              px-2 py-1 xs:px-2.5 xs:py-1.5 sm:px-3 sm:py-1.5
              rounded-full
              shadow-lg
              z-10
              truncate
              max-w-[120px] xs:max-w-[150px] sm:max-w-none
            "
          >
            {listing.category || "Hotel"}
          </motion.div>

          {/* Rating Badge */}
          {listing.ratingAvg > 0 && (
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="
                absolute bottom-2 sm:bottom-3 left-2 sm:left-3
                flex items-center gap-1 sm:gap-1.5
                bg-gradient-to-r from-yellow-400 to-orange-500
                text-white
                text-[10px] xs:text-xs sm:text-sm
                font-bold
                px-2 py-1 xs:px-2.5 xs:py-1.5 sm:px-3 sm:py-1.5
                rounded-full
                shadow-lg
                z-10
              "
            >
              <FaStar className="text-white text-[8px] xs:text-[10px] sm:text-xs" />
              {listing.ratingAvg.toFixed(1)}
              <span className="text-white/80 text-[8px] xs:text-[10px] hidden xs:inline">
                (128)
              </span>
            </motion.div>
          )}

          {/* Price Badge */}
          {listing.priceRange && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className="
                absolute bottom-2 sm:bottom-3 right-2 sm:right-3
                bg-black/80 backdrop-blur-sm
                text-white
                text-[10px] xs:text-xs sm:text-sm
                font-bold
                px-2 py-1 xs:px-2.5 xs:py-1.5 sm:px-3 sm:py-1.5
                rounded-full
                shadow-lg
                z-10
                whitespace-nowrap
              "
            >
              ₹{listing.priceRange || 999}
              <span className="text-[8px] xs:text-[10px] font-normal">/nt</span>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="
            absolute top-2 sm:top-3 right-2 sm:right-3
            flex gap-1.5 sm:gap-2
            z-20
          ">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLike}
              className="
                w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9
                rounded-full
                bg-white/90 backdrop-blur-sm
                flex items-center justify-center
                shadow-lg
                transition-all duration-300
                active:bg-red-50
              "
            >
              <FaHeart className={`text-xs xs:text-sm sm:text-base transition-colors ${isLiked ? "text-red-500 fill-red-500" : "text-gray-600"}`} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className="
                w-7 h-7 xs:w-8 xs:h-8 sm:w-9 sm:h-9
                rounded-full
                bg-white/90 backdrop-blur-sm
                flex items-center justify-center
                shadow-lg
                transition-all duration-300
                active:bg-blue-50
              "
            >
              <FaShare className="text-gray-600 text-xs xs:text-sm sm:text-base" />
            </motion.button>
          </div>

          {/* Quick View Overlay - Desktop only */}
          {!isMobile && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
              className="
                absolute inset-x-0 bottom-0
                bg-gradient-to-t from-black/90 to-transparent
                p-3 sm:p-4
                z-10
              "
            >
              <div className="flex items-center justify-center gap-2">
                <FaEye className="text-white text-xs sm:text-sm" />
                <span className="text-white text-xs sm:text-sm font-semibold">Quick View</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Content Container */}
        <div className="p-3 xs:p-3.5 sm:p-4 md:p-5 flex flex-col gap-2 xs:gap-2.5 sm:gap-3 flex-1">
          {/* Location */}
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="
              flex items-center gap-1 sm:gap-1.5
              text-[10px] xs:text-xs sm:text-sm
              text-gray-500 dark:text-gray-400
              font-medium
              truncate
            "
          >
            <FaMapMarkerAlt className="text-indigo-500 dark:text-indigo-400 text-[8px] xs:text-[10px] sm:text-xs shrink-0" />
            <span className="truncate">
              {listing.city}, {listing.country}
            </span>
          </motion.p>

          {/* Title */}
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="
              text-sm xs:text-base sm:text-lg md:text-xl
              font-bold
              text-gray-800 dark:text-white
              leading-tight
              line-clamp-2
              group-hover:text-indigo-600 dark:group-hover:text-indigo-400
              transition-colors
            "
          >
            {listing.title}
          </motion.h3>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="
              text-[10px] xs:text-xs sm:text-sm
              text-gray-500 dark:text-gray-400
              leading-relaxed
              line-clamp-2
            "
          >
            {listing.description || "Experience luxury and comfort at this beautiful property. Perfect for your next getaway."}
          </motion.p>

          {/* Amenities Preview */}
          {listing.amenities && listing.amenities.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-1 sm:gap-1.5 mt-0.5 sm:mt-1"
            >
              {listing.amenities.slice(0, isMobile ? 2 : 3).map((amenity, idx) => (
                <span
                  key={idx}
                  className="
                    text-[8px] xs:text-[10px] sm:text-xs
                    px-1.5 py-0.5 xs:px-2 xs:py-1 sm:px-2 sm:py-1
                    rounded-full
                    bg-gray-100 dark:bg-gray-800
                    text-gray-600 dark:text-gray-400
                    whitespace-nowrap
                  "
                >
                  {amenity.length > 12 ? amenity.substring(0, 10) + '...' : amenity}
                </span>
              ))}
              {listing.amenities.length > (isMobile ? 2 : 3) && (
                <span className="text-[8px] xs:text-[10px] sm:text-xs px-1.5 py-0.5 xs:px-2 xs:py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                  +{listing.amenities.length - (isMobile ? 2 : 3)}
                </span>
              )}
            </motion.div>
          )}

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="
              mt-auto
              pt-2 xs:pt-2.5 sm:pt-3
              flex items-center justify-between
              border-t border-gray-100 dark:border-gray-700
              gap-2
            "
          >
            <div className="flex flex-col flex-1 min-w-0">
              <span className="text-[8px] xs:text-[10px] text-gray-500">Starting from</span>
              <div className="flex items-baseline flex-wrap gap-1">
                <span className="
                  text-sm xs:text-base sm:text-lg
                  font-bold
                  text-indigo-600 dark:text-indigo-400
                ">
                  ₹{listing.priceRange|| 999}
                </span>
                <span className="text-[8px] xs:text-[10px] text-gray-500">/night</span>
              </div>
            </div>

            <motion.div
              whileHover={!isMobile ? { x: 5 } : {}}
              whileTap={{ scale: 0.95 }}
              className="
                flex items-center gap-1 sm:gap-2
                px-2 py-1.5 xs:px-3 xs:py-2 sm:px-4 sm:py-2
                rounded-full
                bg-indigo-600
                text-white
                text-[10px] xs:text-xs sm:text-sm
                font-semibold
                shadow-md
                active:shadow-lg
                transition-all
                whitespace-nowrap
              "
            >
              <span className="hidden xs:inline">View</span>
              <span className="xs:hidden">→</span>
              <span className="text-xs xs:text-sm sm:text-base">→</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Hover Border Effect - Desktop only */}
        {!isMobile && (
          <motion.div
            className="absolute inset-0 border-2 border-indigo-500/50 rounded-xl sm:rounded-2xl pointer-events-none"
            initial={{ opacity: 0, scale: 0.95 }}
            whileHover={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>
    </motion.div>
  );
};

export default ListingCard;