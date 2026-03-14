import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { generateQr, clearQr } from "../../state/selfCheck/Action";

const GenerateQR = ({ bookingId }) => {
  const dispatch = useDispatch();

  const { loading, qr, error } = useSelector(
    (state) => state.selfCheck
  );

  const [isExpired, setIsExpired] = useState(false);

  /* ============================
     CLEAR OLD QR WHEN BOOKING CHANGES
  ============================ */
  useEffect(() => {
    dispatch(clearQr());
  }, [bookingId, dispatch]);

  /* ============================
     CHECK EXPIRY LIVE
  ============================ */
  useEffect(() => {
    if (!qr?.expiresAt) return;

    const checkExpiry = () => {
      const expired =
        new Date(qr.expiresAt).getTime() < Date.now();
      setIsExpired(expired);
    };

    checkExpiry();

    const interval = setInterval(checkExpiry, 1000);

    return () => clearInterval(interval);
  }, [qr?.expiresAt]);

  /* ============================
     GENERATE QR
  ============================ */
  const handleGenerate = () => {
    if (!bookingId || loading) return;
    dispatch(generateQr(bookingId));
  };

  const showQR = (qr?.qrImage || qr?.qrToken) && !isExpired;

  return (
    <div className="w-full space-y-4">

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={loading || !bookingId}
        className="w-full flex justify-center items-center gap-2 rounded-xl
        bg-gradient-to-r from-indigo-500 to-purple-600
        py-3 font-semibold text-white hover:opacity-90 transition
        disabled:opacity-50"
      >
        {loading ? "Generating QR..." : "Generate Self Check-In QR"}
      </button>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-400 text-center">
          ❌ {error}
        </p>
      )}

      {/* ============================
           QR DISPLAY
      ============================ */}

      {showQR && (
        <div className="rounded-2xl bg-white/5 border border-white/10 p-6 text-center">

          <h3 className="text-lg font-bold text-white mb-2">
            📌 Self Check-In QR Code
          </h3>

          <div className="bg-white p-4 inline-block rounded-xl shadow-lg">

            {/* If backend sends image */}
            {qr?.qrImage ? (
              <img
                src={qr.qrImage}
                alt="QR Code"
                className="w-[180px] h-[180px]"
              />
            ) : (
              <QRCode value={qr?.qrToken} size={180} />
            )}

          </div>

          {qr?.expiresAt && (
            <p className="mt-3 text-xs text-gray-400">
              Expires:{" "}
              {new Date(qr.expiresAt).toLocaleString("en-IN")}
            </p>
          )}

          <p className="mt-2 text-xs text-gray-500">
            Booking ID: {bookingId}
          </p>
        </div>
      )}

      {/* ============================
           EXPIRED UI
      ============================ */}

      {qr && isExpired && (
        <div className="text-center space-y-3">
          <p className="text-xs text-red-400">
            ⚠ QR Expired — Please regenerate.
          </p>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm"
          >
            Regenerate QR
          </button>
        </div>
      )}
    </div>
  );
};

export default GenerateQR;