import React, { useEffect, useState, useMemo } from "react";
import {
  Card,
  TextField,
  InputAdornment,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Pagination,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";

// Sample API call – replace with actual Redux action
const fetchBillingData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        transactions: [
          { id: "INV-001", user: "John Doe", date: "2025-04-01", amount: 12500, status: "paid", type: "booking" },
          { id: "INV-002", user: "Jane Smith", date: "2025-04-02", amount: 8500, status: "paid", type: "booking" },
          { id: "INV-003", user: "Mike Johnson", date: "2025-04-03", amount: 3200, status: "pending", type: "refund" },
          { id: "INV-004", user: "Sarah Lee", date: "2025-04-04", amount: 21000, status: "paid", type: "booking" },
          { id: "INV-005", user: "David Kim", date: "2025-04-05", amount: 500, status: "failed", type: "service" },
        ],
        summary: { totalRevenue: 45200, pendingAmount: 3200, paidCount: 3, totalTransactions: 5 },
      });
    }, 500);
  });
};

const AdminBilling = () => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ totalRevenue: 0, pendingAmount: 0, paidCount: 0, totalTransactions: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    fetchBillingData().then((data) => {
      setTransactions(data.transactions);
      setSummary(data.summary);
      setLoading(false);
    });
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchSearch = t.user.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || t.status === statusFilter;
      const matchType = typeFilter === "all" || t.type === typeFilter;
      return matchSearch && matchStatus && matchType;
    });
  }, [transactions, search, statusFilter, typeFilter]);

  const totalPages = Math.ceil(filteredTransactions.length / rowsPerPage);
  const paginatedTransactions = filteredTransactions.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const getStatusChip = (status) => {
    const colors = {
      paid: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      failed: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const exportToCSV = () => {
    const headers = ["ID", "Customer", "Date", "Amount", "Status", "Type"];
    const rows = filteredTransactions.map((t) => [t.id, t.user, t.date, t.amount, t.status, t.type]);
    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `billing_report_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-6 bg-indigo-600 rounded-full"></div>
              <span className="text-indigo-600 text-xs font-semibold uppercase">Financial Operations</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Billing Management</h1>
            <p className="text-gray-500 text-sm">Invoices, payments, and transaction history</p>
          </div>
          <Button variant="contained" startIcon={<DownloadIcon />} onClick={exportToCSV} sx={{ borderRadius: "40px", background: "#4f46e5" }}>
            Export CSV
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-800">₹{summary.totalRevenue.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Pending Amount</p>
            <p className="text-2xl font-bold text-yellow-600">₹{summary.pendingAmount.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Paid Transactions</p>
            <p className="text-2xl font-bold text-green-600">{summary.paidCount}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Total Transactions</p>
            <p className="text-2xl font-bold text-indigo-600">{summary.totalTransactions}</p>
          </div>
        </div>

        {/* Filters */}
        <Card className="rounded-2xl shadow-sm border-0">
          <div className="p-4 flex flex-col md:flex-row gap-3">
            <TextField
              size="small"
              placeholder="Search by ID or customer..."
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon className="text-gray-400" /></InputAdornment>,
                endAdornment: search && <ClearIcon className="cursor-pointer text-gray-400" onClick={() => setSearch("")} />,
                sx: { borderRadius: "40px", backgroundColor: "#fff" },
              }}
            />
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="failed">Failed</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel>Type</InputLabel>
              <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} label="Type">
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="booking">Booking</MenuItem>
                <MenuItem value="refund">Refund</MenuItem>
                <MenuItem value="service">Service</MenuItem>
              </Select>
            </FormControl>
          </div>
        </Card>

        {/* Transactions Table (Desktop) */}
        <div className="hidden md:block overflow-x-auto">
          <TableContainer component={Paper} className="rounded-xl shadow-sm">
            <Table>
              <TableHead className="bg-gray-50">
                <TableRow>
                  <TableCell className="font-semibold">Invoice ID</TableCell>
                  <TableCell className="font-semibold">Customer</TableCell>
                  <TableCell className="font-semibold">Date</TableCell>
                  <TableCell className="font-semibold">Amount</TableCell>
                  <TableCell className="font-semibold">Status</TableCell>
                  <TableCell className="font-semibold">Type</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedTransactions.map((t) => (
                  <TableRow key={t.id} hover>
                    <TableCell>{t.id}</TableCell>
                    <TableCell>{t.user}</TableCell>
                    <TableCell>{new Date(t.date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-semibold">₹{t.amount.toLocaleString()}</TableCell>
                    <TableCell><span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusChip(t.status)}`}>{t.status}</span></TableCell>
                    <TableCell><Chip label={t.type} size="small" variant="outlined" /></TableCell>
                  </TableRow>
                ))}
                {paginatedTransactions.length === 0 && (
                  <TableRow><TableCell colSpan={6} align="center">No transactions found</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {paginatedTransactions.map((t) => (
            <div key={t.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start">
                <div><p className="text-xs text-gray-500">Invoice</p><p className="font-semibold">{t.id}</p></div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusChip(t.status)}`}>{t.status}</span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-gray-500">Customer:</span> {t.user}</div>
                <div><span className="text-gray-500">Date:</span> {new Date(t.date).toLocaleDateString()}</div>
                <div><span className="text-gray-500">Amount:</span> ₹{t.amount.toLocaleString()}</div>
                <div><span className="text-gray-500">Type:</span> <Chip label={t.type} size="small" /></div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center pt-4">
            <Pagination count={totalPages} page={page} onChange={(e, v) => setPage(v)} color="primary" shape="rounded" />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBilling;