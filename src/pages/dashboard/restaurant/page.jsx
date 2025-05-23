import { useEffect, useState } from "react";
import axios from "axios";
import { ListStart, MapPin } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import useAuth from "../../../hooks/useAuth";
import api from "../../../config/api";

export default function Restaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const { cart, addToCart, updateQuantity } = useAuth();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await api.get("/restaurants");
        setRestaurants(res.data);
      } catch (err) {
        console.error("Failed to fetch restaurants:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  const handleViewMenu = async (restaurant) => {
    if (selectedRestaurant?.id === restaurant.id && sidebarOpen) {
      setSidebarOpen(false);
      setSelectedRestaurant(null);
      return;
    }

    try {
      const res = await api.get(
        `/restaurants/${restaurant.id}/menu`
      );
      setMenuItems(res.data);
      setSelectedRestaurant(restaurant);
      setSidebarOpen(true);
    } catch (err) {
      console.error("Failed to fetch menu:", err);
    }
  };

  const getItemQty = (itemId) => {
    return cart.find((item) => item.id === itemId)?.quantity || 0;
  };

    if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }


  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      <h1 className="text-3xl font-bold text-indigo-700 mb-2">Restaurants</h1>
      <p className="text-gray-600 mb-6">
        Browse and order from available restaurants.
      </p>
  {  restaurants.length === 0 ? (
        <div className="bg-white p-6 rounded shadow text-center">
          <p className="text-gray-500">No restaurants found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {restaurant.name}
                  </h2>
                  <div className="flex items-center text-sm text-gray-500 mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{restaurant.country}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="flex items-center text-amber-500">
                    <ListStart className="w-4 h-4 mr-1" />
                    {restaurant.rating}
                  </span>
                  <span className="text-gray-500">
                    {restaurant.deliveryTime}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleViewMenu(restaurant)}
                className="w-full text-center mt-4 py-2 px-4 bg-indigo-100 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded transition"
              >
                {selectedRestaurant?.id === restaurant.id && sidebarOpen
                  ? "Hide Menu"
                  : "View Menu"}
              </button>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="sidebar"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 right-0 w-full max-w-md h-full bg-gray-50 z-40 border-l border-gray-200 shadow-md"
          >
            <div className="flex justify-between items-center px-5 py-3 border-b bg-white">
              <h2 className="text-lg font-semibold text-gray-800">
                {selectedRestaurant.name} - Menu
              </h2>
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  setSelectedRestaurant(null);
                }}
                className="text-gray-500 hover:text-red-500 text-lg "
                aria-label="Close Menu"
              >
                ×
              </button>
            </div>

            <div className="p-5 overflow-y-auto h-[calc(100%-56px)]">
              {menuItems.length === 0 ? (
                <p className="text-center text-gray-500">No items available.</p>
              ) : (
                menuItems.map((item) => (
                  <div
                    key={item.id}
                    className="border-b py-4 flex justify-between items-start"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {item.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-indigo-600 font-semibold mb-2">
                        ₹{item.price}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 text-sm"
                          onClick={() => updateQuantity(item.id, -1)}
                        >
                          −
                        </button>
                        <span className="w-5 text-center">
                          {getItemQty(item.id)}
                        </span>
                        <button
                          className="w-6 h-6 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm"
                          onClick={() => addToCart(item)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
