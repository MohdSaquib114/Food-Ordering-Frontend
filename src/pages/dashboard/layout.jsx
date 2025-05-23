import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../../components/sidebar";
import useAuth from "../../hooks/useAuth";

export default function DashboardLayout() {
  let navigate = useNavigate();
  const {  isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    navigate("/");
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-y-hidden">
      <Sidebar />
      <main className="flex-1 p-6 overflow-y-scroll">
        <Outlet />
      </main>
    </div>
  );
}
