import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Typography,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AddIcon from "@mui/icons-material/Add";

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
        amenities: initialData.amenities ? initialData.amenities.join(", ") : "",
      });
      setExistingImages(initialData.images || []);
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles([...imageFiles, ...files]);
  };

  const removeExistingImage = (index) => {
    const updated = existingImages.filter((_, i) => i !== index);
    setExistingImages(updated);
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => form.append(key, value));
    form.append("existingImages", JSON.stringify(existingImages));
    imageFiles.forEach((file) => form.append("images", file));
    const validUrls = imageUrls.filter((url) => url.trim() !== "");
    if (validUrls.length > 0) form.append("images", JSON.stringify(validUrls));
    onSubmit(form);
  };

  // Combine existing + new file previews for display
  const allPreviewImages = [
    ...existingImages,
    ...imageFiles.map((file) => URL.createObjectURL(file)),
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
          <Typography variant="h5" className="font-bold text-white">
            Room Details
          </Typography>
          <Typography variant="caption" className="text-indigo-100">
            Add or edit room information, amenities, and images
          </Typography>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 md:p-8 space-y-8">
          {/* Room Information Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-1 h-5 bg-indigo-500 rounded-full"></div>
              Basic Room Info
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <TextField
                fullWidth
                label="Room Number"
                name="roomNumber"
                value={formData.roomNumber}
                onChange={handleChange}
                required
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
              <TextField
                fullWidth
                label="Floor"
                name="floor"
                value={formData.floor}
                onChange={handleChange}
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
              <TextField
                select
                fullWidth
                label="Room Type"
                name="roomType"
                value={formData.roomType}
                onChange={handleChange}
                required
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              >
                <MenuItem value="">Select Room Type</MenuItem>
                <MenuItem value="Single">Single</MenuItem>
                <MenuItem value="Double">Double</MenuItem>
                <MenuItem value="Deluxe">Deluxe</MenuItem>
                <MenuItem value="Suite">Suite</MenuItem>
                <MenuItem value="Family">Family</MenuItem>
                <MenuItem value="Presidential">Presidential</MenuItem>
              </TextField>
              <TextField
                fullWidth
                label="Base Price (₹)"
                name="basePrice"
                type="number"
                value={formData.basePrice}
                onChange={handleChange}
                required
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            </div>
          </div>

          {/* Capacity & Amenities */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-1 h-5 bg-indigo-500 rounded-full"></div>
              Capacity & Amenities
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <TextField
                fullWidth
                label="Guests"
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                type="number"
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
              <TextField
                fullWidth
                label="Children"
                name="children"
                value={formData.children}
                onChange={handleChange}
                type="number"
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
              <TextField
                fullWidth
                label="Bedrooms"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                type="number"
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
              <TextField
                fullWidth
                label="Beds"
                name="beds"
                value={formData.beds}
                onChange={handleChange}
                type="number"
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
              <TextField
                fullWidth
                label="Baths"
                name="baths"
                value={formData.baths}
                onChange={handleChange}
                type="number"
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
              <TextField
                fullWidth
                label="Amenities (comma separated)"
                name="amenities"
                value={formData.amenities}
                onChange={handleChange}
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
            </div>
          </div>

          {/* Image Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-1 h-5 bg-indigo-500 rounded-full"></div>
              Room Images
            </h3>

            {/* File Upload Button */}
            <div className="mb-6">
              <Button
                variant="contained"
                component="label"
                startIcon={<CloudUploadIcon />}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 normal-case rounded-full px-6 shadow-md"
              >
                Upload Images
                <input
                  hidden
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                Supported formats: JPG, PNG, WebP
              </p>
            </div>

            {/* Existing + New Images Preview */}
            {allPreviewImages.length > 0 && (
              <div className="mt-4">
                <Typography variant="subtitle2" className="text-gray-600 mb-3">
                  Image Preview ({allPreviewImages.length})
                </Typography>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {allPreviewImages.map((img, idx) => {
                    const isExisting = idx < existingImages.length;
                    const onRemove = () => {
                      if (isExisting) removeExistingImage(idx);
                      else {
                        // Remove from imageFiles
                        const fileIndex = idx - existingImages.length;
                        const updatedFiles = imageFiles.filter((_, i) => i !== fileIndex);
                        setImageFiles(updatedFiles);
                      }
                    };
                    return (
                      <div key={idx} className="relative group">
                        <img
                          src={img}
                          alt={`Preview ${idx + 1}`}
                          className="w-full h-28 object-cover rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition"
                        />
                        <button
                          type="button"
                          onClick={onRemove}
                          className="absolute top-1 right-1 bg-black/60 backdrop-blur-sm rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        >
                          <DeleteIcon className="text-white text-sm" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Image URL Inputs */}
            <div className="mt-6">
              <Typography variant="subtitle1" className="font-semibold text-gray-700 mb-2">
                Or add image URLs
              </Typography>
              <div className="space-y-3">
                {imageUrls.map((url, index) => (
                  <div key={index} className="flex gap-2">
                    <TextField
                      fullWidth
                      value={url}
                      placeholder="Paste image URL"
                      onChange={(e) => handleUrlChange(index, e.target.value)}
                      variant="outlined"
                      size="small"
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                    />
                    <IconButton
                      color="error"
                      onClick={() => removeUrlField(index)}
                      className="hover:bg-red-50 transition"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={addUrlField}
                  className="text-indigo-600 hover:bg-indigo-50 normal-case"
                >
                  Add another URL
                </Button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              className={`py-3 rounded-xl font-semibold text-white shadow-lg transition-all ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl"
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : initialData ? (
                "Update Room"
              ) : (
                "Create Room"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomForm;