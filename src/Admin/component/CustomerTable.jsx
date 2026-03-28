
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
  CardHeader,
} from "@mui/material";
import { getAllUser, deleteUser } from "../../state/auth/Action"; // adjust import path

const CustomerTable = () => {
  const dispatch = useDispatch();

  const { users } = useSelector((state) => state.auth.users);

  console.log("users", users);

  // useEffect(() => {
  //   dispatch(getAllUser());
  // }, [dispatch]);

  const handleDelete = (userId) => {
    dispatch(deleteUser(userId));
    dispatch(getAllUser());
  };

  return (
    <div className="px-1 sm:px-3 md:px-5 py-2 sm:py-4">
      <Card>
        <CardHeader title="Registered Customers" sx={{ textAlign: 'center', fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }, px: { xs: 1, sm: 2, md: 3 }, py: { xs: 1, sm: 2 } }} />
        <TableContainer component={Paper} sx={{ width: '100%', overflowX: 'auto' }}>
          <Table size="small" sx={{ minWidth: 600 }}>
            <TableHead className="bg-gray-200">
              <TableRow>
                <TableCell align="center" sx={{ fontSize: { xs: '0.7rem', sm: '0.9rem' }, px: { xs: 0.5, sm: 1 } }}>Avatar</TableCell>
                <TableCell align="center" sx={{ fontSize: { xs: '0.7rem', sm: '0.9rem' }, px: { xs: 0.5, sm: 1 } }}>Name</TableCell>
                <TableCell align="center" sx={{ fontSize: { xs: '0.7rem', sm: '0.9rem' }, px: { xs: 0.5, sm: 1 } }}>Email</TableCell>
                <TableCell align="center" sx={{ fontSize: { xs: '0.7rem', sm: '0.9rem' }, px: { xs: 0.5, sm: 1 } }}>Phone</TableCell>
                <TableCell align="center" sx={{ fontSize: { xs: '0.7rem', sm: '0.9rem' }, px: { xs: 0.5, sm: 1 } }}>Role</TableCell>
                <TableCell align="center" sx={{ fontSize: { xs: '0.7rem', sm: '0.9rem' }, px: { xs: 0.5, sm: 1 } }}>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users?.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell align="center">
                      <Avatar src={user.avatar || undefined} sx={{ width: { xs: 26, sm: 36 }, height: { xs: 26, sm: 36 }, mx: 'auto' }}>
                        {!user.avatar && user.firstname?.charAt(0).toUpperCase()}
                      </Avatar>
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.7rem', sm: '0.85rem' }, maxWidth: { xs: 70, sm: 120 }, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {user.firstname} {user.lastname}
                    </TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.7rem', sm: '0.85rem' }, maxWidth: { xs: 90, sm: 180 }, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.7rem', sm: '0.85rem' } }}>{user.phone}</TableCell>
                    <TableCell align="center" sx={{ fontSize: { xs: '0.7rem', sm: '0.85rem' } }}>{user.role}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        sx={{ fontSize: { xs: '0.65rem', sm: '0.8rem' }, px: { xs: 0.7, sm: 2 }, py: { xs: 0.3, sm: 1 }, minWidth: { xs: 48, sm: 64 } }}
                        onClick={() => handleDelete(user._id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </div>
  );
};

export default CustomerTable;
