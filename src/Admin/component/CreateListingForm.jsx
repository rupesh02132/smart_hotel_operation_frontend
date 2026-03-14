import React, { useEffect, useState } from "react";
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  createListing,
  updateListing,
  getListingById,
} from "../../state/listing/Action";
import Loader from "../../components/Loader";
import Message from "../../components/Message";

const initialFormState = {
  title: "",
  address: "",
  description: "",
  price: 0,
  city: "",
  country: "",
  guests: 1,
  bedrooms: 1,
  beds: 1,
  baths: 1,
  amenities: "",
  category: "Apartment",
  images: [""],
  location: {
    type: "Point",
    coordinates: [0, 0], // [longitude, latitude]
  },
};

const CreateListingForm = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [success, setSuccess] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, currentListing } = useSelector(
    (state) => state.listings
  );

  useEffect(() => {
    if (id) dispatch(getListingById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (id && currentListing) {
      setFormData({
        ...currentListing,
        amenities: currentListing.amenities?.join(", ") || "",
        images: currentListing.images?.length ? currentListing.images : [""],
        location: {
          type: "Point",
          coordinates: currentListing.location?.coordinates || [0, 0],
        },
      });
    }
  }, [currentListing, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  

const handleFileUpload = (index, e) => {
  const file = e.target.files[0];
  if (!file) return;

  setFormData((prev) => {
    const updated = [...prev.images];
    updated[index] = file;
    return { ...prev, images: updated };
  });
};






  const handleImageChange = (index, value) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = value;
    setFormData((prev) => ({ ...prev, images: updatedImages }));
  };

  const addImageField = () => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, ""] }));
  };

 const handleSubmit = (e) => {
  e.preventDefault();

  const preparedData = {
    ...formData,
    price: Number(formData.price),
    guests: Number(formData.guests),
    bedrooms: Number(formData.bedrooms),
    beds: Number(formData.beds),
    baths: Number(formData.baths),
    amenities: formData.amenities
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean),
    location: {
      type: "Point",
      coordinates: formData.location.coordinates.map(Number),
    },
  };

  const data = new FormData();

  Object.keys(preparedData).forEach((key) => {
    if (key !== "images" && key !== "location") {
      data.append(key, preparedData[key]);
    }
  });

  data.append("longitude", preparedData.location.coordinates[0]);
  data.append("latitude", preparedData.location.coordinates[1]);

  preparedData.images.forEach((img) => {
    if (img instanceof File) {
      data.append("images", img);   // MUST be "images"
    }
  });

  if (id) {
    dispatch(updateListing({ id, listingData: data }));
    navigate(`/listing/${id}`);
  } else {
    dispatch(createListing(data));
    setSuccess(true);
    setFormData(initialFormState);
  }
};


  const textFieldProps = {
    fullWidth: true,
    size: "medium",
    InputProps: {
      sx: { py: 2 },
    },
    inputProps: {
      style: { fontSize: "1rem" },
    },
  };

  return (
    <div className="px-1 sm:px-4 md:px-10 py-2 sm:py-6" style={{ maxWidth: 900, margin: '0 auto' }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
        {id ? "Edit Listing" : "Create New Listing"}
      </Typography>

      {loading && <Loader />}
      {error && <Message variant="danger">{error}</Message>}
      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Listing created successfully!
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          <Grid item xs={12}>
            <TextField
              {...textFieldProps}
              name="title"
              label="Title"
              value={formData.title}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              {...textFieldProps}
              name="address"
              label="Address"
              value={formData.address}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              {...textFieldProps}
              name="description"
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              {...textFieldProps}
              name="price"
              label="Price"
              type="number"
              value={formData.price}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              {...textFieldProps}
              name="amenities"
              label="Amenities (comma separated)"
              value={formData.amenities}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              {...textFieldProps}
              name="city"
              label="City"
              value={formData.city}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              {...textFieldProps}
              name="country"
              label="Country"
              value={formData.country}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              {...textFieldProps}
              name="guests"
              label="Guests"
              type="number"
              value={formData.guests}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              {...textFieldProps}
              name="bedrooms"
              label="Bedrooms"
              type="number"
              value={formData.bedrooms}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              {...textFieldProps}
              name="beds"
              label="Beds"
              type="number"
              value={formData.beds}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={3}>
            <TextField
              {...textFieldProps}
              name="baths"
              label="Baths"
              type="number"
              value={formData.baths}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                label="Category"
              >
                <MenuItem value="Apartment">Apartment</MenuItem>
                <MenuItem value="House">House</MenuItem>
                <MenuItem value="Cabin">Cabin</MenuItem>
                <MenuItem value="Villa">Villa</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {/* Image URLs */}

          {formData.images.map((img, index) => (
  <Grid item xs={12} key={index}>
    <Grid container spacing={2} alignItems="center">

      {/* Image URL Input */}
      <Grid item xs={12} sm={8}>
        <TextField
          label={`Image URL ${index + 1}`}
          fullWidth
          value={typeof img === "string" ? img : ""}
          onChange={(e) => handleImageChange(index, e.target.value)}
        />
      </Grid>

      {/* Upload Button */}
      <Grid item xs={12} sm={4}>
        <Button
          variant="outlined"
          component="label"
          fullWidth
          sx={{ height: "56px" }}
        >
          Upload Image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => handleFileUpload(index, e)}
          />
        </Button>
      </Grid>

    </Grid>

    {/* Preview (works for URL or File) */}
    {img && (
      <img
        src={typeof img === "string" ? img : URL.createObjectURL(img)}
        alt="preview"
        style={{
          width: "100%",
          maxHeight: 200,
          objectFit: "cover",
          marginTop: 10,
          borderRadius: 6,
          border: "1px solid #ddd",
        }}
      />
    )}
  </Grid>
))}


          <Grid item xs={12}>
            <Button
              variant="outlined"
              fullWidth
              onClick={addImageField}
              sx={{ py: { xs: 0.7, sm: 1 }, fontSize: { xs: '0.9rem', sm: '1rem' }, mb: { xs: 1, sm: 2 } }}
            >
              + Add More Images
            </Button>
          </Grid>

          {/* Location coordinates */}
          <Grid item xs={12} sm={6}>
            <TextField
              {...textFieldProps}
              name="longitude"
              label="Longitude"
              type="number"
              value={formData.location?.coordinates[0]}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  location: {
                    ...prev.location,
                    coordinates: [
                      Number(e.target.value),
                      prev.location.coordinates[1],
                    ],
                  },
                }))
              }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              {...textFieldProps}
              name="latitude"
              label="Latitude"
              type="number"
              value={formData.location.coordinates[1]}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  location: {
                    ...prev.location,
                    coordinates: [
                      prev.location.coordinates[0],
                      Number(e.target.value),
                    ],
                  },
                }))
              }
            />
          </Grid>

          <Grid item xs={12}>
            <Button
              variant="contained"
              fullWidth
              type="submit"
              sx={{ py: { xs: 1, sm: 1.5 }, fontSize: { xs: '1rem', sm: '1.1rem' } }}
            >
              {id ? "Update Listing" : "Create Listing"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

export default CreateListingForm;
