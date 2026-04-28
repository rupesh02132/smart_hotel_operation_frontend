import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllListings,
  deleteListing,
} from "../../state/listing/Action";
import { useNavigate } from "react-router-dom";

import {
  Avatar,
  Button,
  Card,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Chip,
  Typography,
  Pagination,
  InputAdornment,
  Fade,
} from "@mui/material";

import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
  Hotel as HotelIcon,
  LocationOn as LocationIcon,
  Category as CategoryIcon,
  Business as BusinessIcon,
  Add as AddIcon,
  Phone as PhoneIcon,
} from "@mui/icons-material";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ListingTable = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const listings = useSelector(
    (store) => store.listings?.listings || []
  );

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [cityFilter, setCityFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const rowsPerPage = 10;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    dispatch(getAllListings({}));
  }, [dispatch]);

  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      const matchSearch = item.title
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
        item.hotelcode?.toLowerCase().includes(search.toLowerCase());

      const matchCategory =
        categoryFilter === "All" ||
        item.category === categoryFilter;

      const matchCity =
        cityFilter === "All" || item.city === cityFilter;

      return matchSearch && matchCategory && matchCity;
    });
  }, [listings, search, categoryFilter, cityFilter]);

  const totalPages = Math.ceil(
    filteredListings.length / rowsPerPage
  );

  const paginatedListings = filteredListings.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleDeleteConfirm = () => {
    dispatch(deleteListing(confirmDelete));
    setConfirmDelete(null);
  };

  const exportToExcel = () => {
    const data = filteredListings.map((l) => ({
      Title: l.title,
      "Hotel Code": l.hotelcode,
      City: l.city,
      Category: l.category,
      Country: l.country,
      "Total Rooms": l.rooms?.length || 0,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Listings");

    const buffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([buffer]);
    saveAs(blob, `Hotels_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const clearFilters = () => {
    setSearch("");
    setCategoryFilter("All");
    setCityFilter("All");
    setPage(1);
  };

  const uniqueCategories = [
    "All",
    ...new Set(listings.map((l) => l.category).filter(Boolean)),
  ];

  const uniqueCities = [
    "All",
    ...new Set(listings.map((l) => l.city).filter(Boolean)),
  ];

  const hasActiveFilters = search || categoryFilter !== "All" || cityFilter !== "All";

  const statsData = [
    { label: "Total Hotels", value: listings.length, icon: <HotelIcon />, color: "from-blue-500 to-indigo-600" },
    { label: "Cities", value: uniqueCities.length - 1, icon: <LocationIcon />, color: "from-emerald-500 to-teal-600" },
    { label: "Categories", value: uniqueCategories.length - 1, icon: <CategoryIcon />, color: "from-purple-500 to-pink-600" },
    { label: "Active Results", value: filteredListings.length, icon: <BusinessIcon />, color: "from-amber-500 to-orange-600" },
  ];

  // Mobile Card Component
  const HotelCard = ({ hotel }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-4 hover:shadow-lg transition-all">
      <div className="flex p-4 gap-4">
        <Avatar
          src={hotel.images?.[0]}
          alt={hotel.title}
          sx={{
            width: 80,
            height: 80,
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
          }}
        />
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-gray-800 text-base">{hotel.title}</h3>
              <p className="text-xs text-gray-500 font-mono mt-0.5">{hotel.hotelcode}</p>
            </div>
            <div className="flex gap-1">
              <Tooltip title="Edit">
                <IconButton
                  size="small"
                  onClick={() => navigate(`/admin/listing/edit/${hotel._id}`)}
                  className="bg-amber-50"
                  sx={{ borderRadius: "8px", p: 0.5 }}
                >
                  <EditIcon sx={{ fontSize: "1rem", color: "#d97706" }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  size="small"
                  onClick={() => setConfirmDelete(hotel._id)}
                  className="bg-red-50"
                  sx={{ borderRadius: "8px", p: 0.5 }}
                >
                  <DeleteIcon sx={{ fontSize: "1rem", color: "#dc2626" }} />
                </IconButton>
              </Tooltip>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <Chip
              icon={<LocationIcon sx={{ fontSize: "0.75rem" }} />}
              label={hotel.city}
              size="small"
              sx={{ height: 24, fontSize: "0.7rem" }}
            />
            <Chip
              label={hotel.category}
              size="small"
              sx={{ height: 24, fontSize: "0.7rem", backgroundColor: "#dcfce7", color: "#166534" }}
            />
            <Chip
              label={`${hotel.rooms?.length || 0} Rooms`}
              size="small"
              sx={{ height: 24, fontSize: "0.7rem", backgroundColor: "#e0e7ff", color: "#4338ca" }}
            />
          </div>
          {hotel.phone && (
            <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
              <PhoneIcon sx={{ fontSize: "0.75rem" }} />
              <span>{hotel.phone}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-[1600px] mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        
        {/* Header Section */}
        <div className="mb-6 md:mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
                <span className="text-indigo-600 text-xs font-semibold uppercase tracking-wider">Hotel Management</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">
                Hotels & Properties
              </h1>
              <p className="text-gray-500 text-sm mt-1">Manage all hotel listings across your portfolio</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="contained"
                onClick={exportToExcel}
                startIcon={<DownloadIcon />}
                sx={{
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  borderRadius: "14px",
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  boxShadow: "0 4px 14px rgba(16,185,129,0.3)",
                  "&:hover": { 
                    background: "linear-gradient(135deg, #059669, #047857)",
                    transform: "translateY(-1px)",
                  }
                }}
              >
                Export Excel
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate("/admin/listings/new")}
                startIcon={<AddIcon />}
                sx={{
                  borderRadius: "14px",
                  textTransform: "none",
                  fontWeight: 600,
                  borderColor: "#6366f1",
                  color: "#6366f1",
                  "&:hover": { borderColor: "#4f46e5", backgroundColor: "rgba(99,102,241,0.05)" }
                }}
              >
                Add Hotel
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards - Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 md:mb-8">
          {statsData.map((stat, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-br ${stat.color} rounded-xl p-3 sm:p-4 shadow-lg`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm text-white/80 mt-0.5 font-medium">
                    {stat.label}
                  </p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <div className="text-white text-sm sm:text-base">{stat.icon}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filters */}
        <Card className="rounded-2xl shadow-xl border-0 mb-6 overflow-hidden">
          <div className="p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <TextField
                  placeholder="Search by hotel name or code..."
                  size="small"
                  fullWidth
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon className="text-gray-400" />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: "14px", backgroundColor: "#fff" }
                  }}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outlined"
                  onClick={() => setShowFilters(!showFilters)}
                  startIcon={<FilterListIcon />}
                  sx={{
                    borderRadius: "14px",
                    textTransform: "none",
                    borderColor: "#e2e8f0",
                    color: "#64748b",
                    px: 3,
                    "&:hover": { borderColor: "#6366f1", color: "#6366f1" }
                  }}
                >
                  <span className="hidden sm:inline">{showFilters ? "Hide Filters" : "Show Filters"}</span>
                  <span className="sm:hidden">Filter</span>
                </Button>
                {hasActiveFilters && (
                  <Button
                    variant="text"
                    onClick={clearFilters}
                    startIcon={<ClearIcon />}
                    sx={{
                      borderRadius: "14px",
                      textTransform: "none",
                      color: "#ef4444",
                      minWidth: "auto",
                      "&:hover": { backgroundColor: "rgba(239,68,68,0.05)" }
                    }}
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {showFilters && (
              <Fade in={showFilters}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                  <Select
                    size="small"
                    fullWidth
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    startAdornment={<CategoryIcon className="text-gray-400 mr-2" />}
                    sx={{ borderRadius: "14px", backgroundColor: "#fff" }}
                  >
                    {uniqueCategories.map((cat) => (
                      <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))}
                  </Select>
                  <Select
                    size="small"
                    fullWidth
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    startAdornment={<LocationIcon className="text-gray-400 mr-2" />}
                    sx={{ borderRadius: "14px", backgroundColor: "#fff" }}
                  >
                    {uniqueCities.map((city) => (
                      <MenuItem key={city} value={city}>{city}</MenuItem>
                    ))}
                  </Select>
                </div>
              </Fade>
            )}

            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mt-4">
                {search && (
                  <Chip
                    label={`Search: ${search}`}
                    size="small"
                    onDelete={() => setSearch("")}
                    sx={{ backgroundColor: "#e0e7ff", color: "#4338ca", borderRadius: "8px" }}
                  />
                )}
                {categoryFilter !== "All" && (
                  <Chip
                    label={`Category: ${categoryFilter}`}
                    size="small"
                    onDelete={() => setCategoryFilter("All")}
                    sx={{ backgroundColor: "#f3e8ff", color: "#6b21a5", borderRadius: "8px" }}
                  />
                )}
                {cityFilter !== "All" && (
                  <Chip
                    label={`City: ${cityFilter}`}
                    size="small"
                    onDelete={() => setCityFilter("All")}
                    sx={{ backgroundColor: "#d1fae5", color: "#065f46", borderRadius: "8px" }}
                  />
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Hotels Display - Mobile Cards / Desktop Table */}
        {isMobile ? (
          // Mobile Card View
          <div className="space-y-3">
            {paginatedListings.length === 0 ? (
              <div className="text-center py-12">
                <HotelIcon className="text-5xl text-gray-300 mb-3" />
                <p className="text-gray-500">No hotels found</p>
              </div>
            ) : (
              paginatedListings.map((hotel) => (
                <HotelCard key={hotel._id} hotel={hotel} />
              ))
            )}
          </div>
        ) : (
          // Desktop Table View
          <Card className="rounded-2xl shadow-xl border-0 overflow-hidden">
            <div className="overflow-x-auto">
              <TableContainer component={Paper} elevation={0}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>Image</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>Hotel Name</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>Hotel Code</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>City</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>Category</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>Rooms</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedListings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 12 }}>
                          <div className="text-center">
                            <HotelIcon className="text-6xl text-gray-300 mb-4" />
                            <Typography variant="h6" className="text-gray-600">No hotels found</Typography>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedListings.map((item) => (
                        <TableRow key={item._id} hover>
                          <TableCell align="center">
                            <Avatar
                              src={item.images?.[0]}
                              alt={item.title}
                              sx={{ width: 48, height: 48, margin: "auto", borderRadius: "12px" }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" fontWeight={600}>{item.title}</Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip label={item.hotelcode} size="small" sx={{ fontFamily: "monospace" }} />
                          </TableCell>
                          <TableCell align="center">
                            <div className="flex items-center justify-center gap-1">
                              <LocationIcon className="text-gray-400 text-sm" />
                              <span>{item.city}</span>
                            </div>
                          </TableCell>
                          <TableCell align="center">
                            <Chip label={item.category} size="small" sx={{ backgroundColor: "#dcfce7", color: "#166534" }} />
                          </TableCell>
                          <TableCell align="center">
                            <span className="font-semibold">{item.rooms?.length || 0}</span>
                          </TableCell>
                          <TableCell align="center">
                            <div className="flex items-center justify-center gap-2">
                              <Tooltip title="Edit">
                                <IconButton
                                  size="small"
                                  onClick={() => navigate(`/admin/listing/edit/${item._id}`)}
                                  sx={{ backgroundColor: "#fef3c7", borderRadius: "10px" }}
                                >
                                  <EditIcon sx={{ fontSize: "1.1rem", color: "#d97706" }} />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  onClick={() => setConfirmDelete(item._id)}
                                  sx={{ backgroundColor: "#fee2e2", borderRadius: "10px" }}
                                >
                                  <DeleteIcon sx={{ fontSize: "1.1rem", color: "#dc2626" }} />
                                </IconButton>
                              </Tooltip>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>

            {/* Pagination for Desktop */}
            {totalPages > 1 && (
              <div className="flex justify-center py-4 border-t border-gray-100">
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                  color="primary"
                  shape="rounded"
                />
              </div>
            )}

            <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-gray-500">
              <span>Showing {paginatedListings.length} of {filteredListings.length} hotels</span>
              <span>Total Hotels: {listings.length}</span>
            </div>
          </Card>
        )}

        {/* Mobile Pagination */}
        {isMobile && totalPages > 1 && (
          <div className="flex justify-center mt-6">
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
              shape="rounded"
              size="small"
            />
          </div>
        )}
      </div>

      {/* Delete Dialog */}
      <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)} PaperProps={{ sx: { borderRadius: "24px", maxWidth: "400px", width: "90%", m: 0 } }}>
        <DialogTitle sx={{ textAlign: "center", pt: 3 }}>
          <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-red-100 flex items-center justify-center">
            <DeleteIcon className="text-red-500 text-2xl" />
          </div>
          <Typography variant="h6" fontWeight="bold">Delete Hotel?</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" align="center">
            This action cannot be undone. All associated rooms and bookings will be removed.
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

export default ListingTable;