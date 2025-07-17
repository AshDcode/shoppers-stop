import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import Auth from "../Pages/Auth";
import { onAuthStateChanged } from "firebase/auth";

export default function AdminRoute({ children }) {
    const [user, setUser] = useState("");
    const [isAdmin, setIsAdmin] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                 console.log("CURRENT USER UID:", currentUser.uid); 
                setUser(currentUser);
                try {
                    const docSnap = await getDoc(doc(db, "users", currentUser.uid));
                    if (docSnap.exists()) {
                        const role = docSnap.data().role;
                        console.log("User Role:", role);
                        setIsAdmin(docSnap.data().role === "admin");
                        console.log("docSnap data", docSnap.data());

                    } else {
                        setIsAdmin(false);
                    }
                } catch (error) {
                    console.error("Error fetching user role:", error);
                    setIsAdmin(false);
                }

            } else {
                setUser(null);
                setIsAdmin(false);
            }
        });
        return () => unSubscribe();
    }, []);

    if (isAdmin === null) return <div>Checking permissions...</div>

    if (!user || !isAdmin) {
        return <Navigate to="/" replace state={{ from: location }} />;
    }

    return children;
}