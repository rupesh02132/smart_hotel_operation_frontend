import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllListings } from "../../state/listing/Action";
import { generateQr } from "../../state/selfCheck/Action";
import { getAllBookings } from "../../state/booking/Action";
import io from "socket.io-client";


import {
  Button,
  Card,
  Chip,
  TextField,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";

import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Hotel as HotelIcon,
  MeetingRoom as MeetingRoomIcon,
  LocationCity as LocationIcon,
  QrCodeScanner as QrIcon,
  Download as DownloadIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";

const RoomTable = () => {
  const dispatch = useDispatch();

  const listingState = useSelector((s) => s.listings || {});
  const bookingState = useSelector((s) => s.bookings || {});
  const selfCheckState = useSelector((s) => s.selfCheck || {});

  const hotels = useMemo(() => listingState.listings || [], [listingState.listings]);
  const bookingList = useMemo(() => bookingState.allBookings || [], [bookingState.allBookings]);
  const { qr, loading: qrLoading, error: qrError } = selfCheckState;

  const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;

  const [searchRoom, setSearchRoom] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [hotelFilter, setHotelFilter] = useState("All");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");

  // Socket for live updates
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
    if (qr?.expiresAt) expiryRef.current = new Date(qr.expiresAt).getTime();
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
            (searchCity === "" || hotel.city?.toLowerCase().includes(searchCity.toLowerCase())) &&
            (statusFilter === "All" || computedStatus === statusFilter) &&
            (hotelFilter === "All" || hotel.title === hotelFilter)
          );
        });
        if (filteredRooms.length) return { ...hotel, rooms: filteredRooms };
        return null;
      })
      .filter(Boolean);
  }, [hotels, searchRoom, searchCity, statusFilter, hotelFilter, activeBookingMap]);

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

  const handleGenerateQR = (booking) => {
    if (!booking) return;
    let type = null;
    if (booking.status === "Booked" && booking.isPaid === true) type = "checkin";
    if (booking.status === "checked-in") type = "checkout";
    if (!type) return;
    setSelectedBooking(booking._id);
    dispatch(generateQr(booking._id, type));
  };

  const downloadQR = () => {
    if (!qr?.qrImage) return;
    const link = document.createElement("a");
    link.href = qr.qrImage;
    link.download = `QR_${selectedBooking}.png`;
    link.click();
  };

  const clearFilters = () => {
    setSearchRoom("");
    setSearchCity("");
    setStatusFilter("All");
    setHotelFilter("All");
  };

  const hasActiveFilters = searchRoom || searchCity || statusFilter !== "All" || hotelFilter !== "All";
  const uniqueHotels = ["All", ...new Set(hotels.map((h) => h.title))];

  // Global stats
  const allRooms = hotels.flatMap(h => h.rooms || []);
  const totalRooms = allRooms.length;
  const totalOccupied = allRooms.filter(r => r.status === "Occupied" || activeBookingMap[r._id]?.status === "checked-in").length;
  const totalAvailable = allRooms.filter(r => r.status === "Vacant" || r.status === "Ready").length;

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
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">QR Code Generator</h1>
              <p className="text-gray-500 text-sm mt-1">Generate check-in/check-out QR codes for active bookings</p>
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
              <div><p className="text-2xl sm:text-3xl font-bold text-green-600">{totalAvailable}</p><p className="text-xs text-gray-500">Available</p></div>
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
                <MenuItem value="Vacant">Available</MenuItem>
                <MenuItem value="Ready">Ready</MenuItem>
                <MenuItem value="Cleaning">Cleaning</MenuItem>
                <MenuItem value="Occupied">Occupied</MenuItem>
                <MenuItem value="Booked">Booked</MenuItem>
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

                {/* Rooms Grid - 2 columns on mobile, 2-3-4 on larger */}
                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {hotel.rooms.map((room) => {
                      const booking = activeBookingMap[room._id];
                      const computedStatus = booking
                        ? booking.status === "checked-in" ? "Occupied" : "Booked"
                        : room.status;
                      const canCheckIn = booking?.status === "Booked" && booking?.isPaid === true;
                      const canCheckOut = booking?.status === "checked-in";
                      const canGenerate = booking && (canCheckIn || canCheckOut);
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
                            {!canGenerate && booking && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
                                <Chip label="Not Eligible" size="small" color="warning" />
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
                            <Button
                              fullWidth
                              variant="contained"
                              size="small"
                              disabled={!canGenerate}
                              onClick={() => handleGenerateQR(booking)}
                              startIcon={<QrIcon />}
                              sx={{
                                mt: 1,
                                borderRadius: "10px",
                                textTransform: "none",
                                fontWeight: 600,
                                background: canGenerate ? "linear-gradient(135deg, #4f46e5, #7c3aed)" : "#cbd5e1",
                                "&:hover": canGenerate ? { transform: "translateY(-2px)", boxShadow: "0 10px 20px -5px rgba(79,70,229,0.4)" } : {}
                              }}
                            >
                              {!booking ? "No Booking" : canCheckOut ? "Checkout QR" : canCheckIn ? "Check-In QR" : "Not Allowed"}
                            </Button>
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

      {/* QR Modal */}
      <Dialog open={!!selectedBooking} onClose={() => setSelectedBooking(null)} PaperProps={{ sx: { borderRadius: "24px", maxWidth: "450px", width: "90%" } }}>
        <DialogTitle sx={{ textAlign: "center", pt: 3 }}>
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-indigo-100 flex items-center justify-center">
            <QrIcon className="text-indigo-600 text-2xl" />
          </div>
          <Typography variant="h6" fontWeight="bold">QR Code</Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center" }}>
          {qrLoading && (
            <div className="flex flex-col items-center py-8">
              <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-2 text-gray-600">Generating QR...</p>
            </div>
          )}
          {qr?.qrImage && !qrLoading && (
            <div className="flex flex-col items-center">
              <img src={qr.qrImage} alt="QR Code" className="w-56 h-56 object-contain" />
              {timeLeft && (
                <div className="mt-3 flex items-center gap-2 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Expires in: {timeLeft}</span>
                </div>
              )}
              <button
                onClick={downloadQR}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
              >
                <DownloadIcon className="text-sm" />
                Download QR
              </button>
            </div>
          )}
          {qrError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 text-red-600">
              <ErrorIcon className="text-red-500" />
              <p>{qrError}</p>
            </div>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
          <Button onClick={() => setSelectedBooking(null)} variant="outlined" sx={{ borderRadius: "12px", px: 4 }}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RoomTable;