import React from "react";

const ProductCard = ({ product, onAddToCart }) => {
  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
  
  return (
    <div className="border rounded-lg shadow-sm p-4 flex flex-col justify-between bg-white">
      <div>
        <h2 className="text-lg font-semibold mb-1">{product.name}</h2>
        <p className="text-sm text-gray-600 mb-2">{product.description}</p>
        <p className="text-md font-bold text-gray-800">
          ${price.toFixed(2)}
        </p>
      </div>
      <button
        onClick={onAddToCart}
        className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors duration-200"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
