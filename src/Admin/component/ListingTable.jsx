import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllListings,
  deleteListing,
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

  const listings = useSelector(
    (store) => store.listings?.listings || []
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

  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      const matchSearch = item.title
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchCategory =
        categoryFilter === "All" ||
        item.category === categoryFilter;

      const matchCity =
        cityFilter === "All" || item.city === cityFilter;

      return matchSearch && matchCategory && matchCity;
    });
  }, [listings, search, categoryFilter, cityFilter]);

  const totalPages = Math.ceil(
    filteredListings.length / rowsPerPage
  );

  const paginatedListings = filteredListings.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleDeleteConfirm = () => {
    dispatch(deleteListing(confirmDelete));
    setConfirmDelete(null);
  };

  const exportToExcel = () => {
    const data = filteredListings.map((l) => ({
      Title: l.title,
      City: l.city,
      Category: l.category,
      Country: l.country,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Listings");

    const buffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([buffer]);
    saveAs(blob, "Listings_Report.xlsx");
  };

  const uniqueCategories = [
    "All",
    ...new Set(listings.map((l) => l.category)),
  ];

  const uniqueCities = [
    "All",
    ...new Set(listings.map((l) => l.city)),
  ];

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <Card
        sx={{
          borderRadius: "20px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
        }}
      >
        <CardHeader
          title="Hotels Management"
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            "& .MuiCardHeader-title": {
              fontSize: "1.4rem",
              fontWeight: 700,
            },
          }}
        />

        {/* ⭐ FILTERS */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 px-4 pb-5">
          <TextField
            label="Search Title"
            size="small"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              flex: 1,
              minWidth: "220px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "14px",
                background: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                "&:hover": {
                  boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
                },
                "&.Mui-focused": {
                  boxShadow: "0 0 0 2px rgba(25,118,210,0.2)",
                },
              },
            }}
          />

          <Select
            size="small"
            fullWidth
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(e.target.value)
            }
            sx={{
              flex: 1,
              minWidth: "180px",
              borderRadius: "14px",
              background: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            {uniqueCategories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>

          <Select
            size="small"
            fullWidth
            value={cityFilter}
            onChange={(e) =>
              setCityFilter(e.target.value)
            }
            sx={{
              flex: 1,
              minWidth: "180px",
              borderRadius: "14px",
              background: "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            {uniqueCities.map((city) => (
              <MenuItem key={city} value={city}>
                {city}
              </MenuItem>
            ))}
          </Select>

          <Button
            variant="contained"
            fullWidth
            onClick={exportToExcel}
            sx={{
              flex: 1,
              minWidth: "180px",
              borderRadius: "14px",
              textTransform: "none",
              fontWeight: 600,
              background:
                "linear-gradient(135deg, #1976d2, #42a5f5)",
              boxShadow:
                "0 4px 14px rgba(25,118,210,0.3)",
              "&:hover": {
                transform: "translateY(-1px)",
              },
            }}
          >
            Export Excel
          </Button>
        </div>

        {/* ⭐ TABLE */}
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {[
                  "Image",
                  "Title",
                  "HotelCode",
                  "City",
                  "Category",
                  "Delete",
                  "Edit",
                ].map((head) => (
                  <TableCell
                    key={head}
                    align="center"
                    sx={{
                      fontWeight: 700,
                      background: "#f9fafb",
                    }}
                  >
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedListings.map((item, index) => (
                <TableRow
                  key={item._id}
                  hover
                  sx={{
                    transition: "0.2s",
                    "&:hover": {
                      backgroundColor: "#f3f4f6",
                    },
                  }}
                >
                  <TableCell align="center">
                    <Avatar
                      src={item.images?.[0]}
                      alt={item.title}
                      sx={{
                        width: 42,
                        height: 42,
                        margin: "auto",
                      }}
                    />
                  </TableCell>

                  <TableCell align="center">
                    {item.title}
                  </TableCell>

                  <TableCell align="center">
                    {item.hotelcode}
                  </TableCell>

                  <TableCell align="center">
                    {item.city}
                  </TableCell>

                  <TableCell align="center">
                    {item.category}
                  </TableCell>

                  <TableCell align="center">
                    <Button
                      color="error"
                      variant="contained"
                      size="small"
                      onClick={() =>
                        setConfirmDelete(item._id)
                      }
                      sx={{
                        borderRadius: "10px",
                        textTransform: "none",
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>

                  <TableCell align="center">
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() =>
                        navigate(
                          `/admin/listing/edit/${item._id}`
                        )
                      }
                      sx={{
                        borderRadius: "10px",
                        textTransform: "none",
                      }}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* ⭐ PAGINATION */}
        <div className="flex justify-center items-center gap-4 p-5">
          <Button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </Button>

          <span className="font-semibold">
            Page {page} / {totalPages || 1}
          </span>

          <Button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </Card>

      {/* ⭐ DIALOG */}
      <Dialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>

        <DialogContent>
          Are you sure you want to delete this listing?
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setConfirmDelete(null)}
          >
            Cancel
          </Button>

          <Button
            color="error"
            onClick={handleDeleteConfirm}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ListingTable;