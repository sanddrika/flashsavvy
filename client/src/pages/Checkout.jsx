import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Checkout({ userId, cart, setCart }) {
  const navigate = useNavigate();

  const productData = {
    1: { name: "Product A", price: 19.99 },
    2: { name: "Product B", price: 29.99 },
    3: { name: "Product C", price: 9.99 },
    // Add your real product data or fetch dynamically
  };

  const total = cart.reduce((sum, item) => {
    const product = productData[item.product_id];
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const handleCheckout = async () => {
    if (!userId) {
      alert("You must be logged in to place an order.");
      return;
    }

    try {
      const orderItems = cart.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      }));

      await axios.post("http://localhost:3000/orders", {
        user_id: userId,
        items: orderItems,
      });

      alert("Order placed successfully!");
      setCart([]);
      navigate("/");
    } catch (err) {
      console.error("Checkout failed:", err);
      alert("Failed to place order. Try again later.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Checkout</h1>

      {cart.length === 0 ? (
        <p className="text-center">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item) => {
              const product = productData[item.product_id];
              return product ? (
                <div
                  key={item.product_id}
                  className="border p-4 rounded shadow flex justify-between items-center"
                >
                  <div>
                    <h2 className="text-lg font-semibold">{product.name}</h2>
                    <p>Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold">
                    ${(product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ) : null;
            })}
          </div>

          <div className="text-right text-xl font-bold mt-4">
            Total: ${total.toFixed(2)}
          </div>

          <div className="text-right mt-6">
            <button
              onClick={handleCheckout}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Place Order
            </button>
          </div>
        </>
      )}
    </div>
  );
}
