import { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  getHousekeepingTasksAction,
  markRoomCleaned,
} from "../../state/housekeep/Action";
import {
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Chip,
  CircularProgress,
} from "@mui/material";
import {
  Search as SearchIcon,
  CleaningServices as CleaningIcon,
  CheckCircle as CheckIcon,
  Pending as PendingIcon,
  Notifications as NotifIcon,
} from "@mui/icons-material";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;

const StaffDashboard = () => {
  const dispatch = useDispatch();
  const { tasksLoading, tasks, tasksError, cleanLoading } = useSelector(
    (state) => state.housekeeping
  );

  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(getHousekeepingTasksAction());
  }, [dispatch]);

  // Socket.IO real‑time updates
  useEffect(() => {
    const socket = socketIOClient(SOCKET_URL, { transports: ["websocket"] });
    socket.emit("joinStaff");

    const refreshHandler = (data) => {
      setNotifications((prev) => [
        `New cleaning task → Room ${data.roomNumber}`,
        ...prev.slice(0, 4),
      ]);
      dispatch(getHousekeepingTasksAction());
    };

    socket.on("newCleaningTask", refreshHandler);
    socket.on("roomStatusUpdated", refreshHandler);

    return () => {
      socket.off("newCleaningTask", refreshHandler);
      socket.off("roomStatusUpdated", refreshHandler);
      socket.disconnect();
    };
  }, [dispatch]);

  const markCleanHandler = async (id) => {
    await dispatch(markRoomCleaned(id));
    dispatch(getHousekeepingTasksAction());
  };

  const tasksArray = Array.isArray(tasks) ? tasks : [];
  const filteredTasks = tasksArray.filter((t) =>
    t.room?.roomNumber?.toString().toLowerCase().includes(search.toLowerCase())
  );

  const total = tasksArray.length;
  const completed = tasksArray.filter((t) => t.room?.status === "Ready").length;
  const pending = total - completed;

  const stats = [
    { title: "Total Tasks", value: total, icon: <CleaningIcon />, color: "from-blue-500 to-cyan-500" },
    { title: "Pending", value: pending, icon: <PendingIcon />, color: "from-amber-500 to-orange-500" },
    { title: "Completed", value: completed, icon: <CheckIcon />, color: "from-emerald-500 to-green-600" },
  ];

  if (tasksLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <CircularProgress className="text-indigo-500" />
      </div>
    );
  }

  if (tasksError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
        <Card className="max-w-md w-full rounded-2xl shadow-md border border-red-200">
          <CardContent className="text-center py-8">
            <p className="text-red-600">{tasksError}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100 py-6 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full"></div>
              <span className="text-emerald-600 text-xs font-semibold uppercase tracking-wider">
                Staff Operations
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Housekeeping Dashboard
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Real‑time cleaning tasks and room status
            </p>
          </div>

          <TextField
            placeholder="Search room number..."
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-64"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon className="text-gray-400" />
                </InputAdornment>
              ),
              sx: { borderRadius: "40px", backgroundColor: "#fff" },
            }}
          />
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-r ${stat.color} rounded-2xl p-5 shadow-md hover:shadow-lg transition`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-white/80 font-semibold">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className="text-white/80 text-4xl">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Live notifications */}
        <AnimatePresence>
          {notifications.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-xl shadow-md p-3 border-l-4 border-emerald-500"
            >
              <div className="flex items-center gap-2">
                <NotifIcon className="text-emerald-500 text-sm" />
                <span className="text-xs font-semibold text-gray-700">Live updates</span>
              </div>
              <div className="mt-2 space-y-1">
                {notifications.slice(0, 3).map((n, i) => (
                  <p key={i} className="text-sm text-gray-600">
                    • {n}
                  </p>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Task list – mobile cards / desktop table */}
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
            <CleaningIcon className="text-4xl text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No cleaning tasks found</p>
          </div>
        ) : (
          <>
            {/* Mobile card view */}
            <div className="md:hidden space-y-4">
              {filteredTasks.map((task) => {
                const isReady = task.room?.status === "Ready";
                return (
                  <div
                    key={task.room?._id}
                    className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100"
                  >
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-gray-800">
                            Room {task.room?.roomNumber}
                          </h3>
                          <p className="text-sm text-gray-500 mt-0.5">
                            Guest: {task.booking?.user?.firstname || "—"}
                          </p>
                        </div>
                        <Chip
                          label={task.room?.status}
                          size="small"
                          color={isReady ? "success" : "warning"}
                          className="font-semibold"
                        />
                      </div>
                      {!isReady && (
                        <button
                          disabled={cleanLoading}
                          onClick={() => markCleanHandler(task.room._id)}
                          className="mt-3 w-full py-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-sm hover:shadow-md transition"
                        >
                          {cleanLoading ? "Cleaning..." : "Mark Clean"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop table view */}
            <div className="hidden md:block bg-white rounded-xl shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr className="text-gray-600 uppercase text-xs font-semibold">
                      <th className="px-5 py-3 text-left">Room</th>
                      <th className="px-5 py-3 text-left">Status</th>
                      <th className="px-5 py-3 text-left">Guest</th>
                      <th className="px-5 py-3 text-left">Updated</th>
                      <th className="px-5 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredTasks.map((task) => {
                      const isReady = task.room?.status === "Ready";
                      return (
                        <tr key={task.room?._id} className="hover:bg-gray-50 transition">
                          <td className="px-5 py-3 font-medium text-gray-800">
                            {task.room?.roomNumber}
                          </td>
                          <td className="px-5 py-3">
                            <Chip
                              label={task.room?.status}
                              size="small"
                              color={isReady ? "success" : "warning"}
                              className="font-semibold"
                            />
                          </td>
                          <td className="px-5 py-3 text-gray-600">
                            {task.booking?.user?.firstname || "—"}
                          </td>
                          <td className="px-5 py-3 text-gray-500 text-xs">
                            {task.room?.updatedAt
                              ? new Date(task.room.updatedAt).toLocaleString()
                              : "-"}
                          </td>
                          <td className="px-5 py-3 text-right">
                            {!isReady && (
                              <button
                                disabled={cleanLoading}
                                onClick={() => markCleanHandler(task.room._id)}
                                className="px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-semibold hover:shadow-md transition"
                              >
                                {cleanLoading ? "..." : "Clean"}
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StaffDashboard;