import { Link } from "react-router-dom";
import { useGetProductsByCategoryQuery } from "../../slices/productsApiSlice";
import Product from "../Product/Product";
import Loader from "../Loader/Loader";
import Message from "../Message/Message";
import ProductCategoryCss from "./ProductCategory.module.css";


const ProductByCategory = ({ category }) => {
  const {
    data: products,
    isLoading,
    error,
  } = useGetProductsByCategoryQuery({ category });

  const categoryImages = {
    Lubricants: "/images/ProductSection/lubricants.jpg",
    Batteries: "/images/ProductSection/batteries.jpg",
    Filters: "/images/ProductSection/filters.jpg",
    Belts: "/images/ProductSection/belts.jpg",
  };

  const categoryTexts = {
    Lubricants: {
      title: "Smooth Operators",
      subtitle: "Keep your engine running like silk",
    },
    Batteries: {
      title: "Power Sources",
      subtitle: "Reliable energy for every journey",
    },
    Filters: {
      title: "Pure Performance",
      subtitle: "Breathe new life into your engine",
    },
    Belts: {
      title: "Drive Essentials",
      subtitle: "Keeping your engine components in sync",
    },
  };

  // Get the correct image path for the current category
  const imagePath =
    categoryImages[category] || "/images/ProductSection/default.jpg";

  const { title, subtitle } = categoryTexts[category] || {
    title: "Products",
    subtitle: "Explore our range",
  };

  return (
    <div className={ProductCategoryCss.topProduct}>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : products ? (
        <div className={ProductCategoryCss.productContainer}>
          <div className={ProductCategoryCss.div1}>
            <h2>
              Products in <span>{category}</span>
            </h2>
            <Link to={`/category/${category}`} className={ProductCategoryCss.link}>
              {" "}
              {">>"}{" "}
            </Link>
            <hr />
            <div className={ProductCategoryCss.products}>
              {products.slice(0, 6).map((product) => (
                <div key={product._id} className={ProductCategoryCss.product}>
                  <Product product={product} />
                </div>
              ))}
            </div>
          </div>
          <div className={ProductCategoryCss.div2}>
            <img src={imagePath} alt={`${category} products`} />
            <div className={ProductCategoryCss.div1Text}>
              <p>
                {title
                  .split(" ")
                  .map((word, index) =>
                    index === 0 ? <span key={index}>{word}</span> : ` ${word}`
                  )}
              </p>
              <p>{subtitle}</p>
            </div>
          </div>
        </div>
      ) : (
        <Message variant="info">No products available</Message>
      )}
    </div>
  );
};

export default ProductByCategory;
