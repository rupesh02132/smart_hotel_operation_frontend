import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Avatar,
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { register, googleLogin, clearAuthMessage } from "../state/auth/Action";
import { GoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";

/* ======================
   CONFIG
====================== */

const LOGO_URL = "https://cdn-icons-png.flaticon.com/512/3075/3075977.png";

const ROLE_THEME = {
  user: "#4fc3f7",
  host: "#ffb300",
  staff: "#90a4ae",
  manager: "#26c6da",
  admin: "#ef5350",
};

/* ======================
   COMPONENT
====================== */

const RegisterScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, message, pendingEmail, user } = useSelector(
    (state) => state.auth
  );

  const themeColor = ROLE_THEME[user?.role] || "#4fc3f7";

  /* 🔥 OTP Redirect (Safe + Deterministic) */
  useEffect(() => {
    const email = pendingEmail || localStorage.getItem("otpEmail");
    const pendingOtp = localStorage.getItem("pendingOtpVerification");

    if (email && pendingOtp === "true") {
      navigate("/verify-otp", { replace: true });
    }
  }, [pendingEmail, navigate]);

  /* 🔥 Clear messages on unmount */
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
      })
    );
  };

  const handleGoogleSuccess = (res) => {
    dispatch(googleLogin(res.credential));
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ width: "100%" }}
        >
          <Card
            sx={{
              width: "100%",
              backdropFilter: "blur(16px)",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.85), rgba(245,247,250,0.9))",
              boxShadow: "0 12px 30px rgba(0,0,0,0.2)",
              borderRadius: 3,
              borderTop: `4px solid ${themeColor}`,
              transition: "all 0.3s ease",
            }}
          >
            <CardContent>

              {/* LOGO */}
              <Box sx={{ textAlign: "center", mb: 2 }}>
                <Avatar
                  src={LOGO_URL}
                  alt="Smart Hotel"
                  sx={{
                    width: 64,
                    height: 64,
                    mx: "auto",
                    mb: 1,
                    boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
                  }}
                />
                <Typography variant="h5" fontWeight={600}>
                  Create Your Account
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Register to book rooms and access services
                </Typography>
              </Box>

              {error && <Alert severity="error">{error}</Alert>}
              {message && <Alert severity="success">{message}</Alert>}

              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstname"
                  margin="normal"
                  required
                />

                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastname"
                  margin="normal"
                  required
                />

                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  margin="normal"
                  required
                />

                <TextField
                  fullWidth
                  label="Mobile"
                  name="phone"
                  margin="normal"
                  required
                />

                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  margin="normal"
                  required
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 2,
                    background: `linear-gradient(135deg, ${themeColor}, #7e57c2)`,
                    boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
                  }}
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Register"}
                </Button>
              </Box>

              {/* GOOGLE SIGNUP */}
              <Box sx={{ mt: 3, textAlign: "center" }}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => console.log("Google Signup Failed")}
                />
              </Box>

              {/* LOGIN LINK */}
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Typography variant="body2">
                  Already have an account?{" "}
                  <Link to="/login">
                    Login
                  </Link>
                </Typography>
              </Box>

            </CardContent>
          </Card>
        </motion.div>
      </Box>
    </Container>
  );
};

export default RegisterScreen;
