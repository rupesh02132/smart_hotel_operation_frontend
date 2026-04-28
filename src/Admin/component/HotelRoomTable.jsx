import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllListings } from "../../state/listing/Action";
import { deleteRoom } from "../../state/room/Action";
import { useNavigate } from "react-router-dom";

import {
  Typography,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
} from "@mui/material";

import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Hotel as HotelIcon,
  MeetingRoom as MeetingRoomIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";

const HotelRoomTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const listingState = useSelector((store) => store.listings || {});

  const hotels = useMemo(() => {
    return Array.isArray(listingState.listings) ? listingState.listings : [];
  }, [listingState.listings]);
console.log(hotels);
  const loading = listingState.loading;

  const [confirmDelete, setConfirmDelete] = useState(null);
  const [searchCode, setSearchCode] = useState("");

  useEffect(() => {
    dispatch(getAllListings());
  }, [dispatch]);

  const filteredHotels = useMemo(() => {
    if (!searchCode) return hotels;
    return hotels.filter((hotel) =>
      hotel.hotelcode?.toLowerCase().includes(searchCode.toLowerCase()),
    );
  }, [hotels, searchCode]);

  const getStatusGradient = (status) => {
    switch (status) {
      case "Occupied":
        return "from-red-500 to-rose-600";
      case "Cleaning":
        return "from-yellow-500 to-orange-600";
      case "Booked":
        return "from-blue-500 to-cyan-600";
      case "Vacant":
        return "from-green-500 to-emerald-600";
      case "Maintenance":
        return "from-orange-600 to-red-600";
      case "Ready":
        return "from-indigo-500 to-purple-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getHotelStats = (rooms = []) => ({
    total: rooms.length,
    ready: rooms.filter((r) => r.status === "Ready").length,
    vacant: rooms.filter((r) => r.status === "Vacant").length,
    occupied: rooms.filter((r) => r.status === "Occupied").length,
    maintenance: rooms.filter((r) => r.status === "Maintenance").length,
  });

  const handleDeleteConfirm = () => {
    dispatch(deleteRoom(confirmDelete));
    setConfirmDelete(null);
  };

  const clearSearch = () => setSearchCode("");

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading rooms...</p>
        </div>
      </div>
    );
  }

  // Calculate global stats
  const allRooms = hotels.flatMap(h => h.rooms || []);
  const totalRooms = allRooms.length;
  const totalOccupied = allRooms.filter(r => r.status === "Occupied").length;
  const totalVacant = allRooms.filter(r => r.status === "Vacant" || r.status === "Ready").length;
  const occupancyRate = totalRooms ? Math.round((totalOccupied / totalRooms) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        
        {/* Header Section */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
                <span className="text-indigo-600 text-xs font-semibold uppercase tracking-wider">Room Inventory</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
                Room Management
              </h1>
              <p className="text-gray-500 text-sm mt-1">Manage rooms across all hotel properties</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 md:mb-8">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-xl p-3 sm:p-4 border border-blue-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-blue-600">{totalRooms}</p>
                <p className="text-xs text-gray-500 mt-1">Total Rooms</p>
              </div>
              <MeetingRoomIcon className="text-blue-500 text-2xl opacity-70" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-500/10 to-rose-600/5 rounded-xl p-3 sm:p-4 border border-red-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-red-600">{totalOccupied}</p>
                <p className="text-xs text-gray-500 mt-1">Occupied</p>
              </div>
              <HotelIcon className="text-red-500 text-2xl opacity-70" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/5 rounded-xl p-3 sm:p-4 border border-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-green-600">{totalVacant}</p>
                <p className="text-xs text-gray-500 mt-1">Available</p>
              </div>
              <MeetingRoomIcon className="text-green-500 text-2xl opacity-70" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-xl p-3 sm:p-4 border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-purple-600">{occupancyRate}%</p>
                <p className="text-xs text-gray-500 mt-1">Occupancy Rate</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${occupancyRate}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <TextField
            size="small"
            placeholder="Search by hotel code..."
            fullWidth
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon className="text-gray-400" />
                </InputAdornment>
              ),
              endAdornment: searchCode && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={clearSearch}>
                    <ClearIcon className="text-gray-400" />
                  </IconButton>
                </InputAdornment>
              ),
              sx: { borderRadius: "14px", backgroundColor: "#fff" }
            }}
          />
        </div>

        {/* Hotels List */}
        {filteredHotels.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <HotelIcon className="text-5xl text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No hotels found</p>
            <p className="text-sm text-gray-400 mt-1">Try a different hotel code</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredHotels.map((hotel) => {
              const stats = getHotelStats(hotel.rooms);
              const rooms = hotel.rooms || [];

              return (
                <Card key={hotel._id} className="rounded-2xl shadow-xl border-0 overflow-hidden">
                  {/* Hotel Header */}
                  <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div>
                      <Typography variant="h6" fontWeight="bold" className="text-white">
                        {hotel.title}
                      </Typography>
                      <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-300">
                        <span>{hotel.city}</span>
                        <span className="text-gray-500">|</span>
                        <span className="font-mono text-indigo-300">Code: {hotel.hotelcode}</span>
                      </div>
                    </div>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => navigate(`/admin/hotels/${hotel._id}/rooms/create`)}
                      sx={{
                        background: "linear-gradient(135deg, #10b981, #059669)",
                        borderRadius: "12px",
                        textTransform: "none",
                        fontWeight: 600,
                        "&:hover": { background: "linear-gradient(135deg, #059669, #047857)" }
                      }}
                    >
                      Add Room
                    </Button>
                  </div>

                  {/* Stats Bar */}
                  <div className="bg-gray-50 px-4 sm:px-6 py-3 flex flex-wrap gap-4 text-sm border-b border-gray-100">
                    <div className="flex items-center gap-1"><span className="font-semibold">Total:</span> {stats.total}</div>
                    <div className="flex items-center gap-1"><span className="font-semibold text-indigo-600">Ready:</span> {stats.ready}</div>
                    <div className="flex items-center gap-1"><span className="font-semibold text-green-600">Vacant:</span> {stats.vacant}</div>
                    <div className="flex items-center gap-1"><span className="font-semibold text-red-600">Occupied:</span> {stats.occupied}</div>
                    <div className="flex items-center gap-1"><span className="font-semibold text-amber-600">Maintenance:</span> {stats.maintenance}</div>
                  </div>

                  {/* Rooms Grid */}
                  <div className="p-4 sm:p-6">
                    {rooms.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <MeetingRoomIcon className="text-4xl mx-auto mb-2 opacity-50" />
                        <p>No rooms added yet</p>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => navigate(`/admin/hotels/${hotel._id}/rooms/create`)}
                          sx={{ mt: 1, borderRadius: "10px" }}
                        >
                          + Add First Room
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {rooms.map((room) => {
                          const canModify = room.status === "Ready" || room.status === "Vacant";
                          const statusGradient = getStatusGradient(room.status);

                          return (
                            <div
                              key={room._id}
                              className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                            >
                              <div className="relative h-40 overflow-hidden">
                                <img
                                  src={room.images?.[0] || "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400"}
                                  alt={`Room ${room.roomNumber}`}
                                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                                />
                                <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${statusGradient}`}>
                                  {room.status}
                                </div>
                                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-md text-white text-xs font-mono">
                                  #{room.roomNumber}
                                </div>
                              </div>
                              <div className="p-3">
                                <div className="flex justify-between items-center mb-2">
                                  <Typography fontWeight="600" fontSize="1rem">
                                    Room {room.roomNumber}
                                  </Typography>
                                  <div className="flex gap-1">
                                    <Tooltip title="Edit Room">
                                      <IconButton
                                        size="small"
                                        disabled={!canModify}
                                        onClick={() => navigate(`/admin/rooms/${room._id}/edit`)}
                                        sx={{ backgroundColor: "#fef3c7", borderRadius: "8px", p: 0.5 }}
                                      >
                                        <EditIcon sx={{ fontSize: "1rem", color: "#d97706" }} />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Change Status">
                                      <IconButton
                                        size="small"
                                        disabled={!canModify}
                                        onClick={() => navigate(`/admin/rooms/${room._id}/status`)}
                                        sx={{ backgroundColor: "#e0e7ff", borderRadius: "8px", p: 0.5 }}
                                      >
                                        <SettingsIcon sx={{ fontSize: "1rem", color: "#4f46e5" }} />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Delete Room">
                                      <IconButton
                                        size="small"
                                        disabled={!canModify}
                                        onClick={() => setConfirmDelete(room._id)}
                                        sx={{ backgroundColor: "#fee2e2", borderRadius: "8px", p: 0.5 }}
                                      >
                                        <DeleteIcon sx={{ fontSize: "1rem", color: "#dc2626" }} />
                                      </IconButton>
                                    </Tooltip>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  <Chip
                                    label={`Floor ${room.floor || "N/A"}`}
                                    size="small"
                                    sx={{ height: 22, fontSize: "0.65rem" }}
                                  />
                                  <Chip
                                    label={`${room.guests || 2} Guests`}
                                    size="small"
                                    sx={{ height: 22, fontSize: "0.65rem" }}
                                  />
                                  <Chip
                                    label={`${room.beds || 1} Beds`}
                                    size="small"
                                    sx={{ height: 22, fontSize: "0.65rem" }}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Dialog */}
      <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)} PaperProps={{ sx: { borderRadius: "24px", maxWidth: "400px", width: "90%" } }}>
        <DialogTitle sx={{ textAlign: "center", pt: 3 }}>
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-red-100 flex items-center justify-center">
            <DeleteIcon className="text-red-500 text-2xl" />
          </div>
          <Typography variant="h6" fontWeight="bold">Delete Room?</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" align="center">
            This action cannot be undone. This room will be permanently removed.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 3 }}>
          <Button onClick={() => setConfirmDelete(null)} variant="outlined" sx={{ borderRadius: "12px", px: 3 }}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error" sx={{ borderRadius: "12px", px: 3 }}>Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default HotelRoomTable;