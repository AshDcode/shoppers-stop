import { useNavigate } from "react-router-dom";
import "./PaymentPage.css";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { db, auth } from "../../firebaseConfig";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useBag } from "../../context/BagContext";

const PaymentPage = () => {
    const navigate = useNavigate();
    const { bagItems, clearBag } = useBag();
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState("");
    const [card, setCard] = useState("");
    const [expiry, setExpiry] = useState("");
    const [cvv, setCvv] = useState("");

    const totalAmount = bagItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    const handleCancel = () => {
        navigate(-1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic Validation
        if (card.length !== 16 || isNaN(Number(card))) {
            toast.error("Card number must be 16 digits.");
            return;
        }

        if (!/^\d{2}\/\d{2}$/.test(expiry)) {
            toast.error("Expiry must be in MM/YY format.");
            return;
        }

        if (cvv.length !== 3 || isNaN(Number(cvv))) {
            toast.error("CVV must be 3 digits.");
            return;
        }

        setLoading(true);

        // Save order to Firestore
        const orderData = {
            userId: auth.currentUser ? auth.currentUser.uid : "guest",
            userName: name,
            items: bagItems,
            total: bagItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
            status: "Pending",
            createdAt: serverTimestamp(),
            shipping: {
                name,
            },
        };

        try {
            // Save to Firestore
            const orderRef = await addDoc(collection(db, "orders"), orderData);

            toast.success("Payment Successful! Your order is placed.");
            clearBag();

            // Navigate to confirmation page with details
            navigate("/order-confirmation", {
                state: {
                    orderId: orderRef.id,
                    total: `$${totalAmount.toFixed(2)}`,
                    shipping: {
                        name,
                    },
                },
            });
        } catch (error) {
            console.error("Payment error:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="payment-container">
            <h2>Checkout</h2>
            <p className="total-amount">Total Amount: <strong>${totalAmount.toFixed(2)}</strong></p>
            <form className="payment-form" onSubmit={handleSubmit}>
                <label htmlFor="name">Name on the Card</label>
                <input
                    id="name"
                    type="text"
                    required
                    placeholder="John Doe"
                    value={name}
                    disabled={loading}
                    onChange={(e) => setName(e.target.value)}
                />

                <label htmlFor="card">Card Number</label>
                <input
                    id="card"
                    type="text"
                    inputMode="numeric"
                    maxLength="16"
                    required
                    value={card}
                    disabled={loading}
                    onChange={(e) => setCard(e.target.value)}
                    placeholder="1234 5678 9012 3456"
                />

                <div className="payment-row">
                    <div>
                        <label htmlFor="expiry">Expiry</label>
                        <input
                            id="expiry"
                            type="text"
                            placeholder="MM/YY"
                            required
                            value={expiry}
                            disabled={loading}
                            onChange={(e) => setExpiry(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="cvv">CVV</label>
                        <input
                            id="cvv"
                            type="password"
                            maxLength="3"
                            placeholder="123"
                            required
                            value={cvv}
                            disabled={loading}
                            onChange={(e) => setCvv(e.target.value)}
                        />
                    </div>
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? (
                        <span className="spinner"></span>
                    ) : (
                        "Pay Now"
                    )}
                </button>
                <button
                    type="button"
                    className="cancel-btn"
                    onClick={handleCancel}
                    disabled={loading}
                >
                    Cancel
                </button>
            </form>
        </div>
    );
};

export default PaymentPage;
