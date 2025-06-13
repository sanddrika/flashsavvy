import React, { useEffect, useState } from "react";
import { useCart } from '../context/CartContext';
import ProductCard from "../components/ProductCard";
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { productsAPI } from '../api/config';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching products...');
        const response = await productsAPI.getAll();
        console.log('Products response:', response);
        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching products:', err);
        console.error('Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        setError('Failed to fetch products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddToCart = (product) => {
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart(product);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#0366cc]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-50 p-6 rounded-lg shadow-sm">
          <h3 className="text-red-800 font-medium text-lg">Error Loading Products</h3>
          <p className="text-red-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#2C1810] to-[#8B4513] text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-amber-50">
              Welcome to FlashSavvy ⚡
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-amber-100">
              Discover amazing products at unbeatable prices
            </p>
            <div className="relative max-w-xl mx-auto">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 rounded-full text-gray-800 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-[#8B4513] pl-12"
              />
              <MagnifyingGlassIcon className="h-6 w-6 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-[#2C1810]">
            {searchQuery ? 'Search Results' : 'Featured Products'}
          </h2>
          <span className="text-[#6B3410]">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} available
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl text-[#6B3410]">No products found matching your search.</h3>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 text-[#8B4513] hover:text-[#6B3410] font-medium"
            >
              Clear search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <div key={product.id} className="transform hover:-translate-y-1 transition-transform duration-200">
                <ProductCard
                  product={product}
                  onAddToCart={() => handleAddToCart(product)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
