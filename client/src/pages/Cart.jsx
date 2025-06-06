import React from "react";
import { Link } from "react-router-dom";

export default function Cart({ cart, setCart }) {
  // Sample static product data lookup (in real case, you'd enrich cart items with product info)
  const productData = {
    1: { name: "Product A", price: 19.99 },
    2: { name: "Product B", price: 29.99 },
    3: { name: "Product C", price: 9.99 },
    // Add more products here or fetch from backend
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.product_id !== productId));
  };

  const total = cart.reduce((sum, item) => {
    const product = productData[item.product_id];
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <div className="space-y-4 max-w-2xl mx-auto">
          {cart.map((item) => {
            const product = productData[item.product_id];
            return product ? (
              <div
                key={item.product_id}
                className="flex justify-between items-center border p-4 rounded shadow"
              >
                <div>
                  <h2 className="text-lg font-semibold">{product.name}</h2>
                  <p>Quantity: {item.quantity}</p>
                  <p className="text-sm text-gray-600">
                    Subtotal: ${(product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.product_id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            ) : null;
          })}

          <div className="text-right font-bold text-xl mt-4">
            Total: ${total.toFixed(2)}
          </div>

          <div className="text-right">
            <Link
              to="/checkout"
              className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-2"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
