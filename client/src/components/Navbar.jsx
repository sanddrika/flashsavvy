import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { 
  ShoppingBagIcon, 
  UserCircleIcon, 
  HomeIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/solid';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-[#2502cc] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-white hover:text-[#0366cc] transition-colors duration-200">
                ⚡ FlashSavvy
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className="inline-flex items-center px-3 py-2 text-white hover:text-[#0366cc] hover:bg-[#2502cc]/90 rounded-md transition-all duration-200"
              >
                <HomeIcon className="h-5 w-5 mr-1" />
                Home
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="inline-flex items-center px-3 py-2 text-white hover:text-[#0366cc] hover:bg-[#2502cc]/90 rounded-md transition-all duration-200"
                >
                  <ShieldCheckIcon className="h-5 w-5 mr-1" />
                  Admin
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Link 
                to="/cart" 
                className="group relative inline-flex items-center p-2"
                aria-label="Shopping cart"
              >
                <div className="relative">
                  <ShoppingBagIcon 
                    className="h-7 w-7 text-white group-hover:text-[#0366cc] transition-colors duration-200" 
                  />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                      {totalItems}
                    </span>
                  )}
                </div>
              </Link>
            </div>
            <div className="flex items-center">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 text-white hover:text-[#0366cc] transition-colors duration-200">
                    <UserCircleIcon className="h-6 w-6" />
                    <span className="text-sm font-medium">Profile</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-white hover:text-[#0366cc] hover:bg-[#2502cc]/90 rounded-md transition-all duration-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="space-x-4">
                  <Link
                    to="/login"
                    className="text-white hover:text-[#0366cc] transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#0366cc] hover:bg-[#0366cc]/90 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
