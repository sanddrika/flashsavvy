import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar({ cartCount, userId, setUserId }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUserId(null);
    localStorage.removeItem("userId");
    navigate("/");
  };

  return (
    <nav className="bg-gray-800 text-white px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold">
          FlashSavvy
        </Link>

        <div className="hidden md:flex space-x-4 items-center">
          <Link to="/">Home</Link>
          <Link to="/cart">Cart ({cartCount})</Link>
          {userId ? (
            <>
              <Link to="/checkout">Checkout</Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden">
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col space-y-2 mt-3 px-2">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link to="/cart" onClick={() => setMenuOpen(false)}>
            Cart ({cartCount})
          </Link>
          {userId ? (
            <>
              <Link to="/checkout" onClick={() => setMenuOpen(false)}>
                Checkout
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
