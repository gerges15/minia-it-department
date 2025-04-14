import React from "react";
import { FiAlertCircle } from "react-icons/fi";

export default function ErrorMessage({ error }) {
    return (
        <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded-md text-sm text-red-700 flex items-center">
            <FiAlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
        </div>
    );
}
