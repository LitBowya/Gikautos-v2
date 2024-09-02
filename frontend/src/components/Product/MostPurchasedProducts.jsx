
import Product from "./Product";
import Loader from "../Loader/Loader";
import Message from "../Message/Message";
import { useGetMostPurchasedProductsQuery } from "../../slices/productsApiSlice";
import TopProductCss from "./TopProduct.module.css";


const TopProduct = () => {
  const {
    data: products,
    isLoading,
    error,
  } = useGetMostPurchasedProductsQuery();

  return (
    <div className={TopProductCss.topProduct}>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : products ? (
        <div className={TopProductCss.productContainer}>
          <div className={TopProductCss.div1}>
            <img
              src="/images/ProductSection/latest-products.jpg"
              alt="topProduct"
            />
            <div className={TopProductCss.div1Text}>
              <p>
                Customer <span>Favorites</span>
              </p>
              <p>Top-selling parts trusted by drivers</p>
            </div>
          </div>
          <div className={TopProductCss.div2}>
            <h2>
              Most Purchased <span>Products</span>
            </h2>
            <hr />
            <div className={TopProductCss.products}>
              {products.map((product) => (
                <div key={product._id} className={TopProductCss.product}>
                  <Product product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <Message variant="info">No products available</Message>
      )}
    </div>
  );
};

export default TopProduct;
