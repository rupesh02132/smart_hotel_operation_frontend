import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHotelAnalytics } from "../../state/analyst/Action";
import io from "socket.io-client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

import { motion } from "framer-motion";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AnalyticsDashboard = () => {
  const dispatch = useDispatch();

  const { analytics, loading, error } = useSelector(
    (state) => state.analytics
  );

  const { user } = useSelector((state) => state.auth);

  /* ===============================
     FETCH DATA
  ================================ */
  useEffect(() => {
    dispatch(fetchHotelAnalytics());
  }, [dispatch]);

  /* ===============================
     LIVE SOCKET
  ================================ */
  const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;
  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on("analyticsUpdated", () => {
      dispatch(fetchHotelAnalytics());
    });

    return () => socket.disconnect();
  }, [dispatch]);

  /* ===============================
     SAFE DATA FORMAT (NO HOOK ERROR)
  ================================ */

  const weeklyRevenueData = useMemo(() => {
    if (!analytics?.weeklyRevenue) return [];
    return analytics.weeklyRevenue.map((rev, index) => ({
      day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index],
      revenue: rev,
    }));
  }, [analytics]);

  const monthlyRevenueData = useMemo(() => {
    return analytics?.monthlyRevenue || [];
  }, [analytics]);

  const cityHeatmapData = useMemo(() => {
    if (!analytics?.cityHeatmap) return [];
    return analytics.cityHeatmap.map((c) => ({
      city: c._id || "Unknown",
      bookings: c.count,
    }));
  }, [analytics]);

  /* ===============================
     KPI TREND
  ================================ */
  const calculateTrend = (data = []) => {
    if (!data || data.length < 14) return 0;

    const current = data.slice(-7).reduce((a, b) => a + b, 0);
    const previous = data.slice(-14, -7).reduce((a, b) => a + b, 0);

    if (previous === 0) return 100;
    return (((current - previous) / previous) * 100).toFixed(1);
  };

  const revenueTrend = calculateTrend(analytics?.weeklyRevenue || []);

  /* ===============================
     EXPORT FUNCTIONS
  ================================ */
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet([analytics]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Analytics");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(data, "Hotel_Analytics.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    doc.text("Hotel Analytics Report", 14, 15);

    autoTable(doc, {
      startY: 20,
      head: [["Metric", "Value"]],
      body: [
        ["Total Revenue", analytics.totalRevenue],
        ["Total Bookings", analytics.totalBookings],
        ["Occupancy Rate", analytics.occupancyRate],
        ["Cancelled Bookings", analytics.cancelledBookings],
      ],
    });

    doc.save("Hotel_Analytics.pdf");
  };

  /* ===============================
     UI STATES
  ================================ */

  if (loading)
    return (
      <div className="flex justify-center items-center h-[70vh] text-white">
        Loading Analytics...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-[70vh] text-red-400">
        {error}
      </div>
    );

  if (!analytics) return null;

  /* ===============================
     COMPONENT
  ================================ */

  return (
    <div className="min-h-screen px-4 sm:px-6 py-10 bg-gradient-to-br from-slate-950 via-black to-indigo-950 text-white">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold">
          Smart Hotel Analytics
        </h1>

        <div className="flex gap-3">
          <button
            onClick={exportToExcel}
            className="px-4 py-2 bg-indigo-600 rounded-xl text-sm"
          >
            Export Excel
          </button>

          <button
            onClick={exportToPDF}
            className="px-4 py-2 bg-purple-600 rounded-xl text-sm"
          >
            Export PDF
          </button>
        </div>
      </div>

      {/* OCCUPANCY RING */}
      <div className="max-w-7xl mx-auto mb-12 flex justify-center">
        <div className="w-40">
          <CircularProgressbar
            value={analytics.occupancyRate}
            text={`${analytics.occupancyRate}%`}
            styles={buildStyles({
              textColor: "#fff",
              pathColor: "#22d3ee",
              trailColor: "#1e293b",
            })}
          />
          <p className="text-center mt-4 text-gray-400">
            Occupancy Rate
          </p>
        </div>
      </div>

      {/* METRICS */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">

        <MetricCard
          title="Total Revenue"
          value={`₹${analytics.totalRevenue}`}
          trend={revenueTrend}
        />

        <MetricCard
          title="Revenue Today"
          value={`₹${analytics.revenueToday}`}
        />

        <MetricCard
          title="Total Bookings"
          value={analytics.totalBookings}
        />

        <MetricCard
          title="Cancelled Bookings"
          value={analytics.cancelledBookings}
        />

        {user?.role === "admin" && (
          <MetricCard
            title="Total Refund Amount"
            value={`₹${analytics.totalRefundAmount}`}
          />
        )}
      </div>

      {/* CHARTS */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">

        <ChartCard title="Weekly Revenue">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#facc15"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Monthly Revenue">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Bar dataKey="revenue" fill="#22d3ee" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* CITY HEATMAP */}
      <div className="max-w-7xl mx-auto mt-12">
        <ChartCard title="City Booking Demand">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={cityHeatmapData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="city" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Bar dataKey="bookings" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;

/* ===============================
   COMPONENTS
================================ */

const MetricCard = ({ title, value, trend }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 shadow-xl"
  >
    <p className="text-sm text-gray-400">{title}</p>
    <div className="flex items-center mt-2">
      <p className="text-2xl font-bold text-yellow-300">
        {value}
      </p>
      {trend !== undefined && (
        <span
          className={`ml-2 text-sm font-semibold ${
            trend >= 0 ? "text-green-400" : "text-red-400"
          }`}
        >
          {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}%
        </span>
      )}
    </div>
  </motion.div>
);

const ChartCard = ({ title, children }) => (
  <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 shadow-xl">
    <h3 className="text-lg font-semibold mb-4">
      {title}
    </h3>
    {children}
  </div>
);