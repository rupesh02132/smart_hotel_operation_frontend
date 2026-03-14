import React from "react";
import { Container } from "react-bootstrap";
import { Route, Routes } from "react-router-dom";

/* ======================
   LAYOUT
====================== */
import Header from "../components/Header";
import Footer from "../components/Footer";
import Chatbot from "../components/Chatbot";
import ScrollToTop from "../components/ScrollToTop";

/* ======================
   SCREENS (unchanged)
====================== */
import HomeScreen from "../screens/HomeScreen";
import MapScreen from "../screens/MapScreen";
import ContactPage from "../screens/ContactPage.js";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import VerifyOtpScreen from "../screens/VerifyOtpScreen";
import ResetPasswordScreen from "../screens/ResetPasswordScreen";
import ProfileScreen from "../screens/ProfileScreen";
import UserProfile from "../screens/UserProfile.jsx";
import UserDashboardScreen from "../User/UserDashboardScreen";
import MyBookingsScreen from "../screens/MyBookingsScreen";
import BookingDetailsScreen from "../screens/BookingDetailsScreen";
import HostScreen from "../Dashboard/host/HostScreen.js";
import HostBookingsScreen from "../screens/HostBookingsScreen";
import BookingScreen from "../screens/BookingScreen.js";
import PaymentSuccess from "../Payment/PaymentSuccess";
import QrVerifyScreen from "../screens/QrVerifyScreen";
import HousekeepingScreen from "../screens/HousekeepingScreen";
import QrScannerScreen from "../screens/QrScannerScreen";
import StaffAttendance from "../screens/StaffAttendance";
import QrGenerateScreen from "../screens/QrGenerateScreen";
import QrCheckoutScreen from "../screens/QrCheckoutScreen";
import HotelRoomsScreen from "../screens/HotelRoomsScreen.js";
import NotificationPage from "../components/NotificationPage.js";

const CustomerRouters = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0f172a] via-[#020617] to-black text-white">
      {/* HEADER (FIXED / NON-SCROLLING) */}
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      {/* AUTO SCROLL */}
      <ScrollToTop />

      {/* MAIN CONTENT (SCROLLABLE) */}
      <main className="flex-grow relative z-10 overflow-x-hidden">
        {/* Glow Background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-pink-500/20 rounded-full blur-3xl"></div>
        </div>

        {/* Page Content */}
        <div className="relative py-8 sm:py-12">
          <Container className="relative z-10">
            <Routes>
              {/* CORE */}
              <Route path="/" element={<HomeScreen />} />
              <Route path="/home" element={<HomeScreen />} />
              <Route path="/map" element={<MapScreen />} />
              <Route path="/map/:id" element={<MapScreen />} />
              <Route path="/contact" element={<ContactPage />} />

              {/* AUTH */}
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/register" element={<RegisterScreen />} />
              <Route
                path="/forgot-password"
                element={<ForgotPasswordScreen />}
              />
              <Route path="/verify-otp" element={<VerifyOtpScreen />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPasswordScreen />}
              />

              {/* USER */}
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/userProfile" element={<UserProfile />} />
              <Route path="/dashboard" element={<UserDashboardScreen />} />
              <Route path="/mybookings" element={<MyBookingsScreen />} />
              <Route path="/bookings/:bookingId" element={<BookingDetailsScreen />} />
              <Route path="/hotel/:hotelId/rooms" element={<HotelRoomsScreen />} />
              <Route path="/notifications" element={<NotificationPage />} />


              {/* HOST */}
              <Route path="/host" element={<HostScreen />} />
              <Route path="/host/bookings" element={<HostBookingsScreen />} />
          

              {/* LISTINGS */}
       <Route path="/booking/:roomId" element={<BookingScreen />} />


              {/* PAYMENT */}
              <Route path="/payment/:bookingId" element={<PaymentSuccess />} />

              {/* SMART HOTEL */}
              <Route path="/checkin" element={<QrVerifyScreen />} />
              <Route path="/scan/:id" element={<QrGenerateScreen />} />
              <Route path="/checkout/:id" element={<QrCheckoutScreen />} />

              <Route path="/scanner" element={<QrScannerScreen />} />

              <Route path="/housekeeping" element={<HousekeepingScreen />} />
              <Route path="/staff-attendance" element={<StaffAttendance />} />

              {/* FALLBACK */}
              <Route path="*" element={<HomeScreen />} />
            </Routes>
            <Chatbot />
          </Container>
        </div>
      </main>

      {/* CHATBOT */}

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default CustomerRouters;
