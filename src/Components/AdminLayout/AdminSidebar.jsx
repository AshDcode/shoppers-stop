import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./AdminSidebar.css";

const AdminSidebar = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside className={`admin-sidebar ${collapsed ? "collapsed" : ""}`}>
            <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
                {collapsed ? "☰" : "✕"}
            </button>
            <h2>{!collapsed && "Admin Panel"}</h2>
            <nav>
                <ul>
                    <li><NavLink to="/admin">Admin Dashboard</NavLink></li>
                    <li><NavLink to="/admin/products">Manage Products</NavLink></li>
                    <li><NavLink to="/admin/orders">Manage Orders</NavLink></li>
                    <li><NavLink to="/admin/users">Manage Users</NavLink></li>
                </ul>
            </nav>
        </aside>
    );
};

export default AdminSidebar;
