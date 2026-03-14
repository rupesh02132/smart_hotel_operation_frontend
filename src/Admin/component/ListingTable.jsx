import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllListings,
  deleteListing,
  updateListing,
} from "../../state/listing/Action";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  Card,
  CardHeader,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ListingTable = () => {
  const dispatch = useDispatch();
const navigate = useNavigate();
  const listings = useSelector((store) => store.listings?.listings || []);
  console.log(
    "🚀 ~ file: ListingTable.jsx:28 ~ ListingTable ~ listings:",
    listings,
  );
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [cityFilter, setCityFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const rowsPerPage = 15;

  useEffect(() => {
    dispatch(getAllListings({}));
  }, [dispatch]);

  /* ============================
     FILTERING
  ============================ */
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      const matchSearch = item.title
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchCategory =
        categoryFilter === "All" || item.category === categoryFilter;

      const matchCity = cityFilter === "All" || item.city === cityFilter;

      return matchSearch && matchCategory && matchCity;
    });
  }, [listings, search, categoryFilter, cityFilter]);

  const totalPages = Math.ceil(filteredListings.length / rowsPerPage);

  const paginatedListings = filteredListings.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage,
  );

  /* ============================
     DELETE
  ============================ */
  const handleDeleteConfirm = () => {
    dispatch(deleteListing(confirmDelete));
    setConfirmDelete(null);
  };

  /* ============================
     EXPORT TO EXCEL
  ============================ */
  const exportToExcel = () => {
    const data = filteredListings.map((l) => ({
      Title: l.title,
      City: l.city,
      Category: l.category,
      Country: l.country,
      DemandScore: l.demandScore,
      Multiplier: l.seasonalMultiplier,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Listings");

    const buffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([buffer], {
      type: "application/octet-stream",
    });

    saveAs(blob, "Listings_Report.xlsx");
  };

  const uniqueCategories = ["All", ...new Set(listings.map((l) => l.category))];

  const uniqueCities = ["All", ...new Set(listings.map((l) => l.city))];

  return (
    <div className="px-4 py-4">
      <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
        <CardHeader
          title="Listing Management"
          sx={{ textAlign: "center", fontWeight: "bold" }}
        />

        {/* FILTER CONTROLS */}
        <div
          style={{ padding: 16, display: "flex", gap: 10, flexWrap: "wrap" }}
        >
          <TextField
            label="Search Title"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Select
            size="small"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {uniqueCategories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>

          <Select
            size="small"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          >
            {uniqueCities.map((city) => (
              <MenuItem key={city} value={city}>
                {city}
              </MenuItem>
            ))}
          </Select>

          <Button variant="contained" onClick={exportToExcel}>
            Export Excel
          </Button>
        </div>

        <TableContainer component={Paper}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center">Image</TableCell>
                <TableCell align="center">Title</TableCell>
                <TableCell align="center">City</TableCell>
                <TableCell align="center">Category</TableCell>
                <TableCell align="center">Delete</TableCell>
                <TableCell align="center">Edit</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedListings.map((item) => (
                <TableRow
                  key={item._id}
                  sx={{
                    "&:hover": { backgroundColor: "#f9fafb" },
                  }}
                >
                  <TableCell align="center">
                    <Avatar alt={item.title} src={item.images?.[0]} />
                  </TableCell>

                  <TableCell align="center">{item.title}</TableCell>

                  <TableCell align="center">{item.city}</TableCell>

                  <TableCell align="center">{item.category}</TableCell>

                  <TableCell align="center">
                    <Button
                      color="error"
                      variant="contained"
                      size="small"
                      onClick={() => setConfirmDelete(item._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>

                  <TableCell align="center">
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      onClick={() =>
                        navigate(`/admin/listing/edit/${item._id}`)
                      }
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* PAGINATION */}
        <div style={{ padding: 16, textAlign: "center" }}>
          <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Prev
          </Button>
          <span style={{ margin: "0 10px" }}>
            Page {page} of {totalPages || 1}
          </span>
          <Button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </Card>

      {/* DELETE CONFIRMATION */}
      <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this listing?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(null)}>Cancel</Button>
          <Button color="error" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ListingTable;
