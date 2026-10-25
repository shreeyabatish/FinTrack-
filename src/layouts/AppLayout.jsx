
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import "../styles/Dashboard.css";
import "../styles/Navbar.css";
import "../styles/Sidebar.css";

export default function AppLayout() {
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="main-area">
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
}
