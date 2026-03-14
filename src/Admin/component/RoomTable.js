import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateRoomStatus, deleteRoom } from "../../state/room/Action";
import { getAllListings } from "../../state/listing/Action";
import { generateQr } from "../../state/selfCheck/Action";
import { getAllBookings } from "../../state/booking/Action";
import { useNavigate } from "react-router-dom";
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
} from "@mui/material";

const RoomTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* ================= SAFE SELECTORS ================= */

  const listingState = useSelector((store) => store.listings || {});
  const bookingState = useSelector((store) => store.bookings || {});
  const selfCheckState = useSelector((store) => store.selfCheck || {});
console.log("listingState", listingState);
  const hotels = Array.isArray(listingState.listings)
    ? listingState.listings
    : [];

  const bookingList = Array.isArray(bookingState.allBookings)
    ? bookingState.allBookings
    : [];

  const { qr, loading: qrLoading, error: qrError } = selfCheckState;

  /* ================= LOCAL STATE ================= */

  const [searchRoom, setSearchRoom] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [hotelFilter, setHotelFilter] = useState("All");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  /* ================= LOAD DATA ================= */

  useEffect(() => {
    dispatch(getAllListings());
    dispatch(getAllBookings());
  }, [dispatch]);

  /* ================= SOCKET REAL-TIME ================= */
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;
  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on("roomUpdated", () => {
      dispatch(getAllBookings());
      dispatch(getAllListings());
    });

    return () => socket.disconnect();
  }, [dispatch]);

  /* ================= QR COUNTDOWN ================= */

  useEffect(() => {
    if (!qr?.expiresAt) return;

    const interval = setInterval(() => {
      const diff = new Date(qr.expiresAt).getTime() - Date.now();

      if (diff <= 0) {
        setTimeLeft("Expired");
        clearInterval(interval);
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [qr?.expiresAt]);

  /* ================= ACTIVE BOOKING MAP ================= */

  const activeBookingMap = useMemo(() => {
    const map = {};

    bookingList.forEach((booking) => {
      if (booking.status === "Booked" || booking.status === "Checked-in") {
        const roomId = booking.room?._id || booking.room;
        map[roomId] = booking;
      }
    });

    return map;
  }, [bookingList]);

  /* ================= FILTER ================= */

  const filteredHotels = useMemo(() => {
    return hotels
      .map((hotel) => {
        const filteredRooms = (hotel.rooms || []).filter((room) => {
          const activeBooking = activeBookingMap[room._id];

          const computedStatus = activeBooking
            ? activeBooking.status === "Checked-in"
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

        if (filteredRooms.length) {
          return { ...hotel, rooms: filteredRooms };
        }

        return null;
      })
      .filter(Boolean);
  }, [
    hotels,
    searchRoom,
    searchCity,
    statusFilter,
    hotelFilter,
    activeBookingMap,
  ]);

  /* ================= HELPERS ================= */

  const getStatusColor = (status) => {
    switch (status) {
      case "Occupied":
        return "error";
      case "Cleaning":
        return "warning";
      case "Available":
        return "success";
      case "Booked":
        return "info";
      default:
        return "default";
    }
  };

  /* ================= MANUAL STATUS UPDATE ================= */

  const handleStatusChange = (room, newStatus) => {
    dispatch(
      updateRoomStatus(room._id, {
        ...room,
        status: newStatus,
      }),
    );
  };

  /* ================= QR GENERATION ================= */

  const handleGenerateQR = (booking) => {
    if (!booking) return;

    setSelectedBooking(booking._id);

    const qrType = booking.status === "Checked-In" ? "checkout" : "checkin";

    dispatch(generateQr(booking._id, qrType));
  };

  const handleDeleteConfirm = () => {
    dispatch(deleteRoom(confirmDelete));
    setConfirmDelete(null);
  };

  const uniqueHotels = ["All", ...new Set(hotels.map((hotel) => hotel.title))];

  /* ================= UI ================= */

  return (
    <Box sx={{ p: 3 }}>
      {/* FILTER BAR */}
      <Card sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            label="Search Room"
            size="small"
            value={searchRoom}
            onChange={(e) => setSearchRoom(e.target.value)}
          />

          <TextField
            label="Search City"
            size="small"
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
          />

          <Select
            size="small"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Vacant">Available</MenuItem>
            <MenuItem value="Cleaning">Cleaning</MenuItem>
            <MenuItem value="Occupied">Occupied</MenuItem>
            <MenuItem value="Booked">Booked</MenuItem>
          </Select>

          <Select
            size="small"
            value={hotelFilter}
            onChange={(e) => setHotelFilter(e.target.value)}
          >
            {uniqueHotels.map((hotel) => (
              <MenuItem key={hotel} value={hotel}>
                {hotel}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Card>

      {/* HOTELS */}
      {filteredHotels.map((hotel) => (
        <Card key={hotel._id} sx={{ mb: 4 }}>
          <Box sx={{ p: 2, background: "#4f46e5", color: "#fff" }}>
            <Typography fontWeight="bold">{hotel.title}</Typography>
            <Typography variant="body2">{hotel.city}</Typography>
          </Box>

          <CardContent>
            <Grid container spacing={3}>
              {hotel.rooms.map((room) => {
                const activeBooking = activeBookingMap[room._id];

                const computedStatus = activeBooking
                  ? activeBooking.status === "Checked-in"
                    ? "Occupied"
                    : "Booked"
                  : room.status;

                const canCheckIn =
                  activeBooking &&
                  activeBooking.status === "Booked" &&
                  activeBooking.isPaid === true;

                const canCheckOut =
                  activeBooking && activeBooking.status === "checked-in";

                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={room._id}>
                    <Fade in>
                      <Card>
                        <Avatar
                          src={room.images?.[0]}
                          variant="rounded"
                          sx={{
                            width: "100%",
                            height: 160,
                            borderRadius: 0,
                          }}
                        />

                        <Box sx={{ p: 2 }}>
                          <Typography fontWeight="bold">
                            Room {room.roomNumber}
                          </Typography>

                          <Chip
                            label={computedStatus}
                            color={getStatusColor(computedStatus)}
                            size="small"
                            sx={{ mt: 1 }}
                          />

                          {/* MANUAL STATUS SELECT */}
                          <Select
                            fullWidth
                            size="small"
                            value={computedStatus}
                            sx={{ mt: 2 }}
                            disabled={!!activeBooking}
                            onChange={(e) =>
                              handleStatusChange(room, e.target.value)
                            }
                          >
                            <MenuItem value="Vacant">Available</MenuItem>
                            <MenuItem value="Cleaning">Cleaning</MenuItem>
                            <MenuItem value="Occupied">Occupied</MenuItem>
                            <MenuItem value="Booked">Booked</MenuItem>
                          </Select>

                          {/* ACTION BUTTONS */}
                          <Box
                            sx={{
                              mt: 2,
                              display: "flex",
                              gap: 1,
                              flexDirection: {
                                xs: "column",
                                sm: "row",
                              },
                            }}
                          >
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => navigate(`/edit-room/${room._id}`)}
                            >
                              Edit
                            </Button>

                            <Button
                              variant="contained"
                              size="small"
                              disabled={
                                !activeBooking || (!canCheckIn && !canCheckOut)
                              }
                              onClick={() => handleGenerateQR(activeBooking)}
                            >
                              {!activeBooking
                                ? "No Booking"
                                : canCheckOut
                                  ? "Checkout QR"
                                  : canCheckIn
                                    ? "Check-In QR"
                                    : activeBooking.isPaid === false
                                      ? "Payment Pending"
                                      : "Not Allowed"}
                            </Button>

                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              onClick={() => setConfirmDelete(room._id)}
                            >
                              Delete
                            </Button>
                          </Box>
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
        <DialogTitle>QR Code</DialogTitle>
        <DialogContent sx={{ textAlign: "center" }}>
          {qrLoading && <Typography>Generating...</Typography>}

          {qr?.qrImage && (
            <img
              src={qr.qrImage}
              alt="QR"
              style={{
                width: "100%",
                maxWidth: 250,
                marginTop: 15,
              }}
            />
          )}

          {timeLeft && (
            <Typography sx={{ mt: 2 }}>⏳ Expires in: {timeLeft}</Typography>
          )}

          {qrError && (
            <Typography color="error" sx={{ mt: 2 }}>
              {qrError}
            </Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setSelectedBooking(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* DELETE CONFIRM */}
      <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this room?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(null)}>Cancel</Button>
          <Button color="error" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoomTable;
