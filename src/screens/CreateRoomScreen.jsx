import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { createRoom } from "../state/room/Action";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Paper,
  Breadcrumbs,
  Link,
  Divider,
} from "@mui/material";
import RoomForm from "../components/RoomForm";

const CreateRoomScreen = () => {
  const { listingId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading } = useSelector(
    (state) => state.room || {}
  );

  const handleCreate = async (formData) => {
    await dispatch(createRoom(formData));
    navigate("/admin/rooms");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg,#f9fbfd 0%,#eef2f7 100%)",
        py: { xs: 3, md: 6 },
      }}
    >
      <Container maxWidth="lg">
        {/* Breadcrumb */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link
            underline="hover"
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/admin")}
          >
            Dashboard
          </Link>
          <Link
            underline="hover"
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/admin/rooms")}
          >
            Rooms
          </Link>
          <Typography color="text.primary">
            Create Room
          </Typography>
        </Breadcrumbs>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            backdropFilter: "blur(8px)",
            background:
              "rgba(255,255,255,0.95)",
            boxShadow:
              "0 15px 45px rgba(0,0,0,0.06)",
          }}
        >
          {/* Header */}
          <Box mb={3}>
            <Typography
              variant="h4"
              fontWeight={800}
              sx={{ letterSpacing: 0.3 }}
            >
              Create New Room
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              mt={1}
            >
              Add room details, pricing, amenities and
              images.
            </Typography>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Form */}
          <RoomForm
            listingId={listingId}
            onSubmit={handleCreate}
            loading={loading}
          />
        </Paper>
      </Container>
    </Box>
  );
};

export default CreateRoomScreen;