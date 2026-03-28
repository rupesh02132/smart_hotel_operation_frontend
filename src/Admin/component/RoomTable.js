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
} from "@mui/material";

const RoomTable = () => {
  const dispatch = useDispatch();

  const listingState = useSelector((s) => s.listings || {});
  const bookingState = useSelector((s) => s.bookings || {});
  const selfCheckState = useSelector((s) => s.selfCheck || {});

  const hotels = useMemo(
    () => listingState.listings || [],
    [listingState.listings]
  );

  const bookingList = useMemo(
    () => bookingState.allBookings || [],
    [bookingState.allBookings]
  );

  const { qr, loading: qrLoading, error: qrError } =
    selfCheckState;

  const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;

  const [searchRoom, setSearchRoom] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [hotelFilter, setHotelFilter] = useState("All");

  const [selectedBooking, setSelectedBooking] =
    useState(null);

  const [timeLeft, setTimeLeft] = useState("");


  /* SOCKET */

  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on("roomUpdated", () => {
      dispatch(getAllBookings());
      dispatch(getAllListings());
    });

    return () => socket.disconnect();
  }, [dispatch, SOCKET_URL]);




 // ⭐ place above component return
const expiryRef = useRef(null);

/* set expiry only when new qr generated */
useEffect(() => {
  if (qr?.expiresAt) {
    expiryRef.current = new Date(qr.expiresAt).getTime();
  }
}, [qr?.expiresAt]);

/* single global interval */
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

    setTimeLeft(
      `${String(min).padStart(2, "0")}m ${String(sec).padStart(2, "0")}s`
    );
  }, 1000);

  return () => clearInterval(interval);
}, []);

  /* ACTIVE BOOKING MAP */

  const activeBookingMap = useMemo(() => {
    const map = {};

    bookingList.forEach((b) => {
      if (
        b.status === "Booked" ||
        b.status === "checked-in"
      ) {
        const id = b.room?._id || b.room;
        map[id] = b;
      }
    });

    return map;
  }, [bookingList]);

  /* FILTER */

  const filteredHotels = useMemo(() => {
    return hotels
      .map((hotel) => {
        const filteredRooms = (hotel.rooms || []).filter(
          (room) => {
            const activeBooking =
              activeBookingMap[room._id];

            const computedStatus = activeBooking
              ? activeBooking.status === "checked-in"
                ? "Occupied"
                : "Booked"
              : room.status;

            return (
              room.roomNumber
                ?.toLowerCase()
                .includes(searchRoom.toLowerCase()) &&
              (searchCity === "" ||
                hotel.city
                  ?.toLowerCase()
                  .includes(searchCity.toLowerCase())) &&
              (statusFilter === "All" ||
                computedStatus === statusFilter) &&
              (hotelFilter === "All" ||
                hotel.title === hotelFilter)
            );
          }
        );

        if (filteredRooms.length)
          return { ...hotel, rooms: filteredRooms };

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

  const getStatusColor = (status) => {
    if (status === "Occupied") return "error";
    if (status === "Cleaning") return "warning";
    if (status === "Vacant") return "success";
    if (status === "Ready") return "success";
    if (status === "Booked") return "info";
    if (status === "Blocked") return "default";
    if (status === "Maintenance") return "disabled";
    return "default";
  };



  const handleGenerateQR = (booking) => {
    if (!booking) return;

    let type = null;

    if (
      booking.status === "Booked" &&
      booking.isPaid === true
    )
      type = "checkin";

    if (booking.status === "checked-in")
      type = "checkout";

    if (!type) return;

    setSelectedBooking(booking._id);
    dispatch(generateQr(booking._id, type));
  };

  const uniqueHotels = [
    "All",
    ...new Set(hotels.map((h) => h.title)),
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* FILTER BAR */}
      <Card sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <TextField
            label="Search Room"
            size="small"
            value={searchRoom}
            onChange={(e) =>
              setSearchRoom(e.target.value)
            }
          />

          <TextField
            label="Search City"
            size="small"
            value={searchCity}
            onChange={(e) =>
              setSearchCity(e.target.value)
            }
          />

          <Select
            size="small"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Vacant">
              Available
            </MenuItem>
            <MenuItem value="Ready">
              Ready
            </MenuItem>
            <MenuItem value="Cleaning">
              Cleaning
            </MenuItem>
            <MenuItem value="Occupied">
              Occupied
            </MenuItem>
            <MenuItem value="Booked">Booked</MenuItem>
          </Select>

          <Select
            size="small"
            value={hotelFilter}
            onChange={(e) =>
              setHotelFilter(e.target.value)
            }
          >
            {uniqueHotels.map((h) => (
              <MenuItem key={h} value={h}>
                {h}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Card>

      {/* HOTELS */}
      {filteredHotels.map((hotel) => (
        <Card key={hotel._id} sx={{ mb: 4 }}>
          <Box sx={{ p: 2, bgcolor: "#4f46e5", color: "#fff" }}>
            <Typography fontWeight="bold">
              {hotel.title}
            </Typography>
            <Typography variant="body2">
              {hotel.city}
            </Typography>
          </Box>

          <CardContent>
            <Grid container spacing={3}>
              {hotel.rooms.map((room) => {
                const booking =
                  activeBookingMap[room._id];

                const computedStatus = booking
                  ? booking.status === "checked-in"
                    ? "Occupied"
                    : "Booked"
                  : room.status;

                const canCheckIn =
                  booking?.status === "Booked" &&
                  booking?.isPaid === true;

                const canCheckOut =
                  booking?.status === "checked-in";

                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={room._id}>
                    <Fade in>
                      <Card>
                        <Avatar
                          src={room.images?.[0]}
                          variant="rounded"
                          sx={{ width: "100%", height: 160 }}
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

                         

                          <Box sx={{ mt: 2 }}>
                            <Button
                              fullWidth
                              variant="contained"
                              size="small"
                              disabled={
                                !booking ||
                                (!canCheckIn && !canCheckOut)
                              }
                              onClick={() =>
                                handleGenerateQR(booking)
                              }
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
            <img src={qr.qrImage} alt="QR" style={{ width: 240 }} />
          )}

          {timeLeft && (
            <Typography sx={{ mt: 2 }}>
              ⏳ Expires in: {timeLeft}
            </Typography>
          )}

          {qrError && (
            <Typography color="error" sx={{ mt: 2 }}>
              {qrError}
            </Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setSelectedBooking(null)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RoomTable;