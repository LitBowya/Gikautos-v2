import { useEffect, useState } from "react";
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
  TablePagination,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Button } from "@mui/material";
import { FaTimes, FaSearch } from "react-icons/fa";
import Message from "../../components/Message/Message";
import Loader from "../../components/Loader/Loader";
import { useGetOrdersQuery } from "../../slices/ordersApiSlice";
import { formatDate } from "../../utils/dateUtils";

const OrderListPage = () => {
  const { data: orders, isLoading, error, refetch } = useGetOrdersQuery();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (orders) {
      const filtered = orders.filter((order) =>
        order.user?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOrders(filtered);
    }
  }, [orders, searchTerm]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const startIndex = page * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, endIndex);

  return (
    <div className="container">
      <Typography variant="h4" gutterBottom>
        Orders
      </Typography>
      <TextField
        variant="outlined"
        label="Search by User"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={handleSearchChange}
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
          {error.message || "An error occurred"}
        </Message>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>User</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Payment Method</TableCell>
                  <TableCell>Paid</TableCell>
                  <TableCell>Delivered</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>
                      <Box
                        component="img"
                        src={
                          order.orderItems && order.orderItems.length > 0
                            ? order.orderItems[0].image
                            : "https://via.placeholder.com/50"
                        }
                        alt={`Order ${order._id}`}
                        sx={{
                          width: 50,
                          height: 50,
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    </TableCell>

                    <TableCell>{order.user && order.user.name}</TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell>GHS {order.totalPrice.toFixed(2)}</TableCell>
                    <TableCell>{order.paymentMethod}</TableCell>
                    <TableCell>
                      {order.isPaid ? (
                        formatDate(order.paidAt)
                      ) : (
                        <FaTimes style={{ color: "red" }} />
                      )}
                    </TableCell>
                    <TableCell>
                      {order.isDelivered ? (
                        formatDate(order.deliveredAt)
                      ) : (
                        <FaTimes style={{ color: "red" }} />
                      )}
                    </TableCell>
                    <TableCell>
                      <Link to={`/order/${order._id}`}>
                        <Button variant="contained" color="primary">
                          Details
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={filteredOrders.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
    </div>
  );
};

export default OrderListPage;
