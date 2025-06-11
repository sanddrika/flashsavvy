import React from "react";
import { ShoppingBagIcon } from '@heroicons/react/24/outline';

const ProductCard = ({ product, onAddToCart }) => {
  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
  
  // Get the image URL based on the product name
  const getImageUrl = (productName) => {
    const name = productName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '') // Remove all special characters and spaces
      .trim();
    console.log('Image path:', `/images/${name}.jpg`); // Debug log
    return `/images/${name}.jpg`;
  };
  
  return (
    <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-amber-100">
      {/* Product image */}
      <div className="aspect-w-1 aspect-h-1 bg-amber-50">
        <img
          src={getImageUrl(product.name)}
          alt={product.name}
          className="w-full h-48 object-cover object-center group-hover:opacity-75 transition-opacity duration-300"
          onError={(e) => {
            console.log('Image failed to load:', e.target.src); // Debug log
            e.target.onerror = null;
            e.target.src = 'https://placehold.co/400x400/e5e7eb/a3a3a3?text=No+Image';
          }}
        />
      </div>
      
      <div className="p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-[#2C1810] group-hover:text-[#8B4513] transition-colors duration-200">
            {product.name}
          </h2>
          <p className="mt-2 text-sm text-[#6B3410] line-clamp-2">
            {product.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-[#2C1810]">
            ${price.toFixed(2)}
          </p>
          <button
            onClick={onAddToCart}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-[#8B4513] text-amber-50 hover:bg-[#6B3410] transition-colors duration-200 gap-2"
          >
            <ShoppingBagIcon className="h-5 w-5" />
            <span>Add to Cart</span>
          </button>
        </div>

        {product.stock < 10 && (
          <p className="mt-3 text-sm text-[#8B4513] font-medium">
            Only {product.stock} left in stock!
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
