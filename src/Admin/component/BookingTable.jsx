import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardHeader,
  Avatar,
  AvatarGroup,
  Button,
  TextField,
  Chip,
  Pagination,
  useMediaQuery,
  Box,
  Typography,
  Divider,
} from "@mui/material";

import { io } from "socket.io-client";

import {
  getAllBookings,
  deleteBooking,
  acceptBooking,
  rejectBooking,
  assignRoomNumber,
  manualCheckIn,
  manualCheckOut,
} from "../../state/booking/Action";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;

const OrderTable = () => {
  const dispatch = useDispatch();
  const { bookings } = useSelector((store) => store);
  console.log("🚀 ~ file: BookingTable.jsx:17 ~ OrderTable ~ bookings:", bookings);
  const bookingList = useMemo(() => {
    return bookings?.allBookings || [];
  }, [bookings?.allBookings]);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 6;
  const isMobile = useMediaQuery('(max-width:768px)');

  /* ===============================
     INITIAL FETCH
  ================================ */
  useEffect(() => {
    dispatch(getAllBookings());
  }, [dispatch]);

  /* ===============================
     SOCKET LIVE REFRESH
  ================================ */
  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
    });

    const refresh = () => dispatch(getAllBookings());

    socket.on("newBooking", refresh);
    socket.on("bookingAccepted", refresh);
    socket.on("bookingRejected", refresh);
    socket.on("guestCheckedIn", refresh);
    socket.on("guestCheckedOut", refresh);
    socket.on("roomAssigned", refresh);

    return () => socket.disconnect();
  }, [dispatch]);

  /* ===============================
     SEARCH FILTER
  ================================ */
  const filteredBookings = useMemo(() => {
    return bookingList.filter((b) =>
      `${b.user?.firstname || ""} ${b.user?.lastname || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [bookingList, search]);

  const totalPages = Math.ceil(filteredBookings.length / rowsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  /* ===============================
     STATUS CHIP
  ================================ */
  const getStatusChip = (status) => {
    switch (status) {
      case "Pending":
        return <Chip label="Pending" color="warning" size="small" />;
      case "Booked":
        return <Chip label="Booked" color="success" size="small" />;
      case "checked-in":
        return <Chip label="Checked-In" color="primary" size="small" />;
      case "checked-out":
        return <Chip label="Checked-Out" color="secondary" size="small" />;
      case "cancelled":
        return <Chip label="Cancelled" color="error" size="small" />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  /* ===============================
     ACTION HANDLERS
  ================================ */
  const handleDelete = (id) => dispatch(deleteBooking(id));
  const handleAccept = (id) => dispatch(acceptBooking(id));
  const handleReject = (id) => dispatch(rejectBooking(id));
  const handleAssignRoom = (id, roomNumber) =>
    dispatch(assignRoomNumber(id, roomNumber));
  const handleCheckIn = (id) => dispatch(manualCheckIn(id));
  const handleCheckOut = (id) => dispatch(manualCheckOut(id));

  /* ===============================
     RENDER (Responsive)
  ================================ */
  return (
    <div className="px-2 sm:px-4 py-4 sm:py-6">
      <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
        <CardHeader
          title="Smart Hotel Booking Control Panel"
          sx={{ textAlign: "center", fontWeight: "bold", px: { xs: 1, sm: 2 } }}
        />

        {/* SEARCH */}
        <div style={{ padding: isMobile ? 12 : 16 }}>
          <TextField
            label="Search Guest"
            size="small"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {!isMobile ? (
          /* DESKTOP TABLE VIEW */
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Room</TableCell>
                  <TableCell align="center">Guest</TableCell>
                  <TableCell align="center">Dates</TableCell>
                  <TableCell align="center">Total</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Assign</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedBookings.map((item) => {
                  const isPending = item.status === "Pending";
                  const isBooked = item.status === "Booked";
                  const isCheckedIn = item.status === "checked-in";
                  const roomAssigned = Boolean(item.room?._id);

                  return (
                    <TableRow key={item._id} hover>
                      <TableCell align="center">
                        <AvatarGroup>
                          <Avatar
                            src={item.room?.images?.[0]}
                            sx={{ width: 35, height: 35 }}
                          />
                        </AvatarGroup>
                      </TableCell>
                      <TableCell align="center">
                        {item.user?.firstname} {item.user?.lastname}
                      </TableCell>
                      <TableCell align="center">
                        {new Date(item.checkIn).toLocaleDateString()} →{" "}
                        {new Date(item.checkOut).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="center">₹{item.totalPrice}</TableCell>
                      <TableCell align="center">
                        {getStatusChip(item.status)}
                      </TableCell>
                      <TableCell align="center">
                        {roomAssigned ? (
                          <Chip
                            label={`Room ${item.room.roomNumber}`}
                            color="info"
                            size="small"
                          />
                        ) : (
                          <TextField
                            size="small"
                            placeholder="Room No"
                            disabled={!isBooked}
                            onBlur={(e) => {
                              if (e.target.value) {
                                handleAssignRoom(item._id, e.target.value);
                              }
                            }}
                          />
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          sx={{ m: 0.3 }}
                          disabled={!isPending}
                          onClick={() => handleAccept(item._id)}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="contained"
                          color="warning"
                          size="small"
                          sx={{ m: 0.3 }}
                          disabled={!isPending}
                          onClick={() => handleReject(item._id)}
                        >
                          Reject
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          sx={{ m: 0.3 }}
                          disabled={!isBooked || !roomAssigned}
                          onClick={() => handleCheckIn(item._id)}
                        >
                          Check-In
                        </Button>
                        <Button
                          variant="contained"
                          color="secondary"
                          size="small"
                          sx={{ m: 0.3 }}
                          disabled={!isCheckedIn}
                          onClick={() => handleCheckOut(item._id)}
                        >
                          Check-Out
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          sx={{ m: 0.3 }}
                          disabled={isCheckedIn}
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          /* MOBILE CARD VIEW */
          <Box sx={{ p: 1 }}>
            {paginatedBookings.map((item) => {
              const isPending = item.status === "Pending";
              const isBooked = item.status === "Booked";
              const isCheckedIn = item.status === "checked-in";
              const roomAssigned = Boolean(item.room?._id);

              return (
                <Card
                  key={item._id}
                  sx={{ mb: 2, p: 2, borderRadius: 2 }}
                  elevation={2}
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                      src={item.room?.images?.[0]}
                      sx={{ width: 50, height: 50, borderRadius: 2 }}
                    />
                    <Box flex={1}>
                      <Typography fontWeight="bold">
                        {item.user?.firstname} {item.user?.lastname}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(item.checkIn).toLocaleDateString()} →{" "}
                        {new Date(item.checkOut).toLocaleDateString()}
                      </Typography>
                      <Box display="flex" justifyContent="space-between" mt={0.5}>
                        <Typography variant="body2" fontWeight="bold">
                          ₹{item.totalPrice}
                        </Typography>
                        {getStatusChip(item.status)}
                      </Box>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 1.5 }} />

                  <Box display="flex" flexWrap="wrap" gap={1} alignItems="center">
                    {/* Room assign */}
                    {roomAssigned ? (
                      <Chip
                        label={`Room ${item.room.roomNumber}`}
                        color="info"
                        size="small"
                      />
                    ) : (
                      <TextField
                        size="small"
                        placeholder="Room No"
                        disabled={!isBooked}
                        onBlur={(e) => {
                          if (e.target.value) {
                            handleAssignRoom(item._id, e.target.value);
                          }
                        }}
                        sx={{ width: 100 }}
                      />
                    )}

                    {/* Action buttons row */}
                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        disabled={!isPending}
                        onClick={() => handleAccept(item._id)}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="contained"
                        color="warning"
                        size="small"
                        disabled={!isPending}
                        onClick={() => handleReject(item._id)}
                      >
                        Reject
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        disabled={!isBooked || !roomAssigned}
                        onClick={() => handleCheckIn(item._id)}
                      >
                        Check-In
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        disabled={!isCheckedIn}
                        onClick={() => handleCheckOut(item._id)}
                      >
                        Check-Out
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        disabled={isCheckedIn}
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Box>
                </Card>
              );
            })}
          </Box>
        )}

        {/* PAGINATION */}
        <div style={{ padding: 16, textAlign: "center" }}>
          <Pagination
            count={totalPages || 1}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
            size={isMobile ? "small" : "medium"}
          />
        </div>
      </Card>
    </div>
  );
};

export default OrderTable;