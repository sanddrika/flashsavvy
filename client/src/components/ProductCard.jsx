import React from "react";

export default function ProductCard({ product, addToCart }) {
  return (
    <div className="border rounded-lg shadow-sm p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-lg font-semibold mb-1">{product.name}</h2>
        <p className="text-sm text-gray-600 mb-2">{product.description}</p>
        <p className="text-md font-bold text-gray-800">
          ${product.price.toFixed(2)}
        </p>
      </div>
      <button
        onClick={() => addToCart(product)}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Add to Cart
      </button>
    </div>
  );
}
