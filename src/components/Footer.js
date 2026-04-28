import React from "react";
import { Container } from "react-bootstrap";
import { Box } from "@mui/material";
import { motion } from "framer-motion";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaHeart,
  FaHotel,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaCreditCard,
  FaShieldAlt,
  FaHeadset,
  FaCcVisa,
  FaCcMastercard,
  FaPaypal,
  FaGooglePay,
} from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    quickLinks: [
      { name: "Home", path: "/", icon: "🏠" },
      { name: "Hotels", path: "/", icon: "🏨" },
      { name: "Contact", path: "/contact", icon: "📞" },
    ],
    support: [
      { name: "Help Center", path: "/help", icon: "❓" },
      { name: "Privacy Policy", path: "/privacy", icon: "🔒" },
   
    ],
    social: [
      { icon: <FaFacebook />, url: "https://facebook.com", color: "#1877f2", name: "Facebook" },
      { icon: <FaTwitter />, url: "https://twitter.com", color: "#1da1f2", name: "Twitter" },
      { icon: <FaInstagram />, url: "https://instagram.com", color: "#e4405f", name: "Instagram" },
      { icon: <FaLinkedin />, url: "https://linkedin.com", color: "#0a66c2", name: "LinkedIn" },
      { icon: <FaYoutube />, url: "https://youtube.com", color: "#ff0000", name: "YouTube" },
    ],
  };

  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        position: "relative",
        background: "linear-gradient(135deg, #0a0f1f 0%, #0f172a 50%, #020617 100%)",
        color: "white",
        borderTop: "1px solid rgba(79, 195, 247, 0.3)",
        overflow: "hidden",
      }}
    >
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-32 sm:w-48 md:w-72 lg:w-96 h-32 sm:h-48 md:h-72 lg:h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-32 sm:w-48 md:w-72 lg:w-96 h-32 sm:h-48 md:h-72 lg:h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      {/* Main Footer Content */}
      <Container fluid className="relative z-10 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12">
        <div className="max-w-7xl mx-auto">
          {/* Footer Grid - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center sm:text-left"
            >
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
                <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500">
                  <FaHotel className="text-white text-lg sm:text-xl" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">
                  SmartHotel
                </h3>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4 max-w-xs mx-auto sm:mx-0">
                Smart hotel operations platform for modern hospitality management. 
                Experience luxury and comfort with our seamless booking system.
              </p>
              <div className="flex justify-center sm:justify-start gap-2 flex-wrap">
                {footerLinks.social.map((social, idx) => (
                  <motion.a
                    key={idx}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -3, scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 flex items-center justify-center hover:shadow-lg transition-all"
                    style={{ color: social.color }}
                    aria-label={social.name}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center sm:text-left"
            >
              <h6 className="text-white font-semibold text-base sm:text-lg mb-4 relative inline-block sm:inline-block">
                Quick Links
                <span className="absolute -bottom-2 left-1/2 sm:left-0 transform -translate-x-1/2 sm:translate-x-0 w-10 sm:w-12 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></span>
              </h6>
              <ul className="space-y-2">
                {footerLinks.quickLinks.map((link, idx) => (
                  <motion.li
                    key={idx}
                    whileHover={{ x: 5 }}
                    className="text-gray-400 hover:text-white transition cursor-pointer text-xs sm:text-sm"
                    onClick={() => (window.location.href = link.path)}
                  >
                    <span className="mr-2">{link.icon}</span>
                    {link.name}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Support Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center sm:text-left"
            >
              <h6 className="text-white font-semibold text-base sm:text-lg mb-4 relative inline-block sm:inline-block">
                Support
                <span className="absolute -bottom-2 left-1/2 sm:left-0 transform -translate-x-1/2 sm:translate-x-0 w-10 sm:w-12 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></span>
              </h6>
              <ul className="space-y-2">
                {footerLinks.support.map((link, idx) => (
                  <motion.li
                    key={idx}
                    whileHover={{ x: 5 }}
                    className="text-gray-400 hover:text-white transition cursor-pointer text-xs sm:text-sm"
                    onClick={() => (window.location.href = link.path)}
                  >
                    <span className="mr-2">{link.icon}</span>
                    {link.name}
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Contact & Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="text-center sm:text-left"
            >
              <h6 className="text-white font-semibold text-base sm:text-lg mb-4 relative inline-block sm:inline-block">
                Contact Info
                <span className="absolute -bottom-2 left-1/2 sm:left-0 transform -translate-x-1/2 sm:translate-x-0 w-10 sm:w-12 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></span>
              </h6>
              <div className="space-y-3">
                <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 text-gray-400 text-xs sm:text-sm">
                  <FaMapMarkerAlt className="text-blue-400 flex-shrink-0 text-sm sm:text-base" />
                  <span className="break-words">123 Luxury Street, Mumbai, India</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 text-gray-400 text-xs sm:text-sm">
                  <FaPhone className="text-green-400 flex-shrink-0 text-sm sm:text-base" />
                  <a href="tel:+918084895493" className="hover:text-white transition break-all">
                    +91-8084895493
                  </a>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 text-gray-400 text-xs sm:text-sm">
                  <FaEnvelope className="text-yellow-400 flex-shrink-0 text-sm sm:text-base" />
                  <a href="mailto:support@smarthotel.com" className="hover:text-white transition break-all">
                    support@smarthotel.com
                  </a>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 text-gray-400 text-xs sm:text-sm">
                  <FaClock className="text-purple-400 flex-shrink-0 text-sm sm:text-base" />
                  <span>24/7 Customer Support</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Features Strip - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 py-4 sm:py-6 border-t border-b border-white/10 my-4 sm:my-6">
            <div className="flex items-center justify-center gap-2 text-gray-400 text-xs sm:text-sm">
              <FaCreditCard className="text-green-400 text-sm sm:text-base" />
              <span>Secure Payments</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-400 text-xs sm:text-sm">
              <FaShieldAlt className="text-blue-400 text-sm sm:text-base" />
              <span>Data Protection</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-400 text-xs sm:text-sm">
              <FaHeadset className="text-purple-400 text-sm sm:text-base" />
              <span>24/7 Support</span>
            </div>
          </div>

          {/* Bottom Bar - Responsive */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 pt-4 sm:pt-6">
            <div className="text-center sm:text-left text-gray-500 text-[10px] sm:text-xs">
              © {currentYear} SmartHotel. All rights reserved.
            </div>
            
            <div className="text-center text-gray-500 text-[10px] sm:text-xs flex items-center justify-center gap-1">
              Made with 
              <FaHeart className="inline text-red-500 text-[10px] sm:text-xs mx-0.5 sm:mx-1 animate-pulse" /> 
              for better hospitality
            </div>

            {/* Payment Methods - Responsive */}
            <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
              <div className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded bg-white/10 text-white text-[10px] sm:text-xs">
                <FaCcVisa className="text-blue-400 text-xs sm:text-sm" />
                <span>Visa</span>
              </div>
              <div className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded bg-white/10 text-white text-[10px] sm:text-xs">
                <FaCcMastercard className="text-orange-400 text-xs sm:text-sm" />
                <span>Mastercard</span>
              </div>
              <div className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded bg-white/10 text-white text-[10px] sm:text-xs">
                <FaPaypal className="text-blue-400 text-xs sm:text-sm" />
                <span>PayPal</span>
              </div>
              <div className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded bg-white/10 text-white text-[10px] sm:text-xs">
                <FaGooglePay className="text-green-400 text-xs sm:text-sm" />
                <span>G Pay</span>
              </div>
              <div className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded bg-white/10 text-white text-[10px] sm:text-xs">
                <span className="text-xs sm:text-sm">📱</span>
                <span>UPI</span>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Decorative Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
    </Box>
  );
};

export default Footer;