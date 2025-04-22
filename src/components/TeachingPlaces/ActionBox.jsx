import React from "react";
import { Link } from "react-router-dom";
const ActionBox = ({ to, icon: Icon, title, description, bgColor = "bg-white", iconColor = "text-blue-500" }) => {
    return (
        <Link
            to={to}
            className={`${bgColor} p-6 rounded-xl shadow-md border border-gray-200 hover:border-blue-300 transition duration-200 ease-in-out flex flex-col items-center text-center group`}
        >
            <Icon
                className={`h-12 w-12 ${iconColor} group-hover:text-fuchsia-500 mb-4 transition-all duration-200`}
                aria-hidden="true"
            />
            <h3 className="text-xl font-semibold text-gray-700 mb-2 group-hover:text-[#7e57c2]">{title}</h3>
            <p className="text-gray-500 text-sm">{description}</p>
        </Link>
    );
};

export default ActionBox;
