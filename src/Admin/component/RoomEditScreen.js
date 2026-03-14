import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getRoomById, updateRoom } from "../../state/room/Action";

import {
  Card,
  CardHeader,
  TextField,
  Button,
  MenuItem,
  Select,
} from "@mui/material";

const RoomEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { room } = useSelector((store) => store);
  const rooms = room?.rooms || [];

  const existingRoom = rooms.find((r) => r._id === id);

  const [formData, setFormData] = useState({
    roomType: "",
    basePrice: "",
    guests: "",
    beds: "",
    baths: "",
    amenities: "",
  });

  useEffect(() => {
    if (!existingRoom) {
      dispatch(getRoomById(id));
    } else {
      setFormData({
        roomType: existingRoom.roomType || "",
        basePrice: existingRoom.basePrice || "",
        guests: existingRoom.guests || "",
        beds: existingRoom.beds || "",
        baths: existingRoom.baths || "",
        amenities: existingRoom.amenities?.join(", ") || "",
      });
    }
  }, [dispatch, id, existingRoom]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    dispatch(updateRoom(id, formData));
    navigate("/rooms"); // redirect back
  };

  return (
    <div className="px-6 py-6 max-w-3xl mx-auto">
      <Card sx={{ p: 3, borderRadius: 3 }}>
        <CardHeader
          title="Edit Room"
          sx={{ textAlign: "center", fontWeight: "bold" }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Select
            name="roomType"
            value={formData.roomType}
            onChange={handleChange}
            fullWidth
          >
            <MenuItem value="Standard">Standard</MenuItem>
            <MenuItem value="Deluxe">Deluxe</MenuItem>
            <MenuItem value="Suite">Suite</MenuItem>
          </Select>

          <TextField
            label="Base Price"
            name="basePrice"
            type="number"
            value={formData.basePrice}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Guests"
            name="guests"
            type="number"
            value={formData.guests}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Beds"
            name="beds"
            type="number"
            value={formData.beds}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Baths"
            name="baths"
            type="number"
            value={formData.baths}
            onChange={handleChange}
            fullWidth
          />

          <TextField
            label="Amenities (comma separated)"
            name="amenities"
            value={formData.amenities}
            onChange={handleChange}
            fullWidth
          />

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button variant="outlined" onClick={() => navigate("/rooms")}>
              Cancel
            </Button>

            <Button variant="contained" onClick={handleSubmit}>
              Update Room
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RoomEditScreen;