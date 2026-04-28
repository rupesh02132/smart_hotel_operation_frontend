import { useEffect, useState, useMemo } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { getAllRooms } from "../../state/room/Action";

import {
  MeetingRoom as RoomIcon,
  Hotel as HotelIcon,
  CleaningServices as CleaningIcon,
  CheckCircle as ReadyIcon,
  Block as BlockedIcon,
  Build as MaintenanceIcon,
} from "@mui/icons-material";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;

const LiveRoomStatus = () => {
  const dispatch = useDispatch();
  const { rooms, loading } = useSelector((state) => state.room);
  const [liveRooms, setLiveRooms] = useState([]);

  useEffect(() => {
    dispatch(getAllRooms());
  }, [dispatch]);

  useEffect(() => {
    if (rooms?.length) setLiveRooms(rooms);
  }, [rooms]);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });
    socket.on("roomStatusUpdated", ({ roomId, status }) => {
      setLiveRooms((prev) =>
        prev.map((room) => (room._id === roomId ? { ...room, status } : room))
      );
    });
    return () => socket.disconnect();
  }, []);

  const stats = useMemo(() => {
    const total = liveRooms.length;
    const occupied = liveRooms.filter((r) => r.status === "Occupied").length;
    const cleaning = liveRooms.filter((r) => r.status === "Cleaning").length;
    const vacant = liveRooms.filter((r) => r.status === "Vacant").length;
    const ready = liveRooms.filter((r) => r.status === "Ready").length;
    const maintenance = liveRooms.filter((r) => r.status === "Maintenance").length;
    const blocked = liveRooms.filter((r) => r.status === "Blocked").length;
    const occupancyRate = total ? Math.round((occupied / total) * 100) : 0;
    return { total, occupied, cleaning, vacant, ready, maintenance, blocked, occupancyRate };
  }, [liveRooms]);

  const getStatusConfig = (status) => {
    const config = {
      Vacant: { label: "Vacant", color: "text-green-400", bg: "bg-green-500/20", icon: <ReadyIcon className="text-green-400" /> },
      Ready: { label: "Ready", color: "text-emerald-400", bg: "bg-emerald-500/20", icon: <ReadyIcon className="text-emerald-400" /> },
      Occupied: { label: "Occupied", color: "text-red-400", bg: "bg-red-500/20", icon: <HotelIcon className="text-red-400" />, pulse: true },
      Cleaning: { label: "Cleaning", color: "text-yellow-400", bg: "bg-yellow-500/20", icon: <CleaningIcon className="text-yellow-400" /> },
      Maintenance: { label: "Maintenance", color: "text-orange-400", bg: "bg-orange-500/20", icon: <MaintenanceIcon className="text-orange-400" /> },
      Blocked: { label: "Blocked", color: "text-gray-400", bg: "bg-gray-500/20", icon: <BlockedIcon className="text-gray-400" /> },
    };
    return config[status] || { label: status, color: "text-gray-400", bg: "bg-gray-500/20", icon: <RoomIcon /> };
  };

  const StatCard = ({ label, value, color, icon }) => (
    <div className="bg-gradient-to-br from-white/5 to-white/10 rounded-xl p-4 border border-white/10 hover:scale-105 transition-transform duration-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-400 text-xs uppercase tracking-wide">{label}</span>
        <div className="text-white/60">{icon}</div>
      </div>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
            <span className="text-indigo-400 text-xs font-semibold uppercase tracking-wider">Live Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Live Room Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Real-time room status and occupancy monitoring</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <StatCard label="Total Rooms" value={stats.total} color="text-blue-400" icon={<RoomIcon />} />
          <StatCard label="Occupied" value={stats.occupied} color="text-red-400" icon={<HotelIcon />} />
          <StatCard label="Cleaning" value={stats.cleaning} color="text-yellow-400" icon={<CleaningIcon />} />
          <StatCard label="Vacant" value={stats.vacant} color="text-green-400" icon={<ReadyIcon />} />
          <StatCard label="Ready" value={stats.ready} color="text-emerald-400" icon={<ReadyIcon />} />
        </div>

        {/* Occupancy & Maintenance Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Occupancy Rate</span>
              <span className="text-white font-semibold">{stats.occupancyRate}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-red-500 to-rose-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${stats.occupancyRate}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">{stats.occupied} of {stats.total} rooms occupied</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">Maintenance & Blocked</span>
              <span className="text-xs text-orange-400">{stats.maintenance + stats.blocked} rooms</span>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 text-center p-2 rounded-lg bg-orange-500/10">
                <p className="text-lg font-bold text-orange-400">{stats.maintenance}</p>
                <p className="text-[10px] text-gray-500">Maintenance</p>
              </div>
              <div className="flex-1 text-center p-2 rounded-lg bg-gray-500/10">
                <p className="text-lg font-bold text-gray-400">{stats.blocked}</p>
                <p className="text-[10px] text-gray-500">Blocked</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 rounded-xl p-5 border border-emerald-500/20 text-center">
            <p className="text-3xl font-bold text-emerald-400">{stats.ready}</p>
            <p className="text-xs text-gray-400 mt-1">Rooms Ready for Check-in</p>
          </div>
        </div>

        {/* Room List */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
          <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Real-time Room Status</h3>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-gray-400">Live updates</span>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-400 mt-2">Loading rooms...</p>
            </div>
          ) : liveRooms.length === 0 ? (
            <div className="p-8 text-center">
              <HotelIcon className="text-4xl text-gray-600 mx-auto mb-2" />
              <p className="text-gray-400">No rooms available</p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {liveRooms.map((room) => {
                const config = getStatusConfig(room.status);
                return (
                  <div key={room._id} className="flex items-center justify-between p-4 hover:bg-white/5 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                        <RoomIcon className="text-indigo-400 text-xl" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Room #{room.roomNumber}</p>
                        <p className="text-xs text-gray-500">{room.listing?.title || "Hotel"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${config.pulse ? "animate-pulse bg-red-500" : "bg-green-500"}`}></span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
                        {config.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="px-5 py-3 border-t border-white/10 bg-white/5 text-xs text-gray-500 flex justify-between">
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
            <span>{liveRooms.length} rooms total</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveRoomStatus;