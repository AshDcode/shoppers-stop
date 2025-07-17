import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup
} from "firebase/auth";

//Sign Up function
export const signUp = async (email, password) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create Firestore profile if not exists
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
            await setDoc(userRef, {
                email: user.email,
                role: "user"
            });
        }

        return user;
    } catch (error) {
        console.error("Sign Up Error:", error.message);
        throw error;
    }
};

//Login Function
export const login = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Login Successful");
        return userCredential.user;
    }
    catch (error) {
        console.error("Login Error:", error.message);
        alert(error.message);
        throw error;
    }
};

//Logout Function
export const logout = async () => {
    try {
        await signOut(auth);
        console.log("User logged out");
    } catch (error) {
        console.error("Logout error:", error.message);
    }
};

//Google Sign-In
export const googleSignIn = async () => {
    try {
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        const user = userCredential.user;


        // Create Firestore profile if not exists
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        if (!snap.exists()) {
            await setDoc(userRef, {
                email: user.email,
                role: "user"
            });
        }

        return user;
    } catch (error) {
        console.error("Google Sign-In Error:", error.message);
        throw error;
    }
};