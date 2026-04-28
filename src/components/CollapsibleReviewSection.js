import { useState } from "react";
import ReviewForm from "./ReviewForm";
import { motion, AnimatePresence } from "framer-motion";
import { FaRegCommentDots, FaChevronDown, FaChevronUp } from "react-icons/fa";

const CollapsibleReviewSection = ({ listingId }) => {
  const [openReviews, setOpenReviews] = useState(true);
  
  console.log("listingId....", listingId);

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="w-full mx-auto">
        <motion.div 
          className="relative bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/90 backdrop-blur-2xl border border-gray-700/50 rounded-2xl sm:rounded-3xl overflow-hidden"
          whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 hover:opacity-100 transition-opacity duration-700" />
          
          <button
            onClick={() => setOpenReviews(!openReviews)}
            className="relative w-full flex items-center justify-between gap-2 sm:gap-3 p-4 sm:p-5 md:p-6 text-left transition-all duration-300 group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative flex items-center gap-2 sm:gap-3 md:gap-4">
              <div className="p-2 sm:p-2.5 md:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 group-hover:scale-110 transition-transform duration-300">
                <FaRegCommentDots className="text-yellow-400 text-base sm:text-lg md:text-xl" />
              </div>
              
              <div className="flex flex-col">
                <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-extrabold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Guest Reviews
                </h2>
                <p className="text-gray-400 text-[10px] sm:text-xs mt-0.5 sm:mt-1">
                  Tap to {openReviews ? "hide" : "view"} reviews
                </p>
              </div>
            </div>

            <motion.div
              animate={{ rotate: openReviews ? 180 : 0 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
              className="p-1.5 sm:p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-all"
            >
              {openReviews ? (
                <FaChevronUp className="text-yellow-400 text-sm sm:text-base md:text-lg" />
              ) : (
                <FaChevronDown className="text-yellow-400 text-sm sm:text-base md:text-lg" />
              )}
            </motion.div>
          </button>

          <AnimatePresence mode="wait">
            {openReviews && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="border-t border-gray-700/50">
                  <div className="p-4 sm:p-5 md:p-6 lg:p-8">
                    <ReviewForm listingId={listingId} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute top-0 right-0 w-20 sm:w-24 md:w-32 h-20 sm:h-24 md:h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-20 sm:w-24 md:w-32 h-20 sm:h-24 md:h-32 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />
        </motion.div>
      </div>
    </motion.section>
  );
};

export default CollapsibleReviewSection;