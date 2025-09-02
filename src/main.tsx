import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import App from './App.tsx'
import About from "./pages/About.tsx";
import Contact from "./pages/Contact.tsx";
import Shop from "./pages/Shop.tsx";
import Cart from "./pages/Cart.tsx";
import Checkout from "./pages/Checkout.tsx"; 
import ProductDetails from "./pages/ProductDetails.tsx";
import Profile from "./pages/Profile.tsx"; 
import OrderHistory from "./pages/OrderHistory.tsx"; 
import Settings from "./pages/Settings.tsx";
import Navbar from "./components/Navbar.tsx";
import { CartProvider } from "./components/context/CartContext.tsx";
import { AuthProvider } from "./components/context/AuthContext.tsx"; 

import { Provider } from './components/ui/provider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" index element={<App />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetails />} /> 
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} /> 
              <Route path="/profile" element={<Profile />} /> 
              <Route path="/history" element={<OrderHistory />} />
              <Route path="/settings" element={<Settings />} /> 
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </Provider>
  </React.StrictMode>
)