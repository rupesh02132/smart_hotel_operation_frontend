import React from "react";
import { Container } from "react-bootstrap";
import { Route, Routes } from "react-router-dom";

/* LAYOUT */
import Header from "../components/Header";
import Footer from "../components/Footer";
import Chatbot from "../components/Chatbot";
import ScrollToTop from "../components/ScrollToTop";

/* SCREENS */
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
import HotelRoomsScreen from "../screens/HotelRoomsScreen.js";
import NotificationPage from "../components/NotificationPage.js";
import LoyaltyPage from "../components/LoyaltyPage.js";
const CustomerRouters = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0f172a] via-[#020617] to-black text-white overflow-x-hidden">

      {/* HEADER */}
      <div className="sticky top-0 z-50 backdrop-blur-md bg-black/40 border-b border-white/10">
        <Header />
      </div>

      <ScrollToTop />

      {/* MAIN */}
      <main className="flex-grow relative">

        {/* Glow Background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 sm:-top-40 sm:-left-40 w-[200px] sm:w-[500px] h-[200px] sm:h-[500px] bg-indigo-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 -right-20 sm:-right-40 w-[200px] sm:w-[500px] h-[200px] sm:h-[500px] bg-purple-500/20 rounded-full blur-3xl"></div>
        </div>

        {/* CONTENT */}
        <div className="relative py-3 sm:py-8 md:py-12 px-1 sm:px-3 md:px-4">

          <Container fluid className="max-w-7xl mx-auto px-0 sm:px-2 md:px-3">

            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/home" element={<HomeScreen />} />
              <Route path="/map" element={<MapScreen />} />
              <Route path="/map/:id" element={<MapScreen />} />
              <Route path="/contact" element={<ContactPage />} />

              {/* AUTH */}
              <Route path="/login" element={<LoginScreen />} />
              <Route path="/register" element={<RegisterScreen />} />
              <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
              <Route path="/verify-otp" element={<VerifyOtpScreen />} />
              <Route path="/reset-password/:token" element={<ResetPasswordScreen />} />

              {/* USER */}
              <Route path="/profile" element={<ProfileScreen />} />
              <Route path="/userProfile" element={<UserProfile />} />
              <Route path="/dashboard" element={<UserDashboardScreen />} />
              <Route path="/mybookings" element={<MyBookingsScreen />} />
              <Route path="/bookings/:bookingId" element={<BookingDetailsScreen />} />
              <Route path="/hotel/:hotelId/rooms" element={<HotelRoomsScreen />} />
              <Route path="/notifications" element={<NotificationPage />} />
              <Route path="/loyalty" element={<LoyaltyPage />} />
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
              <Route path="/scanner" element={<QrScannerScreen />} />
              <Route path="/housekeeping" element={<HousekeepingScreen />} />
              <Route path="/staff-attendance" element={<StaffAttendance />} />

              {/* FALLBACK */}
              <Route path="*" element={<HomeScreen />} />
            </Routes>

            {/* Chatbot */}
            <div className="fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50">
              <Chatbot />
            </div>

          </Container>
        </div>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};


export default CustomerRouters;