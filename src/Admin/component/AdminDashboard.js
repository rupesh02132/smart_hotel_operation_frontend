import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import CountUp from "react-countup";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

/* Redux Actions */
import { getAllUser, getUser } from "../../state/auth/Action";
import { getAllListings } from "../../state/listing/Action";
import { getAllBookings } from "../../state/booking/Action";
import { getAllRooms } from "../../state/room/Action";
import { fetchAdminMetrics } from "../../state/admin/Action";

/* Charts */
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  PointElement,
  LineElement,
  ArcElement,
  Legend,
} from "chart.js";

import { Bar, Line, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  PointElement,
  LineElement,
  ArcElement,
  Legend
);

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;

// Custom CSS Classes
const customStyles = `
  .glass-card {
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
  }
  
  .glass-card:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(79, 70, 229, 0.3);
    transform: translateY(-4px);
    box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.3);
  }
  
  .gradient-border {
    position: relative;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 1px;
    border-radius: 1.5rem;
  }
  
  .gradient-border > div {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 1.5rem;
  }
  
  .chart-container {
    transition: all 0.3s ease;
  }
  
  .chart-container:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.15);
  }
  
  .stat-card {
    position: relative;
    overflow: hidden;
  }
  
  .stat-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
  }
  
  .stat-card:hover::before {
    left: 100%;
  }
  
  @media (max-width: 768px) {
    .stat-value {
      font-size: 1.25rem !important;
    }
    .stat-label {
      font-size: 0.7rem !important;
    }
  }
`;

