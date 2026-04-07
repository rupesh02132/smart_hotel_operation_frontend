import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getListingById,
  updateListing,
} from "../state/listing/Action";
import { useNavigate, useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Paper,
  Breadcrumbs,
  Link,
  CircularProgress,
  Snackbar,
  Alert,
  Button,
} from "@mui/material";
import ListingForm from "../components/ListingForm";

const EditListingScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
const {listings} = useSelector((state) => state);
console.log("🚀EditListingScreen.jsx:28 ~ EditListingScreen ~ listing:", listings.listing);
  const {  loading, error } = listings;
  const currentListing = listings.listing;
  console.log("🚀 ~ file: EditListingScreen.jsx:29 ~ EditListingScreen ~ currentListing:", currentListing);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getListingById(id));
    }
  }, [dispatch, id]);

  const handleUpdate = async (formData) => {
    await dispatch(updateListing({ id, listingData: formData }));
    setOpenSnackbar(true);

    setTimeout(() => {
      navigate("/admin/listings");
    }, 1500);
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#f4f6f8", py: 6 }}>
      <Container maxWidth="xl">
        {/* Breadcrumb */}
        <Breadcrumbs sx={{ mb: 2 }}>
         
          <Link underline="hover" sx={{ cursor: "pointer" }} onClick={() => navigate("/admin/listings")}>
            Listings
          </Link>
          <Typography>Edit Listing</Typography>
        </Breadcrumbs>

        {/* Header */}
        <Box mb={4} display="flex" justifyContent="space-between">
          <Box>
            <Typography variant="h4" fontWeight={700}>
              Edit Hotel
            </Typography>
            <Typography color="text.secondary">
              Update property details and media.
            </Typography>
          </Box>

          <Button variant="outlined" onClick={() => navigate("/admin/listings")}>
            Cancel
          </Button>
        </Box>

        {/* Card */}
        <Paper
          sx={{
            p: 5,
            borderRadius: 3,
            boxShadow: "0px 4px 24px rgba(0,0,0,0.06)",
          }}
        >
          {loading ? (
            <Box display="flex" justifyContent="center" py={8}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Typography color="error">{error}</Typography>
          ) : currentListing ? (
            <ListingForm
              initialData={currentListing}
              onSubmit={handleUpdate}
              loading={loading}
            />
          ) : (
            <Typography>No listing found.</Typography>
          )}
        </Paper>
      </Container>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={1500}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="success" variant="filled">
          Listing updated successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EditListingScreen;