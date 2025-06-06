import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Register from "./pages/Register";
import Login from "./pages/Login";

export default function App() {
  const [cart, setCart] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar
          cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
          userId={userId}
          setUserId={setUserId}
        />
        <main className="flex-grow p-4">
          <Routes>
            <Route path="/" element={<Home cart={cart} setCart={setCart} />} />
            <Route
              path="/cart"
              element={<Cart cart={cart} setCart={setCart} />}
            />
            <Route
              path="/checkout"
              element={
                <Checkout userId={userId} cart={cart} setCart={setCart} />
              }
            />
            <Route
              path="/register"
              element={<Register setUserId={setUserId} />}
            />
            <Route path="/login" element={<Login setUserId={setUserId} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
