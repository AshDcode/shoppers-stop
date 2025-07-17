import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";

 function useDashboardStats() {
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalUsers: 0,
        totalProducts: 0,
        totalRevenue: 0,
    });

    useEffect(() => {
        async function fetchStats() {
            // Orders
            const ordersSnap = await getDocs(collection(db, "orders"));
            const orders = ordersSnap.docs.map(doc => doc.data());
            const totalOrders = orders.length;
            const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);

            // Users
            const usersSnap = await getDocs(collection(db, "users"));
            const totalUsers = usersSnap.size;

            // Products
            let totalProducts = 0;
            try {
                const pSnap = await getDocs(collection(db, "products"));
                totalProducts = pSnap.size;
            } catch {
                totalProducts = 0;
            }

            setStats({ totalOrders, totalUsers, totalProducts, totalRevenue });
        }

        fetchStats();
    }, []);

    return stats;

}

export default useDashboardStats;