const AdminDashboardScreen = () => {
  const dispatch = useDispatch();

  const auth = useSelector((s) => s.auth || {});
  const listings = useSelector((s) => s.listings?.listings || []);
  const bookings = useSelector((s) => s.bookings?.allBookings || []);
  const rooms = useSelector((s) => s.room?.rooms || []);
  const metricsData = useSelector((s) => s.admin?.metrics || {});

  const [alerts, setAlerts] = useState([]);
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
    
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (auth?.user?.user?.role !== "admin") {
      window.location.href = "/";
    }
  }, [auth]);

  useEffect(() => {
    dispatch(getAllUser());
    dispatch(getAllListings());
    dispatch(getAllBookings());
    dispatch(getAllRooms());
    dispatch(getUser());
    dispatch(fetchAdminMetrics());

    const socket = io(SOCKET_URL, { transports: ["websocket"] });

    socket.on("roomStatusUpdated", () => dispatch(fetchAdminMetrics()));
    socket.on("newBooking", () => dispatch(fetchAdminMetrics()));
    socket.on("alert", (alert) => {
      setAlerts((prev) => [alert, ...prev].slice(0, 6));
    });

    return () => socket.disconnect();
  }, [dispatch]);

  const metrics = useMemo(() => ({
    occupied: metricsData?.occupied || 0,
    cleaning: metricsData?.cleaning || 0,
    revenueToday: metricsData?.revenueToday || 0,
    weeklyRevenue: metricsData?.weeklyRevenue || [0, 0, 0, 0, 0, 0, 0],
    cityHeatmap: metricsData?.cityHeatmap || [],
    checkInsNow: metricsData?.checkInsNow || 0,
  }), [metricsData]);

  const occupancyRate = useMemo(() => {
    if (!rooms.length) return 0;
    return Math.round((metrics.occupied / rooms.length) * 100);
  }, [rooms.length, metrics.occupied]);

  const revenueGrowth = useMemo(() => {
    if (!metrics.weeklyRevenue?.length) return 0;
    const currentWeek = metrics.weeklyRevenue.reduce((a, b) => a + b, 0);
    const lastWeek = currentWeek * 0.85;
    if (!lastWeek) return 0;
    return (((currentWeek - lastWeek) / lastWeek) * 100).toFixed(1);
  }, [metrics.weeklyRevenue]);

  const exportToExcel = () => {
    const data = bookings.map((b) => ({
      Guest: `${b.user?.firstname} ${b.user?.lastname}`,
      Hotel: b.listing?.title,
      Total: b.totalPrice,
      Paid: b.isPaid ? "Yes" : "No",
      Status: b.status,
    }));
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, "SmartHotel_Report.xlsx");
  };

  const roomStatusData = {
    labels: ["Occupied", "Cleaning", "Available"],
    datasets: [{
      data: [metrics.occupied, metrics.cleaning, Math.max(rooms.length - metrics.occupied - metrics.cleaning, 0)],
      backgroundColor: ["#ef4444", "#facc15", "#22c55e"],
      borderWidth: 0,
    }],
  };

  const revenueTrendData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{
      label: "Revenue (₹)",
      data: metrics.weeklyRevenue,
      borderColor: "#4f46e5",
      backgroundColor: "rgba(79, 70, 229, 0.1)",
      tension: 0.4,
      fill: true,
      pointBackgroundColor: "#4f46e5",
      pointBorderColor: "#fff",
      pointBorderWidth: 2,
      pointRadius: 4,
    }],
  };

  const cityHeatmapData = {
    labels: metrics.cityHeatmap.map((c) => c._id || "Unknown"),
    datasets: [{
      label: "Bookings",
      data: metrics.cityHeatmap.map((c) => c.count),
      backgroundColor: "rgba(79, 70, 229, 0.7)",
      borderRadius: 8,
    }],
  };

  const growthData = {
    labels: ["Users", "Listings", "Bookings"],
    datasets: [{
      label: "Platform Growth",
      data: [auth?.users?.users?.length || 0, listings.length, bookings.length],
      backgroundColor: ["#3b82f6", "#10b981", "#f59e0b"],
      borderRadius: 8,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: "bottom", 
        labels: { 
          usePointStyle: true, 
          boxWidth: 10,
          font: { size: window.innerWidth < 768 ? 10 : 12 }
        } 
      },
      tooltip: { 
        backgroundColor: "rgba(0,0,0,0.85)", 
        titleColor: "#fff", 
        bodyColor: "#ddd",
        padding: 10,
        cornerRadius: 8,
      }
    },
  };

  const statsData = [
    { title: "Total Users", value: auth?.users?.users?.length || 0, icon: "👥", gradient: "from-blue-500 to-cyan-500" },
    { title: "Hotels", value: listings.length, icon: "🏨", gradient: "from-green-500 to-emerald-500" },
    { title: "Bookings", value: bookings.length, icon: "📅", gradient: "from-amber-500 to-orange-500" },
    { title: "Rooms", value: rooms.length, icon: "🛏️", gradient: "from-purple-500 to-pink-500" },
    { title: "Occupied", value: metrics.occupied, icon: "🏠", gradient: "from-red-500 to-rose-500" },
    { title: "Revenue Today", value: metrics.revenueToday, prefix: "₹", icon: "💰", gradient: "from-emerald-500 to-teal-500" },
    { title: "Occupancy Rate", value: occupancyRate, suffix: "%", icon: "📊", gradient: "from-cyan-500 to-blue-500" },
  ];

  const StatCard = ({ title, value, prefix = "", suffix = "", icon, gradient }) => (
    <div className="stat-card group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300">
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
      <div className="relative p-4 sm:p-5 md:p-6">
        <div className="flex items-start justify-between mb-2">
          <div className={`text-3xl sm:text-4xl ${gradient.split(' ')[1]}`}>{icon}</div>
          <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${gradient} opacity-20`} />
        </div>
        <div className="stat-value text-xl sm:text-2xl md:text-3xl font-black text-gray-800 dark:text-white mt-2">
          <CountUp start={0} end={value || 0} duration={1.5} separator="," prefix={prefix} suffix={suffix} />
        </div>
        <div className="stat-label text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium uppercase tracking-wide">{title}</div>
        <div className={`mt-3 h-0.5 w-10 bg-gradient-to-r ${gradient} rounded-full group-hover:w-16 transition-all duration-300`} />
      </div>
    </div>
  );

  return (
    <>
      <style>{customStyles}</style>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-indigo-300 to-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30" />
        </div>

        <div className="relative max-w-7xl 2xl:max-w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8 md:mb-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full" />
                  <div className="flex items-center gap-2">
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold text-sm tracking-wide">{greeting}, Admin</span>
                    <div className="w-1 h-1 rounded-full bg-indigo-400" />
                    <span className="text-gray-500 dark:text-gray-400 text-xs font-mono">{currentTime}</span>
                  </div>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight">
                  <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    Smart Hotel
                  </span>
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {" "}Dashboard
                  </span>
                </h1>
                <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-1">Real-time hotel performance analytics and insights</p>
              </div>
              
              <button
                onClick={exportToExcel}
                className="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                Export Report
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 md:gap-5 mb-6 sm:mb-8 md:mb-10">
            {statsData.map((stat, idx) => (
              <StatCard key={idx} {...stat} />
            ))}
            
            {/* Revenue Growth Card */}
            <div className={`group relative overflow-hidden rounded-2xl p-4 sm:p-5 md:p-6 shadow-lg transition-all duration-300 ${
              revenueGrowth >= 0
                ? "bg-gradient-to-br from-emerald-500/10 to-green-600/5 border border-emerald-500/20"
                : "bg-gradient-to-br from-red-500/10 to-rose-600/5 border border-red-500/20"
            }`}>
              <div className="flex items-start justify-between mb-2">
                <span className="text-3xl sm:text-4xl">📈</span>
                <div className={`w-8 h-8 rounded-full ${revenueGrowth >= 0 ? "bg-emerald-500/20" : "bg-red-500/20"}`} />
              </div>
              <div className={`text-xl sm:text-2xl md:text-3xl font-black ${revenueGrowth >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                <CountUp start={0} end={parseFloat(revenueGrowth)} duration={1.5} suffix="%" />
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium uppercase tracking-wide">Revenue Growth</div>
              <p className="text-[10px] text-gray-400 mt-2">vs Last Week</p>
              <div className={`mt-3 h-0.5 w-10 bg-gradient-to-r ${revenueGrowth >= 0 ? "from-emerald-500 to-green-600" : "from-red-500 to-rose-600"} rounded-full group-hover:w-16 transition-all duration-300`} />
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 md:gap-8 mb-6 sm:mb-8 md:mb-10">
            {/* Room Occupancy Chart */}
            <div className="chart-container bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-5 md:p-6 shadow-xl border border-gray-100 dark:border-gray-700">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <h3 className="font-bold text-gray-800 dark:text-white text-base sm:text-lg">Room Occupancy Distribution</h3>
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-1 text-[10px] sm:text-xs"><div className="w-2 h-2 rounded-full bg-red-500"></div><span className="text-gray-600 dark:text-gray-400">Occupied</span></div>
                  <div className="flex items-center gap-1 text-[10px] sm:text-xs"><div className="w-2 h-2 rounded-full bg-yellow-500"></div><span className="text-gray-600 dark:text-gray-400">Cleaning</span></div>
                  <div className="flex items-center gap-1 text-[10px] sm:text-xs"><div className="w-2 h-2 rounded-full bg-green-500"></div><span className="text-gray-600 dark:text-gray-400">Available</span></div>
                </div>
              </div>
              <div className="h-52 sm:h-60 md:h-72">
                <Doughnut data={roomStatusData} options={chartOptions} />
              </div>
            </div>

            {/* Revenue Trend Chart */}
            <div className="chart-container bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-5 md:p-6 shadow-xl border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-gray-800 dark:text-white text-base sm:text-lg mb-4">Weekly Revenue Trend</h3>
              <div className="h-52 sm:h-60 md:h-72">
                <Line data={revenueTrendData} options={chartOptions} />
              </div>
            </div>

            {/* City Demand Chart */}
            <div className="chart-container bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-5 md:p-6 shadow-xl border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-gray-800 dark:text-white text-base sm:text-lg mb-4">City Booking Demand</h3>
              <div className="h-52 sm:h-60 md:h-72">
                <Bar data={cityHeatmapData} options={chartOptions} />
              </div>
            </div>

            {/* Platform Growth Chart */}
            <div className="chart-container bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-5 md:p-6 shadow-xl border border-gray-100 dark:border-gray-700">
              <h3 className="font-bold text-gray-800 dark:text-white text-base sm:text-lg mb-4">Platform Growth Metrics</h3>
              <div className="h-52 sm:h-60 md:h-72">
                <Bar data={growthData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Alerts Section */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 md:p-6 border-b border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <h3 className="font-bold text-gray-800 dark:text-white">Live Alerts & Notifications</h3>
                <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">Real-time</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-xs text-gray-400">Auto-refresh</div>
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              </div>
            </div>

            <div className="p-4 sm:p-5 md:p-6">
              {alerts.length === 0 ? (
                <div className="text-center py-8 sm:py-10 md:py-12">
                  <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-3">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 font-medium">No Active Alerts</p>
                  <p className="text-xs text-gray-400 mt-1">System is operating normally</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {alerts.map((a, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 sm:p-4 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-950/20 dark:to-rose-950/20 border-l-4 border-red-500 rounded-xl">
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 mt-2 bg-red-500 rounded-full" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-700 dark:text-gray-300">{a.message}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <span className="text-[10px] text-gray-400">{new Date().toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats Footer */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 rounded-xl p-3 sm:p-4 text-center border border-blue-500/20">
              <div className="text-xl sm:text-2xl font-bold text-blue-600">✨ {metrics.checkInsNow}</div>
              <div className="text-[10px] sm:text-xs text-gray-500 mt-1">Current Check-ins</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/5 rounded-xl p-3 sm:p-4 text-center border border-purple-500/20">
              <div className="text-xl sm:text-2xl font-bold text-purple-600">🏨 {listings.length}</div>
              <div className="text-[10px] sm:text-xs text-gray-500 mt-1">Active Hotels</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/5 rounded-xl p-3 sm:p-4 text-center border border-emerald-500/20">
              <div className="text-xl sm:text-2xl font-bold text-emerald-600">🛏️ {rooms.length}</div>
              <div className="text-[10px] sm:text-xs text-gray-500 mt-1">Total Rooms</div>
            </div>
            <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 rounded-xl p-3 sm:p-4 text-center border border-amber-500/20">
              <div className="text-xl sm:text-2xl font-bold text-amber-600">📅 {bookings.length}</div>
              <div className="text-[10px] sm:text-xs text-gray-500 mt-1">Total Bookings</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboardScreen;