import { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";

import {
  getHousekeepingTasksAction,
  markRoomCleaned,
} from "../../state/housekeep/Action";

const StaffDashboard = () => {
  const dispatch = useDispatch();
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;
  const { tasksLoading, tasks, tasksError, cleanLoading } =
    useSelector((state) => state.housekeeping);

  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(getHousekeepingTasksAction());
  }, [dispatch]);

  useEffect(() => {
    const socket = socketIOClient(SOCKET_URL);

    

    socket.emit("joinStaff");

    socket.on("newCleaningTask", (data) => {
      setNotifications((p) => [
        `New cleaning task → Room ${data.roomNumber}`,
        ...p,
      ]);
      dispatch(getHousekeepingTasksAction());
    });

    socket.on("roomStatusUpdated", () => {
      dispatch(getHousekeepingTasksAction());
    });

    return () => socket.disconnect();
  }, [dispatch]);

  const markCleanHandler = async (id) => {
    await dispatch(markRoomCleaned(id));
    dispatch(getHousekeepingTasksAction());
  };

  const tasksArray = Array.isArray(tasks) ? tasks : [];

  const filteredTasks = tasksArray.filter((t) =>
    (t.room?.roomNumber || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const total = tasksArray.length;
  const completed = tasksArray.filter(
    (t) => t.room?.status === "Ready"
  ).length;
  const pending = total - completed;

  return (
    <div className="container-fluid px-2 px-md-4 py-3">
      {/* HEADER */}
      <div className="row align-items-center mb-4">
        <div className="col-12 col-lg-6 mb-3 mb-lg-0">
          <h2 className="fw-bold text-white">
            Staff Housekeeping Dashboard
          </h2>
          <p className="text-success small m-0">
            Real-time room cleaning management
          </p>
        </div>

       <div className="col-12 col-sm-6 col-lg-3 ms-lg-auto">
  <input
    type="text"
    placeholder="Search room..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="form-control bg-dark text-white border-success placeholder-light"
    style={{
      backgroundColor: "#111",
      color: "#fff",
    }}
  />
</div>
      </div>

      {/* STATS */}
      <div className="row g-3 mb-4">
        <StatCard title="Total Tasks" value={total} />
        <StatCard title="Pending" value={pending} />
        <StatCard title="Completed" value={completed} />
      </div>

      {/* ALERTS */}
      {notifications.length > 0 && (
        <div className="mb-4">
          {notifications.slice(0, 3).map((n, i) => (
            <div key={i} className="alert alert-success py-2">
              {n}
            </div>
          ))}
        </div>
      )}

      {/* MOBILE CARD VIEW */}
      <div className="d-lg-none">
        {filteredTasks.map((task) => (
          <div
            key={task.room?._id}
            className="card bg-dark text-white mb-3 border-success"
          >
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <h5>Room {task.room?.roomNumber}</h5>

                <span
                  className={`badge ${
                    task.room?.status === "Ready"
                      ? "bg-success"
                      : "bg-warning"
                  }`}
                >
                  {task.room?.status}
                </span>
              </div>

              <p className="small text-muted">
                Guest: {task.booking?.user?.fisrtname || "—"}
              </p>

              {task.room?.status !== "Ready" && (
                <button
                  disabled={cleanLoading}
                  onClick={() =>
                    markCleanHandler(task.room._id)
                  }
                  className="btn btn-success w-100"
                >
                  Mark Clean
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* DESKTOP TABLE */}
      <div className="table-responsive d-none d-lg-block">
        <table className="table table-dark table-hover align-middle">
          <thead>
            <tr>
              <th>Room</th>
              <th>Status</th>
              <th>Guest</th>
              <th>Updated</th>
              <th className="text-end">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task.room?._id}>
                <td>{task.room?.roomNumber}</td>

                <td>
                  <span
                    className={`badge ${
                      task.room?.status === "Ready"
                        ? "bg-success"
                        : "bg-warning"
                    }`}
                  >
                    {task.room?.status}
                  </span>
                </td>

                <td>{task.booking?.user?.name}</td>

                <td>
                  {task.room?.updatedAt &&
                    new Date(
                      task.room.updatedAt
                    ).toLocaleString()}
                </td>

                <td className="text-end">
                  {task.room?.status !== "Ready" && (
                    <button
                      disabled={cleanLoading}
                      onClick={() =>
                        markCleanHandler(task.room._id)
                      }
                      className="btn btn-success btn-sm"
                    >
                      Clean
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {tasksLoading && (
        <div className="text-center text-success mt-4">
          Loading tasks...
        </div>
      )}

      {tasksError && (
        <div className="alert alert-danger mt-3">
          {tasksError}
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;

const StatCard = ({ title, value }) => (
  <div className="col-12 col-sm-6 col-lg-4">
    <div className="card bg-dark border-success text-white h-100">
      <div className="card-body">
        <p className="small text-success m-0">{title}</p>
        <h3 className="fw-bold mt-1">{value}</h3>
      </div>
    </div>
  </div>
);