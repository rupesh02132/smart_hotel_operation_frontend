import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import socketIOClient from "socket.io-client";

import { getAllRooms } from "../../state/room/Action";
import { getAllBookings } from "../../state/booking/Action";

import { TextField } from "@mui/material";

const SOCKET_URL = import.meta.env?.VITE_SOCKET_URL;

const ManagerDashboard = () => {
  const dispatch = useDispatch();

  const { allBookings } = useSelector((s) => s.bookings);
  const { rooms } = useSelector((s) => s.room);
  console.log("rooms", rooms);

  const bookingList = useMemo(() => allBookings || [], [allBookings]);
  const roomList = useMemo(() => rooms || [], [rooms]);

  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState("");

  /* ================= FETCH ================= */
  useEffect(() => {
    dispatch(getAllBookings());
    dispatch(getAllRooms());
  }, [dispatch]);

  /* ================= SOCKET ================= */
  useEffect(() => {
    const socket = socketIOClient(SOCKET_URL);

    socket.emit("joinManager");

    const refresh = () => {
      dispatch(getAllBookings());
      dispatch(getAllRooms());
    };

    socket.on("newBooking", (d) => {
      setNotifications((p) => [
        `New booking → Room ${d.roomNumber}`,
        ...p,
      ]);
      refresh();
    });

    socket.on("housekeepingUpdated", refresh);
    socket.on("paymentSuccess", refresh);
    socket.on("guestCheckedIn", refresh);
    socket.on("guestCheckedOut", refresh);

    return () => socket.disconnect();
  }, [dispatch]);

  /* ================= SEARCH ================= */
  const filteredBookings = useMemo(() => {
    return bookingList.filter((b) =>
      `${b.user?.firstname || ""} ${b.user?.lastname || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [bookingList, search]);

  console.log("filteredBookings", filteredBookings);

  /* ================= STATS ================= */
  const totalBookings = bookingList.length;
  const checkedIn = bookingList.filter(
    (b) => b.status === "checkedIn"
  ).length;
  const revenue = bookingList.reduce(
    (acc, b) => acc + (b.totalPrice || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#020617] to-black p-3 md:p-6">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
            Manager Dashboard
          </h1>
          <p className="text-indigo-400 text-sm">
            Control • Revenue • Monitoring
          </p>
        </div>

        {/* MUI SEARCH */}
        <TextField
          variant="outlined"
          placeholder="Search guest..."
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{
            width: "100%",
            maxWidth: 320,
            input: { color: "#fff" },
            fieldset: { borderColor: "#6366f1" },
          }}
        />
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Stat title="Total Bookings" value={totalBookings} />
        <Stat title="Checked-In" value={checkedIn} />
        <Stat title="Revenue ₹" value={revenue} />
      </div>

      {/* NOTIFICATIONS */}
      {notifications.length > 0 && (
        <div className="space-y-2 mb-6">
          {notifications.slice(0, 3).map((n, i) => (
            <div
              key={i}
              className="bg-indigo-600/20 border border-indigo-500 text-indigo-300 px-4 py-2 rounded-lg backdrop-blur-md"
            >
              {n}
            </div>
          ))}
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* BOOKINGS */}
        <div className="xl:col-span-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-4">

          <h3 className="text-white font-semibold mb-4">
            Recent Bookings
          </h3>

          {/* MOBILE */}
          <div className="xl:hidden space-y-3">
            {filteredBookings.slice(0, 6).map((b) => (
              <div
                key={b._id}
                className="bg-black/40 border border-white/10 p-4 rounded-xl hover:scale-[1.02] transition"
              >
                <h4 className="text-white font-semibold">
                  {b.user?.firstname}
                </h4>

                <p className="text-gray-400 text-sm">
                  Room: {b.roomNumber}
                </p>

                <p className="text-green-400 font-bold">
                  ₹{b.totalPrice}
                </p>

                <span className="text-xs bg-indigo-500 px-2 py-1 rounded">
                  {b.status}
                </span>
              </div>
            ))}
          </div>

          {/* DESKTOP TABLE */}
          <div className="hidden xl:block overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-300">
              <thead className="text-xs uppercase bg-white/10">
                <tr>
                  <th className="px-4 py-3">Guest</th>
                  <th className="px-4 py-3">Room</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredBookings.slice(0, 8).map((b) => (
                  <tr
                    key={b._id}
                    className="border-b border-white/10 hover:bg-white/5"
                  >
                    <td className="px-4 py-3">
                      {b.user?.firstname}
                    </td>
                    <td className="px-4 py-3">
                      {b.room.roomNumber}
                    </td>
                    <td className="px-4 py-3 text-green-400">
                      ₹{b.totalPrice}
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-indigo-600 px-2 py-1 rounded text-xs">
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredBookings.length === 0 && (
            <p className="text-gray-400 mt-2">
              No bookings found
            </p>
          )}
        </div>

        {/* ROOM STATUS */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-4">
          <h3 className="text-white font-semibold mb-4">
            Room Status
          </h3>

          <div className="space-y-2 max-h-[400px] overflow-auto">
            {roomList.slice(0, 10).map((r) => (
              <div
                key={r._id}
                className="flex justify-between items-center bg-black/30 p-3 rounded-lg border border-white/10"
              >
                <span className="text-white text-sm">
                  {r.title}
                </span>

                <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded">
                  {r.housekeepingStatus || "Pending"}
                </span>
              </div>
            ))}
          </div>

          {roomList.length === 0 && (
            <p className="text-gray-400 mt-2">
              No rooms data
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;

/* ================= STAT ================= */
const Stat = ({ title, value }) => (
  <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-white/10 rounded-2xl p-4 shadow-lg hover:scale-105 transition">
    <p className="text-indigo-400 text-sm">{title}</p>
    <h2 className="text-white text-2xl font-bold">{value}</h2>
  </div>
);