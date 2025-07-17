
import { useNavigate } from "react-router-dom";
import "./ErrorPage.css";

export const ErrorPage = () => {
    const navigate = useNavigate();
    return (
        <div className="error-page">
            <h1>404 - Page Not Found</h1>
            <p>Sorry, we couldn't find what you were looking for.</p>
            <button onClick={() => navigate("/")}>Go Home</button>
        </div>
    );
};
