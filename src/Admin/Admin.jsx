import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  CssBaseline,
  Divider,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import QrCodeIcon from "@mui/icons-material/QrCode";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import HotelIcon from "@mui/icons-material/Hotel";

import { Routes, Route } from "react-router-dom";

/* Screens */
import Dashboard from "../Admin/component/AdminDashboard";
import CreateListingForm from "../Admin/component/CreateListingForm";
import BookingTable from "../Admin/component/BookingTable";
import ListingTable from "../Admin/component/ListingTable";
import RoomTable from "../Admin/component/RoomTable";
import CustomerTable from "./component/CustomerTable";
import HostBookingTable from "./component/HostBookingTable";
import AdminRegisterScreen from "./component/AdminRegisterScreen";

/* Smart Hotel */
import AnalyticsDashboard from "./component/AnalyticsDashboard";
import LiveRoomStatus from "./component/LiveRoomStatus";
import HousekeepingScreen from "../screens/HousekeepingScreen";


import { useDispatch } from "react-redux";
import { logout } from "../state/auth/Action";
import CreateListingScreen  from "../screens/CreateListingScreen";
import EditListingScreen from "../screens/EditListingScreen";
import CreateRoomScreen from "../screens/CreateRoomScreen";
import HotelRoomTable from "./component/HotelRoomTable";
import EditRoomScreen from "../screens/EditRoomScreen";

/* Sidebar Width */
const drawerWidth = 260;

/* Menu Items */
const menu = [
  { name: "Dashboard", path: "/admin/dashboard", icon: <DashboardCustomizeIcon /> },
  { name: "Analytics", path: "/admin/analytics", icon: <AnalyticsIcon /> },
  { name: "Hotels Management", path: "/admin/listings", icon: <HotelIcon /> },
  { name: "Hotel & Room Management", path: "/admin/hotels/rooms", icon: <HotelIcon /> },
  { name: "Add New Hotel", path: "/admin/listings/new", icon: <AddShoppingCartIcon /> },
  { name: "QR Code Generator", path: "/admin/rooms", icon: <QrCodeIcon /> },
  { name: "Booking Control", path: "/admin/bookings", icon: <BookmarkBorderIcon /> },
  { name: "Customers Management", path: "/admin/customers", icon: <SupportAgentIcon /> },

  { name: "Host Bookings", path: "/admin/host/bookings", icon: <BookmarkBorderIcon /> },
  { name: "Admin Register", path: "/admin/register", icon: <AccountCircleIcon /> },

  /* Smart Hotel */
  { name: "Live Room Status", path: "/admin/rooms/live", icon: <HotelIcon /> },
  { name: "Housekeeping", path: "/admin/housekeeping", icon: <CleaningServicesIcon /> },
  

];

const AdminLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [mobileOpen, setMobileOpen] = useState(false);

  /* Toggle Drawer */
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  /* Logout */
  const logoutHandler = () => {
    dispatch(logout());
    navigate("/login");
  };

  /* ==============================
        DRAWER CONTENT
  ============================== */
  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "rgba(0,0,0,0.88)",
        color: "white",
      }}
    >
      {/* Brand */}
      <Toolbar>
        <Typography variant="h6" fontWeight="bold">
          Smart Hotel Admin
        </Typography>
      </Toolbar>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

      {/* Menu */}
      <List sx={{ flexGrow: 1, py: 2 }}>
        {menu.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                if (!isDesktop) setMobileOpen(false);
              }}
              sx={{
                mx: 1,
                mb: 1,
                borderRadius: "14px",
                "&:hover": {
                  background: "rgba(255,255,255,0.08)",
                  transform: "translateX(6px)",
                },
              }}
            >
              <ListItemIcon sx={{ color: "white", minWidth: 42 }}>
                {item.icon}
              </ListItemIcon>

              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Logout */}
      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={logoutHandler}
            sx={{
              mx: 1,
              my: 1,
              borderRadius: "14px",
              "&:hover": {
                background: "rgba(239,68,68,0.18)",
              },
            }}
          >
            <ListItemIcon sx={{ color: "#fecaca", minWidth: 42 }}>
              <AccountCircleIcon />
            </ListItemIcon>

            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background:
          "linear-gradient(to bottom right,#020617,#000,#111827)",
      }}
    >
      <CssBaseline />

      {/* ================= TOPBAR ================= */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(18px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Toolbar>
          {!isDesktop && (
            <IconButton color="inherit" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          )}

          <Typography variant="h6" fontWeight="bold" sx={{ ml: 2 }}>
            Smart Hotel Admin Panel
          </Typography>
        </Toolbar>
      </AppBar>

      {/* ================= SIDEBAR ================= */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: 0 }}>
        {/* Mobile Drawer */}
        {!isDesktop && (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              "& .MuiDrawer-paper": { width: drawerWidth },
            }}
          >
            {drawerContent}
          </Drawer>
        )}

        {/* Desktop Drawer */}
        {isDesktop && (
          <Drawer
            variant="permanent"
            open
            sx={{
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                borderRight: "1px solid rgba(255,255,255,0.1)",
              },
            }}
          >
            {drawerContent}
          </Drawer>
        )}
      </Box>

      {/* ================= MAIN ================= */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          p: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <Toolbar />

        {/* Page Container */}
        <Box
          sx={{
            borderRadius: "26px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.12)",
            p: { xs: 2, sm: 3, md: 4 },
            minHeight: "85vh",
            boxShadow: "0 0 45px rgba(0,0,0,0.7)",
          }}
        >
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/listings" element={<ListingTable />} />
            <Route path="/rooms" element={<RoomTable />} />
            <Route path="/hotels/rooms" element={<HotelRoomTable />} />
            <Route path="/bookings" element={<BookingTable />} />
            <Route path="/customers" element={<CustomerTable />} />

            <Route path="/host/bookings" element={<HostBookingTable />} />
            <Route path="/register" element={<AdminRegisterScreen />} />
            {/* Smart Hotel */}
            <Route path="/hotels/:listingId/rooms/create" element={<CreateRoomScreen />} />
            <Route path="/rooms/:roomId/edit" element={<EditRoomScreen />} />
            <Route path="/listings/new" element={<CreateListingScreen />} />
            <Route path="/listing/edit/:id" element={<EditListingScreen />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
            <Route path="/rooms/live" element={<LiveRoomStatus />} />
            <Route path="/housekeeping" element={<HousekeepingScreen />} />

        
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
