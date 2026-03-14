import { useEffect } from "react";
import QRCode from "react-qr-code";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { generateQr } from "../state/selfCheck/Action";

import { useParams } from "react-router-dom";

const QrCheckoutScreen = () => {
  const dispatch = useDispatch();
  const { id: bookingId } = useParams();

  const { qr, loading, error } = useSelector((s) => s.selfCheck);
  const booking = useSelector((s) =>
    s.bookings.booking?.find((b) => b._id === bookingId)
  );

  useEffect(() => {
    if (booking?.status === "checked-in") {
      dispatch(generateQr(bookingId));
    }
  }, [dispatch, booking, bookingId]);

  if (!booking || booking.status !== "checked-in") {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Check-out QR available only after check-in
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 text-white">

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center"
      >
        <h1 className="text-xl font-semibold mb-2">
          Self Check-Out QR
        </h1>

        {loading ? (
          <p>Generating QR…</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : qr?.qrCode ? (
          <div className="bg-white p-4 rounded-xl inline-block">
            <QRCode value={qr.qrCode} size={200} />
          </div>
        ) : null}

        <p className="text-xs text-gray-400 mt-4">
          Show this QR at exit kiosk or reception
        </p>
      </motion.div>
    </div>
  );
};

export default QrCheckoutScreen;
