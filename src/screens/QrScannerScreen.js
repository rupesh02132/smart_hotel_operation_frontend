import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { verifyQr } from "../state/selfCheck/Action";

const QrScannerScreen = () => {
  const dispatch = useDispatch();
  const videoRef = useRef(null);

  const scannerControlsRef = useRef(null);
  const codeReaderRef = useRef(null);

  const { loading, error } = useSelector((s) => s.selfCheck);

  const [mode, setMode] = useState("checkin");
  const [scanned, setScanned] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  /* ===========================
     START SCANNER
  =========================== */
  const startScanner = async () => {
    try {
      codeReaderRef.current = new BrowserMultiFormatReader();

      const controls =
        await codeReaderRef.current.decodeFromVideoDevice(
          null,
          videoRef.current,
          (result) => {
            if (result && !scanned) {
              setScanned(true);

              const qrToken = result.getText();

              dispatch(verifyQr(qrToken));

              // stop camera after scan
              controls.stop();
            }
          }
        );

      scannerControlsRef.current = controls;

    } catch (err) {
      console.error(err);
      setCameraError("Camera access denied or unavailable");
    }
  };

  /* ===========================
     INIT ON MOUNT
  =========================== */
  useEffect(() => {
    startScanner();

    return () => {
      scannerControlsRef.current?.stop();
    };
  }, [mode]); // restart if mode changes

  /* ===========================
     RESET SCANNER
  =========================== */
  const handleReset = () => {
    setScanned(false);
    setCameraError(null);

    scannerControlsRef.current?.stop();

    startScanner();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 text-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 w-full max-w-md text-center shadow-2xl"
      >
        <h1 className="text-xl sm:text-2xl font-semibold mb-4">
          QR {mode === "checkin" ? "Check-In" : "Check-Out"} Scanner
        </h1>

        {/* MODE TOGGLE */}
        <div className="flex justify-center gap-3 mb-4">
          <button
            onClick={() => {
              setScanned(false);
              setMode("checkin");
            }}
            className={`flex-1 py-2 rounded-xl font-medium transition ${
              mode === "checkin"
                ? "bg-emerald-500 text-black"
                : "bg-white/10 hover:bg-white/20"
            }`}
          >
            Check-In
          </button>

          <button
            onClick={() => {
              setScanned(false);
              setMode("checkout");
            }}
            className={`flex-1 py-2 rounded-xl font-medium transition ${
              mode === "checkout"
                ? "bg-amber-500 text-black"
                : "bg-white/10 hover:bg-white/20"
            }`}
          >
            Check-Out
          </button>
        </div>

        {/* CAMERA */}
        <div className="relative rounded-2xl overflow-hidden border border-white/20">
          <video
            ref={videoRef}
            className="w-full h-60 sm:h-72 object-cover"
            muted
          />

          {/* Scan overlay frame */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 h-40 border-4 border-emerald-400 rounded-2xl animate-pulse" />
          </div>
        </div>

        {/* STATUS */}
        {loading && (
          <p className="text-sm text-gray-300 mt-4 animate-pulse">
            Processing...
          </p>
        )}

        {cameraError && (
          <p className="text-sm text-red-400 mt-4">
            {cameraError}
          </p>
        )}

        {error && (
          <p className="text-sm text-red-400 mt-4">
            {error}
          </p>
        )}

        {scanned && !loading && !error && (
          <>
            <p className="text-sm text-emerald-400 mt-4 font-semibold">
              ✅ QR processed successfully
            </p>

            <button
              onClick={handleReset}
              className="mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl transition"
            >
              Scan Another
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default QrScannerScreen;