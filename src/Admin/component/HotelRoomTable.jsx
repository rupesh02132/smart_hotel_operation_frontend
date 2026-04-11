import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllListings } from "../../state/listing/Action";
import { deleteRoom } from "../../state/room/Action";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  Grid,
  Button,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Divider,
  TextField,
} from "@mui/material";

const HotelRoomTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const listingState = useSelector((store) => store.listings || {});

  const hotels = useMemo(() => {
    return Array.isArray(listingState.listings) ? listingState.listings : [];
  }, [listingState.listings]);

  const loading = listingState.loading;

  const [confirmDelete, setConfirmDelete] = useState(null);
  const [searchCode, setSearchCode] = useState("");

  useEffect(() => {
    dispatch(getAllListings());
  }, [dispatch]);

  /* ================= FILTER BY HOTEL CODE ================= */

  const filteredHotels = useMemo(() => {
    if (!searchCode) return hotels;

    return hotels.filter((hotel) =>
      hotel.hotelcode?.toLowerCase().includes(searchCode.toLowerCase()),
    );
  }, [hotels, searchCode]);

  /* ================= STATUS COLOR ================= */

  const getStatusColor = (status) => {
    switch (status) {
      case "Occupied":
        return "error";
      case "Cleaning":
        return "warning";
      case "Booked":
        return "info";
      case "Vacant":
        return "success";
      case "Maintenance":
        return "error";
      case "Ready":
        return "primary";
      case "Blocked":
        return "default";
      default:
        return "default";
    }
  };

  /* ================= HOTEL STATS ================= */

  const getHotelStats = (rooms = []) => ({
    total: rooms.length,
    ready: rooms.filter((r) => r.status === "Ready").length,
    occupied: rooms.filter((r) => r.status === "Occupied").length,
    maintenance: rooms.filter((r) => r.status === "Maintenance").length,
  });

  const handleDeleteConfirm = () => {
    dispatch(deleteRoom(confirmDelete));
    setConfirmDelete(null);
  };

  if (loading) {
    return <Typography sx={{ p: 4 }}>Loading...</Typography>;
  }

  return (
    <Box
      sx={{
        p: { xs: 2, md: 5 },
        minHeight: "100vh",
        background: "linear-gradient(180deg,#f9fbfd 0%,#eef2f7 100%)",
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Typography variant="h4" fontWeight={800}>
          Room Management
        </Typography>

        {/* SEARCH HOTEL CODE */}
        <TextField
          size="small"
          label="Search by Hotel Code"
          value={searchCode}
          onChange={(e) => setSearchCode(e.target.value)}
        />
      </Box>

      {filteredHotels.map((hotel) => {
        const stats = getHotelStats(hotel.rooms);

        return (
          <Card
            key={hotel._id}
            sx={{
              mb: 5,
              borderRadius: 4,
              overflow: "hidden",
              boxShadow: "0 12px 40px rgba(0,0,0,0.06)",
            }}
          >
            {/* HOTEL HEADER */}
            <Box
              sx={{
                p: { xs: 3, md: 4 },
                background: "linear-gradient(135deg,#0f2027,#203a43,#2c5364)",
                color: "#fff",
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", md: "center" },
                gap: 2,
              }}
            >
              <Box>
                <Typography fontWeight={700} fontSize={20}>
                  {hotel.title}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {hotel.city}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  <strong>Hotel Code:</strong> {hotel.hotelcode}
                </Typography>
              </Box>

              <Button
                variant="contained"
                sx={{
                  background: "#fff",
                  color: "#0f2027",
                  fontWeight: 700,
                }}
                onClick={() =>
                  navigate(`/admin/hotels/${hotel._id}/rooms/create`)
                }
              >
                + Add Room
              </Button>
            </Box>

            {/* STATS */}
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 3,
                p: 3,
                background: "#f4f7fb",
              }}
            >
              <Typography fontWeight={600}>Total: {stats.total}</Typography>
              <Typography color="primary">Ready: {stats.ready}</Typography>
              <Typography color="error">Occupied: {stats.occupied}</Typography>
              <Typography color="warning.main">
                Maintenance: {stats.maintenance}
              </Typography>
            </Box>

            <Divider />

            {/* ROOMS */}
            <CardContent sx={{ p: { xs: 2, md: 4 } }}>
              <Grid container spacing={3}>
                {(hotel.rooms || []).map((room) => {
                  const canModify =
                    room.status === "Ready" || room.status === "Vacant";

                  return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={room._id}>
                      <Card
                        sx={{
                          borderRadius: 4,
                          boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-6px)",
                          },
                        }}
                      >
                        <Avatar
                          src={room.images?.[0]}
                          variant="rounded"
                          sx={{
                            width: "100%",
                            height: 180,
                            borderRadius: 0,
                          }}
                        />

                        <Box sx={{ p: 3 }}>
                          <Typography fontWeight={700}>
                            Room {room.roomNumber}
                          </Typography>

                          <Chip
                            label={room.status}
                            color={getStatusColor(room.status)}
                            size="small"
                            sx={{ mt: 1 }}
                          />

                          <Box
                            sx={{
                              mt: 2,
                              display: "flex",
                              gap: 1,
                            }}
                          >
                            <Button
                              size="small"
                              variant="outlined"
                              disabled={!canModify}
                              onClick={() =>
                                navigate(`/admin/rooms/${room._id}/edit`)
                              }
                            >
                              Edit
                            </Button>

                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              disabled={!canModify}
                              onClick={() => setConfirmDelete(room._id)}
                            >
                              Delete
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="primary"
                              disabled={!canModify}
                              onClick={() =>
                                navigate(`/admin/rooms/${room._id}/status`)
                              }
                              sx={{
                                borderRadius: 2,
                                fontWeight: 600,
                                textTransform: "none",
                                px: 1.5,
                                transition: "0.25s",
                                "&:hover": {
                                  transform: "translateY(-2px)",
                                  boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
                                },
                              }}
                            >
                              Room Status
                            </Button>
                          </Box>
                        </Box>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </CardContent>
          </Card>
        );
      })}

      {/* DELETE DIALOG */}
      <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
        <DialogTitle>Delete Room</DialogTitle>
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

export default HotelRoomTable;
