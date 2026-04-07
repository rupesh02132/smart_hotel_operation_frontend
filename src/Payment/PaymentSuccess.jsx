import {
  Alert,
  AlertTitle,
  CircularProgress,
  Box,
  Typography,
  Button,
  Paper,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";

import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getBookingsBy_Id } from "../state/booking/Action";
import socketIOClient from "socket.io-client";

const PaymentSuccess = () => {
  const { bookingId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { booking, loading, error } = useSelector(
    (state) => state.bookings
  );

  /* =========================
     FETCH ONCE
  ========================= */
  useEffect(() => {
  const interval = setInterval(() => {
    if (bookingId) {
      dispatch(getBookingsBy_Id(bookingId));
    }
  }, 3000); // every 3 sec

  return () => clearInterval(interval);
}, [bookingId, dispatch]);

  /* =========================
     SOCKET REAL-TIME UPDATE
  ========================= */
  useEffect(() => {
    const socket = socketIOClient(
      process.env.REACT_APP_BACKEND_URL
    );

    socket.on("paymentSuccess", (data) => {
      if (data.bookingId === bookingId) {
        dispatch(getBookingsBy_Id(bookingId));
      }
    });

    return () => socket.disconnect();
  }, [bookingId, dispatch]);

  /* =========================
     UI STATES
  ========================= */

  if (loading && !booking) {
    return (
      <Box sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" variant="filled">
          <AlertTitle>Error</AlertTitle>
          Payment verification failed.
        </Alert>
      </Box>
    );
  }

  if (!booking) return null;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#eef2ff,#f5f3ff)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 500,
          p: 4,
          borderRadius: 4,
          textAlign: "center",
        }}
      >
        {booking.isPaid && (
          <>
            <CheckCircleIcon sx={{ fontSize: 70, color: "green", mb: 2 }} />
            <Typography variant="h5" fontWeight="bold">
              Payment Successful 🎉
            </Typography>
            <Typography sx={{ mt: 1, mb: 3 }}>
              Your booking has been confirmed.
            </Typography>

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={() => navigate(`/booking/${booking._id}`)}
            >
              View Booking Details
            </Button>
          </>
        )}

        {booking.paymentStatus === "failed" && (
          <>
            <ErrorIcon sx={{ fontSize: 70, color: "red", mb: 2 }} />
            <Typography variant="h5" fontWeight="bold">
              Payment Failed
            </Typography>
            <Typography sx={{ mt: 1, mb: 3 }}>
              Your payment was not completed.
            </Typography>

            <Button
              variant="contained"
              color="error"
              fullWidth
              size="large"
              onClick={() => navigate(`/booking/${booking._id}`)}
            >
              Retry Payment
            </Button>
          </>
        )}

        {!booking.isPaid && booking.paymentStatus !== "failed" && (
          <>
            <HourglassTopIcon sx={{ fontSize: 70, color: "#6366f1", mb: 2 }} />
            <Typography variant="h5" fontWeight="bold">
              Payment Processing
            </Typography>
            <Typography sx={{ mt: 1, mb: 3 }}>
              Please wait while we confirm your payment.
            </Typography>

            <CircularProgress />
          </>
        )}
      </Paper>
    </Box>
  );
};

export default PaymentSuccess;