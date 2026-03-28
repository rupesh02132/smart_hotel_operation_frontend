import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

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
import HotelIcon from "@mui/icons-material/Hotel";
import PaymentsIcon from "@mui/icons-material/Payments";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import { useDispatch } from "react-redux";
import { logout } from "../../state/auth/Action";

/* Screens */
import HostDashboard from "./HostDashboard";
import HostScreen from "./HostScreen";
import BookingTable from "../../Admin/component/BookingTable";
import ProfileScreen from "../../screens/UserProfile";
import CreateListingScreen from "../../screens/CreateListingScreen"; 

/* ================================
   HOST THEME COLORS
================================ */
const HOST_THEME = {
  sidebarPrimary: "#0F0E47",
  sidebarSecondary: "#272757",
  sidebarAccent: "#8686AC",

  // ✅ White + Sky Colors
  skyLight: "#f8fafc",
  skySoft: "#e0f2fe",
  skyAccent: "#38bdf8",
};

const drawerWidth = 260;

/* Menu Items */
const menu = [
  { name: "Dashboard", path: "/host/dashboard", icon: <DashboardCustomizeIcon /> },
  { name: "My Listings", path: "/host/listings", icon: <HotelIcon /> },
  { name: "Payments", path: "/host/payments", icon: <PaymentsIcon /> },
  { name: "Add New Hotel", path: "/host/listings/new", icon: <HotelIcon /> },
];

/* Icon Style */
const iconStyle = {
  width: 38,
  height: 38,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "14px",
  background: `linear-gradient(135deg,
    ${HOST_THEME.sidebarAccent},
    ${HOST_THEME.sidebarSecondary})`,
  boxShadow: "0 0 18px rgba(134,134,172,0.45)",
};

const HostLayout = () => {
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
        background: "rgba(15,14,71,0.97)",
        color: "white",
      }}
    >
      {/* Brand */}
      <Toolbar>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 900,
            letterSpacing: "1px",
            background: `linear-gradient(to right, white, ${HOST_THEME.sidebarAccent})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Host Control
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
                borderRadius: "16px",
                "&:hover": {
                  background: "rgba(134,134,172,0.18)",
                  transform: "translateX(6px)",
                },
              }}
            >
              <ListItemIcon>
                <Box sx={iconStyle}>{item.icon}</Box>
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
              borderRadius: "16px",
              "&:hover": {
                background: "rgba(239,68,68,0.2)",
              },
            }}
          >
            <ListItemIcon>
              <AccountCircleIcon sx={{ color: "#fecaca" }} />
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

        /* ✅ WHITE + SKY BACKGROUND */
        background: `linear-gradient(to bottom right,
          ${HOST_THEME.skyLight},
          ${HOST_THEME.skySoft},
          white)`,
      }}
    >
      <CssBaseline />

      {/* ================= TOPBAR ================= */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },

          /* ✅ White Sky Glass */
          background: "rgba(255,255,255,0.75)",
          color: "#0f172a",
          backdropFilter: "blur(15px)",
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "none",
        }}
      >
        <Toolbar>
          {!isDesktop && (
            <IconButton color="inherit" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          )}

          <Typography variant="h6" sx={{ ml: 2, fontWeight: 700 }}>
            Smart Host Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* ================= SIDEBAR ================= */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: 0 }}>
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

        {isDesktop && (
          <Drawer
            variant="permanent"
            open
            sx={{
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                borderRight: "1px solid rgba(255,255,255,0.12)",
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

        {/* ✅ MAIN WHITE CARD */}
        <Box
          sx={{
            borderRadius: "26px",
            background: "rgba(255,255,255,0.85)",
            border: "1px solid rgba(0,0,0,0.08)",
            p: { xs: 2, sm: 3, md: 4 },
            minHeight: "85vh",
            boxShadow: "0 0 30px rgba(0,0,0,0.12)",
          }}
        >
          <Routes>
            <Route path="/dashboard" element={<HostDashboard />} />
            <Route path="/listings" element={<HostScreen />} />
            <Route path="/bookings" element={<BookingTable />} />
            <Route path="/listings/new" element={<CreateListingScreen />} />

            <Route
              path="/payments"
              element={<h2 style={{ color: "#0f172a" }}>Payments Coming Soon</h2>}
            />

            <Route path="/profile" element={<ProfileScreen />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default HostLayout;
