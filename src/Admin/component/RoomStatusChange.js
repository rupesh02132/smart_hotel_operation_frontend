import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateRoomStatus } from "../../state/room/Action";
import { getAllListings } from "../../state/listing/Action";
import { getAllBookings } from "../../state/booking/Action";
import io from "socket.io-client";

import {
  Card,
  Chip,
  TextField,
  Select,
  MenuItem,
  Typography,
  Button,
  InputAdornment,
  IconButton,
} from "@mui/material";

import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Hotel as HotelIcon,
  MeetingRoom as MeetingRoomIcon,
  LocationCity as LocationIcon,
} from "@mui/icons-material";

const RoomStatusChange = () => {
  const dispatch = useDispatch();

  const listings = useSelector((s) => s.listings?.listings || []);
  const bookings = useSelector((s) => s.bookings?.allBookings || []);

  const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;

  const [searchRoom, setSearchRoom] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [hotelFilter, setHotelFilter] = useState("All");

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socket.on("roomStatusUpdated", () => {
      dispatch(getAllBookings());
      dispatch(getAllListings());
    });
    return () => socket.disconnect();
  }, [dispatch, SOCKET_URL]);

  const activeBookingMap = useMemo(() => {
    const map = {};
    bookings.forEach((b) => {
      if (b.status === "Booked" || b.status === "checked-in") {
        const id = b.room?._id || b.room;
        map[id] = b;
      }
    });
    return map;
  }, [bookings]);

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

  const filteredHotels = useMemo(() => {
    return listings
      .map((hotel) => {
        const rooms = (hotel.rooms || []).filter((room) => {
          const booking = activeBookingMap[room._id];
          let computedStatus = room.status;
          if (booking?.status === "Booked") computedStatus = "Booked";
          if (booking?.status === "checked-in") computedStatus = "Occupied";
          return (
            room.roomNumber?.toLowerCase().includes(searchRoom.toLowerCase()) &&
            (searchCity === "" || hotel.city?.toLowerCase().includes(searchCity.toLowerCase())) &&
            (statusFilter === "All" || computedStatus === statusFilter) &&
            (hotelFilter === "All" || hotel.title === hotelFilter)
          );
        });
        if (!rooms.length) return null;
        return { ...hotel, rooms };
      })
      .filter(Boolean);
  }, [listings, searchRoom, searchCity, statusFilter, hotelFilter, activeBookingMap]);
  const getStatusGradient = (status) => {
    switch (status) {
      case "Occupied": return "from-red-500 to-rose-600";
      case "Booked": return "from-blue-500 to-cyan-600";
      case "Cleaning": return "from-yellow-500 to-orange-600";
      case "Maintenance": return "from-orange-600 to-red-600";
      case "Blocked": return "from-gray-500 to-gray-600";
      case "Ready": return "from-green-500 to-emerald-600";
      case "Vacant": return "from-emerald-500 to-teal-600";
      default: return "from-gray-500 to-gray-600";
    }
  };

  const handleStatusChange = (room, newStatus) => {
    if (room.status === newStatus) return;
    const activeBooking = activeBookingMap[room._id];
    if (activeBooking) {
      alert("Room status cannot be changed while booking active");
      return;
    }
    dispatch(updateRoomStatus(room._id, newStatus));
  };

  const uniqueHotels = ["All", ...new Set(listings.map((h) => h.title))];
  const clearFilters = () => {
    setSearchRoom("");
    setSearchCity("");
    setStatusFilter("All");
    setHotelFilter("All");
  };
  const hasActiveFilters = searchRoom || searchCity || statusFilter !== "All" || hotelFilter !== "All";

  // Global stats
  const allRooms = listings.flatMap(h => h.rooms || []);
  const totalRooms = allRooms.length;
  const totalOccupied = allRooms.filter(r => r.status === "Occupied" || activeBookingMap[r._id]?.status === "checked-in").length;
  const totalVacant = allRooms.filter(r => r.status === "Vacant" || r.status === "Ready").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
                <span className="text-indigo-600 text-xs font-semibold uppercase tracking-wider">Room Operations</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">Room Status Management</h1>
              <p className="text-gray-500 text-sm mt-1">Change room statuses across all properties</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 md:mb-8">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-xl p-3 sm:p-4 border border-blue-500/20">
            <div className="flex items-center justify-between">
              <div><p className="text-2xl sm:text-3xl font-bold text-blue-600">{totalRooms}</p><p className="text-xs text-gray-500">Total Rooms</p></div>
              <MeetingRoomIcon className="text-blue-500 text-2xl opacity-70" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-500/10 to-rose-600/5 rounded-xl p-3 sm:p-4 border border-red-500/20">
            <div className="flex items-center justify-between">
              <div><p className="text-2xl sm:text-3xl font-bold text-red-600">{totalOccupied}</p><p className="text-xs text-gray-500">Occupied</p></div>
              <HotelIcon className="text-red-500 text-2xl opacity-70" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/5 rounded-xl p-3 sm:p-4 border border-green-500/20">
            <div className="flex items-center justify-between">
              <div><p className="text-2xl sm:text-3xl font-bold text-green-600">{totalVacant}</p><p className="text-xs text-gray-500">Available</p></div>
              <MeetingRoomIcon className="text-green-500 text-2xl opacity-70" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-xl p-3 sm:p-4 border border-purple-500/20">
            <div className="flex items-center justify-between">
              <div><p className="text-2xl sm:text-3xl font-bold text-purple-600">{filteredHotels.length}</p><p className="text-xs text-gray-500">Hotels Shown</p></div>
              <LocationIcon className="text-purple-500 text-2xl opacity-70" />
            </div>
          </div>
        </div>

        {/* Filters Card */}
        <Card className="rounded-2xl shadow-xl border-0 mb-6 md:mb-8 overflow-hidden">
          <div className="p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <TextField
                  size="small"
                  placeholder="Search room number..."
                  fullWidth
                  value={searchRoom}
                  onChange={(e) => setSearchRoom(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><SearchIcon className="text-gray-400" /></InputAdornment>,
                    endAdornment: searchRoom && <IconButton size="small" onClick={() => setSearchRoom("")}><ClearIcon /></IconButton>,
                    sx: { borderRadius: "14px", backgroundColor: "#fff" }
                  }}
                />
              </div>
              <div className="relative flex-1">
                <TextField
                  size="small"
                  placeholder="Search city..."
                  fullWidth
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><LocationIcon className="text-gray-400" /></InputAdornment>,
                    endAdornment: searchCity && <IconButton size="small" onClick={() => setSearchCity("")}><ClearIcon /></IconButton>,
                    sx: { borderRadius: "14px", backgroundColor: "#fff" }
                  }}
                />
              </div>
              <Select
                size="small"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={{ minWidth: 140, borderRadius: "14px", backgroundColor: "#fff" }}
              >
                <MenuItem value="All">All Statuses</MenuItem>
                <MenuItem value="Vacant">Vacant</MenuItem>
                <MenuItem value="Ready">Ready</MenuItem>
                <MenuItem value="Cleaning">Cleaning</MenuItem>
                <MenuItem value="Occupied">Occupied</MenuItem>
                <MenuItem value="Booked">Booked</MenuItem>
                <MenuItem value="Maintenance">Maintenance</MenuItem>
                <MenuItem value="Blocked">Blocked</MenuItem>
              </Select>
              <Select
                size="small"
                value={hotelFilter}
                onChange={(e) => setHotelFilter(e.target.value)}
                sx={{ minWidth: 160, borderRadius: "14px", backgroundColor: "#fff" }}
              >
                {uniqueHotels.map((h) => <MenuItem key={h} value={h}>{h}</MenuItem>)}
              </Select>
              {hasActiveFilters && (
                <Button variant="outlined" onClick={clearFilters} startIcon={<ClearIcon />} sx={{ borderRadius: "14px", textTransform: "none" }}>Clear</Button>
              )}
            </div>
          </div>
        </Card>

        {/* Hotels List */}
        {filteredHotels.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <HotelIcon className="text-5xl text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No rooms match your filters</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting search criteria</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredHotels.map((hotel) => (
              <Card key={hotel._id} className="rounded-2xl shadow-xl border-0 overflow-hidden">
                {/* Hotel Header */}
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-4 sm:px-6 py-4">
                  <Typography variant="h6" fontWeight="bold" className="text-white">{hotel.title}</Typography>
                  <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-300">
                    <span>{hotel.city}</span>
                    <span className="text-gray-500">|</span>
                    <span className="font-mono text-indigo-300">Code: {hotel.hotelcode}</span>
                  </div>
                </div>

                {/* Rooms Grid */}
                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {hotel.rooms.map((room) => {
                      const booking = activeBookingMap[room._id];
                      let computedStatus = room.status;
                      if (booking?.status === "Booked") computedStatus = "Booked";
                      if (booking?.status === "checked-in") computedStatus = "Occupied";
                      const options = getAllowedNextStatuses(computedStatus);
                      const canModify = !booking;
                      const statusGradient = getStatusGradient(computedStatus);

                      return (
                        <div key={room._id} className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                          <div className="relative h-40 overflow-hidden">
                            <img
                              src={room.images?.[0] || "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400"}
                              alt={`Room ${room.roomNumber}`}
                              className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                            />
                            <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r ${statusGradient}`}>
                              {computedStatus}
                            </div>
                            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-md text-white text-xs font-mono">
                              #{room.roomNumber}
                            </div>
                            {!canModify && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                                <Chip label="Active Booking" size="small" color="warning" />
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <Typography fontWeight="600" fontSize="1rem">Room {room.roomNumber}</Typography>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  <Chip label={`Floor ${room.floor || "N/A"}`} size="small" sx={{ height: 22, fontSize: "0.65rem" }} />
                                  <Chip label={`${room.guests || 2} Guests`} size="small" sx={{ height: 22, fontSize: "0.65rem" }} />
                                  <Chip label={`${room.beds || 1} Beds`} size="small" sx={{ height: 22, fontSize: "0.65rem" }} />
                                </div>
                              </div>
                            </div>
                            <Select
                              fullWidth
                              size="small"
                              value={computedStatus}
                              disabled={!canModify}
                              onChange={(e) => handleStatusChange(room, e.target.value)}
                              sx={{ mt: 2, borderRadius: "10px", backgroundColor: canModify ? "#f8fafc" : "#f1f5f9" }}
                            >
                              <MenuItem value={computedStatus}>{computedStatus} (current)</MenuItem>
                              {options.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                            </Select>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomStatusChange;