import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../../firebaseConfig";
import "./ManageUSers.css";

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUserId = auth.currentUser?.uid;

    useEffect(() => {
        const fetchUsers = async () => {
            const snapshot = await getDocs(collection(db, "users"));
            const usersData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(usersData);
            setLoading(false);
        };
        fetchUsers();
    }, []);

    const toggleAdmin = async (userId, isCurrentlyAdmin) => {
        const newRole = isCurrentlyAdmin ? "user" : "admin";
        try {
            await updateDoc(doc(db, "users", userId), { role: newRole });
            setUsers(prev =>
                prev.map(user =>
                    user.id === userId ? { ...user, role: newRole } : user
                )
            );
        } catch (error) {
            console.error("Error updating user role:", error);
        }
    };

    if (loading) return <p>Loading Users</p>;

    return (
        <div className="manage-users">
            <h2>Manage Users</h2>
            <table>
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Change Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name || user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                {user.id !== currentUserId && (
                                    <button
                                        onClick={() => toggleAdmin(user.id, user.role === "admin")}
                                    >
                                        {user.role === "admin" ? "Revoke Admin" : "Make Admin"}
                                    </button>
                                )}
                                {user.id === currentUserId && (
                                    <span style={{ color: "gray" }}>You</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageUsers;