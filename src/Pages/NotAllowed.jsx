import React from "react";
import { Link } from "react-router-dom";

const NotAllowed = () => {
    return (
        <div className="flex items-center justify-center h-screen w-screen bg-[#f5f5f0]">
            <div className="w-full max-w-md text-center">
                {/* Using 403 as the common code for Forbidden/Not Allowed */}
                <h1 className="text-7xl font-bold text-[#7e57c2] mb-4">403</h1>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Access Denied</h2>
                <p className="text-gray-500 mb-8">
                    Sorry, you do not have the necessary permissions to access this page. Please contact an
                    administrator if you believe this is an error.
                </p>
                <Link
                    to="/" // Link still goes home, a safe fallback
                    className="inline-block w-full max-w-xs p-4 bg-[#7e57c2] text-white rounded-lg font-semibold hover:bg-[#6a4aaa] transition-colors shadow-md"
                >
                    Go Back Home
                </Link>
            </div>
        </div>
    );
};

export default NotAllowed;
