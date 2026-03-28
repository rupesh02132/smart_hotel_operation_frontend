import { useState } from "react";
import ReviewForm from "./ReviewForm";

const CollapsibleReviewSection = ({ listingId }) => {
  const [openReviews, setOpenReviews] = useState(true);
  console.log("listingId....", listingId);

  return (
    <section className="w-full mt-8 sm:mt-14 lg:mt-16 px-0 sm:px-5 lg:px-8">

      <div className="max-w-[1600px] mx-auto">

        {/* ⭐ CARD */}
        <div className="
          bg-black/60 backdrop-blur-2xl 
          border-0 sm:border sm:border-white/10
          rounded-none sm:rounded-2xl lg:rounded-3xl
          shadow-none sm:shadow-xl
          overflow-hidden
        ">

          {/* ⭐ HEADER */}
          <button
            onClick={() => setOpenReviews(!openReviews)}
            className="
              w-full flex items-center justify-between
              gap-3 px-4 py-4 sm:p-6
              text-left active:scale-[0.99]
              hover:bg-white/5 transition
            "
          >
            <div className="flex flex-col">
              <h2 className="text-base sm:text-xl lg:text-2xl font-extrabold text-white leading-tight">
                Guest Reviews
              </h2>

              <p className="text-gray-400 text-[11px] sm:text-xs lg:text-sm mt-1">
                Tap to {openReviews ? "hide" : "view"} reviews
              </p>
            </div>

            <span
              className={`text-yellow-400 text-lg sm:text-xl lg:text-2xl transition-transform duration-300 ${
                openReviews ? "rotate-180" : ""
              }`}
            >
              ⌃
            </span>
          </button>

          {/* ⭐ BODY */}
          <div
            className={`transition-[max-height,opacity] duration-500 ease-in-out
              ${openReviews ? "max-h-[3000px] opacity-100" : "max-h-0 opacity-0"}
              overflow-hidden`}
          >
            <div className="border-t border-white/10 p-4 sm:p-5 lg:p-8">

              <ReviewForm listingId={listingId} />

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default CollapsibleReviewSection;