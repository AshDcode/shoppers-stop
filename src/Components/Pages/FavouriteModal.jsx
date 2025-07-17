import { toast } from "react-toastify";
import { useBag } from "../../context/BagContext";
import { useFavourites } from "../../context/FavouritesContext"
import "./Favourites.css";
const FavouriteModal = ({ onClose }) => {

    const { favourites, removeFromFavourites } = useFavourites();
    const { addToBag } = useBag();

    const moveToBag = (product) => {
        addToBag(product);
        removeFromFavourites(product.id);
        toast.success("Moved to Bag", { position: "top-center" })
    };

    const handleRemove = (id) => {
        removeFromFavourites(id);
        toast.info("Removed from Wishlist!", { position: "top-center" });
    };

    return (
        <div className="favourites-backdrop">
            <div className="favourites-content">
                <h2>Your WishList</h2>
                <button className="close-btn" onClick={onClose}>Close</button>
                {favourites.length === 0 ? (
                    <div className="empty-favourites">
                        No Favourite Product yet!
                    </div>
                ) : (
                    <div className="favourites-grid">
                        {favourites.map((item) => (
                            <div key={item.id} className="favourites-card">
                                <img src={item.image} alt={item.title} />
                                <h4>{item.title}</h4>
                                <p>${item.price}</p>
                                <div className="card-buttons">
                                    <button className="remove-btn" onClick={() => handleRemove(item.id)}>
                                        Remove
                                    </button>
                                    <button className="move-btn" onClick={() => moveToBag(item)}>
                                        Move To Bag
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FavouriteModal;