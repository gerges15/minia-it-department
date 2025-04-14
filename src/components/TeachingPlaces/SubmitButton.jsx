import React from "react";
import Spinner from "../Common/Spinner";

function SubmitButton({ isLoading, icon, children, className = "", disabled = false, ...props }) {
    const baseClasses =
        "w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 ease-in-out";
    const activeClasses = "bg-[#7e57c2] hover:bg-[#6a4aaa] focus:ring-[#7e57c2]";
    const loadingClasses = "bg-indigo-400 cursor-not-allowed";
    const disabledClasses = "disabled:opacity-50 disabled:cursor-not-allowed"; // Handles external disabled prop too

    const combinedClassName = `${baseClasses} ${
        isLoading ? loadingClasses : activeClasses
    } ${disabledClasses} ${className}`;

    return (
        <button type="submit" disabled={isLoading || disabled} className={combinedClassName} {...props}>
            {isLoading ? (
                <Spinner size="h-5 w-5" color="text-white" />
            ) : (
                <>
                    {icon && React.cloneElement(icon, { className: "h-5 w-5 mr-2" })}
                    {children}
                </>
            )}
        </button>
    );
}

export default SubmitButton;
