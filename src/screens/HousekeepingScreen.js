import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

/* Room Actions */
import { getAllRooms } from "../state/room/Action";
import { markRoomCleaned } from "../state/housekeep/Action";

import {
  CleaningServices as CleaningIcon,
  Hotel as HotelIcon,
  CheckCircle as CheckIcon,
} from "@mui/icons-material";

const HousekeepingScreen = () => {
  const dispatch = useDispatch();

  /* ============================
     REDUX STATE
  ============================ */
  const { room } = useSelector((state) => state);
  const rawRooms = useMemo(() => room?.rooms || [], [room]);
  const loading = room?.loading;
  const error = room?.error;

  /* ============================
     LOAD ROOMS
  ============================ */
  useEffect(() => {
    dispatch(getAllRooms());
  }, [dispatch]);

  /* ============================
     DERIVED DATA (memoized)
  ============================ */
  const cleaningRooms = useMemo(
    () => rawRooms.filter((r) => r.status === "Cleaning"),
    [rawRooms]
  );

  const stats = useMemo(() => {
    const total = rawRooms.length;
    const cleaning = cleaningRooms.length;
    const ready = rawRooms.filter((r) => r.status === "Ready").length;
    const occupied = rawRooms.filter((r) => r.status === "Occupied").length;
    return { total, cleaning, ready, occupied };
  }, [rawRooms, cleaningRooms]);

  /* ============================
     CLEAN ACTION
  ============================ */
  const handleMarkCleaned = async (roomId) => {
    await dispatch(markRoomCleaned(roomId));
    dispatch(getAllRooms()); // refresh
  };

  /* ============================
     STATUS BADGE
  ============================ */
  const StatusBadge = ({ status }) => {
    const styles = {
      Cleaning: "bg-yellow-500/20 text-yellow-300",
      Vacant: "bg-green-500/20 text-green-300",
      Occupied: "bg-red-500/20 text-red-300",
      Ready: "bg-blue-500/20 text-blue-300",
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status] || "bg-gray-500/20 text-gray-300"}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 bg-gradient-to-b from-yellow-500 to-amber-600 rounded-full"></div>
            <span className="text-yellow-500 text-xs font-semibold uppercase tracking-wider">Housekeeping</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Housekeeping Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Manage room cleaning status and prepare rooms for guests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-xl p-4 border border-blue-500/20">
            <div className="flex items-center justify-between">
              <div><p className="text-2xl font-bold text-blue-400">{stats.total}</p><p className="text-xs text-gray-400">Total Rooms</p></div>
              <HotelIcon className="text-blue-400 text-2xl opacity-70" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-500/10 to-amber-600/5 rounded-xl p-4 border border-yellow-500/20">
            <div className="flex items-center justify-between">
              <div><p className="text-2xl font-bold text-yellow-400">{stats.cleaning}</p><p className="text-xs text-gray-400">To Clean</p></div>
              <CleaningIcon className="text-yellow-400 text-2xl opacity-70" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/5 rounded-xl p-4 border border-green-500/20">
            <div className="flex items-center justify-between">
              <div><p className="text-2xl font-bold text-green-400">{stats.ready}</p><p className="text-xs text-gray-400">Ready</p></div>
              <CheckIcon className="text-green-400 text-2xl opacity-70" />
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-500/10 to-rose-600/5 rounded-xl p-4 border border-red-500/20">
            <div className="flex items-center justify-between">
              <div><p className="text-2xl font-bold text-red-400">{stats.occupied}</p><p className="text-xs text-gray-400">Occupied</p></div>
              <HotelIcon className="text-red-400 text-2xl opacity-70" />
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 mt-2">Loading rooms...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center text-red-400">
            Failed to load rooms: {error}
          </div>
        )}

        {/* Empty State */}
        {!loading && cleaningRooms.length === 0 && !error && (
          <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
            <CleaningIcon className="text-4xl text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">✅ No rooms currently need cleaning.</p>
          </div>
        )}

        {/* Cleaning Rooms List */}
        {!loading && cleaningRooms.length > 0 && (
          <div className="space-y-4">
            <AnimatePresence>
              {cleaningRooms.map((room, idx) => (
                <motion.div
                  key={room._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl bg-white/5 border border-white/10 p-4 sm:p-5 hover:bg-white/10 transition-all"
                >
                  {/* Room Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-amber-500/20 flex items-center justify-center">
                      <CleaningIcon className="text-yellow-400 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Room {room.roomNumber}</h3>
                      <p className="text-sm text-gray-400">Type: {room.roomType}</p>
                    </div>
                  </div>

                  {/* Status + Action */}
                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <StatusBadge status={room.status} />
                    <button
                      onClick={() => handleMarkCleaned(room._id)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                    >
                      <CheckIcon className="text-sm" />
                      Mark Cleaned
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default HousekeepingScreen;