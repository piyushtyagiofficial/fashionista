import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/auth/AuthContext.jsx';
import { CartProvider } from './context/cart/CartContext.jsx';
import { ProductProvider } from './context/product/ProductContext.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <App />
            <ToastContainer position="top-right" autoClose={3000} />
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </Router>
  </StrictMode>
);