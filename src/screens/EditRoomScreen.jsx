import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getRoomById,
  updateRoom,
} from "../state/room/Action";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Paper,
  Breadcrumbs,
  Link,
} from "@mui/material";
import RoomForm from "../components/RoomForm";

const EditRoomScreen = () => {
  const { roomId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* ✅ SAFE SELECTOR */
  const roomState = useSelector(
    (state) => state.room || {}
  );

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
    <Box sx={{ minHeight: "100vh", background: "#f5f7fa", py: 6 }}>
      <Container maxWidth="lg">
        {/* Breadcrumb */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link
            underline="hover"
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/admin/dashboard") }
          >
            Dashboard
          </Link>
         
          <Typography>Edit Room</Typography>
        </Breadcrumbs>

        <Paper sx={{ p: 5, borderRadius: 3 }}>
          <Typography variant="h4" fontWeight={700} mb={4}>
            Edit Room
          </Typography>

          {loading && !currentRoom ? (
            <Box
              display="flex"
              justifyContent="center"
              py={6}
            >
              <CircularProgress />
            </Box>
          ) : (
            currentRoom && (
              <RoomForm
                initialData={currentRoom}
                onSubmit={handleUpdate}
                loading={loading}
              />
            )
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default EditRoomScreen;