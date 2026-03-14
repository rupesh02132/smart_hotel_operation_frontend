import { useState } from "react";
import axios from "axios";

const StaffAttendance = () => {
  const [message, setMessage] = useState("");

  const checkIn = async () => {
    const res = await axios.post("/api/attendance/checkin");
    setMessage(res.data.message);
  };

  const checkOut = async () => {
    const res = await axios.post("/api/attendance/checkout");
    setMessage(res.data.message);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Staff Attendance</h2>

      <button
        onClick={checkIn}
        className="bg-green-600 text-white px-4 py-2 mr-2 rounded"
      >
        Check In
      </button>

      <button
        onClick={checkOut}
        className="bg-red-600 text-white px-4 py-2 rounded"
      >
        Check Out
      </button>

      {message && <p className="mt-4 text-blue-600">{message}</p>}
    </div>
  );
};

export default StaffAttendance;
