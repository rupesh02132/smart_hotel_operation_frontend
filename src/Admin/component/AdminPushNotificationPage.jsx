import { useState } from "react";
import {
  Card,
  TextField,
  Button,
  MenuItem,
  Alert,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

import { api } from "../../config/api";

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

  const handleChange = (e) => {
    const { name, value, checked } = e.target;

    setForm((p) => ({
      ...p,
      [name]: name === "broadcast" ? checked : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await api.post("/api/admin/notifications", form);
      setSuccess("Notification sent successfully");

      setForm({
        user: "",
        type: "general",
        title: "",
        message: "",
        link: "",
        broadcast: false,
      });
    } catch (err) {
      alert("Failed to send notification");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-6">

      <div className="max-w-xl mx-auto">

        <Card className="p-8 rounded-3xl shadow-xl backdrop-blur bg-white/80">

          <h2 className="text-2xl font-extrabold mb-6 text-gray-800">
            Push Notification
          </h2>

          {success && (
            <Alert severity="success" className="mb-4">
              {success}
            </Alert>
          )}

          <div className="space-y-4">

            <TextField
              label="User ID (leave empty for broadcast)"
              name="user"
              value={form.user}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              select
              label="Type"
              name="type"
              value={form.type}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="booking">Booking</MenuItem>
              <MenuItem value="payment">Payment</MenuItem>
              <MenuItem value="hotel">Hotel</MenuItem>
              <MenuItem value="general">General</MenuItem>
            </TextField>

            <TextField
              label="Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Message"
              name="message"
              value={form.message}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
            />

            <TextField
              label="Redirect Link"
              name="link"
              value={form.link}
              onChange={handleChange}
              fullWidth
            />

            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                name="broadcast"
                checked={form.broadcast}
                onChange={handleChange}
              />
              Send to all users
            </label>

            <Button
              variant="contained"
              fullWidth
              size="large"
              endIcon={<SendIcon />}
              onClick={handleSubmit}
            >
              Send Notification
            </Button>

          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminPushNotificationPage;