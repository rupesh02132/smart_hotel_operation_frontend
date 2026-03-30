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
// import { nbNO } from "@mui/x-date-pickers/locales";

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
console.log("Socket URL://///", SOCKET_URL);

const AdminDashboardScreen = () => {
  const dispatch = useDispatch();

  /* ================================
     SAFE REDUX SELECTORS
  ================================= */

  const auth = useSelector((s) => s.auth || {});
  const listings = useSelector((s) => s.listings?.listings || []);
  const bookings = useSelector((s) => s.bookings?.allBookings || []);
  const rooms = useSelector((s) => s.room?.rooms || []);
  const metricsData = useSelector((s) => s.admin?.metrics || {});

  const [alerts, setAlerts] = useState([]);

  /* ================================
     ROLE GUARD
  ================================= */

  useEffect(() => {
    if (auth?.user?.user?.role !== "admin") {
      window.location.href = "/";
    }
  }, [auth]);

  /* ================================
     INITIAL LOAD + SOCKET
  ================================= */

  useEffect(() => {
    dispatch(getAllUser());
    dispatch(getAllListings());
    dispatch(getAllBookings());
    dispatch(getAllRooms());
    dispatch(getUser());
    dispatch(fetchAdminMetrics());

    const socket = io(SOCKET_URL, { transports: ["websocket"] });

    socket.on("roomStatusUpdated", () =>
      dispatch(fetchAdminMetrics())
    );

    socket.on("newBooking", () =>
      dispatch(fetchAdminMetrics())
    );

    socket.on("alert", (alert) => {
      setAlerts((prev) => [alert, ...prev].slice(0, 6));
    });

    return () => socket.disconnect();
  }, [dispatch]);

  /* ================================
     SAFE METRICS DEFAULTS
  ================================= */

  const metrics = useMemo(() => ({
    occupied: metricsData?.occupied || 0,
    cleaning: metricsData?.cleaning || 0,
    revenueToday: metricsData?.revenueToday || 0,
    weeklyRevenue: metricsData?.weeklyRevenue || [0,0,0,0,0,0,0],
    cityHeatmap: metricsData?.cityHeatmap || [],
    checkInsNow: metricsData?.checkInsNow || 0,
  }), [metricsData]);

  /* ================================
     OCCUPANCY RATE
  ================================= */

  const occupancyRate = useMemo(() => {
    if (!rooms.length) return 0;
    return Math.round((metrics.occupied / rooms.length) * 100);
  }, [rooms.length, metrics.occupied]);

  /* ================================
     REVENUE GROWTH %
  ================================= */

  const revenueGrowth = useMemo(() => {
    if (!metrics.weeklyRevenue?.length) return 0;

    const currentWeek = metrics.weeklyRevenue.reduce((a, b) => a + b, 0);

    const lastWeek = currentWeek * 0.85; // replace with backend later

    if (!lastWeek) return 0;

    return (((currentWeek - lastWeek) / lastWeek) * 100).toFixed(1);
  }, [metrics.weeklyRevenue]);

  /* ================================
     EXCEL EXPORT
  ================================= */

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

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(blob, "SmartHotel_Report.xlsx");
  };

  /* ================================
     CHART DATA
  ================================= */

  const roomStatusData = {
    labels: ["Occupied", "Cleaning", "Available"],
    datasets: [
      {
        data: [
          metrics.occupied,
          metrics.cleaning,
          Math.max(rooms.length - metrics.occupied - metrics.cleaning, 0),
        ],
        backgroundColor: ["#ef4444", "#facc15", "#22c55e"],
      },
    ],
  };

  const revenueTrendData = {
    labels: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
    datasets: [
      {
        label: "Revenue ₹",
        data: metrics.weeklyRevenue,
        borderColor: "#0f172a",
        backgroundColor: "rgba(15,23,42,0.1)",
        tension: 0.35,
        fill: true,
      },
    ],
  };

  const cityHeatmapData = {
    labels: metrics.cityHeatmap.map((c) => c._id || "Unknown"),
    datasets: [
      {
        label: "Bookings",
        data: metrics.cityHeatmap.map((c) => c.count),
        backgroundColor: "#334155",
      },
    ],
  };

  const growthData = {
    labels: ["Users", "Listings", "Bookings"],
    datasets: [
      {
        label: "Platform Growth",
        data: [
          auth?.users?.users?.length || 0,
          listings.length,
          bookings.length,
        ],
        backgroundColor: ["#1d4ed8", "#16a34a", "#f59e0b"],
      },
    ],
  };

  /* ================================
     STAT CARD
  ================================= */

  const StatCard = ({ title, value, prefix="", suffix="" }) => (
    <div className="rounded-2xl bg-slate-900 p-6 shadow-xl border border-slate-800 text-white">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="text-3xl font-bold mt-2">
        <CountUp
          start={0}
          end={value || 0}
          duration={1.5}
          separator=","
          prefix={prefix}
          suffix={suffix}
        />
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 px-6 py-10">

      <div className="flex justify-between items-center mb-10">
        <h2 className="text-4xl font-bold text-slate-800">
          Smart Hotel Admin Dashboard
        </h2>

        <button
          onClick={exportToExcel}
          className="bg-slate-900 text-white px-5 py-2 rounded-xl shadow-lg hover:bg-black transition"
        >
          Export Report
        </button>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-8 gap-6 mb-12">
        <StatCard title="Users" value={auth?.users?.users?.length || 0} />
        <StatCard title="Listings" value={listings.length} />
        <StatCard title="Bookings" value={bookings.length} />
        <StatCard title="Rooms" value={rooms.length} />
        <StatCard title="Occupied" value={metrics.occupied} />
        <StatCard title="Revenue Today" value={metrics.revenueToday} prefix="₹" />
        <StatCard title="Occupancy Rate" value={occupancyRate} suffix="%" />

        <div className={`rounded-2xl p-6 shadow-xl text-white
          ${revenueGrowth >= 0 ? "bg-emerald-600" : "bg-rose-600"}`}>
          <p className="text-sm opacity-80">Revenue Growth</p>
          <p className="text-3xl font-bold mt-2">
            <CountUp
              start={0}
              end={parseFloat(revenueGrowth)}
              duration={1.5}
              suffix="%"
            />
          </p>
          <p className="text-xs mt-1 opacity-70">vs Last Week</p>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

        <div className="bg-white rounded-2xl p-6 shadow">
          <h4 className="mb-4 font-semibold">Room Occupancy</h4>
          <Doughnut data={roomStatusData} />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow">
          <h4 className="mb-4 font-semibold">Weekly Revenue Trend</h4>
          <Line data={revenueTrendData} />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow">
          <h4 className="mb-4 font-semibold">City Demand</h4>
          <Bar data={cityHeatmapData} />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow">
          <h4 className="mb-4 font-semibold">Platform Growth</h4>
          <Bar data={growthData} />
        </div>

      </div>

      {/* ALERTS */}
      <div className="bg-white rounded-2xl p-6 shadow">
        <h4 className="mb-4 font-semibold text-gray-800">
          Live Alerts
        </h4>

        {alerts.length === 0 ? (
          <p className="text-gray-500">No alerts currently</p>
        ) : (
          <ul className="space-y-3">
            {alerts.map((a, i) => (
              <li
                key={i}
                className="bg-red-50 border-l-4 border-red-500 p-3 rounded"
              >
                {a.message}
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
};

export default AdminDashboardScreen;