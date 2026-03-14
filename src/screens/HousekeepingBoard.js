import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL;
const socket = io(SOCKET_URL);
const HousekeepingBoard = () => {
  const [rooms, setRooms] = useState([]);

  const fetchRooms = async () => {
    const res = await axios.get("/api/listings/all");
    setRooms(res.data);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const markClean = async (id) => {
    await axios.put(`/api/listings/clean/${id}`);
    fetchRooms();
  };

useEffect(() => {
  socket.on("roomStatusUpdated", () => fetchRooms());
  return () => socket.off("roomStatusUpdated");
}, []);


  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Housekeeping Task Board</h2>

      {rooms
        .filter((r) => r.status === "Cleaning")
        .map((room) => (
          <div
            key={room._id}
            className="border p-3 mb-2 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{room.title}</p>
              <p className="text-sm text-gray-500">
                Room ID: {room._id}
              </p>
            </div>

            <button
              onClick={() => markClean(room._id)}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              Mark Cleaned
            </button>
          </div>
        ))}

      {rooms.filter((r) => r.status === "Cleaning").length === 0 && (
        <p className="text-gray-500">No rooms pending cleaning 🎉</p>
      )}
    </div>
  );
};

export default HousekeepingBoard;
