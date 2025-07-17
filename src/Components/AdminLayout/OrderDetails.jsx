import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"

const OrderDetails = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            const docSnap = await getDoc(doc, (db, "orders", orderId));
            if (docSnap.exists()) {
                setOrder({ id: docSnap.id, ...docSnap.data() });
            }
            setLoading(false);
        };
        fetchOrder();
    }, [orderId]);

    const markAsDelivered = async () => {
        await updateDoc(doc(db, "orders", orderId), { status: "Delivered" });
        setOrder((prev) => ({ ...prev, status: "Delivered" }));
    };

    if (loading) return <p>Loading.....</p>;
    if (!order) return <p>Order not found.</p>;

    return (
        <div className="order-details">
            <h2>Order #{order.id}</h2>
            <p><strong>Status:</strong><span className={`status ${order.status.toLowerCase()}`}>{order.status}</span></p>
            <p><strong>User:</strong> {order.userName || "Unknown"}</p>
            <p><strong>Placed:</strong> {order.createdAt?.toDate().toLocaleString()}</p>
        <p><strong>Total:</strong> ${order.total?.toFixed(2)}</p>
      <h3>Items:</h3>
      <ul>
        {order.items?.map((item) => (
             <li key={item.id}>
            {item.title} - ${item.price} x {item.quantity}
          </li>
        ))
        }
      </ul>
      {order.status !== "Delivered" && (
        <button onClick={markAsDelivered}>Mark as Delivered</button>
      )}
        </div>
    );
};

export default OrderDetails;