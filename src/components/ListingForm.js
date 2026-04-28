import React, { useState, useEffect } from "react";
import {
  TextField,
  Typography,
  Button,
  MenuItem,
  IconButton,
  Divider,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

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
    priceRange: "",
    longitude: "",
    latitude: "",
  });

  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState([""]);
  const [previews, setPreviews] = useState([]);

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

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleUrlChange = (index, value) => {
    const updated = [...imageUrls];
    updated[index] = value;
    setImageUrls(updated);
  };

  const addUrlField = () => {
    setImageUrls([...imageUrls, ""]);
  };

  const removeImage = (index) => {
    const updatedPreviews = previews.filter((_, i) => i !== index);
    setPreviews(updatedPreviews);
    const updatedUrls = imageUrls.filter((_, i) => i !== index);
    setImageUrls(updatedUrls);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      form.append(key, formData[key]);
    });
    form.append("longitude", formData.longitude);
    form.append("latitude", formData.latitude);
    uploadedFiles.forEach((file) => form.append("images", file));
    imageUrls
      .filter((url) => url.trim() !== "")
      .forEach((url) => form.append("images", url));
    onSubmit(form);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
          <Typography variant="h5" className="font-bold text-white">
            Hotel Information
          </Typography>
          <Typography variant="caption" className="text-indigo-100">
            Fill in the details to create or edit a hotel listing
          </Typography>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 md:p-8 space-y-8">
          {/* Basic Information Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-1 h-5 bg-indigo-500 rounded-full"></div>
              Basic Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <TextField
                fullWidth
                label="Hotel Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
              <TextField
                fullWidth
                label="Hotel Code"
                name="hotelcode"
                value={formData.hotelcode}
                onChange={handleChange}
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
              <TextField
                fullWidth
                label="Price Range"
                name="priceRange"
                value={formData.priceRange}
                onChange={handleChange}
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
              <TextField
                select
                fullWidth
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          </div>

          {/* Location & Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-1 h-5 bg-indigo-500 rounded-full"></div>
              Location & Details
            </h3>
            <div className="grid grid-cols-1 gap-5">
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />
                <TextField
                  fullWidth
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  variant="outlined"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />
              </div>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                variant="outlined"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <TextField
                  fullWidth
                  type="number"
                  label="Longitude"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />
                <TextField
                  fullWidth
                  type="number"
                  label="Latitude"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleChange}
                  required
                  variant="outlined"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />
              </div>
            </div>
          </div>

          <Divider className="my-2" />

          {/* Image Upload Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-1 h-5 bg-indigo-500 rounded-full"></div>
              Hotel Images
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
                Supported formats: JPG, PNG, WebP (max 5MB each)
              </p>
            </div>

            {/* Image URL Inputs */}
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
                    onClick={() => removeImage(index)}
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

            {/* Image Preview Grid */}
            {previews.length > 0 && (
              <div className="mt-6">
                <Typography variant="subtitle2" className="text-gray-600 mb-3">
                  Image Preview ({previews.length})
                </Typography>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {previews.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img
                        src={img}
                        alt={`Preview ${idx + 1}`}
                        className="w-full h-28 object-cover rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-black/60 backdrop-blur-sm rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      >
                        <DeleteIcon className="text-white text-sm" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Save Listing"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ListingForm;