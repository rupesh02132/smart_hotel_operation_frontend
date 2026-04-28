import React, { useState } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";

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
  Container,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import CleaningServicesIcon from "@mui/icons-material/CleaningServices";
import HotelIcon from "@mui/icons-material/Hotel";
import QrCodeIcon from "@mui/icons-material/QrCode";
import LogoutIcon from "@mui/icons-material/Logout";

import StaffDashboard from "./StaffDashboard";
import HousekeepingScreen from "../../screens/HousekeepingScreen";
import RoomTable from "./QR_Generate";
import StaffAttendancePanel from "./StaffAttendancePanel";

import { logout } from "../../state/auth/Action";

const drawerWidth = 260;

const menu = [
  { name: "Dashboard", path: "/staff/dashboard", icon: <HotelIcon /> },
  { name: "Housekeeping", path: "/staff/housekeeping", icon: <CleaningServicesIcon /> },
  { name: "Generate QR", path: "/staff/generate-qr", icon: <QrCodeIcon /> },
  { name: "Attendance", path: "/staff/attendance", icon: <QrCodeIcon /> },
];

const StaffLayout = () => {
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

  /* ================= SIDEBAR ================= */
  const drawerContent = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "rgba(0,0,0,0.9)",
        color: "white",
      }}
    >
      <Toolbar>
        <Typography variant="h6" fontWeight="bold">
          Staff Panel
        </Typography>
      </Toolbar>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

      <List sx={{ flexGrow: 1 }}>
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
        background:
          "linear-gradient(to bottom right,#020617,#000000,#111827)",
      }}
    >
      <CssBaseline />

      {/* ================= TOPBAR ================= */}
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
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h6"
            fontWeight="bold"
            noWrap
            sx={{
              fontSize: { xs: 14, sm: 16, md: 20 },
              maxWidth: { xs: "70vw", sm: "80vw", md: "100%" },
            }}
          >
            Smart Hotel Staff Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* ================= SIDEBAR ================= */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: 0 }}>
        {/* MOBILE */}
        {!isDesktop && (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              "& .MuiDrawer-paper": {
                width: 250,
                boxSizing: "border-box",
              },
            }}
          >
            {drawerContent}
          </Drawer>
        )}

        {/* DESKTOP */}
        {isDesktop && (
          <Drawer
            variant="permanent"
            open
            sx={{
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
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
          p: { xs: 1.5, sm: 2.5, md: 4 },
        }}
      >
        <Toolbar />

        {/* CENTER CONTENT CONTAINER */}
        <Container maxWidth="xl">
          <Box
            sx={{
              borderRadius: { xs: 2, md: 3 },
              bgcolor: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
              p: { xs: 2, sm: 3, md: 4 },
              minHeight: {
                xs: "calc(100vh - 90px)",
                sm: "calc(100vh - 100px)",
                md: "85vh",
              },
              boxShadow: "0 0 40px rgba(0,0,0,0.75)",
            }}
          >
            <Routes>
              <Route path="/dashboard" element={<StaffDashboard />} />
              <Route path="/housekeeping" element={<HousekeepingScreen />} />
              <Route path="/generate-qr" element={<RoomTable />} />
              <Route path="/attendance" element={<StaffAttendancePanel />} />
            </Routes>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default StaffLayout;