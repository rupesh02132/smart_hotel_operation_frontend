import { useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  TextField,
  Button,
  MenuItem,
  Alert,
  Select,
  FormControl,
  InputLabel,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import InfoIcon from "@mui/icons-material/Info";

import { api } from "../config/apiConfig";

const AdminPushNotificationPage = () => {
  const [form, setForm] = useState({
    user: "",
    type: "general",
    title: "",
    message: "",
    link: "",
    broadcast: false,
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "broadcast" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.title || !form.message) {
      setError("Please fill in both title and message");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    // Build payload – 🚀 KEY FIX: omit 'user' when broadcast is true
    const payload = {
      title: form.title,
      message: form.message,
      type: form.type,
      link: form.link,
      broadcast: form.broadcast,
    };
    if (!form.broadcast && form.user) {
      payload.user = form.user;
    }
    // If broadcast is true, we send NO user field.

    try {
      await api.post("/api/notifications", payload);
      setSuccess("Notification sent successfully!");
      setForm({
        user: "",
        type: "general",
        title: "",
        message: "",
        link: "",
        broadcast: false,
      });
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to send notification";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg mb-3">
              <NotificationsActiveIcon sx={{ fontSize: 32 }} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              Push Notification
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Send instant notifications to users (real‑time via Socket.IO)
            </p>
          </div>

          <Card className="rounded-2xl shadow-xl border-0 overflow-hidden">
            <div className="p-6">
              {success && (
                <Alert
                  severity="success"
                  className="mb-4"
                  onClose={() => setSuccess("")}
                >
                  {success}
                </Alert>
              )}
              {error && (
                <Alert
                  severity="error"
                  className="mb-4"
                  onClose={() => setError("")}
                >
                  {error}
                </Alert>
              )}

              <div className="space-y-4">
                <TextField
                  label="User ID (Optional)"
                  name="user"
                  value={form.user}
                  onChange={handleChange}
                  fullWidth
                  placeholder="Leave empty for broadcast"
                  disabled={form.broadcast}
                  InputProps={{
                    startAdornment: (
                      <PersonIcon sx={{ color: "gray", mr: 1, fontSize: 20 }} />
                    ),
                  }}
                  helperText={
                    form.broadcast
                      ? "User ID is ignored when broadcasting to all users"
                      : "Send to a specific user by their ID"
                  }
                />

                <FormControl fullWidth>
                  <InputLabel>Notification Type</InputLabel>
                  <Select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    label="Notification Type"
                  >
                    <MenuItem value="booking">📅 Booking</MenuItem>
                    <MenuItem value="payment">💰 Payment</MenuItem>
                    <MenuItem value="hotel">🏨 Hotel</MenuItem>
                    <MenuItem value="promotion">🎉 Promotion</MenuItem>
                    <MenuItem value="general">📢 General</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label="Title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  fullWidth
                  placeholder="Enter notification title"
                  required
                />

                <TextField
                  label="Message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  multiline
                  rows={4}
                  fullWidth
                  placeholder="Enter notification message"
                  required
                />

                <TextField
                  label="Redirect Link (Optional)"
                  name="link"
                  value={form.link}
                  onChange={handleChange}
                  fullWidth
                  placeholder="/bookings or https://example.com"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      name="broadcast"
                      checked={form.broadcast}
                      onChange={handleChange}
                    />
                  }
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <PeopleIcon sx={{ fontSize: 18 }} />
                      <span>Send to all users (broadcast)</span>
                    </Box>
                  }
                />

                <Box
                  sx={{
                    p: 1.5,
                    bgcolor: "rgba(100, 100, 255, 0.08)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <InfoIcon sx={{ fontSize: 18, color: "#4f46e5" }} />
                  <Typography variant="caption" color="textSecondary">
                    Notifications are delivered instantly to online users.
                    Offline users will receive them on their next login.
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  size="large"
                  endIcon={<SendIcon />}
                  onClick={handleSubmit}
                  disabled={loading}
                  sx={{
                    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                    borderRadius: "14px",
                    py: 1.5,
                    textTransform: "none",
                    fontSize: "1rem",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 10px 25px -5px rgb(79 70 229 / 0.4)",
                    },
                  }}
                >
                  {loading ? "Sending..." : "Send Notification"}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPushNotificationPage;