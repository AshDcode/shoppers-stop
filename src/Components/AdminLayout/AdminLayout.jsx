
import { Outlet } from "react-router-dom";
import "./AdminLayout.css";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
    
    return (
        <div className="admin-layout">
            <AdminSidebar />
            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;