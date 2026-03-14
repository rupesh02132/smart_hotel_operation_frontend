import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

/* Room Actions */
import { getAllRooms } from "../state/room/Action";
import { markRoomCleaned } from "../state/housekeep/Action";

const HousekeepingScreen = () => {
  const dispatch = useDispatch();

  /* ============================
     REDUX STATE
  ============================ */
  const { room } = useSelector((state) => state);
  const rooms = room?.rooms || [];
  const loading = room?.loading;
  const error = room?.error;

  /* ============================
     LOAD ROOMS
  ============================ */
  useEffect(() => {
    dispatch(getAllRooms());
  }, [dispatch]);

  /* ============================
     FILTER CLEANING ROOMS
  ============================ */
  const cleaningRooms =
    rooms.filter((r) => r.status === "Cleaning") || [];

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
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          styles[status] || "bg-gray-500/20 text-gray-300"
        }`}
      >
        {status}
      </span>
    );
  };

  /* ============================
     UI
  ============================ */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-black to-slate-900 text-white px-6 py-10">
      {/* HEADER */}
      <div className="max-w-5xl mx-auto mb-10">
        <h1 className="text-3xl font-bold tracking-tight">
          🧹 Housekeeping Dashboard
        </h1>
        <p className="text-gray-400 mt-2">
          Manage room cleaning status and mark rooms ready for guests.
        </p>
      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-gray-400 text-center">Loading rooms...</p>
      )}

      {/* ERROR */}
      {error && (
        <p className="text-red-400 text-center">
          Failed to load rooms: {error}
        </p>
      )}

      {/* EMPTY */}
      {!loading && cleaningRooms.length === 0 && (
        <p className="text-gray-400 text-center mt-10">
          ✅ No rooms currently need cleaning.
        </p>
      )}

      {/* CLEANING ROOMS LIST */}
      <div className="max-w-5xl mx-auto space-y-4">
        {cleaningRooms.map((room) => (
          <div
            key={room._id}
            className="flex items-center justify-between rounded-2xl bg-white/5 border border-white/10 p-5 hover:bg-white/10 transition"
          >
            {/* ROOM INFO */}
            <div>
              <h3 className="text-lg font-semibold">
                Room {room.roomNumber}
              </h3>
              <p className="text-sm text-gray-400">
                Type: {room.roomType}
              </p>
            </div>

            {/* STATUS + ACTION */}
            <div className="flex items-center gap-4">
              <StatusBadge status={room.status} />

              <button
                onClick={() => handleMarkCleaned(room._id)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-semibold hover:opacity-90 transition"
              >
                Mark Cleaned ✅
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HousekeepingScreen;