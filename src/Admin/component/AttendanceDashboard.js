import { useEffect, useState } from "react";
import axios from "axios";

const AttendanceDashboard = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    axios.get("/api/attendance").then((res) => setRecords(res.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Staff Attendance Logs</h2>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Staff</th>
            <th className="p-2">Date</th>
            <th className="p-2">Check-In</th>
            <th className="p-2">Check-Out</th>
            <th className="p-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r._id} className="border-b">
              <td className="p-2">
                {r.staff.firstname} {r.staff.lastname}
              </td>
              <td className="p-2">{r.date}</td>
              <td className="p-2">
                {r.checkInTime
                  ? new Date(r.checkInTime).toLocaleTimeString()
                  : "-"}
              </td>
              <td className="p-2">
                {r.checkOutTime
                  ? new Date(r.checkOutTime).toLocaleTimeString()
                  : "-"}
              </td>
              <td className="p-2">{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceDashboard;
