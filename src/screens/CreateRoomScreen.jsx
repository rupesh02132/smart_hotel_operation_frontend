import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { createRoom } from "../state/room/Action";
import { useNavigate, useParams } from "react-router-dom";
import {
  Breadcrumbs,
  Link,
  Typography,
} from "@mui/material";
import RoomForm from "../components/RoomForm";

const CreateRoomScreen = () => {
  const { listingId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector((state) => state.room || {});

  const handleCreate = async (formData) => {
    await dispatch(createRoom(formData));
    navigate("/admin/rooms");
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
              Create Room
            </Typography>
          </Breadcrumbs>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
            <Typography variant="h5" className="font-bold text-white">
              Create New Room
            </Typography>
            <Typography variant="caption" className="text-indigo-100">
              Add room details, pricing, amenities, and images
            </Typography>
          </div>

          <div className="p-5 sm:p-6 md:p-8">
            <RoomForm
              listingId={listingId}
              onSubmit={handleCreate}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoomScreen;