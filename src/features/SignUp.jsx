import React, { useState } from "react";
import { Link } from "react-router-dom";

const SignupPage = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add signup logic here
        console.log("Signup attempt:", { firstName, lastName, email, password, agreeTerms });
    };

    return (
        <div className="flex h-screen w-screen bg-[#f5f5f0]">
            <div className="flex w-full h-full">
                {/* Left Side */}
                <div className="w-1/2 relative overflow-hidden hidden lg:block">
                    <img
                        src="https://images.unsplash.com/photo-1682685794761-c8e7b2347702?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1500&q=80"
                        alt="Desert landscape"
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30"></div>
                </div>

                {/* Right Side */}
                <div className="w-full lg:w-1/2 p-6 md:p-12 flex items-center justify-center bg-white">
                    <div className="w-full max-w-md">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Create an account</h1>
                        <p className="text-gray-500 mb-8">
                            Already have an account?{" "}
                            <Link to="/login" className="text-[#7e57c2] hover:underline">
                                Log in
                            </Link>
                        </p>

                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col md:flex-row gap-4 mb-5">
                                <div className="w-full md:w-1/2">
                                    <input
                                        type="text"
                                        placeholder="First name"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                        className="w-full p-4 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7e57c2] transition-all"
                                    />
                                </div>
                                <div className="w-full md:w-1/2">
                                    <input
                                        type="text"
                                        placeholder="Last name"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                        className="w-full p-4 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7e57c2] transition-all"
                                    />
                                </div>
                            </div>

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

                            <div className="mb-5 relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full p-4 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7e57c2] transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                                >
                                    {showPassword ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                            />
                                        </svg>
                                    )}
                                </button>
                            </div>

                            <div className="mb-6 flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    checked={agreeTerms}
                                    onChange={(e) => setAgreeTerms(e.target.checked)}
                                    required
                                    className="w-5 h-5 accent-[#7e57c2]"
                                />
                                <label htmlFor="terms" className="text-gray-600 text-sm">
                                    I agree to the {/* <Link to="/terms" className="text-[#7e57c2] hover:underline"> */}
                                    Terms & Conditions
                                    {/* </Link> */}
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="w-full p-4 bg-[#7e57c2] text-white rounded-xl font-semibold mb-8 hover:bg-[#6a4aaa] transition-colors shadow-md"
                            >
                                Create account
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
