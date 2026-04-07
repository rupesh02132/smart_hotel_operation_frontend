import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  Paper,
  MenuItem,
  IconButton,
  Divider,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
const categories = [
  "Budget",
  "Economy",
  "Business",
  "Premium",
  "Luxury",
  "Boutique",
];

const ListingForm = ({ initialData = null, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    city: "",
    country: "",
    description: "",
    category: "Luxury",
    hotelcode: "",
    longitude: "",
    latitude: "",
  });

  /* ===============================
     FILE + URL IMAGE STATES
  =============================== */
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([""]);
  const [previews, setPreviews] = useState([]);

  /* ===============================
     PREFILL FOR EDIT
  =============================== */
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        amenities: initialData.hotelAmenities?.join(", ") || "",
        longitude: initialData.location?.coordinates?.[0] || "",
        latitude: initialData.location?.coordinates?.[1] || "",
      });

      if (initialData.images) {
        setPreviews(initialData.images);
        setImageUrls(initialData.images);
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* ===============================
     FILE UPLOAD
  =============================== */
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);

    setUploadedFiles((prev) => [...prev, ...files]);

    const newPreviews = files.map((file) =>
      URL.createObjectURL(file)
    );

    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  /* ===============================
     URL HANDLING
  =============================== */
  const handleUrlChange = (index, value) => {
    const updated = [...imageUrls];
    updated[index] = value;
    setImageUrls(updated);
  };

  const addUrlField = () => {
    setImageUrls([...imageUrls, ""]);
  };

  /* ===============================
     REMOVE IMAGE
  =============================== */
  const removeImage = (index) => {
    const updatedPreviews = previews.filter(
      (_, i) => i !== index
    );
    setPreviews(updatedPreviews);

    const updatedUrls = imageUrls.filter(
      (_, i) => i !== index
    );
    setImageUrls(updatedUrls);
  };

  /* ===============================
     SUBMIT
  =============================== */
  const handleSubmit = (e) => {
    e.preventDefault();

    const form = new FormData();

    // append text fields
    Object.keys(formData).forEach((key) => {
      form.append(key, formData[key]);
    });

    // append location
    form.append("longitude", formData.longitude);
    form.append("latitude", formData.latitude);

    // append files
    uploadedFiles.forEach((file) => {
      form.append("images", file);
    });

    // append URLs
    imageUrls
      .filter((url) => url.trim() !== "")
      .forEach((url) => {
        form.append("images", url);
      });

    onSubmit(form);
  };

  return (
    <Paper elevation={4} sx={{ p: 5, borderRadius: 4 }}>
      <Typography variant="h5" fontWeight={600} mb={4}>
        Hotel Information
      </Typography>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Hotel Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Hotel Code"
              name="hotelcode"
              value={formData.hotelcode}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              select
              fullWidth
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

         

          <Grid item xs={6}>
            <TextField
              fullWidth
              type="number"
              label="Longitude"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              type="number"
              label="Latitude"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              required
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 5 }} />

        {/* FILE UPLOAD */}
        <Typography variant="h6" mb={2}>
          Upload Images
        </Typography>

        <Button
          variant="contained"
          component="label"
          startIcon={<CloudUploadIcon />}
        >
          Select Images
          <input
            hidden
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
          />
        </Button>

        <Divider sx={{ my: 4 }} />

        {/* IMAGE URL SECTION */}
        <Typography variant="h6" mb={2}>
          Or Add Image URLs
        </Typography>

        {imageUrls.map((url, index) => (
          <Box key={index} display="flex" gap={2} mb={2}>
            <TextField
              fullWidth
              value={url}
              placeholder="Paste Image URL"
              onChange={(e) =>
                handleUrlChange(index, e.target.value)
              }
            />
            <IconButton
              color="error"
              onClick={() => removeImage(index)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))}

        <Button onClick={addUrlField}>
          + Add More URL
        </Button>

        {/* PREVIEW */}
        <Grid container spacing={2} mt={3}>
          {previews.map((img, index) => (
            <Grid item key={index}>
              <Box
                component="img"
                src={img}
                sx={{
                  width: 120,
                  height: 100,
                  objectFit: "cover",
                  borderRadius: 2,
                  border: "1px solid #ddd",
                }}
              />
            </Grid>
          ))}
        </Grid>

        <Box mt={6}>
          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
          >
            {loading ? "Processing..." : "Save Listing"}
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default ListingForm;