import React from "react";
import ReactDOM from "react-dom/client";
import "util";
import "os-browserify";
import "path-browserify";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import "bootstrap/dist/css/bootstrap.min.css";
import "semantic-ui-css/semantic.min.css";
import AppErrorBoundary from "./ErrorBoundary.jsx";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import PrivateRoute from "./components/Private Route/PrivateRoute";
import AdminRoute from "./components/AdminRoute/AdminRoute.jsx";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage.jsx";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ShippingPage from "./pages/ShippingPage";
import PaymentPage from "./pages/PaymentPage";
import PlaceOrderPage from "./pages/PlaceOrderPage";
import OrderPage from "./pages/OrderPage";
import ProfilePage from "./pages/ProfilePage";
import OrderListPage from "./pages/Admin/OrderListPage.jsx";
import ProductListPage from "./pages/Admin/ProductListPage.jsx";
import ProductEditPage from "./pages/Admin/ProductEditPage.jsx";
import UserListPage from "./pages/Admin/UserListPage.jsx";
import UserEditPage from "./pages/Admin/UserEditPage.jsx";
import ProductByCategoryPage from "./pages/ProductByCategoryPage.jsx";
import ShopPage from "./pages/ShopPage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import SearchBox from "./components/Search/SearchBox.jsx";
import MechanicHomepage from "./pages/Mechanic/MechanicHomepage.jsx";
import MechanicDetailPage from "./pages/Mechanic/MechanicDetailPage.jsx";
import AdminLayout from "./pages/Admin/AdminLayout.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/" element={<HomePage />} />
      <Route path="/search/:keyword" element={<HomePage />} />
      <Route path="/page/:pageNumber" element={<HomePage />} />
      <Route path="/category/:category" element={<ProductByCategoryPage />} />
      <Route path="/search" element={<SearchBox />} />
      <Route path="/search/:keyword/page/:pageNumber" element={<HomePage />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/wishlist" element={<WishlistPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/mechanic" element={<MechanicHomepage />} />
      <Route path="/mechanic/:id" element={<MechanicDetailPage />} />

      <Route path="" element={<PrivateRoute />}>
        <Route path="/shipping" element={<ShippingPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/placeorder" element={<PlaceOrderPage />} />
        <Route path="/chatpage" element={<ChatPage />} />
        <Route path="/order/:id" element={<OrderPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route path="" element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="orderlist" element={<OrderListPage />} />
          <Route path="productlist" element={<ProductListPage />} />
          <Route path="product/:id/edit" element={<ProductEditPage />} />
          <Route path="userlist" element={<UserListPage />} />
          <Route path="user/:id/edit" element={<UserEditPage />} />
          <Route path="productlist/:pageNumber" element={<ProductListPage />} />
        </Route>
      </Route>
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AppErrorBoundary>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </AppErrorBoundary>
  </React.StrictMode>
);

reportWebVitals();
