import { Container, Navbar, Nav, NavDropdown, Badge } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { logout, getUser, updateAvatar } from "../state/auth/Action";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { motion } from "framer-motion";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
// MUI
import { Box, Avatar, IconButton, Tooltip } from "@mui/material";
import HotelIcon from "@mui/icons-material/Hotel";
import NotificationsIcon from "@mui/icons-material/Notifications";
import UploadIcon from "@mui/icons-material/Upload";

/* ======================
   CONFIG MAPS
====================== */

const ROLE_THEME = {
  user: { color: "#4fc3f7" },
  host: { color: "#ffb300" },
  staff: { color: "#90a4ae" },
  manager: { color: "#26c6da" },
  admin: { color: "#ef5350" },
};

const STATUS_META = {
  Booked: { label: "Booked", color: "primary" },
  CheckedIn: { label: "Checked In", color: "success" },
  CheckedOut: { label: "Checked Out", color: "secondary" },
  Cleaning: { label: "Cleaning", color: "warning" },
  Completed: { label: "Completed", color: "dark" },
};

const MODULE_META = {
  BOOKINGS: { path: "/mybookings", label: "Bookings" },
  HOUSEKEEPING: { path: "/housekeeping", label: "Housekeeping" },
  BILLING: { path: "/billing", label: "Billing" },
  REPORTS: { path: "/reports", label: "Reports" },
  // ADMIN: { path: "/admin", label: "Admin" },
};

const ROLE_DASHBOARD = {
  user: { path: "/dashboard", label: "My Dashboard" },
  host: { path: "/host/dashboard", label: "Host Dashboard" },
  staff: { path: "/staff/dashboard", label: "Staff Dashboard" },
  manager: { path: "/manager/dashboard", label: "Manager Dashboard" },
  admin: { path: "/admin/dashboard", label: "Admin Dashboard" },
};

/* ======================
   SOCKET CONFIG
====================== */

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;

let socket;

