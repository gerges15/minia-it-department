import { useState } from "react";
import Error from "./Pages/Error";
import LoginPage from "./Pages/Login";
import SignupPage from "./Pages/SignUp";
import ForgotPasswordPage from "./Pages/ForgotPassword";
import { Route, Routes } from "react-router-dom";

function App() {
    // <div className="relative w-full h-screen">
    //     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    //         <h1 className="font-poppins font-extrabold text-6xl"> Keep Waiting </h1>
    //     </div>
    // </div>
    // <LoginPage />
    // <SignupPage />
    // <Error />

    return (
        <Routes>
            <Route path="/" element={<Error />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/SignUp" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Routes>
    );
}

export default App;
