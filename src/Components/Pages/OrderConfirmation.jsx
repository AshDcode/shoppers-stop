import { Link, useLocation } from "react-router-dom";
import "./OrderConfirmation.css";

const OrderConfirmation = () => {
    const { state } = useLocation();

    if (!state) {
        return (
            <div className="order-confirmation">
                <div className="confirmation-card animate-pop">
                    <h2>🎉 Thank you for your order!</h2>
                    <p>Your payment was successful.</p>
                    <p>We are processing your order and will notify you when it ships.</p>
                    <Link to="/" className="back-home-btn">Continue Shopping</Link>
                </div>
            </div>
        );
    };

    const { orderId, total, shipping } = state;

    return (
        <div className="order-confirmation">
            <div className="confirmation-card animate-pop">
                <h2>🎉 Thank you for your order!</h2>
                <p>Your payment was successful.</p>

                <div className="order-details">
                    <h3>Order Summary</h3>
                    <p><strong>Order ID:</strong> {orderId}</p>
                    <p><strong>Total:</strong> {total}</p>
                    <h3>Shipping Information</h3>
                    <p><strong>Name:</strong> {shipping.name}</p>
                    <p><strong>Address:</strong> {shipping.address}</p>
                    <p><strong>Phone:</strong> {shipping.phone}</p>
                </div>

                <Link to="/" className="back-home-btn">Continue Shopping</Link>
            </div>
        </div>
    );

};
export default OrderConfirmation;
