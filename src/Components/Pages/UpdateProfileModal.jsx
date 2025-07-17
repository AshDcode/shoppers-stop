
import { useState, useEffect, useRef } from "react";
import { auth, db, storage } from "../../firebaseConfig";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { toast } from "react-toastify";
import "./UpdateProfileModal.css";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const UpdateProfileModal = ({ show, onClose, updateName }) => {
  const [userData, setUserData] = useState({
    displayName: "",
    phone: "",
    photoURL: "",
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!show) return;

    const fetchData = async () => {
      if (auth.currentUser) {
        const docSnap = await getDoc(doc(db, "users", auth.currentUser.uid));

        if (docSnap.exists()) {
          setUserData({
            displayName: docSnap.data().displayName || "",
            phone: docSnap.data().phone || "",
            photoURL: auth.currentUser.photoURL || ""
          });
        }
      }
    };
    fetchData();
  }, [show]);

  const handleChange = (e) => {
    setUserData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePhotoChange = (e) => {
    if (e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let photoURL = userData.photoURL;

      if (photoFile) {
        const storageRef = ref(storage, `profilePics/${auth.currentUser.uid}`);
        await uploadBytes(storageRef, photoFile);
        photoURL = await getDownloadURL(storageRef);
      }

      // Update Firestore
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        await updateDoc(userRef, {
          displayName: userData.displayName,
          phone: userData.phone,
          photoURL: photoURL,
        });
      } else {
        await setDoc(userRef, {
          displayName: userData.displayName,
          phone: userData.phone,
          photoURL,
          createdAt: serverTimestamp(),
        });
      }
      // Update Auth Profile
      await updateProfile(auth.currentUser, {
        displayName: userData.displayName,
        photoURL: photoURL,
      });

      updateName(userData.displayName);
      toast.success("Profile updated!");
      setLoading(false);
      handleClose();
    }
    catch (error) {
      console.error("update error", error);
      toast.error("Something went wrong updating your profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 300); // match the animation duration
  };

  if (!show) return null;

  return (
    <div className="modal-backdrop">
      <div className={`update-profile-modal ${closing ? "fade-out" : "fade-in"}`}>
        <button className="close-btn" onClick={handleClose}>
          &times;
        </button>
        <h2>Update Profile</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              name="displayName"
              value={userData.displayName}
              onChange={handleChange}
            />
          </label>
          <label>
            Phone:
            <input
              name="phone"
              value={userData.phone}
              onChange={handleChange}
            />
          </label>
          <label>
            Profile Picture:
            <input type="file" accept="image/*" onChange={handlePhotoChange} />
          </label>
          {userData.photoURL && (
            <img
              src={userData.photoURL}
              alt="Profile Preview"
              className="profile-preview"
            />
          )}
          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfileModal;
