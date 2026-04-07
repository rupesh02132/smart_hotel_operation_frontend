import React, { useState, useEffect } from "react";
import {
  Grid,
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const RoomForm = ({ listingId, initialData = null, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    listing: listingId,
    roomNumber: "",
    floor: "",
    roomType: "",
    guests: "",
    children: "",
    bedrooms: "",
    beds: "",
    baths: "",
    basePrice: "",
    amenities: "",
  });

  const [existingImages, setExistingImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([""]);

  /* ================= LOAD EDIT DATA ================= */

  useEffect(() => {
    if (initialData) {
      setFormData({
        listing: initialData.listing,
        roomNumber: initialData.roomNumber || "",
        floor: initialData.floor || "",
        roomType: initialData.roomType || "",
        guests: initialData.guests || "",
        children: initialData.children || "",
        bedrooms: initialData.bedrooms || "",
        beds: initialData.beds || "",
        baths: initialData.baths || "",
        basePrice: initialData.basePrice || "",
        amenities: initialData.amenities
          ? initialData.amenities.join(", ")
          : "",
      });

      setExistingImages(initialData.images || []);
    }
  }, [initialData]);

  /* ================= INPUT ================= */

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* ================= FILE UPLOAD ================= */

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles([...imageFiles, ...files]);
  };

  /* ================= REMOVE EXISTING IMAGE ================= */

  const removeExistingImage = (index) => {
    const updated = existingImages.filter((_, i) => i !== index);
    setExistingImages(updated);
  };

  /* ================= URL INPUT ================= */

  const handleUrlChange = (index, value) => {
    const updated = [...imageUrls];
    updated[index] = value;
    setImageUrls(updated);
  };

  const addUrlField = () => {
    setImageUrls([...imageUrls, ""]);
  };

  const removeUrlField = (index) => {
    const updated = imageUrls.filter((_, i) => i !== index);
    setImageUrls(updated);
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = (e) => {
    e.preventDefault();

    const form = new FormData();

    // Basic fields
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value);
    });

    // Existing images (important for edit)
    form.append("existingImages", JSON.stringify(existingImages));

    // New file uploads
    imageFiles.forEach((file) => {
      form.append("images", file);
    });

    // New URL images
    const validUrls = imageUrls.filter((url) => url.trim() !== "");

    if (validUrls.length > 0) {
      form.append("images", JSON.stringify(validUrls));
    }

    onSubmit(form);
  };

  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
      }}
    >
      <CardContent>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Room Number"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Beds"
                name="beds"
                value={formData.beds}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Bedrooms"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Floor"
                name="floor"
                value={formData.floor}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Guests"
                name="guests"
                value={formData.guests}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Children"
                name="children"
                value={formData.children}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Baths"
                name="baths"
                value={formData.baths}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={8} mx="auto">
              <TextField
                select
                fullWidth
                label="Room Type"
                name="roomType"
                value={formData.roomType}
                onChange={handleChange}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                }}
              >
                <MenuItem value="">Select Room Type</MenuItem>
                <MenuItem value="Single">Single</MenuItem>
                <MenuItem value="Double">Double</MenuItem>
                <MenuItem value="Deluxe">Deluxe</MenuItem>
                <MenuItem value="Suite">Suite</MenuItem>
                <MenuItem value="Family">Family</MenuItem>
                <MenuItem value="Presidential">Presidential</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Base Price"
                name="basePrice"
                type="number"
                value={formData.basePrice}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Amenities (comma separated)"
                name="amenities"
                value={formData.amenities}
                onChange={handleChange}
              />
            </Grid>

            {/* EXISTING IMAGES (EDIT MODE) */}
            {existingImages.length > 0 && (
              <Grid item xs={12}>
                <Typography fontWeight={700} mb={2}>
                  Existing Images
                </Typography>

                <Box display="flex" gap={2} flexWrap="wrap">
                  {existingImages.map((img, index) => (
                    <Box key={index} position="relative">
                      <img
                        src={img}
                        alt=""
                        width={120}
                        height={120}
                        style={{
                          objectFit: "cover",
                          borderRadius: 8,
                        }}
                      />
                      <IconButton
                        size="small"
                        color="error"
                        sx={{
                          position: "absolute",
                          top: -10,
                          right: -10,
                          background: "#fff",
                        }}
                        onClick={() => removeExistingImage(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))}
                </Box>
              </Grid>
            )}

            {/* FILE UPLOAD */}
            <Grid item xs={12}>
              <Button variant="contained" component="label">
                Upload New Images
                <input
                  hidden
                  type="file"
                  multiple
                  name="images"
                  onChange={handleFileUpload}
                />
              </Button>
            </Grid>

            {/* URL INPUT */}
            <Grid item xs={12}>
              <Typography fontWeight={700} mb={1}>
                Add Image URLs
              </Typography>

              {imageUrls.map((url, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    gap: 2,
                    mb: 2,
                    flexDirection: {
                      xs: "column",
                      sm: "row",
                    },
                  }}
                >
                  <TextField
                    fullWidth
                    label={`Image URL ${index + 1}`}
                    value={url}
                    onChange={(e) => handleUrlChange(index, e.target.value)}
                  />
                  <IconButton
                    color="error"
                    onClick={() => removeUrlField(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}

              <Button variant="outlined" onClick={addUrlField}>
                + Add Another URL
              </Button>
            </Grid>

            <Grid item xs={12}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
              >
                {loading
                  ? "Processing..."
                  : initialData
                    ? "Update Room"
                    : "Create Room"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RoomForm;
