import { useEffect, useState } from "react";
import { api } from "../config/apiConfig";

const AIDynamicPricing = ({ listingId, checkIn }) => {
  const [price, setPrice] = useState(null);

  useEffect(() => {
    if (!listingId || !checkIn) return;

    api
      .get(`/api/pricing?listingId=${listingId}&checkIn=${checkIn}`)
      .then((res) => setPrice(res.data))
      .catch(() => setPrice(null));
  }, [listingId, checkIn]);

  if (!price) return null;

  const isHigher = price.finalPrice > price.basePrice;

  return (
    <div className="mt-4 rounded-2xl border border-yellow-400/30 bg-black/60 backdrop-blur-xl p-4 text-white">
      <p className="text-sm text-gray-300">AI Price Preview</p>

      <p className="text-2xl font-bold text-yellow-400">
        ₹{price.finalPrice}
      </p>

      <p className="text-xs text-gray-400">
        Base: ₹{price.basePrice} · Factor {price.factor}x
      </p>

      <p
        className={`mt-2 text-sm ${
          isHigher ? "text-red-400" : "text-green-400"
        }`}
      >
        {isHigher ? "High demand — book soon" : "Good time to book"}
      </p>
    </div>
  );
};

export default AIDynamicPricing;
