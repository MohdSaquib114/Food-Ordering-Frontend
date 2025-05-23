import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import {
  Clipboard,
  HomeIcon,
  LogOut,
  ShoppingCartIcon,
  Menu,
  CreditCard,
} from "lucide-react";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const { logout, user } = useAuth();

  useEffect(() => {
    function handleResize() {
      setIsMobileView(window.innerWidth < 1024);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    { name: "Restaurants", path: "restaurants", icon: <HomeIcon size={18} /> },
    { name: "Cart", path: "cart", icon: <ShoppingCartIcon size={18} /> },
    { name: "Orders", path: "orders", icon: <Clipboard size={18} /> },
  ];

  // Add Payment route if user is ADMIN
  if (user?.role === "ADMIN") {
    navItems.push({
      name: "Payments",
      path: "payments",
      icon: <CreditCard size={18} />,
    });
  }

  const sidebarCollapsed = collapsed || isMobileView;

  return (
    <aside
      className={`bg-white shadow p-4 transition-all duration-300 ${
        sidebarCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Collapse toggle */}
      {!isMobileView && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mb-6 text-indigo-600 hover:text-indigo-800 transition-all duration-200"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Brand */}
      <h2
        className={`text-xl font-bold text-indigo-600 mb-6 whitespace-nowrap transition-opacity duration-300 ${
          sidebarCollapsed ? "opacity-0" : "opacity-100"
        }`}
      >
        FoodOrder
      </h2>

      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={`/dashboard/${item.path}`}
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded transition-all duration-300 text-sm font-medium ${
                isActive
                  ? "bg-indigo-200 text-indigo-700 scale-[1.02]"
                  : "text-gray-700 hover:bg-indigo-100"
              }`
            }
          >
            <span className="text-indigo-600">{item.icon}</span>
            {!sidebarCollapsed && <span className="truncate">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={logout}
        className={`mt-10 flex items-center gap-2 px-3 py-2 rounded text-red-600 hover:bg-red-100 transition-all duration-200 text-sm font-medium ${
          sidebarCollapsed ? "justify-center" : ""
        }`}
      >
        <LogOut size={18} />
        {!sidebarCollapsed && "Logout"}
      </button>
    </aside>
  );
}
