import { useEffect, useMemo, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllAttendance } from "../../state/attendance/Action";
import io from "socket.io-client";

import {
  Card, CardContent, Typography, TextField,
  Avatar, Chip, InputAdornment, IconButton,
} from "@mui/material";
import {
  Person as PersonIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  CalendarToday as CalendarIcon,
  TrendingUp as TrendingIcon,
} from "@mui/icons-material";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;

const AttendanceDashboard = () => {
  const dispatch = useDispatch();
  const { loading, error, records } = useSelector((state) => state.attendance);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const socketRef = useRef(null);

  useEffect(() => {
    dispatch(getAllAttendance());

    // Socket connection for live updates
    if (SOCKET_URL) {
      socketRef.current = io(SOCKET_URL);
      socketRef.current.on("attendanceUpdated", () => {
        dispatch(getAllAttendance());
      });
    }
    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [dispatch]);

  // Helper: get status for each date (used by calendar)
  const getDateStatus = (dateStr) => {
    const record = records.find(r => new Date(r.date).toISOString().split("T")[0] === dateStr);
    if (!record) return null;
    return record.status; // "Present" or "Half-Day"
  };

  // Calendar tile content with status tooltip
  const tileContent = ({ date, view }) => {
    if (view !== "month") return null;
    const dateStr = date.toISOString().split("T")[0];
    const status = getDateStatus(dateStr);
    if (!status) return null;
    return (
      <div className="mt-1 text-[10px] font-semibold">
        {status === "Present" ? "✅" : "⚠️"}
      </div>
    );
  };

  const tileClassName = ({ date, view }) => {
    if (view !== "month") return null;
    const dateStr = date.toISOString().split("T")[0];
    const status = getDateStatus(dateStr);
    if (!status) return "";
    return status === "Present" ? "present-day" : "halfday-day";
  };

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const name = `${r.staff?.firstname} ${r.staff?.lastname}`.toLowerCase();
      const matchSearch = name.includes(search.toLowerCase());
      const matchDate = date ? new Date(r.date).toISOString().split("T")[0] === date : true;
      return matchSearch && matchDate;
    });
  }, [records, search, date]);

  const stats = useMemo(() => {
    let present = 0, halfDay = 0, absent = 0;
    filteredRecords.forEach((r) => {
      if (r.status === "Present") present++;
      else if (r.status === "Half-Day") halfDay++;
      else absent++; // any other status like "Absent" (future)
    });
    return { total: filteredRecords.length, present, halfDay, absent };
  }, [filteredRecords]);

  const barData = [
    { name: "Present", value: stats.present, color: "#10b981" },
    { name: "Half-Day", value: stats.halfDay, color: "#f59e0b" },
    { name: "Absent", value: stats.absent, color: "#ef4444" }
  ];
  const pieData = barData.filter(d => d.value > 0);
  const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

  const getStatusColor = (status) => {
    switch (status) {
      case "Present": return "success";
      case "Half-Day": return "warning";
      default: return "error";
    }
  };

  const formatTime = (time) =>
    time ? new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "-";

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  const formatWorkHours = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return "--";
    const diff = new Date(checkOut) - new Date(checkIn);
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  const clearSearch = () => setSearch("");
  const clearDate = () => setDate("");

  const handleCalendarChange = (value) => {
    if (value) {
      const selected = value.toISOString().split("T")[0];
      setDate(selected === date ? "" : selected);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <Typography variant="h6" className="text-red-600">{error}</Typography>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-6 bg-indigo-500 rounded-full"></div>
            <span className="text-indigo-600 text-xs font-semibold uppercase">HR Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Attendance Dashboard</h1>
          <p className="text-gray-500 text-sm">Live staff attendance, check‑ins, and work hours</p>
        </div>

        {/* FILTERS */}
        <div className="flex flex-col sm:flex-row gap-3">
          <TextField
            label="Search Staff"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (<InputAdornment position="start"><SearchIcon className="text-gray-400" /></InputAdornment>),
              endAdornment: search && (<IconButton size="small" onClick={clearSearch}><ClearIcon className="text-gray-400" /></IconButton>),
            }}
          />
          <TextField
            type="date"
            label="Select Date"
            variant="outlined"
            size="small"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: (<InputAdornment position="start"><CalendarIcon className="text-gray-400" /></InputAdornment>),
              endAdornment: date && (<IconButton size="small" onClick={clearDate}><ClearIcon className="text-gray-400" /></IconButton>),
            }}
          />
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl shadow"><div className="flex justify-between"><div><p className="text-sm text-gray-500">Total Records</p><p className="text-2xl font-bold text-gray-800">{stats.total}</p></div><TrendingIcon className="text-blue-500" /></div></div>
          <div className="bg-white p-4 rounded-xl shadow"><div className="flex justify-between"><div><p className="text-sm text-gray-500">Present</p><p className="text-2xl font-bold text-green-600">{stats.present}</p></div><PersonIcon className="text-green-500" /></div></div>
          <div className="bg-white p-4 rounded-xl shadow"><div className="flex justify-between"><div><p className="text-sm text-gray-500">Half-Day</p><p className="text-2xl font-bold text-amber-600">{stats.halfDay}</p></div><PersonIcon className="text-amber-500" /></div></div>
          <div className="bg-white p-4 rounded-xl shadow"><div className="flex justify-between"><div><p className="text-sm text-gray-500">Absent</p><p className="text-2xl font-bold text-red-600">{stats.absent}</p></div><PersonIcon className="text-red-500" /></div></div>
        </div>

        {/* CALENDAR + CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar Card with status colors */}
          <Card className="rounded-xl shadow">
            <div className="px-4 py-3 border-b bg-gray-50">
              <Typography variant="subtitle1" className="font-semibold">Attendance Calendar</Typography>
              <Typography variant="caption" className="text-gray-500">Colored days show attendance status</Typography>
            </div>
            <CardContent className="p-4 flex justify-center">
              <style>{`
                .present-day {
                  background: #d1fae5 !important;
                  border-radius: 50% !important;
                  color: #065f46 !important;
                }
                .halfday-day {
                  background: #fed7aa !important;
                  border-radius: 50% !important;
                  color: #92400e !important;
                }
                .react-calendar__tile--active {
                  background: #4f46e5 !important;
                  color: white !important;
                }
                .react-calendar__tile {
                  transition: all 0.2s;
                }
                .react-calendar__tile:enabled:hover {
                  background-color: #e2e8f0;
                  border-radius: 50%;
                }
              `}</style>
              <Calendar
                onChange={handleCalendarChange}
                value={date ? new Date(date) : new Date()}
                tileClassName={tileClassName}
                tileContent={tileContent}
              />
            </CardContent>
          </Card>

          {/* Charts (unchanged) */}
          <div className="space-y-6">
            <Card className="rounded-xl shadow">
              <div className="px-4 py-3 border-b bg-gray-50"><Typography variant="subtitle1" className="font-semibold">Attendance Overview</Typography></div>
              <CardContent className="p-4">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={barData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                    <XAxis dataKey="name" /><YAxis /><Tooltip />
                    <Bar dataKey="value" radius={[8,8,0,0]}>
                      {barData.map((entry, idx) => <Cell key={`cell-${idx}`} fill={entry.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="rounded-xl shadow">
              <div className="px-4 py-3 border-b bg-gray-50"><Typography variant="subtitle1" className="font-semibold">Status Distribution</Typography></div>
              <CardContent className="p-4 flex justify-center">
                {pieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`} labelLine={false}>
                        {pieData.map((entry, idx) => <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : <div className="text-gray-400 py-12">No data</div>}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* RECORDS LIST with work hours */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-gray-800">Attendance Records</h2>
            <Chip label={`${filteredRecords.length} entries`} size="small" />
          </div>
          {filteredRecords.length === 0 ? (
            <Card className="rounded-xl shadow">
              <CardContent className="text-center py-8"><Typography className="text-gray-500">No attendance records found.</Typography></CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredRecords.map(r => (
                <Card key={r._id} className="rounded-xl shadow-sm hover:shadow transition">
                  <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="bg-indigo-100 text-indigo-600"><PersonIcon /></Avatar>
                      <div>
                        <Typography className="font-medium">{r.staff?.firstname} {r.staff?.lastname}</Typography>
                        <Typography variant="caption" className="text-gray-500">{formatDate(r.date)}</Typography>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 items-center">
                      <div className="text-sm">
                        <span className="text-gray-600">In: {formatTime(r.checkInTime)}</span><br />
                        <span className="text-gray-600">Out: {formatTime(r.checkOutTime)}</span>
                      </div>
                      <div className="text-sm font-medium text-indigo-600">
                        Work: {formatWorkHours(r.checkInTime, r.checkOutTime)}
                      </div>
                      <Chip label={r.status || "-"} color={getStatusColor(r.status)} size="small" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceDashboard;