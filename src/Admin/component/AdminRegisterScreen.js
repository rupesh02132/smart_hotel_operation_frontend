import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register, clearAuthMessage } from "../../state/auth/Action";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const AdminRegisterScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, message, pendingEmail } = useSelector(
    (state) => state.auth
  );

  /* ================= OTP REDIRECT (SAME AS USER REGISTER) ================= */
  useEffect(() => {
    const email = pendingEmail || localStorage.getItem("otpEmail");
    const pendingOtp = localStorage.getItem("pendingOtpVerification");

    if (email && pendingOtp === "true") {
      navigate("/verify-otp", { replace: true });
    }
  }, [pendingEmail, navigate]);

  /* ================= CLEAR MESSAGE ON UNMOUNT ================= */
  useEffect(() => {
    return () => dispatch(clearAuthMessage());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget);

    dispatch(
      register({
        firstname: data.get("firstname"),
        lastname: data.get("lastname"),
        email: data.get("email"),
        phone: data.get("phone"),
        password: data.get("password"),
        role: data.get("role"),
      })
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl p-6 sm:p-10 border border-white/40">

          {/* HEADER */}
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-800">
              Admin Panel – Add User
            </h2>
            <p className="text-gray-500 mt-2 text-sm sm:text-base">
              Create new user and assign system role
            </p>
          </div>

          {/* ALERTS */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-600 text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-600 text-sm">
              {message}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* NAME ROW */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="firstname"
                placeholder="First Name"
                required
                className="input-elite"
              />
              <input
                type="text"
                name="lastname"
                placeholder="Last Name"
                required
                className="input-elite"
              />
            </div>

            {/* EMAIL + PHONE ROW (TWO COLUMN RESPONSIVE) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                required
                className="input-elite"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Mobile Number"
                required
                className="input-elite"
              />
            </div>

            {/* PASSWORD */}
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="input-elite"
            />

            {/* ROLE */}
            <select
              name="role"
              required
              className="input-elite"
            >
              <option value="">Select User Role</option>
              <option value="user">User</option>
              <option value="host">Host</option>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
              <option value="manager">Manager</option>
            </select>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-gray-900 to-gray-700 hover:scale-[1.02] transition-all duration-200 shadow-lg"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>

          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminRegisterScreen;