import "./ProductDetails.css";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ReviewSection from "./ReviewSection";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { useBag } from "../../context/BagContext";
const ProductDetails = () => {

    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [userName, setUserName] = useState('');
    const { addToBag } = useBag();
    const reviewRef = collection(db, 'reviews');

    // const addReview = async (newReview) => {
    //     try {
    //         const fullReview = {
    //             ...newReview,
    //             productId: product.id
    //         };
    //         await addDoc(reviewRef, fullReview);
    //         setReviews(prev => [fullReview, ...prev]);
    //     } catch (error) {
    //         console.error("Error adding review:", error);
    //     }
    //     // setReviews(prev => [newReview, ...prev]);
    // };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`https://fakestoreapi.in/api/products/${id}`);
                const data = await response.json();
                setProduct(data.product);
                console.log(data);
                setLoading(false);
            } catch (error) {
                console.log("products not available", error);
            }
        };
        fetchProduct();
    }, [id])

    // fetch reviews when product loads
    useEffect(() => {
        // if(!product || typeof product.id !== 'string') return; //Early return
        if (!product || !product.id) return;

        const fetchReviews = async () => {
            try {
                const q = query(reviewRef, where('productId', '==', product.id));
                const querySnapshot = await getDocs(q);
                const reviewData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setReviews(reviewData);
            } catch (error) {
                console.log("Error fetching reviews", error);
            }
        };

        fetchReviews();

        console.log("fetchinf reviews for productId", product.id)
    }, [product]);

    if (loading || !product) { return <p>Loading.....</p>; }

    return (
        <div className="product-details-container">
            <div className="product-image">
                <img src={product.image} alt={product.title} />
            </div>
            <div className="product-info">
                <h2>{product.title}</h2>
                <p className="description"><strong>Description: </strong>{product.description}</p>
                <p className="category"><strong>Category: </strong>{product.category}</p>
                <p className="price"><strong>Price: $</strong>{product.price}</p>
                <button className="add-to-cart-btn" onClick={() => addToBag(product)}>
                    Add to Bag</button>
                {/* ratings and reviews */}
            </div>
            <Link to="/">Back to products</Link>

            <ReviewSection
                productId={product.id}
                reviews={reviews}
                setReviews={setReviews}
            />
        </div>
    );
}

export default ProductDetails;

// cart value indicator
//dark mode
// payment integration
// Product availability notification
// Admin Dashboard to manage users products orders
// customer support
// password reset functionality
// order history
// coupons and discounts
// product sorting