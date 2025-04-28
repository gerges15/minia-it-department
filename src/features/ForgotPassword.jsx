import React, { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add password reset logic here
        console.log("Password reset request for:", email);
        setIsSubmitted(true);
    };

    return (
        <div className="flex items-center justify-center h-screen w-screen  bg-[#f5f5f0]">
            <div className="w-full lg:w-1/2 p-6 md:p-12 flex items-center justify-center bg-white">
                <div className="w-full max-w-md">
                    {!isSubmitted ? (
                        <>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">Forgot password</h1>
                            <p className="text-gray-500 mb-8">
                                Enter your email and we'll send you a link to reset your password.
                            </p>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-5">
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full p-4 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7e57c2] transition-all"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full p-4 bg-[#7e57c2] text-white rounded-xl font-semibold mb-6 hover:bg-[#6a4aaa] transition-colors shadow-md"
                                >
                                    Reset password
                                </button>

                                <div className="text-center">
                                    <Link to="/login" className="text-[#7e57c2] hover:underline">
                                        Back to login
                                    </Link>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="text-center">
                            <div className="mb-6 flex justify-center">
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-12 w-12 text-green-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-4">Check your email</h1>
                            <p className="text-gray-500 mb-8">
                                We've sent a password reset link to
                                <br />
                                <span className="font-medium text-gray-700">{email}</span>
                            </p>
                            <p className="text-gray-500 mb-6">
                                Didn't receive the email? Check your spam folder or
                                <button onClick={handleSubmit} className="text-[#7e57c2] hover:underline ml-1">
                                    try again
                                </button>
                            </p>
                            <Link
                                to="/login"
                                className="block w-full p-4 bg-[#7e57c2] text-white rounded-xl font-semibold hover:bg-[#6a4aaa] transition-colors shadow-md text-center"
                            >
                                Back to login
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
