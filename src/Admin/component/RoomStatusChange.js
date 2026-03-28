import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateRoomStatus } from "../../state/room/Action";
import { getAllListings } from "../../state/listing/Action";
import { getAllBookings } from "../../state/booking/Action";
import io from "socket.io-client";

import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Chip,
  TextField,
  Select,
  MenuItem,
  Typography,
  Box,
  Fade,
} from "@mui/material";

const RoomStatusChange = () => {
  const dispatch = useDispatch();

  const listings = useSelector(
    (s) => s.listings?.listings || []
  );

  const bookings = useSelector(
    (s) => s.bookings?.allBookings || []
  );

  const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;

  const [searchRoom, setSearchRoom] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [hotelFilter, setHotelFilter] = useState("All");

  /* SOCKET LIVE UPDATE */

  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on("roomStatusUpdated", () => {
      dispatch(getAllBookings());
      dispatch(getAllListings());
    });

    return () => socket.disconnect();
  }, [dispatch, SOCKET_URL]);

  /* ACTIVE BOOKING MAP */

  const activeBookingMap = useMemo(() => {
    const map = {};

    bookings.forEach((b) => {
      if (
        b.status === "Booked" ||
        b.status === "checked-in"
      ) {
        const id = b.room?._id || b.room;
        map[id] = b;
      }
    });

    return map;
  }, [bookings]);

  /* ⭐ STATE MACHINE HELPER */

  const getAllowedNextStatuses = (status) => {
    const map = {
      Vacant: ["Occupied", "Maintenance", "Blocked", "Ready"],
      Ready: ["Occupied", "Maintenance", "Blocked"],
      Occupied: ["Cleaning", "Maintenance"],
      Cleaning: ["Vacant", "Maintenance"],
      Maintenance: ["Vacant"],
      Blocked: ["Vacant"],
    };

    return map[status] || [];
  };

  /* FILTER HOTELS */

  const filteredHotels = useMemo(() => {
    return listings
      .map((hotel) => {
        const rooms = (hotel.rooms || []).filter(
          (room) => {
            const booking =
              activeBookingMap[room._id];

            let computedStatus = room.status;

            if (booking?.status === "Booked")
              computedStatus = "Booked";

            if (booking?.status === "checked-in")
              computedStatus = "Occupied";

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

        if (!rooms.length) return null;

        return { ...hotel, rooms };
      })
      .filter(Boolean);
  }, [
    listings,
    searchRoom,
    searchCity,
    statusFilter,
    hotelFilter,
    activeBookingMap,
  ]);

  const getStatusColor = (status) => {
    if (status === "Occupied") return "error";
    if (status === "Booked") return "info";
    if (status === "Cleaning") return "warning";
    if (status === "Maintenance") return "secondary";
    if (status === "Blocked") return "default";
    if (status === "Ready") return "success";
    return "success";
  };

  /* ⭐ FINAL STATUS CHANGE HANDLER */

  const handleStatusChange = (room, newStatus) => {
    if (room.status === newStatus) return;

    const activeBooking =
      activeBookingMap[room._id];

    if (activeBooking) {
      alert(
        "Room status cannot be changed while booking active"
      );
      return;
    }

    dispatch(updateRoomStatus(room._id, newStatus));
  };

  const uniqueHotels = [
    "All",
    ...new Set(listings.map((h) => h.title)),
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* FILTER BAR */}

      <Card sx={{ p: 2, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
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
            <MenuItem value="Vacant">Vacant</MenuItem>
            <MenuItem value="Cleaning">Cleaning</MenuItem>
            <MenuItem value="Occupied">Occupied</MenuItem>
            <MenuItem value="Booked">Booked</MenuItem>
            <MenuItem value="Maintenance">
              Maintenance
            </MenuItem>
            <MenuItem value="Blocked">Blocked</MenuItem>
            <MenuItem value="Ready">Ready</MenuItem>
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
          <Box
            sx={{
              p: 2,
              bgcolor: "#4f46e5",
              color: "#fff",
            }}
          >
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

                let computedStatus = room.status;

                if (booking?.status === "Booked")
                  computedStatus = "Booked";

                if (booking?.status === "checked-in")
                  computedStatus = "Occupied";

                const options =
                  getAllowedNextStatuses(
                    computedStatus
                  );

                return (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    key={room._id}
                  >
                    <Fade in>
                      <Card>
                        <Avatar
                          src={room.images?.[0]}
                          variant="rounded"
                          sx={{
                            width: "100%",
                            height: 160,
                          }}
                        />

                        <Box sx={{ p: 2 }}>
                          <Typography fontWeight="bold">
                            Room {room.roomNumber}
                          </Typography>

                          <Chip
                            label={computedStatus}
                            color={getStatusColor(
                              computedStatus
                            )}
                            size="small"
                            sx={{ mt: 1 }}
                          />

                          <Select
                            fullWidth
                            size="small"
                            value={computedStatus}
                            disabled={!!booking}
                            sx={{ mt: 2 }}
                            onChange={(e) =>
                              handleStatusChange(
                                room,
                                e.target.value
                              )
                            }
                          >
                            <MenuItem value={computedStatus}>
                              {computedStatus}
                            </MenuItem>

                            {options.map((s) => (
                              <MenuItem
                                key={s}
                                value={s}
                              >
                                {s}
                              </MenuItem>
                            ))}
                          </Select>
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
    </Box>
  );
};

export default RoomStatusChange;