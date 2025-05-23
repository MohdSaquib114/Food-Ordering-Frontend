import React, { useState } from "react";
import { Loader2, Minus, Plus, Trash2 } from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import axios from "axios";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, setCart } = useAuth();
  const [loading, setLoading] = useState(false);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      await axios.post(`http://localhost:9000/api/orders`, { items: cart });

      setCart([]);
    } catch (error) {
      console.error("Failed to place order:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (itemId, change) => {
    const item = cart.find((item) => item.id === itemId);
    if (item) {
      const newQuantity = item.quantity + change;
      updateQuantity(itemId, newQuantity);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center py-16">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Your Cart is Empty
            </h1>
            <p className="text-gray-600">Add some items to get started!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Cart</h1>
          <p className="text-gray-600">{cart.length} items in your cart</p>
        </div>

        {/* Cart Items */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-24">
          {cart.map((item, index) => (
            <div
              key={item.id}
              className={`p-6 ${
                index !== cart.length - 1 ? "border-b border-gray-200" : ""
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 pr-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {item.description}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Quantity:</span>
                      <div className="flex items-center bg-gray-100 rounded-lg">
                        <button
                          onClick={() => handleQuantityChange(item.id, -1)}
                          className="p-2 hover:bg-gray-200 rounded-l-lg transition-colors duration-200"
                          disabled={item.quantity <= 1}
                        >
                          <Minus
                            size={16}
                            className={
                              item.quantity <= 1
                                ? "text-gray-400"
                                : "text-gray-600"
                            }
                          />
                        </button>
                        <span className="px-4 py-2 bg-white text-sm font-medium min-w-[3rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="p-2 hover:bg-gray-200 rounded-r-lg transition-colors duration-200"
                        >
                          <Plus size={16} className="text-gray-600" />
                        </button>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      ₹{item.price} each
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="flex items-center space-x-1 text-red-600 hover:text-red-700 text-sm font-medium transition-colors duration-200"
                    >
                      <Trash2 size={16} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Total Section */}
          <div className="p-6 bg-gray-50 rounded-b-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-gray-900">
                ₹{calculateTotal()}
              </span>
            </div>
          </div>
        </div>

        {/* Place Order Button - Fixed at bottom right */}
        <div className="fixed bottom-6 right-6">
          <button
            onClick={handlePlaceOrder}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-full shadow-lg transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              "Place Order"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
