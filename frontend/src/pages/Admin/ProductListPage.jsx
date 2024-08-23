import { useState, useEffect } from "react";
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
import { FaEdit, FaPlus, FaTrash, FaSearch } from "react-icons/fa";
import { useParams } from "react-router-dom";
import Message from "../../components/Message/Message";
import Loader from "../../components/Loader/Loader";
import Paginate from "../../components/Paginate/Paginate";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useCreateProductMutation,
} from "../../slices/productsApiSlice";
import { toast } from "react-toastify";

const ProductListScreen = () => {
  const { pageNumber } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const { data, isLoading, error, refetch } = useGetProductsQuery({
    pageNumber,
  });
  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation();
  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure")) {
      try {
        await deleteProduct(id);
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || "Failed to delete product");
      }
    }
  };

  const createProductHandler = async () => {
    if (window.confirm("Are you sure you want to create a new product?")) {
      try {
        await createProduct();
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || "Failed to create product");
      }
    }
  };

  useEffect(() => {
    if (data) {
      console.log("Original Products:", data.products);
      const sortedProducts = data.products
        .filter((product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
          console.log(
            "Comparing:",
            new Date(a.updatedAt),
            new Date(b.updatedAt)
          );
          return new Date(a.updatedAt) - new Date(b.updatedAt);
        });

      console.log("Sorted Products:", sortedProducts);
      setFilteredProducts(sortedProducts);
    } else {
      setFilteredProducts([]);
    }
  }, [data, searchTerm]);


  return (
    <div className="container" style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={createProductHandler}
        style={{ marginBottom: "20px" }}
      >
        <FaPlus /> Create Product
      </Button>

      <TextField
        variant="outlined"
        label="Search Products"
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

      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">
          {error?.data?.message || "An error occurred while fetching products."}
        </Message>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Count In Stock</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Brand</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <Box
                        component="img"
                        src={product.image || "https://via.placeholder.com/50"}
                        alt={product.name}
                        sx={{
                          width: 50,
                          height: 50,
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.countInStock}</TableCell>
                    <TableCell>GHS {product.price.toFixed(2)}</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>{product.brand}</TableCell>
                    <TableCell>
                      <Link to={`/admin/product/${product._id}/edit`}>
                        <Button variant="outlined" color="primary" size="small">
                          <FaEdit />
                        </Button>
                      </Link>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        style={{ marginLeft: "8px" }}
                        onClick={() => deleteHandler(product._id)}
                      >
                        <FaTrash />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Paginate pages={data.pages} page={data.page} isAdmin={true} />
        </>
      )}
    </div>
  );
};

export default ProductListScreen;
