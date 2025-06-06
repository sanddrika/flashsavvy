import React from 'react';

const Cart = ({ items, onUpdateQuantity, onRemoveItem, onCheckout }) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity >= 0) {
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Your Cart</h2>
          <p className="text-gray-500">Your cart is empty</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-extrabold text-gray-900 mb-8">Your Cart</h2>
      <div className="flow-root">
        <ul className="-my-6 divide-y divide-gray-200">
          {items.map((item) => (
            <li key={item.id} className="py-6 flex">
              <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-md overflow-hidden">
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              <div className="ml-4 flex-1 flex flex-col">
                <div>
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <h3>{item.name}</h3>
                    <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                </div>
                <div className="flex-1 flex items-end justify-between text-sm">
                  <div className="flex items-center">
                    <button
                      onClick={() => handleQuantityChange(item, item.quantity - 1)}
                      className="px-2 py-1 border rounded-l-md hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 border-t border-b">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item, item.quantity + 1)}
                      className="px-2 py-1 border rounded-r-md hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex">
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        <div className="flex justify-between text-base font-medium text-gray-900">
          <p>Subtotal</p>
          <p>${total.toFixed(2)}</p>
        </div>
        <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
        <div className="mt-6">
          <button
            onClick={onCheckout}
            className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart; 