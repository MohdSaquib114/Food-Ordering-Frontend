import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/auth/page";
import DashboardLayout from "./pages/dashboard/layout";
import Restaurants from "./pages/dashboard/restaurant/page";
import Cart from "./pages/dashboard/cart/cart";
import Orders from "./pages/dashboard/order/order";
import PaymentMethods from "./pages/dashboard/payment/page";

// import other pages as needed

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />                                           
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Restaurants />} />
          <Route path="restaurants" element={<Restaurants />} />
          <Route path="cart" element={<Cart />} />
          <Route path="orders" element={<Orders />} />
          <Route path="payments" element={<PaymentMethods />} />
       </Route>
    </Routes>
  );
}

export default App;