/* ======================
   COMPONENT
====================== */

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { auth, bookings } = useSelector((state) => state);
  const user = auth?.user?.user;
  console.log("User... Role:", auth);

  const [notifications, setNotifications] = useState([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  /* 🔥 Auto-hydrate user */
  useEffect(() => {
    if (!user && localStorage.getItem("jwt")) {
      dispatch(getUser());
    }
  }, [dispatch, user]);

  /* 🔔 Real-time Socket.IO Notifications */
  useEffect(() => {
    if (!user) return;

    socket = io(SOCKET_URL, {
      auth: { token: localStorage.getItem("jwt") },
    });

    socket.on("notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => socket.disconnect();
  }, [user]);

  const handleNotificationClick = (notification) => {
    navigate("/notifications");
  };

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  const isActive = (path) => location.pathname === path;

  /* 🔥 Role-based modules */
  const allowedModules = useMemo(() => {
    if (!user) return [];

    if (user.role === "admin") return Object.keys(MODULE_META);
    if (user.role === "manager") return ["BOOKINGS", "HOUSEKEEPING", "REPORTS"];
    if (user.role === "staff") return ["HOUSEKEEPING"];
    if (user.role === "host") return ["BOOKINGS", "BILLING"];
    return ["BOOKINGS"];
  }, [user]);

  /* 🔥 Booking badge counter */
  const activeBookingCount = useMemo(() => {
    if (!bookings?.list?.length) return 0;
    return bookings.list.filter(
      (b) => b.status === "Booked" || b.status === "CheckedIn",
    ).length;
  }, [bookings]);

  /* 🔥 Latest booking status chip */
  const latestBookingStatus = useMemo(() => {
    if (!bookings?.list?.length) return null;
    return bookings.list[0].status;
  }, [bookings]);

  /* 👤 Profile Upload Handler */
  
const handleAvatarUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;
dispatch(updateAvatar(file));
};

  const themeColor = ROLE_THEME[user?.role]?.color || "#4fc3f7";
  const dashboardMeta = ROLE_DASHBOARD[user?.role];
  console.log("User Role:", user?.role);

  return (
    <motion.div
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1100,
          backdropFilter: "blur(14px)",
          background:
            "linear-gradient(135deg, rgba(15,32,39,0.85), rgba(32,58,67,0.85), rgba(44,83,100,0.85))",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
          borderBottom: `2px solid ${themeColor}`,
          transition: "all 0.4s ease",
        }}
      >
        <Navbar expand="lg" collapseOnSelect className="py-2 custom-navbar">
          <Container>
            {/* LOGO */}
            <LinkContainer to="/">
              <Navbar.Brand className="d-flex align-items-center gap-2 text-white fw-bold">
                <HotelIcon sx={{ fontSize: 30, color: themeColor }} />
                SmartHotel
              </Navbar.Brand>
            </LinkContainer>

            <Navbar.Toggle
              aria-controls="basic-navbar-nav"
              className="custom-toggler"
            />

            <Navbar.Collapse id="basic-navbar-nav" className="mobile-slide">
              <Nav className="ms-auto d-flex align-items-center gap-3">
                {/* CORE LINKS */}
                <LinkContainer to="/">
                  <Nav.Link
                    className={`nav-animated ${isActive("/") ? "active-link" : ""}`}
                  >
                    Home
                  </Nav.Link>
                </LinkContainer>

                <LinkContainer to="/map">
                  <Nav.Link
                    className={`nav-animated ${isActive("/map") ? "active-link" : ""}`}
                  >
                    Map
                  </Nav.Link>
                </LinkContainer>

                <LinkContainer to="/scanner">
                  <Nav.Link
                    className={`nav-animated ${isActive("/scanner") ? "active-link" : ""}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <QrCodeScannerIcon fontSize="medium" />

                  </Nav.Link>
                </LinkContainer>

                {/* 🎯 ROLE DASHBOARD */}
                {dashboardMeta && (
                  <LinkContainer to={dashboardMeta.path}>
                    <Nav.Link
                      className={`nav-animated ${
                        isActive(dashboardMeta.path) ? "active-link" : ""
                      }`}
                    >
                      {dashboardMeta.label}
                    </Nav.Link>
                  </LinkContainer>
                )}

                {/* BOOKINGS LINK WITH BADGE */}
                {allowedModules.includes("BOOKINGS") && (
                  <LinkContainer to="/mybookings">
                    <Nav.Link className="nav-animated position-relative">
                      Bookings
                      {activeBookingCount > 0 && (
                        <Badge bg="danger" pill className="ms-1">
                          {activeBookingCount}
                        </Badge>
                      )}
                    </Nav.Link>
                  </LinkContainer>
                )}

                {/* OTHER MODULES */}
                {allowedModules
                  .filter((m) => m !== "BOOKINGS")
                  .map((mod) => (
                    <LinkContainer to={MODULE_META[mod].path} key={mod}>
                      <Nav.Link
                        className={`nav-animated ${
                          isActive(MODULE_META[mod].path) ? "active-link" : ""
                        }`}
                      >
                        {MODULE_META[mod].label}
                      </Nav.Link>
                    </LinkContainer>
                  ))}

                {/* STATUS CHIP */}
                {latestBookingStatus && (
                  <Badge
                    bg={STATUS_META[latestBookingStatus]?.color || "secondary"}
                    className="px-3 py-2 rounded-pill shadow"
                  >
                    {STATUS_META[latestBookingStatus]?.label}
                  </Badge>
                )}

                {/* 🔔 NOTIFICATION BELL */}
                {user && (
                  <NavDropdown
                    onClick={handleNotificationClick}
                    align="end"
                    show={notificationsOpen}
                    onToggle={() => setNotificationsOpen(!notificationsOpen)}
                    title={
                      <Tooltip title="Notifications">
                        <IconButton size="small">
                          <NotificationsIcon sx={{ color: "white" }} />
                          {notifications.length > 0 && (
                            <span className="notification-dot" />
                          )}
                        </IconButton>
                      </Tooltip>
                    }
                    menuVariant="dark"
                  >
                    {notifications.length === 0 ? (
                      <NavDropdown.Item>No new notifications</NavDropdown.Item>
                    ) : (
                      notifications.map((n, i) => (
                        <NavDropdown.Item key={i}>
                          {n.message || n.text}
                        </NavDropdown.Item>
                      ))
                    )}
                  </NavDropdown>
                )}

                {/* 👤 USER AVATAR DROPDOWN */}
                {auth?.jwt ? (
                  <NavDropdown
                    id="user-menu"
                    align="end"
                    title={
                      <Box className="d-flex align-items-center gap-2">
                        <Avatar
                          src={auth.avatar || ""}
                          alt={user?.firstname}
                          sx={{ width: 34, height: 34 }}
                        />
                        <span className="nav-animated">{user?.firstname}</span>
                      </Box>
                    }
                    menuVariant="dark"
                  >
                    <LinkContainer to="/userProfile">
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>

                    <NavDropdown.Item as="label">
                      <UploadIcon fontSize="small" /> Upload Photo
                      <input type="file" hidden onChange={handleAvatarUpload} />
                    </NavDropdown.Item>

                    {/* 🎯 ROLE DASHBOARD INSIDE MENU */}
                    {dashboardMeta && (
                      <LinkContainer to={dashboardMeta.path}>
                        <NavDropdown.Item>
                          {dashboardMeta.label}
                        </NavDropdown.Item>
                      </LinkContainer>
                    )}

                    <NavDropdown.Divider />

                    <NavDropdown.Item
                      onClick={logoutHandler}
                      style={{ color: "#ff6b6b" }}
                    >
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <>
                    <LinkContainer to="/login">
                      <Nav.Link
                        className={`nav-animated ${isActive("/login") ? "active-link" : ""}`}
                      >
                        Sign In
                      </Nav.Link>
                    </LinkContainer>

                    <LinkContainer to="/register">
                      <Nav.Link className="signup-btn">Sign Up</Nav.Link>
                    </LinkContainer>
                  </>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </Box>
    </motion.div>
  );
};

export default Header;
