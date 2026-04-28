import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  staffCheckIn,
  staffCheckOut,
  getAllAttendance,
} from "../../state/attendance/Action";

import {
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Avatar,
  CircularProgress,
} from "@mui/material";

import {
  Fingerprint,
  Login,
  Logout,
  AccessTime,
  EventAvailable,
} from "@mui/icons-material";

const StaffAttendancePanel = () => {
  const dispatch = useDispatch();

  /* =========================
     SAFE REDUX STATE
  ========================= */
  const users = useSelector((state) => state.auth);
  const { attendance } = useSelector((state) => state || {});

  const userInfo = users?.user?.user || null;
  const records = attendance?.records || [];
  const loading = attendance?.loading;
  const error = attendance?.error;

  /* =========================
     FETCH DATA
  ========================= */
  useEffect(() => {
    dispatch(getAllAttendance());
  }, [dispatch]);

  /* =========================
     GUARDS
  ========================= */
  if (!userInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-gray-200 p-4">
        <Card className="w-full max-w-md rounded-2xl shadow-xl">
          <CardContent className="text-center py-12">
            <Typography variant="h6" className="text-gray-600">
              Please login first
            </Typography>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-gray-200">
        <CircularProgress className="text-indigo-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 to-gray-200 p-4">
        <Card className="w-full max-w-md rounded-2xl shadow-xl border border-red-200">
          <CardContent className="text-center py-12">
            <Typography variant="body1" className="text-red-600">
              {error}
            </Typography>
          </CardContent>
        </Card>
      </div>
    );
  }

  /* =========================
     TODAY RECORD
  ========================= */
  const today = new Date().toISOString().split("T")[0];

  const todayRecord = records.find(
    (r) =>
      r?.staff?._id === userInfo?._id &&
      new Date(r?.date).toISOString().split("T")[0] === today
  );

  const isCheckedIn = !!todayRecord;
  const isCheckedOut = !!todayRecord?.checkOutTime;

  /* =========================
     HANDLERS
  ========================= */
  const handleCheckIn = async () => {
    await dispatch(staffCheckIn());
    dispatch(getAllAttendance()); // refresh
  };

  const handleCheckOut = async () => {
    await dispatch(staffCheckOut());
    dispatch(getAllAttendance()); // refresh
  };

  const formatTime = (time) =>
    time
      ? new Date(time).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "--";

  /* =========================
     UI
  ========================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-md rounded-3xl shadow-2xl border border-white/20 bg-white/90 backdrop-blur-sm overflow-hidden transition-all duration-300 hover:shadow-indigo-200/50">
        <CardContent className="p-6 sm:p-8 space-y-6">

          {/* Header Avatar */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-md opacity-60 animate-pulse"></div>
              <Avatar
                sx={{ width: 80, height: 80, margin: "0 auto" }}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg"
              >
                <Fingerprint sx={{ fontSize: 40 }} />
              </Avatar>
            </div>
          </div>

          {/* User Info */}
          <div className="text-center space-y-1">
            <Typography
              variant="h5"
              className="font-extrabold text-gray-800 tracking-tight"
            >
              Attendance Panel
            </Typography>
            <Typography
              variant="body1"
              className="text-indigo-600 font-medium"
            >
              {userInfo?.firstname} {userInfo?.lastname}
            </Typography>
            <div className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs mt-1">
              Staff ID: {userInfo?._id?.slice(-6) || "N/A"}
            </div>
          </div>

          {/* Status Chip */}
          <div className="flex justify-center">
            {isCheckedOut ? (
              <Chip
                label="Checked Out"
                color="default"
                className="bg-gray-200 text-gray-700 font-semibold px-3 py-1"
                icon={<Logout className="text-gray-500" />}
              />
            ) : isCheckedIn ? (
              <Chip
                label="Checked In"
                color="success"
                className="bg-green-100 text-green-700 font-semibold"
                icon={<Login className="text-green-600" />}
              />
            ) : (
              <Chip
                label="Not Checked In"
                color="error"
                className="bg-red-100 text-red-700 font-semibold"
                icon={<AccessTime className="text-red-500" />}
              />
            )}
          </div>

          {/* Time Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-indigo-50 rounded-2xl p-4 text-center shadow-inner">
              <div className="flex items-center justify-center gap-1 text-indigo-600 mb-1">
                <Login fontSize="small" />
                <p className="text-xs uppercase tracking-wider font-semibold">
                  Check-In
                </p>
              </div>
              <p className="text-xl font-bold text-gray-800">
                {formatTime(todayRecord?.checkInTime)}
              </p>
            </div>

            <div className="bg-purple-50 rounded-2xl p-4 text-center shadow-inner">
              <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
                <Logout fontSize="small" />
                <p className="text-xs uppercase tracking-wider font-semibold">
                  Check-Out
                </p>
              </div>
              <p className="text-xl font-bold text-gray-800">
                {formatTime(todayRecord?.checkOutTime)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              fullWidth
              variant="contained"
              color="success"
              startIcon={<Login />}
              disabled={isCheckedIn}
              onClick={handleCheckIn}
              size="large"
              sx={{
                borderRadius: "40px",
                textTransform: "none",
                fontWeight: "bold",
                py: 1.5,
                background: "linear-gradient(135deg, #10b981, #059669)",
                "&:hover": {
                  background: "linear-gradient(135deg, #059669, #047857)",
                  transform: "scale(1.02)",
                },
                transition: "all 0.2s",
                boxShadow: "0 4px 14px rgba(16,185,129,0.3)",
              }}
            >
              Check In
            </Button>

            <Button
              fullWidth
              variant="contained"
              color="error"
              startIcon={<Logout />}
              disabled={!isCheckedIn || isCheckedOut}
              onClick={handleCheckOut}
              size="large"
              sx={{
                borderRadius: "40px",
                textTransform: "none",
                fontWeight: "bold",
                py: 1.5,
                background: "linear-gradient(135deg, #ef4444, #dc2626)",
                "&:hover": {
                  background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                  transform: "scale(1.02)",
                },
                transition: "all 0.2s",
                boxShadow: "0 4px 14px rgba(239,68,68,0.3)",
              }}
            >
              Check Out
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center pt-2">
            <Typography
              variant="caption"
              className="text-gray-400 flex items-center justify-center gap-1"
            >
              <EventAvailable sx={{ fontSize: 14 }} />
              Tap to mark your attendance
            </Typography>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffAttendancePanel;