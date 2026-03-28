import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import socketIOClient from "socket.io-client";

import { getAllRooms } from "../../state/room/Action";
import { getAllBookings } from "../../state/booking/Action";

const SOCKET_URL = import.meta.env?.VITE_SOCKET_URL;


const ManagerDashboard = () => {
  const dispatch = useDispatch();

  const { allBookings } = useSelector((s) => s.bookings);
  const { rooms } = useSelector((s) => s.room);

const bookingList = useMemo(() => {
  return allBookings || [];
}, [allBookings]);

const roomList = useMemo(() => {
  return rooms || [];
}, [rooms]);

  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState("");

  /* ================= INITIAL FETCH ================= */
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

  /* ================= STATS ================= */
  const totalBookings = bookingList.length;
  const checkedIn = bookingList.filter(
    (b) => b.status === "checkedIn"
  ).length;
  const revenue = bookingList.reduce(
    (acc, b) => acc + (b.totalPrice || 0),
    0
  );

  /* ================= UI ================= */
  return (
    <div className="container-fluid py-3 px-2 px-md-4">
      {/* HEADER */}
      <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between mb-4 gap-3">
        <div>
          <h2 className="fw-bold text-white mb-1">
            Manager Dashboard
          </h2>
          <p className="text-primary small m-0">
            Booking control • Revenue • Room monitoring
          </p>
        </div>

        {/* SEARCH */}
        <div style={{ maxWidth: 320, width: "100%" }}>
          <input
            placeholder="Search guest..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-control bg-dark text-white border-primary"
          />
        </div>
      </div>

      {/* STATS */}
      <div className="row g-3 mb-4">
        <Stat title="Total Bookings" value={totalBookings} />
        <Stat title="Checked-In Guests" value={checkedIn} />
        <Stat title="Revenue ₹" value={revenue} />
      </div>

      {/* ALERTS */}
      {notifications.length > 0 && (
        <div className="mb-4">
          {notifications.slice(0, 3).map((n, i) => (
            <div key={i} className="alert alert-info py-2">
              {n}
            </div>
          ))}
        </div>
      )}

      {/* GRID */}
      <div className="row g-4">
        {/* BOOKINGS */}
        <div className="col-12 col-xl-7">
          <div className="card bg-dark border-primary h-100">
            <div className="card-body">
              <h5 className="text-white mb-3">
                Recent Bookings
              </h5>

              {/* MOBILE CARDS */}
              <div className="d-xl-none">
                {filteredBookings.slice(0, 6).map((b) => (
                  <div
                    key={b._id}
                    className="card bg-black border-secondary mb-3"
                  >
                    <div className="card-body">
                      <h6 className="text-white">
                        {b.user?.firstname}
                      </h6>

                      <p className="small text-muted mb-1">
                        Room: {b.roomNumber}
                      </p>

                      <p className="text-success fw-bold">
                        ₹{b.totalPrice}
                      </p>

                      <span className="badge bg-info">
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* DESKTOP TABLE */}
              <div className="table-responsive d-none d-xl-block">
                <table className="table table-dark table-hover align-middle">
                  <thead>
                    <tr>
                      <th>Guest</th>
                      <th>Room</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredBookings.slice(0, 8).map((b) => (
                      <tr key={b._id}>
                        <td>{b.user?.firstname}</td>
                        <td>{b.roomNumber}</td>
                        <td>₹{b.totalPrice}</td>
                        <td>
                          <span className="badge bg-info">
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredBookings.length === 0 && (
                <p className="text-muted">
                  No bookings found
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ROOM STATUS */}
        <div className="col-12 col-xl-5">
          <div className="card bg-dark border-primary h-100">
            <div className="card-body">
              <h5 className="text-white mb-3">
                Room Status
              </h5>

              <ul className="list-group list-group-flush">
                {roomList.slice(0, 10).map((r) => (
                  <li
                    key={r._id}
                    className="list-group-item bg-dark text-white d-flex justify-content-between"
                  >
                    {r.title}
                    <span className="badge bg-warning">
                      {r.housekeepingStatus || "Pending"}
                    </span>
                  </li>
                ))}
              </ul>

              {roomList.length === 0 && (
                <p className="text-muted mt-2">
                  No rooms data
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;

/* ================= STAT ================= */
const Stat = ({ title, value }) => (
  <div className="col-12 col-sm-6 col-lg-4">
    <div className="card bg-dark border-primary text-white h-100">
      <div className="card-body">
        <p className="small text-primary m-0">{title}</p>
        <h3 className="fw-bold mt-1">{value}</h3>
      </div>
    </div>
  </div>
);