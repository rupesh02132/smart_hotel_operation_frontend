import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

/* MUI */
import {
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Box,
  Typography,
  Divider,
  CssBaseline,
  IconButton,
} from "@mui/material";

/* Icons */
import MenuIcon from "@mui/icons-material/Menu";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";

/* Screens */
import ManagerDashboard from "./ManagerDashboard";
import AnalyticsDashboard from "../../Admin/component/AnalyticsDashboard";

/* Responsive */
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

/* Redux Logout */
import { useDispatch } from "react-redux";
import { logout } from "../../state/auth/Action";

/* Sidebar Width */
const drawerWidth = 260;

/* Sidebar Menu */
const menu = [
  {
    name: "Dashboard",
    path: "/manager/dashboard",
    icon: <DashboardIcon />,
  },
  {
    name: "Analytics",
    path: "/manager/analytics",
    icon: <AnalyticsIcon />,
  },
 
];

const ManagerLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /* Responsive Breakpoint */
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  /* Mobile Drawer State */
  const [mobileOpen, setMobileOpen] = useState(false);

  /* Toggle Drawer */
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  /* ============================
        LOGOUT HANDLER
  ============================ */
  const logoutHandler = () => {
    dispatch(logout());
    navigate("/login");
  };

  /* ============================
        SIDEBAR CONTENT
  ============================ */
  const drawer = (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "rgba(0,0,0,0.88)",
        color: "white",
      }}
    >
      {/* BRAND */}
      <Toolbar>
        <Typography variant="h6" fontWeight="bold">
          Manager Panel
        </Typography>
      </Toolbar>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.12)" }} />

      {/* MENU */}
      <List sx={{ flexGrow: 1 }}>
        {menu.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(item.path);

                /* Close Drawer in Mobile */
                if (!isDesktop) setMobileOpen(false);
              }}
              sx={{
                px: 2,
                py: 1.4,
                "&:hover": {
                  background: "rgba(255,255,255,0.08)",
                },
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

      {/* LOGOUT SECTION */}
      <Divider sx={{ borderColor: "rgba(255,255,255,0.12)" }} />

      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={logoutHandler}
            sx={{
              px: 2,
              py: 1.4,
              "&:hover": {
                background: "rgba(239,68,68,0.20)",
              },
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

  /* ============================
        FINAL LAYOUT UI
  ============================ */
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background: "linear-gradient(to bottom right,#1e1b4b,#000,#111827)",
        color: "white",
      }}
    >
      <CssBaseline />

      {/* ================= TOPBAR ================= */}
      <AppBar
        position="fixed"
        sx={{
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(18px)",
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Toolbar>
          {/* Mobile Menu Button */}
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

          <Typography variant="h6" fontWeight="bold">
            Smart Hotel Manager Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      {/* ================= SIDEBAR ================= */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: 0 }}>
        {/* Mobile Drawer */}
        <Drawer
          variant={isDesktop ? "permanent" : "temporary"}
          open={isDesktop || mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              borderRight: "1px solid rgba(255,255,255,0.1)",
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* ================= MAIN CONTENT ================= */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        {/* Push below AppBar */}
        <Toolbar />

        {/* Page Container */}
        <Box
          sx={{
            borderRadius: "24px",
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.12)",
            p: { xs: 2, sm: 4 },
            minHeight: "85vh",
            boxShadow: "0 0 40px rgba(0,0,0,0.7)",
          }}
        >
          <Routes>
            <Route path="/dashboard" element={<ManagerDashboard />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default ManagerLayout;
