import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyQr, clearQr } from "../state/selfCheck/Action";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FaQrcode, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const QrVerifyScreen = () => {
  const { token } = useParams();
  const dispatch = useDispatch();

  const {
    checkLoading,
    success,
    error,
    message,
  } = useSelector((state) => state.selfCheck);

  /* =========================================
     AUTO VERIFY WHEN PAGE LOADS
  ========================================= */
  useEffect(() => {
    if (token) {
      dispatch(verifyQr(token));
    }
  }, [token, dispatch]);

  /* =========================================
     AUTO CLEAR AFTER 4 SECONDS
  ========================================= */
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        dispatch(clearQr());
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [success, error, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-[#0f172a] via-[#020617] to-black text-white">

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-3xl p-[1.5px] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-[0_40px_120px_rgba(0,0,0,0.8)]"
      >
        <div className="rounded-3xl bg-black/80 backdrop-blur-xl border border-white/10 p-8">

          {/* HEADER */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4">
              <FaQrcode className="text-indigo-400 text-3xl" />
            </div>

            <h2 className="text-2xl font-bold">
              Secure QR Verification
            </h2>

            <p className="text-gray-400 text-sm mt-2">
              Please wait while we verify your stay
            </p>
          </div>

          {/* LOADING */}
          {checkLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-indigo-400 animate-pulse"
            >
              Verifying QR...
            </motion.div>
          )}

          {/* SUCCESS */}
          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <FaCheckCircle className="mx-auto text-5xl text-emerald-400 mb-4" />
              <p className="text-lg font-semibold text-emerald-400">
                {message || "Verification Successful"}
              </p>
            </motion.div>
          )}

          {/* ERROR */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <FaTimesCircle className="mx-auto text-5xl text-red-400 mb-4" />
              <p className="text-red-400 font-semibold">
                {error}
              </p>
            </motion.div>
          )}

          {/* FOOTER */}
          <div className="mt-8 text-xs text-center text-gray-500">
            Smart Hotel • Encrypted • Real-Time Secure
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default QrVerifyScreen;