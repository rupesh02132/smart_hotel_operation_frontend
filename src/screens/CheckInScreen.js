import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selfCheckIn, clearSelfCheck } from "../state/selfCheck/Action";
import { motion } from "framer-motion";
import { FaQrcode } from "react-icons/fa";
import { useParams } from "react-router-dom";

const CheckInScreen = () => {
  const { token } = useParams();
  const dispatch = useDispatch();

  const { loading, success, error, message } = useSelector(
    (state) => state.selfCheck
  );

  /* AUTO VERIFY ON LOAD */
  useEffect(() => {
    if (token) {
      dispatch(selfCheckIn(token));
    }
  }, [token, dispatch]);

  /* AUTO CLEAR */
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        dispatch(clearSelfCheck());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [success, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0f172a] via-[#020617] to-black text-white">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md rounded-3xl p-[1.5px] bg-gradient-to-br from-indigo-500/40 via-purple-500/40 to-pink-500/40 shadow-[0_40px_120px_rgba(0,0,0,0.9)]"
      >
        <div className="rounded-3xl bg-black/70 backdrop-blur-2xl border border-white/10 p-8">

          <div className="text-center mb-8">
            <div className="mx-auto w-14 h-14 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4">
              <FaQrcode className="text-indigo-400 text-2xl" />
            </div>

            <h2 className="text-2xl font-bold tracking-tight">
              Self Check-In
            </h2>

            <p className="text-gray-400 text-sm mt-2">
              Secure QR Verification in progress
            </p>
          </div>

          <div className="text-center">
            {loading && (
              <p className="text-indigo-400 animate-pulse">
                Verifying QR...
              </p>
            )}

            {success && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-emerald-400 text-lg font-semibold"
              >
                {message || "Check-in successful 🎉"}
              </motion.p>
            )}

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400"
              >
                ❌ {error}
              </motion.p>
            )}
          </div>

          <div className="mt-8 text-xs text-center text-gray-500">
            Smart Hotel • Encrypted QR • Real-time Verification
          </div>

        </div>
      </motion.div>
    </div>
  );
};

export default CheckInScreen;