import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { verifyQr } from "../state/selfCheck/Action";

const QrScannerScreen = () => {
  const dispatch = useDispatch();

  const videoRef = useRef(null);
  const scannerControlsRef = useRef(null);
  const codeReaderRef = useRef(null);
  const scannedRef = useRef(false);

  const { loading, error } = useSelector((s) => s.selfCheck);

  const [mode, setMode] = useState("checkin");
  const [scanned, setScanned] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  /* ================= START SCANNER ================= */
  const startScanner = useCallback(async () => {
    try {
      scannedRef.current = false;

      codeReaderRef.current = new BrowserMultiFormatReader();

      const controls =
        await codeReaderRef.current.decodeFromVideoDevice(
          null,
          videoRef.current,
          (result) => {
            if (result && !scannedRef.current) {
              scannedRef.current = true;
              setScanned(true);

              const qrToken = result.getText();
              dispatch(verifyQr(qrToken));

              controls.stop();
            }
          }
        );

      scannerControlsRef.current = controls;
    } catch (err) {
      console.error(err);
      setCameraError("Camera access denied or not supported");
    }
  }, [dispatch]);

  /* ================= INIT ================= */
  useEffect(() => {
    startScanner();

    return () => {
      scannerControlsRef.current?.stop();
    };
  }, [mode, startScanner]);

  /* ================= RESET ================= */
  const handleReset = () => {
    setScanned(false);
    setCameraError(null);
    scannerControlsRef.current?.stop();
    startScanner();
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center px-3 sm:px-6 py-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-4 sm:p-6 shadow-2xl"
      >
        {/* TITLE */}
        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-center mb-4">
          QR {mode === "checkin" ? "Check-In" : "Check-Out"} Scanner
        </h1>

        {/* MODE */}
        <div className="flex gap-2 sm:gap-3 mb-4">
          <button
            onClick={() => {
              setScanned(false);
              setMode("checkin");
            }}
            className={`flex-1 py-2.5 sm:py-3 rounded-xl font-medium transition text-sm sm:text-base ${
              mode === "checkin"
                ? "bg-emerald-500 text-black"
                : "bg-white/10 active:scale-95"
            }`}
          >
            Check-In
          </button>

          <button
            onClick={() => {
              setScanned(false);
              setMode("checkout");
            }}
            className={`flex-1 py-2.5 sm:py-3 rounded-xl font-medium transition text-sm sm:text-base ${
              mode === "checkout"
                ? "bg-amber-500 text-black"
                : "bg-white/10 active:scale-95"
            }`}
          >
            Check-Out
          </button>
        </div>

        {/* CAMERA */}
        <div className="relative rounded-2xl overflow-hidden border border-white/20">
          <video
            ref={videoRef}
            className="w-full h-[240px] sm:h-[280px] md:h-[320px] object-cover"
            muted
          />

          {/* scan frame */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 border-4 border-emerald-400 rounded-2xl animate-pulse" />
          </div>
        </div>

        {/* STATUS */}
        {loading && (
          <p className="text-xs sm:text-sm text-gray-300 mt-4 text-center animate-pulse">
            Processing QR...
          </p>
        )}

        {cameraError && (
          <p className="text-xs sm:text-sm text-red-400 mt-4 text-center">
            {cameraError}
          </p>
        )}

        {error && (
          <p className="text-xs sm:text-sm text-red-400 mt-4 text-center">
            {error}
          </p>
        )}

        {scanned && !loading && !error && (
          <>
            <p className="text-xs sm:text-sm text-emerald-400 mt-4 text-center font-semibold">
              ✅ QR processed successfully
            </p>

            <button
              onClick={handleReset}
              className="mt-4 w-full py-2.5 sm:py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-xl transition text-sm sm:text-base"
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