import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { useNavigate } from "react-router-dom";
import { verifyOtp, resendEmailOtp, clearAuthMessage } from "../state/auth/Action";
import { motion } from "framer-motion";

/* ======================
   CONFIG
====================== */

const LOGO_URL = "https://cdn-icons-png.flaticon.com/512/3075/3075977.png";
const OTP_DURATION = 600; // 10 minutes

/* ======================
   COMPONENT
====================== */

const VerifyOtpScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    pendingEmail,
    loading,
    error,
    message,
    otpVerified,
    registerSuccess,
  } = useSelector((state) => state.auth);

  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(OTP_DURATION);
  const [canResend, setCanResend] = useState(false);

  /* 🔥 PROTECT PAGE IF NO EMAIL */
  useEffect(() => {
    const email = pendingEmail || localStorage.getItem("otpEmail");

    if (!email) {
      navigate("/register", { replace: true });
    }
  }, [pendingEmail, navigate]);

  /* 🔥 TIMER */
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  /* 🔥 REDIRECT AFTER VERIFIED */
  useEffect(() => {
    if (otpVerified) {
      localStorage.removeItem("pendingOtpVerification");
      localStorage.removeItem("otpEmail");
      navigate("/login", { replace: true });
    }
  }, [otpVerified, navigate]);

  /* 🔥 Clear messages on unmount */
  useEffect(() => {
    return () => dispatch(clearAuthMessage());
  }, [dispatch]);

  // VERIFY OTP
  const handleVerify = () => {
    if (otp.length !== 6) {
      alert("Enter a valid 6-digit OTP");
      return;
    }

    const email = pendingEmail || localStorage.getItem("otpEmail");
    dispatch(verifyOtp({ email, otp }));
  };

  // RESEND OTP
  const handleResend = () => {
    const email = pendingEmail || localStorage.getItem("otpEmail");
    dispatch(resendEmailOtp({ email }));
    setTimeLeft(OTP_DURATION);
    setCanResend(false);
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
              borderTop: "4px solid #4fc3f7",
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
                  Verify Your Email
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Enter the 6-digit OTP sent to your email
                </Typography>
              </Box>

              {/* EMAIL INFO */}
              <Typography
                variant="body2"
                sx={{ textAlign: "center", mb: 2 }}
                color="text.secondary"
              >
                OTP sent to:{" "}
                <strong>
                  {pendingEmail || localStorage.getItem("otpEmail")}
                </strong>
              </Typography>

              {error && <Alert severity="error">{error}</Alert>}
              {message && <Alert severity="success">{message}</Alert>}

              {/* OTP INPUT */}
              <Box sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Enter 6-Digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  inputProps={{ maxLength: 6 }}
                  placeholder="••••••"
                  margin="normal"
                />

                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 2,
                    background: "linear-gradient(135deg, #4fc3f7, #7e57c2)",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
                  }}
                  disabled={loading}
                  onClick={handleVerify}
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </Button>
              </Box>

              {/* TIMER */}
              <Box sx={{ mt: 3, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  {timeLeft > 0 ? (
                    <>
                      Resend OTP in{" "}
                      <strong>
                        {Math.floor(timeLeft / 60)}:
                        {String(timeLeft % 60).padStart(2, "0")}
                      </strong>
                    </>
                  ) : (
                    "You can resend OTP now"
                  )}
                </Typography>
              </Box>

              {/* RESEND */}
              <Box sx={{ mt: 2, textAlign: "center" }}>
                <Button
                  variant="text"
                  disabled={!canResend}
                  onClick={handleResend}
                >
                  Resend OTP
                </Button>
              </Box>

            </CardContent>
          </Card>
        </motion.div>
      </Box>
    </Container>
  );
};

export default VerifyOtpScreen;
