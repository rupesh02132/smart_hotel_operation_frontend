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
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Hotel as HotelIcon,
  MeetingRoom as RoomIcon,
  LocationCity as CityIcon,
  QrCodeScanner as QrIcon,
  Download as DownloadIcon,
  Close as CloseIcon,
} from "@mui/icons-material";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;

const RoomTable = () => {
  const dispatch = useDispatch();
  const listingState = useSelector((s) => s.listings || {});
  const bookingState = useSelector((s) => s.bookings || {});
  const selfCheckState = useSelector((s) => s.selfCheck || {});

const hotels = useMemo(() => {
  const hotelsRaw = listingState.listings;

  if (Array.isArray(hotelsRaw)) {
    return hotelsRaw;
  } else if (hotelsRaw && Array.isArray(hotelsRaw.data)) {
    return hotelsRaw.data;
  }

  return [];
}, [listingState.listings]);
  // else stays empty array

  const bookingList = useMemo(() => bookingState.allBookings || [], [bookingState.allBookings]);
  const { qr, loading: qrLoading } = selfCheckState;

  const [searchRoom, setSearchRoom] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [hotelFilter, setHotelFilter] = useState("All");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [socketError, setSocketError] = useState(false);

  // === 1. SOCKET CONNECTION ===
  useEffect(() => {
    if (!SOCKET_URL) {
      console.warn("⚠️ SOCKET_URL is not defined. Real‑time updates disabled.");
      return;
    }

    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => setSocketError(false));
    socket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      setSocketError(true);
    });

    const refreshData = () => {
      dispatch(getAllBookings());
      dispatch(getAllListings());
    };

    socket.on("roomUpdated", refreshData);

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("roomUpdated", refreshData);
      socket.disconnect();
    };
  }, [dispatch]);

  // === 2. INITIAL DATA FETCH ===
  useEffect(() => {
    dispatch(getAllBookings());
    dispatch(getAllListings());
  }, [dispatch]);

  // === 3. QR EXPIRY TIMER ===
  const expiryRef = useRef(null);
  useEffect(() => {
    if (qr?.expiresAt) {
      expiryRef.current = new Date(qr.expiresAt).getTime();
    } else {
      expiryRef.current = null;
      setTimeLeft("");
    }
  }, [qr?.expiresAt]);

  useEffect(() => {
    if (!expiryRef.current) return;
    const interval = setInterval(() => {
      const diff = expiryRef.current - Date.now();
      if (diff <= 0) {
        setTimeLeft("Expired");
        clearInterval(interval);
      } else {
        const min = Math.floor(diff / 60000);
        const sec = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${String(min).padStart(2, "0")}m ${String(sec).padStart(2, "0")}s`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [qr?.expiresAt]);

  // === 4. ACTIVE BOOKINGS MAP ===
  const activeBookingMap = useMemo(() => {
    const map = {};
    bookingList.forEach((b) => {
      if (b.status === "Booked" || b.status === "checked-in") {
        const id = b.room?._id || b.room;
        if (id) map[id] = b;
      }
    });
    return map;
  }, [bookingList]);

  // === 5. FILTER HOTELS & ROOMS ===
  const filteredHotels = useMemo(() => {
    if (!hotels.length) return [];
    return hotels
      .map((hotel) => {
        const filteredRooms = (hotel.rooms || []).filter((room) => {
          const activeBooking = activeBookingMap[room._id];
          const computedStatus = activeBooking
            ? activeBooking.status === "checked-in" ? "Occupied" : "Booked"
            : room.status;
          return (
            room.roomNumber?.toLowerCase().includes(searchRoom.toLowerCase()) &&
            (searchCity === "" || hotel.city?.toLowerCase().includes(searchCity.toLowerCase())) &&
            (statusFilter === "All" || computedStatus === statusFilter) &&
            (hotelFilter === "All" || hotel.title === hotelFilter)
          );
        });
        return filteredRooms.length ? { ...hotel, rooms: filteredRooms } : null;
      })
      .filter(Boolean);
  }, [hotels, searchRoom, searchCity, statusFilter, hotelFilter, activeBookingMap]);

  // === 6. HELPERS ===
  const getStatusBgClass = (status) => {
    const map = {
      Occupied: "bg-red-100 text-red-700",
      Cleaning: "bg-yellow-100 text-yellow-700",
      Vacant: "bg-green-100 text-green-700",
      Ready: "bg-green-100 text-green-700",
      Booked: "bg-blue-100 text-blue-700",
    };
    return map[status] || "bg-gray-100 text-gray-700";
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

  const handleDownloadQR = () => {
    if (!qr?.qrImage) return;
    const link = document.createElement("a");
    link.href = qr.qrImage;
    link.download = "room-qr.png";
    link.click();
  };

  const clearFilters = () => {
    setSearchRoom("");
    setSearchCity("");
    setStatusFilter("All");
    setHotelFilter("All");
  };

  const hasActiveFilters = searchRoom || searchCity || statusFilter !== "All" || hotelFilter !== "All";
  const uniqueHotels = ["All", ...new Set(hotels.map((h) => h.title).filter(Boolean))];

  // === 7. STATS ===
  const allRooms = hotels.flatMap((h) => h.rooms || []);
  const totalRooms = allRooms.length;
  const occupiedRooms = allRooms.filter(
    (r) => r.status === "Occupied" || activeBookingMap[r._id]?.status === "checked-in"
  ).length;
  const availableRooms = allRooms.filter((r) => r.status === "Vacant" || r.status === "Ready").length;

  // Show loading if hotels are still being fetched (hotels array empty but loading flag could be used)
  const isLoading = listingState.loading && hotels.length === 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
            <span className="text-indigo-600 text-xs font-semibold uppercase tracking-wider">QR Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">QR Code Generator</h1>
          <p className="text-gray-500 text-sm mt-1">Generate check‑in/check‑out QR codes for active bookings</p>
          {socketError && (
            <div className="mt-2 text-xs text-amber-600 bg-amber-50 p-2 rounded-lg">
              ⚠️ Real‑time updates disconnected. Data will still work, but page refresh may be needed.
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 md:mb-8">
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">{totalRooms}</p>
                <p className="text-xs text-gray-500">Total Rooms</p>
              </div>
              <RoomIcon className="text-blue-500 text-2xl opacity-70" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold text-red-600">{occupiedRooms}</p>
                <p className="text-xs text-gray-500">Occupied</p>
              </div>
              <HotelIcon className="text-red-500 text-2xl opacity-70" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold text-emerald-600">{availableRooms}</p>
                <p className="text-xs text-gray-500">Available</p>
              </div>
              <RoomIcon className="text-emerald-500 text-2xl opacity-70" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-2xl font-bold text-indigo-600">{filteredHotels.length}</p>
                <p className="text-xs text-gray-500">Hotels Shown</p>
              </div>
              <CityIcon className="text-indigo-500 text-2xl opacity-70" />
            </div>
          </div>
        </div>

        {/* Filters Card */}
        <Card className="rounded-2xl shadow-md border-0 mb-6 md:mb-8 overflow-hidden">
          <div className="p-3 sm:p-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <TextField
                  size="small"
                  placeholder="Search room number..."
                  fullWidth
                  value={searchRoom}
                  onChange={(e) => setSearchRoom(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon className="text-gray-400" />
                      </InputAdornment>
                    ),
                    endAdornment: searchRoom && (
                      <ClearIcon
                        className="cursor-pointer text-gray-400"
                        onClick={() => setSearchRoom("")}
                      />
                    ),
                    sx: { borderRadius: "40px", backgroundColor: "#fff" },
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
                    startAdornment: (
                      <InputAdornment position="start">
                        <CityIcon className="text-gray-400" />
                      </InputAdornment>
                    ),
                    endAdornment: searchCity && (
                      <ClearIcon
                        className="cursor-pointer text-gray-400"
                        onClick={() => setSearchCity("")}
                      />
                    ),
                    sx: { borderRadius: "40px", backgroundColor: "#fff" },
                  }}
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-3 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                >
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </button>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="px-3 py-2 rounded-full text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-3 border-t border-gray-100">
                <Select
                  size="small"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-white rounded-full"
                  sx={{ borderRadius: "40px" }}
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
                  className="bg-white rounded-full"
                  sx={{ borderRadius: "40px" }}
                >
                  {uniqueHotels.map((h) => (
                    <MenuItem key={h} value={h}>
                      {h}
                    </MenuItem>
                  ))}
                </Select>
              </div>
            )}
          </div>
        </Card>

        {/* Hotels List */}
        {filteredHotels.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <HotelIcon className="text-5xl text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No rooms match your filters</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredHotels.map((hotel) => (
              <Card key={hotel._id} className="rounded-2xl shadow-md border-0 overflow-hidden">
                {/* Hotel Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 sm:px-6 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <Typography variant="h6" className="font-bold text-white">
                      {hotel.title}
                    </Typography>
                    <Typography variant="caption" className="text-indigo-100">
                      {hotel.city}
                    </Typography>
                  </div>
                  <Chip
                    label={`${hotel.rooms.length} rooms`}
                    size="small"
                    className="bg-white/20 text-white"
                  />
                </div>

                {/* Rooms Grid */}
                <div className="p-4 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {hotel.rooms.map((room) => {
                      const booking = activeBookingMap[room._id];
                      const computedStatus = booking
                        ? booking.status === "checked-in"
                          ? "Occupied"
                          : "Booked"
                        : room.status;
                      const canCheckIn = booking?.status === "Booked" && booking?.isPaid;
                      const canCheckOut = booking?.status === "checked-in";
                      const canGenerate = booking && (canCheckIn || canCheckOut);
                      const statusBg = getStatusBgClass(computedStatus);
                      const imageUrl =
                        room.images?.[0] ||
                        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400";

                      return (
                        <div
                          key={room._id}
                          className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100"
                        >
                          <div className="relative h-36 overflow-hidden">
                            <img
                              src={imageUrl}
                              alt={`Room ${room.roomNumber}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                              onError={(e) => {
                                e.target.src =
                                  "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=400";
                              }}
                            />
                            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-semibold text-white bg-black/60 backdrop-blur-sm">
                              #{room.roomNumber}
                            </div>
                            {!canGenerate && booking && (
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px]">
                                <Chip label="Not Eligible" size="small" color="error" />
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <Typography variant="subtitle2" fontWeight="600">
                                  Room {room.roomNumber}
                                </Typography>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  <Chip
                                    label={`Floor ${room.floor || "N/A"}`}
                                    size="small"
                                    className="h-5 text-[10px]"
                                  />
                                  <Chip
                                    label={`${room.guests || 2} guests`}
                                    size="small"
                                    className="h-5 text-[10px]"
                                  />
                                  <Chip
                                    label={`${room.beds || 1} beds`}
                                    size="small"
                                    className="h-5 text-[10px]"
                                  />
                                </div>
                              </div>
                              <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBg}`}>
                                {computedStatus}
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
                                borderRadius: "30px",
                                textTransform: "none",
                                fontWeight: 600,
                                background: canGenerate
                                  ? "linear-gradient(135deg, #4f46e5, #7c3aed)"
                                  : "#cbd5e1",
                                "&:hover": canGenerate ? { transform: "scale(1.02)" } : {},
                              }}
                            >
                              {!booking
                                ? "No Booking"
                                : canCheckOut
                                ? "Checkout QR"
                                : canCheckIn
                                ? "Check‑In QR"
                                : "Not Allowed"}
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
      <Dialog
        open={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: "24px" } }}
      >
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", pb: 1 }}>
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <QrIcon className="text-indigo-600 text-2xl" />
          </div>
          Scan QR Code
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center" }}>
          {qrLoading && <CircularProgress className="text-indigo-500" />}
          {qr?.qrImage && !qrLoading && (
            <div className="flex flex-col items-center">
              <img
                src={qr.qrImage}
                alt="QR Code"
                className="w-48 h-48 object-contain"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              {timeLeft && (
                <Chip
                  label={`⏳ ${timeLeft}`}
                  color={timeLeft === "Expired" ? "error" : "primary"}
                  className="mt-3"
                />
              )}
            </div>
          )}
          {!qrLoading && !qr?.qrImage && selectedBooking && (
            <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
              No QR code generated yet.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 3 }}>
          <Button
            variant="outlined"
            onClick={() => setSelectedBooking(null)}
            startIcon={<CloseIcon />}
          >
            Close
          </Button>
          {qr?.qrImage && (
            <Button variant="contained" onClick={handleDownloadQR} startIcon={<DownloadIcon />}>
              Download
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default RoomTable;