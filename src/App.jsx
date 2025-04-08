import { useState } from "react";
import Error from "./Pages/Error";
import LoginPage from "./Pages/Login";
import SignupPage from "./Pages/SignUp";
import ForgotPasswordPage from "./Pages/ForgotPassword";
import { Route, Routes } from "react-router-dom";
import NotFound from "./Pages/NotFound";
import HomePage from "./Pages/HomePage";
import ExplorePage from "./Pages/Explore";

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/SignUp" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/" element={<HomePage />}>
                {/* Parent route using the layout */}
                {/* Child routes that render inside HomePageLayout's <Outlet /> */}
                {/* <Route index element={<DashboardPage />} /> Default page for "/" */}
                <Route path="explore" element={<ExplorePage />} />
                {/* <Route path="analytics" element={<AnalyticsPage />} /> */}
                {/* <Route path="settings" element={<SettingsPage />} /> */}
                {/* Add other routes that should use the sidebar layout here */}
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

export default App;
