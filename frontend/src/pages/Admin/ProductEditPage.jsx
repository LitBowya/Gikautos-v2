import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import Message from "../../components/Message/Message";
import Loader from "../../components/Loader/Loader";
import FormContainer from "../../components/Form/FormContainer";
import { toast } from "react-toastify";
import {
  useUpdateProductMutation,
  useGetProductDetailsQuery,
  useUploadProductImageMutation,
} from "../../slices/productsApiSlice";

const ProductEditPage = () => {
  const { id: productId } = useParams();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");
  const [specifics, setSpecifics] = useState([]);

  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsQuery(productId);

  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();

  const [uploadProductImage, { isLoading: loadingUpload }] =
    useUploadProductImageMutation();

  const navigate = useNavigate();
  const inputRefs = useRef({});

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(product.countInStock);
      setDescription(product.description);
      setSpecifics(
        product.specifics
          ? Object.entries(product.specifics).map(([key, value], index) => ({
              id: index,
              key,
              value,
            }))
          : []
      );
    }
  }, [product]);

  const handleSpecificsChange = (id, field, value) => {
    setSpecifics((prevSpecifics) =>
      prevSpecifics.map((specific) =>
        specific.id === id ? { ...specific, [field]: value } : specific
      )
    );
  };

  const addSpecificsField = () => {
    setSpecifics((prevSpecifics) => [
      ...prevSpecifics,
      { id: Date.now(), key: "", value: "" },
    ]);
  };

  const removeSpecificsField = (id) => {
    setSpecifics((prevSpecifics) =>
      prevSpecifics.filter((specific) => specific.id !== id)
    );
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const specificsObject = specifics.reduce(
        (obj, item) => ({ ...obj, [item.key]: item.value }),
        {}
      );

      await updateProduct({
        productId,
        name,
        price,
        image,
        brand,
        category,
        description,
        countInStock,
        specifics: specificsObject, // Convert array to object before submitting
      }).unwrap();
      toast.success("Product updated");
      navigate("/admin/productlist");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="container">
      <Link to="/admin/productlist" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Edit Product</h1>
        {loadingUpdate && <Loader />}
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error.data.message}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="price">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
              <Form.Control
                label="Choose File"
                onChange={uploadFileHandler}
                type="file"
              ></Form.Control>
              {loadingUpload && <Loader />}
            </Form.Group>

            <Form.Group className="mb-3" controlId="brand">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="countInStock">
              <Form.Label>Count In Stock</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter countInStock"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Specifics</Form.Label>
              {specifics.map((specific) => (
                <div key={specific.id} className="d-flex mb-2">
                  <Form.Control
                    type="text"
                    placeholder="Key"
                    value={specific.key}
                    onChange={(e) =>
                      handleSpecificsChange(specific.id, "key", e.target.value)
                    }
                    className="me-2"
                    ref={(el) => (inputRefs.current[specific.id] = el)}
                  />
                  <Form.Control
                    type="text"
                    placeholder="Value"
                    value={specific.value}
                    onChange={(e) =>
                      handleSpecificsChange(
                        specific.id,
                        "value",
                        e.target.value
                      )
                    }
                    className="me-2"
                  />
                  <Button
                    variant="danger"
                    onClick={() => removeSpecificsField(specific.id)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button variant="secondary" onClick={addSpecificsField}>
                Add Specifics
              </Button>
            </Form.Group>

            <Button
              type="submit"
              variant="primary"
              style={{ marginTop: "1rem" }}
            >
              Update
            </Button>
          </Form>
        )}
      </FormContainer>
    </div>
  );
};

export default ProductEditPage;
