import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import { FaTrash, FaEdit, FaCheck, FaTimes, FaSearch } from "react-icons/fa";
import Message from "../../components/Message/Message";
import Loader from "../../components/Loader/Loader";
import Paginate from "../../components/Paginate/Paginate";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
} from "../../slices/usersApiSlice";
import { toast } from "react-toastify";

const UserListPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  const { data, isLoading, error, refetch } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure")) {
      try {
        await deleteUser(id);
        refetch();
        toast.success("User deleted successfully");
      } catch (err) {
        toast.error(err?.data?.message || "Failed to delete user");
      }
    }
  };

  useEffect(() => {
    if (data && data.length > 0) {
      setFilteredUsers(
        data.filter((user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredUsers([]);
    }
  }, [data, searchTerm]);

  return (
    <div className="container" style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>

      <TextField
        variant="outlined"
        label="Search Users"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <FaSearch />
            </InputAdornment>
          ),
        }}
      />

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || "An error occurred while fetching users."}
        </Message>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Admin</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <Box
                        component="img"
                        src={
                          user
                            ? user.profilePicture
                            : "https://via.placeholder.com/50"
                        }
                        alt={user.name}
                        sx={{
                          width: 50,
                          height: 50,
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    </TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>
                      <a href={`mailto:${user.email}`}>{user.email}</a>
                    </TableCell>
                    <TableCell>
                      {user.isAdmin ? (
                        <FaCheck style={{ color: "green" }} />
                      ) : (
                        <FaTimes style={{ color: "red" }} />
                      )}
                    </TableCell>
                    <TableCell>
                      {!user.isAdmin && (
                        <>
                          <Link
                            to={`/admin/user/${user._id}/edit`}
                            className="mx-2"
                          >
                            <Button
                              variant="outlined"
                              color="primary"
                              size="small"
                            >
                              <FaEdit />
                            </Button>
                          </Link>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            style={{ marginLeft: "8px" }}
                            onClick={() => deleteHandler(user._id)}
                          >
                            <FaTrash />
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {data && data.pages && (
            <Paginate pages={data.pages} page={data.page} isAdmin={true} />
          )}
        </>
      )}
    </div>
  );
};

export default UserListPage;
