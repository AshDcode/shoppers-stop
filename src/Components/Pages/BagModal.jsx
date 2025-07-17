import { toast } from "react-toastify";
import { useBag } from "../../context/BagContext"
import "./BagModal.css";
const BagModal = ({ onClose, onCheckout }) => {
    const { bagItems, setBagItems, removeFromBag } = useBag();

    const totalItems = bagItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalAmount = bagItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handleIncrease = (productId) => {
        const updated = bagItems.map(item =>
            item.id === productId ? {
                ...item, quantity: item.quantity + 1
            } : item);
        setBagItems(updated);
    }

    const handleDecrease = (productId) => {
        const updated = bagItems.map(item =>
            item.id === productId && item.quantity > 1
                ? { ...item, quantity: item.quantity - 1 }
                : item);
        setBagItems(updated)
    };

    const handleRemoveFromBag = (productId) => {
        removeFromBag(productId);
        toast.success("Item removed");
        console.log("Removing item with ID:", productId);
    };

    return (
        <div className="bag-modal-backdrop" onClick={onClose}>
            <div
                className="bag-modal-content"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="bag-title">
                <h2 id="bag-title" className="bag-title">Your Bag</h2>

                {bagItems.length === 0 ? (
                    <p className="bag-empty">Your Bag is Empty</p>
                ) : (
                    <>
                        <ul className="bag-items-list">
                            {bagItems.map((item) => (
                                <li className="bag-item" key={item.id}>
                                    {item.name} - ${item.price} * {item.quantity}
                                    <div className="bag-item-image">
                                        <img src={item.image} alt={item.title} width={60} height={60} />
                                    </div>
                                    <div className="bag-item-details">
                                        <p className="bag-item-title">{item.title}</p>
                                        <p className="bag-item-price">
                                            ${item.price.toFixed(2)}</p>
                                        <div className="bag-item-quantity">Qty:
                                            <button className="qty-btn"
                                                onClick={() => handleDecrease(item.id)}
                                                disabled={item.quantity <= 1}>
                                                -
                                            </button>
                                            {item.quantity}
                                            <button
                                                className="qty-btn"
                                                onClick={() => handleIncrease(item.id)}>
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <div className="bag-item-actions">
                                        <button className="remove-btn" onClick={() => handleRemoveFromBag(item.id)}>
                                            Remove
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="bag-summary">
                            <p>
                                <strong>Total Items:</strong>{totalItems}</p>
                            <p>
                                <strong>Total Amount:</strong>${totalAmount}</p>
                            <div className="bag-actions">
                                <button className="checkout-btn"
                                    onClick={onCheckout}>Checkout</button>
                                <button className="close-btn"
                                    onClick={onClose}>Close</button>
                            </div>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
};


export default BagModal;