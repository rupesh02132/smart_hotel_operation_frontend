import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { motion, AnimatePresence } from "framer-motion";
import { generateQr, clearQr } from "../../state/selfCheck/Action";
import {
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  QrCodeScanner as QrIcon,
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";

const GenerateQR = ({ bookingId }) => {
  const dispatch = useDispatch();

  const { loading, qr, error } = useSelector((state) => state.selfCheck);

  const [isExpired, setIsExpired] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    dispatch(clearQr());
  }, [bookingId, dispatch]);

  useEffect(() => {
    if (!qr?.expiresAt) return;
    const checkExpiry = () => {
      setIsExpired(new Date(qr.expiresAt).getTime() < Date.now());
    };
    checkExpiry();
    const interval = setInterval(checkExpiry, 1000);
    return () => clearInterval(interval);
  }, [qr?.expiresAt]);

  const handleGenerate = () => {
    if (!bookingId || loading) return;
    dispatch(generateQr(bookingId));
  };

  const showQR = (qr?.qrImage || qr?.qrToken) && !isExpired;

  const downloadQR = () => {
    if (!qr?.qrToken && !qr?.qrImage) return;
    const canvas = document.createElement("canvas");
    const svg = document.querySelector("#qr-code-svg");
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext("2d").drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.download = `QR_${bookingId}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      img.src = "data:image/svg+xml;base64," + btoa(svgData);
    } else if (qr?.qrImage) {
      const link = document.createElement("a");
      link.href = qr.qrImage;
      link.download = `QR_${bookingId}.png`;
      link.click();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-5">
      {/* Generate Button */}
      <motion.button
        onClick={handleGenerate}
        disabled={loading || !bookingId}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        whileTap={{ scale: 0.98 }}
        className={`relative w-full flex items-center justify-center gap-3 rounded-2xl py-3.5 font-semibold text-white shadow-lg transition-all duration-300 ${
          loading || !bookingId
            ? "bg-gray-400 cursor-not-allowed opacity-70"
            : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-indigo-500/30 hover:scale-[1.02]"
        }`}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Generating Secure QR...</span>
          </>
        ) : (
          <>
            <QrIcon className="text-white text-xl" />
            <span>{showQR ? "Regenerate QR Code" : "Generate Self Check-In QR"}</span>
          </>
        )}
      </motion.button>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400"
          >
            <ErrorIcon className="text-red-400 text-sm" />
            <p className="text-sm flex-1">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Display Card */}
      <AnimatePresence>
        {showQR && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 p-6 text-center shadow-2xl"
          >
            {/* Decorative glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-4">
                <CheckIcon className="text-emerald-300 text-sm" />
                Ready for Check-In
              </div>

              <h3 className="text-xl font-bold text-white mb-2">Self Check-In QR Code</h3>
              <p className="text-xs text-gray-400 mb-4">Present this QR at hotel reception</p>

              <div className="bg-white p-4 inline-block rounded-2xl shadow-xl mx-auto relative">
                {qr?.qrImage ? (
                  <img src={qr.qrImage} alt="QR Code" className="w-[200px] h-[200px] object-contain" />
                ) : (
                  <div id="qr-code-svg">
                    <QRCode value={qr?.qrToken} size={200} />
                  </div>
                )}
              </div>

              {/* Download Button */}
              <button
                onClick={downloadQR}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition"
              >
                <DownloadIcon className="text-sm" />
                Download QR
              </button>

              {/* Expiry Info */}
              {qr?.expiresAt && (
                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Expires: {new Date(qr.expiresAt).toLocaleString("en-IN")}</span>
                </div>
              )}

              <p className="mt-2 text-[11px] text-gray-500 font-mono">Booking ID: {bookingId?.slice(0, 8)}...{bookingId?.slice(-4)}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expired UI */}
      <AnimatePresence>
        {qr && isExpired && !showQR && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center space-y-4 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30"
          >
            <div className="flex items-center justify-center gap-2 text-amber-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-semibold">QR Code Expired</span>
            </div>
            <p className="text-xs text-gray-400">Please generate a new QR code for check-in</p>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium text-sm hover:shadow-lg transition"
            >
              <RefreshIcon className="text-sm" />
              Regenerate QR
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No booking ID state */}
      {!bookingId && !loading && !error && (
        <div className="text-center p-6 rounded-xl bg-gray-800/50 text-gray-400 text-sm">
          <QrIcon className="text-4xl mx-auto mb-2 opacity-50" />
          <p>No booking selected</p>
        </div>
      )}
    </div>
  );
};

export default GenerateQR;