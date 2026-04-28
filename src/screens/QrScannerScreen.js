import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { verifyQr } from "../state/selfCheck/Action";
import { 
  FaQrcode, 
  FaCamera, 
  FaSync, 
  FaCheckCircle, 
  FaTimesCircle,
  FaInfoCircle,
  FaLightbulb
} from "react-icons/fa";

const QrScannerScreen = () => {
  const dispatch = useDispatch();

  const videoRef = useRef(null);
  const scannerControlsRef = useRef(null);
  const codeReaderRef = useRef(null);
  const scannedRef = useRef(false);

  const { loading, error: reduxError } = useSelector((s) => s.selfCheck);

  const [mode, setMode] = useState("checkin");
  const [scanned, setScanned] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [localError, setLocalError] = useState(null);

  /* ================= GET AVAILABLE CAMERAS ================= */
  const getAvailableCameras = useCallback(async () => {
    try {
      const codeReader = new BrowserMultiFormatReader();
      const videoInputDevices = await codeReader.listVideoInputDevices();
      setCameras(videoInputDevices);
      if (videoInputDevices.length > 0 && !selectedCamera) {
        setSelectedCamera(videoInputDevices[0].deviceId);
      }
    } catch (err) {
      console.error("Error listing cameras:", err);
    }
  }, [selectedCamera]);

  /* ================= START SCANNER ================= */
  const startScanner = useCallback(async () => {
    try {
      scannedRef.current = false;
      setScanned(false);
      setCameraError(null);
      setLocalError(null);

      codeReaderRef.current = new BrowserMultiFormatReader();

      const deviceId = selectedCamera || null;
      
      const controls = await codeReaderRef.current.decodeFromVideoDevice(
        deviceId,
        videoRef.current,
        (result) => {
          if (result && !scannedRef.current) {
            scannedRef.current = true;
            setScanned(true);

            const qrToken = result.getText();
            
            // Add haptic feedback if available
            if (window.navigator && window.navigator.vibrate) {
              window.navigator.vibrate(200);
            }
            
            dispatch(verifyQr(qrToken));
            controls.stop();
          }
        }
      );

      scannerControlsRef.current = controls;

      // Apply torch if enabled
      if (torchEnabled && controls) {
        try {
          await controls.applyTorch(true);
        } catch (err) {
          console.error("Torch not supported:", err);
        }
      }
    } catch (err) {
      console.error(err);
      setCameraError("Camera access denied or not supported. Please check permissions.");
    }
  }, [dispatch, selectedCamera, torchEnabled]);

  /* ================= INIT ================= */
  useEffect(() => {
    getAvailableCameras();
    startScanner();

    return () => {
      scannerControlsRef.current?.stop();
    };
  }, [mode, startScanner, getAvailableCameras]);

  /* ================= RESET ================= */
  const handleReset = () => {
    setScanned(false);
    setCameraError(null);
    setLocalError(null);
    scannedRef.current = false;
    if (scannerControlsRef.current) {
      scannerControlsRef.current.stop();
    }
    startScanner();
  };

  /* ================= SWITCH CAMERA ================= */
  const switchCamera = () => {
    if (cameras.length > 1) {
      const currentIndex = cameras.findIndex(cam => cam.deviceId === selectedCamera);
      const nextIndex = (currentIndex + 1) % cameras.length;
      setSelectedCamera(cameras[nextIndex].deviceId);
      if (scannerControlsRef.current) {
        scannerControlsRef.current.stop();
      }
      startScanner();
    }
  };

  /* ================= TOGGLE TORCH ================= */
  const toggleTorch = async () => {
    if (scannerControlsRef.current) {
      try {
        await scannerControlsRef.current.applyTorch(!torchEnabled);
        setTorchEnabled(!torchEnabled);
      } catch (err) {
        console.error("Torch not supported on this device");
      }
    }
  };

  // Determine which error to display
  const displayError = localError || cameraError || reduxError;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#0a0f1f] to-[#020617] flex items-center justify-center px-4 py-6">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md md:max-w-lg bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-5 sm:p-6 shadow-2xl"
      >
        {/* Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/50 mb-3">
            <FaQrcode className="text-indigo-400 text-sm" />
            <span className="text-indigo-400 text-xs font-semibold">Secure Scan</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {mode === "checkin" ? "Check-In" : "Check-Out"} Scanner
          </h2>
          <p className="text-gray-400 text-xs mt-1">
            Position QR code within the frame to scan
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-2 sm:gap-3 mb-5">
          <button
            onClick={() => {
              setScanned(false);
              setMode("checkin");
              handleReset();
            }}
            className={`flex-1 py-2.5 rounded-xl font-semibold transition-all duration-300 text-sm ${
              mode === "checkin"
                ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/30"
                : "bg-white/10 text-gray-400 hover:bg-white/20"
            }`}
          >
            Check-In
          </button>

          <button
            onClick={() => {
              setScanned(false);
              setMode("checkout");
              handleReset();
            }}
            className={`flex-1 py-2.5 rounded-xl font-semibold transition-all duration-300 text-sm ${
              mode === "checkout"
                ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/30"
                : "bg-white/10 text-gray-400 hover:bg-white/20"
            }`}
          >
            Check-Out
          </button>
        </div>

        {/* Camera Controls Bar */}
        <div className="flex justify-between items-center mb-3 gap-2">
          {cameras.length > 1 && (
            <button
              onClick={switchCamera}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition flex items-center gap-1 text-xs"
            >
              <FaCamera className="text-sm" />
              <span className="hidden sm:inline">Switch Camera</span>
            </button>
          )}
          
          <button
            onClick={toggleTorch}
            disabled={!scannerControlsRef.current}
            className={`p-2 rounded-lg transition flex items-center gap-1 text-xs ${
              torchEnabled
                ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                : "bg-white/10 text-gray-400 hover:bg-white/20"
            }`}
          >
            <FaLightbulb className="text-sm" />
            <span className="hidden sm:inline">Flash</span>
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition flex items-center gap-1 text-xs"
          >
            <FaSync className="text-sm" />
            <span className="hidden sm:inline">Restart</span>
          </button>
        </div>

        {/* Camera View */}
        <div className="relative rounded-2xl overflow-hidden border-2 border-white/20 bg-black/50">
          <video
            ref={videoRef}
            className="w-full h-[280px] sm:h-[320px] md:h-[360px] object-cover"
            muted
            playsInline
            autoPlay
          />

          {/* Scanning Frame Overlay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="relative">
              {/* Corner brackets */}
              <div className="absolute -top-0 -left-0 w-12 h-12 border-t-4 border-l-4 border-emerald-400 rounded-tl-2xl" />
              <div className="absolute -top-0 -right-0 w-12 h-12 border-t-4 border-r-4 border-emerald-400 rounded-tr-2xl" />
              <div className="absolute -bottom-0 -left-0 w-12 h-12 border-b-4 border-l-4 border-emerald-400 rounded-bl-2xl" />
              <div className="absolute -bottom-0 -right-0 w-12 h-12 border-b-4 border-r-4 border-emerald-400 rounded-br-2xl" />
              
              {/* Scanning line animation */}
              <motion.div
                animate={{
                  top: ["0%", "100%", "0%"],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
                style={{ top: "0%" }}
              />
            </div>
          </div>

          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-emerald-400 text-sm font-semibold">Processing QR Code...</p>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-start gap-2">
            <FaInfoCircle className="text-blue-400 text-sm mt-0.5 flex-shrink-0" />
            <div className="text-xs text-gray-400">
              <p>• Hold the QR code steady within the frame</p>
              <p>• Ensure good lighting for better detection</p>
              <p>• The scanner will automatically detect and process</p>
            </div>
          </div>
        </div>

        {/* Status Messages */}
        <AnimatePresence>
          {displayError && !loading && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30"
            >
              <div className="flex items-center gap-2">
                <FaTimesCircle className="text-red-400 text-sm" />
                <p className="text-red-400 text-xs flex-1">{displayError}</p>
                <button
                  onClick={handleReset}
                  className="px-2 py-1 rounded-lg bg-red-500/30 text-red-300 text-xs"
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          )}

          {scanned && !loading && !displayError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30"
            >
              <div className="flex items-center gap-2">
                <FaCheckCircle className="text-emerald-400 text-sm" />
                <p className="text-emerald-400 text-xs flex-1">
                  QR {mode === "checkin" ? "checked-in" : "checked-out"} successfully!
                </p>
              </div>
              <button
                onClick={handleReset}
                className="mt-2 w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 transition text-white text-sm font-semibold"
              >
                Scan Another QR Code
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Note */}
        <div className="mt-4 text-center">
          <p className="text-[10px] text-gray-600">
            Secure QR verification • Powered by SmartHotel
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default QrScannerScreen;