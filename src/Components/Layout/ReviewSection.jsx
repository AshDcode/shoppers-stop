import { useEffect, useState } from "react";
import "./ReviewSection.css"
import { toast } from "react-toastify";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

import { addDoc, collection, deleteDoc } from "firebase/firestore";
const ReviewSection = ({ reviews, setReviews, productId }) => {
    const [user, setUser] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [editingID, setEditingId] = useState(null);


    const reviewRef = collection(db, "reviews");

    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unSubscribe();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error("Please login to submit a review");
            return;
        }
        if (!rating || !comment.trim()) return;

        // check if this user already reviewed this product
        const existingReview = reviews.find(
            (r) => r.userId === user.uid && r.productId === productId
        );

        const reviewData = {
            // id: Date.now(),
            productId,
            userId: user.uid,
            name: user.displayName || user.email,
            rating,
            comment,
            date: new Date().toLocaleString()
        };

        try {
            if (editingID) {
                const docRef = doc(db, "reviews", editingID);
                await updateDoc(docRef, reviewData);
                setReviews(prev =>
                    prev.map(r => r.id === editingID ? {
                        id: editingID, ...reviewData
                    } : r)
                );
                toast.success("Review updated!");
                setEditingId(null);
            } else {
                // Prevent adding if already reviewed
                if (existingReview) {
                    toast.error("You’ve already reviewed this product. You can edit it.");
                    return;
                }

                // Add new review
                const docRef = await addDoc(reviewRef, reviewData);
                setReviews(prev => [{ id: docRef.id, ...reviewData }, ...prev]);
                toast.success("review submitted");
            }
            setRating(0);
            setComment("");
        } catch (error) {
            toast.error("something went wrong");
            console.log(error);
        }
    };

    const handleEdit = (review) => {
        setEditingId(review.id);
        setRating(review.rating);
        setComment(review.comment);
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, "reviews", id));
            setReviews(prev => prev.filter(r => r.id !== id));
            toast.success("review deleted");
        } catch (error) {
            toast.error("failed to delete review");
        }
    };

    return (
        <div className="review-section">
            <h3>Reviews</h3>
            {reviews.length === 0 && <p>No reviews yet</p>}

            {[...reviews]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((r) => (
                    <div key={r.id} className="review-card">
                        <div className="review-header">
                            <p>
                                <strong>{r.name}</strong> rated it {r.rating}
                            </p>
                            {user?.uid === r.userId && (
                                <div className="review-actions">
                                    <button onClick={() => handleEdit(r)}>Edit</button>
                                    <button onClick={() => handleDelete(r.id)}>Delete</button>
                                </div>
                            )}
                        </div>
                        <p>{r.comment}</p>
                        <span>{r.date}</span>
                    </div>
                ))}
            {user ? (
                <>
                    {editingID || !reviews.find(r => r.userId === user.uid && r.productId === productId) ? (

                        <form onSubmit={handleSubmit} className="review-form">
                            <h4>Leave a Review</h4>
                            <label>Rating:
                                <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                                    <option value="">Select...</option>
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <option key={star} value={star}>★</option>
                                    ))}
                                </select>
                            </label>
                            <textarea
                                placeholder="Your Experience with product"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                            <button type="submit">{editingID ? "Update" : "Submit"} Review</button>
                        </form>
                    ) : (
                        <p>You’ve already submitted a review. You can edit or delete it below.</p>
                    )}
                </>
            ) : (
                <p>Please login first to give a review.</p>
            )}
        </div>
    );
}

export default ReviewSection;