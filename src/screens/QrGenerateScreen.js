import { useEffect } from "react";
import QRCode from "react-qr-code";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { generateQr } from "../state/selfCheck/Action";

const QrGenerateScreen = () => {
  const dispatch = useDispatch();
  const { id: bookingId } = useParams();

  const { qr, loading, error } = useSelector((s) => s.selfCheck);

  const booking = useSelector((s) =>
    Array.isArray(s.bookings.booking)
      ? s.bookings.booking.find((b) => b._id === bookingId)
      : null
  );

  useEffect(() => {
    if (bookingId) {
      dispatch(generateQr(bookingId));
    }
  }, [dispatch, bookingId]);

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Booking not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 w-full max-w-sm text-center"
      >
        <h1 className="text-2xl font-bold mb-2">Self Check-In QR</h1>
        <p className="text-gray-400 text-sm mb-6">
          Show this QR at the hotel reception or kiosk
        </p>

        {loading ? (
          <p className="text-sm text-gray-400">Generating QR…</p>
        ) : error ? (
          <p className="text-red-400 text-sm">{error}</p>
        ) : qr?.qrCode ? (
          <div className="bg-white p-4 rounded-xl inline-block">
            <QRCode value={qr.qrCode} size={180} />
          </div>
        ) : null}

        <p className="mt-6 text-xs text-gray-400">
          Booking ID: {bookingId}
        </p>

        {booking.status === "checked-in" ? (
          <p className="mt-3 text-emerald-400 font-semibold">
            ✅ Checked-In Successfully
          </p>
        ) : (
          <p className="mt-3 text-yellow-400">
            Waiting for check-in
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default QrGenerateScreen;
