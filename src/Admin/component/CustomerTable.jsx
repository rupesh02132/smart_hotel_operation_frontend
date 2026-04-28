import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Button,
  Card,
  Box,
  Typography,
  Divider,
  useMediaQuery,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from "@mui/icons-material";
import { getAllUser, deleteUser } from "../../state/auth/Action";

const CustomerTable = () => {
  const dispatch = useDispatch();
  const isMobile = useMediaQuery('(max-width:768px)');

  const { users } = useSelector((state) => state.auth.users);
  console.log("users", users);

  useEffect(() => {
    dispatch(getAllUser());
  }, [dispatch]);

  const handleDelete = (userId) => {
    dispatch(deleteUser(userId));
    dispatch(getAllUser());
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: { bg: "from-red-500 to-rose-600", text: "text-red-600", chip: "error" },
      manager: { bg: "from-purple-500 to-pink-600", text: "text-purple-600", chip: "secondary" },
      host: { bg: "from-blue-500 to-cyan-600", text: "text-blue-600", chip: "info" },
      staff: { bg: "from-emerald-500 to-green-600", text: "text-emerald-600", chip: "success" },
      user: { bg: "from-gray-500 to-gray-600", text: "text-gray-600", chip: "default" },
    };
    return colors[role] || colors.user;
  };

  if (!users || users.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-8">
        <Card className="rounded-2xl shadow-xl border-0 overflow-hidden max-w-md w-full">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4">
            <Typography variant="h6" className="text-white text-center">Registered Customers</Typography>
          </div>
          <Box p={6} textAlign="center">
            <PersonIcon sx={{ fontSize: 64, color: "#cbd5e1", mb: 2 }} />
            <Typography color="textSecondary">No users found.</Typography>
          </Box>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-6 px-3 sm:px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
            <span className="text-indigo-600 text-xs font-semibold uppercase tracking-wider">User Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Registered Customers</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and monitor all registered users</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-xl p-3 border border-blue-500/20">
            <p className="text-2xl font-bold text-blue-600">{users.length}</p>
            <p className="text-xs text-gray-500">Total Users</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-xl p-3 border border-purple-500/20">
            <p className="text-2xl font-bold text-purple-600">{users.filter(u => u.role === 'admin').length}</p>
            <p className="text-xs text-gray-500">Admins</p>
          </div>
          <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-xl p-3 border border-emerald-500/20">
            <p className="text-2xl font-bold text-emerald-600">{users.filter(u => u.role === 'host').length}</p>
            <p className="text-xs text-gray-500">Hosts</p>
          </div>
          <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 rounded-xl p-3 border border-amber-500/20">
            <p className="text-2xl font-bold text-amber-600">{users.filter(u => u.role === 'user').length}</p>
            <p className="text-xs text-gray-500">Guests</p>
          </div>
        </div>

        {/* Main Card */}
        <Card className="rounded-2xl shadow-xl border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-4 sm:px-6 py-4">
            <Typography variant="h6" className="text-white font-semibold">Customer Directory</Typography>
            <Typography variant="caption" className="text-gray-300">All registered users across platform</Typography>
          </div>

          {!isMobile ? (
            /* Desktop Table View */
            <TableContainer component={Paper} elevation={0} sx={{ overflowX: "auto" }}>
              <Table size="medium">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Avatar</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Name</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Email</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>User ID</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Phone</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Role</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => {
                    const roleColor = getRoleColor(user.role);
                    return (
                      <TableRow key={user._id} hover sx={{ "&:hover": { backgroundColor: "#f1f5f9" } }}>
                        <TableCell align="center">
                          <Avatar
                            src={user.avatar || undefined}
                            sx={{
                              width: 48,
                              height: 48,
                              mx: "auto",
                              border: "2px solid #e2e8f0",
                              bgcolor: "#f1f5f9",
                            }}
                          >
                            {!user.avatar && (
                              <span className="text-lg font-semibold text-gray-600">
                                {user.firstname?.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </Avatar>
                        </TableCell>
                        <TableCell align="center">
                          <span className="font-medium text-gray-800">
                            {user.firstname} {user.lastname}
                          </span>
                        </TableCell>
                        <TableCell align="center">
                          <div className="flex items-center justify-center gap-1 text-gray-600">
                            <EmailIcon sx={{ fontSize: "1rem", color: "#94a3b8" }} />
                            <span className="text-sm">{user.email}</span>
                          </div>
                        </TableCell>
                        <TableCell align="center">
                          <div className="flex items-center justify-center gap-1 text-gray-600">
                            <EmailIcon sx={{ fontSize: "1rem", color: "#94a3b8" }} />
                            <span className="text-sm">{user._id}</span>
                          </div>
                        </TableCell>

                        <TableCell align="center">
                          <div className="flex items-center justify-center gap-1 text-gray-600">
                            <PhoneIcon sx={{ fontSize: "1rem", color: "#94a3b8" }} />
                            <span className="text-sm">{user.phone}</span>
                          </div>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={user.role}
                            color={roleColor.chip}
                            size="small"
                            sx={{ fontWeight: 600, textTransform: "capitalize" }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Delete User">
                            <IconButton
                              size="small"
                              onClick={() => handleDelete(user._id)}
                              sx={{
                                backgroundColor: "#fee2e2",
                                borderRadius: "10px",
                                "&:hover": { backgroundColor: "#fecaca", transform: "scale(1.05)" },
                              }}
                            >
                              <DeleteIcon sx={{ fontSize: "1.2rem", color: "#dc2626" }} />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            /* Mobile Card View */
            <Box sx={{ p: 2 }}>
              {users.map((user) => {
                const roleColor = getRoleColor(user.role);
                return (
                  <Card
                    key={user._id}
                    sx={{ mb: 2, p: 2, borderRadius: "16px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                    className="hover:shadow-md transition-shadow"
                  >
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar
                        src={user.avatar || undefined}
                        sx={{ width: 56, height: 56, border: "2px solid #e2e8f0" }}
                      >
                        {!user.avatar && (
                          <span className="text-xl font-bold text-gray-600">
                            {user.firstname?.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </Avatar>
                      <Box flex={1}>
                        <Typography variant="subtitle1" fontWeight="bold" className="text-gray-800">
                          {user.firstname} {user.lastname}
                        </Typography>
                        <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                          <EmailIcon sx={{ fontSize: "0.8rem", color: "#94a3b8" }} />
                          <Typography variant="caption" color="textSecondary" className="truncate">
                            {user.email}
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <PhoneIcon sx={{ fontSize: "0.8rem", color: "#94a3b8" }} />
                            <Typography variant="caption" color="textSecondary">
                              {user.phone}
                            </Typography>
                          </Box>
                          <Chip
                            label={user.role}
                            color={roleColor.chip}
                            size="small"
                            sx={{ fontWeight: 600, textTransform: "capitalize" }}
                          />
                        </Box>
                      </Box>
                    </Box>
                    <Divider sx={{ my: 1.5 }} />
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(user._id)}
                      sx={{
                        background: "linear-gradient(135deg, #ef4444, #dc2626)",
                        borderRadius: "12px",
                        textTransform: "none",
                        fontWeight: 600,
                        "&:hover": { background: "linear-gradient(135deg, #dc2626, #b91c1c)" },
                      }}
                    >
                      Delete User
                    </Button>
                  </Card>
                );
              })}
            </Box>
          )}

          {/* Footer Count */}
          <div className="bg-gray-50 px-4 sm:px-6 py-3 border-t border-gray-100 flex justify-between text-sm text-gray-500">
            <span>Total users: {users.length}</span>
            <span>Last updated: {new Date().toLocaleDateString()}</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CustomerTable;