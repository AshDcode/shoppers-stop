import "./AdminDashboard.css";
import { DashboardStats } from "./DashboardStats";
import useDashboardStats from "./useDashboardStats";

const AdminDashboard = () => {

    return (
        <div>
            <h1>
                Admin Dashboard
            </h1>
            <DashboardStats />
        </div>
    )
}
export default AdminDashboard;
