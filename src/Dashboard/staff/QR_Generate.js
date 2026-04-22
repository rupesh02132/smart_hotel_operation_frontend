import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllListings } from "../../state/listing/Action";
import { generateQr } from "../../state/selfCheck/Action";
import { getAllBookings } from "../../state/booking/Action";
import io from "socket.io-client";

import {
  Avatar,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  TextField,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Fade,
  CircularProgress,
} from "@mui/material";

const RoomTable = () => {
  const dispatch = useDispatch();

  const listingState = useSelector((s) => s.listings || {});
  const bookingState = useSelector((s) => s.bookings || {});
  const selfCheckState = useSelector((s) => s.selfCheck || {});


  const hotels = useMemo(() => listingState.listings || [], [listingState.listings]);


  const bookingList = useMemo(() => bookingState.allBookings || [], [bookingState.allBookings]);

  const { qr, loading: qrLoading} = selfCheckState;

  const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;

  const [searchRoom, setSearchRoom] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [hotelFilter, setHotelFilter] = useState("All");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socket.on("roomUpdated", () => {
      dispatch(getAllBookings());
      dispatch(getAllListings());
    });
    return () => socket.disconnect();
  }, [dispatch, SOCKET_URL]);

  const expiryRef = useRef(null);

  useEffect(() => {
    if (qr?.expiresAt) {
      expiryRef.current = new Date(qr.expiresAt).getTime();
    }
  }, [qr?.expiresAt]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!expiryRef.current) return;
      const diff = expiryRef.current - Date.now();

      if (diff <= 0) {
        setTimeLeft("Expired");
        return;
      }

      const min = Math.floor(diff / 60000);
      const sec = Math.floor((diff % 60000) / 1000);

      setTimeLeft(`${String(min).padStart(2, "0")}m ${String(sec).padStart(2, "0")}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const activeBookingMap = useMemo(() => {
    const map = {};
    bookingList.forEach((b) => {
      if (b.status === "Booked" || b.status === "checked-in") {
        const id = b.room?._id || b.room;
        map[id] = b;
      }
    });
    return map;
  }, [bookingList]);

  const filteredHotels = useMemo(() => {
    return hotels
      .map((hotel) => {
        const filteredRooms = (hotel.rooms || []).filter((room) => {
          const activeBooking = activeBookingMap[room._id];

          const computedStatus = activeBooking
            ? activeBooking.status === "checked-in"
              ? "Occupied"
              : "Booked"
            : room.status;

          return (
            room.roomNumber?.toLowerCase().includes(searchRoom.toLowerCase()) &&
            (searchCity === "" ||
              hotel.city?.toLowerCase().includes(searchCity.toLowerCase())) &&
            (statusFilter === "All" || computedStatus === statusFilter) &&
            (hotelFilter === "All" || hotel.title === hotelFilter)
          );
        });

        if (filteredRooms.length) return { ...hotel, rooms: filteredRooms };
        return null;
      })
      .filter(Boolean);
  }, [hotels, searchRoom, searchCity, statusFilter, hotelFilter, activeBookingMap]);

  const getStatusColor = (status) => {
    if (status === "Occupied") return "error";
    if (status === "Cleaning") return "warning";
    if (status === "Vacant" || status === "Ready") return "success";
    if (status === "Booked") return "info";
    return "default";
  };

  const handleGenerateQR = (booking) => {
    if (!booking) return;

    let type = null;
    if (booking.status === "Booked" && booking.isPaid === true) type = "checkin";
    if (booking.status === "checked-in") type = "checkout";

    if (!type) return;

    setSelectedBooking(booking._id);
    dispatch(generateQr(booking._id, type));
  };

  // 🔥 DOWNLOAD QR
  const handleDownloadQR = () => {
    if (!qr?.qrImage) return;

    const link = document.createElement("a");
    link.href = qr.qrImage;
    link.download = "room-qr.png";
    link.click();
  };

  const uniqueHotels = ["All", ...new Set(hotels.map((h) => h.title))];

  return (
    <Box sx={{ p: 3, background: "#f8fafc", minHeight: "100vh" }}>

      {/* FILTER */}
      <Card sx={{ p: 2, mb: 3, borderRadius: 3 }}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField label="Search Room" size="small" value={searchRoom} onChange={(e) => setSearchRoom(e.target.value)} />
          <TextField label="Search City" size="small" value={searchCity} onChange={(e) => setSearchCity(e.target.value)} />

          <Select size="small" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Vacant">Available</MenuItem>
            <MenuItem value="Ready">Ready</MenuItem>
            <MenuItem value="Cleaning">Cleaning</MenuItem>
            <MenuItem value="Occupied">Occupied</MenuItem>
            <MenuItem value="Booked">Booked</MenuItem>
          </Select>

          <Select size="small" value={hotelFilter} onChange={(e) => setHotelFilter(e.target.value)}>
            {uniqueHotels.map((h) => (
              <MenuItem key={h} value={h}>{h}</MenuItem>
            ))}
          </Select>
        </Box>
      </Card>

      {/* HOTELS */}
      {filteredHotels.map((hotel) => (
        <Card key={hotel._id} sx={{ mb: 4, borderRadius: 3 }}>
          <Box sx={{
            p: 2,
            background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
            color: "#fff",
          }}>
            <Typography fontWeight="bold">{hotel.title}</Typography>
            <Typography variant="body2">📍 {hotel.city}</Typography>
          </Box>

          <CardContent>
            <Grid container spacing={3}>
              {hotel.rooms.map((room) => {
                const booking = activeBookingMap[room._id];

                const computedStatus = booking
                  ? booking.status === "checked-in"
                    ? "Occupied"
                    : "Booked"
                  : room.status;

                const canCheckIn = booking?.status === "Booked" && booking?.isPaid;
                const canCheckOut = booking?.status === "checked-in";

                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={room._id}>
                    <Fade in>
                      <Card sx={{
                        borderRadius: 3,
                        transition: "0.3s",
                        "&:hover": { transform: "translateY(-6px)" }
                      }}>
                        <Avatar src={room.images?.[0]} variant="square" sx={{ width: "100%", height: 160 }} />

                        <Box sx={{ p: 2 }}>
                          <Typography fontWeight="bold">Room: {room.roomNumber}</Typography>

                          <Chip label={computedStatus} color={getStatusColor(computedStatus)} size="small" sx={{ mt: 1 }} />

                          <Button
                            fullWidth
                            sx={{
                              mt: 2,
                              borderRadius: 2,
                              fontWeight: "bold",
                              background: canCheckOut
                                ? "linear-gradient(135deg,#ef4444,#dc2626)"
                                : "linear-gradient(200deg,#4ade80,#22c55e)",
                            }}
                            disabled={!booking || (!canCheckIn && !canCheckOut)}
                            onClick={() => handleGenerateQR(booking)}
                          >
                            {!booking
                              ? "No Booking"
                              : canCheckOut
                              ? "Checkout QR"
                              : canCheckIn
                              ? "Check-In QR"
                              : "Not Allowed"}
                          </Button>
                        </Box>
                      </Card>
                    </Fade>
                  </Grid>
                );
              })}
            </Grid>
          </CardContent>
        </Card>
      ))}

      {/* QR MODAL */}
      <Dialog open={!!selectedBooking} onClose={() => setSelectedBooking(null)}>
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
          📲 Scan QR Code
        </DialogTitle>

        <DialogContent sx={{ textAlign: "center" }}>
          {qrLoading && <CircularProgress />}

          {qr?.qrImage && (
            <Box sx={{
              p: 2,
              borderRadius: 3,
              display: "inline-block",
              animation: "pulse 1.5s infinite"
            }}>
              <img src={qr.qrImage} alt="QR" style={{ width: 220 }} />
            </Box>
          )}

          {timeLeft && (
            <Chip
              label={`⏳ ${timeLeft}`}
              color={timeLeft === "Expired" ? "error" : "primary"}
              sx={{ mt: 2 }}
            />
          )}
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", gap: 2 }}>
          <Button variant="outlined" onClick={() => setSelectedBooking(null)}>
            Close
          </Button>

          {qr?.qrImage && (
            <Button variant="contained" onClick={handleDownloadQR}>
              Download QR
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoomTable;