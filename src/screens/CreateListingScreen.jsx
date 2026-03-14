import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { createListing } from "../state/listing/Action";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Paper,
  Breadcrumbs,
  Link,
} from "@mui/material";
import ListingForm from "../components/ListingForm";

const CreateListingScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.listings);

  const handleCreate = async (formData) => {
    await dispatch(createListing(formData));
    navigate("/admin/listings");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f4f6f8",
        py: 6,
      }}
    >
      <Container maxWidth="xl">
        {/* Breadcrumb */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link
            underline="hover"
            color="inherit"
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/admin")}
          >
            Dashboard
          </Link>
          <Typography color="text.primary">
            Create Listing
          </Typography>
        </Breadcrumbs>

        {/* Header */}
        <Box mb={4}>
          <Typography
            variant="h4"
            fontWeight={700}
            gutterBottom
          >
            Create New Hotel
          </Typography>
          <Typography color="text.secondary">
            Add a new property to your hotel management
            system.
          </Typography>
        </Box>

        {/* Card Wrapper */}
        <Paper
          elevation={0}
          sx={{
            p: 5,
            borderRadius: 3,
            backgroundColor: "#ffffff",
            boxShadow:
              "0px 4px 20px rgba(0,0,0,0.05)",
          }}
        >
          <ListingForm
            onSubmit={handleCreate}
            loading={loading}
          />
        </Paper>
      </Container>
    </Box>
  );
};

export default CreateListingScreen;