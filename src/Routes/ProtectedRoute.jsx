import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import NotAllowed from "../Pages/NotAllowed";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = Cookies.get("access_token");
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    try {
        const decodedToken = jwtDecode(token);
        const userRole = decodedToken.role;

        if (allowedRoles.includes(userRole)) {
            return children;
        } else {
            return <NotAllowed />;
        }
    } catch (error) {
        // If token is invalid, redirect to login
        console.error("Invalid token:", error);
        Cookies.remove("access_token");
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
};

export default ProtectedRoute;
