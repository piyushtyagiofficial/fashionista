import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/auth/AuthContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import BuyerDashboard from "./pages/BuyerDashboard";
import SellerDashboard from "./pages/SellerDashboard";
import OrdersPage from "./pages/OrdersPage";
import ProductsPage from "./pages/ProductsPage";
import ProductFormPage from "./pages/ProductFormPage";
import NotFound from "./pages/NotFound";
import PrivateRoute from "./components/routing/PrivateRoute";
import SellerRoute from "./components/routing/SellerRoute";
import WishlistPage from "./pages/WishlistPage";
import "./App.css";

function App() {
  const { loadUser } = useAuth();
  const location = useLocation();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-20">
        <Routes>
          <Route path="/" onClick={window.scrollTo(0, 0)} element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/products" element={<ProductsPage />} />

          {/* Private Routes (Buyer) */}
          <Route
            path="/checkout"
            element={
              <PrivateRoute>
                <CheckoutPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/buyer/dashboard"
            element={
              <PrivateRoute>
                <BuyerDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/buyer/orders"
            element={
              <PrivateRoute>
                <OrdersPage userType="buyer" />
              </PrivateRoute>
            }
          />

          <Route
            path="/buyer/wishlist"
            element={
              <PrivateRoute>
                <WishlistPage userType="buyer" />
              </PrivateRoute>
            }
          />

          {/* Seller Routes */}
          <Route
            path="/seller/dashboard"
            element={
              <SellerRoute>
                <SellerDashboard />
              </SellerRoute>
            }
          />
          <Route
            path="/seller/orders"
            element={
              <SellerRoute>
                <OrdersPage userType="seller" />
              </SellerRoute>
            }
          />
          <Route
            path="/seller/products"
            element={
              <SellerRoute>
                <ProductsPage />
              </SellerRoute>
            }
          />
          <Route
            path="/seller/products/new"
            element={
              <SellerRoute>
                <ProductFormPage />
              </SellerRoute>
            }
          />
          <Route
            path="/seller/products/:id/edit"
            element={
              <SellerRoute>
                <ProductFormPage />
              </SellerRoute>
            }
          />

          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;