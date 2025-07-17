import { collection, doc, getDocs, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react"
import { db } from "../../firebaseConfig";
import "./ManageOrders.css";
const ManageOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     const fetchOrders = async () => {
    //         const snapshot = await getDocs(collection(db, "orders"));
    //         setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data })));
    //         setLoading(false);
    //     };
    //     fetchOrders();
    // }, []);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "orders"), snapshot => {
            setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);


    const updateStatus = async (orderId, newStatus) => {
        await updateDoc(doc(db, "orders", orderId), { status: newStatus }),
            setOrders(prev =>
                prev.map(o => (o.id === orderId) ? { ...o, status: newStatus } : o)
            );
    };

    if (loading) return <p>Loading Orders....</p>;

    return (
        <div className="manage-orders">
            <h2>Manage Orders</h2>
            <table>
                <thead>
                    <tr>
                        <th>Orders #</th>
                        <th>Users</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(o => (
                        <tr key={o.id}>
                            <td>{o.id}</td>
                            <td>{o.userName || (o.shipping?.name) || "unknown"}</td>
                            <td>{o.items && o.items.length ? o.items.length : 0}</td>
                            <td>${o.total !== undefined ? o.total : "0.00"}</td>
                            <td className={`status ${o.status ? o.status.toLowerCase() : "unknown"}`}>
                                {o.status || "Unknown"}
                            </td>
                            <td>
                                <button onClick={() => navigate(`/order/${o.id}`)}>View</button>
                            </td>

                            <td>
                                <select
                                    value={o.status || "pending"}
                                    onChange={e => updateStatus(o.id, e.target.value)}
                                >
                                    {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
export default ManageOrders;