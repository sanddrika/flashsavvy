import React from "react";
import { Link } from "react-router-dom";
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();

  const total = cart.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center">Your Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-600 mb-4">Your cart is empty.</p>
          <Link
            to="/"
            className="inline-block bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition-colors duration-200"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.product_id}
                className="flex justify-between items-center bg-white p-4 rounded-lg shadow"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-gray-600">
                    ${item.price.toFixed(2)} × {item.quantity}
                  </p>
                  <p className="font-medium text-indigo-600">
                    Subtotal: ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200 transition-colors duration-200"
                    >
                      -
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200 transition-colors duration-200"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product_id)}
                    className="text-red-600 hover:text-red-700 transition-colors duration-200"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold">Total:</span>
              <span className="text-2xl font-bold">${total.toFixed(2)}</span>
            </div>
            <Link
              to="/checkout"
              className="block w-full text-center bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
