import { addDoc, collection, deleteDoc, getDocs, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react"
import "./ManageProducts.css";
import { db } from "../../firebaseConfig";
import { toast } from "react-toastify";
const ManageProducts = () => {
    const [products, setProducts] = useState([]);
    const [FormData, setFormData] = useState({
        id: "", title: "", price: "", description: ""
    });
    const [editing, setEditing] = useState(false);
    const colRef = collection(db, "products");

    useEffect(() => {
        const fetchProducts = async () => {
            const productsRef = collection(db, "products");
            const snapshot = await getDocs(productsRef);
            const productList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setProducts(productList);
        };
        fetchProducts();
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editing) {
            const docRef = doc(db, "products", FormData.id);
            await updateDoc(docRef, FormData);
        } else {
            await addDoc(colRef, FormData);
        }
        setFormData({ id: "", title: "", price: "", description: "" });
        setEditing(false);
        toast.success("Product Data Created");
    }

    const handleChange = e => setFormData({ ...FormData, [e.target.name]: e.target.value });
    // const handleDelete = async (id) => {
    //     await deleteDoc(doc(db, "products", id));
    //     setProducts(prev => prev.filter(p => p.id !== id));
    // };



    return (
        <div className="admin-manage">
            <h2>Manage Products</h2>
            <form onSubmit={handleSubmit} className="admin-form">
                <input name="title" value={FormData.title} onChange={handleChange} placeholder="Title" />
                <input name="price" value={FormData.price} onChange={handleChange} placeholder="Price" />
                <textarea name="description" value={FormData.description} onChange={handleChange} placeholder="Desciption" />
                <button type="submit">{editing ? "Update" : "Add"} Product </button>
            </form>

            <ul className="admin-list">
                {products.map(p => (
                    <li key={p.id}>
                        <strong>{p.title}</strong> -₹{p.price}
                        <button onClick={() => { setEditing(true); setFormData(p); }}>Edit</button>
                        <button onClick={() => deleteDoc(doc(db, "products", p.id))}>Delete</button>
                    </li>
                ))}
            </ul>
        </div >
    );
};

export default ManageProducts;