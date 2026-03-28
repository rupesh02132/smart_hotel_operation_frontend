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
     RENDER
  ================================ */
  return (
    <div className="px-4 py-6">
      <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
        <CardHeader
          title="🏨 Smart Hotel Booking Control Panel"
          sx={{ textAlign: "center", fontWeight: "bold" }}
        />

        {/* SEARCH */}
        <div style={{ padding: 16 }}>
          <TextField
            label="Search Guest"
            size="small"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

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

                /* STATUS MACHINE */
                const isPending = item.status === "Pending";
                const isBooked = item.status === "Booked";
                const isCheckedIn = item.status === "checked-in";
                // const isCheckedOut = item.status === "checked-out";
                // const isCancelled = item.status === "cancelled";

                const roomAssigned = Boolean(item.room?._id);

                return (
                  <TableRow key={item._id} hover>

                    {/* ROOM IMAGE */}
                    <TableCell align="center">
                      <AvatarGroup>
                        <Avatar
                          src={item.room?.images?.[0]}
                          sx={{ width: 35, height: 35 }}
                        />
                      </AvatarGroup>
                    </TableCell>

                    {/* GUEST */}
                    <TableCell align="center">
                      {item.user?.firstname} {item.user?.lastname}
                    </TableCell>

                    {/* DATES */}
                    <TableCell align="center">
                      {new Date(item.checkIn).toLocaleDateString()} →
                      {new Date(item.checkOut).toLocaleDateString()}
                    </TableCell>

                    {/* TOTAL */}
                    <TableCell align="center">
                      ₹{item.totalPrice}
                    </TableCell>

                    {/* STATUS */}
                    <TableCell align="center">
                      {getStatusChip(item.status)}
                    </TableCell>

                    {/* ROOM ASSIGN */}
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

                    {/* ACTION BUTTONS */}
                    <TableCell align="center">

                      {/* ACCEPT */}
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

                      {/* REJECT */}
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

                      {/* CHECK-IN */}
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

                      {/* CHECK-OUT */}
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

                      {/* DELETE */}
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

        {/* PAGINATION */}
        <div style={{ padding: 16, textAlign: "center" }}>
          <Pagination
            count={totalPages || 1}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </div>
      </Card>
    </div>
  );
};

export default OrderTable;