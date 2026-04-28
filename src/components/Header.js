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
import LocationOnIcon from "@mui/icons-material/LocationOn";
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
  BILLING: { path: "/dashboard/billing", label: "Billing" },
  REPORTS: { path: "/dashboard/reports", label: "Reports" },
 
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
  const [expanded, setExpanded] = useState(false);

  const { auth, bookings } = useSelector((state) => state);
  const user = auth?.user?.user;


  const { notification } = useSelector((state) => state);
 

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

    return () => socket.disconnect();
  }, [user]);

  const logoutHandler = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
    setExpanded(false);
  };

  const isActive = (path) => location.pathname === path;

  /* 🔥 Role-based modules */
  const allowedModules = useMemo(() => {
    if (!user) return [];

    if (user.role === "admin") return Object.keys(MODULE_META);
    if (user.role === "manager") return ["BOOKINGS", "HOUSEKEEPING"];
    if (user.role === "staff") return ["HOUSEKEEPING"];
    if (user.role === "host") return ["BOOKINGS"];
    // if (user.role === "host") return ["BOOKINGS", "BILLING", "REPORTS"];
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
            "linear-gradient(135deg, rgba(15,32,39,0.95), rgba(32,58,67,0.95), rgba(44,83,100,0.95))",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
          borderBottom: `2px solid ${themeColor}`,
          transition: "all 0.4s ease",
        }}
      >
        <Navbar 
          expanded={expanded}
          onToggle={(expanded) => setExpanded(expanded)}
          expand="lg" 
          collapseOnSelect 
          className="py-2 py-sm-3 custom-navbar"
        >
          <Container fluid className="px-3 px-sm-4">
            {/* LOGO */}
            <LinkContainer to="/" onClick={() => setExpanded(false)}>
              <Navbar.Brand className="d-flex align-items-center gap-2 text-white fw-bold cursor-pointer">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <HotelIcon sx={{ fontSize: { xs: 24, sm: 28, md: 32 }, color: themeColor }} />
                </motion.div>
                <span className="fw-bold" style={{ 
                  fontSize: "clamp(1rem, 4vw, 1.5rem)",
                  background: `linear-gradient(135deg, ${themeColor}, #fff)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}>
                  SmartHotel
                </span>
              </Navbar.Brand>
            </LinkContainer>

            {/* Custom Toggle Button for Mobile */}
            <Navbar.Toggle 
              aria-controls="basic-navbar-nav" 
              className="custom-toggler border-0"
              onClick={() => setExpanded(!expanded)}
            >
              <div className="hamburger-icon">
                <span className={`bar bar1 ${expanded ? 'active' : ''}`}></span>
                <span className={`bar bar2 ${expanded ? 'active' : ''}`}></span>
                <span className={`bar bar3 ${expanded ? 'active' : ''}`}></span>
              </div>
            </Navbar.Toggle>

            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ms-auto d-flex align-items-lg-center gap-1 gap-lg-3">
                {/* CORE LINKS */}
                <LinkContainer to="/" onClick={() => setExpanded(false)}>
                  <Nav.Link
                    className={`nav-animated ${isActive("/") ? "active-link" : ""}`}
                  >
                    <span className="nav-icon">🏠</span>
                    <span className="nav-text">Home</span>
                  </Nav.Link>
                </LinkContainer>

                <LinkContainer to="/map" onClick={() => setExpanded(false)}>
                  <Nav.Link
                    className={`nav-animated ${isActive("/map") ? "active-link" : ""}`}
                  >
                    <LocationOnIcon sx={{ fontSize: { xs: 18, sm: 20, md: 22 } }} />
                    <span className="nav-text ms-1">Map</span>
                  </Nav.Link>
                </LinkContainer>

                <LinkContainer to="/scanner" onClick={() => setExpanded(false)}>
                  <Nav.Link
                    className={`nav-animated ${isActive("/scanner") ? "active-link" : ""}`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <QrCodeScannerIcon sx={{ fontSize: { xs: 18, sm: 20, md: 22 } }} />
                    <span className="nav-text">Scanner</span>
                  </Nav.Link>
                </LinkContainer>

                {/* 🎯 ROLE DASHBOARD */}
                {dashboardMeta && (
                  <LinkContainer to={dashboardMeta.path} onClick={() => setExpanded(false)}>
                    <Nav.Link
                      className={`nav-animated ${
                        isActive(dashboardMeta.path) ? "active-link" : ""
                      }`}
                    >
                      <span className="nav-icon">📊</span>
                      <span className="nav-text">{dashboardMeta.label}</span>
                    </Nav.Link>
                  </LinkContainer>
                )}

                {/* BOOKINGS LINK WITH BADGE */}
                {allowedModules.includes("BOOKINGS") && (
                  <LinkContainer to="/mybookings" onClick={() => setExpanded(false)}>
                    <Nav.Link className="nav-animated position-relative">
                      <span className="nav-icon">📅</span>
                      <span className="nav-text">Bookings</span>
                      {activeBookingCount > 0 && (
                        <Badge 
                          bg="danger" 
                          pill 
                          className="booking-badge"
                        >
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
                    <LinkContainer to={MODULE_META[mod].path} key={mod} onClick={() => setExpanded(false)}>
                      <Nav.Link
                        className={`nav-animated ${
                          isActive(MODULE_META[mod].path) ? "active-link" : ""
                        }`}
                      >
                        <span className="nav-icon">
                          {mod === "HOUSEKEEPING" ? "🧹" : "💰"}
                        </span>
                        <span className="nav-text">{MODULE_META[mod].label}</span>
                      </Nav.Link>
                    </LinkContainer>
                  ))}

                {/* STATUS CHIP - Mobile Optimized */}
                {latestBookingStatus && (
                  <div className="status-chip-wrapper">
                    <Badge
                      bg={STATUS_META[latestBookingStatus]?.color || "secondary"}
                      className="status-chip"
                    >
                      <span className="status-text">
                        {STATUS_META[latestBookingStatus]?.label}
                      </span>
                    </Badge>
                  </div>
                )}

                {/* 🔔 NOTIFICATION BELL */}
                {user && (
                  <Tooltip title="Notifications">
                    <IconButton
                      size="small"
                      onClick={() => {
                        navigate("/notifications");
                        setExpanded(false);
                        // 🔥 CLOSE MOBILE NAVBAR
                        const toggle =
                          document.querySelector(".navbar-toggler");
                        if (toggle && window.innerWidth < 992) {
                          toggle.click();
                        }
                      }}
                      sx={{ 
                        position: "relative",
                        color: "white",
                        "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                        mx: { xs: "auto", lg: 0 },
                        display: "flex",
                        my: { xs: 2, lg: 0 }
                      }}
                    >
                      <NotificationsIcon sx={{ fontSize: { xs: 22, sm: 24 } }} />

                      {notification?.notifications?.length > 0 && (
                        <span className="notification-count">
                          {notification.notifications.length > 9
                            ? "9+"
                            : notification.notifications.length}
                        </span>
                      )}
                    </IconButton>
                  </Tooltip>
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
                          sx={{ 
                            width: { xs: 36, sm: 38, md: 40 }, 
                            height: { xs: 36, sm: 38, md: 40 },
                            border: `2px solid ${themeColor}`,
                            transition: "all 0.3s"
                          }}
                        />
                        <span className="nav-text fw-semibold">{user?.firstname}</span>
                      </Box>
                    }
                    menuVariant="dark"
                    drop="down"
                  >
                    <LinkContainer to="/userProfile" onClick={() => setExpanded(false)}>
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>

                    <NavDropdown.Item as="label">
                      <UploadIcon fontSize="small" /> Upload Photo
                      <input type="file" hidden onChange={handleAvatarUpload} />
                    </NavDropdown.Item>

                    <NavDropdown.Divider />

                    <NavDropdown.Item
                      onClick={logoutHandler}
                      style={{ color: "#ff6b6b" }}
                    >
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <div className="auth-buttons">
                    <LinkContainer to="/login" onClick={() => setExpanded(false)}>
                      <Nav.Link
                        className={`login-btn ${isActive("/login") ? "active-link" : ""}`}
                      >
                        Sign In
                      </Nav.Link>
                    </LinkContainer>

                    <LinkContainer to="/register" onClick={() => setExpanded(false)}>
                      <Nav.Link className="signup-btn">Sign Up</Nav.Link>
                    </LinkContainer>
                  </div>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </Box>

      <style jsx>{`
        /* Custom Hamburger Icon */
        .hamburger-icon {
          width: 24px;
          height: 20px;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        
        .bar {
          width: 100%;
          height: 2px;
          background-color: white;
          transition: all 0.3s ease;
        }
        
        .bar1.active {
          transform: rotate(45deg) translate(5px, 5px);
        }
        
        .bar2.active {
          opacity: 0;
        }
        
        .bar3.active {
          transform: rotate(-45deg) translate(7px, -7px);
        }
        
        /* Navbar Styles */
        .custom-navbar {
          transition: all 0.3s ease;
        }
        
        .custom-navbar .nav-link {
          color: rgba(255,255,255,0.85) !important;
          transition: all 0.3s ease !important;
          padding: 10px 16px !important;
          border-radius: 10px !important;
          font-size: 14px;
          display: flex !important;
          align-items: center !important;
          gap: 10px !important;
        }
        
        .nav-icon {
          font-size: 20px;
          min-width: 24px;
        }
        
        .nav-text {
          font-size: 14px;
          font-weight: 500;
        }
        
        .custom-navbar .nav-link:hover {
          color: white !important;
          background-color: rgba(255,255,255,0.1) !important;
          transform: translateX(5px) !important;
        }
        
        .custom-navbar .active-link {
          color: ${themeColor} !important;
          background-color: rgba(79, 195, 247, 0.15) !important;
          border-left: 3px solid ${themeColor};
        }
        
        /* Mobile Styles */
        @media (max-width: 992px) {
          .custom-navbar .nav-link {
            margin: 5px 0;
            justify-content: flex-start;
            width: 100%;
          }
          
          .custom-navbar .nav-link:hover {
            transform: translateX(10px) !important;
          }
          
          .navbar-collapse {
            max-height: 80vh;
            overflow-y: auto;
            padding: 15px 0;
          }
          
          .auth-buttons {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-top: 10px;
          }
          
          .login-btn, .signup-btn {
            width: 100%;
            text-align: center;
            justify-content: center !important;
          }
          
          .status-chip-wrapper {
            width: 100%;
            margin: 10px 0;
          }
          
          .status-chip {
            width: 100%;
            text-align: center;
            padding: 8px !important;
            font-size: 12px !important;
          }
        }
        
        /* Desktop Styles */
        @media (min-width: 993px) {
          .nav-icon {
            display: none;
          }
          
          .custom-navbar .nav-link {
            padding: 8px 16px !important;
          }
          
          .custom-navbar .active-link {
            border-left: none;
            border-bottom: 2px solid ${themeColor};
          }
          
          .custom-navbar .active-link::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 50%;
            transform: translateX(-50%);
            width: 30px;
            height: 2px;
            background: ${themeColor};
            border-radius: 2px;
          }
        }
        
        /* Tablet Styles */
        @media (min-width: 768px) and (max-width: 992px) {
          .nav-text {
            font-size: 15px;
          }
          
          .custom-navbar .nav-link {
            padding: 12px 20px !important;
          }
        }
        
        /* Small Mobile Styles */
        @media (max-width: 480px) {
          .nav-icon {
            font-size: 18px;
            min-width: 22px;
          }
          
          .nav-text {
            font-size: 13px;
          }
          
          .custom-navbar .nav-link {
            padding: 10px 14px !important;
          }
        }
        
        .booking-badge {
          position: absolute;
          top: -5px;
          right: 5px;
          font-size: 10px;
          padding: 2px 6px;
          animation: pulse 2s infinite;
        }
        
        .notification-count {
          position: absolute;
          top: -4px;
          right: -4px;
          background-color: #ef5350;
          color: white;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          font-size: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: pulse 2s infinite;
        }
        
        .signup-btn {
          background: linear-gradient(135deg, ${themeColor}, ${themeColor}cc) !important;
          border-radius: 10px !important;
          font-weight: 600 !important;
        }
        
        .login-btn {
          border: 1px solid ${themeColor} !important;
          border-radius: 10px !important;
        }
        
        .signup-btn:hover, .login-btn:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2) !important;
        }
        
        .custom-toggler {
          padding: 8px 12px !important;
          border: none !important;
        }
        
        .custom-toggler:focus {
          box-shadow: none !important;
          outline: none !important;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        /* Custom Scrollbar for Mobile Menu */
        .navbar-collapse::-webkit-scrollbar {
          width: 4px;
        }
        
        .navbar-collapse::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }
        
        .navbar-collapse::-webkit-scrollbar-thumb {
          background: ${themeColor};
          border-radius: 10px;
        }
      `}</style>
    </motion.div>
  );
};

export default Header;