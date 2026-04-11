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
import LogoutIcon from "@mui/icons-material/Logout";

import { Routes, Route } from "react-router-dom";

/* Screens */
import Dashboard from "../Admin/component/AdminDashboard";
import BookingTable from "../Admin/component/BookingTable";
import ListingTable from "../Admin/component/ListingTable";
import RoomTable from "../Admin/component/RoomTable";
import CustomerTable from "./component/CustomerTable";
import HostBookingTable from "./component/HostBookingTable";
import AdminRegisterScreen from "./component/AdminRegisterScreen";
import NotificationPage from "../components/NotificationPage";

/* Smart Hotel */
import AnalyticsDashboard from "./component/AnalyticsDashboard";
import LiveRoomStatus from "./component/LiveRoomStatus";
import HousekeepingScreen from "../screens/HousekeepingScreen";

import { useDispatch } from "react-redux";
import { logout } from "../state/auth/Action";

import CreateListingScreen from "../screens/CreateListingScreen";
import EditListingScreen from "../screens/EditListingScreen";
import CreateRoomScreen from "../screens/CreateRoomScreen";
import HotelRoomTable from "./component/HotelRoomTable";
import EditRoomScreen from "../screens/EditRoomScreen";
import RoomStatusChange from "./component/RoomStatusChange";

/* Sidebar Width */
const drawerWidth = 260;

/* Menu */
const menu = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: <DashboardCustomizeIcon />,
  },
  { name: "Analytics", path: "/admin/analytics", icon: <AnalyticsIcon /> },
  { name: "Hotels Management", path: "/admin/listings", icon: <HotelIcon /> },
  {
    name: "Hotel & Room Management",
    path: "/admin/hotels/rooms",
    icon: <HotelIcon />,
  },
  {
    name: "Add New Hotel",
    path: "/admin/listings/new",
    icon: <AddShoppingCartIcon />,
  },
  { name: "QR Code Generator", path: "/admin/rooms", icon: <QrCodeIcon /> },
  {
    name: "Booking Control",
    path: "/admin/bookings",
    icon: <BookmarkBorderIcon />,
  },
  {
    name: "Customers Management",
    path: "/admin/customers",
    icon: <SupportAgentIcon />,
  },
  {
    name: "Host Bookings",
    path: "/admin/host/bookings",
    icon: <BookmarkBorderIcon />,
  },
  {
    name: "Admin Register",
    path: "/admin/register",
    icon: <AccountCircleIcon />,
  },
  { name: "Live Room Status", path: "/admin/rooms/live", icon: <HotelIcon /> },
  {
    name: "Housekeeping",
    path: "/admin/housekeeping",
    icon: <CleaningServicesIcon />,
  },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/login");
  };

  /* SIDEBAR */
  const drawerContent = (
    <Box
      sx={{
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        background: "rgba(0,0,0,0.88)",
        color: "white",
      }}
    >
      <Toolbar>
        <Typography variant="h6" fontWeight="bold">
          Smart Hotel Admin
        </Typography>
      </Toolbar>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

      <List
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          px: 0.5,
        }}
      >
        {menu.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                if (!isDesktop) setMobileOpen(false);
              }}
              sx={{
                mx: 1,
                my: 0.5,
                borderRadius: "12px",
                "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
              }}
            >
              <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>

              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={logoutHandler}
            sx={{
              mx: 1,
              my: 1,
              borderRadius: "12px",
              "&:hover": { bgcolor: "rgba(239,68,68,0.2)" },
            }}
          >
            <ListItemIcon sx={{ color: "#fecaca", minWidth: 40 }}>
              <LogoutIcon />
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
        width: "100%",
        overflowX: "hidden",
        background: "linear-gradient(to bottom right,#020617,#000000,#111827)",
      }}
    >
      <CssBaseline />

      {/* TOPBAR */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backdropFilter: "blur(20px)",
          bgcolor: "rgba(0,0,0,0.7)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          px: { xs: 1, sm: 2 },
        }}
      >
        <Toolbar>
          {!isDesktop && (
            <IconButton onClick={handleDrawerToggle} color="inherit">
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{
              fontSize: { xs: 14, sm: 16, md: 20 },
              ml: 1,
            }}
          >
            Smart Hotel Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* SIDEBAR */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: 0 }}>
        {!isDesktop ? (
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
        ) : (
          <Drawer
            variant="permanent"
            open
            sx={{
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                height: "100vh",
                overflow: "hidden",
               borderRight: "1px solid rgba(255,255,255,0.1)",
              },
            }}
          >
            {drawerContent}
          </Drawer>
        )}
      </Box>

      {/* MAIN */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          px: { xs: 1, sm: 2, md: 3 },
          py: { xs: 2, sm: 3 },
        }}
      >
        <Toolbar />

        <Box
          sx={{
            borderRadius: { xs: 2, md: 3 },
            bgcolor: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.12)",
            p: { xs: 1.5, sm: 2.5, md: 4 },
            minHeight: "85vh",
            boxShadow: "0 0 40px rgba(0,0,0,0.75)",
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
            <Route path="/analytics" element={<AnalyticsDashboard />} />
            <Route path="/rooms/live" element={<LiveRoomStatus />} />
            <Route path="/housekeeping" element={<HousekeepingScreen />} />
            <Route path="/notifications" element={<NotificationPage />} />
            <Route path="/listings/new" element={<CreateListingScreen />} />
            <Route path="/listing/edit/:id" element={<EditListingScreen />} />
            <Route
              path="/hotels/:listingId/rooms/create"
              element={<CreateRoomScreen />}
            />
            <Route path="/rooms/:roomId/edit" element={<EditRoomScreen />} />
            <Route
              path="/rooms/:roomId/status"
              element={<RoomStatusChange />}
            />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
