import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronDown } from "lucide-react";
import useAuth from "../../../hooks/useAuth";
import api from "../../../config/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCancel, setCancel] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPaying,setPaying] = useState(false)
  const { user } = useAuth();


  useEffect(() => {
    setLoading(true);
    api
      .get("/orders")
      .then((res) => setOrders(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Fetch payment methods
  useEffect(() => {
    api
      .get("/payment-methods")
      .then((res) => {
        setPaymentMethods(res.data);
        if (res.data.length) setPaymentMethod(res.data[0].id);
      })
      .catch((err) => console.error("Payment methods fetch error:", err));
  }, []);

  const calculateOrderTotal = (items) =>
    items.reduce((acc, i) => acc + i.menuItem.price * i.quantity, 0);

  const formatDate = (str) =>
    new Date(str).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const getStatusColor = (status) => {
    const map = {
      PENDING: "bg-yellow-100 text-yellow-800",
      CONFIRMED: "bg-blue-100 text-blue-800",
      PREPARING: "bg-orange-100 text-orange-800",
      DELIVERED: "bg-green-100 text-green-800",
      CANCELLED: "bg-red-100 text-red-800",
    };
    return map[status] || "bg-gray-100 text-gray-800";
  };

  const handleCancelOrder = async (orderId) => {
    setCancel(true);
    try {
      await api.patch(`/orders/${orderId}/cancel`);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "CANCELLED" } : o))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setCancel(false);
    }
  };

  const handleCheckoutAndPay = (order) => {
    setSelectedOrder(order);
    setIsPaymentModalOpen(true);
  };

  const handlePayment = async () => {
    setPaying(true)
    try {
      const res = await api.post(
        `/orders/${selectedOrder.id}/checkout`,{paymentMethodId:paymentMethod}
      );
      console.log(res)
      setOrders((prev) =>
        prev.map((o) =>
          o.id === selectedOrder.id ? { ...o, status: "CONFIRMED" } : o
        )
      );
      setIsPaymentModalOpen(false);
      setSelectedOrder(null);
    } catch (error) {
      console.log(error);
    }finally{
        setPaying(false)
    }
  };
 if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-1">Your Orders</h1>
          <p className="text-gray-600 text-sm md:text-base">
            {orders.length} orders found
          </p>
        </div>
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6 text-sm md:text-base"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-800 text-base md:text-lg">
                      Order #{order.id}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full font-medium text-xs md:text-sm ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="space-y-3 mb-4">
                  {order.orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col md:flex-row md:justify-between md:items-center gap-1"
                    >
                      <div>
                        <p className="font-medium text-gray-800">
                          {item.menuItem.name} × {item.quantity}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {item.menuItem.description}
                        </p>
                        <p className="text-blue-500 text-xs">
                          {item.restaurant.name}
                        </p>
                      </div>
                      <div className="text-right text-sm">
                        ₹{item.menuItem.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100 text-sm md:text-base">
                  <span className="font-medium">Total</span>
                  <span className="font-semibold">
                    ₹{calculateOrderTotal(order.orderItems)}
                  </span>
                </div>

                {user.role !== "MEMBER" && (
                  <div className="flex flex-wrap justify-end gap-3 mt-4">
                    {order.status === "PENDING" && (
                      <>
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="px-4 py-2 border border-red-300 text-red-600 rounded hover:bg-red-50"
                        >
                          {isCancel ? (
                            <div className="animate-spin h-4 w-4 border-b-2 border-red-500 rounded-full mx-auto" />
                          ) : (
                            "Cancel"
                          )}
                        </button>
                        <button
                          onClick={() => handleCheckoutAndPay(order)}
                          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                        >
                          Checkout & Pay
                        </button>
                      </>
                    )}
                    {order.status === "CANCELLED" && (
                      <span className="px-4 py-2 bg-gray-100 text-gray-500 rounded">
                        Cancelled
                      </span>
                    )}
                    {["CONFIRMED", "PREPARING"].includes(order.status) && (
                      <span className="px-4 py-2 bg-blue-50 text-blue-600 rounded">
                        Payment Completed
                      </span>
                    )}
                    {order.status === "DELIVERED" && (
                      <span className="px-4 py-2 bg-green-50 text-green-600 rounded">
                        Delivered
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
       

        {/* Sliding Bottom Drawer */}
        <AnimatePresence>
          {isPaymentModalOpen && selectedOrder && (
            <motion.div
              key="payment-drawer"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ duration: 0.3 }}
              className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50"
            >
              <div className="px-6 py-5 max-h-[70vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">
                    Payment - Order #{selectedOrder.id}
                  </h2>
                  <button
                    onClick={() => setIsPaymentModalOpen(false)}
                    className="p-1 rounded hover:bg-gray-100"
                  >
                    <X size={18} className="text-gray-500" />
                  </button>
                </div>

                <div className="mb-4">
                  <h4 className="text-gray-700 font-medium mb-2">Items</h4>
                  {selectedOrder.orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between text-sm mb-1"
                    >
                      <span>
                        {item.menuItem.name} × {item.quantity}
                      </span>
                      <span>₹{item.menuItem.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-semibold border-t border-gray-200 pt-2 mt-2">
                    <span>Total</span>
                    <span>
                      ₹{calculateOrderTotal(selectedOrder.orderItems)}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-gray-600 mb-2">
                    Payment Method
                  </label>
                  <div className="relative">
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {paymentMethods.map((method) => (
                        <option key={method.id} value={method.id}>
                          {method.type}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                  </div>
                </div>
                <button
                  onClick={handlePayment}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded font-medium"
                >
                      {isPaying ? (
                            <div className="animate-spin h-4 w-4 border-b-2 border-white rounded-full mx-auto" />
                          ) : (
                            `Pay ₹${calculateOrderTotal(selectedOrder.orderItems)}`
                          )}
                  
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
