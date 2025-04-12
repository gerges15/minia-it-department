// routes/PublicRoutes.jsx
import { Routes, Route } from "react-router-dom";
import LoginPage from "../Pages/Login";
import SignupPage from "../Pages/SignUp";
import ForgotPasswordPage from "../Pages/ForgotPassword";

function PublicRoutes() {
    return (
        <Routes>
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
        </Routes>
    );
}

export default PublicRoutes;
