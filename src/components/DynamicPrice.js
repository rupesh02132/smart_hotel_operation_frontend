import { useEffect, useState } from "react";
import api from "../config/apiConfig";
import { FaChartLine, FaBolt } from "react-icons/fa";

const DynamicPrice = ({ listingId, checkIn }) => {
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!listingId || !checkIn) return;

    setLoading(true);

    api
      .get(`/api/pricing?listingId=${listingId}&checkIn=${checkIn}`)
      .then((res) => setPrice(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [listingId, checkIn]);

  if (!checkIn) return null;

  if (loading) {
    return (
      <div className="mt-2 text-xs text-gray-400 animate-pulse">
        AI pricing calculating...
      </div>
    );
  }

  if (!price) return null;

  return (
    <div className="mt-2 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-100 border border-yellow-300 p-3 text-sm shadow">
      <div className="flex items-center gap-2 font-semibold text-orange-700">
        <FaBolt />
        AI Price Prediction
      </div>

      <div className="mt-1">
        <p className="text-gray-600 line-through">
          Base: ₹{price.basePrice}
        </p>
        <p className="text-lg font-bold text-green-700">
          Now: ₹{price.finalPrice}
        </p>
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <FaChartLine /> Surge Factor: {price.factor}x
        </p>
      </div>
    </div>
  );
};

export default DynamicPrice;
