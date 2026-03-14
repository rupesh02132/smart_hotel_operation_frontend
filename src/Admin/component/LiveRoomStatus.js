import { useEffect, useState, useMemo } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { getAllRooms } from "../../state/room/Action";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;

const LiveRoomStatus = () => {
  const dispatch = useDispatch();
  const { rooms, loading } = useSelector((state) => state.room);

  const [liveRooms, setLiveRooms] = useState([]);

  /* ============================
     FETCH ROOMS
  ============================ */
  useEffect(() => {
    dispatch(getAllRooms());
  }, [dispatch]);

  /* ============================
     SYNC REDUX → LOCAL
  ============================ */
  useEffect(() => {
    if (rooms?.length) {
      setLiveRooms(rooms);
    }
  }, [rooms]);

  /* ============================
     SOCKET CONNECTION
  ============================ */
  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socket.on("roomStatusUpdated", ({ roomId, status }) => {
      setLiveRooms((prev) =>
        prev.map((room) =>
          room._id === roomId
            ? { ...room, status }
            : room
        )
      );
    });

    return () => socket.disconnect();
  }, []);

  /* ============================
     LIVE STATS
  ============================ */
  const stats = useMemo(() => {
    const total = liveRooms.length;
    const occupied = liveRooms.filter(r => r.status === "Occupied").length;
    const cleaning = liveRooms.filter(r => r.status === "Cleaning").length;
    const vacant = liveRooms.filter(r => r.status === "Vacant").length;
    const ready = liveRooms.filter(r => r.status === "Ready").length;

    const occupancyRate = total
      ? Math.round((occupied / total) * 100)
      : 0;

    return { total, occupied, cleaning, vacant, ready, occupancyRate };
  }, [liveRooms]);

  /* ============================
     STATUS BADGE
  ============================ */
  const StatusBadge = ({ status }) => {
    const colors = {
      Vacant: "bg-green-500/20 text-green-300",
      Ready: "bg-emerald-500/20 text-emerald-300",
      Occupied: "bg-red-500/20 text-red-300 animate-pulse",
      Cleaning: "bg-yellow-500/20 text-yellow-300",
      Maintenance: "bg-orange-500/20 text-orange-300",
      Blocked: "bg-gray-500/20 text-gray-300",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          colors[status] || "bg-gray-500/20 text-gray-300"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 shadow-xl">

      <h3 className="text-xl font-bold text-white mb-6">
        🏨 Live Smart Room Dashboard
      </h3>

      {/* ============================
         SUMMARY CARDS
      ============================ */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">

        <StatCard label="Total" value={stats.total} />
        <StatCard label="Occupied" value={stats.occupied} color="text-red-400" />
        <StatCard label="Cleaning" value={stats.cleaning} color="text-yellow-400" />
        <StatCard label="Vacant" value={stats.vacant} color="text-green-400" />
        <StatCard label="Ready" value={stats.ready} color="text-emerald-400" />

      </div>

      {/* OCCUPANCY BAR */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Occupancy Rate</span>
          <span>{stats.occupancyRate}%</span>
        </div>

        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-red-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${stats.occupancyRate}%` }}
          />
        </div>
      </div>

      {/* ============================
         ROOM LIST
      ============================ */}
      {loading && (
        <p className="text-gray-400 text-sm">Loading rooms...</p>
      )}

      {!loading && liveRooms.length === 0 && (
        <p className="text-gray-400 text-sm">
          No rooms available.
        </p>
      )}

      <div className="space-y-3">
        {liveRooms.map((room) => (
          <div
            key={room._id}
            className="flex items-center justify-between rounded-xl bg-black/40 px-4 py-3 border border-white/10 hover:bg-black/60 transition"
          >
            <div>
              <p className="text-white font-semibold">
                Room #{room.roomNumber}
              </p>
              <p className="text-xs text-gray-400">
                {room.listing?.title || "Hotel"}
              </p>
            </div>

            <StatusBadge status={room.status} />
          </div>
        ))}
      </div>
    </div>
  );
};

/* ============================
   STAT CARD COMPONENT
============================ */
const StatCard = ({ label, value, color = "text-white" }) => (
  <div className="bg-black/40 p-4 rounded-xl border border-white/10 text-center">
    <p className="text-xs text-gray-400">{label}</p>
    <p className={`text-lg font-bold ${color}`}>
      {value}
    </p>
  </div>
);

export default LiveRoomStatus;