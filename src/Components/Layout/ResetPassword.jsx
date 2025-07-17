import { useState } from "react"

export const ResetPassword = ({ onClose }) => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleReset = async (e) => {
        e.preventDefault();
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Password reset email sent! Check your inbox');
        } catch (error) {
            setMessage(error.message);
        }
    };
    return (
        <div className="password-reset-modal">
            <h2>Reset Password</h2>
            <form onSubmit={handleReset}>
                <input
                    type="email"
                    placeholder="Enter your Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </form>
            {message && <p>{message}</p>}
            <button onClick={onClose}>Close</button>
        </div>
    );
};