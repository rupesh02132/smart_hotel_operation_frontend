import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register, clearAuthMessage } from "../../state/auth/Action";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUserPlus, FaEnvelope, FaLock, FaPhone, FaUser, FaBriefcase } from "react-icons/fa";

const AdminRegisterScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, message, pendingEmail } = useSelector((state) => state.auth);

  useEffect(() => {
    const email = pendingEmail || localStorage.getItem("otpEmail");
    const pendingOtp = localStorage.getItem("pendingOtpVerification");

    if (email && pendingOtp === "true") {
      navigate("/verify-otp", { replace: true });
    }
  }, [pendingEmail, navigate]);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-2xl">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-3">
              <FaUserPlus className="text-white text-2xl" />
            </div>
            <h2 className="text-2xl font-bold text-white">Create New User</h2>
            <p className="text-indigo-200 mt-1 text-sm">Add staff members or administrators to the system</p>
          </div>

          <div className="p-6">
            {error && <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-200">{error}</div>}
            {message && <div className="mb-4 p-3 rounded-xl bg-green-50 text-green-600 text-sm border border-green-200">{message}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input type="text" name="firstname" placeholder="First Name" required className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition" />
                </div>
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input type="text" name="lastname" placeholder="Last Name" required className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input type="email" name="email" placeholder="Email Address" required className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition" />
                </div>
                <div className="relative">
                  <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input type="tel" name="phone" placeholder="Mobile Number" required className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition" />
                </div>
              </div>

              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input type="password" name="password" placeholder="Password" required className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition" />
              </div>

              <div className="relative">
                <FaBriefcase className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select name="role" required className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition appearance-none bg-white">
                  <option value="">Select User Role</option>
                  <option value="user">User</option>
                  <option value="host">Host</option>
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                  <option value="manager">Manager</option>
                </select>
              </div>

              <button type="submit" disabled={loading} className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-lg transition-all disabled:opacity-50">
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminRegisterScreen;