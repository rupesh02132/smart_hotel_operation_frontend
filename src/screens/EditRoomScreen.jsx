import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getRoomById, updateRoom } from "../state/room/Action";
import { useNavigate, useParams } from "react-router-dom";
import {
  Breadcrumbs,
  Link,
  Typography,
  CircularProgress,
} from "@mui/material";
import RoomForm from "../components/RoomForm";

const EditRoomScreen = () => {
  const { roomId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const roomState = useSelector((state) => state.room || {});
  const currentRoom = roomState.room;
  const loading = roomState.loading;

  useEffect(() => {
    if (roomId) {
      dispatch(getRoomById(roomId));
    }
  }, [dispatch, roomId]);

  const handleUpdate = async (formData) => {
    await dispatch(updateRoom(roomId, formData));
    navigate("/admin/hotels/rooms");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-6 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-4">
          <Breadcrumbs className="text-sm">
            <Link
              underline="hover"
              onClick={() => navigate("/admin/hotels/rooms")}
              className="cursor-pointer text-gray-500 hover:text-indigo-600 transition"
            >
              Rooms
            </Link>
            <Typography color="text.primary" className="text-gray-800 font-medium">
              Edit Room
            </Typography>
          </Breadcrumbs>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
            <Typography variant="h5" className="font-bold text-white">
              Edit Room
            </Typography>
            <Typography variant="caption" className="text-indigo-100">
              Update room details, amenities, and images
            </Typography>
          </div>

          <div className="p-5 sm:p-6 md:p-8">
            {loading && !currentRoom ? (
              <div className="flex justify-center py-12">
                <CircularProgress className="text-indigo-500" />
              </div>
            ) : (
              currentRoom && (
                <RoomForm
                  initialData={currentRoom}
                  onSubmit={handleUpdate}
                  loading={loading}
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditRoomScreen;