import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import socketIOClient from "socket.io-client";

import { getAllListings } from "../../state/listing/Action";
import { getHostEarningsAction } from "../../state/Payment/Action";
import { getHostRoomStatusAction } from "../../state/housekeep/Action";

import ListingCard from "../../components/ListingCard";
import BookingTable from "../../Admin/component/BookingTable";
import CustomerTable from "../../Admin/component/CustomerTable";

/* ================================
   ✅ PREMIUM HOST DASHBOARD THEME
================================ */
const THEME = {
  bg: "from-slate-950 via-slate-900 to-gray-950",
  card: "bg-white/5 border border-white/10",
  accent: "text-sky-400",
  muted: "text-gray-400",
};

const HostDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* ================================
     SOCKET CONNECTION
  ================================ */
  const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;
  const socket = socketIOClient(SOCKET_URL, {
    transports: ["websocket"],
  });

  /* ================================
     ✅ REDUX STATE (FIXED)
  ================================ */

  // ✅ Logged Host ID
  const userId = useSelector((state) => state.auth?.user?.user?._id);

  // ✅ Listings
  const listings =
    useSelector((state) => state.listing?.listings?.data) || [];

  // ✅ Earnings (Correct from reducer)
  const paymentState = useSelector((state) => state.payment) || {
    earnings: 0,
  };
  const earnings = paymentState.earnings;

  // ✅ Rooms Status (Safe Selector)
  const roomState = useSelector((state) => state.hostRoomStatus) || {
    room: [],
  };
  const rooms = roomState.room;

  /* ================================
     LOCAL STATE
  ================================ */
  const [notifications, setNotifications] = useState([]);

  /* ================================
     FETCH DASHBOARD DATA
  ================================ */
  useEffect(() => {
    dispatch(getAllListings({}));
    dispatch(getHostEarningsAction());
    dispatch(getHostRoomStatusAction());
  }, [dispatch]);

  /* ================================
     FILTER HOST LISTINGS
  ================================ */
  const hostListings = listings.filter((l) => {
    const id = typeof l.user === "string" ? l.user : l.user?._id;
    return id?.toString() === userId?.toString();
  });

  /* ================================
     SOCKET LIVE EVENTS
  ================================ */
  useEffect(() => {
    socket.on("newBooking", (data) => {
      setNotifications((prev) => [
        `📌 New Booking: Room ${data.roomNumber} booked (₹${data.amount})`,
        ...prev,
      ]);

      dispatch(getHostEarningsAction());
    });

    socket.on("housekeepingUpdated", (data) => {
      setNotifications((prev) => [
        `🧹 Room ${data.roomNumber} is now ${data.status}`,
        ...prev,
      ]);

      dispatch(getHostRoomStatusAction());
    });

    return () => socket.disconnect();
  }, [dispatch]);

  /* ================================
     DASHBOARD STATS
  ================================ */
  const totalListings = hostListings.length;

  const cleaningRooms =
    rooms?.filter((r) => r.status === "Cleaning").length || 0;

  const readyRooms =
    rooms?.filter((r) => r.status === "Ready").length || 0;

  /* Navigation */
  const handleCreate = () => navigate("/host/listings/new");

  return (
    <section
      className={`min-h-screen bg-gradient-to-br ${THEME.bg} px-6 py-10`}
    >
      <div className="mx-auto max-w-7xl">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col sm:flex-row justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-bold text-white">
              🏨 Smart Host Dashboard
            </h1>
            <p className={`mt-2 text-sm ${THEME.muted}`}>
              Live Bookings • Earnings • Housekeeping Updates
            </p>
          </div>

          <button
            onClick={handleCreate}
            className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-lg hover:opacity-90 transition"
          >
            + Add New Listing
          </button>
        </div>

        {/* ================= NOTIFICATIONS ================= */}
        <NotificationPanel notifications={notifications} />

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard title="Total Listings" value={totalListings} color="sky" />
          <StatCard title="Rooms Cleaning" value={cleaningRooms} color="yellow" />
          <StatCard title="Rooms Ready" value={readyRooms} color="green" />
          <StatCard
            title="Total Earnings"
            value={`₹${earnings}`}
            color="purple"
          />
        </div>

        {/* ================= LISTINGS ================= */}
        <h2 className="text-2xl font-semibold text-white mb-6">
          Your Listings
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-14">
          {hostListings.map((listing) => (
            <div
              key={listing._id}
              className="rounded-2xl hover:-translate-y-2 transition shadow-lg"
            >
              <ListingCard listing={listing} />
            </div>
          ))}
        </div>

        {/* ================= WIDGETS ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RevenueChart />
          <HousekeepingWidget rooms={rooms} />
        </div>

        {/* ================= TABLES ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
          <BookingTable />
          <CustomerTable />
        </div>
      </div>
    </section>
  );
};

export default HostDashboard;

/* ======================================================
   COMPONENTS
====================================================== */

/* ================================
   STAT CARD
================================ */
const StatCard = ({ title, value, color }) => {
  const colors = {
    sky: "from-sky-500 to-blue-700",
    purple: "from-purple-500 to-indigo-700",
    green: "from-green-500 to-emerald-700",
    yellow: "from-yellow-400 to-orange-600",
  };

  return (
    <div
      className={`rounded-2xl p-6 text-center bg-gradient-to-br ${colors[color]} shadow-xl`}
    >
      <h3 className="text-sm text-white/80">{title}</h3>
      <p className="text-3xl font-bold text-white mt-2">{value}</p>
    </div>
  );
};

/* ================================
   NOTIFICATIONS PANEL
================================ */
const NotificationPanel = ({ notifications }) => (
  <div className="mb-10">
    <h2 className="text-xl font-semibold text-white mb-3">
      🔔 Live Notifications
    </h2>

    {notifications.length === 0 ? (
      <p className="text-gray-400">No updates yet...</p>
    ) : (
      <div className="space-y-2">
        {notifications.slice(0, 4).map((note, i) => (
          <div
            key={i}
            className="p-3 rounded-xl bg-white/5 border border-white/10"
          >
            <p className="text-white text-sm">{note}</p>
          </div>
        ))}
      </div>
    )}
  </div>
);

/* ================================
   HOUSEKEEPING WIDGET
================================ */
const HousekeepingWidget = ({ rooms }) => (
  <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
    <h2 className="text-xl font-semibold text-white mb-4">
      🧹 Housekeeping Status
    </h2>

    {rooms.length === 0 ? (
      <p className="text-gray-400">No rooms available...</p>
    ) : (
      <ul className="space-y-3">
        {rooms.slice(0, 6).map((room) => (
          <li
            key={room.roomId}
            className="flex justify-between px-4 py-3 rounded-xl bg-white/5"
          >
            <span className="text-white font-medium">
              Room {room.roomNumber}
            </span>
            <span className="text-sky-400 font-semibold">{room.status}</span>
          </li>
        ))}
      </ul>
    )}
  </div>
);

/* ================================
   SIMPLE REVENUE CHART (Demo)
================================ */
const RevenueChart = () => {
  const revenue = [20, 45, 30, 60, 80, 55, 90];

  return (
    <div className="rounded-2xl p-6 bg-white/5 border border-white/10">
      <h2 className="text-xl font-semibold text-white mb-4">
        📈 Monthly Revenue
      </h2>

      <div className="flex items-end gap-3 h-40">
        {revenue.map((val, i) => (
          <div
            key={i}
            className="flex-1 rounded-lg bg-gradient-to-t from-sky-500 to-indigo-600"
            style={{ height: `${val}%` }}
          />
        ))}
      </div>
    </div>
  );
};
