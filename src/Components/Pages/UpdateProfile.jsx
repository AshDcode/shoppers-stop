// import { useEffect, useState } from "react";
// import { auth, db, storage } from "../../firebaseConfig"
// import { doc, getDoc, updateDoc } from "firebase/firestore";
// import { updateEmail, updateProfile } from "firebase/auth";
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { toast } from "react-toastify";

// const UpdateProfile = () => {
//     const user = auth.currentUser;
//     const [profile, setProfile] = useState({
//         displayName: "",
//         email: "",
//         photoURL: "",
//     });
//     const [file, setFile] = useState(null);
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         if (user) {
//             // Load firestore profile

//             const fetchProfile = async () => {
//                 const snap = await getDoc(doc, (db, "users", user.id));
//                 if (snap.exists()) {
//                     setProfile({
//                         displayName: snap.data().displayName || "",
//                         email: snap.data().email || "",
//                         photoURL: snap.data().photoURL || "",
//                     });
//                 }
//             };
//             fetchProfile();
//         }
//     }, [user]);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         if (!user) return;
//         setLoading(true);

//         try {
//             let photoURL = profile.photoURL;

//             // Upload new photo if selected
//             if (file) {
//                 const storageRef = ref(storage, `profilePictures/${user.uid}`);
//                 await uploadBytes(storageRef, file);
//                 photoURL = await getDownloadURL(storageRef);
//             }

//             // Update Auth Profile
//             await updateProfile(user, {
//                 displayName: profile.displayName,
//                 photoURL,
//             });

//             // Update Auth Email
//             if (profile.email !== user.email) {
//                 await updateEmail(user, profile.email);
//             }

//             // Update Firestore
//             await updateDoc(doc(db, "users", user.uid), {
//                 displayName: profile.displayName,
//                 email: profile.email,
//                 photoURL,
//             });

//             toast.success("Profile updated!");
//         } catch (error) {
//             console.error("Update error:", error);
//             toast.error(error.message);
//         }
//         setLoading(false);
//     };

//     return (
//         <div className="update-profile">
//             <h2>Update Profile</h2>
//             <form onSubmit={handleSubmit}>
//                 <label>
//                     Name:
//                     <input
//                         type="text"
//                         value={profile.displayName}
//                         onChange={(e) =>
//                             setProfile({ ...profile, displayName: e.target.value })
//                         }
//                         required
//                     />
//                 </label>
//                 <label>
//                     Email:
//                     <input
//                         type="email"
//                         value={profile.email}
//                         onChange={(e) =>
//                             setProfile({ ...profile, email: e.target.value })
//                         }
//                         required
//                     />
//                 </label>
//                 <label>
//                     Profile Picture:
//                     <input
//                         type="file"
//                         accept="image/*"
//                         onChange={(e) => setFile(e.target.files[0])}
//                     />
//                 </label>
//                 {profile.photoURL && (
//                     <img
//                         src={profile.photoURL}
//                         alt="Profile"
//                         style={{ width: "100px", borderRadius: "50%", marginTop: "1rem" }}
//                     />
//                 )}
//                 <button type="submit" disabled={loading}>
//                     {loading ? "Updating..." : "Update Profile"}
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default UpdateProfile;
