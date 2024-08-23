import { useEffect, useState } from "react";
import { Outlet, useLocation, matchPath } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header/Header";
import Loader from "./components/Loader/Loader";

import {
  useGetTopProductsQuery,
  useGetLatestProductsQuery,
  useGetMostPurchasedProductsQuery,
} from "./slices/productsApiSlice";

const App = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation(); // Get the current route

  const { isLoading: topProductLoading, refetch } = useGetTopProductsQuery();
  const { isLoading: latestProductLoading } = useGetLatestProductsQuery();
  const { isLoading: mostPurchasedProductLoading } =
    useGetMostPurchasedProductsQuery();

  useEffect(() => {
    if (
      !topProductLoading &&
      !latestProductLoading &&
      !mostPurchasedProductLoading
    ) {
      setLoading(false);
      refetch();
    }
  }, [
    topProductLoading,
    latestProductLoading,
    mostPurchasedProductLoading,
    refetch,
  ]);

  // Define the routes where the header should not be displayed
  const routesWithoutHeader = [
    "/chatpage",
    "/admin",
    "/admin/productlist",
    "/admin/dashboard",
    "/admin/userlist",
    "/admin/orderlist",
    "/admin/product/:id/edit",
    "/admin/user/:id/edit",
    "/admin/productlist/:pageNumber",
  ];

  // Check if the current route is in the routesWithoutHeader array
  const shouldHideHeader = (pathname) => {
    return routesWithoutHeader.some((route) =>
      matchPath({ path: route, exact: true }, pathname)
    );
    };

    const hideHeader = shouldHideHeader(location.pathname);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div>
          {!hideHeader && <Header />} {/* Conditionally render Header */}
          <main className="">
            <Outlet />
          </main>
          {/* <Footer /> */}
          <ToastContainer
            position="bottom-right"
            autoClose={1500}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            draggable
            pauseOnHover
          />
        </div>
      )}
    </>
  );
};

export default App;
