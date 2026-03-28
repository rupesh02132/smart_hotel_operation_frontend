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
    <div className="p-3 sm:p-5">
      <Card className="rounded-2xl shadow-xl">
        <CardHeader
          title="Listing Management"
          className="text-center font-bold"
        />

        {/* ⭐ FILTERS */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 px-4 pb-4">
          <TextField
            label="Search Title"
            size="small"
            fullWidth
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <Select
            size="small"
            fullWidth
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(e.target.value)
            }
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
          >
            Export Excel
          </Button>
        </div>

        {/* ⭐ TABLE SCROLL FIX */}
        <TableContainer
          component={Paper}
          className="overflow-x-auto"
        >
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center">
                  Image
                </TableCell>
                <TableCell align="center">
                  Title
                </TableCell>
                <TableCell align="center">
                  City
                </TableCell>
                <TableCell align="center">
                  Category
                </TableCell>
                <TableCell align="center">
                  Delete
                </TableCell>
                <TableCell align="center">
                  Edit
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedListings.map((item) => (
                <TableRow
                  key={item._id}
                  hover
                >
                  <TableCell align="center">
                    <Avatar
                      src={item.images?.[0]}
                      alt={item.title}
                      sx={{
                        width: 36,
                        height: 36,
                        margin: "auto",
                      }}
                    />
                  </TableCell>

                  <TableCell align="center">
                    {item.title}
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
        <div className="flex flex-wrap justify-center items-center gap-3 p-4">
          <Button
            disabled={page === 1}
            onClick={() =>
              setPage((p) => p - 1)
            }
          >
            Prev
          </Button>

          <span className="text-sm font-semibold">
            Page {page} of {totalPages || 1}
          </span>

          <Button
            disabled={page === totalPages}
            onClick={() =>
              setPage((p) => p + 1)
            }
          >
            Next
          </Button>
        </div>
      </Card>

      {/* ⭐ DELETE DIALOG */}
      <Dialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
      >
        <DialogTitle>
          Confirm Delete
        </DialogTitle>

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