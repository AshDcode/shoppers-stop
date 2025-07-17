import  useDashboardStats  from "./useDashboardStats";
import "./DashboardStats.css";
export const DashboardStats = () => {
    const { totalOrders, totalUsers, totalProducts, totalRevenue } = useDashboardStats();
    
        return (
            <div className="dashboard-stats">
                <h2>Dashboard Overview</h2>
                {/* <div className="stats-grid">
                    <div className="stat-card">Total Orders<br /><strong>54</strong></div>
                    <div className="stat-card">Total Products<br /><strong>120</strong></div>
                    <div className="stat-card">Total Users<br /><strong>38</strong></div>
                    <div className="stat-card">Revenue<br /><strong>₹72,500</strong></div>
                </div> */}
    
                <div className="stat-card orders">
                    <h3>{totalOrders}</h3><p>Total Orders</p>
                </div>
                <div className="stat-card users">
                    <h3>{totalUsers}</h3><p>Total Users</p>
                </div>
                <div className="stat-card products">
                    <h3>{totalProducts}</h3><p>Total Products</p>
                </div>
                <div className="stat-card revenue">
                    <h3>${totalRevenue.toFixed(2)}</h3><p>Total Revenue</p>
                </div>
            </div>
        );
    };